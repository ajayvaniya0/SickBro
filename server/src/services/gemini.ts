import { GoogleGenAI } from '@google/genai';
import { HEALTH_SYSTEM_PROMPT } from '../prompts/healthPrompt.js';
import { evaluateHealthSafety } from '../safety/healthSafety.js';

export interface ChatMessageHistory {
  role: 'user' | 'model' | 'assistant';
  content?: string;
  text?: string;
  parts?: Array<{ text: string }> | string;
}

export class GeminiService {
  private client: GoogleGenAI | null = null;
  private primaryModel = 'gemini-3.8-flash';
  private fallbackModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  constructor() {
    this.refreshClient();
  }

  private refreshClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    } else {
      this.client = null;
    }
    return this.client;
  }

  /**
   * Generates a personalized health awareness response using Gemini
   */
  async generateHealthResponse(
    message: string,
    rawHistory: ChatMessageHistory[] = []
  ): Promise<string> {
    // 1. Health & Safety Guardrail Check
    const safetyCheck = evaluateHealthSafety(message);
    if (safetyCheck.isEmergency && safetyCheck.emergencyResponse) {
      return safetyCheck.emergencyResponse;
    }

    const client = this.refreshClient();

    // 2. Fallback if API key is not yet configured
    if (!client) {
      return this.generateSimulatedResponse(message, safetyCheck.isDiagnosisRequest);
    }

    // 3. Format history for Gemini API
    const formattedContents: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = [];

    // Append prior conversational history (bounded to last 10 messages for speed & context)
    const recentHistory = rawHistory.slice(-10);
    for (const item of recentHistory) {
      const role: 'user' | 'model' =
        item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
      
      let text = '';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (typeof item.text === 'string') {
        text = item.text;
      } else if (Array.isArray(item.parts)) {
        text = item.parts.map((p) => (typeof p === 'string' ? p : p.text || '')).join(' ');
      } else if (typeof item.parts === 'string') {
        text = item.parts;
      }

      if (text.trim()) {
        formattedContents.push({
          role,
          parts: [{ text: text.trim() }],
        });
      }
    }

    // Append current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // 4. Call Gemini API with fallback redundancy
    const modelsToTry = [this.primaryModel, ...this.fallbackModels];

    for (const modelName of modelsToTry) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: HEALTH_SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        });

        if (response.text) {
          return response.text.trim();
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.warn(`[GeminiService] Model ${modelName} warning:`, errorMessage);

        // If this was the last model in the list, rethrow safely
        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          console.error('[GeminiService] All model attempts failed.');
          throw new Error('Unable to generate health response at this time. Please try again in a moment.', { cause: err });
        }
      }
    }

    throw new Error('No response received from health assistant service.');
  }

  /**
   * Safe educational fallback when testing without live API keys
   */
  private generateSimulatedResponse(message: string, isDiagnosisRequest: boolean): string {
    const lower = message.toLowerCase();

    // Direct diagnosis safeguard in fallback mode
    if (isDiagnosisRequest || lower.includes('diagnos') || lower.includes('do i have') || lower.includes('is this diabetes')) {
      return `### 🛡️ Health Education Notice

I cannot diagnose illnesses or evaluate personal clinical conditions—only a licensed doctor or medical provider can perform medical evaluations.

**General Education & SDG 3 Guidance:**
- Symptoms like increased thirst, fatigue, or frequent urination can have multiple metabolic or lifestyle causes.
- Healthcare providers typically perform simple diagnostic lab tests (such as an A1C or fasting blood glucose test) to assess health accurately.

If you are experiencing persistent or unusual symptoms, please schedule an appointment with a healthcare professional.

Would you like to explore balanced nutrition or hydration habits that support general metabolic wellness?`;
    }

    // 7-day plan request
    if (lower.includes('7-day plan') || lower.includes('7 day plan') || lower.includes('plan for me')) {
      return `🌙 **YOUR 7-DAY WELLNESS & SLEEP PLAN**

**Goal:** Establish a consistent, restful evening rhythm with small sustainable tweaks.

- **Day 1:** Pick a fixed bedtime and stick to it tonight.
- **Day 2:** Power down digital screens 45 minutes before sleep.
- **Day 3:** Cut off caffeine after 2:00 PM.
- **Day 4:** Introduce a 5-minute relaxing stretch or reading routine.
- **Day 5:** Optimize your bedroom environment (cool, dark, and quiet).
- **Day 6:** Maintain your sleep schedule over the weekend.
- **Day 7:** Review which habits made you feel most refreshed and continue them.

*Takeaway: Focus on one or two habits at a time rather than trying to change everything at once.*`;
    }

    if (lower.includes('sleep')) {
      return `Let's understand your routine first. I can't diagnose sleep problems, but I can help you explore common lifestyle factors and build restful habits. 🌙

To help personalize your guidance:
1. **About how many hours do you usually sleep each night?**
2. **Do you usually use your phone or computer screen in the 60 minutes before bed?**
3. **Is your wake-up time fairly consistent throughout the week?**

Share your routine and we'll craft your customized 7-Day Sleep Plan!`;
    }

    if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('food') || lower.includes('eat')) {
      return `Welcome to your Nutrition & Mindful Eating Coach! 🥗

Under UN SDG 3, nourishing your body with balanced whole foods is a cornerstone of long-term vitality.

Let's personalize your coaching:
1. **What is your primary nutrition goal (more energy, balanced meals, or reducing processed snacks)?**
2. **How many meals do you typically cook or prepare at home per week?**
3. **Do you currently eat a regular breakfast or follow a structured meal rhythm?**`;
    }

    if (lower.includes('activity') || lower.includes('exercise') || lower.includes('workout') || lower.includes('walk')) {
      return `Welcome to your Physical Activity & Movement Coach! 🏃

Regular daily movement strengthens cardiovascular health and uplifts mood. Let's find habits that feel energizing rather than exhausting:

1. **How many days per week are you currently able to fit in movement?**
2. **What activities do you enjoy most (e.g., brisk walking, bodyweight strength, cycling, stretching)?**
3. **Do you spend long stretches of your day sitting?**`;
    }

    if (lower.includes('hydration') || lower.includes('water')) {
      return `Welcome to your Hydration Coach! 💧

Proper hydration maintains cognitive focus, supports joint health, and aids digestion.

1. **About how many glasses or bottles of water do you drink on a typical day?**
2. **Do you find yourself forgetting to drink water while working or studying?**
3. **Would a morning hydration anchor (a glass right after waking up) fit your routine?**`;
    }

    if (lower.includes('well-being') || lower.includes('stress') || lower.includes('relax') || lower.includes('mind')) {
      return `Welcome to your Mental Well-being & Stress Management Coach! 🧘

Sustainable wellness includes cultivating calm and emotional resilience.

1. **What are the main daily factors that cause you stress or mental fatigue?**
2. **Do you currently have a daily decompression habit (e.g. mindfulness, walks, journaling)?**
3. **How much unstructured personal downtime do you have in the evenings?**`;
    }

    if (lower.includes('habit')) {
      return `Welcome to Healthy Habits Coaching! 🌱

Atomic, small shifts compound into lifelong health. The secret is anchoring new habits onto existing routines.

1. **What is one small habit you'd love to make effortless every single day?**
2. **What time of day does this habit best fit (morning, afternoon, or evening)?**
3. **What is the main obstacle you've encountered with consistency in the past?**`;
    }

    return `Hello! I'm **SickBro**, your personal health-awareness and healthy-lifestyle coach. 🧠🌱

I'm here to support you with practical, sustainable daily habits across:
- 😴 **Better Sleep**
- 🥗 **Nutritious Eating**
- 🏃 **Physical Movement**
- 💧 **Optimal Hydration**
- 🧘 **Stress & Well-being**

What health goal would you like to explore today?`;
  }
}

export const geminiService = new GeminiService();

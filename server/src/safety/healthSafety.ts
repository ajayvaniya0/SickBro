/**
 * Health Safety & Guardrails Utility for SickBro
 */

export interface SafetyCheckResult {
  isEmergency: boolean;
  isDiagnosisRequest: boolean;
  emergencyResponse?: string;
  sanitizedMessage: string;
}

// Critical emergency indicators that require immediate medical dispatch advice
const EMERGENCY_PATTERNS = [
  /\b(chest pain|heart attack|crushing chest|chest tightness with pain)\b/i,
  /\b(can'?t breathe|unable to breathe|severe shortness of breath|suffocating|choking)\b/i,
  /\b(sudden numbness|facial drooping|slurred speech|stroke symptoms|can'?t move my arm)\b/i,
  /\b(suicide|kill myself|want to die|end my life|self-harm|overdose)\b/i,
  /\b(coughing blood|vomiting blood|heavy bleeding|gushing blood)\b/i,
  /\b(anaphylaxis|throat closing|severe allergic reaction)\b/i,
  /\b(seizure|unconscious|passed out and not waking)\b/i,
];

// Patterns inquiring directly for medical diagnosis
const DIAGNOSIS_PATTERNS = [
  /\b(do i have|could i have|am i suffering from|diagnose me|what disease do i have)\b/i,
  /\b(is this (cancer|diabetes|asthma|covid|hypertension|pneumonia|appendicitis))\b/i,
  /\b(prescribe|what medication should i take|dosage for|how many pills)\b/i,
];

export function evaluateHealthSafety(message: string): SafetyCheckResult {
  const sanitized = message.trim();

  // 1. Check for critical emergency
  const isEmergency = EMERGENCY_PATTERNS.some((pattern) => pattern.test(sanitized));

  if (isEmergency) {
    return {
      isEmergency: true,
      isDiagnosisRequest: false,
      sanitizedMessage: sanitized,
      emergencyResponse: `🚨 **IMPORTANT MEDICAL NOTICE**

The symptoms or situation you described may require immediate, urgent medical attention.

Please contact emergency medical services right away:
- **United States / Canada:** Call **911** (or **988** for Mental Health/Crisis Lifeline)
- **United Kingdom:** Call **999** or **111**
- **European Union / India:** Call **112**
- **Worldwide:** Contact your local emergency emergency department or hospital immediately.

*SickBro is an educational AI wellness assistant and cannot provide emergency medical intervention or acute care.*`,
    };
  }

  // 2. Check for diagnosis or prescription request
  const isDiagnosisRequest = DIAGNOSIS_PATTERNS.some((pattern) => pattern.test(sanitized));

  return {
    isEmergency: false,
    isDiagnosisRequest,
    sanitizedMessage: sanitized,
  };
}

export function sanitizeUserInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().slice(0, 2000); // Reasonable limit for chat message
}

import { Router, Request, Response } from 'express';
import { geminiService, ChatMessageHistory } from '../services/gemini.js';
import { sanitizeUserInput } from '../safety/healthSafety.js';

export const chatRouter = Router();

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
}

chatRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body as ChatRequestBody;

    // 1. Validation: check message existence and type
    if (!message || typeof message !== 'string') {
      res.status(400).json({
        error: 'Invalid request: "message" string is required and cannot be empty.',
      });
      return;
    }

    const sanitizedMessage = sanitizeUserInput(message);
    if (!sanitizedMessage) {
      res.status(400).json({
        error: 'Invalid request: "message" cannot contain only whitespace.',
      });
      return;
    }

    // 2. Validate history if provided
    let parsedHistory: ChatMessageHistory[] = [];
    if (Array.isArray(history)) {
      parsedHistory = history.filter(
        (item) => item && typeof item === 'object' && ('content' in item || 'text' in item || 'parts' in item)
      ) as ChatMessageHistory[];
    }

    // 3. Generate response via Gemini Service
    const assistantResponse = await geminiService.generateHealthResponse(
      sanitizedMessage,
      parsedHistory
    );

    // 4. Return standard JSON response
    res.status(200).json({
      response: assistantResponse,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Chat API Error]', errorMessage);

    // Never leak stack traces or internal secrets
    res.status(500).json({
      error: 'An error occurred while processing your health coaching request. Please try again.',
    });
  }
});

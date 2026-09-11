export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface HealthGoal {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  initialPrompt: string;
  gradient: string;
  accentColor: string;
}

export interface ChatRequestPayload {
  message: string;
  history?: Array<{
    role: 'user' | 'model' | 'assistant';
    content?: string;
  }>;
}

export interface ChatResponsePayload {
  response: string;
  error?: string;
}

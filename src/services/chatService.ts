import type { ChatMessage, ChatResponsePayload } from '../types/chat';

// Base endpoint (defaults to proxy /chat or direct localhost:5000/chat)
const API_URL = '/chat';

export async function sendMessageToBackend(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
    content: msg.content,
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        history: formattedHistory,
      }),
    });

    const data = (await response.json()) as ChatResponsePayload;

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    if (!data.response) {
      throw new Error('Received empty response from health assistant.');
    }

    return data.response;
  } catch (error: unknown) {
    console.error('[chatService] Fetch error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Could not connect to the SickBro server. Please check your network.', { cause: error });
  }
}

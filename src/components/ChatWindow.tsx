import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat';
import { MessageBubble } from './MessageBubble';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onRetryLastMessage?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onRetryLastMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto overflow-y-auto px-2 sm:px-4 py-4 space-y-3">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onRetry={message.isError ? onRetryLastMessage : undefined}
        />
      ))}

      {isLoading && <LoadingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

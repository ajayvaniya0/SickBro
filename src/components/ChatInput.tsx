import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const QUICK_SUGGESTIONS = [
  '🌙 Create a 7-Day Plan for me',
  '🥗 Simple healthy habits to start today',
  '🏃 How to stay consistent without burnout?',
  '💧 Best ways to drink more water daily',
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  hasMessages,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto resize textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Quick suggestions when in conversation */}
      {hasMessages && !isLoading && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-2">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Suggestions:
          </span>
          {QUICK_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(suggestion)}
              className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 whitespace-nowrap transition-colors border border-neutral-200/60 dark:border-neutral-700/60 cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-white dark:bg-[#18191e] border border-neutral-300 dark:border-neutral-700 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 rounded-2xl p-2 shadow-sm transition-all duration-200"
      >
        <label htmlFor="chat-message-input" className="sr-only">
          Type your health coaching question
        </label>
        <textarea
          id="chat-message-input"
          ref={textareaRef}
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask SickBro about sleep, nutrition, habits, or your 7-day plan..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-3 py-1.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none max-h-32 leading-relaxed"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`shrink-0 p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
            input.trim() && !isLoading
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
          }`}
          title="Send message (Enter)"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-neutral-400 dark:text-neutral-500">
        <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
        <span>SickBro SDG 3 Coach</span>
      </div>
    </div>
  );
};

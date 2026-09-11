import React from 'react';
import type { ChatMessage } from '../types/chat';
import { HeartPulse, User, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom formatted text renderer for structured health coaching plans and lists
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // 1. Emergency / Medical Alert
      if (trimmed.includes('🚨') || trimmed.includes('IMPORTANT MEDICAL NOTICE')) {
        return (
          <div
            key={idx}
            className="my-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 font-medium text-sm"
          >
            {renderInlineMarkdown(line)}
          </div>
        );
      }

      // 2. 7-Day Plan Headers (e.g., 🌙 YOUR 7-DAY SLEEP PLAN)
      if (
        trimmed.startsWith('🌙') ||
        trimmed.startsWith('🥗') ||
        trimmed.startsWith('🏃') ||
        trimmed.startsWith('💧') ||
        trimmed.startsWith('🧘') ||
        trimmed.startsWith('🌱') ||
        trimmed.includes('YOUR 7-DAY')
      ) {
        return (
          <div
            key={idx}
            className="my-3 py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold text-base tracking-tight"
          >
            {renderInlineMarkdown(line)}
          </div>
        );
      }

      // 3. Day 1 - Day 7 Step Blocks
      const dayMatch = trimmed.match(/^(Day\s+[1-7]:?|\*\*Day\s+[1-7]:?\*\*)/i);
      if (dayMatch) {
        return (
          <div
            key={idx}
            className="my-1.5 pl-3 border-l-2 border-emerald-500 text-sm leading-relaxed"
          >
            {renderInlineMarkdown(line)}
          </div>
        );
      }

      // 4. Bullet Points (- or * or numbered 1., 2.)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-sm leading-relaxed">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 select-none">
              •
            </span>
            <span className="flex-1">{renderInlineMarkdown(line.replace(/^[-*]\s+|\d+\.\s+/, ''))}</span>
          </div>
        );
      }

      // 5. Standard line
      return (
        <p key={idx} className="my-1 text-sm leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper for bold and italic markdown rendering
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-neutral-900 dark:text-neutral-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-neutral-700 dark:text-neutral-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono text-emerald-700 dark:text-emerald-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5 max-w-2xl ml-auto px-4 py-2 group">
        <div className="flex flex-col items-end">
          <div className="bg-neutral-900 dark:bg-emerald-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm text-sm leading-relaxed">
            {message.content}
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 mr-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-200 shrink-0 mb-4">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 max-w-3xl mr-auto px-4 py-2 group">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/10">
        <HeartPulse className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
            SickBro Coach
            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              AI Guide
            </span>
          </span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-opacity p-1 rounded"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div
          className={`rounded-2xl rounded-tl-sm px-4 py-3 border text-neutral-800 dark:text-neutral-200 shadow-xs ${
            message.isError
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300'
              : 'bg-white dark:bg-[#18191e] border-neutral-200/80 dark:border-neutral-800'
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-medium text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Connection Notice</span>
            </div>
          )}

          <div className="text-neutral-800 dark:text-neutral-200">
            {renderFormattedContent(message.content)}
          </div>

          {message.isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Message</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 ml-1 inline-block">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

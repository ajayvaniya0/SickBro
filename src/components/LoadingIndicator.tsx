import React from 'react';
import { HeartPulse } from 'lucide-react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 max-w-3xl mr-auto px-4 py-2 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/10">
        <HeartPulse className="w-4 h-4 animate-pulse" />
      </div>

      <div className="bg-white dark:bg-[#1c1d24] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
        <div className="flex items-center gap-1.5 h-5">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-2 font-medium">
            SickBro is thinking
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

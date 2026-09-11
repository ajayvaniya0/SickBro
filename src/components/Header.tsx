import React from 'react';
import { Sparkles, RotateCcw, HeartPulse } from 'lucide-react';

interface HeaderProps {
  hasMessages: boolean;
  onResetChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasMessages, onResetChat }) => {
  return (
    <header className="w-full bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-50">
                SickBro
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                SDG 3 Health Coach
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:block">
              Your everyday health awareness & lifestyle coach
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {hasMessages && (
            <button
              onClick={onResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700"
              title="Start a new health topic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Topic</span>
            </button>
          )}

          <div className="text-right">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

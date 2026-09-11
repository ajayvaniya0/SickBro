import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SafetyNotice: React.FC = () => {
  return (
    <aside aria-label="Medical Disclaimer" className="w-full max-w-3xl mx-auto px-4 py-2 text-center">
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          <strong>Health Safety Notice:</strong> SickBro provides general health education and lifestyle guidance. It does not diagnose medical conditions or provide emergency medical treatment.
        </span>
      </div>
    </aside>
  );
};

import React from 'react';
import { HEALTH_GOALS } from '../constants/healthGoals';
import { Moon, Apple, Activity, Droplets, Smile, Sprout, ArrowRight } from 'lucide-react';

interface GoalCardsProps {
  onSelectGoal: (prompt: string) => void;
  disabled?: boolean;
}

export const GoalCards: React.FC<GoalCardsProps> = ({ onSelectGoal, disabled }) => {
  const getGoalIcon = (id: string) => {
    switch (id) {
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'nutrition':
        return <Apple className="w-5 h-5 text-emerald-500" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-amber-500" />;
      case 'hydration':
        return <Droplets className="w-5 h-5 text-cyan-500" />;
      case 'wellbeing':
        return <Smile className="w-5 h-5 text-rose-500" />;
      case 'habits':
        return <Sprout className="w-5 h-5 text-teal-500" />;
      default:
        return <Sprout className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-3 border border-neutral-200/80 dark:border-neutral-700/80">
          <span>🎯 SDG 3 Targeted Wellness</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
          What would you like to improve?
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
          Choose a foundational wellness pillar to begin your personalized health coaching journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEALTH_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => !disabled && onSelectGoal(goal.initialPrompt)}
            disabled={disabled}
            className={`group text-left p-5 rounded-2xl bg-white dark:bg-[#18191e] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {/* Background subtle tint on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div>
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-2xl" role="img" aria-label={goal.title}>
                  {goal.emoji}
                </span>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {getGoalIcon(goal.id)}
                </div>
              </div>

              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 mb-1 relative z-10">
                {goal.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed relative z-10">
                {goal.tagline}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">
              <span>Start Coaching</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

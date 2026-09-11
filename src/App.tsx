import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { GoalCards } from './components/GoalCards';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { SafetyNotice } from './components/SafetyNotice';
import type { ChatMessage } from './types/chat';
import { sendMessageToBackend } from './services/chatService';
import { HeartPulse, CheckCircle2, Shield, CalendarCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setLastUserMessage(text.trim());
      setIsLoading(true);

      try {
        const assistantReply = await sendMessageToBackend(text.trim(), messages);

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant',
          content: assistantReply,
          timestamp: new Date(),
        };

        setMessages([...updatedMessages, assistantMsg]);
      } catch (err: unknown) {
        const errText =
          err instanceof Error
            ? err.message
            : 'Unable to connect to the health coach assistant. Please try again.';

        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errText,
          timestamp: new Date(),
          isError: true,
        };

        setMessages([...updatedMessages, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSelectGoal = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleResetChat = () => {
    setMessages([]);
    setLastUserMessage('');
    setIsLoading(false);
  };

  const handleRetryLastMessage = () => {
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header hasMessages={hasMessages} onResetChat={handleResetChat} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col justify-center py-6 px-4">
            {/* Hero Brand Section */}
            <div className="text-center max-w-2xl mx-auto mb-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-800/80">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
                <span>UN SDG 3: Good Health and Well-Being</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-3">
                Small steps. Better habits.{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  A healthier you.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
                Your everyday health awareness coach. Learn actionable habits, personalize your daily routines, and build simple 7-day plans.
              </p>

              {/* Value Pill Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Personalized Guidance
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-teal-500" />
                  Actionable 7-Day Plans
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-500" />
                  Safe & Non-Diagnostic
                </span>
              </div>
            </div>

            {/* Interactive Goal Cards Grid */}
            <GoalCards onSelectGoal={handleSelectGoal} disabled={isLoading} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden min-h-[60vh]">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onRetryLastMessage={handleRetryLastMessage}
            />
          </div>
        )}

        {/* Input & Safety Notice Area */}
        <div className="sticky bottom-0 bg-[#fafafa]/90 dark:bg-[#0d0e12]/90 backdrop-blur-md pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            hasMessages={hasMessages}
          />
          <SafetyNotice />
        </div>
      </main>
    </div>
  );
};

export default App;

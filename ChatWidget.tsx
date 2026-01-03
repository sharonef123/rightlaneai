
import React, { useState, useEffect, useRef } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { RightCard } from '../types';
import SheliAvatar from './SheliAvatar';

interface ChatWidgetProps {
  reportContext?: RightCard[];
  activeRight?: RightCard | null;
  externalTriggerMessage?: string | null;
  onClearActiveRight?: () => void;
  onClearTriggerMessage?: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  reportContext, 
  activeRight, 
  externalTriggerMessage,
  onClearActiveRight, 
  onClearTriggerMessage 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    {role: 'assistant', text: 'שלום! אני שלי, המלווה האישית שלך. איך אני יכולה לעזור לך למצות את הזכויות שלך היום?'}
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle active right focus
  useEffect(() => {
    if (activeRight) {
      setIsOpen(true);
      const introText = `אני רואה שאת/ה מעוניין/ת במידע על "${activeRight.title}" של ${activeRight.authority}. זו זכות חשובה מאוד! במה נוכל להתקדם?`;
      setMessages(prev => [...prev, {role: 'assistant', text: introText}]);
      onClearActiveRight?.();
    }
  }, [activeRight]);

  // Handle external trigger messages (tooltips/info buttons)
  useEffect(() => {
    if (externalTriggerMessage) {
      setIsOpen(true);
      handleTriggeredMessage(externalTriggerMessage);
      onClearTriggerMessage?.();
    }
  }, [externalTriggerMessage]);

  const handleTriggeredMessage = async (msg: string) => {
    setMessages(prev => [...prev, {role: 'user', text: msg}]);
    setIsLoading(true);
    const response = await getGeminiResponse(msg, reportContext);
    setMessages(prev => [...prev, {role: 'assistant', text: response || ''}]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setIsLoading(true);
    const response = await getGeminiResponse(userMsg, reportContext);
    setMessages(prev => [...prev, {role: 'assistant', text: response || ''}]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end no-print">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[450px] h-[650px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-4">
              <SheliAvatar size="sm" isTalking={isLoading} />
              <div>
                <p className="font-black text-lg">שלי</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isLoading ? 'מעבדת מידע...' : 'זמינה עבורך'}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors text-xl">✕</button>
          </div>
          <div className="flex-grow overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/20" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-[2rem] rounded-tl-none animate-pulse flex items-center gap-3">
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">שלי חושבת...</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="איך אני יכולה לעזור?" 
                className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none dark:text-white transition-all border-2 border-transparent focus:border-blue-500/50" 
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()} 
                className="bg-slate-900 dark:bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center disabled:opacity-50 shadow-lg hover:scale-105 active:scale-95 transition-all text-xl"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="group relative w-20 h-20 bg-blue-600 text-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 transition-all active:scale-95 ring-4 ring-white dark:ring-slate-800"
      >
        <div className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-bounce group-hover:scale-110 transition-transform">יש לי טיפ!</div>
        <SheliAvatar size="md" isTalking={isOpen} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};

export default ChatWidget;

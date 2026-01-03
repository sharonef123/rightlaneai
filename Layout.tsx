
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
}

const Logo = () => (
  <div className="flex items-center gap-4">
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Intricate Maze Background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-80 dark:opacity-100">
        <defs>
          <linearGradient id="mazeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Maze Pattern (Simplified Representation of the Image) */}
        <path 
          d="M50 5 A45 45 0 1 1 49.9 5 M50 15 A35 35 0 1 0 50.1 15 M50 25 A25 25 0 1 1 49.9 25" 
          fill="none" 
          stroke="url(#mazeGradient)" 
          strokeWidth="1.5" 
          strokeDasharray="4 2"
          className="animate-[spin_40s_linear_infinite]"
        />
        <path 
          d="M50 10 L50 20 M80 50 L90 50 M50 80 L50 90 M10 50 L20 50 M28 28 L35 35 M72 72 L65 65 M28 72 L35 65 M72 28 L65 35" 
          stroke="url(#mazeGradient)" 
          strokeWidth="1.5"
        />
        
        {/* Shield at Top */}
        <g transform="translate(42, 5)" filter="url(#glow)">
          <path d="M0 2 L8 0 L16 2 V8 C16 12 12 15 8 16 C4 15 0 12 0 8 V2Z" fill="#1E40AF" />
          <text x="8" y="10" fontSize="5" fill="white" fontWeight="black" textAnchor="middle" dominantBaseline="middle">AI</text>
        </g>

        {/* Circuit Arrow in Center */}
        <g transform="translate(40, 30)" className="animate-pulse">
          <path d="M10 0 L20 15 L15 15 L15 35 L5 35 L5 15 L0 15 Z" fill="none" stroke="#60A5FA" strokeWidth="1" />
          <path d="M10 5 V30 M7 15 H13 M5 25 H15" stroke="#93C5FD" strokeWidth="0.5" />
          <circle cx="10" cy="38" r="1.5" fill="#60A5FA" />
          <path d="M10 38 Q15 45 20 45" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
          <path d="M10 38 Q5 45 0 45" fill="none" stroke="#60A5FA" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">הדרך הנכונה</span>
      <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">מיצוי זכויות מקיף יעיל וחכם</span>
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentPage(Page.Home)}>
              <Logo />
            </div>
            
            <nav className="hidden lg:flex items-center space-x-reverse space-x-8">
              {[
                { id: Page.Home, label: 'בית' },
                { id: Page.Assessment, label: 'אבחון זכויות' },
                { id: Page.Dashboard, label: 'הדו"ח שלי' }
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`text-sm font-black transition-all relative py-2 ${
                    currentPage === link.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {currentPage === link.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <div className="hidden md:flex flex-col items-end px-4 border-r border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Privacy Protected
                </div>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">ללא איסוף מידע אישי</p>
              </div>
              <button className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-black dark:hover:bg-blue-700 shadow-xl transition-all active:scale-95">
                כניסה מאובטחת
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Logo />
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md font-medium">
                הדרך הנכונה היא פרויקט חברתי ללא מטרות רווח. אנחנו מאמינים שזכויות חברתיות הן זכות יסוד, ומטרתנו להנגיש אותן לכל אזרח בצורה פשוטה, שקופה ובחינם.
              </p>
              <div className="flex gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                   <span className="text-xl">🔓</span>
                   <span className="text-[10px] font-black text-blue-800 dark:text-blue-300 uppercase">קוד פתוח</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl border border-green-100 dark:border-green-800 flex items-center gap-2">
                   <span className="text-xl">🛡️</span>
                   <span className="text-[10px] font-black text-green-800 dark:text-green-300 uppercase">פרטיות מלאה</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">מידע שימושי</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">איך זה עובד?</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">שאלות ותשובות</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">תרומת ידע קהילתי</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">מדריך זכויות מילואים</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">יצירת קשר</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">דיווח על טעות</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">הצטרפות לצוות המתנדבים</li>
                <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">הצהרת נגישות</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 dark:text-slate-500">
            <p className="text-xs font-bold italic text-center md:text-right">
              "זכויות לא צריך לנחש – צריך להנגיש."
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} RightLaneAI • Made with ❤️ for Social Justice</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

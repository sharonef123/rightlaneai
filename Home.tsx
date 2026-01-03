
import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import SheliAvatar from './SheliAvatar';

interface HomeProps {
  onStart: () => void;
}

const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="relative p-10 md:p-16 text-center">
        <div className="mb-8 flex justify-center">
          <SheliAvatar size="lg" isTalking={true} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">ברוכים הבאים ל"הדרך הנכונה"</h2>
        <div className="space-y-6 text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <p>
            שלום! אני <span className="text-blue-600 dark:text-blue-400 font-black">שלי</span>, ואני כאן כדי לוודא ששום זכות שמגיעה לכם לא תישאר באוויר.
          </p>
          <p>
            הפלטפורמה שלנו משלבת בינה מלאכותית מתקדמת עם מאגר ידע חברתי מקיף, כדי לסייע לכם למצות את המקסימום מהמערכת הבירוקרטית בישראל - <span className="text-blue-600 dark:text-blue-400 font-black">בחינם, בפשטות ובפרטיות מלאה.</span>
          </p>
          <p className="text-sm font-bold opacity-75">
            המידע שלכם נשאר אצלכם. אנחנו לא שומרים שום פרט מזהה.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="mt-12 w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-[2rem] text-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          בואו נצא לדרך!
        </button>
      </div>
    </div>
  </div>
);

const AgendaModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[4rem] shadow-2xl border border-white/10 overflow-hidden relative">
      <button onClick={onClose} className="absolute top-8 left-8 text-2xl opacity-50 hover:opacity-100 transition-opacity">✕</button>
      <div className="p-12 md:p-20 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center gap-6 mb-12">
          <SheliAvatar size="md" />
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">האג'נדה שלנו</h2>
        </div>
        <div className="space-y-12 text-slate-600 dark:text-slate-400">
          <section className="space-y-4">
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">1. הנגשה היא זכות יסוד</h3>
            <p className="text-lg leading-relaxed font-medium">
              בישראל קיימות אלפי זכויות, אך הבירוקרטיה והשפה המשפטית מונעות מרבים לממש אותן. אנחנו מאמינים שהמידע שייך לציבור, ולא צריך לשלם למתווכים כדי לקבל את מה שמגיע לכם בחוק.
            </p>
          </section>
          
          <section className="space-y-4">
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">2. שקיפות מלאה ללא מטרות רווח</h3>
            <p className="text-lg leading-relaxed font-medium">
              "הדרך הנכונה" הוא פרויקט חברתי טהור. אנחנו לא גובים עמלות, לא מוכרים שירותי ייצוג ולא משתפים פעולה עם גופים מסחריים. המטרה שלנו היא אחת: מקסימום כסף וזכויות חזרה לאזרח.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">3. פרטיות כערך עליון</h3>
            <p className="text-lg leading-relaxed font-medium">
              מידע על בריאות, מצב משפחתי והכנסות הוא רגיש ביותר. המערכת שלנו תוכננה כך שהיא לא שומרת את המידע שלכם בשרתים שלנו. הכל נשאר במכשיר שלכם, מנותח בזמן אמת, ונמחק ברגע שתחליטו.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">4. טכנולוגיה בשירות האדם</h3>
            <p className="text-lg leading-relaxed font-medium">
              אנחנו רותמים את כוחה של הבינה המלאכותית כדי להפוך טפסים מורכבים להוראות פשוטות. 'שלי' היא לא רק בוט, היא המלווה שלכם שמוודאת שלא תלכו לאיבוד בתוך המבוך הבירוקרטי.
            </p>
          </section>
        </div>
        <button 
          onClick={onClose}
          className="mt-16 w-full bg-blue-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-lg hover:bg-blue-700 transition-all"
        >
          הבנתי, תודה!
        </button>
      </div>
    </div>
  </div>
);

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('rightlane_visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('rightlane_visited', 'true');
    }
  }, []);

  return (
    <div className="overflow-hidden transition-colors duration-300">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      {showAgenda && <AgendaModal onClose={() => setShowAgenda(false)} />}
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-40 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-10 text-center lg:text-right relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-blue-100 dark:border-blue-800 animate-pulse">
               <span className="w-2 h-2 rounded-full bg-blue-600"></span>
               טכנולוגיה בשירות צדק חברתי
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
              זכויות הן חובה.<br/>
              <span className="text-blue-600 dark:text-blue-400">הנגשה היא המשימה.</span>
            </h1>
            <p className="text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              הפלטפורמה החברתית שמוציאה את הכוח מידי המתווכים ומחזירה אותו אליכם. גלו את כל הזכויות שלכם בשפה אנושית, בחינם ובפרטיות מלאה.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <button 
                onClick={onStart}
                className="bg-blue-600 dark:bg-blue-600 text-white px-14 py-7 rounded-[2.5rem] text-2xl font-black shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                בואו נתחיל
                <span className="group-hover:translate-x-2 transition-transform rotate-180 text-3xl">←</span>
              </button>
              <button 
                onClick={() => setShowAgenda(true)}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-7 rounded-[2.5rem] text-xl font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <span>📖</span>
                האג'נדה שלנו
              </button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">100% חינם</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ללא עמלות מתווכים</span>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
               <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">0 פרטים מזהים</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">הפרטיות שלך מעל הכל</span>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative group">
            <div className="relative z-10 bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <SheliAvatar size="md" />
                     <div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">הדו"ח החברתי</p>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">מיצוי זכויות ישיר</p>
                     </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 p-3 rounded-2xl font-black text-xs">LIVE ANALYSIS</div>
               </div>

               <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-5">
                     <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm">💰</div>
                     <div className="flex-grow">
                        <div className="h-2.5 bg-blue-100 dark:bg-blue-900 rounded-full w-24 mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-48"></div>
                     </div>
                     <span className="text-xl font-black text-blue-600 dark:text-blue-400">₪8,500</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-5">
                     <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🏘️</div>
                     <div className="flex-grow">
                        <div className="h-2.5 bg-blue-100 dark:bg-blue-900 rounded-full w-32 mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-40"></div>
                     </div>
                     <span className="text-xl font-black text-blue-600 dark:text-blue-400">25%</span>
                  </div>
                  <div className="p-8 bg-blue-600 dark:bg-blue-700 text-white rounded-[2.5rem] shadow-2xl shadow-blue-200 dark:shadow-none mt-8 relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">העוזרת האישית שלך</p>
                        <p className="text-lg font-bold leading-relaxed italic">
                          "שלום! אני שלי. מצאתי לך זכויות ששוות המון כסף וזמן. בואו נממש אותן יחד, צעד אחרי צעד."
                        </p>
                     </div>
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  </div>
               </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-blue-600/5 dark:bg-blue-400/5 rounded-full blur-[120px] -z-0"></div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">זכויות לא צריך לנחש.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">בחרנו מסלולים מותאמים אישית כדי להגיע למידע החשוב ביותר עבורך.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'הורים ומשפחות', icon: '👶', color: 'bg-blue-50 dark:bg-blue-900/10' },
              { title: 'משרתי מילואים', icon: '🪖', color: 'bg-green-50 dark:bg-green-900/10' },
              { title: 'אנשים עם מוגבלות', icon: '♿', color: 'bg-red-50 dark:bg-red-900/10' },
              { title: 'אזרחים ותיקים', icon: '👵', color: 'bg-amber-50 dark:bg-amber-900/10' }
            ].map((track, i) => (
              <div key={i} className={`${track.color} p-10 rounded-[3rem] border border-black/5 dark:border-white/5 hover:scale-105 transition-all cursor-pointer group`}>
                <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">{track.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{track.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">
                  מיצוי זכויות ייעודי הכולל נקודות זיכוי, הנחות ברשויות וסיוע סוציאלי.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

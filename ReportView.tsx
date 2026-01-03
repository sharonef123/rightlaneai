
import React, { useState, useEffect } from 'react';
import { RightCard } from '../types';
import SheliAvatar from './SheliAvatar';

interface ReportViewProps {
  rights: RightCard[];
  onFocusRight?: (right: RightCard) => void;
  onAskSheli?: (msg: string) => void;
  onEditProfile?: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ rights = [], onFocusRight, onAskSheli, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'documents'>('all');
  const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [preparedDocs, setPreparedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedSteps = localStorage.getItem('rightlane_progress');
    if (savedSteps) setCheckedSteps(JSON.parse(savedSteps));
    
    const savedDocs = localStorage.getItem('rightlane_prepared_docs');
    if (savedDocs) setPreparedDocs(JSON.parse(savedDocs));
  }, []);

  const toggleStep = (rightId: string, stepIdx: number) => {
    const key = `${rightId}-${stepIdx}`;
    const newState = { ...checkedSteps, [key]: !checkedSteps[key] };
    setCheckedSteps(newState);
    localStorage.setItem('rightlane_progress', JSON.stringify(newState));
  };

  const toggleDoc = (rightId: string, docIdx: number) => {
    const key = `${rightId}-doc-${docIdx}`;
    const newState = { ...preparedDocs, [key]: !preparedDocs[key] };
    setPreparedDocs(newState);
    localStorage.setItem('rightlane_prepared_docs', JSON.stringify(newState));
  };

  const toggleAuthority = (auth: string) => {
    setSelectedAuthorities(prev => 
      prev.includes(auth) ? prev.filter(a => a !== auth) : [...prev, auth]
    );
  };

  const clearAuthorities = () => setSelectedAuthorities([]);

  const authorities = Array.from(new Set((rights || []).map(r => r.authority)));
  
  const filteredRights = (rights || []).filter(r => {
    if (activeTab === 'critical' && r.priority !== 'critical') return false;
    if (selectedAuthorities.length > 0 && !selectedAuthorities.includes(r.authority)) return false;
    if (locationFilter) {
      const searchStr = `${r.authority} ${r.description} ${r.title} ${r.location || ''}`.toLowerCase();
      if (!searchStr.includes(locationFilter.toLowerCase())) return false;
    }
    return true;
  });

  const groupedRights = filteredRights.reduce((acc, right) => {
    if (!acc[right.authority]) acc[right.authority] = [];
    acc[right.authority].push(right);
    return acc;
  }, {} as Record<string, RightCard[]>);

  const totalValue = (rights || []).reduce((sum, r) => sum + (r.numericValue || 0), 0);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000 print-container">
      {/* Sheli Summary Card - Expert Guidance */}
      <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-[4rem] p-10 md:p-16 mb-20 relative overflow-hidden border border-white/5 flex flex-col md:flex-row gap-12 items-center no-print">
         <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 blur-3xl rounded-full"></div>
         <div className="relative z-10">
            <SheliAvatar size="xl" />
         </div>
         <div className="relative z-10 flex-grow space-y-6 text-center md:text-right">
            <h2 className="text-4xl font-black tracking-tighter">הסיכום המקצועי של שלי</h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
              "לאחר ניתוח מעמיק, זיהיתי עבורך פוטנציאל מימוש של כ-<span className="text-blue-400 font-black">₪{totalValue.toLocaleString()}</span> בשנה. 
              הבירוקרטיה אולי נראית מרתיעה, אבל הכנתי לך תוכנית פעולה צעד אחר צעד. אל תתנו לכסף שלכם להישאר במשרדים הממשלתיים!"
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <div className="bg-white/10 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-blue-300">⚡ {rights.filter(r => r.priority === 'critical').length} משימות דחופות</div>
               <div className="bg-white/10 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-green-300">✅ {Object.keys(checkedSteps).length} צעדים שבוצעו</div>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
        <div className="flex-grow space-y-4 text-center lg:text-right w-full lg:w-auto">
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">הדו"ח המקצועי שלי</h1>
          <div className="flex justify-center lg:justify-start pt-4 gap-4 no-print">
            <button 
              onClick={onEditProfile}
              className="px-8 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <span>✏️</span> עדכון פרופיל ואבחון מחדש
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl min-w-[320px] text-center border border-slate-100 dark:border-slate-800 flex flex-col items-center">
           <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4 block">שווי מימוש מוערך (שנתי)</span>
           <span className="text-7xl font-black text-blue-600 mb-6 block leading-none tracking-tighter">
             ₪{totalValue.toLocaleString()}
           </span>
           <button 
             onClick={() => window.print()} 
             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black no-print transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg"
           >
             <span className="text-2xl">📄</span> ייצוא לדו"ח PDF להדפסה
           </button>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="flex flex-col gap-8 mb-16 no-print bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'critical', 'documents'].map(id => (
              <button 
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-8 py-4 rounded-2xl font-black whitespace-nowrap border-2 transition-all ${activeTab === id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'}`}
              >
                {id === 'all' ? '📋 כל הזכויות' : id === 'critical' ? '⚡ דחוף לביצוע' : '📁 צ\'ק ליסט מסמכים'}
              </button>
            ))}
          </div>
          <div className="relative">
             <input 
               type="text" 
               placeholder="חיפוש חופשי..." 
               value={locationFilter}
               onChange={(e) => setLocationFilter(e.target.value)}
               className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-6 py-4 font-bold text-sm w-full md:w-64 focus:border-blue-500 outline-none transition-all"
             />
             <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">סינון לפי רשות (בחירה מרובה):</h4>
            {selectedAuthorities.length > 0 && (
              <button onClick={clearAuthorities} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">נקה הכל</button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {authorities.map(auth => (
              <button 
                key={auth}
                onClick={() => toggleAuthority(auth)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-2 ${selectedAuthorities.includes(auth) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-blue-200'}`}
              >
                {selectedAuthorities.includes(auth) && <span>✓</span>}
                {auth}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {activeTab === 'documents' ? (
            <div className="space-y-12">
               <div className="bg-blue-50 dark:bg-blue-900/20 p-10 rounded-[4rem] border border-blue-100 dark:border-blue-800/50 flex items-center gap-8 no-print">
                  <SheliAvatar size="md" />
                  <div>
                    <h2 className="text-3xl font-black text-blue-900 dark:text-blue-300 mb-2 tracking-tighter">מסמכים נדרשים</h2>
                    <p className="text-blue-700 dark:text-blue-400 font-medium italic">"כאן נמצאים כל האישורים שצריך להשיג כדי לממש את הזכויות שלך. פרה פרה!"</p>
                  </div>
               </div>
               
               {rights.filter((r: RightCard) => r.documentsToPrepare && r.documentsToPrepare.length > 0).map((right: RightCard) => (
                 <div key={right.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 right-card">
                    <div className="flex items-center gap-4 mb-8">
                       <span className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-2xl">📁</span>
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{right.title}</h3>
                          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{right.authority}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {(right.documentsToPrepare || []).map((doc: string, idx: number) => (
                         <div 
                           key={idx} 
                           onClick={() => toggleDoc(right.id, idx)}
                           className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${preparedDocs[`${right.id}-doc-${idx}`] ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 opacity-60' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                         >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${preparedDocs[`${right.id}-doc-${idx}`] ? 'bg-green-500 text-white shadow-lg' : 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600'}`}>
                               {preparedDocs[`${right.id}-doc-${idx}`] && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            <span className={`font-bold text-sm leading-tight ${preparedDocs[`${right.id}-doc-${idx}`] ? 'text-green-800 dark:text-green-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{doc}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            Object.entries(groupedRights).map(([auth, authRights]) => (
              <div key={auth} className="space-y-8 auth-group">
                <div className="flex items-center gap-4">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter whitespace-nowrap px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">{auth}</h2>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
                </div>
                {(authRights as RightCard[]).map((right: RightCard) => (
                  <div key={right.id} className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden right-card">
                    {right.priority === 'critical' && <div className="absolute top-0 right-10 bg-red-600 text-white px-6 py-2 rounded-b-2xl text-[10px] font-black uppercase tracking-widest animate-pulse no-print">דחוף לטיפול</div>}
                    
                    <div className="flex justify-between items-start mb-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100 dark:border-blue-800">{right.authority}</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{right.title}</h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{right.description}</p>
                          {right.numericValue && <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-2xl font-black text-xl">₪{right.numericValue.toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">תוכנית עבודה (צעדים למימוש)</h4>
                          <div className="space-y-3">
                             {(right.actionSteps || []).map((step: string, idx: number) => (
                               <div key={idx} onClick={() => toggleStep(right.id, idx)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all ${checkedSteps[`${right.id}-${idx}`] ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 opacity-60' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800'}`}>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${checkedSteps[`${right.id}-${idx}`] ? 'bg-green-500 shadow-md' : 'bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600'}`}>
                                    {checkedSteps[`${right.id}-${idx}`] && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                  </div>
                                  <span className={`text-sm font-bold leading-tight ${checkedSteps[`${right.id}-${idx}`] ? 'text-green-700 dark:text-green-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{step}</span>
                               </div>
                             ))}
                          </div>
                          {right.estimatedProcessingTime && (
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-4 bg-slate-50 dark:bg-slate-800/30 px-4 py-2 rounded-full w-fit">
                               <span>⏳ משך טיפול משוער:</span>
                               <span className="text-slate-600 dark:text-slate-300">{right.estimatedProcessingTime}</span>
                            </div>
                          )}
                       </div>

                       <div className="space-y-6">
                          <div className="bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-[3rem] shadow-xl border border-white/10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                             <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-60">המלצת מומחה מ'שלי'</h4>
                             <p className="text-lg font-bold italic leading-relaxed">
                               "{right.recommendations && right.recommendations.length > 0 ? right.recommendations[0] : 'תתחילו לאסוף את המסמכים עוד היום, כל יום שעובר הוא כסף שנשאר אצל המדינה!'}"
                             </p>
                             <button onClick={() => onFocusRight?.(right)} className="mt-8 w-full bg-white text-blue-600 py-4.5 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 no-print">
                               <span>👩‍💼</span> שלי, איך אני מגיש את זה?
                             </button>
                          </div>
                          
                          {right.officialLink && (
                            <a href={right.officialLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all no-print shadow-sm">
                              קישור רשמי להגשה אונליין ↗
                            </a>
                          )}

                          {/* Fix: Added Grounding Sources section to display grounded URLs from Google Search as required by guidelines. */}
                          {right.sources && right.sources.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 no-print">
                               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">מקורות וסימוכין נוספים:</h5>
                               <div className="flex flex-wrap gap-2">
                                  {right.sources.map((src, i) => (
                                    <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 transition-all shadow-sm">
                                      {src.title} ↗
                                    </a>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Sidebar Help Card */}
        <div className="space-y-8 no-print">
           <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 sticky top-28">
              <div className="mb-6 flex justify-center">
                 <SheliAvatar size="lg" />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 dark:text-white leading-tight text-center tracking-tight">צריכים עזרה פרטנית?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed text-center italic">"מצאתי לך הרבה זכויות! אם את/ה לא בטוח/ה לגבי צעד מסוים או מסמך שצריך להשיג, פשוט תשאלי אותי ואני אדריך אותך."</p>
              <button 
                onClick={() => onAskSheli?.('איך כדאי לי לתעדף את המשימות בדו"ח שלי?')} 
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-lg"
              >
                דברו עם שלי עכשיו
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;

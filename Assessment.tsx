
import React, { useState } from 'react';
import { AssessmentState, UserProfile, RightCard } from '../types';
import { analyzeRights } from '../services/gemini';
import { SECTORS } from '../constants';
import SheliAvatar from './SheliAvatar';

interface AssessmentProps {
  onComplete: (report: RightCard[], profile: Partial<UserProfile>) => void;
  onAskSheli: (msg: string) => void;
  initialProfile?: Partial<UserProfile> | null;
}

const Assessment: React.FC<AssessmentProps> = ({ onComplete, onAskSheli, initialProfile }) => {
  const [state, setState] = useState<AssessmentState>(() => ({
    step: 0,
    profile: initialProfile || {
      selectedSectors: [],
      age: 30,
      gender: '',
      familyStatus: '',
      childrenCount: 0,
      childrenAges: [],
      employmentStatus: 'employee'
    }
  }));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
  };

  const getEffectiveSteps = () => {
    const baseSteps = ["בחירת תחומים", "פרופיל אישי"];
    const sectorSteps = SECTORS.filter(s => state.profile.selectedSectors?.includes(s.id)).map(s => s.label);
    return [...baseSteps, ...sectorSteps, "סיכום"];
  };

  const currentSteps = getEffectiveSteps();
  const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeRights(state.profile);
      onComplete(results, state.profile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderToggle = (id: keyof UserProfile, label: string, icon: string, sub?: string) => (
    <button
      onClick={() => updateProfile({ [id]: !state.profile[id] })}
      className={`p-6 rounded-[2rem] border-2 text-right flex flex-col gap-2 transition-all group ${
        state.profile[id] 
          ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-[1.02]' 
          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="font-black text-sm leading-tight">{label}</span>
      </div>
      {sub && <p className={`text-[10px] font-medium leading-relaxed ${state.profile[id] ? 'text-blue-100' : 'text-slate-400'}`}>{sub}</p>}
    </button>
  );

  const renderContent = () => {
    const { profile, step } = state;
    const stepLabel = currentSteps[step];

    if (step === 0) {
      return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">מה נבדוק עבורך?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">"ככל שנדע יותר על אורח החיים שלך, כך אוכל למצוא יותר כסף שמגיע לך בחוק."</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  const current = profile.selectedSectors || [];
                  updateProfile({
                    selectedSectors: current.includes(s.id) ? current.filter(id => id !== s.id) : [...current, s.id]
                  });
                }}
                className={`p-8 rounded-[3rem] border-2 transition-all text-right relative overflow-hidden group ${
                  profile.selectedSectors?.includes(s.id) 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xl scale-105' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-200'
                }`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-xl font-black mb-2">{s.label}</h3>
                <p className={`text-xs font-medium leading-relaxed ${profile.selectedSectors?.includes(s.id) ? 'text-blue-100' : 'text-slate-400'}`}>{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (stepLabel === "פרופיל אישי") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-blue-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none">הנתונים הבסיסיים שלך</h2>
            <p className="text-slate-500 font-medium mt-2">הגיל, המגדר והמצב האישי פותחים דלתות להרבה מאוד זכויות.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">גיל</label>
              <input type="number" value={profile.age || ''} onChange={e => updateProfile({age: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl font-bold text-xl outline-none focus:border-blue-500 transition-all text-slate-900 dark:text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">מגדר</label>
              <select value={profile.gender} onChange={e => updateProfile({gender: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl font-bold outline-none appearance-none text-slate-900 dark:text-white">
                <option value="">בחרו...</option>
                <option value="female">נקבה</option>
                <option value="male">זכר</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">מצב משפחתי</label>
              <select value={profile.familyStatus} onChange={e => updateProfile({familyStatus: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl font-bold outline-none appearance-none text-slate-900 dark:text-white">
                <option value="">בחרו...</option>
                <option value="single">רווק/ה</option>
                <option value="married">נשוי/ה</option>
                <option value="divorced">גרוש/ה</option>
                <option value="widow">אלמן/ה</option>
                <option value="single_parent">הורה יחיד</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">סטטוס תעסוקתי</label>
              <select value={profile.employmentStatus} onChange={e => updateProfile({employmentStatus: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl font-bold outline-none appearance-none text-slate-900 dark:text-white">
                <option value="employee">שכיר/ה</option>
                <option value="self_employed">עצמאי/ת</option>
                <option value="both">גם וגם</option>
                <option value="unemployed">לא עובד/ת</option>
                <option value="pensioner">פנסיונר/ית</option>
              </select>
            </div>
          </div>
          <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center gap-6">
            <input type="checkbox" className="w-8 h-8 rounded-lg" checked={profile.isOlehHadash} onChange={e => updateProfile({isOlehHadash: e.target.checked})} />
            <div>
              <p className="font-black text-blue-900 dark:text-blue-300">אני עולה חדש/ה (ב-10 השנים האחרונות)</p>
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">זכאות לסיוע בדיור, הקלות במס ותמיכה ייעודית.</p>
            </div>
          </div>
        </div>
      );
    }

    if (stepLabel === "מיסוי ופיננסים") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-green-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">מיסוי ופיננסים</h2>
            <p className="text-slate-500 font-medium mt-2">נבדוק החזרי מס, משכנתאות ודירוג אשראי.</p>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">הטבות תעסוקה והשכלה</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderToggle('academicDegreeInLast6Years', 'סיום תואר אקדמי לאחרונה', '🎓', 'מזכה בנקודות זיכוי ממס הכנסה')}
                {renderToggle('dischargedSoldierLast3Years', 'חייל משוחרר (3 שנים)', '🎖️', 'מענקי עבודה ונקודות זיכוי')}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">חיסכון, נדל"ן וחובות</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderToggle('hasMortgage', 'משכנתא פעילה', '🏠', 'בדיקת ריביות וביטוחים')}
                {renderToggle('withdrawnPensionEarly', 'משיכת פנסיה מוקדמת', '💸', 'החזר מס על משיכה (35%)')}
                {renderToggle('hasDebtInExecutionOffice', 'תיקים בהוצאה לפועל', '📂', 'הסדרת חובות ושיקום כלכלי')}
                {renderToggle('donationsOverThreshold', 'תרומות מעל 200 ש"ח בשנה', '🤲', 'החזר מס של 35%')}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (stepLabel === "ביטוח לאומי וקצבאות") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-amber-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">ביטוח לאומי ותביעות</h2>
            <p className="text-slate-500 font-medium mt-2">איתור קצבאות נכות, פגיעה בעבודה ומענקים.</p>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderToggle('workInjuryHistory', 'תאונת עבודה או מחלת מקצוע', '🩹', 'זכאות לקצבה או מענק נכות')}
              {renderToggle('hostileActionVictim', 'נפגע/ת פעולות איבה', '🎗️', 'זכויות נפגעי טרור וחרדה')}
              {renderToggle('unemployedLastYear', 'אבטלה או חל"ת בשנה האחרונה', '⏳', 'מיצוי ימי זכאות ומענקי הסתגלות')}
              {renderToggle('permanentDisability', 'מגבלה רפואית קבועה', '♿', 'נכות כללית וניידות')}
            </div>
            {profile.isReserveSoldier && (
              <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[3rem] border border-amber-100 dark:border-amber-800">
                <label className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4 block">ימי מילואים בשנה האחרונה</label>
                <input 
                  type="range" min="0" max="100" 
                  value={profile.reserveDaysLastYear || 0} 
                  onChange={e => updateProfile({reserveDaysLastYear: Number(e.target.value)})}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between mt-2 font-black text-amber-900 dark:text-amber-400">
                  <span>0 ימים</span>
                  <span className="text-2xl">{profile.reserveDaysLastYear || 0} ימים</span>
                  <span>100+ ימים</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (stepLabel === "משפחה וחינוך") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-pink-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">משפחה וחינוך</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">ילדים והורות</h3>
              <div className="space-y-3 p-8 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                <label className="text-xs font-black text-slate-400 block mb-2">מספר ילדים מתחת לגיל 18</label>
                <input type="number" value={profile.childrenCount || 0} onChange={e => updateProfile({childrenCount: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 p-5 rounded-2xl font-black text-3xl" />
              </div>
              {renderToggle('specialNeedsFamilyMember', 'בן משפחה עם צרכים מיוחדים', '🌈', 'נקודות זיכוי וקצבאות ילד נכה')}
              {renderToggle('daycarePayments', 'תשלום למעון יום/צהרון', '🧸', 'סבסוד דרגת תשלום ממשלתית')}
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">השכלה גבוהה</h3>
              {renderToggle('isStudent', 'סטודנט/ית לתואר אקדמי', '📚', 'מלגות סיוע ונקודות זיכוי')}
              {renderToggle('isFirstDegreeStudent', 'שנה א\' לתואר ראשון', '🎓', 'מלגות "פרח" והטבות רשות מקומית')}
            </div>
          </div>
        </div>
      );
    }

    if (stepLabel === "בריאות ושואה") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-red-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">בריאות וזכויות ניצולים</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderToggle('chronicCondition', 'מחלה כרונית קבועה', '💊', 'תקרת תשלום לתרופות')}
            {renderToggle('needsNursingCare', 'צורך בעזרה בסיעוד', '🏥', 'קצבת סיעוד ועובד זר')}
            {renderToggle('medicalEquipmentAtHome', 'מכשור רפואי חשמלי', '🔌', 'הנחה בחשבון החשמל')}
            {renderToggle('isHolocaustSurvivor', 'ניצול/ת שואה (דור ראשון)', '🕯️', 'קצבה חודשית וסיוע רפואי')}
            {renderToggle('isSecondGenHolocaust', 'דור שני לניצולים', '👪', 'הטבות מסוימות בטיפולים')}
            {renderToggle('blindOrVisuallyImpaired', 'לקות ראייה או עיוורון', '👓', 'תעודת עיוור ודמי ליווי')}
          </div>
        </div>
      );
    }

    if (stepLabel === "דיור ורשויות") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-purple-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">דיור, ארנונה ורשויות</h2>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'rent', label: 'שכירות', icon: '📄' },
                { id: 'owned', label: 'בבעלות', icon: '🏠' },
                { id: 'social_housing', label: 'ציבורי', icon: '🏢' },
                { id: 'other', label: 'אחר', icon: '🏘️' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => updateProfile({ housingStatus: opt.id as any })}
                  className={`p-4 rounded-2xl border-2 font-bold transition-all ${profile.housingStatus === opt.id ? 'bg-purple-600 border-purple-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 dark:text-slate-300'}`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderToggle('isPeripheralArea', 'יישוב ספר / פריפריה', '🌵', 'הטבות מס ביישובים נבחרים')}
              {renderToggle('arnonaPayer', 'משלם ארנונה בעצמי', '🏙️', 'בדיקת הנחת ארנונה (מבחן הכנסה)')}
              {renderToggle('rentalAssistanceNeeded', 'צורך בסיוע בשכר דירה', '💰', 'מענקי משרד השיכון')}
            </div>
          </div>
        </div>
      );
    }

    if (stepLabel === "תחבורה ופנאי") {
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
          <div className="border-r-4 border-indigo-600 pr-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">ניידות, בנקאות ופנאי</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderToggle('publicTransportUser', 'תחבורה ציבורית', '🚌', 'פרופיל רב-קו מוזל')}
            {renderToggle('needsDisabledParking', 'תו נכה לרכב', '🅿️', 'פטור מאגרת רישוי וחניית נכה')}
            {renderToggle('isBankFeeExempt', 'עמלות בנקאיות', '💸', 'פטור מעמלות לחיילים/סטודנטים/גמלאים')}
            {renderToggle('prefersLocalCulture', 'תרבות ופנאי', '🎭', 'הטבות "תושב" ומועדונים ממשלתיים')}
          </div>
        </div>
      );
    }

    if (stepLabel === "סיכום") {
      return (
        <div className="flex flex-col items-center py-16 text-center space-y-10 animate-in zoom-in-95">
          {isAnalyzing ? (
            <div className="space-y-8">
              <SheliAvatar size="xl" isTalking={true} />
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">אני מנתחת עבורך את כל הזכויות...</h2>
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <p className="text-slate-500 font-bold animate-pulse">סורקת אלפי סעיפים בביטוח לאומי, מס הכנסה ורשויות מקומיות...</p>
            </div>
          ) : (
            <>
              <div className="text-9xl animate-bounce">📊</div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">הגענו לישורת האחרונה!</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg">הנתונים שלך נאספו בביטחה. הדו"ח שאני מפיקה כעת יכלול תוכנית פעולה מדויקת למימוש כל זכות.</p>
              </div>
              <button onClick={startAnalysis} className="w-full max-w-md bg-blue-600 text-white py-8 rounded-[2.5rem] text-3xl font-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4">
                הפיקו לי את הדו"ח עכשיו
              </button>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  const getSheliContext = () => {
    const stepLabel = currentSteps[state.step];
    if (state.step === 0) return "ככל שנסמן יותר תחומים, כך האבחון שלי יהיה מעמיק יותר. אל תדאגו, אני עושה את זה פשוט.";
    if (stepLabel === "פרופיל אישי") return "הנתונים האלו הם הבסיס. למשל, גיל הפרישה לנשים וגברים שונה ומשפיע על עשרות זכויות.";
    if (stepLabel === "מיסוי ופיננסים") return "מס הכנסה לא מחלק כסף בחינם - צריך לבקש אותו. אני אראה לכם בדיוק איך.";
    if (stepLabel === "ביטוח לאומי וקצבאות") return "ביטוח לאומי הוא הגוף הכי חשוב לביטחון הכלכלי שלכם. בואו נוודא שאתם מקבלים את המקסימום.";
    if (stepLabel === "משפחה וחינוך") return "גידול ילדים בישראל הוא יקר. נקודות זיכוי והנחות במעונות הן כסף מזומן שנשאר בבית.";
    if (stepLabel === "בריאות ושואה") return "זכויות רפואיות הן קריטיות לאיכות החיים. אני כאן כדי להקל על הבירוקרטיה הרפואית.";
    if (stepLabel === "דיור ורשויות") return "ארנונה היא מס גבוה, אבל יש המון פטורים והנחות שלא מספרים לכם עליהם במועצה.";
    if (stepLabel === "תחבורה ופנאי") return "גם בדברים הקטנים - בנקים ותחבורה - מצטברים סכומים גדולים לאורך השנה.";
    return "אתם עושים צעד ענק לקראת חופש כלכלי ומיצוי זכויות. אני גאה בכם!";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto mb-20 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">אבחון מומחה למיצוי זכויות</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{currentSteps[state.step]}</h1>
          </div>
          <span className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-xs font-black dark:text-slate-300">צעד {state.step + 1} מתוך {currentSteps.length}</span>
        </div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 border border-slate-200 dark:border-slate-700">
          <div 
            className="h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            style={{ width: `${((state.step + 1) / currentSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 md:p-16 flex flex-col min-h-[650px] relative overflow-hidden">
          <div className="flex-grow">
            {renderContent()}
          </div>
          
          {state.step < currentSteps.length - 1 && !isAnalyzing && (
            <div className="mt-16 pt-10 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center gap-6">
              <button onClick={prevStep} disabled={state.step === 0} className={`px-10 py-5 rounded-2xl font-black ${state.step === 0 ? 'opacity-0 invisible' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all'}`}>חזור</button>
              <button onClick={nextStep} disabled={state.step === 0 && state.profile.selectedSectors?.length === 0} className="bg-slate-900 dark:bg-blue-600 text-white px-20 py-6 rounded-[2rem] text-xl font-black shadow-2xl hover:bg-black dark:hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95">המשך</button>
            </div>
          )}
        </div>

        <div className="space-y-6 hidden lg:block">
           <div className="bg-blue-600 text-white p-10 rounded-[4rem] shadow-2xl sticky top-32 border-4 border-white/10">
              <div className="mb-6">
                <SheliAvatar size="lg" />
              </div>
              <h3 className="text-xl font-black mb-4">ההסבר של שלי</h3>
              <p className="text-lg font-medium leading-relaxed italic opacity-90">"{getSheliContext()}"</p>
              <div className="mt-8 pt-8 border-t border-white/20">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">האג'נדה החברתית</p>
                 <p className="font-bold text-blue-100 text-sm italic">"זכויות הן לא המלצה, הן החוק. אל תתנו לבירוקרטיה לנצח אתכם."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;

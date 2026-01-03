
export enum Language {
  HE = 'he',
  EN = 'en',
  RU = 'ru',
  AR = 'ar',
  AM = 'am'
}

export interface RightCardSource {
  title: string;
  uri: string;
}

export interface RightCard {
  id: string;
  title: string;
  description: string;
  authority: string;
  priority: 'critical' | 'important' | 'recommended' | 'future';
  estimatedValue?: string;
  numericValue?: number;
  requirements: string[];
  actionSteps: string[];
  contactInfo?: string;
  documentsToPrepare: string[];
  recommendations?: string[];
  officialLink?: string;
  formLink?: string;
  sources?: RightCardSource[];
  location?: string;
  estimatedProcessingTime?: string;
}

export interface UserProfile {
  // Sector Selection
  selectedSectors: string[];

  // 1. Taxes & Finance (Expert level)
  employmentStatus: 'employee' | 'self_employed' | 'both' | 'unemployed' | 'pensioner';
  incomeLevel: string; 
  hasMortgage: boolean;
  donationsOverThreshold: boolean; // Over 200 NIS
  academicDegreeInLast6Years: boolean;
  contributesToPensionIndependently: boolean;
  dischargedSoldierLast3Years: boolean;
  paysAlimony: boolean;
  workedFromHomeInHighPercent: boolean; // For self-employed expenses
  hasDebtInExecutionOffice: boolean; // הוצאה לפועל
  withdrawnPensionEarly: boolean; // Tax refund possibility

  // 2. Social Security & Benefits (Expert level)
  unemployedLastYear: boolean;
  workInjuryHistory: boolean;
  hostileActionVictim: boolean; 
  isReserveSoldier: boolean;
  reserveDaysLastYear: number;
  maternityLeaveLastYear: boolean;
  permanentDisability: boolean;
  occupationalDisease: boolean; // מחלת מקצוע (hearing loss, back issues, etc)
  isSeekingWork: boolean;

  // 3. Family & Education (Expert level)
  childrenCount: number;
  childrenAges: number[];
  isSingleParent: boolean;
  specialNeedsFamilyMember: boolean;
  isStudent: boolean;
  daycarePayments: boolean;
  payingAcademicTuition: boolean;
  isFirstDegreeStudent: boolean;

  // 4. Health & Holocaust (Expert level)
  chronicCondition: boolean;
  needsNursingCare: boolean; 
  isHolocaustSurvivor: boolean;
  isSecondGenHolocaust: boolean;
  mobilityImpairment: boolean;
  medicalEquipmentAtHome: boolean; // Dialysis, Oxygen, CPAP (Electricity discount)
  purchasedExpensiveMedication: boolean;
  cancerSurvivor: boolean;
  blindOrVisuallyImpaired: boolean;

  // 5. Housing & Municipal (Expert level)
  housingStatus: 'rent' | 'owned' | 'social_housing' | 'other';
  location: string;
  isPeripheralArea: boolean; // יישובי ספר / פריפריה (Income tax credit)
  electricityHighUsage: boolean; 
  waterUsageAbnormal: boolean; 
  arnonaPayer: boolean;
  // Fix: Added rentalAssistanceNeeded to match Assessment.tsx usage
  rentalAssistanceNeeded: boolean;

  // 6. Transportation, Banking & Local (Expert level)
  publicTransportUser: boolean;
  hasPrivateVehicle: boolean;
  needsDisabledParking: boolean;
  seniorCitizen: boolean;
  vacationFrequency: 'rare' | 'often';
  isBankFeeExempt: boolean; // Checking for soldier/student/senior status
  prefersLocalCulture: boolean;

  // General Core
  age: number;
  gender: string;
  familyStatus: string;
  isOlehHadash: boolean;
}

export interface AssessmentState {
  step: number;
  profile: Partial<UserProfile>;
  report?: RightCard[];
}

export enum Page {
  Home = 'home',
  Assessment = 'assessment',
  Dashboard = 'dashboard',
  Chat = 'chat'
}

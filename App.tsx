
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Assessment from './components/Assessment';
import ReportView from './components/ReportView';
import ChatWidget from './components/ChatWidget';
import { Page, RightCard, UserProfile } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [report, setReport] = useState<RightCard[]>([]);
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [focusedRight, setFocusedRight] = useState<RightCard | null>(null);
  const [sheliTriggerMessage, setSheliTriggerMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedReport = localStorage.getItem('rightlane_active_report');
    if (savedReport) {
      setReport(JSON.parse(savedReport));
    }
    const savedProfile = localStorage.getItem('rightlane_user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleAssessmentComplete = (data: RightCard[], userProfile: Partial<UserProfile>) => {
    setReport(data);
    setProfile(userProfile);
    localStorage.setItem('rightlane_active_report', JSON.stringify(data));
    localStorage.setItem('rightlane_user_profile', JSON.stringify(userProfile));
    setCurrentPage(Page.Dashboard);
  };

  const handleFocusRight = (right: RightCard) => {
    setFocusedRight(right);
  };

  const handleAskSheli = (message: string) => {
    setSheliTriggerMessage(message);
  };

  const handleEditProfile = () => {
    setCurrentPage(Page.Assessment);
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home onStart={() => setCurrentPage(Page.Assessment)} />;
      case Page.Assessment:
        return <Assessment 
          onComplete={handleAssessmentComplete} 
          onAskSheli={handleAskSheli} 
          initialProfile={profile} 
        />;
      case Page.Dashboard:
        return <ReportView 
          rights={report} 
          onFocusRight={handleFocusRight} 
          onAskSheli={handleAskSheli} 
          onEditProfile={handleEditProfile}
        />;
      default:
        return <Home onStart={() => setCurrentPage(Page.Assessment)} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderContent()}
      <ChatWidget 
        reportContext={report} 
        activeRight={focusedRight} 
        externalTriggerMessage={sheliTriggerMessage}
        onClearActiveRight={() => setFocusedRight(null)} 
        onClearTriggerMessage={() => setSheliTriggerMessage(null)}
      />
    </Layout>
  );
};

export default App;

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { CompetencyFrameworkView } from './components/views/CompetencyFrameworkView';
import { GapAnalysisView } from './components/views/GapAnalysisView';
import { PersonalizedLearningView } from './components/views/PersonalizedLearningView';
import { AssessmentView } from './components/views/AssessmentView';
import { UploadMaterialView } from './components/views/UploadMaterialView';
import { QuizView } from './components/views/QuizView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { ProfileView } from './components/views/ProfileView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'competencies':
        return <CompetencyFrameworkView />;
      case 'gaps':
      case 'gap-analysis':
        return <GapAnalysisView />;
      case 'learning':
        return <PersonalizedLearningView />;
      case 'assessment':
        return <AssessmentView />;
      case 'upload':
      case 'assessment-generator':
        return <UploadMaterialView />;
      case 'quiz':
        return <QuizView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'assistant':
        return <AIAssistantView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-900">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

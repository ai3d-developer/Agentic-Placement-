import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { ResumeAnalyzer } from './components/student/ResumeAnalyzer';
import { SkillGapAnalysis } from './components/student/SkillGapAnalysis';
import { CareerCoachChat } from './components/student/CareerCoachChat';
import { DailyLearning } from './components/student/DailyLearning';
import { MockTestEngine } from './components/student/MockTestEngine';
import { MockInterviewPortal } from './components/student/MockInterviewPortal';
import { PlacementReadiness } from './components/student/PlacementReadiness';
import { CollegeAdminDashboard } from './components/college/CollegeAdminDashboard';
import { HodDashboard } from './components/hod/HodDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';

import { JobBoard } from './components/student/JobBoard';
import { TodayJobsModal } from './components/ui/TodayJobsModal';
import { StudentOnboardingModal } from './components/student/StudentOnboardingModal';
import { IntroSplashScreen } from './components/auth/IntroSplashScreen';
import { LoginPage } from './components/auth/LoginPage';
import { UserRole } from './types';

const MainContent: React.FC = () => {
  const { role, setRole, profile, loginUser } = useAuth();
  const [pageView, setPageView] = useState<'intro' | 'login' | 'dashboard'>('intro');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showTodayJobsModal, setShowTodayJobsModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(!profile.isOnboarded);

  // Sync onboarding modal with profile onboarding status
  React.useEffect(() => {
    if (role === 'student') {
      setShowOnboardingModal(!profile.isOnboarded);
    } else {
      setShowOnboardingModal(false);
    }
  }, [profile.isOnboarded, role]);


  const handleLoginSuccess = (selectedRole: UserRole, email: string, displayName?: string) => {
    loginUser(selectedRole, email, displayName);
    setPageView('dashboard');
    if (selectedRole === 'student') setActiveTab('dashboard');
    else if (selectedRole === 'placement_officer') setActiveTab('placement_officer');
    else if (selectedRole === 'hod') setActiveTab('hod_dashboard');
    else if (selectedRole === 'faculty') setActiveTab('faculty_dashboard');
    else if (selectedRole === 'recruiter') setActiveTab('recruiter_dashboard');
    else if (selectedRole === 'super_admin') setActiveTab('super_admin');
  };

  if (pageView === 'intro') {
    return <IntroSplashScreen onEnterWebsite={() => setPageView('login')} />;
  }

  if (pageView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToIntro={() => setPageView('intro')}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <StudentDashboard
            onNavigate={setActiveTab}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        );
      case 'jobs':
        return <JobBoard onNavigate={setActiveTab} />;
      case 'profile':
        return <StudentProfile onNavigateToJobs={() => setActiveTab('jobs')} />;
      case 'resume':
        return <ResumeAnalyzer onNavigate={setActiveTab} />;
      case 'skills':
        return <SkillGapAnalysis />;
      case 'coach':
        return <CareerCoachChat />;
      case 'learning':
        return <DailyLearning onNavigate={setActiveTab} />;
      case 'tests':
        return <MockTestEngine />;
      case 'interview':
        return <MockInterviewPortal />;
      case 'readiness':
        return <PlacementReadiness />;
      
      // Placement Officer Subviews
      case 'placement_officer':
      case 'students_list':
      case 'manage_drives':
      case 'company_coordination':
      case 'placement_approvals':
        return <CollegeAdminDashboard activeTab={activeTab} />;
      
      // HOD Subviews
      case 'hod_dashboard':
      case 'hod_leaves':
      case 'dept_skills':
      case 'academic_clearance':
        return <HodDashboard activeTab={activeTab} />;
      
      // Faculty Subviews
      case 'faculty_dashboard':
      case 'my_mentees':
      case 'mock_evaluations':
        return <FacultyDashboard activeTab={activeTab} />;
      
      // Recruiter Subviews
      case 'recruiter_dashboard':
      case 'job_postings':
      case 'candidate_matching':
      case 'interview_scheduler':
        return <RecruiterDashboard activeTab={activeTab} />;
      
      // Super Admin Subviews
      case 'super_admin':
      case 'user_management':
      case 'system_settings':
      case 'n8n_integration':
        return <SuperAdminDashboard activeTab={activeTab} />;
      
      default:
        return (
          <StudentDashboard
            onNavigate={setActiveTab}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">
      <Navbar
        onOpenTodayJobs={() => setShowTodayJobsModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onLogout={() => setPageView('login')}
        onBackToIntro={() => setPageView('intro')}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full flex-1">
            {renderTabContent()}
          </div>

          {/* Footer inside scrollable main content area */}
          <footer className="mt-8 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 rounded-2xl py-3.5 px-6 text-center text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 transition-colors">
            <div>PlacementOS AI — Enterprise AI Placement Operating System for Higher Education</div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200">Documentation</a>
            </div>
          </footer>
        </main>
      </div>

      {/* Mandatory Onboarding Profile Setup Modal on Website Open */}
      <StudentOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onNavigateToJobs={() => setActiveTab('jobs')}
      />

      {/* Today's Jobs Modal (Opens on demand) */}
      <TodayJobsModal
        isOpen={showTodayJobsModal}
        onClose={() => setShowTodayJobsModal(false)}
        onNavigateToJobs={() => setActiveTab('jobs')}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

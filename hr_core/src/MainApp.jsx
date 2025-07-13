import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import CandidatesPage from './CandidatesPage';
import JobPostingsPage from './JobPostingsPage';
import LeaveRequests from './LeaveRequests';
import './RecruitmentDashboard.css';

const MainApp = () => {
  const [activePage, setActivePage] = useState('candidates');

  const handleNavigation = (page) => {
    setActivePage(page);
  };

  const renderPageContent = () => {
    switch(activePage) {
      case 'candidates':
        return <CandidatesPage />;
      case 'job-postings':
        return <JobPostingsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'features':
        return <FeaturesPage />;
      case 'employees':
        return <EmployeesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'attendance-logs':
        return <AttendanceLogsPage />;
      case 'leave-requests':
        return <LeaveRequests />;
      case 'salary-management':
        return <SalaryManagementPage />;
      case 'overtime-tracking':
        return <OvertimeTrackingPage />;
      case 'goals':
        return <GoalsPage />;
      case 'performance-reviews':
        return <PerformanceReviewsPage />;
      case 'system-settings':
        return <SystemSettingsPage />;
      default:
        return <CandidatesPage />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        onNavigate={handleNavigation} 
        activePage={activePage}
      />
      <div className="main-dashboard">
        {/* Top Navigation */}
        <div className="top-navigation">
          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Contacts</a>
            <a href="#" className="nav-link">Login</a>
          </div>
        </div>

        {/* Main Content Area */}
        {renderPageContent()}
      </div>
    </div>
  );
};

// Placeholder components for other pages
const DashboardPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">📊</div>
      <h1 className="page-title">Dashboard</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Dashboard Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const FeaturesPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">🔧</div>
      <h1 className="page-title">Features</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Features Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const EmployeesPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">👥</div>
      <h1 className="page-title">Employees</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Employees Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">👤</div>
      <h1 className="page-title">Profile</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Profile Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const AttendanceLogsPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">📋</div>
      <h1 className="page-title">Attendance Logs</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Attendance Logs Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const SalaryManagementPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">💰</div>
      <h1 className="page-title">Salary Management</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Salary Management Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const OvertimeTrackingPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">⏰</div>
      <h1 className="page-title">Overtime Tracking</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Overtime Tracking Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const GoalsPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">🎯</div>
      <h1 className="page-title">Goals</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Goals Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const PerformanceReviewsPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">📊</div>
      <h1 className="page-title">Performance Reviews</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>Performance Reviews Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

const SystemSettingsPage = () => (
  <div className="main-content">
    <div className="content-header">
      <div className="page-icon">⚙️</div>
      <h1 className="page-title">System Settings</h1>
    </div>
    <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
      <h2>System Settings Page Coming Soon</h2>
      <p>This page is under development.</p>
    </div>
  </div>
);

export default MainApp;
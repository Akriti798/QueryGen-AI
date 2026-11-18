import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import Toast from './components/common/Toast';

// Pages
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import DatabaseConnectionPage from './pages/DatabaseConnectionPage';
import SchemaExplorerPage from './pages/SchemaExplorerPage';
import QueryHistoryPage from './pages/QueryHistoryPage';
import SettingsPage from './pages/SettingsPage';

function MainContent() {
  const { activeTab } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'workspace':
        return <WorkspacePage />;
      case 'database':
        return <DatabaseConnectionPage />;
      case 'schema':
        return <SchemaExplorerPage />;
      case 'history':
        return <QueryHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-layout">
      {/* Collapsible / Responsive Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <TopNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="page-container">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider, useApp } from './contexts/AppContext';
import ErrorBoundary from './components/others/ErrorBoundary';
import { THEME_DARK } from './theme/config';
import AppLayout from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ConstantsPage } from './pages/ConstantsPage';
import { HeroesPage } from './pages/HeroesPage';
import { HistoryPage } from './pages/HistoryPage';
import { ExportModal } from './components/modals/ExportModal';

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ConfigProvider theme={THEME_DARK}>
        <AppProvider>
          <ErrorBoundary>
            <AppWithModals />
          </ErrorBoundary>
        </AppProvider>
      </ConfigProvider>
    </Router>
  );
};

// Separate component to access context
const AppWithModals: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, generatedFiles, exportError } = useApp();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="constants" element={<ConstantsPage />} />
          <Route path="heroes" element={<HeroesPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
      
      <ExportModal
        open={exportModalOpen}
        onCancel={() => setExportModalOpen(false)}
        generatedFiles={generatedFiles}
        error={exportError}
      />
    </>
  );
};

export default App;
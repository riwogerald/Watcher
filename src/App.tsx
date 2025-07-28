import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './utils/authUtils';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/Toast/ToastProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Incidents = React.lazy(() => import('./pages/Incidents').then(module => ({ default: module.Incidents })));
const ReportIncident = React.lazy(() => import('./pages/ReportIncident').then(module => ({ default: module.ReportIncident })));


function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon...</p></div>} />
          <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Coming soon...</p></div>} />
          <Route path="/admin/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Admin Panel</h1><p>Coming soon...</p></div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
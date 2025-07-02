import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { ReportIncident } from './pages/ReportIncident';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon...</p></div>} />
        <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Coming soon...</p></div>} />
        <Route path="/admin/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Admin Panel</h1><p>Coming soon...</p></div>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
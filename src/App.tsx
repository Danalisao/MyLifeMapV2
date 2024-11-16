import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Map } from './components/Map';
import { Navigation } from './components/Navigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/Toast';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Profile } from './components/auth/Profile';
import Memories from './components/memories/Memories';
import Calendar from './components/calendar/Calendar';
import { AddEditMemory } from './components/memories/AddEditMemory';
import { ThemeProvider } from './contexts/ThemeContext';
import { OfflineIndicator } from './components/OfflineIndicator';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden">
            <main className="h-full w-full relative pb-16 safe-area-top safe-area-bottom">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Map />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/memories"
                  element={
                    <PrivateRoute>
                      <Memories />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/memories/new"
                  element={
                    <PrivateRoute>
                      <AddEditMemory />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/memories/:id/edit"
                  element={
                    <PrivateRoute>
                      <AddEditMemory />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <Calendar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
              <Navigation />
              <OfflineIndicator />
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
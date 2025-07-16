import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

// Lazy load the main app components
const HomeView = lazy(() => import('../views/HomeView'));
const CareerView = lazy(() => import('../views/CareerView'));
const ServerConfigView = lazy(() => import('../views/ServerConfigView'));
const RaceLogsView = lazy(() => import('../views/RaceLogsView'));

const SecureApp = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🏁</div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-header">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading-spinner">🏁</div>
          <p>Loading application...</p>
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/career" element={<CareerView />} />
          <Route path="/dedicated-server-settings" element={<ServerConfigView />} />
          <Route path="/race-logs" element={<RaceLogsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default SecureApp; 
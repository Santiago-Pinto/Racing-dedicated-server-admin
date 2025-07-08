import { lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

// Lazy load the main app component
const ServerConfigView = lazy(() => import('../views/ServerConfigView'));

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
    <>
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
        <ServerConfigView />
      </Suspense>
    </>
  );
};

export default SecureApp; 
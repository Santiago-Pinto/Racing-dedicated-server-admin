import { AuthProvider } from './context/AuthContext';
import AppContent from './components/AppContent';
import { RaceLogProvider } from './context/RaceLogContext';

function App() {
  return (
    <RaceLogProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RaceLogProvider>
  );
}

export default App;

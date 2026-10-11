import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import ChatLayout from './components/ChatLayout';

function AppContent() {
  const { apiService } = useAuth();
  return apiService ? <ChatLayout /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider key="v3">
      <AppContent />
    </AuthProvider>
  );
}

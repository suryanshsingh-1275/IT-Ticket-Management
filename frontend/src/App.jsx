import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTickets from './pages/MyTickets';
import RaiseTicket from './pages/RaiseTicket';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminTickets from './pages/AdminTickets';

// Sends the user to the right homepage depending on their role.
function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/tickets" replace />;
}


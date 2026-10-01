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

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="/tickets/new" element={<RaiseTicket />} />
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
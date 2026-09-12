import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import MandiManagement from './pages/admin/MandiManagement';
import Farmers from './pages/admin/Farmers';
import LiveQueue from './pages/admin/LiveQueue';
import ProcurementEntry from './pages/admin/ProcurementEntry';
import Payments from './pages/admin/Payments';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/admin/mandis" element={
          <ProtectedRoute><MandiManagement /></ProtectedRoute>
        } />
        <Route path="/admin/farmers" element={
          <ProtectedRoute><Farmers /></ProtectedRoute>
        } />
        <Route path="/admin/queue" element={
          <ProtectedRoute><LiveQueue /></ProtectedRoute>
        } />
        <Route path="/admin/procurement" element={
          <ProtectedRoute><ProcurementEntry /></ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute><Payments /></ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
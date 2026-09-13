import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MandiManagement from "./pages/admin/MandiManagement";
import Dashboard from "./pages/admin/Dashboard";
import Farmers from "./pages/admin/Farmers";
import LiveQueue from "./pages/admin/LiveQueue";
import ProcurementEntry from "./pages/admin/ProcurementEntry";
import Payments from "./pages/admin/Payments";
import Analytics from "./pages/admin/Analytics";
import Login from "./pages/admin/Login";
import FarmerLogin from "./pages/farmer/FarmerLogin";
import FarmerRegister from "./pages/farmer/FarmerRegister";
import FarmerHome from "./pages/farmer/FarmerHome";
import FarmerWelcome from "./pages/farmer/FarmerWelcome";
import FarmerBookSlot from "./pages/farmer/FarmerBookSlot";
import FarmerLiveQueue from "./pages/farmer/FarmerLiveQueue";
import FarmerHistory from "./pages/farmer/FarmerHistory";
import FarmerProcurementDetails from "./pages/farmer/FarmerProcurementDetails";
import FarmerPayments from "./pages/farmer/FarmerPayments";
import FarmerPaymentDetails from "./pages/farmer/FarmerPaymentDetails";
import FarmerNotifications from "./pages/farmer/FarmerNotifications";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerSettings from "./pages/farmer/FarmerSettings";
import FarmerHelp from "./pages/farmer/FarmerHelp";
import ProtectedRoute from "./components/admin/ProtectedRoute";

function getStoredRole() {
  try {
    return localStorage.getItem("admin-role") || localStorage.getItem("farmer-role");
  } catch {
    return null;
  }
}

function getStoredToken() {
  try {
    return localStorage.getItem("admin-token") || localStorage.getItem("farmer-token");
  } catch {
    return null;
  }
}

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={
          (() => {
            const role = getStoredRole();
            const token = getStoredToken();
            if (token && role === "admin") return <Navigate to="/admin/dashboard" replace />;
            if (token && role === "farmer") return <Navigate to="/farmer" replace />;
            return <Navigate to="/farmer/welcome" replace />;
          })()
        } />
        <Route path="/welcome" element={<Navigate to="/farmer/welcome" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/mandis" element={<ProtectedRoute><MandiManagement /></ProtectedRoute>} />
        <Route path="/admin/farmers" element={<ProtectedRoute><Farmers /></ProtectedRoute>} />
        <Route path="/admin/queue" element={<ProtectedRoute><LiveQueue /></ProtectedRoute>} />
        <Route path="/admin/procurement" element={<ProtectedRoute><ProcurementEntry /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/farmer" element={<FarmerProtected><FarmerHome /></FarmerProtected>} />
        <Route path="/farmer/welcome" element={<FarmerWelcome />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />
        <Route path="/farmer/book" element={<FarmerProtected><FarmerBookSlot /></FarmerProtected>} />
        <Route path="/farmer/queue" element={<FarmerProtected><FarmerLiveQueue /></FarmerProtected>} />
        <Route path="/farmer/history" element={<FarmerProtected><FarmerHistory /></FarmerProtected>} />
        <Route path="/farmer/procurement/:id" element={<FarmerProtected><FarmerProcurementDetails /></FarmerProtected>} />
        <Route path="/farmer/payments" element={<FarmerProtected><FarmerPayments /></FarmerProtected>} />
        <Route path="/farmer/payment/:id" element={<FarmerProtected><FarmerPaymentDetails /></FarmerProtected>} />
        <Route path="/farmer/notifications" element={<FarmerProtected><FarmerNotifications /></FarmerProtected>} />
        <Route path="/farmer/profile" element={<FarmerProtected><FarmerProfile /></FarmerProtected>} />
        <Route path="/farmer/settings" element={<FarmerProtected><FarmerSettings /></FarmerProtected>} />
        <Route path="/farmer/help" element={<FarmerProtected><FarmerHelp /></FarmerProtected>} />
        <Route path="/farmer/*" element={<Navigate to="/farmer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function FarmerProtected({ children }) {
  const token = localStorage.getItem("farmer-token");
  const role = localStorage.getItem("farmer-role");
  if (!token || role !== "farmer") {
    return <Navigate to="/farmer/login" replace />;
  }
  return children;
}

export default App;

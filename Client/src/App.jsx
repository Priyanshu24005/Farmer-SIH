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
import AdminRegister from "./pages/admin/AdminRegister";
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

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/mandis" replace />} />
        <Route path="/welcome" element={<Navigate to="/farmer/welcome" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/mandis" element={<ProtectedRoute><MandiManagement /></ProtectedRoute>} />
        <Route path="/admin/farmers" element={<ProtectedRoute><Farmers /></ProtectedRoute>} />
        <Route path="/admin/queue" element={<ProtectedRoute><LiveQueue /></ProtectedRoute>} />
        <Route path="/admin/procurement" element={<ProtectedRoute><ProcurementEntry /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/farmer" element={<FarmerHome />} />
        <Route path="/farmer/welcome" element={<FarmerWelcome />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/register" element={<FarmerRegister />} />
        <Route path="/farmer/book" element={<FarmerBookSlot />} />
        <Route path="/farmer/queue" element={<FarmerLiveQueue />} />
        <Route path="/farmer/history" element={<FarmerHistory />} />
        <Route path="/farmer/procurement/:id" element={<FarmerProcurementDetails />} />
        <Route path="/farmer/payments" element={<FarmerPayments />} />
        <Route path="/farmer/payment/:id" element={<FarmerPaymentDetails />} />
        <Route path="/farmer/notifications" element={<FarmerNotifications />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/settings" element={<FarmerSettings />} />
        <Route path="/farmer/help" element={<FarmerHelp />} />
        {/* Farmer-scoped fallback: unknown /farmer/* URLs land on the dashboard
            instead of rendering a blank page. No /admin/* fallback: every
            existing Admin page has its own explicit route above. */}
        <Route path="/farmer/*" element={<Navigate to="/farmer" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

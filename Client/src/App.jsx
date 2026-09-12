import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MandiManagement from "./pages/admin/MandiManagement";
import FarmerLogin from "./pages/farmer/FarmerLogin";
import FarmerRegister from "./pages/farmer/FarmerRegister";
import FarmerHome from "./pages/farmer/FarmerHome";
import FarmerComingSoon from "./pages/farmer/FarmerComingSoon";
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

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/mandis" replace />} />
        <Route path="/admin/mandis" element={<MandiManagement />} />
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
        {/* Farmer-scoped fallback: the removed /farmer/otp route and any other
            unknown /farmer/* URL must land on the dashboard instead of rendering
            a blank page (Routes renders null when nothing matches). Scoped to
            /farmer/* so / and /admin/* behavior is untouched. */}
        <Route path="/farmer/*" element={<Navigate to="/farmer" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

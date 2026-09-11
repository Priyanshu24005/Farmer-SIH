import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LiveQueue from "./pages/admin/LiveQueue";
import ProcurementEntry from "./pages/admin/ProcurementEntry";
import Payments from "./pages/admin/Payments";

import Dashboard from "./pages/admin/Dashboard";
import MandiManagement from "./pages/admin/MandiManagement";
import Farmers from "./pages/admin/Farmers";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />

      <Routes>
        <Route path="/admin/queue" element={<LiveQueue />} />
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/mandis" element={<MandiManagement />} />
        <Route path="/admin/farmers" element={<Farmers />} />
        <Route path="/admin/procurement" element={<ProcurementEntry />} />
<Route path="/admin/payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
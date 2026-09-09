import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MandiManagement from "./pages/admin/MandiManagement";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/mandis" replace />} />
        <Route path="/admin/mandis" element={<MandiManagement />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
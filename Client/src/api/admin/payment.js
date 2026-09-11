import api from "../axios";

export const createPayment = (payload) =>
  api.post("/payments", payload).then((res) => res.data);

export const getPayments = () => api.get("/payments").then((res) => res.data);

export const getPaymentById = (id) =>
  api.get(`/payments/${id}`).then((res) => res.data);

export const getFarmerPayments = (farmerId) =>
  api.get(`/payments/farmer/${farmerId}`).then((res) => res.data);

export const markPaymentPaid = (id) =>
  api.put(`/payments/${id}/pay`).then((res) => res.data);
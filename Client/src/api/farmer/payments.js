import api from "../axios";

export const getFarmerPayments = (farmerId) =>
  api.get(`/payments/farmer/${farmerId}`).then((res) => res.data);

export const getPaymentById = (paymentId) =>
  api.get(`/payments/${paymentId}`).then((res) => res.data);
import api from "../axios";

// Token APIs for Farmer Booking (backend contract, base URL already includes /api)
//   POST /tokens                Book a slot { farmer, mandi, date }
//   GET  /tokens/:id            Get token details
//   GET  /tokens/mandi/:id/queue Live queue for a specific mandi
//   GET  /tokens/farmer/:id     Tokens booked by a farmer

export const bookToken = (payload) =>
  api.post("/tokens", payload).then((res) => res.data);

export const getTokenById = (id) =>
  api.get(`/tokens/${id}`).then((res) => res.data);

export const getMandiQueue = (mandiId) =>
  api.get(`/tokens/mandi/${mandiId}/queue`).then((res) => res.data);

export const getFarmerTokens = (farmerId) =>
  api.get(`/tokens/farmer/${farmerId}`).then((res) => res.data);

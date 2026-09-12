import api from "../axios";

// Farmer + Mandi APIs (backend contract, base URL already includes /api):
//   GET  /farmers/:id
//   PUT  /farmers/:id
//   GET  /mandis

export const getFarmerById = (id) =>
  api.get(`/farmers/${id}`).then((res) => res.data);

export const updateFarmer = (id, payload) =>
  api.put(`/farmers/${id}`, payload).then((res) => res.data);

export const getMandis = () => api.get("/mandis").then((res) => res.data);
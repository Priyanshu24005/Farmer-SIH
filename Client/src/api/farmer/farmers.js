import api from "../axios";

// Farmer + Mandi APIs (backend contract, base URL already includes /api):
//   POST /farmers            register  { name, mobile, aadhaar, cropType }
//   GET  /farmers/:id        farmer details (dashboard/profile)
//   PUT  /farmers/:id        update farmer  { ...fields to change }
//   GET  /mandis             list of mandis (Book Slot dropdown)
//
// NOTE: auth is OTP-based, so no password is sent. The Farmer model must NOT
// require a password for POST /farmers to succeed.

export const registerFarmer = (payload) =>
  api.post("/farmers", payload).then((res) => res.data);

export const getFarmerById = (id) =>
  api.get(`/farmers/${id}`).then((res) => res.data);

export const updateFarmer = (id, payload) =>
  api.put(`/farmers/${id}`, payload).then((res) => res.data);

export const getMandis = () => api.get("/mandis").then((res) => res.data);

import api from "../axios";

// Real Farmer authentication (backend contract, base URL already includes /api):
//   POST /auth/login    { mobile, password }
//                        -> { _id, name, mobile, role, cropType, token }
//   POST /auth/register { name, mobile, aadhaar, password, cropType }
//                        -> { _id, name, mobile, role, cropType, token }
//
// NOTE: the current backend authController response does not yet include a
// `role` field (Farmer.js has no role column either), even though the
// documented contract expects role: "farmer". Public registration only ever
// creates farmers, so farmerSession.js defaults role to "farmer" client-side
// when the backend omits it. This is a stopgap, not a fix — the backend
// should be updated to return role explicitly.

export const loginFarmer = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const registerFarmer = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);
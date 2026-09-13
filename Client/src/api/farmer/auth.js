import api from "../axios";

// Real Farmer authentication (backend contract, base URL already includes /api):
//   POST /auth/login    { mobile, password }
//                        -> { _id, name, mobile, role, cropType, token }
//   POST /auth/register { name, mobile, aadhaar, password, cropType }
//                        -> { _id, name, mobile, role, cropType, token }

export const loginFarmer = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const registerFarmer = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);
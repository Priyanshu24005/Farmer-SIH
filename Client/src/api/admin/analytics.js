import api from "../axios";

export const getDashboardStats = () =>
  api.get("/analytics/dashboard").then((res) => res.data);

export const getMandiStats = (mandiId) =>
  api.get(`/analytics/mandi/${mandiId}`).then((res) => res.data);
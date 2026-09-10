import api from "../axios";

export const getQueue = (mandiId) =>
  api.get(`/tokens/mandi/${mandiId}/queue`).then((res) => res.data);

export const getTokenById = (id) =>
  api.get(`/tokens/${id}`).then((res) => res.data);

export const updateTokenStatus = (id, status) =>
  api.put(`/tokens/${id}/status`, { status }).then((res) => res.data);
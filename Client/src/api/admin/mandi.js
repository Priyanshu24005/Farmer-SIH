import api from "../axios";

export const getMandis = () => api.get("/mandis").then((res) => res.data);

export const getMandiById = (id) =>
  api.get(`/mandis/${id}`).then((res) => res.data);

export const createMandi = (payload) =>
  api.post("/mandis", payload).then((res) => res.data);

export const updateMandi = (id, payload) =>
  api.put(`/mandis/${id}`, payload).then((res) => res.data);

export const deleteMandi = (id) =>
  api.delete(`/mandis/${id}`).then((res) => res.data);
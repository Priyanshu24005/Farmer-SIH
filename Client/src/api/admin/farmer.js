import api from "../axios";

export const getFarmers = () => api.get("/farmers").then((res) => res.data);

export const getFarmerById = (id) =>
  api.get(`/farmers/${id}`).then((res) => res.data);
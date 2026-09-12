import API from './axios';

export const loginAdmin = async (mobile, password) => {
  const res = await API.post('/auth/login', { mobile, password });
  return res.data; // { _id, name, mobile, role, token }
};
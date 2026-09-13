import API from './axios';

export const loginAdmin = async (mobile, password) => {
  const res = await API.post('/auth/login', { mobile, password });
  return res.data; // { _id, name, mobile, role, token }
};

export const registerAdmin = async (name, mobile, password) => {
  const res = await API.post('/auth/register', { name, mobile, password, role: 'admin' });
  return res.data;
};
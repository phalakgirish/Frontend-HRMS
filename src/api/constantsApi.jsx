import axios from "axios";

const API_URL = "http://localhost:3000/constants"; 

export const getConstants = async (type) => {
  const res = await axios.get(`${API_URL}/${type}`);
  return res.data;
};

export const addConstant = async (type, value) => {
  const res = await axios.post(API_URL, { type, value });
  return res.data;
};

export const updateConstant = async (id, value) => {
  const res = await axios.put(`${API_URL}/${id}`, { value });
  return res.data;
};

export const deleteConstant = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

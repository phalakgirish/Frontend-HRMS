import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-assets";

export const getAssets = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-assets/employee/${employeeId}`);
};


export const createAssets = (data) => {
  return axios.post("http://localhost:3000/employee-assets", data);
};


export const deleteAssets = (id) => {
  return axios.delete(`http://localhost:3000/employee-assets/${id}`);
};


export const updateAssets = (id, data) => {
  return axios.put(`http://localhost:3000/employee-assets/${id}`, data);
};

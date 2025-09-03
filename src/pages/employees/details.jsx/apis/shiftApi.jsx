import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-shift";

export const getShift = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-shift/employee/${employeeId}`);
};



export const createShift = (data) => {
  return axios.post("http://localhost:3000/employee-shift", data);
};


export const deleteShift = (id) => {
  return axios.delete(`http://localhost:3000/employee-shift/${id}`);
};


export const updateShift = (id, data) => {
  return axios.put(`http://localhost:3000/employee-shift/${id}`, data);
};

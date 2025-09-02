import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-family";

export const getFamilyDetail = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-family/employee/${employeeId}`);
};



export const createFamilyDetail = (data) => {
  return axios.post("http://localhost:3000/employee-family", data);
};


export const deleteFamilyDetail = (id) => {
  return axios.delete(`http://localhost:3000/employee-family/${id}`);
};


export const updateFamilyDetail = (id, data) => {
  return axios.put(`http://localhost:3000/employee-family/${id}`, data);
};

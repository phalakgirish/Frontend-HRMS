import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-experience";

export const getEmployeeExperience = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-experience/employee/${employeeId}`);
};



export const createEmployeeExperience = (data) => {
  return axios.post("http://localhost:3000/employee-experience", data);
};


export const deleteEmployeeExperience = (id) => {
  return axios.delete(`http://localhost:3000/employee-experience/${id}`);
};


export const updateEmployeeExperience = (id, data) => {
  return axios.put(`http://localhost:3000/employee-experience/${id}`, data);
};

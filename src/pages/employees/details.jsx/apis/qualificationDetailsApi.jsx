import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-qualification";

export const getEmployeeQuali = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-qualification/employee/${employeeId}`);
};



export const createEmployeeQuali = (data) => {
  return axios.post("http://localhost:3000/employee-qualification", data);
};


export const deleteEmployeeQuali = (id) => {
  return axios.delete(`http://localhost:3000/employee-qualification/${id}`);
};


export const updateEmployeeQuali = (id, data) => {
  return axios.put(`http://localhost:3000/employee-qualification/${id}`, data);
};

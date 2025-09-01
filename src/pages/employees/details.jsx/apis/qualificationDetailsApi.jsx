import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-qualification";

export const getEmployeeQuali = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-qualification/employee/${employeeId}`);
};


export const createEmployeeQuali = (payload) => {
    return axios.post(`http://localhost:3000/employee-qualification`, payload);
};

export const updateEmployeeQuali = (id, payload) => {
  return axios.put(`http://localhost:3000/employee-qualification/${id}`, payload);
};


export const deleteEmployeeQuali = (quali_id) => {
  return axios.delete(`http://localhost:3000/employee-qualification/${quali_id}`);
};
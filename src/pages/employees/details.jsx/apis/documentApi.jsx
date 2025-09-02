import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-document";

export const getEmployeeDocument = (employeeId) => {
  return axios.get(`${BASE_URL}/employee/${employeeId}`);
};

export const createEmployeeDocument = (payload) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEmployeeDocument = (id, payload) => {
  return axios.put(`${BASE_URL}/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEmployeeDocument = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

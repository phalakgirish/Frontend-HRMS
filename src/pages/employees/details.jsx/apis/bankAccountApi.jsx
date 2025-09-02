import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-bankaccount";

export const getEmployeeBankAccount = (employeeId) => {
  return axios.get(`${BASE_URL}/employee/${employeeId}`);
};

export const createEmployeeBankAccount = (payload) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEmployeeBankAccount = (id, payload) => {
  return axios.put(`${BASE_URL}/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEmployeeBankAccount = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

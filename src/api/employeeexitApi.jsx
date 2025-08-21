import axios from 'axios';

const BASE_URL = 'http://localhost:3000/employeeExit';

export const getEmployeeExit = () => {
  return axios.get(BASE_URL);
};

export const createEmployeeExit = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateEmployeeExit = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteEmployeeExit = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/employee';

export const getEmployee = () => {
  return axios.get(BASE_URL);
};

export const createEmployee = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateEmployee = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteEmployee = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
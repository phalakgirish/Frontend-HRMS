import axios from 'axios';

const BASE_URL = 'http://localhost:3000/department';

export const getDepartment = () => {
  return axios.get(BASE_URL);
};

export const createDepartment = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateDepartment = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteDepartment = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/resignation';

export const getResignation = () => {
  return axios.get(BASE_URL);
};

export const createResignation = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateResignation = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteResignation = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
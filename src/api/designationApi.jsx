import axios from 'axios';

const BASE_URL = 'http://localhost:3000/designation';

export const getDesignation = () => {
  return axios.get(BASE_URL);
};

export const createDesignation = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateDesignation = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteDesignation = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/termination';

export const getTermination = () => {
  return axios.get(BASE_URL);
};

export const createTermination = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTermination = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTermination = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
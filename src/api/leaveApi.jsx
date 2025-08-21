import axios from 'axios';

const BASE_URL = 'http://localhost:3000/leave';

export const getLeave = () => {
  return axios.get(BASE_URL);
};

export const createLeave = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateLeave = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteLeave = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
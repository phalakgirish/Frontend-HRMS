import axios from 'axios';

const BASE_URL = 'http://localhost:3000/trainers-list';

export const getTrainersList = () => {
  return axios.get(BASE_URL);
};

export const createTrainersList = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTrainersList = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTrainersList = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
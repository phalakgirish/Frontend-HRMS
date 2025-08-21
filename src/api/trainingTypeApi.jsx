import axios from 'axios';

const BASE_URL = 'http://localhost:3000/training-Type';

export const getTrainingType = () => {
  return axios.get(BASE_URL);
};

export const createTrainingType = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTrainingType = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTrainingType = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
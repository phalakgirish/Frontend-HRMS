import axios from 'axios';

const BASE_URL = 'http://localhost:3000/training-list';

export const getTrainingList = () => {
  return axios.get(BASE_URL);
};

export const createTrainingList = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTrainingList = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTrainingList = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
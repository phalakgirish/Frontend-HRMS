import axios from 'axios';

const BASE_URL = 'http://localhost:3000/travel';

export const getTravel = () => {
  return axios.get(BASE_URL);
};

export const createTravel = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTravel = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTravel = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
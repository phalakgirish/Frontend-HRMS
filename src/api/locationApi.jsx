import axios from 'axios';

const BASE_URL = 'http://localhost:3000/location';

export const getLocation = () => {
  return axios.get(BASE_URL);
};

export const createLocation = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateLocation = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteLocation = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
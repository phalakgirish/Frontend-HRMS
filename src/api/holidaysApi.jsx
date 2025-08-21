import axios from 'axios';

const BASE_URL = 'http://localhost:3000/holiday';

export const getHoliday = () => {
  return axios.get(BASE_URL);
};

export const createHoliday = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateHoliday = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteHoliday = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
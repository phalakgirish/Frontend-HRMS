import axios from 'axios';

const BASE_URL = 'http://localhost:3000/support-request';

export const getSupportRequest = () => {
  return axios.get(BASE_URL);
};

export const createSupportRequest = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateSupportRequest = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteSupportRequest = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
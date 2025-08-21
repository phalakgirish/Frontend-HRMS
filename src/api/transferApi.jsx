import axios from 'axios';

const BASE_URL = 'http://localhost:3000/transfer';

export const getTransfer = () => {
  return axios.get(BASE_URL);
};

export const createTransfer = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateTransfer = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteTransfer = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
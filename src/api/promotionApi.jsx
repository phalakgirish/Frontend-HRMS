import axios from 'axios';

const BASE_URL = 'http://localhost:3000/promotion';

export const getPromotion = () => {
  return axios.get(BASE_URL);
};

export const createPromotion = (data) => {
  return axios.post(BASE_URL, data);
};

export const updatePromotion = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deletePromotion = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/performance-indicator';

export const getPerformanceIndicator = () => {
  return axios.get(BASE_URL);
};

export const createPerformanceIndicator = (data) => {
  return axios.post(BASE_URL, data);
};

export const updatePerformanceIndicator = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deletePerformanceIndicator = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
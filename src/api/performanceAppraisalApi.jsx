import axios from 'axios';

const BASE_URL = 'http://localhost:3000/performance-appraisal';

export const getPerformanceAppraisal = () => {
  return axios.get(BASE_URL);
};

export const createPerformanceAppraisal = (data) => {
  return axios.post(BASE_URL, data);
};

export const updatePerformanceAppraisal = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deletePerformanceAppraisal = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
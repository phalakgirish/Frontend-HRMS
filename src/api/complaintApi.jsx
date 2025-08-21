import axios from 'axios';

const BASE_URL = 'http://localhost:3000/complaint';

export const getComplaint = () => {
  return axios.get(BASE_URL);
};

export const createComplaint = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateComplaint = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteComplaint = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/office-shift';

export const getOfficeShifts = () => {
  return axios.get(BASE_URL);
};

export const createOfficeShifts = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateOfficeShifts = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteOfficeShifts = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
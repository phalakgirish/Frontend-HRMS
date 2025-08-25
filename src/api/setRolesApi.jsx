import axios from 'axios';

const BASE_URL = 'http://localhost:3000/set-roles';

export const getSetRoles = () => {
  return axios.get(BASE_URL);
};

export const createSetRoles = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateSetRoles = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteSetRoles = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
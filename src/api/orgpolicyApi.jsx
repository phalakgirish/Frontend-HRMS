import axios from 'axios';

const BASE_URL = 'http://localhost:3000/orgpolicy';

export const getOrgpolicy = () => {
  return axios.get(BASE_URL);
};

export const createOrgpolicy = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateOrgpolicy = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteOrgpolicy = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
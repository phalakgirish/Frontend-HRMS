import axios from 'axios';

const BASE_URL = 'http://localhost:3000/awards';

export const getAwards = () => {
  return axios.get(BASE_URL);
};

export const createAwards = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateAwards = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteAwards = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

export const updateAward = (id, formData) => {
  return axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createAward = (formData) => {
  return axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

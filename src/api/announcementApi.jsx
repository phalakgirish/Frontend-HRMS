import axios from 'axios';

const BASE_URL = 'http://localhost:3000/announcement';

export const getAnnouncement = () => {
  return axios.get(BASE_URL);
};

export const createAnnouncement = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateAnnouncement = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteAnnouncement = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
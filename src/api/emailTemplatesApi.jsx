import axios from 'axios';

const BASE_URL = 'http://localhost:3000/email-template';

export const getEmailTemplates = () => {
  return axios.get(BASE_URL);
};

export const createEmailTemplates = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateEmailTemplates = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteEmailTemplates = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
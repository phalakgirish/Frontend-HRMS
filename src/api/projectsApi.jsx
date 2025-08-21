import axios from 'axios';

const BASE_URL = 'http://localhost:3000/projects';

export const getProjects = () => axios.get(BASE_URL);
export const createProjects = (data) => axios.post(BASE_URL, data);
export const updateProjects = (id, updatedData) => axios.put(`${BASE_URL}/${id}`, updatedData);
export const deleteProjects = async (id) => await axios.delete(`${BASE_URL}/${id}`);

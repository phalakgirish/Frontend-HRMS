import axios from 'axios';

const BASE_URL = 'http://localhost:3000/attendance';

export const getUpdateAttendance = () => {
  return axios.get(`${BASE_URL}/update-attendance`); 
};

export const createUpdateAttendance = (data) => {
  return axios.post(`${BASE_URL}`, data);
};

export const updateUpdateAttendance = (id, payload) => 
  axios.put(`${BASE_URL}/update-attendance/${id}`, payload); 

export const deleteUpdateAttendance = (id) => {
    return axios.delete(`${BASE_URL}/${id}`); 
};

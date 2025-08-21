import axios from 'axios';

const BASE_URL = 'http://localhost:3000/update-attendance';

export const getUpdateAttendance = () => {
  return axios.get(BASE_URL);
};

export const createUpdateAttendance = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateUpdateAttendance = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteUpdateAttendance = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};
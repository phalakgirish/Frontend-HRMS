import axios from "axios";

const BASE_URL = "http://localhost:3000/upload-profile";

export const uploadProfile = (formData) => {
  return axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfile = (employeeId) => {
  return axios.get(`${BASE_URL}/${employeeId}`);
};

export const deleteProfile = (employeeId) => {
  return axios.delete(`http://localhost:3000/upload-profile/${employeeId}`);
};

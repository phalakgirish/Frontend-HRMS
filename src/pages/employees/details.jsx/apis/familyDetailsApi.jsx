import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-family";

export const getFamilyDetail = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-family/employee/${employeeId}`);
};


export const createFamilyDetail = (payload) => {
    return axios.post(`http://localhost:3000/employee-family`, payload);
};

export const updateFamilyDetail = (id, payload) => {
  return axios.put(`http://localhost:3000/employee-family/${id}`, payload);
};


export const deleteFamilyDetail = (familyId) => {
  return axios.delete(`http://localhost:3000/employee-family/${familyId}`);
};
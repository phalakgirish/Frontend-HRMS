import axios from "axios";

const BASE_URL = "http://localhost:3000/employee-location";

export const getLocation = (employeeId) => {
  return axios.get(`http://localhost:3000/employee-location/employee/${employeeId}`);
};



export const createLocation = (data) => {
  return axios.post("http://localhost:3000/employee-location", data);
};


export const deleteLocation = (id) => {
  return axios.delete(`http://localhost:3000/employee-location/${id}`);
};


export const updateLocation = (id, data) => {
  return axios.put(`http://localhost:3000/employee-location/${id}`, data);
};

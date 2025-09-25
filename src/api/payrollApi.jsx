import axios from 'axios';

const BASE_URL = 'http://localhost:3000/payroll';

export const getPayroll = () => {
  return axios.get(BASE_URL);
};

export const createPayroll = (data) => {
  return axios.post(BASE_URL, data);
};

export const updatePayroll = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deletePayroll = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

export const getPayrollByEmpId = async (empId) => {
  const res = await axios.get(`${BASE_URL}/${empId}`);
  return res.data;
};

export const getAllPayrolls = async () => {
  const res = await axios.get("http://localhost:3000/payroll");
  return res.data;
};


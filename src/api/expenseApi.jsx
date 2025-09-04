import axios from 'axios';

const BASE_URL = 'http://localhost:3000/expense';

export const getExpense = () => {
  return axios.get(BASE_URL);
};

export const deleteExpense = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

export const createExpense = (form) => {
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    formData.append(key, form[key]);
  });
  return axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateExpense = (id, form) => {
  const formData = new FormData();

  Object.keys(form).forEach((key) => {
    if (key === "billCopy" && !form[key]) return; 
    formData.append(key, form[key]);
  });

  return axios.put(`http://localhost:3000/expense/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


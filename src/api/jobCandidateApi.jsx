import axios from 'axios';

const BASE_URL = 'http://localhost:3000/job-candidate';

export const getJobCandidate = () => {
  return axios.get(BASE_URL);
};

export const createJobCandidate = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateJobCandidate = (id,updatedData) =>{
  return axios.put(`${BASE_URL}/${id}`, updatedData);
}

export const deleteJobCandidate = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

export const getJobCandidateById = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/customers';

export const getAllCustomers = () => axios.get(BASE_URL);
export const getCustomerById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createCustomer = (data) => axios.post(BASE_URL, data);
export const updateCustomer = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const bulkUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${BASE_URL}/bulk-upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
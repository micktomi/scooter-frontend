import { apiClient } from './api';

export const getCustomers = () => apiClient.get('/customers/');
export const createCustomer = (data) => apiClient.post('/customers/', data);

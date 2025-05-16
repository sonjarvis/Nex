import apiClient from '../libs/apiClient';

export const registerUser = (username: string, password: string, role: string) =>
  apiClient.post('/auth/register', { username, password, role });

export const loginUser = (username: string, password: string) =>
  apiClient.post('/auth/login', { username, password });

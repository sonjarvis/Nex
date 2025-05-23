import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',  // Gateway 주소
  withCredentials: false,
});

export default apiClient;

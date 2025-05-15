import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',  // Gateway 주소
  withCredentials: true,  // (필요시, 보통 JWT는 Bearer로 씀)
});

export default apiClient;

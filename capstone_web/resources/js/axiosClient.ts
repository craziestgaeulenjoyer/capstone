import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  if (['post', 'put', 'delete'].includes(config.method || '')) {
    await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    });
  }
  return config;
});

export default axiosClient;
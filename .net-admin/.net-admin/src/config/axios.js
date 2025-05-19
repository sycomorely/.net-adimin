import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          break;
        case 403:
          // 处理禁止访问
          break;
        case 404:
          // 处理未找到
          break;
        default:
          // 处理其他错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 
import Axios from 'axios';

// 全局设置
const axiosInstance = Axios.create({
  baseURL: '',
  timeout: 5000,
  withCredentials: true
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 发送请求前做些什么
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  async (response) => {
    // 对响应数据做点什么
    const { data, status } = response;
    const { code } = data;
    if (status === 200 && code === 0) {
      return Promise.resolve(data.data);
    }
    if (code === 500) {
      // 服务器错误
      return Promise.reject(data.message);
    }
    return Promise.reject(data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const $get = async (url, data = {}, configs = {}) => {
  return axiosInstance.get(url, {
    ...configs,
    params: data
  });
};
export const $delete = async (url, data = {}, configs = {}) => {
  return axiosInstance.delete(url, {
    ...configs,
    params: data
  });
};
export const $post = async (url, data = {}, configs = {}) => {
  return axiosInstance.post(url, data, configs);
};
export const $put = async (url, data = {}, configs = {}) => {
  return axiosInstance.put(url, data, configs);
};

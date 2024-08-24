import Cookies from 'js-cookie';

export default function ({ $axios, redirect }, inject) {
  // Create a custom axios instance for the public API
  const publicAPI = $axios.create();
  publicAPI.setBaseURL('https://elearning-api-dev.tgi.asia/api/user/');

  $axios.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  $axios.onError(error => {
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      redirect('/');
    }

    return Promise.reject(error);
  });

  inject('axios', $axios);
  inject('publicAPI', publicAPI);
}
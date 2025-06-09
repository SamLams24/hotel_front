import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
 import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';


axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

const app = createApp(App);
app.use(router);
app.config.globalProperties.$axios = axios;


axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  

app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
});

app.mount('#app');

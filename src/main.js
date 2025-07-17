import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useAuthStore } from "./stores/auth";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
const authStore = useAuthStore();
app.config.globalProperties.$axios = axios;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token invalide ou expiré. Déconnexion...");
      authStore.logout();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
});

app.mount("#app");

import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles?.includes("Super-Admin"),
    userRoles: (state) => state.user?.roles || [],
    userPermissions: (state) => state.user?.permissions || []
  },

  actions: {
    async login(credentials) {
      const response = await axios.post("/users/login", credentials);
      const { token, user } = response.data;

      this.token = token;
      this.user = user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    },
    can(permissionName) {
      return this.userPermissions.includes(permissionName);
    }
  }
});

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import UserLogin from "@/views/UserLogin.vue";
import UserRegister from "@/views/UserRegister.vue";
import ChambreList from "@/views/ChambreList.vue";
import ReservationList from "@/views/ReservationList.vue";
import ContactList from "@/views/ContactList.vue";
import DashboardAdmin from "@/views/DashboardAdmin.vue";
import GererChambre from "@/views/GererChambre.vue";
import GererReservation from "@/views/GererReservation.vue";
import GererUser from "@/views/GererUser.vue";
import AcceuilHome from "@/views/AcceuilHome.vue";
import GererBar from "@/views/GererBar.vue";

const routes = [
  { path: "/", redirect: "/Home" },
  { path: "/Home", component: AcceuilHome },
  { path: "/login", component: UserLogin, name: "login" },
  { path: "/register", component: UserRegister },
  { path: "/chambres", component: ChambreList, name: "chambres" },
  { path: "/contact", component: ContactList },

  {
    path: "/reservations",
    component: ReservationList,
    meta: {
      requiresAuth: true,
      permission: "reservation-list-own"
    }
  },
  {
    path: "/dashboard",
    component: DashboardAdmin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/adminChambres",
    component: GererChambre,
    meta: {
      requiresAuth: true,
      permission: "room-list"
    }
  },
  {
    path: "/adminReservations",
    component: GererReservation,
    meta: {
      requiresAuth: true,
      permission: "reservation-list-all"
    }
  },
  {
    path: "/adminUsers",
    component: GererUser,
    meta: {
      requiresAuth: true,
      permission: "user-list"
    }
  },
  {
    path: "/adminBar",
    component: GererBar,
    meta: {
      requiresAuth: true,
      permission: "bar-orders-manage"
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({ name: "login" });
    } else {
      const requiredPermission = to.meta.permission;
      if (requiredPermission && !authStore.can(requiredPermission)) {
        console.warn(
          `Acces refusé; Dégage!va chercher la permission: ${requiredPermission}`
        );
        next("/dashboard");
      } else {
        //On continue seulement si c'est bon
        next();
      }
    }
  } else {
    next();
  }
});

export default router;

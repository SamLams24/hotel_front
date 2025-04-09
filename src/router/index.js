import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/views/UserLogin.vue';
import UserRegister from '@/views/UserRegister.vue';
import ChambreList from '@/views/ChambreList.vue';
import ReservationList from '@/views/ReservationList.vue';
import ContactList from '@/views/ContactList.vue';
import DashboardAdmin from '@/views/DashboardAdmin.vue';
import GererChambre from '@/views/GererChambre.vue';
import GererReservation from '@/views/GererReservation.vue';
import GererUser from '@/views/GererUser.vue';
import AcceuilHome from '@/views/AcceuilHome.vue';

const routes = [
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/chambres', component: ChambreList },
  { path: '/reservations', component: ReservationList },
  { path: '/contact', component: ContactList },
  { path: '/Home', component: AcceuilHome },
  { path: '/dashboard', component: DashboardAdmin, meta: { requiresAuth: true } },
  { path: '/adminChambres', component: GererChambre },
  { path: '/adminReservations', component: GererReservation },
  { path: '/adminUsers', component: GererUser },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Vérification de l'authentification avant d'accéder à certaines pages
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;

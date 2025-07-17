<template>
  <nav class="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50 font-['Dancing_Script']">
    <div class="flex items-center">
      <img src="/image/logo.png" alt="Logo HotelBook" class="h-8 w-8 text-green-600 mr-2">
      <h1 class="text-4xl font-bold text-green-600">Hotel Booking</h1>
    </div>
    <ul class="flex items-center gap-8 text-gray-700">
      <ul class="flex space-x-6">
        <router-link to="/Home" class="hover:text-green-500 text-2xl transition duration-300">Accueil</router-link>
        <router-link to="/chambres" class="hover:text-green-500 text-2xl transition duration-300">Chambres</router-link>
      
        <router-link v-if="isAuthenticated" to="/reservations" class="hover:text-green-500 text-2xl transition duration-300">
          Mes Réservations
        </router-link>

        <router-link v-if="can('user-list') || can('room-list') || can('reservation-list-all')" to="/dashboard" class="hover:text-green-500 text-2xl transition duration-300">
          Dashboard
        </router-link>
        
        <router-link to="/contact" class="hover:text-green-500 text-2xl transition duration-300">Contact</router-link>
      </ul>
      
      <li class="relative">
        <div v-if="isAuthenticated">
          <a href="#" @click.prevent="toggleDropdown" class="flex items-center hover:text-green-500">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </a>
          <div v-if="dropdownVisible" @click="toggleDropdown" class="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
            <div class="p-2 border-b">
              <p class="font-semibold text-sm text-gray-800">{{ user?.name }}</p>
              <p class="text-xs text-gray-500">{{ user?.roles?.join(', ') }}</p>
            </div>
            <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-300">
              Se déconnecter
            </button>
          </div>
        </div>
        
        <div v-else class="flex items-center space-x-2">
            <router-link to="/login" class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
                Connexion
            </router-link>
            <router-link to="/register" class="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
                Inscription
            </router-link>
        </div>
      </li>
    </ul>
  </nav>
  <router-view />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const dropdownVisible = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const can = (permission) => authStore.can(permission);
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
  toggleDropdown(); 
};
</script>

<script>
export default {
  name: "NavbarComponent",
};
</script>

<style scoped>
</style>
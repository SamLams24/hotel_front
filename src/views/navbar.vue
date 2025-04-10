<template>
  <nav class="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50 font-['Dancing_Script']">
    <div class="flex items-center">
      <img src="/image/logo.png" alt="Logo HotelBook" class="h-8 w-8 text-green-600 mr-2">
      <h1 class="text-4xl font-bold text-green-600">Hotel Booking</h1>
    </div>
    <ul class="flex gap-8 text-gray-700">
      <ul class="flex space-x-6">
        <router-link to="/Home" class="hover:text-green-500 text-2xl transition duration-300">Accueil</router-link>
        <router-link to="/chambres" class="hover:text-green-500 text-2xl transition duration-300">Chambres</router-link>
        <router-link to="/reservations" class="hover:text-green-500 text-2xl transition duration-300">Reservations</router-link>
        <router-link to="/contact" class="hover:text-green-500 text-2xl transition duration-300">Contact</router-link>
      </ul>
      <li class="relative">
        <!-- Profil utilisateur -->
        <a href="#" @click="toggleDropdown" class="flex items-center hover:text-green-500">
          <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </a>

        <!-- Menu déroulant -->
        <div v-if="dropdownVisible" class="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <button @click="logout" class="block px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300">
            Se déconnecter
          </button>
        </div>
      </li>
    </ul>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      dropdownVisible: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    logout() {
      localStorage.removeItem('token');  // Ou toute autre méthode de déconnexion
      this.$router.push('/login'); // Redirige vers la page de connexion
    }
  }
};
</script>

<style scoped>
/* Styles optionnels pour le menu déroulant */
</style>

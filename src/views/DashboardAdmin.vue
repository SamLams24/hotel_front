<template>
  <!-- Dashboard Container -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <span class="text-xl font-bold text-indigo-600"> </span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">Admin</span>
            <button 
              @click="logout"
              class="flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="ml-2">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p class="mt-2 text-gray-600">Aperçu des statistiques et accès rapides</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Chambres Card -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Chambres disponibles</p>
                <p class="text-2xl font-semibold text-gray-900">{{ chambres.length }}</p>
              </div>
            </div>
            <div class="mt-6">
              <router-link 
                to="/adminChambres" 
                class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Gérer les chambres
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Réservations Card -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Réservations actives</p>
                <p class="text-2xl font-semibold text-gray-900">{{ reservations.length }}</p>
              </div>
            </div>
            <div class="mt-6">
              <router-link 
                to="/adminReservations" 
                class="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
              >
                Voir les réservations
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Utilisateurs Card -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Utilisateurs inscrits</p>
                <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
              </div>
            </div>
            <div class="mt-6">
              <router-link 
                to="/adminUsers" 
                class="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                Gérer les utilisateurs
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Activité récente</h2>
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="divide-y divide-gray-200">
            <!-- Activity Item -->
            <div class="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Nouvelle réservation</p>
                  <p class="text-sm text-gray-500">Chambre #205</p>
                </div>
                <div class="ml-auto text-sm text-gray-500">Il y a 2h</div>
              </div>
            </div>
            
            <!-- Activity Item -->
            <div class="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Paiement confirmé</p>
                  <p class="text-sm text-gray-500">Réservation #4587</p>
                </div>
                <div class="ml-auto text-sm text-gray-500">Il y a 5h</div>
              </div>
            </div>
            
            <!-- Activity Item -->
            <div class="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900"></p>
                  <p class="text-sm text-gray-500"> s'est inscrite</p>
                </div>
                <div class="ml-auto text-sm text-gray-500"></div>
              </div>
            </div>
          </div>      
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chambres: [],
      reservations: [],
      users: []
    };
  },
  
  async created() {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [chambresRes, reservationsRes, usersRes] = await Promise.all([
        axios.get('/chambres', config),
        axios.get('/reservations', config),
        axios.get('/users', config)
      ]);

      this.chambres = chambresRes.data.chambres;
      this.reservations = reservationsRes.data.data;
      this.users = usersRes.data;
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error.response || error.message);
      alert('Erreur de chargement des données');
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Custom animations */
.bg-white {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Card hover effect */
.bg-white:hover {
  transform: translateY(-2px);
}

/* Gradient background */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
}
</style>
<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-50">
    <h1 class="text-4xl font-semibold text-gray-800 mt-8">Tableau de bord</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 w-full max-w-7xl">
      <div class="card bg-blue-100 shadow-xl rounded-lg p-6 text-center">
        <h3 class="text-2xl font-semibold text-blue-700">📦 Chambres</h3>
        <p class="text-xl text-gray-700 mt-4">{{ chambres.length }} disponibles</p>
        <router-link 
          to="/chambres" 
          class="text-blue-500 hover:text-blue-700 mt-4 inline-block font-semibold"
        >
          Voir les chambres
        </router-link>
      </div>
  
      <div class="card bg-green-100 shadow-xl rounded-lg p-6 text-center">
        <h3 class="text-2xl font-semibold text-green-700">📅 Réservations</h3>
        <p class="text-xl text-gray-700 mt-4">{{ reservations.length }} réservées</p>
        <router-link 
          to="/reservations" 
          class="text-green-500 hover:text-green-700 mt-4 inline-block font-semibold"
        >
          Voir les réservations
        </router-link>
      </div>
  
      <div class="card bg-yellow-100 shadow-xl rounded-lg p-6 text-center">
        <h3 class="text-2xl font-semibold text-yellow-700">👥 Utilisateurs</h3>
        <p class="text-xl text-gray-700 mt-4">{{ users.length }} inscrits</p>
        <router-link 
          to="/users" 
          class="text-yellow-500 hover:text-yellow-700 mt-4 inline-block font-semibold"
        >
          Gérer les utilisateurs
        </router-link>
      </div>
    </div>

    <button 
      @click="logout" 
      class="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
    >
      Déconnexion
    </button>
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
      axios.get('/chambre', config),
      axios.get('/reservation', config),
      axios.get('/users', config)
    ]);

    this.chambres = chambresRes.data;
    this.reservations = reservationsRes.data;
    this.users = usersRes.data;
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error.response || error.message);
    alert('Erreur de chargement des données');
  }
}
,
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
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

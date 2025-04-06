<template>
  <nav class="bg-gray-900 text-white py-4 px-6 flex items-center justify-between shadow-md">
    <div class="flex gap-6">
      <!-- Accueil -->
      <router-link 
        to="/" 
        class="text-xl font-semibold hover:text-blue-400 transition duration-300"
      >
        🏡 Accueil
      </router-link>

      <!-- Chambres -->
      <router-link 
        to="/chambres" 
        class="text-xl font-semibold hover:text-blue-400 transition duration-300"
      >
        🛏 Chambres
      </router-link>

      <!-- Réservations -->
      <router-link 
        to="/reservations" 
        class="text-xl font-semibold hover:text-blue-400 transition duration-300"
      >
        📅 Réservations
      </router-link>

      <!-- Contact -->
      <router-link 
        to="/contact" 
        class="text-xl font-semibold hover:text-blue-400 transition duration-300"
      >
        📞 Contact
      </router-link>

      <!-- Dashboard visible uniquement si admin -->
      <router-link 
        v-if="isAuthenticated && isAdmin" 
        to="/dashboard" 
        class="text-xl font-semibold hover:text-blue-400 transition duration-300"
      >
        🏠 Dashboard
      </router-link>
    </div>

    <!-- Afficher Se connecter ou Déconnexion -->
    <div>
      <button 
        v-if="!isAuthenticated" 
        @click="goToLogin" 
        class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        🚪 Se connecter
      </button>

      <button 
        v-if="isAuthenticated" 
        @click="logout" 
        class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
      >
        🚪 Déconnexion
      </button>
    </div>
  </nav>

  <router-view />
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isAuthenticated: false, // Pour savoir si l'utilisateur est connecté
      isAdmin: false // Pour savoir si l'utilisateur est un admin
    };
  },
  async created() {
    this.checkAuthStatus(); // Vérifier l'état de l'authentification au chargement du composant
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true; // Utilisateur connecté
       // this.checkAdminStatus(); // Vérifier si l'utilisateur est admin
      } else {
        this.isAuthenticated = false; // Utilisateur non connecté
      }
    },
    async checkAdminStatus() {
      try {

        const response = await axios.get('/users/login', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Si l'utilisateur a le rôle "admin", on lui permet d'accéder au Dashboard
       // this.isAdmin = response.data.is_admin === 1;
        alert(this.isAdmin);
        console.log(response)
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de l'utilisateur", error);
      }
    },
    logout() {
      localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
      this.isAuthenticated = false; // Mettre l'utilisateur en statut déconnecté
      this.isAdmin = false; // Retirer les privilèges admin
      delete axios.defaults.headers.common['Authorization']; // Supprimer le header Authorization
      this.$router.push('/login'); // Rediriger vers la page de connexion
    },
    goToLogin() {
      this.$router.push('/login'); // Rediriger vers la page de connexion si non connecté
    }
  }
};
</script>



<style scoped>
nav {
  background: #2d3748;
  padding: 10px;
  border-radius: 8px;
}
nav a {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 12px;
}
nav a:hover {
  color: #63b3ed;
}
nav button {
  background: #e53e3e;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
nav button:hover {
  background: #c53030;
}
</style>

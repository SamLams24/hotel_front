<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-3xl font-semibold text-center text-blue-600 mb-6">Inscription</h2>
      
      <form @submit.prevent="register">
        <!-- Champ Nom -->
        <div class="mb-4">
          <input 
            v-model="name" 
            type="text" 
            placeholder="Nom" 
            required 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Champ Email -->
        <div class="mb-4">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
            required 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Champ Mot de passe -->
        <div class="mb-6">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Mot de passe" 
            required 
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Bouton d'inscription -->
        <button 
          type="submit" 
          class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          S'inscrire
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Déjà un compte ? 
        <router-link to="/login" class="text-blue-600 hover:text-blue-700">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('/users', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        alert('Inscription réussie, connecte-toi !');
        this.$router.push('/login');
        console.log(response);
      } catch (error) {
        alert('Erreur lors de l’inscription');
      }
    }
  }
};
</script>


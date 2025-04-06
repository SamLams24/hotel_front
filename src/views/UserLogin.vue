<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-3xl font-semibold text-center text-blue-600 mb-6">Connexion</h2>

      <form @submit.prevent="login">
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

        <!-- Bouton de connexion -->
        <button 
          type="submit" 
          class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Se connecter
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Pas encore de compte ? 
        <router-link to="/register" class="text-blue-600 hover:text-blue-700">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/users/login', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('token', response.data.token.split('|')[1]);
        console.log(response.data.token.split('|')[1]);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token.split('|')[1]}`;
        this.$router.push('/dashboard');
      } catch (error) {
        alert('Échec de connexion');
      }
    }
  }
};
</script>


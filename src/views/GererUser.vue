<template>
    <div class="container">
      <h2 class="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
  
      <!-- Liste des utilisateurs -->
      <div v-if="users.length > 0">
        <ul>
          <li v-for="user in users" :key="user.id" class="user-item">
            <p><strong>Nom :</strong> {{ user.name }}</p>
            <p><strong>Email :</strong> {{ user.email }}</p>
            <p><strong>Rôle :</strong> {{ user.is_admin ? 'Admin' : 'Utilisateur' }}</p>
            <button @click="deleteUser(user.id)" class="btn-danger">Supprimer</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        users: []
      };
    },
    created() {
      this.getUsers();
    },
    methods: {
      async getUsers() {
        try {
          const response = await axios.get('/api/users');
          this.users = response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs", error);
        }
      },
      async deleteUser(id) {
        try {
          await axios.delete(`/api/users/${id}`);
          this.users = this.users.filter(user => user.id !== id);
        } catch (error) {
          console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .user-item {
    padding: 12px;
    background-color: #f9f9f9;
    margin: 8px 0;
    border-radius: 5px;
  }
  
  .btn-danger {
    background-color: #f44336;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }
  </style>
  
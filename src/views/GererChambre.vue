<template>
    <div class="container">
      <h2 class="text-2xl font-bold mb-4">Gestion des Chambres</h2>
  
      <!-- Formulaire pour ajouter une chambre -->
      <form @submit.prevent="createChambre" v-if="showForm">
        <input v-model="newChambre.type" placeholder="Type de chambre" class="input" required />
        <input v-model="newChambre.prix_nuite" placeholder="Prix par nuit" type="number" class="input" required />
        <input v-model="newChambre.image" placeholder="URL de l'image" class="input" />
        <button type="submit" class="btn-primary">Ajouter Chambre</button>
      </form>
  
      <!-- Liste des chambres -->
      <div v-if="chambres.length > 0">
        <ul>
          <li v-for="chambre in chambres" :key="chambre.id" class="chambre-item">
            <div>
              <p><strong>Type :</strong> {{ chambre.type }}</p>
              <p><strong>Prix :</strong> {{ chambre.prix_nuite }}€ / nuit</p>
              <button @click="deleteChambre(chambre.id)" class="btn-danger">Supprimer</button>
              <button @click="editChambre(chambre)" class="btn-edit">Modifier</button>
            </div>
          </li>
        </ul>
      </div>
  
      <button @click="showForm = !showForm" class="btn-toggle">Ajouter une Chambre</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        chambres: [],
        showForm: false,
        newChambre: {
          type: '',
          prix_nuite: '',
          image: ''
        },
        editingChambre: null
      };
    },
    created() {
      this.getChambres();
    },
    methods: {
      async getChambres() {
        try {
          const response = await axios.get('/api/chambres');
          this.chambres = response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des chambres", error);
        }
      },
      async createChambre() {
        try {
          const response = await axios.post('/api/chambres', this.newChambre);
          this.chambres.push(response.data);
          this.showForm = false;
          this.newChambre = { type: '', prix_nuite: '', image: '' };
        } catch (error) {
          console.error("Erreur lors de la création de la chambre", error);
        }
      },
      async deleteChambre(id) {
        try {
          await axios.delete(`/api/chambres/${id}`);
          this.chambres = this.chambres.filter(chambre => chambre.id !== id);
        } catch (error) {
          console.error("Erreur lors de la suppression de la chambre", error);
        }
      },
      editChambre(chambre) {
        this.newChambre = { ...chambre };
        this.showForm = true;
        this.editingChambre = chambre.id;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Style pour les composants CRUD */
  .input {
    padding: 8px;
    margin: 10px 0;
    width: 100%;
    max-width: 300px;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }
  
  .btn-danger {
    background-color: #f44336;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }
  
  .btn-edit {
    background-color: #008CBA;
    color: white;
    padding: 8px 16px;
    border: none;
    cursor: pointer;
  }
  
  .chambre-item {
    padding: 12px;
    background-color: #f9f9f9;
    margin: 8px 0;
    border-radius: 5px;
  }
  
  .btn-toggle {
    background-color: #008CBA;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    margin-top: 20px;
  }
  </style>
  
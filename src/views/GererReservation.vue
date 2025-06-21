<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">🗓️ Gestion des Réservations</h1>
        <p class="mt-2 text-gray-600">Gérez toutes les réservations de votre établissement</p>
      </div>

      <!-- Formulaire d'édition/ajout -->
      <div v-if="showForm" class="bg-white shadow-md rounded-lg p-6 mb-8 transition-all duration-300">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingReservation ? '✏️ Modifier Réservation' : '➕ Nouvelle Réservation' }}
        </h2>
        
        <form @submit.prevent="submitReservation" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chambre</label>
              <select v-model="formData.chambre_id" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="chambre in chambres" :key="chambre.id" :value="chambre.id">
                  Chambre {{ chambre.numero_chambre }} ({{ chambre.type }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
              <select v-model="formData.user_id" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Arrivée</label>
              <input v-model="formData.date_arrive" type="date" required
                     @change="calculateDuration"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Départ</label>
              <input v-model="formData.date_depart" type="date" required
                     @change="calculateDuration"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div v-if="durationDays > 0">
              <label class="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
              <input :value="durationDays" type="number" disabled
                     class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button @click="cancelForm" type="button"
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
              Annuler
            </button>
            <button type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              {{ editingReservation ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Bouton d'ajout -->
      <div class="mb-6 flex justify-between items-center">
        <div class="relative w-64">
          <input v-model="searchQuery" type="text" placeholder="Rechercher..." 
                 class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <button @click="showAddForm"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center">
          <span>➕</span>
          <span class="ml-2">Nouvelle Réservation</span>
        </button>
      </div>

      <!-- Liste des réservations -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div v-if="filteredReservations.length === 0" class="p-8 text-center text-gray-500">
          Aucune réservation trouvée
        </div>
        
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="reservation in filteredReservations" :key="reservation.id" 
              class="p-6 hover:bg-gray-50 transition">
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <p class="font-medium">
                  <span class="text-blue-600">#{{ reservation.numero_reservation }}</span> - 
                  Chambre {{ getChambreNumber(reservation.chambre_id) }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Client:</span> {{ getUserName(reservation.user_id) }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Période:</span> 
                  {{ formatDate(reservation.date_arrive) }} → {{ formatDate(reservation.date_depart) }}
                  <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {{ calculateDays(reservation.date_arrive, reservation.date_depart) }} jours
                  </span>
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Date réservation:</span> 
                  {{ formatDateTime(reservation.created_at) }}
                </p>
              </div>
              
              <div class="flex space-x-2">
                <button @click="editReservation(reservation)"
                        class="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition">
                  ✏️
                </button>
                <button @click="confirmDelete(reservation.id)"
                        class="p-2 text-red-600 hover:bg-red-100 rounded-full transition">
                  🗑️
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
            ❗
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
            <p class="mt-2 text-sm text-gray-500">
              Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
            </p>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showDeleteModal = false" type="button"
                  class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
            Annuler
          </button>
          <button @click="deleteReservation" type="button"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
/* eslint-disable */
export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      reservations: [],
      chambres: [],
      users: [],
      searchQuery: '',
      showForm: false,
      editingReservation: null,
      showDeleteModal: false,
      reservationToDelete: null,
      durationDays: 0,
      formData: {
        chambre_id: '',
        user_id: '',
        date_arrive: '',
        date_depart: '',
      }
    };
  },
  computed: {
    filteredReservations() {
      return this.reservations.filter(reservation => {
        const search = this.searchQuery.toLowerCase();
        return (
          reservation.numero_reservation.toLowerCase().includes(search) ||
          this.getChambreNumber(reservation.chambre_id).toString().includes(search) ||
          this.getUserName(reservation.user_id).toLowerCase().includes(search)
        );
      });
    }
  },
  async created() {
    await this.getReservations();
    await this.getChambres();
    await this.getUsers();
  },
  methods: {
    async getReservations() {
      try {
        const response = await axios.get('/reservations');
        this.reservations = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    },
    
    async getChambres() {
      try {
        const response = await axios.get('/chambres');
        this.chambres = response.data.chambres || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des chambres", error);
      }
    },
    
    async getUsers() {
      try {
        const response = await axios.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    },
    
    getChambreNumber(chambreId) {
      const chambre = this.chambres.find(c => c.id === chambreId);
      return chambre ? chambre.numero_chambre : 'N/A';
    },
    
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? user.name : 'N/A';
    },
    
    showAddForm() {
      this.resetForm();
      this.editingReservation = null;
      this.showForm = true;
    },
    
    editReservation(reservation) {
      this.formData = { ...reservation };
      this.editingReservation = reservation.id;
      this.durationDays = this.calculateDays(reservation.date_arrive, reservation.date_depart);
      this.showForm = true;
    },
    
    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },
    
    resetForm() {
      this.formData = {
        chambre_id: '',
        user_id: '',
        date_arrive: '',
        date_depart: '',
      };
      this.durationDays = 0;
    },
    
    calculateDuration() {
      if (this.formData.date_arrive && this.formData.date_depart) {
        this.durationDays = this.calculateDays(this.formData.date_arrive, this.formData.date_depart);
      }
    },
    
    calculateDays(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    async submitReservation() {
      try {
        const reservationData = { ...this.formData };
        
        if (this.editingReservation) {
          await axios.put(`/reservation/${this.editingReservation}`, reservationData);
          const index = this.reservations.findIndex(r => r.id === this.editingReservation);
          if (index !== -1) {
            this.reservations[index] = { ...reservationData, id: this.editingReservation };
          }
        } else {
          const response = await axios.post('/reservation', reservationData);
          this.reservations.push(response.data);
        }
        
        this.showForm = false;
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
      }
    },
    
    confirmDelete(id) {
      this.reservationToDelete = id;
      this.showDeleteModal = true;
    },
    
    async deleteReservation() {
      try {
        await axios.delete(`/reservation/${this.reservationToDelete}`);
        this.reservations = this.reservations.filter(r => r.id !== this.reservationToDelete);
        this.showDeleteModal = false;
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },
    
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
    }
  }
};
</script>

<style scoped>
.transition {
  transition: all 0.2s ease-in-out;
}

button {
  transition: transform 0.1s ease;
}

button:active {
  transform: scale(0.98);
}

.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 1);
}
</style>
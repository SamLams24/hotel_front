<template>
  <!-- Hero Section -->
  <section class="relative">
    <img src="/image/book.jpg" alt="Book Now" class="w-full h-[500px] object-cover">
    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-center px-4">
      <h1 class="text-white text-4xl md:text-5xl font-serif font-bold mb-4">Vos réservations</h1>
      <p class="text-white text-lg md:text-xl font-serif max-w-2xl">
        Consultez et gérez toutes vos réservations en un seul endroit
      </p>
    </div>
  </section>

  <!-- Search Bar -->
  <div class="container mx-auto px-4 -mt-12 z-10 relative">
    <div class="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Arrivée</label>
          <input 
            type="text" 
            id="checkin-date" 
            ref="checkinInput"
            class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
            placeholder="Date d'arrivée">
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Départ</label>
          <input 
            type="text" 
            id="checkout-date" 
            ref="checkoutInput"
            class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
            placeholder="Date de départ">
        </div>
        
        <div class="flex items-end">
          <button 
            @click="searchRooms"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 w-full font-serif shadow-md hover:shadow-lg">
            Rechercher
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-800 font-serif mb-2">Vos réservations</h2>
        <p class="text-gray-600 font-serif">Retrouvez ici l'historique de toutes vos réservations</p>
      </div>

      <!-- Reservation Cards -->
      <div v-if="reservations.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Reservation Card -->
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          <!-- Image -->
          <div class="h-48 overflow-hidden">
            <img
              src="/image/al2.jpg"
              alt="Chambre"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          <!-- Content -->
          <div class="p-6 font-serif">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-gray-800">Réservation #{{ reservation.id }}</h3>
              <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Confirmée
              </span>
            </div>
            
            <div class="space-y-3 text-gray-600">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ formatDate(reservation.date_arrive) }} → {{ formatDate(reservation.date_depart) }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>Chambre {{ reservation.chambre_id }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ reservation.dure_reservation }} nuit(s)</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 flex space-x-3">
              <button
                @click="ouvrirModalModif(reservation)"
                class="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Modifier
              </button>
              <button
                @click="ouvrirModalAnnulation(reservation)"
                class="flex-1 bg-white border border-red-600 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-700 mb-2 font-serif">Aucune réservation trouvée</h3>
          <p class="text-gray-500 mb-6 font-serif">Vous n'avez pas encore effectué de réservation avec nous.</p>
          <router-link to="/chambres" class="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-serif transition-colors duration-300">
            Voir nos chambres
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.lastPage > 1" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button 
            v-if="pagination.prevPageUrl" 
            @click="chargerPage(pagination.prevPageUrl)" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Précédent
          </button>

          <span class="px-4 py-2 text-gray-700">
            Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
          </span>

          <button 
            v-if="pagination.nextPageUrl" 
            @click="chargerPage(pagination.nextPageUrl)" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 flex items-center"
          >
            Suivant
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>

  <!-- Modals -->
  <!-- Modification Modal -->
  <div v-if="showModalModif" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 font-serif">Modifier réservation</h3>
        <button @click="fermerModalModif" class="text-gray-400 hover:text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Date d'arrivée</label>
          <input 
            type="date" 
            v-model="form.date_arrive" 
            class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Date de départ</label>
          <input 
            type="date" 
            v-model="form.date_depart" 
            class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="fermerModalModif" 
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-serif"
        >
          Annuler
        </button>
        <button 
          @click="modifierReservation" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-serif"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>

  <!-- Annulation Modal -->
  <div v-if="showModalAnnul" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800 font-serif">Confirmer l'annulation</h3>
        <button @click="fermerModalAnnulation" class="text-gray-400 hover:text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        
        <p class="text-gray-700 mb-6 font-serif">
          Êtes-vous sûr de vouloir annuler la réservation #{{ reservationAAnnuler?.id }} pour la chambre {{ reservationAAnnuler?.chambre_id }} ?
        </p>
        
        <div class="flex justify-center space-x-3">
          <button 
            @click="fermerModalAnnulation" 
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-serif"
          >
            Non, garder
          </button>
          <button 
            @click="confirmerAnnulation" 
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-serif"
          >
            Oui, annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/fr'; 
import 'flatpickr/dist/flatpickr.min.css';
/* eslint-disable */
export default {
  data() {
    return {
      reservations: [],
      showModalModif: false,
      showModalAnnul: false,
      form: {
        id: null,
        date_arrive: '',
        date_depart: ''
      },
      reservationAAnnuler: null,
      checkinDate: null,
      checkoutDate: null,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        nextPageUrl: null,
        prevPageUrl: null
      }
    };
  },

  mounted() {
    const checkoutPicker = flatpickr(this.$refs.checkoutInput, {
      locale: 'fr',
      minDate: new Date().fp_incr(1),
      dateFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        this.checkoutDate = dateStr;
      }
    });

    flatpickr(this.$refs.checkinInput, {
      locale: 'fr',
      minDate: 'today',
      dateFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        this.checkinDate = dateStr;
        checkoutPicker.set('minDate', selectedDates[0].fp_incr(1));
      }
    });
  },

  async created() {
    await this.loadReservations();
  },

  methods: {
    async loadReservations(url = '/reservations') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(url);
        this.reservations = response.data.data;
        this.pagination = {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          nextPageUrl: response.data.next_page_url,
          prevPageUrl: response.data.prev_page_url
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },

    searchRooms() {
      if (!this.checkinDate || !this.checkoutDate) {
        alert('Veuillez sélectionner les dates de séjour');
        return;
      }
      console.log('Recherche pour:', this.checkinDate, 'au', this.checkoutDate);
    },

    // Modal methods
    ouvrirModalModif(reservation) {
      this.form = {
        id: reservation.id,
        date_arrive: reservation.date_arrive.split('T')[0],
        date_depart: reservation.date_depart.split('T')[0]
      };
      this.showModalModif = true;
    },

    fermerModalModif() {
      this.showModalModif = false;
      this.form = { id: null, date_arrive: '', date_depart: '' };
    },

    async modifierReservation() {
      try {
        const updated = {
          date_arrive: this.form.date_arrive,
          date_depart: this.form.date_depart
        };
        await axios.put(`/reservation/${this.form.id}`, updated);

        // Recharger les données
        await this.loadReservations();
        this.fermerModalModif();
      } catch (error) {
        console.error("Erreur de mise à jour :", error);
      }
    },

    ouvrirModalAnnulation(reservation) {
      this.reservationAAnnuler = reservation;
      this.showModalAnnul = true;
    },

    fermerModalAnnulation() {
      this.showModalAnnul = false;
      this.reservationAAnnuler = null;
    },

    async confirmerAnnulation() {
      try {
        await axios.delete(`/reservation/${this.reservationAAnnuler.id}`);
        await this.loadReservations();
        this.fermerModalAnnulation();
      } catch (error) {
        console.error("Erreur d'annulation :", error);
      }
    },

    async chargerPage(url) {
      await this.loadReservations(url);
    }
  }
};
</script>

<style scoped>
/* Animation pour les cartes */
.bg-white {
  transition: all 0.3s ease;
}

.hover\:shadow-xl {
  transition: box-shadow 0.3s ease;
}

/* Animation pour les boutons */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

/* Style pour les images */
img {
  transition: transform 0.5s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>
<template>
  <div class="container mx-full px-full py-full">
    <HomeView />

    <!-- Formulaire de recherche -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Arrivée</label>
          <input 
            type="text" 
            id="checkin-date" 
            ref="checkinInput"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
            placeholder="Date d'arrivée">
        </div>
        
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Départ</label>
          <input 
            type="text" 
            id="checkout-date" 
            ref="checkoutInput"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
            placeholder="Date de départ">
        </div>
        
        <div class="flex items-end">
          <button 
            @click="searchRooms"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition duration-300 w-full font-serif">
            Rechercher
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des chambres -->
    <h2 class="text-center text-3xl text-gray-800 mb-8 mt-12 font-serif">Nos Chambres</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-6 px-4">
      <div
        v-for="chambre in chambres"
        :key="chambre.id"
        class="flex h-50 bg-white shadow-lg rounded-lg overflow-hidden hover:scale-[1.02] transform transition-all duration-300 cursor-pointer"
        @click="showChambreDetails(chambre)"
      >
        <!-- Contenu texte à gauche -->
        <div class="w-1/2 p-4 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 font-serif">{{ chambre.type }}</h3>
            <p class="text-gray-600 text-sm mt-1 font-serif">Numéro: {{ chambre.numero_chambre }}</p>
            <p class="text-lg font-bold text-gray-900 mt-2">{{ chambre.prix_nuite }}FCFA / nuit</p>
            <p
              :class="{
                'text-green-500': chambre.disponibilite,
                'text-red-500': !chambre.disponibilite
              }"
              class="text-sm mt-1 font-serif"
            >
              {{ chambre.disponibilite ? 'Disponible' : 'Indisponible' }}
            </p>
          </div>
        </div>
        
        <!-- Image à droite -->
        <div class="w-1/2 h-full">
          <img
            :src="`http://localhost:8000/storage/${chambre.photo}` || 'https://via.placeholder.com/300'"
            alt="Chambre"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Modal de détails de la chambre -->
    <div v-if="selectedChambre" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-4xl">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Image de la chambre -->
          <div class="w-full md:w-1/2">
            <img
              :src="`http://localhost:8000/storage/${selectedChambre.photo}` || 'https://via.placeholder.com/600'"
              alt="Chambre"
              class="w-full h-64 md:h-full object-cover rounded-lg"
            />
          </div>
          
          <!-- Détails de la chambre -->
          <div class="w-full md:w-1/2">
            <h3 class="text-2xl font-semibold text-gray-800 mb-2 font-serif">{{ selectedChambre.type }}</h3>
            <p class="text-gray-600 mb-1 font-serif">Numéro: {{ selectedChambre.numero_chambre }}</p>
            <p class="text-xl font-bold text-gray-900 mb-4">{{ selectedChambre.prix_nuite }}FCFA / nuit</p>
            
            <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-800 mb-2 font-serif">Description</h4>
              <p class="text-gray-600 font-serif">{{ selectedChambre.description || 'Aucune description disponible' }}</p>
            </div>
            
            <p
              :class="{
                'text-green-500': selectedChambre.disponibilite,
                'text-red-500': !selectedChambre.disponibilite
              }"
              class="text-sm mb-6 font-serif"
            >
              {{ selectedChambre.disponibilite ? 'Disponible' : 'Indisponible' }}
            </p>
            
            <button
              @click.stop="openReservationModal(selectedChambre.id)"
              :disabled="!selectedChambre.disponibilite"
              class="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-serif"
            >
              {{ selectedChambre.disponibilite ? 'Réserver maintenant' : 'Indisponible' }}
            </button>
          </div>
        </div>
        
        <button 
          @click="selectedChambre = null"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal de réservation -->
    <div v-if="showReservationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4 font-serif">Réservez votre chambre</h3>

        <label for="phone" class="block mb-2 font-serif">Numéro de téléphone</label>
        <input
          v-model="phoneNumber"
          id="phone"
          type="tel"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4 font-serif"
          placeholder="Entrez votre numéro"
        />

        <label for="dateArrive" class="block mb-2 font-serif">Date d'arrivée</label>
        <input
          v-model="dateArrive"
          id="dateArrive"
          type="date"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4 font-serif"
        />

        <label for="dateDepart" class="block mb-2 font-serif">Date de départ</label>
        <input
          v-model="dateDepart"
          id="dateDepart"
          type="date"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4 font-serif"
        />

        <div class="flex justify-between mt-4">
          <button 
            @click="makeReservation" 
            class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-serif"
          >
            Réserver
          </button>
          <button 
            @click="closeReservationModal" 
            class="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 font-serif"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import HomeView from './HomeView.vue';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/fr';
import 'flatpickr/dist/flatpickr.min.css';

export default {
  components: {
    HomeView
  },
  data() {
    return {
      chambres: [],
      phoneNumber: '',
      dateArrive: '',
      dateDepart: '',
      showReservationModal: false,
      selectedChambre: null,
      selectedChambreId: null,
      checkinDate: '',
      checkoutDate: ''
    };
  },
  async created() {
    try {
      const response = await axios.get('/chambres');
      this.chambres = response.data.chambres;

      const roomsData = this.$route.query.rooms;
      if (roomsData) {
        this.chambres = JSON.parse(roomsData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres", error);
    }
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
  methods: {
    showChambreDetails(chambre) {
      this.selectedChambre = chambre;
    },
    openReservationModal(chambreId) {
      this.selectedChambreId = chambreId;
      this.showReservationModal = true;
    },
    closeReservationModal() {
      this.showReservationModal = false;
      this.phoneNumber = '';
      this.dateArrive = '';
      this.dateDepart = '';
    },
    searchRooms() {
      if (!this.checkinDate || !this.checkoutDate) {
        alert('Veuillez sélectionner les dates de séjour');
        return;
      }
      console.log('Recherche pour:', this.checkinDate, 'au', this.checkoutDate);
    },
    async makeReservation() {
      if (!this.phoneNumber || !this.dateArrive || !this.dateDepart) {
        alert('Veuillez remplir tous les champs.');
        return;
      }

      try {
        const response = await axios.post(`/reservation`, {
          user_id: 1, // Remplacer plus tard par ID dynamique
          chambre_id: this.selectedChambreId,
          date_arrive: this.dateArrive,
          date_depart: this.dateDepart,
          phone_number: this.phoneNumber
        });

        const paymentUrl = response.data.redirect_url;

        if (paymentUrl) {
          this.closeReservationModal();
          this.selectedChambre = null;
          window.location.href = paymentUrl;
        } else {
          alert("Impossible de récupérer l'URL de paiement.");
        }
      } catch (error) {
        console.error('Erreur lors de la réservation :', error);
        alert('Une erreur est survenue, veuillez réessayer.');
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.cursor-pointer {
  cursor: pointer;
}

.z-50 {
  z-index: 50;
}
</style>
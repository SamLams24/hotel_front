<template>
   <section class="relative">
      <img src="/image/book.jpg" alt="Contact Us" class="w-full h-[500px] object-cover">

      <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center flex-col">
  <h1 class="text-white text-5xl font-serif">Merci d'avoir réservé chez nous</h1>
  <p class="mt-4 text-white text-lg font-serif">Toute annulation après 48h entraînera un remboursement partiel</p>
</div>

    </section>

    <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-4 ">
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



    <div class="min-h-screen bg-gray-50 p-8">
    <h2 class="text-3xl bg-gray-50 text-center text-gray-800 mb-8 font-serif">Vos réservations</h2>

    <div v-if="reservations.length" class="max-w-6xl mx-auto px-4 py-8">
        <!-- Grille avec 3 colonnes -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-8">
            <!-- Chaque élément de réservation -->
            <div
                v-for="reservation in reservations"
                :key="reservation.id"
                class="w-full h-48 bg-white rounded-lg shadow-md flex overflow-hidden"
            >
                <!-- Texte à gauche -->
                <div class="w-1/2 p-4 flex flex-col justify-center font-serif">
                    <p><span class="font-semibold">Chambre :</span> {{ reservation.chambre_id }}</p>
                    <p><span class="font-semibold">Réservée le :</span> {{ reservation.date_reservation }}</p>
                    <p><span class="font-semibold">Arrivée :</span> {{ reservation.date_arrive }}</p>
                    <p><span class="font-semibold">Départ :</span> {{ reservation.date_depart }}</p>
                    <p><span class="font-semibold">Durée :</span> {{ reservation.dure_reservation }} jour(s)</p>

                    <div class="mt-2 flex space-x-2">
                        <button
                            @click="ouvrirModalModif(reservation)"
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-semibold"
                        >
                            Modifier
                        </button>
                        <button
                            @click="ouvrirModalAnnulation(reservation)"
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold"
                        >
                            Annuler
                        </button>
                    </div>
                </div>

                <!-- Image à droite -->
                <div class="w-1/2 h-full">
                    <img
                        src="/image/al2.jpg"
                        alt="Palais Méditerranéen"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </div>

    <p v-else class="text-center text-gray-600 font-serif">Aucune réservation trouvée.</p>




    <!-- Pagination -->
    <div v-if="pagination && pagination.lastPage > 1" class="flex justify-center space-x-2 mt-6">
      <button 
        v-if="pagination.prevPageUrl" 
        @click="chargerPage(pagination.prevPageUrl)" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Précédent
      </button>

      <button 
        v-if="pagination.nextPageUrl" 
        @click="chargerPage(pagination.nextPageUrl)" 
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Suivant
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.lastPage > 1" class="flex justify-center space-x-2 mt-6">
      <button 
        v-if="pagination.prevPageUrl" 
        @click="chargerPage(pagination.prevPageUrl)" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Précédent
      </button>

      <button 
        v-if="pagination.nextPageUrl" 
        @click="chargerPage(pagination.nextPageUrl)" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Suivant
      </button>
    </div>

    <!-- Modal Modification -->
    <div v-if="showModalModif" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4 text-gray-800 font-serif">Modifier Réservation</h3>
        <label class="block mb-2">
          Arrivée :
          <input type="date" v-model="form.date_arrive" class="w-full border rounded p-2 mt-1" />
        </label>
        <label class="block mb-4">
          Départ :
          <input type="date" v-model="form.date_depart" class="w-full border rounded p-2 mt-1" />
        </label>
        <div class="flex justify-end space-x-2">
          <button @click="fermerModalModif" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-serif rounded">Annuler</button>
          <button @click="modifierReservation" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-serif rounded">Enregistrer</button>
        </div>
      </div>
    </div>

    <!-- Modal Annulation -->
    <div v-if="showModalAnnul" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4 text-gray-800 font-serif">Confirmer l'annulation</h3>
        <p class="text-gray-700 mb-4 font-serif">Voulez-vous vraiment annuler la réservation de la chambre {{ reservationAAnnuler?.chambre_id }} ?</p>
        <div class="flex justify-end space-x-2">
          <button @click="fermerModalAnnulation" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-serif">Non</button>
          <button @click="confirmerAnnulation" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-serif">Oui, annuler</button>
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
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('/reservation');
      
      // Récupérer les réservations et la pagination
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
  methods: {

    searchRooms() {
      if (!this.checkinDate || !this.checkoutDate) {
        alert('Veuillez sélectionner les dates de séjour');
        return;
      }
      console.log('Recherche pour:', this.checkinDate, 'au', this.checkoutDate);
    }, 
    // Ouvrir le modal de modification
    ouvrirModalModif(reservation) {
      this.form = {
        id: reservation.id,
        date_arrive: reservation.date_arrive,
        date_depart: reservation.date_depart
      };
      this.showModalModif = true;
    },
    fermerModalModif() {
      this.showModalModif = false;
      this.form = { id: null, date_arrive: '', date_depart: '' };
    },
    // Mettre à jour la réservation
    async modifierReservation() {
      try {
        const updated = {
          date_arrive: this.form.date_arrive,
          date_depart: this.form.date_depart
        };
        await axios.put(`/reservation/${this.form.id}`, updated);

        const index = this.reservations.findIndex(r => r.id === this.form.id);
        if (index !== -1) {
          this.reservations[index].date_arrive = this.form.date_arrive;
          this.reservations[index].date_depart = this.form.date_depart;
        }

        this.fermerModalModif();
      } catch (error) {
        console.error("Erreur de mise à jour :", error);
      }
    },

    // Ouvrir le modal d'annulation
    ouvrirModalAnnulation(reservation) {
      this.reservationAAnnuler = reservation;
      this.showModalAnnul = true;
    },
    fermerModalAnnulation() {
      this.showModalAnnul = false;
      this.reservationAAnnuler = null;
    },
    // Confirmer l’annulation
    async confirmerAnnulation() {
      try {
        await axios.delete(`/reservation/${this.reservationAAnnuler.id}`);
        this.reservations = this.reservations.filter(r => r.id !== this.reservationAAnnuler.id);
        this.fermerModalAnnulation();
      } catch (error) {
        console.error("Erreur d'annulation :", error);
      }
    },

    // Charger une nouvelle page de réservations
    async chargerPage(url) {
      try {
        const response = await axios.get(url);
        this.reservations = response.data.data;
        this.pagination = {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          nextPageUrl: response.data.next_page_url,
          prevPageUrl: response.data.prev_page_url
        };
      } catch (error) {
        console.error("Erreur lors du chargement de la page :", error);
      }
    }
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

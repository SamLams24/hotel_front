<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Réservations</h2>

    <ul v-if="reservations.length" class="space-y-6 max-w-4xl mx-auto">
      <li
        v-for="reservation in reservations"
        :key="reservation.id"
        class="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div class="text-gray-700 space-y-1">
          <p><span class="font-semibold">Chambre :</span> {{ reservation.chambre_id }}</p>
          <p><span class="font-semibold">Réservée le :</span> {{ reservation.date_reservation }}</p>
          <p><span class="font-semibold">Arrivée :</span> {{ reservation.date_arrive }}</p>
          <p><span class="font-semibold">Départ :</span> {{ reservation.date_depart }}</p>
          <p><span class="font-semibold">Durée :</span> {{ reservation.dure_reservation }} jour(s)</p>
        </div>

        <div class="mt-4 md:mt-0 md:ml-4 flex space-x-3">
          <button @click="ouvrirModalModif(reservation)" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Modifier
          </button>
          <button @click="ouvrirModalAnnulation(reservation)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Annuler
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-center text-gray-600">Aucune réservation trouvée.</p>

    <!-- Modal Modification -->
    <div v-if="showModalModif" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Modifier Réservation</h3>
        <label class="block mb-2">
          Arrivée :
          <input type="date" v-model="form.date_arrive" class="w-full border rounded p-2 mt-1" />
        </label>
        <label class="block mb-4">
          Départ :
          <input type="date" v-model="form.date_depart" class="w-full border rounded p-2 mt-1" />
        </label>
        <div class="flex justify-end space-x-2">
          <button @click="fermerModalModif" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded">Annuler</button>
          <button @click="modifierReservation" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Enregistrer</button>
        </div>
      </div>
    </div>

    <!-- Modal Annulation -->
    <div v-if="showModalAnnul" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Confirmer l'annulation</h3>
        <p class="text-gray-700 mb-4">Voulez-vous vraiment annuler la réservation de la chambre {{ reservationAAnnuler?.chambre_id }} ?</p>
        <div class="flex justify-end space-x-2">
          <button @click="fermerModalAnnulation" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded">Non</button>
          <button @click="confirmerAnnulation" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Oui, annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      reservationAAnnuler: null
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('/reservation');
      this.reservations = response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  },
  methods: {
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
    }
  }
};
</script>

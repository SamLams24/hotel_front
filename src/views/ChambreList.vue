<template>
  <div class="container mx-auto px-4 py-8">

    <HomeView />

    <!-- Liste des chambres -->
    <h2 class="text-center text-3xl font-bold text-gray-800 mb-8 mt-12">Nos Chambres</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div
        v-for="chambre in chambres"
        :key="chambre.id"
        class="card bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300"
      >
        <!-- Affichage de l'image de la chambre -->
        <img
          :src="`http://localhost:8000/storage/${chambre.photo}` || 'https://via.placeholder.com/300'"
          alt="Chambre"
          class="w-full h-56 object-cover"
        />
        <div class="p-6">
          <h3 class="text-2xl font-semibold text-gray-800">{{ chambre.type }}</h3>
          <p class="text-gray-600 mt-2">Numéro: {{ chambre.numero_chambre }}</p>
          <p class="text-xl font-bold text-gray-900 mt-4">{{ chambre.prix_nuite }}€ / nuit</p>
          <p
            :class="{
              'text-green-500': chambre.disponibilite,
              'text-red-500': !chambre.disponibilite
            }"
            class="mt-2"
          >
            {{ chambre.disponibilite ? 'Disponible' : 'Indisponible' }}
          </p>
          <p class="text-sm text-gray-500 mt-2">Ajouté le: {{ new Date(chambre.date).toLocaleDateString() }}</p>
          <button
            @click="openModal(chambre.id)"
            :disabled="!chambre.disponibilite"
            class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ chambre.disponibilite ? 'Réserver' : 'Indisponible' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de réservation -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Réservez votre chambre</h3>

        <label for="phone" class="block mb-2">Numéro de téléphone</label>
        <input
          v-model="phoneNumber"
          id="phone"
          type="tel"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Entrez votre numéro"
        />

        <label for="dateArrive" class="block mb-2">Date d'arrivée</label>
        <input
          v-model="dateArrive"
          id="dateArrive"
          type="date"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        <label for="dateDepart" class="block mb-2">Date de départ</label>
        <input
          v-model="dateDepart"
          id="dateDepart"
          type="date"
          class="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        <div class="flex justify-between mt-4">
          <button @click="makeReservation" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Réserver
          </button>
          <button @click="closeModal" class="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">
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
      showModal: false,
      selectedChambreId: null
    };
  },
  async created() {
    try {
      const response = await axios.get('/chambre');
      this.chambres = response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres", error);
    }
  },
  methods: {
    // Ouvrir le modal de réservation
    openModal(chambreId) {
      this.selectedChambreId = chambreId;
      this.showModal = true;
    },
    // Fermer le modal
    closeModal() {
      this.showModal = false;
      this.phoneNumber = '';
      this.dateArrive = '';
      this.dateDepart = '';
    },
    // Fonction pour effectuer la réservation avec les informations nécessaires
    async makeReservation() {
  if (!this.phoneNumber || !this.dateArrive || !this.dateDepart) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  try {
    // Appel à Laravel pour créer une réservation et obtenir l'URL de paiement
    const response = await axios.post(`/reservation`, {
      user_id: 1, // Remplace par l'ID dynamique plus tard
      chambre_id: this.selectedChambreId,
      date_arrive: this.dateArrive,
      date_depart: this.dateDepart,
      phone_number: this.phoneNumber
    });

    const paymentUrl = response.data.redirect_url;

    if (paymentUrl) {
      this.closeModal(); // Ferme le modal
      window.location.href = paymentUrl; // Redirige vers la page de paiement FedaPay
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
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.05);
}
</style>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Section d'accueil avec une belle image de fond -->
    <HomeView />

    <!-- Liste des chambres -->
    <h2 class="text-center text-3xl font-bold text-gray-800 mb-8 mt-12">Nos Chambres</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div 
        v-for="chambre in chambres" 
        :key="chambre.id" 
        class="card bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300"
      >
        <img 
          :src="chambre.image || 'https://via.placeholder.com/300'" 
          alt="Chambre" 
          class="w-full h-56 object-cover"
        />
        <div class="p-6">
          <h3 class="text-2xl font-semibold text-gray-800">{{ chambre.type }}</h3>
          <p class="text-gray-600 mt-2">Numéro: {{ chambre.numero_chambre }}</p>
          <p class="text-xl font-bold text-gray-900 mt-4">{{ chambre.prix_nuite }}€ / nuit</p>
          <p :class="{'text-green-500': chambre.disponibilite, 'text-red-500': !chambre.disponibilite}" class="mt-2">
            {{ chambre.disponibilite ? 'Disponible' : 'Indisponible' }}
          </p>
          <p class="text-sm text-gray-500 mt-2">Ajouté le: {{ new Date(chambre.date).toLocaleDateString() }}</p>
          <button 
            :disabled="!chambre.disponibilite" 
            class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ chambre.disponibilite ? 'Réserver' : 'Indisponible' }}
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
      chambres: []
    };
  },
  async created() {
    try {
      const response = await axios.get('/chambre');
      this.chambres = response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres", error);
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

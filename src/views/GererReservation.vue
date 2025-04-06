<template>
    <div class="container">
      <h2 class="text-2xl font-bold mb-4">Gestion des Réservations</h2>
  
      <!-- Liste des réservations -->
      <div v-if="reservations.length > 0">
        <ul>
          <li v-for="reservation in reservations" :key="reservation.id" class="reservation-item">
            <p><strong>Numéro :</strong> {{ reservation.numero_reservation }}</p>
            <p><strong>Chambre :</strong> {{ reservation.chambre_id }}</p>
            <p><strong>Utilisateur :</strong> {{ reservation.user_id }}</p>
            <p><strong>Date Arrivée :</strong> {{ reservation.date_arrive }}</p>
            <p><strong>Date Départ :</strong> {{ reservation.date_depart }}</p>
            <button @click="deleteReservation(reservation.id)" class="btn-danger">Supprimer</button>
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
        reservations: []
      };
    },
    created() {
      this.getReservations();
    },
    methods: {
      async getReservations() {
        try {
          const response = await axios.get('/api/reservations');
          this.reservations = response.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des réservations", error);
        }
      },
      async deleteReservation(id) {
        try {
          await axios.delete(`/api/reservations/${id}`);
          this.reservations = this.reservations.filter(reservation => reservation.id !== id);
        } catch (error) {
          console.error("Erreur lors de la suppression de la réservation", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .reservation-item {
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
  
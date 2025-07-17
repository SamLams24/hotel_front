<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p class="mt-2 text-gray-600">
          Bienvenue cher, {{ authStore.user?.name }}. Voici votre aperçu.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-if="canViewRooms"
          class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
                <svg></svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">
                  Chambres Totales
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ chambres.length }}
                </p>
              </div>
            </div>
            <div class="mt-6">
              <router-link
                to="/adminChambres"
                class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Gérer les chambres
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </router-link>
            </div>
          </div>
        </div>

        <div
          v-if="canViewAllReservations"
          class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-100 text-green-600">
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">
                  Réservations Actives
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ reservations.length }}
                </p>
              </div>
            </div>
            <div class="mt-6">
              <router-link
                to="/adminReservations"
                class="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
              >
                Voir les réservations
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Carte Utilisateurs (Visible par Super-Admin uniquement) -->
        <div
          v-if="canManageUsers"
          class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-purple-100 text-purple-600">
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">
                  Utilisateurs Inscrits
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ users.length }}
                </p>
              </div>
            </div>
            <div class="mt-6">
              <router-link
                to="/adminUsers"
                class="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                Gérer les utilisateurs
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </router-link>
            </div>
          </div>
        </div>

        <div
          v-if="canViewBarStats"
          class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div class="p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <span class="text-2xl">💰</span>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">
                  Revenus du jour - Bar
                </p>
                <p class="text-2xl font-semibold text-gray-900">
                  {{ stats.todayRevenue || 0 }} FCFA
                </p>
              </div>
            </div>
            <div class="mt-6">
              <router-link
                to="/adminBar"
                class="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-500"
              >
                Gérer le bar
                <img
                  src="@/assets/icons/bed.svg"
                  alt="Chambre"
                  class="h-5 w-5 ml-2"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Activité récente
        </h2>
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div
              v-if="canViewAllReservations && recentReservation"
              class="p-4 hover:bg-gray-50"
            >
              <p>
                Nouvelle réservation pour la chambre #{{
                  recentReservation.chambre.numero_chambre
                }}
              </p>
            </div>

            <div
              v-if="canManageUsers && recentUser"
              class="p-4 hover:bg-gray-50"
            >
              <p>{{ recentUser.name }} s'est inscrit(e).</p>
            </div>

            <div
              v-if="canViewBarStats && recentBarOrder"
              class="p-4 hover:bg-gray-50"
            >
              <p>
                Nouvelle commande au bar pour la chambre #{{
                  recentBarOrder.room_number
                }}
              </p>
            </div>

            <div
              v-if="
                !canViewAllReservations && !canManageUsers && !canViewBarStats
              "
              class="p-4 text-center text-gray-500"
            >
              Aucune activité à afficher pour votre rôle.
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const authStore = useAuthStore();
const chambres = ref([]);
const reservations = ref([]);
const users = ref([]);
const stats = ref({});

const canViewRooms = computed(() => authStore.can("room-list"));
const canViewAllReservations = computed(() =>
  authStore.can("reservation-list-all")
);
const canManageUsers = computed(() => authStore.can("user-list"));
const canViewBarStats = computed(() => authStore.can("bar-stats-view"));

const recentReservation = computed(() =>
  reservations.value.length > 0 ? reservations.value[0] : null
);
const recentUser = computed(() =>
  users.value.length > 0 ? users.value[users.value.length - 1] : null
);
const recentBarOrder = computed(() =>
  stats.value.recentOrders && stats.value.recentOrders.length > 0
    ? stats.value.recentOrders[0]
    : null
);

onMounted(async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` };

  const requests = [];

  if (canViewRooms.value) {
    requests.push(axios.get("/chambres", { headers }));
  }
  if (canViewAllReservations.value) {
    requests.push(axios.get("/reservations", { headers }));
  }
  if (canManageUsers.value) {
    requests.push(axios.get("/users", { headers }));
  }
  if (canViewBarStats.value) {
    requests.push(axios.get("/bar-stats", { headers }));
  }

  const responses = await Promise.all(requests);

  let responseIndex = 0;
  if (canViewRooms.value)
    chambres.value = responses[responseIndex++].data.chambres;
  if (canViewAllReservations.value)
    reservations.value = responses[responseIndex++].data.data;
  if (canManageUsers.value) users.value = responses[responseIndex++].data;
  if (canViewBarStats.value) stats.value = responses[responseIndex++].data;
});
</script>

<style scoped>
.bg-white {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.bg-white:hover {
  transform: translateY(-2px);
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
}
</style>

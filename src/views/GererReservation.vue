<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-800">
            🗓️ Gestion des Réservations
          </h1>
          <p class="text-gray-600 mt-2">
            Créez et administrez les réservations des clients.
          </p>
        </div>
        <button
          @click="showForm = !showForm"
          class="btn-primary flex items-center"
        >
          <span class="mr-2">{{ showForm ? "➖" : "➕" }}</span>
          {{ showForm ? "Masquer le formulaire" : "Nouvelle Réservation" }}
        </button>
      </div>

      <!-- Formulaire de création/modification -->
      <transition name="slide-fade">
        <div v-if="showForm" class="bg-white shadow-xl rounded-lg p-6 mb-8">
          <h2 class="text-2xl font-semibold mb-6">{{ formTitle }}</h2>

          <form @submit.prevent="submitReservation" class="space-y-6">
            <!-- Section Recherche Client -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Client <span class="text-red-500">*</span>
              </label>
              <div
                v-if="selectedUser"
                class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p class="font-semibold">{{ selectedUser.name }}</p>
                  <p class="text-sm text-gray-600">{{ selectedUser.email }}</p>
                </div>
                <button
                  @click="resetUserSelection"
                  type="button"
                  class="p-2 text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
              <div v-else class="relative">
                <input
                  v-model="userSearchQuery"
                  @input="debouncedSearchUsers"
                  type="text"
                  placeholder="Taper le nom ou l'email du client..."
                  class="input"
                />
                <ul
                  v-if="userSearchResults.length > 0"
                  class="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto"
                >
                  <li
                    v-for="user in userSearchResults"
                    :key="user.id"
                    @click="selectUser(user)"
                    class="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {{ user.name }} ({{ user.email }})
                  </li>
                </ul>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                Client non trouvé ?
                <button
                  @click="showNewUserModal = true"
                  type="button"
                  class="text-blue-600 hover:underline"
                >
                  Créer un nouveau compte.
                </button>
              </p>
            </div>

            <!-- Champs de réservation -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Chambre <span class="text-red-500">*</span></label
                >
                <select v-model="formData.chambre_id" required class="input">
                  <option value="" disabled>
                    Sélectionnez une chambre disponible
                  </option>
                  <option
                    v-for="chambre in availableRooms"
                    :key="chambre.id"
                    :value="chambre.id"
                  >
                    N°{{ chambre.numero_chambre }} ({{ chambre.type }}) -
                    {{ chambre.prix_nuite }} FCFA
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Durée du séjour</label
                >
                <input
                  :value="
                    durationDays > 0
                      ? `${durationDays} jour(s)`
                      : 'Non calculée'
                  "
                  type="text"
                  disabled
                  class="input bg-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Date d'arrivée <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.date_arrive"
                  type="date"
                  required
                  @change="calculateDuration"
                  class="input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Date de départ <span class="text-red-500">*</span></label
                >
                <input
                  v-model="formData.date_depart"
                  type="date"
                  required
                  @change="calculateDuration"
                  class="input"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
              <button @click="cancelForm" type="button" class="btn-secondary">
                Annuler
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSubmitting"
              >
                {{ submitButtonText }}
              </button>
            </div>
          </form>
        </div>
      </transition>

      <!-- Liste des réservations -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <ul v-if="reservations.length" class="divide-y divide-gray-200">
          <li
            v-for="reservation in reservations"
            :key="reservation.id"
            class="p-4 hover:bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center"
          >
            <div>
              <p class="font-semibold text-blue-700">
                #{{ reservation.numero_reservation }}
              </p>
              <p class="text-sm text-gray-800">
                Chambre {{ reservation.chambre.numero_chambre }} ({{
                  reservation.chambre.type
                }})
              </p>
              <p class="text-sm text-gray-600">
                Client : {{ reservation.user.name }}
              </p>
              <p class="text-sm text-gray-500">
                Du {{ formatDate(reservation.date_arrive) }} au
                {{ formatDate(reservation.date_depart) }}
              </p>
            </div>
            <div class="flex space-x-2 mt-3 sm:mt-0">
              <button
                @click="editReservation(reservation)"
                class="btn-icon-edit"
              >
                ✏️
              </button>
              <button
                @click="confirmDelete(reservation.id)"
                class="btn-icon-delete"
              >
                🗑️
              </button>
            </div>
          </li>
        </ul>
        <p v-else class="p-8 text-center text-gray-500">
          Aucune réservation à afficher.
        </p>
      </div>
    </div>

    <!-- Modal Nouveau Client -->
    <div
      v-if="showNewUserModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Créer un nouveau client</h3>
        <form @submit.prevent="handleCreateUser" class="space-y-4">
          <input
            v-model="newUserForm.name"
            placeholder="Nom complet"
            class="input"
            required
          />
          <input
            v-model="newUserForm.email"
            type="email"
            placeholder="Email"
            class="input"
            required
          />
          <input
            v-model="newUserForm.password"
            type="password"
            placeholder="Mot de passe temporaire"
            class="input"
            required
          />
          <div class="flex justify-end space-x-4">
            <button
              @click="showNewUserModal = false"
              type="button"
              class="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="isCreatingUser"
            >
              Créer et Sélectionner
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const reservations = ref([]);
const chambres = ref([]);
const toast = useToast();
const showForm = ref(false);
const editingReservation = ref(null);
const isSubmitting = ref(false);

const userSearchQuery = ref("");
const userSearchResults = ref([]);
const selectedUser = ref(null);
const debounceTimer = ref(null);

const showNewUserModal = ref(false);
const isCreatingUser = ref(false);
const newUserForm = ref({ name: "", email: "", password: "" });

const formData = ref({
  user_id: "",
  chambre_id: "",
  date_arrive: "",
  date_depart: ""
});
const durationDays = ref(0);

const formTitle = computed(() =>
  editingReservation.value
    ? "Modifier la Réservation"
    : "Créer une Nouvelle Réservation"
);
const submitButtonText = computed(() => {
  if (isSubmitting.value) return "Enregistrement...";
  return editingReservation.value
    ? "Mettre à jour"
    : "Confirmer la Réservation";
});
const availableRooms = computed(() => {
  return chambres.value.filter(
    (c) =>
      c.disponibilite ||
      (editingReservation.value && c.id === editingReservation.value.chambre_id)
  );
});

const fetchAllData = async () => {
  try {
    const [resReservations, resChambres] = await Promise.all([
      axios.get("/reservations"),
      axios.get("/chambres")
    ]);
    reservations.value = resReservations.data.data;
    chambres.value = resChambres.data.chambres;
  } catch (error) {
    toast.error("Erreur de chargement des données.");
  }
};

const calculateDuration = () => {
  if (formData.value.date_arrive && formData.value.date_depart) {
    const start = new Date(formData.value.date_arrive);
    const end = new Date(formData.value.date_depart);
    durationDays.value =
      end > start ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : 0;
  } else {
    durationDays.value = 0;
  }
};

const searchUsers = async () => {
  if (userSearchQuery.value.length < 2) {
    userSearchResults.value = [];
    return;
  }
  try {
    const response = await axios.get(
      `/users/search?query=${userSearchQuery.value}`
    );
    userSearchResults.value = response.data;
  } catch (error) {
    console.error("Erreur recherche client:", error);
  }
};

const debouncedSearchUsers = () => {
  clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(searchUsers, 300);
};

const selectUser = (user) => {
  selectedUser.value = user;
  userSearchResults.value = [];
};

const resetUserSelection = () => {
  selectedUser.value = null;
  userSearchQuery.value = "";
};

const handleCreateUser = async () => {
  isCreatingUser.value = true;
  try {
    const response = await axios.post("/users", newUserForm.value);
    toast.success(`Client "${response.data.user.name}" créé !`);
    selectUser(response.data.user);
    showNewUserModal.value = false;
    newUserForm.value = { name: "", email: "", password: "" };
  } catch (error) {
    toast.error("Erreur: Impossible de créer le client.");
  } finally {
    isCreatingUser.value = false;
  }
};

const submitReservation = async () => {
  if (!selectedUser.value) {
    toast.warning("Veuillez d'abord rechercher et sélectionner un client.");
    return;
  }
  isSubmitting.value = true;
  formData.value.user_id = selectedUser.value.id;

  try {
    if (editingReservation.value) {
      await axios.put(
        `/reservation/${editingReservation.value.id}`,
        formData.value
      );
      toast.success("Réservation mise à jour avec succès !");
    } else {
      await axios.post("/reservation", formData.value);
      toast.success("Réservation créée avec succès !");
    }
    await fetchAllData();
    cancelForm();
  } catch (error) {
    toast.error(error.response?.data?.message || "Une erreur est survenue.");
  } finally {
    isSubmitting.value = false;
  }
};

const cancelForm = () => {
  showForm.value = false;
  editingReservation.value = null;
  resetUserSelection();
  formData.value = {
    user_id: "",
    chambre_id: "",
    date_arrive: "",
    date_depart: ""
  };
  durationDays.value = 0;
};

const editReservation = (reservation) => {
  editingReservation.value = reservation;
  formData.value = { ...reservation };
  selectUser(reservation.user);
  calculateDuration();
  showForm.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const confirmDelete = (reservationId) => {
  if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
    deleteReservation(reservationId);
  }
};

const deleteReservation = async (reservationId) => {
  try {
    await axios.delete(`/reservation/${reservationId}`);
    toast.success("Réservation annulée.");
    await fetchAllData();
  } catch (error) {
    toast.error("Erreur lors de l'annulation.");
  }
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

onMounted(fetchAllData);
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition;
}
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 transition;
}
.btn-icon-edit {
  @apply p-2 rounded-full text-yellow-600 hover:bg-yellow-100 transition;
}
.btn-icon-delete {
  @apply p-2 rounded-full text-red-600 hover:bg-red-100 transition;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

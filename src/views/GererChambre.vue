<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec recherche -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🏨 Gestion des Chambres</h1>
          <p class="text-gray-600 mt-2">Administrez l'ensemble des chambres de votre établissement</p>
        </div>
        
        <div class="flex gap-3 w-full sm:w-auto">
          <div class="relative flex-grow sm:w-64">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher une chambre..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
            <div class="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
          <button 
            @click="toggleForm"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center whitespace-nowrap"
          >
            {{ showForm ? '❌ Fermer' : '➕ Ajouter' }}
          </button>
        </div>
      </div>

      <!-- Formulaire -->
      <transition name="slide-fade">
        <div v-if="showForm" class="bg-white shadow-xl rounded-xl p-6 mb-8">
          <h3 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
            <span class="mr-2">{{ editingChambre ? "✏️" : "➕" }}</span>
            {{ editingChambre ? "Modifier la Chambre" : "Nouvelle Chambre" }}
          </h3>

          <form @submit.prevent="submitChambre" class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre</label>
              <input
                v-model="formData.numero_chambre"
                type="text"
                placeholder="Ex: 101"
                class="input"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de chambre</label>
              <select
                v-model="formData.type"
                class="input"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="Simple">Simple</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix par nuit (FCFA)</label>
              <input
                v-model="formData.prix_nuite"
                type="number"
                min="0"
                placeholder="Ex: 50000"
                class="input"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="Décrivez la chambre..."
                class="input"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <select
                v-model="formData.disponibilite"
                class="input"
                required
              >
                <option value="1">Disponible</option>
                <option value="0">Non disponible</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Photo de la chambre</label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition"
                @click="$refs.fileInput.click()"
              >
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden"
                >
                <div v-if="!formData.photo" class="text-center">
                  <span class="text-5xl mb-2 block">🖼️</span>
                  <p class="text-gray-500">Cliquez pour sélectionner une image</p>
                  <p class="text-sm text-gray-400 mt-2">Formats acceptés: JPG, PNG (max 2MB)</p>
                </div>
                <div v-else class="relative w-full max-w-md">
                  <img
                    :src="getImageUrl(formData.photo)"
                    class="max-h-64 w-full object-cover rounded-md"
                    alt="Aperçu de la chambre"
                  />
                  <button
                    type="button"
                    @click.stop="removePhoto"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 flex justify-end gap-4 pt-4">
              <button 
                type="button" 
                @click="cancelForm"
                class="btn-cancel"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="btn-submit"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Envoi en cours...</span>
                <span v-else>{{ editingChambre ? 'Mettre à jour' : 'Ajouter la chambre' }}</span>
              </button>
            </div>
          </form>
        </div>
      </transition>

      <!-- Liste des chambres -->
      <div v-if="filteredChambres.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="chambre in filteredChambres"
          :key="chambre.id"
          class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        ><span class="absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded-full z-10"
          :class="chambre.disponibilite == '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ chambre.disponibilite == '1' ? 'Disponible' : 'Occupée' }}
          </span>
              <div class="relative">
            <img
              :src="getImageUrl(chambre.photo)"
              class="w-full h-48 object-cover"
              :alt="'Chambre ' + chambre.numero_chambre"
            />
            <span class="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              {{ chambre.type }}
            </span>
          </div>
          
          <div class="p-5">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold text-gray-800">Chambre {{ chambre.numero_chambre }}</h3>
              <span class="text-lg font-semibold text-blue-600">
                {{ formatPrix(chambre.prix_nuite) }} FCFA
              </span>
            </div>
            
            <div class="mt-4 flex justify-between">
              <button 
                @click="editChambre(chambre)"
                class="btn-action-edit"
                title="Modifier"
              >
                ✏️ Modifier
              </button>
              <button 
                @click="confirmDelete(chambre.id)"
                class="btn-action-delete"
                title="Supprimer"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-500 text-lg">Aucune chambre trouvée</p>
        <button 
          @click="showForm = true"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Ajouter votre première chambre
        </button>
      </div>

      <!-- Modal de confirmation -->
      <transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-4">
                ❗
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                <p class="mt-2 text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer cette chambre ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button 
                @click="showDeleteModal = false" 
                class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button 
                @click="deleteChambre" 
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
/* eslint-disable */
export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      chambres: [],
      searchQuery: '',
      showForm: false,
      editingChambre: null,
      showDeleteModal: false,
      chambreToDelete: null,
      isSubmitting: false,
      selectedFile: null,
      formData: {
        numero_chambre: "",
        type: "",
        prix_nuite: "",
        photo: "",
        description: "",
        disponibilite: "1"

      }
    };
  },
  computed: {
    filteredChambres() {
      const query = this.searchQuery.toLowerCase();
      return this.chambres.filter(chambre => 
        String(chambre.numero_chambre).includes(query) ||
        chambre.type.toLowerCase().includes(query) ||
        chambre.prix_nuite.toString().includes(query)
      );
    }
  },
  created() {
    this.getChambres();
  },
  methods: {
    getApiBaseUrl() {
      return process.env.VUE_APP_API_URL || 'http://localhost:8000/api';
    },
    
    getAuthHeader() {
      const token = localStorage.getItem('token');
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    },
    
    async getChambres() {
      try {
        const response = await axios.get(`${this.getApiBaseUrl()}/chambres`, {
          headers: this.getAuthHeader()
        });
        this.chambres = response.data.chambres;
      } catch (error) {
        console.error("Erreur lors de la récupération des chambres", error);
        this.toast.error(error.response?.data?.message || "Erreur lors de la récupération des chambres");
      }
    },
    
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) this.cancelForm();
    },
    
    editChambre(chambre) {
      this.formData = { ...chambre };
      this.editingChambre = chambre.id;
      this.selectedFile = null;
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    cancelForm() {
      this.formData = { numero_chambre: "", type: "", prix_nuite: "",description: "", photo: "" };
      this.selectedFile = null;
      this.editingChambre = null;
      if (this.$refs.fileInput) this.$refs.fileInput.value = "";
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        this.toast.error("Veuillez sélectionner une image valide (JPG, PNG)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.toast.error("La taille de l'image ne doit pas dépasser 2MB");
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removePhoto() {
      this.formData.photo = "";
      this.selectedFile = null;
      if (this.$refs.fileInput) this.$refs.fileInput.value = "";
    },

    getImageUrl(photo) {
      if (!photo) return 'https://via.placeholder.com/400x300?text=Chambre';
      return `http://localhost:8000/storage/${photo}`;
    },

    async submitChambre() {
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        
        formData.append('numero_chambre', this.formData.numero_chambre);
        formData.append('type', this.formData.type);
        formData.append('prix_nuite', this.formData.prix_nuite);
        formData.append('disponibilite', this.formData.disponibilite);
        formData.append('description', this.formData.description);

        
        if (this.selectedFile) {
          formData.append('photo', this.selectedFile);
        } else if (this.editingChambre && this.formData.photo) {
          if (this.formData.photo.startsWith('data:')) {
            const blob = await fetch(this.formData.photo).then(r => r.blob());
            formData.append('photo', blob, 'photo.jpg');
          } else {
            formData.append('photo', this.formData.photo);
          }
        }

        let response;
        if (this.editingChambre) {
          response = await axios.put(`${this.getApiBaseUrl()}/chambre/${this.editingChambre}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': this.getAuthHeader().Authorization
            }
          });
          this.chambres = this.chambres.map(c => 
            c.id === this.editingChambre ? response.data.chambre : c
          );
        } else {
          response = await axios.post(`${this.getApiBaseUrl()}/chambre`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': this.getAuthHeader().Authorization
            }
          });
          this.chambres.push(response.data);
        }
        
        this.showForm = false;
        this.cancelForm();
        this.toast.success(`Chambre ${this.editingChambre ? 'modifiée' : 'ajoutée'} avec succès`);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
        this.toast.error(error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement");
      } finally {
        this.isSubmitting = false;
      }
    },
    
    confirmDelete(id) {
      this.chambreToDelete = id;
      this.showDeleteModal = true;
    },
    
    async deleteChambre() {
      try {
        await axios.delete(`${this.getApiBaseUrl()}/chambre/${this.chambreToDelete}`, {
          headers: this.getAuthHeader()
        });
        this.chambres = this.chambres.filter(c => c.id !== this.chambreToDelete);
        this.showDeleteModal = false;
        this.toast.success("Chambre supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
        this.toast.error(error.response?.data?.message || "Erreur lors de la suppression");
      }
    },
    
    formatPrix(prix) {
      return new Intl.NumberFormat('fr-FR').format(prix);
    }
  }
};
</script>

<style scoped>
/* Styles de base */
.input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200;
}

.btn-submit {
  @apply px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-cancel {
  @apply px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm;
}

.btn-action-edit {
  @apply px-4 py-2 bg-amber-400 text-gray-800 font-medium rounded-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 text-sm;
}

.btn-action-delete {
  @apply px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm;
}

/* Animations */
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Effets au survol */
.bg-white {
  @apply transition-all duration-300;
}

button {
  @apply transform hover:scale-[1.02] active:scale-95 transition-transform;
}

/* Zone de dépôt de fichier */
.border-dashed {
  @apply transition-colors duration-200;
}
.border-dashed:hover {
  @apply border-blue-400 bg-blue-50;
}
</style>
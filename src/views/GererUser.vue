<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header avec recherche et bouton d'ajout -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">👥 Gestion des Utilisateurs</h1>
          <p class="text-gray-600 mt-2">Administrez les comptes utilisateurs de votre système</p>
        </div>
        
        <div class="flex gap-3 w-full sm:w-auto">
          <div class="relative flex-grow sm:w-64">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un utilisateur..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
            <div class="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
          <button 
            @click="showAddUserForm"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center whitespace-nowrap"
          >
            ➕ Nouvel utilisateur
          </button>
        </div>
      </div>

      <!-- Formulaire d'ajout/modification -->
      <transition name="slide-fade">
        <div v-if="showForm" class="bg-white shadow-xl rounded-xl p-6 mb-8">
          <h3 class="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
            <span class="mr-2">{{ editingUser ? "✏️" : "➕" }}</span>
            {{ editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur" }}
          </h3>

          <form @submit.prevent="submitUser" class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Ex: Jean Dupont"
                class="input"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="Ex: jean@example.com"
                class="input"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="editingUser ? 'Laisser vide pour ne pas changer' : 'Mot de passe'"
                class="input"
                :required="!editingUser"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="text-xs text-gray-500 mt-1 flex items-center"
              >
                {{ showPassword ? '👁️ Masquer' : '👁️ Afficher' }}
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                v-model="formData.is_admin"
                class="input"
                required
              >
                <option :value="false">Utilisateur standard</option>
                <option :value="true">Administrateur</option>
              </select>
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
              >
                {{ editingUser ? 'Mettre à jour' : 'Créer le compte' }}
              </button>
            </div>
          </form>
        </div>
      </transition>

      <!-- Liste des utilisateurs -->
      <div v-if="filteredUsers.length > 0" class="bg-white shadow-md rounded-xl overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {{ userInitial(user.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'" 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.is_admin ? 'Administrateur' : 'Utilisateur' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  ✏️ Modifier
                </button>
                <button 
                  @click="confirmDelete(user.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
        <button 
          @click="showAddUserForm"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Ajouter votre premier utilisateur
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
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
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
                @click="deleteUser" 
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
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      searchQuery: '',
      showForm: false,
      editingUser: null,
      showDeleteModal: false,
      userToDelete: null,
      showPassword: false,
      formData: {
        name: "",
        email: "",
        password: "",
        is_admin: false
      }
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.is_admin ? 'admin' : 'utilisateur').includes(query)
      );
    }
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const response = await axios.get('/api/users');
        this.users = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    },
    
    showAddUserForm() {
      this.resetForm();
      this.editingUser = null;
      this.showForm = true;
    },
    
    editUser(user) {
      this.formData = {
        name: user.name,
        email: user.email,
        password: '',
        is_admin: user.is_admin
      };
      this.editingUser = user.id;
      this.showForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        password: "",
        is_admin: false
      };
      this.showPassword = false;
    },
    
    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },
    
    async submitUser() {
      try {
        if (this.editingUser) {
          // Mise à jour avec PUT
          const payload = { ...this.formData };
          if (!payload.password) delete payload.password;
          
          await axios.put(`/api/users/${this.editingUser}`, payload);
          this.users = this.users.map(u => 
            u.id === this.editingUser ? { ...u, ...payload } : u
          );
        } else {
          // Création avec POST
          const response = await axios.post('/api/users', this.formData);
          this.users.push(response.data);
        }
        
        this.showForm = false;
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement", error);
      }
    },
    
    confirmDelete(id) {
      this.userToDelete = id;
      this.showDeleteModal = true;
    },
    
    async deleteUser() {
      try {
        await axios.delete(`/api/users/${this.userToDelete}`);
        this.users = this.users.filter(u => u.id !== this.userToDelete);
        this.showDeleteModal = false;
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
      }
    },
    
    userInitial(name) {
      return name ? name.charAt(0).toUpperCase() : '?';
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
  @apply px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm;
}

.btn-cancel {
  @apply px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm;
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
tr {
  @apply transition-colors duration-150;
}

button {
  @apply transform hover:scale-[1.02] active:scale-95 transition-transform;
}
</style>
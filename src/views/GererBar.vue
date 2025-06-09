<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec onglets -->
      <div class="flex flex-col mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">🍹 Gestion du Bar</h1>
        <div class="flex space-x-4 border-b border-gray-200">
          <button 
            v-for="(tab, index) in tabs"
            :key="index"
            @click="activeTab = tab.id"
            :class="{
              'border-blue-500 text-blue-600': activeTab === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== tab.id
            }"
            class="py-4 px-1 inline-flex items-center text-sm font-medium border-b-2"
          >
            <span class="mr-2 text-lg">{{ tab.icon }}</span>
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Section Commandes en cours -->
      <div v-if="activeTab === 'orders'" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">📋 Commandes en cours</h2>
          <div class="flex space-x-4">
            <button 
              @click="showOrderForm = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              ➕ Nouvelle commande
            </button>
            <div class="relative w-64">
              <input 
                v-model="orderSearch"
                type="text" 
                placeholder="Rechercher une commande..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
              <div class="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div class="p-5 border-b border-gray-200 bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-gray-800">Commande #{{ order.id }}</h3>
                  <p class="text-sm text-gray-500">{{ order.roomNumber ? 'Chambre ' + order.roomNumber : 'Client non résident' }}</p>
                </div>
                <span :class="{
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'preparing',
                  'bg-green-100 text-green-800': order.status === 'ready',
                  'bg-purple-100 text-purple-800': order.status === 'delivered'
                }" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <div class="p-5">
              <h4 class="font-medium text-gray-700 mb-3">Articles commandés:</h4>
              <ul class="space-y-3">
                <li 
                  v-for="(item, index) in order.items" 
                  :key="index"
                  class="flex justify-between"
                >
                  <span class="text-gray-600">{{ item.quantity }}x {{ item.name }}</span>
                  <span class="font-medium">{{ formatPrice(item.price * item.quantity) }} FCFA</span>
                </li>
              </ul>

              <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span class="font-bold">Total:</span>
                <span class="font-bold text-lg text-blue-600">
                  {{ formatPrice(order.total) }} FCFA
                </span>
              </div>
            </div>

            <div class="px-5 py-3 bg-gray-50 flex justify-end space-x-2">
              <button 
                @click="printInvoice(order)"
                class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
              >
                🖨️ Imprimer
              </button>
              <button 
                v-if="order.status === 'pending'"
                @click="updateOrderStatus(order.id, 'preparing')"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Préparer
              </button>
              <button 
                v-if="order.status === 'preparing'"
                @click="updateOrderStatus(order.id, 'ready')"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                Prêt
              </button>
              <button 
                v-if="order.status === 'ready'"
                @click="updateOrderStatus(order.id, 'delivered')"
                class="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
              >
                Livré
              </button>
              <button 
                @click="cancelOrder(order.id)"
                class="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-500 text-lg">Aucune commande en cours</p>
        </div>
      </div>

      <!-- Section Menu du Bar -->
      <div v-if="activeTab === 'menu'" class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">📜 Menu du Bar</h2>
          <button 
            @click="showItemForm = true"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
          >
            ➕ Ajouter un article
          </button>
        </div>

        <!-- Catégories -->
        <div class="mb-6 flex space-x-2 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="activeCategory = category.id"
            :class="{
              'bg-blue-600 text-white': activeCategory === category.id,
              'bg-white text-gray-700 hover:bg-gray-100': activeCategory !== category.id
            }"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Articles -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in filteredMenuItems"
            :key="item.id"
            class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div class="relative h-48 bg-gray-200">
              <img
                :src="'http://localhost:8000'+'/storage/'+item.image || 'https://via.placeholder.com/300x200?text=Bar'"
                class="w-full h-full object-cover"
                :alt="item.name"
              />
              <span class="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-bold rounded-full">
                {{ formatPrice(item.price) }} FCFA
              </span>
            </div>
            
            <div class="p-5">
              <h3 class="text-xl font-bold text-gray-800 mb-1">{{ item.name }}</h3>
              <p class="text-gray-600 text-sm mb-3">{{ item.category }}</p>
              <p class="text-gray-500 text-sm line-clamp-2 mb-3">{{ item.description }}</p>
              
              <div class="mt-4 flex justify-between">
                <button 
                  @click="editMenuItem(item)"
                  class="px-3 py-1 bg-amber-400 text-gray-800 text-sm rounded-lg hover:bg-amber-500 transition"
                >
                  ✏️ Modifier
                </button>
                <button 
                  @click="confirmDeleteItem(item.id)"
                  class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredMenuItems.length === 0" class="bg-white rounded-xl shadow-sm p-8 text-center">
          <p class="text-gray-500 text-lg">Aucun article dans cette catégorie</p>
          <button 
            @click="showItemForm = true"
            class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            ➕ Ajouter votre premier article
          </button>
        </div>
      </div>

      <!-- Section Statistiques -->
      <div v-if="activeTab === 'stats'" class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">📊 Statistiques du Bar</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span class="text-2xl">💰</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Chiffre d'affaires (aujourd'hui)</p>
                <p class="text-2xl font-semibold">{{ formatPrice(stats.todayRevenue) }} FCFA</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span class="text-2xl">🍹</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Commandes (ce mois)</p>
                <p class="text-2xl font-semibold">{{ stats.monthlyOrders }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <span class="text-2xl">⭐</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Article populaire</p>
                <p class="text-2xl font-semibold">{{ stats.topItem || '-' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Ventes par catégorie</h3>
          <div class="h-64">
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p class="text-gray-500">Graphique des ventes par catégorie</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Articles les plus vendus</h3>
            <ul class="space-y-3">
              <li 
                v-for="(item, index) in stats.topItems" 
                :key="index"
                class="flex justify-between items-center"
              >
                <span class="text-gray-700">{{ index + 1 }}. {{ item.name }}</span>
                <span class="font-medium">{{ item.quantity }} ventes</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Dernières commandes</h3>
            <ul class="space-y-3">
              <li 
                v-for="order in stats.recentOrders" 
                :key="order.id"
                class="flex justify-between items-center"
              >
                <div>
                  <p class="text-gray-700">#{{ order.id }}</p>
                  <p class="text-sm text-gray-500">{{ formatShortDate(order.date) }}</p>
                </div>
                <span class="font-medium">{{ formatPrice(order.total) }} FCFA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout/modification d'article -->
      <transition name="modal">
        <div v-if="showItemForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">
                  {{ editingItem ? '✏️ Modifier Article' : '➕ Nouvel Article' }}
                </h3>
                <button @click="closeItemForm" class="text-gray-400 hover:text-gray-500">
                  <span class="text-2xl">×</span>
                </button>
              </div>

              <form @submit.prevent="submitItemForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      v-model="itemForm.name"
                      type="text"
                      placeholder="Ex: Mojito"
                      class="input"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select
                      v-model="itemForm.category"
                      class="input"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option v-for="category in categories" :key="category.id" :value="category.name">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input
                      v-model="itemForm.price"
                      type="number"
                      min="0"
                      placeholder="Ex: 5000"
                      class="input"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                    <select
                      v-model="itemForm.available"
                      class="input"
                      required
                    >
                      <option :value="true">Disponible</option>
                      <option :value="false">Non disponible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    v-model="itemForm.description"
                    rows="3"
                    class="input"
                    placeholder="Description de l'article..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div 
                    class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition"
                    @click="$refs.itemFileInput.click()"
                  >
                    <input 
                      type="file" 
                      ref="itemFileInput"
                      @change="handleItemImageUpload"
                      accept="image/*"
                      class="hidden"
                    >
                    <div v-if="!itemForm.image" class="text-center">
                      <span class="text-5xl mb-2 block">🖼️</span>
                      <p class="text-gray-500">Cliquez pour sélectionner une image</p>
                      <p class="text-sm text-gray-400 mt-2">Formats acceptés: JPG, PNG (max 2MB)</p>
                    </div>
                    <div v-else class="relative w-full max-w-md">
                      <img
                        :src="'http://localhost:8000'+'/storage/'+itemForm.image"
                        class="max-h-48 w-full object-cover rounded-md"
                        alt="Aperçu de l'article"
                      />
                      <button
                        type="button"
                        @click.stop="removeItemImage"
                        class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>

                <div class="pt-4 flex justify-end gap-4">
                  <button 
                    type="button" 
                    @click="closeItemForm"
                    class="btn-cancel"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    class="btn-submit"
                    :disabled="isSubmittingItem"
                  >
                    <span v-if="isSubmittingItem">Enregistrement...</span>
                    <span v-else>{{ editingItem ? 'Mettre à jour' : 'Ajouter l\'article' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <!-- Modal Nouvelle Commande -->
      <transition name="modal">
        <div v-if="showOrderForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">➕ Nouvelle Commande</h3>
                <button @click="closeOrderForm" class="text-gray-400 hover:text-gray-500">
                  <span class="text-2xl">×</span>
                </button>
              </div>

              <form @submit.prevent="submitOrderForm" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre (optionnel)</label>
                    <input
                      v-model="orderForm.room_number"
                      type="number"
                      min="0"
                      class="input"
                      placeholder="Laisser vide si client non résident"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      v-model="orderForm.status"
                      class="input"
                      required
                    >
                      <option value="pending">En attente</option>
                      <option value="preparing">En préparation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Articles</label>
                  <div class="space-y-4">
                    <div v-for="(item, index) in orderForm.items" :key="index" class="flex items-end space-x-4">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Article</label>
                        <select
                          v-model="item.menuItemId"
                          class="input"
                          required
                          @change="updateSelectedItem(index)"
                        >
                          <option value="">Sélectionnez un article</option>
                          <option v-for="menuItem in menuItems" :key="menuItem.id" :value="menuItem.id">
                            {{ menuItem.name }} - {{ formatPrice(menuItem.price) }} FCFA
                          </option>
                        </select>
                      </div>
                      <div class="w-24">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          class="input"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        @click="removeOrderItem(index)"
                        class="p-2 text-red-500 hover:text-red-700"
                        :disabled="orderForm.items.length <= 1"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addOrderItem"
                    class="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    ➕ Ajouter un article
                  </button>
                </div>

                <div class="pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-bold">Total:</span>
                    <span class="font-bold text-lg text-blue-600">
                      {{ formatPrice(calculateOrderTotal) }} FCFA
                    </span>
                  </div>
                </div>

                <div class="pt-4 flex justify-end gap-4">
                  <button 
                    type="button" 
                    @click="closeOrderForm"
                    class="btn-cancel"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    class="btn-submit"
                    :disabled="isSubmittingOrder"
                  >
                    <span v-if="isSubmittingOrder">Enregistrement...</span>
                    <span v-else>Créer la commande</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>

      <!-- Modal de confirmation de suppression -->
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
                  Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
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
                @click="deleteMenuItem" 
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

export default {
  data() {
    return {
      activeTab: 'orders',
      tabs: [
        { id: 'orders', name: 'Commandes', icon: '📋' },
        { id: 'menu', name: 'Menu', icon: '📜' },
        { id: 'stats', name: 'Statistiques', icon: '📊' }
      ],
      
      // Commandes
      orderSearch: '',
      orders: [],
      showOrderForm: false,
      isSubmittingOrder: false,
      orderForm: {
        roomNumber: null,
        status: 'pending',
        items: [
          {
            menuItemId: '',
            quantity: 1,
            name: '',
            price: 0
          }
        ]
      },
      
      // Menu
      activeCategory: null,
      categories: [],
      menuItems: [],

      // Statistiques
      stats: {
        todayRevenue: 0,
        monthlyOrders: 0,
        topItem: '',
        topItems: [],
        recentOrders: []
      },

      // Gestion des formulaires
      showItemForm: false,
      editingItem: null,
      itemForm: {
        name: '',
        category: '',
        price: '',
        description: '',
        available: true,
        image: ''
      },
      itemImageFile: null,

      showDeleteModal: false,
      itemToDelete: null,

      isSubmitting: false,
      isSubmittingItem: false
    };
  },
  computed: {
    filteredOrders() {
      const query = this.orderSearch.toLowerCase();
      return this.orders.filter(order => 
        order.id.toString().includes(query) ||
        (order.roomNumber && order.roomNumber.toString().includes(query)) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    },
    filteredMenuItems() {
      const selectedCategory = this.activeCategory || 
                            (this.categories.length > 0 ? this.categories[0].id : null);
      const categoryName = this.categories.find(c => c.id === selectedCategory)?.name;
      return this.menuItems.filter(item => 
        !categoryName || item.category === categoryName
      );
    },
    calculateOrderTotal() {
      return this.orderForm.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
  },
  created() {
    this.fetchOrders();
    this.fetchMenuItems();
    this.fetchCategories();
    this.fetchStats();
    
    // Initialiser la catégorie active
    if (this.categories.length > 0 && !this.activeCategory) {
      this.activeCategory = this.categories[0].id;
    }
  },
  methods: {
    // API Configuration
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
    
    // Commandes API
    async fetchOrders() {
      try {
        const response = await axios.get(`${this.getApiBaseUrl()}/orders`, {
          headers: this.getAuthHeader()
        });
        this.orders = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la récupération des commandes");
        this.orders = [];
      }
    },
    
    async createOrder(orderData) {
      try {
        const response = await axios.post(
          `${this.getApiBaseUrl()}/orders`,
          orderData,
          { headers: this.getAuthHeader() }
        );
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la création de la commande");
        throw error;
      }
    },
    
    async updateOrderStatus(orderId, status) {
      try {
        await axios.put(
          `${this.getApiBaseUrl()}/orders/${orderId}/status`,
          { status },
          { headers: this.getAuthHeader() }
        );
        this.fetchOrders();
        this.$toast.success("Statut de commande mis à jour");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du statut");
      }
    },
    
    async cancelOrder(orderId) {
      try {
        await axios.delete(
          `${this.getApiBaseUrl()}/orders/${orderId}`,
          { headers: this.getAuthHeader() }
        );
        this.orders = this.orders.filter(o => o.id !== orderId);
        this.$toast.success("Commande annulée");
      } catch (error) {
        console.error("Erreur lors de l'annulation de la commande:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de l'annulation de la commande");
      }
    },
    
    // Menu API
    async fetchMenuItems() {
      try {
        const response = await axios.get(`${this.getApiBaseUrl()}/menu-items`, {
          headers: this.getAuthHeader()
        });
        this.menuItems = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération du menu:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la récupération du menu");
        this.menuItems = [];
      }
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.getApiBaseUrl()}/categories`, {
          headers: this.getAuthHeader()
        });
        this.categories = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la récupération des catégories");
        this.categories = [];
      }
    },
    
    async submitItemForm() {
      this.isSubmittingItem = true;
      
      try {
        const formData = new FormData();
        formData.append('name', this.itemForm.name);
        formData.append('category', this.itemForm.category);
        formData.append('price', parseFloat(this.itemForm.price));
        formData.append('description', this.itemForm.description || '');
        formData.append('available', this.itemForm.available ? '1' : '0');
        if (this.itemImageFile) {
          formData.append('image', this.itemImageFile);
        }
        
        if (this.editingItem) {
          for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
          await axios.put(
            `${this.getApiBaseUrl()}/menu-items/${this.editingItem}`,
            formData,
            {
              headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          this.$toast.success("Article mis à jour");
        } else {
          await axios.post(
            `${this.getApiBaseUrl()}/menu-items`,
            formData,
            {
              headers: {
                ...this.getAuthHeader(),
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          this.$toast.success("Article ajouté");
        }
        
        this.fetchMenuItems();
        this.closeItemForm();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        this.$toast.error(error?.response?.data?.message || "Erreur lors de l'enregistrement");
      } finally {
        this.isSubmittingItem = false;
      }
    },
    
    async deleteMenuItem() {
      try {
        await axios.delete(
          `${this.getApiBaseUrl()}/menu-items/${this.itemToDelete}`,
          { headers: this.getAuthHeader() }
        );
        this.menuItems = this.menuItems.filter(i => i.id !== this.itemToDelete);
        this.showDeleteModal = false;
        this.$toast.success("Article supprimé");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la suppression");
      }
    },
    
    // Statistiques API
    async fetchStats() {
      try {
        const response = await axios.get(`${this.getApiBaseUrl()}/bar-stats`, {
          headers: this.getAuthHeader()
        });
        this.stats = response.data.data || response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
        this.$toast.error(error.response?.data?.message || "Erreur lors de la récupération des statistiques");
        this.stats = {
          todayRevenue: 0,
          monthlyOrders: 0,
          topItem: '',
          topItems: [],
          recentOrders: []
        };
      }
    },
    
    // Gestion des commandes
    addOrderItem() {
      this.orderForm.items.push({
        menuItemId: '',
        quantity: 1,
        name: '',
        price: 0
      });
    },
    
    removeOrderItem(index) {
      if (this.orderForm.items.length > 1) {
        this.orderForm.items.splice(index, 1);
      }
    },
    
    updateSelectedItem(index) {
      const selectedItem = this.menuItems.find(item => item.id === this.orderForm.items[index].menuItemId);
      if (selectedItem) {
        this.orderForm.items[index].name = selectedItem.name;
        this.orderForm.items[index].price = selectedItem.price;
      }
    },
    
    async submitOrderForm() {
      this.isSubmittingOrder = true;
      
      try {
        const orderData = {
          roomNumber: this.orderForm.roomNumber || null,
          status: this.orderForm.status,
          items: this.orderForm.items.map(item => ({
            menu_item_id: item.menuItemId,
            quantity: item.quantity
          })),
          total: this.calculateOrderTotal
        };
        
        await this.createOrder(orderData);
        this.$toast.success("Commande créée avec succès");
        this.closeOrderForm();
        this.fetchOrders();
      } catch (error) {
        console.error("Erreur lors de la création de la commande:", error);
      } finally {
        this.isSubmittingOrder = false;
      }
    },
    
    closeOrderForm() {
      this.showOrderForm = false;
      this.orderForm = {
        roomNumber: null,
        status: 'pending',
        items: [
          {
            menuItemId: '',
            quantity: 1,
            name: '',
            price: 0
          }
        ]
      };
    },
/* eslint-disable */
    // Impression de facture
 printInvoice(order) {
      const printWindow = window.open('', '_blank');
      
      // Préparer le contenu HTML
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facture #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 1.2em; }
            .header { display: flex; justify-content: space-between; }
            .info { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Facture #${order.id}</h1>
            <p>Date: ${this.formatDate(order.created_at)}</p>
          </div>
          
          <div class="info">
            ${order.room_number ? `<p><strong>Chambre:</strong> ${order.room_number}</p>` : '<p><strong>Client:</strong> Non résident</p>'}
            <p><strong>Statut:</strong> ${this.getStatusText(order.status)}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${this.formatPrice(item.price)} FCFA</td>
                  <td>${this.formatPrice(item.price * item.quantity)} FCFA</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total: ${this.formatPrice(order.total)} FCFA</p>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          <\/script>
        </body>
        </html>
      `;

    // Écrire le contenu dans la nouvelle fenêtre
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    },

    editMenuItem(item) {
      this.editingItem = item.id;
      this.itemForm = { ...item };
      this.showItemForm = true;
    },
    
    handleItemImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.match('image.*')) {
        this.$toast.error("Veuillez sélectionner une image valide (JPG, PNG)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.$toast.error("La taille de l'image ne doit pas dépasser 2MB");
        return;
      }

      this.itemImageFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.itemForm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    removeItemImage() {
      this.itemForm.image = '';
      this.itemImageFile = null;
      if (this.$refs.itemFileInput) this.$refs.itemFileInput.value = '';
    },
    
    closeItemForm() {
      this.showItemForm = false;
      this.editingItem = null;
      this.itemForm = {
        name: '',
        category: '',
        price: '',
        description: '',
        available: true,
        image: ''
      };
      this.itemImageFile = null;
      if (this.$refs.itemFileInput) this.$refs.itemFileInput.value = '';
    },
    
    confirmDeleteItem(itemId) {
      this.itemToDelete = itemId;
      this.showDeleteModal = true;
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: 'En attente',
        preparing: 'En préparation',
        ready: 'Prêt à servir',
        delivered: 'Livré'
      };
      return statusMap[status] || status;
    },
    
    // Utilitaires
    formatPrice(price) {
      return new Intl.NumberFormat('fr-FR').format(price);
    },
    
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatShortDate(date) {
      return new Date(date).toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
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

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Effets au survol */
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

/* Limite de lignes pour la description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
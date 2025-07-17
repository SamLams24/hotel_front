<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec onglets -->
      <div class="flex flex-col mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">🍹 Gestion du Bar</h1>
        <div class="flex space-x-1 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="getTabClass(tab.id)"
          >
            <span class="mr-2 text-lg">{{ tab.icon }}</span> {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <div v-if="isLoading" class="text-center p-10">
        <p class="text-gray-600 animate-pulse">
          Chargement des données du bar...
        </p>
      </div>

      <!-- Contenu des onglets -->
      <div v-else>
        <!-- ======================= Section Commandes ======================= -->
        <section v-show="activeTab === 'orders'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              📋 Commandes en cours
            </h2>
            <button @click="openOrderForm()" class="btn-primary">
              ➕ Nouvelle commande
            </button>
          </div>
          <div
            v-if="orders.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="order in orders"
              :key="order.id"
              class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div
                class="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h3 class="font-bold text-gray-800">
                    Commande #{{ order.id }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    Chambre {{ order.room_number }}
                  </p>
                </div>
                <span
                  :class="getStatusClass(order.status)"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  >{{ getStatusText(order.status) }}</span
                >
              </div>
              <div class="p-5">
                <ul class="space-y-2 mb-4">
                  <li
                    v-for="item in order.order_items"
                    :key="item.id"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-gray-600"
                      >{{ item.quantity }}x {{ item.menu_item.name }}</span
                    >
                    <span class="font-medium"
                      >{{
                        formatPrice(item.unit_price * item.quantity)
                      }}
                      FCFA</span
                    >
                  </li>
                </ul>
                <div
                  class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center font-bold"
                >
                  <span>Total:</span
                  ><span class="text-lg text-blue-600"
                    >{{ formatPrice(order.total) }} FCFA</span
                  >
                </div>
              </div>
              <div
                class="px-5 py-3 bg-gray-50 flex justify-end flex-wrap gap-2"
              >
                <button
                  v-if="order.status === 'pending'"
                  @click="updateOrderStatus(order.id, 'preparing')"
                  class="btn-status-action bg-blue-600"
                >
                  Préparer
                </button>
                <button
                  v-if="order.status === 'preparing'"
                  @click="updateOrderStatus(order.id, 'ready')"
                  class="btn-status-action bg-green-600"
                >
                  Prêt
                </button>
                <button
                  v-if="order.status === 'ready'"
                  @click="updateOrderStatus(order.id, 'delivered')"
                  class="btn-status-action bg-purple-600"
                >
                  Livré
                </button>
                <button
                  @click="cancelOrder(order.id)"
                  class="btn-status-action bg-red-600"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center bg-white p-8 rounded-lg shadow-sm">
            <p>Aucune commande en cours.</p>
          </div>
        </section>

        <section v-show="activeTab === 'menu'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">📜 Menu du Bar</h2>
            <button @click="openItemForm()" class="btn-primary">
              ➕ Ajouter un article
            </button>
          </div>
          <div class="mb-6 flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              :class="getCategoryClass(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
          <div
            v-if="filteredMenuItems.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div
              v-for="item in filteredMenuItems"
              :key="item.id"
              class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div class="relative h-48 bg-gray-200">
                <img
                  :src="getImageUrl(item.image)"
                  class="w-full h-full object-cover"
                  :alt="item.name"
                />
                <span
                  class="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-bold rounded-full"
                  >{{ formatPrice(item.price) }} FCFA</span
                >
              </div>
              <div class="p-4">
                <h3 class="text-lg font-bold text-gray-800">{{ item.name }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ item.category }}</p>
                <p class="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
                  {{ item.description }}
                </p>
                <div class="mt-4 flex justify-between">
                  <button @click="openItemForm(item)" class="btn-icon-edit">
                    ✏️ Modifier
                  </button>
                  <button
                    @click="confirmDeleteItem(item.id)"
                    class="btn-icon-delete"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center bg-white p-8 rounded-lg shadow-sm">
            <p>Aucun article dans cette catégorie.</p>
          </div>
        </section>

        <section v-show="activeTab === 'stats'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-md">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  💰
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">
                    Chiffre d'affaires (jour)
                  </p>
                  <p class="text-2xl font-semibold">
                    {{ formatPrice(stats.todayRevenue) }} FCFA
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  🍹
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">
                    Commandes (mois)
                  </p>
                  <p class="text-2xl font-semibold">
                    {{ stats.monthlyOrders }}
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md">
              <div class="flex items-center">
                <div
                  class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4"
                >
                  ⭐
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">
                    Article Populaire
                  </p>
                  <p class="text-2xl font-semibold">
                    {{ stats.topItem || "-" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-md">
              <h3 class="text-lg font-medium text-gray-800 mb-4">
                Articles les plus vendus
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="item in stats.topItems"
                  :key="item.name"
                  class="flex justify-between items-center"
                >
                  <span class="text-gray-700">{{ item.name }}</span
                  ><span class="font-medium bg-gray-100 px-2 py-1 rounded"
                    >{{ item.quantity }} ventes</span
                  >
                </li>
              </ul>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md">
              <h3 class="text-lg font-medium text-gray-800 mb-4">
                Dernières commandes
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="order in stats.recentOrders"
                  :key="order.id"
                  class="flex justify-between items-center"
                >
                  <div>
                    <p class="text-gray-700">Commande #{{ order.id }}</p>
                    <p class="text-sm text-gray-500">
                      {{ formatDate(order.date) }}
                    </p>
                  </div>
                  <span class="font-medium"
                    >{{ formatPrice(order.total) }} FCFA</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="showItemForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      >
        <div
          class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <form @submit.prevent="submitItemForm" class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">
              {{ itemForm.id ? "✏️ Modifier Article" : "➕ Nouvel Article" }}
            </h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  v-model="itemForm.name"
                  placeholder="Nom de l'article"
                  class="input"
                  required
                />
                <select v-model="itemForm.category" class="input" required>
                  <option value="" disabled>Catégorie</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.name"
                  >
                    {{ cat.name }}
                  </option>
                </select>
                <input
                  v-model.number="itemForm.price"
                  type="number"
                  placeholder="Prix"
                  class="input"
                  required
                />
                <select v-model="itemForm.available" class="input" required>
                  <option :value="true">Disponible</option>
                  <option :value="false">Indisponible</option>
                </select>
              </div>
              <textarea
                v-model="itemForm.description"
                placeholder="Description"
                rows="3"
                class="input"
              ></textarea>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Image</label
                ><input
                  type="file"
                  @change="handleItemImageUpload"
                  accept="image/*"
                  class="text-sm"
                />
              </div>
            </div>
            <div class="pt-6 flex justify-end gap-4">
              <button
                type="button"
                @click="showItemForm = false"
                class="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSubmittingItem"
              >
                {{ itemForm.id ? "Mettre à jour" : "Ajouter" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="modal-fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <h3 class="text-lg font-medium text-gray-900">
            Confirmer la suppression
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer cet article ? Cette action est
            irréversible.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="btn-secondary">
              Annuler
            </button>
            <button
              @click="deleteMenuItem"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();
const isLoading = ref(true);
const activeTab = ref("orders");
const orders = ref([]);
const menuItems = ref([]);
const categories = ref([]);
const stats = ref({});
const activeCategory = ref(null);

const showItemForm = ref(false);
const isSubmittingItem = ref(false);
const itemForm = ref({});
const itemImageFile = ref(null);

const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const filteredMenuItems = computed(() => {
  if (!activeCategory.value) return menuItems.value;
  const category = categories.value.find((c) => c.id === activeCategory.value);
  return category
    ? menuItems.value.filter((item) => item.category === category.name)
    : [];
});
/* eslint-disable */
const availableMenuItems = computed(() =>
  menuItems.value.filter((item) => item.available)
);

const tabs = [
  { id: "orders", name: "Commandes", icon: "📋" },
  { id: "menu", name: "Menu", icon: "📜" },
  { id: "stats", name: "Statistiques", icon: "📊" }
];
const getTabClass = (tabId) => ({
  "border-blue-600 text-blue-600": activeTab.value === tabId,
  "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300":
    activeTab.value !== tabId,
  "py-3 px-4 inline-flex items-center text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none": true
});
const getCategoryClass = (catId) => ({
  "bg-blue-600 text-white": activeCategory.value === catId,
  "bg-white text-gray-700 hover:bg-gray-100": activeCategory.value !== catId,
  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm": true
});

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      fetchOrders(),
      fetchMenuItems(),
      fetchCategories(),
      fetchStats()
    ]);
  } catch (error) {
    toast.error("Erreur de chargement des données du bar.");
  } finally {
    isLoading.value = false;
  }
});

async function fetchOrders() {
  orders.value = (await axios.get("/orders")).data.data;
}
async function fetchMenuItems() {
  menuItems.value = (await axios.get("/menu-items")).data;
}
async function fetchCategories() {
  categories.value = (await axios.get("/categories")).data;
  if (categories.value.length > 0 && !activeCategory.value) {
    activeCategory.value = categories.value[0].id;
  }
}
async function fetchStats() {
  stats.value = (await axios.get("/bar-stats")).data;
}

async function updateOrderStatus(orderId, status) {
  try {
    await axios.put(`/orders/${orderId}/status`, { status });
    await fetchOrders();
    toast.success(`Commande #${orderId} mise à jour.`);
  } catch {
    toast.error("Erreur lors de la mise à jour du statut.");
  }
}
async function cancelOrder(orderId) {
  if (confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
    try {
      await axios.delete(`/orders/${orderId}`);
      await fetchOrders();
      toast.success(`Commande #${orderId} annulée.`);
    } catch {
      toast.error("Erreur d'annulation.");
    }
  }
}

function openItemForm(item = null) {
  itemImageFile.value = null;
  if (item) {
    itemForm.value = { ...item, available: !!item.available };
  } else {
    itemForm.value = {
      name: "",
      category: "",
      price: null,
      description: "",
      available: true
    };
  }
  showItemForm.value = true;
}

function handleItemImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    itemImageFile.value = file;
  } else {
    toast.warning("Veuillez sélectionner un fichier image valide.");
  }
}

async function submitItemForm() {
  isSubmittingItem.value = true;
  const formData = new FormData();
  Object.keys(itemForm.value).forEach((key) => {
    if (key === "available")
      formData.append(key, itemForm.value[key] ? "1" : "0");
    else if (itemForm.value[key] !== null)
      formData.append(key, itemForm.value[key]);
  });
  if (itemImageFile.value) {
    formData.append("image", itemImageFile.value);
  }
  if (itemForm.value.id) formData.append("_method", "PUT");

  const url = itemForm.value.id
    ? `/menu-items/${itemForm.value.id}`
    : "/menu-items";
  const method = itemForm.value.id ? "post" : "post";

  try {
    await axios[method](url, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    toast.success(`Article ${itemForm.value.id ? "mis à jour" : "créé"} !`);
    showItemForm.value = false;
    await fetchMenuItems();
  } catch (error) {
    toast.error("Erreur lors de l'enregistrement de l'article.");
    console.error(error.response?.data);
  } finally {
    isSubmittingItem.value = false;
  }
}

function confirmDeleteItem(id) {
  itemToDelete.value = id;
  showDeleteModal.value = true;
}

async function deleteMenuItem() {
  try {
    await axios.delete(`/menu-items/${itemToDelete.value}`);
    toast.success("Article supprimé.");
    showDeleteModal.value = false;
    await fetchMenuItems();
  } catch {
    toast.error("Erreur lors de la suppression.");
  }
}

// --- Utility Functions ---
const formatPrice = (price) =>
  !isNaN(price) ? new Intl.NumberFormat("fr-FR").format(price) : "0";
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";
const getImageUrl = (path) =>
  path
    ? `http://localhost:8000/storage/${path}`
    : "https://via.placeholder.com/300x200?text=Bar";
const getStatusText = (status) =>
  ({
    pending: "En attente",
    preparing: "En préparation",
    ready: "Prêt",
    delivered: "Livré"
  }[status] || "Inconnu");
const getStatusClass = (status) => ({
  "bg-yellow-100 text-yellow-800": status === "pending",
  "bg-blue-100 text-blue-800": status === "preparing",
  "bg-green-100 text-green-800": status === "ready",
  "bg-purple-100 text-purple-800": status === "delivered"
});
</script>

<style scoped>
.input {
  @apply w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition;
}
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 transition;
}
.btn-icon-edit {
  @apply px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200;
}
.btn-icon-delete {
  @apply px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200;
}
.btn-status-action {
  @apply text-white text-xs font-semibold rounded-md px-2 py-1 hover:opacity-90;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

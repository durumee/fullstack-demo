<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">주문 내역</h1>
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
      role="alert">
      <strong class="font-bold">오류 발생: </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <template v-else>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="order in orders" :key="order.id"
          class="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">주문 #{{ order.orderNumber }}</h2>
              <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getStatusColor(order.status)]">
                {{ order.statusKo }}
              </span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center text-gray-600">
                <CalendarIcon class="w-5 h-5 mr-2" />
                <span>{{ new Date(order.orderDate).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center text-gray-800 font-bold">
                <CurrencyDollarIcon class="w-5 h-5 mr-2" />
                <span>{{ order.totalAmount.toLocaleString() }}원</span>
              </div>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-2 text-gray-700">주문 상품</h3>
              <ul class="space-y-2">
                <li v-for="item in order.orderItems" :key="item.id" class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">{{ item.productName }}</span>
                  <span class="text-gray-800 font-semibold">{{ item.quantity }}개, {{ item.price.toLocaleString()
                    }}원</span>
                </li>
              </ul>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="flex items-center text-blue-600">
                <TruckIcon class="w-5 h-5 mr-2" />
                <span class="text-sm font-semibold">배송 추적</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <button @click="prevPage" :disabled="currentPage === 0"
          class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
        <span class="mx-4 flex items-center text-gray-700">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages - 1"
          class="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
          <ChevronRightIcon class="w-6 h-6" />
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchWithAuth } from "../util/fetchWithAuth";
import { CalendarIcon, CurrencyDollarIcon, TruckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const orders = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(0);
const totalPages = ref(0);

const fetchOrders = async () => {
  try {
    const response = await fetchWithAuth(`/api/orders?page=${currentPage.value}&size=10`);
    if (response.ok) {
      const data = await response.json();
      orders.value = data.content;
      totalPages.value = data.totalPages;
    } else {
      throw new Error('Failed to fetch orders');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);

const getStatusColor = computed(() => (status) => {
  switch (status?.toLowerCase()) {
    case 'processing': return 'text-yellow-600 bg-yellow-100';
    case 'shipped': return 'text-blue-600 bg-blue-100';
    case 'delivered': return 'text-green-600 bg-green-100';
    case 'cancelled': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
});

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchOrders();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchOrders();
  }
};
</script>
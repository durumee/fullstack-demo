<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">상품 목록</h1>
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
      role="alert">
      <strong class="font-bold">오류 발생: </strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
    <template v-else>
      <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.productId" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="product.imageUrl || 'https://via.placeholder.com/300x200'" :alt="product.name"
            class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ product.name }}</h2>
            <p class="text-gray-600 mb-2">{{ product.description }}</p>
            <p class="text-gray-800 font-bold">{{ product.price.toLocaleString() }}원</p>
            <p class="text-sm text-gray-500">남은수량: {{ product.stockQuantity }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10">표시할 상품이 없습니다.</div>
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <button @click="prevPage" :disabled="currentPage === 0"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l disabled:opacity-50">
          이전
        </button>
        <span class="bg-gray-200 text-gray-800 font-bold py-2 px-4">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages - 1"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50">
          다음
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchWithAuth } from "../util/fetchWithAuth";

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(0);
const totalPages = ref(0);

const fetchProducts = async () => {
  try {
    const response = await fetchWithAuth(`/api/products?page=${currentPage.value}&size=10`);
    if (response.ok) {
      const data = await response.json();
      products.value = data.content;
      totalPages.value = data.totalPages;
      error.value = null;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (err) {
    error.value = err.message;
    products.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchProducts();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    fetchProducts();
  }
};
</script>
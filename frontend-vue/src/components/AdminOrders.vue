<template>
  <div class="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-center">주문 관리</h1>
    <p v-if="error" class="text-red-500 mb-4 text-center">{{ error }}</p>
    <div class="mb-4 flex justify-end">
      <label for="sort" class="mr-2 self-center">정렬: </label>
      <select id="sort" v-model="sort" @change="handleSortChange"
        class="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="orderDate,desc">날짜 (최신순)</option>
        <option value="orderDate,asc">날짜 (오래된순)</option>
        <option value="totalAmount,desc">금액 (높은순)</option>
        <option value="totalAmount,asc">금액 (낮은순)</option>
      </select>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="order in orders" :key="order.id" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">주문 #{{ order.orderNumber || order.id }}</div>
          <p class="text-gray-700 text-base mb-1">회원: {{ order.username }}</p>
          <p class="text-gray-700 text-base mb-1">주문일: {{ new Date(order.orderDate).toLocaleDateString() }}</p>
          <p class="text-gray-700 text-base mb-1">총액: {{ order.totalAmount.toLocaleString() }} 원</p>
          <p :class="['text-base font-semibold', getStatusColor(order.status)]">
            상태: {{ order.status || "미정" }}
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-100">
          <h4 class="font-semibold mb-2">주문 항목:</h4>
          <ul class="list-disc pl-5">
            <li v-for="item in order.orderItems" :key="item.id" class="text-gray-700">
              {{ item.productName }} - {{ item.quantity }}개, {{ item.price.toLocaleString() }} 원
            </li>
          </ul>
        </div>
        <div class="px-6 py-4">
          <button @click="handleDeleteOrder(order.id)"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            삭제
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center mt-6">
      <button @click="prevPage" :disabled="currentPage === 0"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
        이전
      </button>
      <span class="px-4 py-2 bg-gray-200">
        {{ currentPage + 1 }} / {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages - 1"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchWithAuth } from '../util/fetchWithAuth'

const orders = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(0)
const totalPages = ref(0)
const sort = ref('orderDate,desc')

const fetchOrders = async () => {
  try {
    const response = await fetchWithAuth(`/admin/orders?page=${currentPage.value}&size=5&sort=${sort.value}`)
    if (response.ok) {
      const data = await response.json()
      orders.value = data.content
      totalPages.value = data.totalPages
      currentPage.value = data.number
    } else {
      throw new Error('Failed to fetch orders')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

watch([currentPage, sort], fetchOrders)

const handleDeleteOrder = async (orderId) => {
  try {
    const response = await fetchWithAuth(`/admin/orders/${orderId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      orders.value = orders.value.filter(order => order.id !== orderId)
    } else {
      throw new Error('Failed to delete order')
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleSortChange = () => {
  currentPage.value = 0
  fetchOrders()
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED": return "text-green-600";
    case "PROCESSING": return "text-blue-600";
    case "CANCELLED": return "text-red-600";
    default: return "text-gray-600";
  }
}
</script>
<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-6">제품 관리</h1>
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
    <form @submit.prevent="handleAddProduct" class="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-4 flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            제품명
          </label>
          <input v-model="newProduct.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name" type="text" required autocomplete="off">
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            가격
          </label>
          <input v-model.number="newProduct.price"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price" type="number" required autocomplete="off">
        </div>
      </div>
      <div class="mb-4 flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="stockQuantity">
            재고 수량
          </label>
          <input v-model.number="newProduct.stockQuantity"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="stockQuantity" type="number" required autocomplete="off">
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="categoryId">
            카테고리 ID
          </label>
          <input v-model.number="newProduct.categoryId"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="categoryId" type="number" required autocomplete="off">
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          설명
        </label>
        <textarea v-model="newProduct.description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description" required autocomplete="off" rows="3"></textarea>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          제품 추가
        </button>
      </div>
    </form>
    <div class="overflow-x-auto">
      <ul class="flex flex-nowrap gap-4 pb-4">
        <li v-for="product in products" :key="product.productId"
          class="flex-shrink-0 w-80 bg-white shadow-md rounded-lg p-4">
          <template v-if="editProduct && editProduct.productId === product.productId">
            <form @submit.prevent="handleEditProductSubmit" class="space-y-4">
              <div>
                <label for="edit-name" class="block text-sm font-medium text-gray-700">제품명</label>
                <input id="edit-name" v-model="editProduct.name" type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div>
                <label for="edit-description" class="block text-sm font-medium text-gray-700">설명</label>
                <textarea id="edit-description" v-model="editProduct.description"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off" rows="3"></textarea>
              </div>
              <div>
                <label for="edit-price" class="block text-sm font-medium text-gray-700">가격</label>
                <input id="edit-price" v-model.number="editProduct.price" type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div>
                <label for="edit-stockQuantity" class="block text-sm font-medium text-gray-700">재고 수량</label>
                <input id="edit-stockQuantity" v-model.number="editProduct.stockQuantity" type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div>
                <label for="edit-categoryId" class="block text-sm font-medium text-gray-700">카테고리 ID</label>
                <input id="edit-categoryId" v-model.number="editProduct.categoryId" type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="submit"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  저장
                </button>
                <button type="button" @click="cancelEdit"
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                  취소
                </button>
              </div>
            </form>
          </template>
          <template v-else>
            <div class="mb-4">
              <h3 class="font-bold text-lg">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">{{ product.description }}</p>
              <p class="text-sm text-gray-600">가격: {{ product.price }}</p>
              <p class="text-sm text-gray-600">재고: {{ product.stockQuantity }}</p>
              <p class="text-sm text-gray-600">카테고리 ID: {{ product.categoryId }}</p>
            </div>
            <div class="flex justify-end space-x-2">
              <button @click="setEditProduct(product)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                수정
              </button>
              <button @click="handleDeleteProduct(product.productId)"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm">
                삭제
              </button>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <div class="flex justify-center items-center mt-6">
      <button @click="prevPage" :disabled="currentPage === 0"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50">
        이전
      </button>
      <span class="px-4">
        {{ currentPage + 1 }} / {{ totalPages }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages - 1"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50">
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { fetchWithAuth } from '../util/fetchWithAuth'

const products = ref([])
const loading = ref(true)
const error = ref('')
const newProduct = reactive({
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: ''
})
const editProduct = ref(null)
const currentPage = ref(0)
const totalPages = ref(0)

const fetchProducts = async () => {
  try {
    const response = await fetchWithAuth(`/admin/products?page=${currentPage.value}&size=5`)
    if (response.ok) {
      const data = await response.json()
      products.value = data.content
      totalPages.value = data.totalPages
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const handleDeleteProduct = async (productId) => {
  try {
    const response = await fetchWithAuth(`/admin/products/${productId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      products.value = products.value.filter(product => product.productId !== productId)
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleAddProduct = async () => {
  try {
    const response = await fetchWithAuth('/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
    if (response.ok) {
      const createdProduct = await response.json()
      products.value.push(createdProduct)
      Object.assign(newProduct, {
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: ''
      })
    }
  } catch (err) {
    error.value = err.message
  }
}

const setEditProduct = (product) => {
  editProduct.value = { ...product }
}

const handleEditProductSubmit = async () => {
  try {
    const response = await fetchWithAuth(`/admin/products/${editProduct.value.productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editProduct.value),
    })
    if (response.ok) {
      const updatedProduct = await response.json()
      products.value = products.value.map(product =>
        product.productId === updatedProduct.productId ? updatedProduct : product
      )
      editProduct.value = null
    }
  } catch (err) {
    error.value = err.message
  }
}

const cancelEdit = () => {
  editProduct.value = null
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchProducts()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchProducts()
  }
}
</script>
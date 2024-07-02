<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">역할 관리</h1>
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
    <form @submit.prevent="handleAddRole" class="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-4">
        <input v-model="newRole" type="text" placeholder="역할 이름"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          역할 추가
        </button>
      </div>
    </form>
    <ul class="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <li v-for="role in roles" :key="role.id" class="mb-4 pb-4 border-b last:border-b-0">
        <div v-if="editRole && editRole.id === role.id" class="flex items-center">
          <form @submit.prevent="handleEditRoleSubmit" class="flex-grow mr-2">
            <input v-model="editRole.name" type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required>
          </form>
          <button @click="handleEditRoleSubmit"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
            저장
          </button>
          <button @click="cancelEdit"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            취소
          </button>
        </div>
        <div v-else class="flex justify-between items-center">
          <span>{{ role.name }}</span>
          <div>
            <button @click="setEditRole(role)"
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
              수정
            </button>
            <button @click="handleDeleteRole(role.id)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              삭제
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWithAuth } from '../util/fetchWithAuth'

const roles = ref([])
const loading = ref(true)
const error = ref('')
const newRole = ref('')
const editRole = ref(null)

const fetchRoles = async () => {
  try {
    const response = await fetchWithAuth('/admin/roles')
    if (response.ok) {
      roles.value = await response.json()
    } else {
      throw new Error('Failed to fetch roles')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchRoles)

const handleDeleteRole = async (roleId) => {
  try {
    const response = await fetchWithAuth(`/admin/roles/${roleId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      roles.value = roles.value.filter(role => role.id !== roleId)
    } else {
      throw new Error('Failed to delete role')
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleAddRole = async () => {
  try {
    const response = await fetchWithAuth('/admin/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newRole.value }),
    })
    if (response.ok) {
      const createdRole = await response.json()
      roles.value.push(createdRole)
      newRole.value = ''
    } else {
      throw new Error('Failed to add role')
    }
  } catch (err) {
    error.value = err.message
  }
}

const setEditRole = (role) => {
  editRole.value = { ...role }
}

const handleEditRoleSubmit = async () => {
  try {
    const response = await fetchWithAuth(`/admin/roles/${editRole.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editRole.value),
    })
    if (response.ok) {
      const updatedRole = await response.json()
      roles.value = roles.value.map(role =>
        role.id === updatedRole.id ? updatedRole : role
      )
      editRole.value = null
    } else {
      throw new Error('Failed to update role')
    }
  } catch (err) {
    error.value = err.message
  }
}

const cancelEdit = () => {
  editRole.value = null
}
</script>
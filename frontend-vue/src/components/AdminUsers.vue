<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">사용자 관리</h1>
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>
    <form @submit.prevent="handleAddUser" class="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-4">
        <input v-model="newUser.username" type="text" placeholder="아이디"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          required autocomplete="off">
        <input v-model="newUser.password" type="password" placeholder="비밀번호"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          required autocomplete="new-password">
        <select v-model="newUser.roles" multiple
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required>
          <option v-for="role in roles" :key="role.id" :value="role">{{ role.name }}</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <button type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          사용자 추가
        </button>
      </div>
    </form>
    <ul class="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <li v-for="user in users" :key="user.id" class="mb-4 pb-4 border-b last:border-b-0">
        <div class="flex justify-between items-center">
          <div>
            <span class="font-bold">{{ user.username }}</span>
            <div class="mt-2">
              <span v-for="role in user.roles" :key="role.id"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {{ role.name }}
                <button @click="handleDeleteRole(user.id, role.id)" class="ml-2 text-red-500 hover:text-red-700">
                  x
                </button>
              </span>
            </div>
          </div>
          <button @click="handleDeleteUser(user.id)"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            삭제
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { fetchWithAuth } from '../util/fetchWithAuth'

const users = ref([])
const roles = ref([])
const loading = ref(true)
const error = ref('')
const newUser = reactive({
  username: '',
  password: '',
  roles: []
})

const fetchData = async () => {
  try {
    const [usersResponse, rolesResponse] = await Promise.all([
      fetchWithAuth('/admin/users'),
      fetchWithAuth('/admin/roles')
    ])

    if (usersResponse.ok && rolesResponse.ok) {
      users.value = await usersResponse.json()
      roles.value = await rolesResponse.json()
    } else {
      throw new Error('Failed to fetch data')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const handleDeleteUser = async (userId) => {
  try {
    const response = await fetchWithAuth(`/admin/users/${userId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      users.value = users.value.filter(user => user.id !== userId)
    } else {
      throw new Error('Failed to delete user')
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleDeleteRole = async (userId, roleId) => {
  try {
    const response = await fetchWithAuth(`/admin/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      users.value = users.value.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            roles: user.roles.filter(role => role.id !== roleId)
          }
        }
        return user
      })
    } else {
      throw new Error('Failed to delete role from user')
    }
  } catch (err) {
    error.value = err.message
  }
}

const handleAddUser = async () => {
  try {
    const response = await fetchWithAuth('/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
    if (response.ok) {
      const createdUser = await response.json()
      users.value.push(createdUser)
      newUser.username = ''
      newUser.password = ''
      newUser.roles = []
    } else {
      throw new Error('Failed to add user')
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>
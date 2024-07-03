<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-6">회원 관리</h1>
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <!-- 회원 상태 필터 -->
    <div class="mb-4">
      <label class="mr-2">회원 상태:</label>
      <select v-model="memberStatus" @change="fetchMembers" class="border rounded px-2 py-1">
        <option value="ALL">전체</option>
        <option value="ACTIVE">활성</option>
        <option value="DELETED">탈퇴</option>
      </select>
    </div>

    <!-- 회원 추가 폼 -->
    <form @submit.prevent="handleAddMember" class="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-4 flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            사용자명
          </label>
          <input v-model="newMember.username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username" type="text" required autocomplete="off">
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            비밀번호
          </label>
          <input v-model="newMember.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password" type="password" required autocomplete="new-password">
        </div>
      </div>
      <div class="mb-4 flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            이메일
          </label>
          <input v-model="newMember.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email" type="email" required autocomplete="off">
        </div>
        <div class="w-full md:w-1/2 px-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="phoneNumber">
            전화번호
          </label>
          <input v-model="newMember.phoneNumber"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNumber" type="tel" autocomplete="off">
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          주소
        </label>
        <input v-model="newMember.address"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="address" type="text" autocomplete="off">
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          회원 추가
        </button>
      </div>
    </form>

    <!-- 회원 목록 -->
    <div class="overflow-x-auto">
      <ul class="flex flex-nowrap gap-4 pb-4">
        <li v-for="member in members" :key="member.memberId"
          class="flex-shrink-0 w-64 bg-white shadow-md rounded-lg p-4" :class="{ 'opacity-50': member.isDeleted }">
          <template v-if="editMember && editMember.memberId === member.memberId">
            <form @submit.prevent="handleEditMemberSubmit" class="space-y-4">
              <div>
                <label for="edit-username" class="block text-sm font-medium text-gray-700">사용자명</label>
                <input id="edit-username" v-model="editMember.username" type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div>
                <label for="edit-email" class="block text-sm font-medium text-gray-700">이메일</label>
                <input id="edit-email" v-model="editMember.email" type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required autocomplete="off">
              </div>
              <div>
                <label for="edit-phoneNumber" class="block text-sm font-medium text-gray-700">전화번호</label>
                <input id="edit-phoneNumber" v-model="editMember.phoneNumber" type="tel"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  autocomplete="off">
              </div>
              <div>
                <label for="edit-address" class="block text-sm font-medium text-gray-700">주소</label>
                <input id="edit-address" v-model="editMember.address" type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  autocomplete="off">
              </div>
              <div>
                <label for="edit-isDeleted" class="block text-sm font-medium text-gray-700">회원 상태</label>
                <select id="edit-isDeleted" v-model="editMember.isDeleted"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option :value="false">활성</option>
                  <option :value="true">탈퇴</option>
                </select>
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
              <p class="font-bold">{{ member.username }}</p>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
              <p class="text-sm text-gray-600">{{ member.phoneNumber }}</p>
              <p class="text-sm text-gray-600">{{ member.address }}</p>
              <p class="text-sm" :class="member.isDeleted ? 'text-red-500' : 'text-green-500'">
                {{ member.isDeleted ? '탈퇴' : '활성' }}
              </p>
            </div>
            <div class="flex justify-end space-x-2">
              <button @click="setEditMember(member)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                수정
              </button>
            </div>
          </template>
        </li>
      </ul>
    </div>

    <!-- 페이지네이션 -->
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

const members = ref([])
const loading = ref(true)
const error = ref('')
const newMember = reactive({
  username: '',
  password: '',
  email: '',
  phoneNumber: '',
  address: ''
})
const editMember = ref(null)
const currentPage = ref(0)
const totalPages = ref(0)
const memberStatus = ref('ALL')

const fetchMembers = async () => {
  try {
    const response = await fetchWithAuth(`/admin/members?page=${currentPage.value}&size=5&status=${memberStatus.value}`)
    if (response.ok) {
      const data = await response.json()
      members.value = data.content
      totalPages.value = data.totalPages
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchMembers)

const handleAddMember = async () => {
  try {
    const response = await fetchWithAuth('/admin/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMember),
    })
    if (response.ok) {
      await fetchMembers()
      Object.keys(newMember).forEach(key => newMember[key] = '')
    }
  } catch (err) {
    error.value = err.message
  }
}

const setEditMember = (member) => {
  editMember.value = { ...member }
}

const handleEditMemberSubmit = async () => {
  try {
    const response = await fetchWithAuth(`/admin/members/${editMember.value.memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editMember.value),
    })
    if (response.ok) {
      await fetchMembers()
      editMember.value = null
    }
  } catch (err) {
    error.value = err.message
  }
}

const cancelEdit = () => {
  editMember.value = null
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchMembers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchMembers()
  }
}
</script>
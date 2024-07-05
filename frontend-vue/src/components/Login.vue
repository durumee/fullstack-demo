<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">로그인</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <input v-model="formData.username" type="text" name="username" placeholder="아이디"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
        </div>
        <div>
          <input v-model="formData.password" type="password" name="password" placeholder="비밀번호"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
        </div>
        <button type="submit"
          :class="['w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300', { 'opacity-50 cursor-not-allowed': loading }]"
          :disabled="loading">
          {{ loading ? "로그인 중..." : "로그인" }}
        </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
      <div class="mt-6 space-y-2">
        <button @click="setPreset('user', 'qwaszx')"
          class="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">
          사용자 로그인
        </button>
        <button @click="setPreset('admin', 'qwaszx')"
          class="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300">
          관리자 로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const router = useRouter()
const route = useRoute()

const formData = reactive({ username: "", password: "" })
const loading = ref(false)
const error = ref("")

const from = route.query.redirect || "/"

const handleLogin = async () => {
  loading.value = true
  error.value = ""

  try {
    const response = await fetch(API_BASE_URL + "/token", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData).toString(),
    })

    if (response.ok) {
      const authHeader = response.headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const jwtToken = authHeader.replace("Bearer ", "")
        sessionStorage.setItem("accessToken", jwtToken)
        router.push(from)
      } else {
        error.value = "Authorization 헤더가 없거나 형식이 잘못되었습니다."
      }
    } else {
      error.value = "로그인 실패: 아이디나 비밀번호를 확인하세요."
    }
  } catch (err) {
    error.value = "로그인 실패: 서버 오류가 발생했습니다."
  } finally {
    loading.value = false
  }
}

const setPreset = (username, password) => {
  formData.username = username
  formData.password = password
}
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Menu -->
    <template v-if="isMobile">
      <button @click="toggleMenu"
        class="fixed top-4 right-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
        <Bars3Icon class="h-6 w-6" />
      </button>
      <div v-if="isMenuOpen" class="fixed inset-0 bg-white z-40 p-4">
        <nav>
          <ul class="flex flex-col items-start pt-16">
            <NavLinks :currentRoute="currentRoute" :isAuth="isAuth" @updateAuth="updateAuth" />
          </ul>
        </nav>
      </div>
    </template>

    <!-- Desktop Menu -->
    <nav v-else class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <ul class="flex justify-center items-center h-16">
          <NavLinks :currentRoute="currentRoute" :isAuth="isAuth" @updateAuth="updateAuth" />
        </ul>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <!-- 라우터에 연결된 컴포넌트를 표시, login 이벤트 발생 시 handleLogin 실행 -->
      <router-view @login="handleLogin"></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import NavLinks from './components/NavLinks.vue'

const router = useRouter()
const route = useRoute()

const isAuth = ref(false)
const isMenuOpen = ref(false)
const isMobile = ref(false)

const currentRoute = computed(() => route.path)

const checkAuth = () => {
  const token = sessionStorage.getItem("accessToken")
  isAuth.value = !!token
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogin = () => {
  checkAuth()
}

const updateAuth = (newValue) => {
  isAuth.value = newValue
}

onMounted(() => {
  checkAuth()
  window.addEventListener("resize", handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})

watch(route, () => {
  checkAuth()
})
</script>
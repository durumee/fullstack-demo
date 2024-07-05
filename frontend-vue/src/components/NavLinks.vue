<template>
  <template v-for="link in links" :key="link.to">
    <li class="my-2 md:my-0 md:mr-4">
      <router-link :to="link.to" class="flex items-center px-3 py-2 rounded-md transition duration-300 ease-in-out"
        :class="[
          currentRoute === link.to
            ? 'bg-blue-500 text-white'
            : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
        ]">
        <component :is="link.icon" class="w-5 h-5" />
        <span class="ml-2">{{ link.label }}</span>
      </router-link>
    </li>
  </template>
  <li v-if="isAuth" class="my-2 md:my-0">
    <Logout
      class="flex items-center text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md transition duration-300 ease-in-out"
      @updateAuth="updateAuth">
      <ArrowLeftStartOnRectangleIcon class="w-5 h-5 mr-2" />
      로그아웃
    </Logout>
  </li>
  <li v-else class="my-2 md:my-0">
    <router-link to="/pages/login"
      class="flex items-center text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md transition duration-300 ease-in-out">
      <ArrowLeftEndOnRectangleIcon class="w-5 h-5 mr-2" />
      로그인
    </router-link>
  </li>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/vue/24/outline'
import Logout from './Logout.vue'  // Logout 컴포넌트 import

const props = defineProps({
  currentRoute: String,
  isAuth: Boolean
})

const emit = defineEmits(['updateAuth'])

const updateAuth = (newValue) => {
  emit('updateAuth', newValue)
}

const links = [
  { to: '/', icon: HomeIcon, label: '메인' },
  { to: '/pages/products', icon: ShoppingBagIcon, label: '상품' },
  { to: '/pages/member-info', icon: UserIcon, label: '회원정보' },
  { to: '/pages/order-history', icon: ClipboardDocumentListIcon, label: '주문내역' },
  { to: '/pages/admin', icon: Cog6ToothIcon, label: '관리자' },
]
</script>
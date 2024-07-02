<template>
  <template v-for="link in links" :key="link.to">
    <li class="my-2 md:my-0 md:mr-4">
      <router-link :to="link.to" class="flex items-center px-3 py-2 rounded-md transition duration-300 ease-in-out"
        :class="[
          currentRoute === link.to
            ? 'bg-blue-500 text-white'
            : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
        ]">
        <component :is="link.icon" :size="20" />
        <span class="ml-2">{{ link.label }}</span>
      </router-link>
    </li>
  </template>
  <li v-if="isAuth" class="my-2 md:my-0">
    <a href="#" @click.prevent="$emit('logout')"
      class="flex items-center text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md transition duration-300 ease-in-out">
      <LogOut :size="20" class="mr-2" />
      로그아웃
    </a>
  </li>
  <li v-else class="my-2 md:my-0">
    <router-link to="/pages/login"
      class="flex items-center text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md transition duration-300 ease-in-out">
      <LogIn :size="20" class="mr-2" />
      로그인
    </router-link>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Home, ShoppingBag, User, ClipboardList, Settings, LogIn, LogOut } from 'lucide-vue-next'

const props = defineProps({
  isAuth: Boolean,
  currentRoute: String
})

const emit = defineEmits(['logout'])

const links = [
  { to: '/', icon: Home, label: '메인' },
  { to: '/pages/products', icon: ShoppingBag, label: '상품' },
  { to: '/pages/member-info', icon: User, label: '회원정보' },
  { to: '/pages/order-history', icon: ClipboardList, label: '주문내역' },
  { to: '/pages/admin', icon: Settings, label: '관리자' },
]
</script>
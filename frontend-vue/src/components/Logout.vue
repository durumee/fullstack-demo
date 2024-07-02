<template>
  <a href="#" @click.prevent="handleLogout" :class="className">
    Logout
  </a>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  className: String
})

const emit = defineEmits(['logout'])

const router = useRouter()

const handleLogout = async () => {
  const token = sessionStorage.getItem("accessToken")

  if (token) {
    try {
      const response = await fetch("/invalidate-token", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        sessionStorage.removeItem("accessToken")
        emit('logout')
        router.push("/")
      } else {
        console.error("Failed to logout")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
}
</script>
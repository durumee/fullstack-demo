<template>
  <a href="#" @click.prevent="handleLogout">
    <slot></slot>
  </a>
</template>

<script setup>
import { useRouter } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const emit = defineEmits(['updateAuth'])

const router = useRouter()

const handleLogout = async () => {
  const token = sessionStorage.getItem("accessToken")

  if (token) {
    try {
      const response = await fetch(API_BASE_URL + "/invalidate-token", {
        method: "GET",
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        sessionStorage.removeItem("accessToken")
        emit('updateAuth', false)
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
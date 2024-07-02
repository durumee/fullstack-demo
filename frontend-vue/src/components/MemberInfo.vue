<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">회원 정보</h1>
    <div v-if="loading" class="text-center py-10">Loading...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>
    <div v-else-if="!memberInfo" class="text-center py-10">회원정보를 조회할 수 없습니다.</div>
    <div v-else class="bg-white shadow-md rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600">이름</p>
          <p class="text-xl font-semibold">{{ memberInfo.username }}</p>
        </div>
        <div>
          <p class="text-gray-600">이메일</p>
          <p class="text-xl font-semibold">{{ memberInfo.email }}</p>
        </div>
        <div>
          <p class="text-gray-600">전화번호</p>
          <p class="text-xl font-semibold">{{ memberInfo.phoneNumber }}</p>
        </div>
        <div>
          <p class="text-gray-600">주소</p>
          <p class="text-xl font-semibold">{{ memberInfo.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchWithAuth } from "../util/fetchWithAuth";

const memberInfo = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchMemberInfo = async () => {
  try {
    const response = await fetchWithAuth('/api/member');
    if (response.ok) {
      memberInfo.value = await response.json();
    } else {
      throw new Error('Failed to fetch member info');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMemberInfo);
</script>
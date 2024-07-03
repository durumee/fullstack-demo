<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">관리자 페이지</h1>
    <nav class="mb-8">
      <ul class="flex flex-wrap gap-4">
        <li>
          <RouterLink to="/pages/admin/members" class="text-blue-600 hover:text-blue-800">회원 관리</RouterLink>
        </li>
        <li>
          <RouterLink to="/pages/admin/products" class="text-blue-600 hover:text-blue-800">상품 관리</RouterLink>
        </li>
        <li>
          <RouterLink to="/pages/admin/orders" class="text-blue-600 hover:text-blue-800">주문 관리</RouterLink>
        </li>
        <li>
          <RouterLink to="/pages/admin/users" class="text-blue-600 hover:text-blue-800">시스템 사용자 관리</RouterLink>
        </li>
        <li>
          <RouterLink to="/pages/admin/roles" class="text-blue-600 hover:text-blue-800">역할 관리</RouterLink>
        </li>
      </ul>
    </nav>
    <RouterView />
  </div>
</template>

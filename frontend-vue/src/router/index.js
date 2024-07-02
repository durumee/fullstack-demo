import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Products from '../components/Products.vue'
import Login from '../components/Login.vue'
import MemberInfo from '../components/MemberInfo.vue'
import OrderHistory from '../components/OrderHistory.vue'
import AdminApp from '../AdminApp.vue'
import AdminMembers from '../components/AdminMembers.vue'
import AdminProducts from '../components/AdminProducts.vue'
import AdminOrders from '../components/AdminOrders.vue'
import AdminUsers from '../components/AdminUsers.vue'
import AdminRoles from '../components/AdminRoles.vue'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/pages/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true },
  },
  {
    path: '/pages/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/pages/member-info',
    name: 'MemberInfo',
    component: MemberInfo,
    meta: { requiresAuth: true },
  },
  {
    path: '/pages/order-history',
    name: 'OrderHistory',
    component: OrderHistory,
    meta: { requiresAuth: true },
  },
  {
    path: '/pages/admin',
    name: 'AdminApp',
    component: AdminApp,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'members',
        name: 'AdminMembers',
        component: AdminMembers,
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: AdminProducts,
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
      },
      {
        path: 'roles',
        name: 'AdminRoles',
        component: AdminRoles,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 네비게이션 가드 설정 (로그인 정보 여부 확인을 위해서 사용)
router.beforeEach((to, from, next) => {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem("accessToken")
    return !!token
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
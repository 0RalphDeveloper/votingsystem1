import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/register.vue'
import Login from '@/views/login.vue'
import Dashboard from '@/views/dashboard.vue'
import Admindashboard from '@/views/admin/admindashboard.vue'
import Qrscaner from '@/views/qrscaner.vue'

const routes = [
  { path: '/', redirect: '/scan' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/admindashboard', component: Admindashboard },
  { path: '/scan', component: Qrscaner },



]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router

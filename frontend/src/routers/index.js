import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/register.vue'
import Login from '@/views/login.vue'
import Dashboard from '@/views/dashboard.vue'
import Admindashboard from '@/views/admin/admindashboard.vue'
import Qrscaner from '@/views/qrscaner.vue'
import Candidates from '@/views/admin/candidates.vue'
import Usercandidates from '@/views/usercandidates.vue'
import CandidatesRanking from '@/views/candidatesRanking.vue'

const routes = [
  { path: '/', redirect: '/scan' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/admindashboard', component: Admindashboard },
  { path: '/scan', component: Qrscaner },
  { path: '/candidates', component: Candidates },
  { path: '/usercandidates', component: Usercandidates },
  { path: '/candidatesranking', component: CandidatesRanking },

]



const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router

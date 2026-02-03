<template>
  <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
  <div>
    <h2>Monitor Student Votes</h2>

    <div v-if="loading">
      Loading...
    </div>

    This is tracking students votes

  </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter,  } from 'vue-router'

import api from '../../services/api.js'
import Adminsidebar from '@/components/adminsidebar.vue';
const loading = ref(true)
const router = useRouter()
const data = ref(null)



const fetchDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/dashboardadmin', { withCredentials: true })
    data.value = res.data
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      router.push('/login')
    }
    data.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1; /* take up remaining space */
  padding: 2rem;
  background-color: #f7f7f7;
  overflow-y: auto;
}

p {
  margin: 0.5rem 0;
}
</style>
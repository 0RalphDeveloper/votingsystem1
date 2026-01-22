<template>
    <div class="dashboard-layout">
    <Usersidebar />
    <main class="main-content">
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <UserfetchCandidates />

  </div>
    </main>
  </div>
</template>

<script setup>
import api from '../services/api.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import UserfetchCandidates from '@/components/userfetchCandidates.vue';
import Usersidebar from '@/components/usersidebar.vue';

const loading = ref(true)
const data = ref(null)
const router = useRouter()

// Fetch dashboard data
const fetchDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/dashboard', { withCredentials: true })
    data.value = res.data
  } catch (err) {
    if (err.response?.status === 401) {
      router.push('/scan')
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
</style>

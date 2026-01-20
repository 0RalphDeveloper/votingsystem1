<template>
    <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <AdminAddCandidates />
    <AdminfetchCandidates />

  </div>
    </main>
  </div>
</template>

<script setup>
import api from '../../services/api.js'
import Adminsidebar from '@/components/adminsidebar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import AdminAddCandidates from '@/components/adminAddCandidates.vue';
import AdminfetchCandidates from '@/components/adminfetchCandidates.vue';

const loading = ref(true)
const data = ref(null)
const router = useRouter()

const fetchDashboard = async () => {
  loading.value = true
 try {
    const res = await api.get('/dashboardadmin', { withCredentials: true })
    data.value = res.data
  } catch (err) {
    if(err.response?.status === 401 || err.response?.status === 403){
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

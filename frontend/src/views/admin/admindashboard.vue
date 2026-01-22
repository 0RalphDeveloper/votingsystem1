<template>
  <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
  <div>
    <h2>Admin Dashboard</h2>

    <div v-if="loading">
      Loading...
    </div>

    <div v-else>
      <template v-if="data">
        <p>Id: {{ data.id }}</p>
        <p>Email: {{ data.email }}</p>
        <p>Role: {{ data.role }}</p>


      </template>
      <template v-else>
        <p>No data available</p>
      </template>
    </div>


  </div>
    </main>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import Adminsidebar from '@/components/adminsidebar.vue'

const data = ref(null)
const router = useRouter()
const loading = ref(true)

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

<template>
  <div>
    <h2>Dashboard</h2>

    <button @click="handleLogout">Logout</button>

    <div v-if="loading">
      Loading...
    </div>

    <div v-else>
      <template v-if="data">
        <p>Scanned ID: {{ data.value }}</p>
        <p>First Name: {{ data.firstname }}</p>
        <p>Middle Name: {{ data.middlename || 'N/A'  }}</p>
        <p>Last Name: {{ data.lastname }}</p>
      </template>
      <template v-else>
        <p>No data available</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const data = ref(null)
const loading = ref(true)
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

// Logout user
const handleLogout = async () => {
  try {
    await api.post('/logoutuser', {}, { withCredentials: true })
    router.push('/scan')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}


</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

button:hover {
  background-color: #d9363e;
}

p {
  margin: 0.5rem 0;
}
</style>

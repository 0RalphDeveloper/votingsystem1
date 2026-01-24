<template>
  <div class="dashboard-layout">
    <Usersidebar />

    <main class="main-content">
      <h2>Candidates Ranking</h2>

      <div v-if="loading" class="loading">Loading...</div>

      <div v-else>
        <div v-for="(group, role) in groupedByPosition" :key="role" class="role-group">
          <h3>{{ role }}</h3>
          <table class="ranking-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Total Votes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(candidate, index) in group" :key="candidate.candidateId">
                <td>{{ index + 1 }}</td>
                <td>{{ candidate.firstname }} {{ candidate.middlename }} {{ candidate.lastname }}</td>
                <td>{{ candidate.totalVotes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import api from '../services/api.js'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import Usersidebar from '@/components/usersidebar.vue';

const loading = ref(true)
const router = useRouter()
const candidatesRanking = ref([])

// Fetch vote counts
const getVoteCounts = async () =>{
  loading.value = true
  try{
    const response = await api.get('/getVoteCounts')
    candidatesRanking.value = response.data
  }catch(err){
    if (err.response?.status === 401) {
      router.push('/scan')
    }
    candidatesRanking.value = []
  } finally {
    loading.value = false
  }
}

// Group candidates by position and sort within each role by votes descending
const groupedByPosition = computed(() => {
  const groups = {}
  candidatesRanking.value.forEach(candidate => {
    const role = candidate.position || "Unknown"
    if (!groups[role]) groups[role] = []
    groups[role].push(candidate)
  })

  // Sort each group by totalVotes descending
  for (const role in groups) {
    groups[role].sort((a, b) => b.totalVotes - a.totalVotes)
  }

  return groups
})

onMounted(() => {
  getVoteCounts()
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f7f7f7;
  overflow-y: auto;
}
h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
}
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #555;
}
.loading {
  font-size: 1.2rem;
  color: #666;
}
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}
.ranking-table th,
.ranking-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.ranking-table th {
  background-color: #f0f0f0;
  font-weight: 600;
}
.ranking-table tbody tr:hover {
  background-color: #f9f9f9;
}
</style>

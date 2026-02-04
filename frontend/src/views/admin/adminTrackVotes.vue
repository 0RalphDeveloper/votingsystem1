<template>
  <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
      <div class="dashboard-header">
        <h2>Monitor Student Votes</h2>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <!-- Search bar -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student number..."
          class="search-input"
        />
      </div>

      <div v-if="loading" class="loading">
        Loading votes...
      </div>

      <div v-else class="votes-container">
        <div
          v-for="track in filteredTracks"
          :key="track.id"
          class="vote-card"
        >
          <p><strong>Student Number:</strong> {{ track.studentNumber }}</p>
            <p>{{ track.description }}</p>
          <p class="vote-time">
            <strong>Time:</strong> {{ formatDate(track.createdAt) }}
          </p>
        </div>

        <p v-if="filteredTracks.length === 0" class="no-results">
          No matching student votes found.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'
import Adminsidebar from '@/components/adminsidebar.vue';

const loading = ref(true)
const errorMsg = ref('')
const router = useRouter()
const tracks = ref([])
const searchQuery = ref('') // search input changes based on value inputted

// Computed filtered tracks
const filteredTracks = computed(() => {
  if (!searchQuery.value) return tracks.value
  return tracks.value.filter(track =>
    track.studentNumber
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
})
// Function to format datetime
const formatDate = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchTrackVotes = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await api.get('/trackvotes')
    tracks.value = response.data.data
  } catch (err) { 
    errorMsg.value = err.response?.data?.message || 'Failed to fetch track votes.'
  } finally {
    loading.value = false
  }
}

const fetchDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/dashboardadmin', { withCredentials: true })
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboard()
  fetchTrackVotes()
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

  /* remove vertical scrolling */
  overflow: hidden;

  /* allow grid to wrap */
  display: flex;
  flex-direction: column;
  height: 100vh; /* take full viewport */
}

.dashboard-header {
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.error-msg {
  color: #ff4d4f;
  margin-top: 0.5rem;
}

.loading {
  font-style: italic;
  color: #666;
}

/* New search input styling */
.search-input {
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.votes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;

  /* let the grid wrap to new lines */
  flex-grow: 1;
  align-content: start; /* top-align content */
}

.vote-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.vote-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.vote-card p {
  margin: 0.3rem 0;
}

.vote-card strong {
  color: #555;
}

.no-results {
  grid-column: 1 / -1;
  color: #999;
  font-style: italic;
  text-align: center;
  margin-top: 1rem;
}
</style>

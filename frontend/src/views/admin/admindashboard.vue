<template>
  <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
      <div class="header">
        <h2>Admin Dashboard</h2>
        <p class="subtitle">Manage your voting system</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>

      <div v-else class="dashboard-content">
        <template v-if="data">
          <div class="info-card">
            <div class="card-header">
              <h3>Account Information</h3>
              <span class="role-badge" :class="`role-${data.role?.toLowerCase()}`">
                {{ data.role }}
              </span>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">User ID</span>
                <span class="info-value">{{ data.id }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Email Address</span>
                <span class="info-value">{{ data.email }}</span>
              </div>
              
              <div class="info-item">
                <span class="info-label">Account Type</span>
                <span class="info-value">{{ data.role }}</span>
              </div>
            </div>
          </div>

          <!-- Stats Grid with Router Links -->
          <div class="stats-grid">
            <router-link to="/candidates" class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <h4>Manage Candidates</h4>
                <p>Add, edit, or remove candidates</p>
              </div>
            </router-link>

            <router-link to="/admincandidatesranking" class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <h4>View Rankings</h4>
                <p>Check current vote standings</p>
              </div>
            </router-link>

            <router-link to="/admintrackvotes" class="stat-card">
              <div class="stat-icon">🗳️</div>
              <div class="stat-content">
                <h4>Voting Records</h4>
                <p>Monitor voting activity</p>
              </div>
            </router-link>
          </div>
        </template>

        <template v-else>
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3>No Data Available</h3>
            <p>Unable to load dashboard information</p>
          </div>
        </template>
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
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.header {
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #1a202c;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: #718096;
  font-size: 1.1rem;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Info Card */
.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 600;
}

.role-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.role-admin {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.role-user {
  background: #dbeafe;
  color: #1e40af;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.125rem;
  color: #1a202c;
  font-weight: 600;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border-radius: 12px;
}

.stat-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  color: #2d3748;
  font-weight: 600;
}

.stat-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.empty-state p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .header h2 {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
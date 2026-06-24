<template>
  <div class="dashboard-layout">
    <Usersidebar />

    <main class="main-content">
      <div class="page-body">
        <h2 class="page-title">Dashboard</h2>

        <div v-if="loading" class="voter-card skeleton-card">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-lines">
            <div class="skeleton-line wide"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line narrow"></div>
          </div>
        </div>

        <div v-else-if="data" class="voter-card">
          <div class="voter-avatar">{{ avatarInitials }}</div>
          <div class="voter-info">
            <h3 class="voter-name">{{ fullName }}</h3>
            <span class="voter-id-badge">
              <i class="fas fa-id-card"></i>
              ID: {{ data.value }}
            </span>
            <div class="voter-fields">
              <div class="field-row">
                <span class="field-label">First name</span>
                <span class="field-value">{{ data.firstname }}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Middle name</span>
                <span class="field-value">{{ data.middlename || '—' }}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Last name</span>
                <span class="field-value">{{ data.lastname }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="fas fa-user-slash"></i>
          <p>No voter data available.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Usersidebar from '@/components/usersidebar.vue'

const data = ref(null)
const loading = ref(true)
const router = useRouter()

const fullName = computed(() => {
  if (!data.value) return ''
  return [data.value.firstname, data.value.middlename, data.value.lastname]
    .filter(Boolean).join(' ')
})

const avatarInitials = computed(() => {
  if (!data.value) return '?'
  const f = data.value.firstname?.[0] ?? ''
  const l = data.value.lastname?.[0] ?? ''
  return (f + l).toUpperCase() || '?'
})

const fetchDashboard = async () => {
  loading.value = true
  try {
    const res = await api.get('/dashboard', { withCredentials: true })
    data.value = res.data
  } catch (err) {
    if (err.response?.status === 401) router.push('/scan')
    data.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchDashboard())
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: #f4f6f8;
  overflow-y: auto;
}

.page-body {
  padding: 2rem;
  max-width: 680px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.voter-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.voter-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #144b18, #2e7d32);
  color: #fbc02d;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.voter-info { flex: 1; min-width: 0; }

.voter-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.4rem;
}

.voter-id-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.voter-fields { display: flex; flex-direction: column; gap: 0.5rem; }

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 1rem;
}

.field-row:last-child { border-bottom: none; }

.field-label { font-size: 0.8rem; color: #718096; font-weight: 500; white-space: nowrap; }
.field-value { font-size: 0.875rem; color: #2d3748; font-weight: 600; text-align: right; word-break: break-word; }

/* ── Skeleton ── */
.skeleton-card { align-items: center; }

.skeleton-avatar {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #e2e8f0;
  flex-shrink: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 10px; }

.skeleton-line {
  height: 14px; border-radius: 6px;
  background: #e2e8f0;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line.wide   { width: 70%; }
.skeleton-line.medium { width: 45%; }
.skeleton-line.narrow { width: 30%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ── Empty state ── */
.empty-state { text-align: center; color: #a0aec0; padding: 3rem 1rem; }
.empty-state i { font-size: 2.5rem; margin-bottom: 0.75rem; display: block; }
.empty-state p { font-size: 0.95rem; margin: 0; }

/* ── Mobile ── */
@media (max-width: 768px) {
  .page-body {
    padding: 1.25rem 1rem;
    padding-bottom: calc(1.25rem + 68px);
  }

  .page-title { font-size: 1.25rem; }

  .voter-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.25rem;
  }

  .voter-name { font-size: 1rem; }
  .field-row { flex-direction: column; align-items: flex-start; gap: 2px; }
  .field-value { text-align: left; }
}
</style>
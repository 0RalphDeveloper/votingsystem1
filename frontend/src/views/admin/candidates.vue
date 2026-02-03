<template>
  <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
      <div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
        <div v-if="loading">Loading...</div>

        <AdminAddCandidates />
        <section
          v-for="position in positions"
          :key="position"
          class="position-section"
        >
          <h2 class="position-title">{{ position }}</h2>

          <div class="cards-wrapper">
            <div
              v-for="candidate in candidatesByPosition(position)"
              :key="candidate.id"
              class="candidate-card"
            >
              <p class="partylist">{{ candidate.partylist }}</p>
              <p class="name">
                {{ candidate.firstname }}
                {{ candidate.middlename || '' }}
                {{ candidate.lastname }}
              </p>

              <!-- Edit button -->
              <button class="edit-btn" @click="openEditModal(candidate)">
                Edit
              </button>
              <button class="delete-btn" @click="deleteCandidate(candidate)">
                Delete
              </button>
            </div>

            <!-- Empty state -->
            <p v-if="candidatesByPosition(position).length === 0" class="empty">
              No candidates
            </p>
          </div>
        </section>

        <!-- Edit Candidate Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
            <h3>Edit Candidate</h3>

            <form @submit.prevent="submitEdit">
              <label>
                First Name:
                <input v-model="editCandidateData.firstname" required />
              </label>
              <label>
                Middle Name:
                <input v-model="editCandidateData.middlename" />
              </label>
              <label>
                Last Name:
                <input v-model="editCandidateData.lastname" required />
              </label>
              <label>
                Partylist:
                <input v-model="editCandidateData.partylist" required />
              </label>

              <div class="modal-actions">
                <button type="submit" class="save-btn" :disabled="submitting">
                  {{ submitting ? 'Saving...' : 'Save' }}
                </button>
                <button type="button" class="cancel-btn" @click="closeModal" :disabled="submitting">
                  Cancel
                </button>
              </div>
            </form>

            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import api from '../../services/api.js'
import '../../design/candidatesdesign.css'
import Adminsidebar from '@/components/adminsidebar.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminAddCandidates from '@/components/adminAddCandidates.vue'

const successMsg = ref('') 

const router = useRouter()
const loading = ref(true)
const data = ref(null)

const positions = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'Public Information Officer',
  'Peace Officer',
  'Representative'
]

const candidates = ref([])

const fetchCandidates = async () => {
  try {
    const response = await api.get('/getCandidates')
    candidates.value = response.data.data
  } catch (err) {
    console.error('Failed to fetch candidates:', err)
  }
}

// Filter candidates by position
const candidatesByPosition = (position) => {
  return candidates.value
    .filter(c => c.position === position)
    .sort((a, b) => a.lastname.localeCompare(b.lastname))
}

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

const showModal = ref(false)
const editCandidateData = ref({
  id: null,
  firstname: '',
  middlename: '',
  lastname: '',
  partylist: '',
})
const submitting = ref(false)
const errorMsg = ref('')

const openEditModal = (candidate) => {
  editCandidateData.value = { ...candidate }
  errorMsg.value = ''
  showModal.value = true
}

const closeModal = () => {
  if (!submitting.value) {
    showModal.value = false
    errorMsg.value = ''
  }
}

const deleteCandidate = async (candidate) => {
  const confirmed = confirm(`Are you sure you want to delete ${candidate.firstname} ${candidate.lastname}?`)
  
  if (!confirmed) return

  try {
    await api.delete(`deleteCandidate/${candidate.id}`);
    candidates.value = candidates.value.filter(c => c.id !== candidate.id)

    successMsg.value = 'Candidate updated successfully!'
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Failed to update candidate.'
  }
};

const submitEdit = async () => {
  submitting.value = true
  errorMsg.value = ''

  try {
    const { id, firstname, middlename, lastname, partylist } = editCandidateData.value

    await api.patch(`/updateCandidate/${id}`, { firstname, middlename, lastname, partylist })

    // Update local candidates array
    const index = candidates.value.findIndex(c => c.id === id)
    if (index !== -1) {
      candidates.value[index] = { ...editCandidateData.value }
    }

    showModal.value = false
    successMsg.value = 'Candidate updated successfully!'
    setTimeout(() => {
      successMsg.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error updating candidate:', err)
    errorMsg.value = err.response?.data?.message || 'Failed to update candidate.'
  } finally {
    submitting.value = false
  }
}

// Fetch data on mount
onMounted(() => {
  fetchDashboard()
  fetchCandidates()
})
</script>

<style scoped>
.error-msg {
  color: red;
  margin-top: 0.5rem;
}
</style>

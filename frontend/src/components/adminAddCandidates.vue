<template>   
<h2>Candidates Page</h2>
    <p v-if="message" class="success-message">
      {{ message }}
    </p>
    <button @click.prevent="isOpen = true">Add Candidates</button>

      <div v-if="isOpen" class="modal-overlay" @click.prevent="isOpen = false">
        <div class="modal-content" @click.stop>
          <form @submit.prevent="submitCandidates" class="form">
            <h2>PartyList</h2>
          <label>PartyList:</label>
          <input v-model="partylist" type="text" required/>

            <div
              v-for="(candidate) in candidates"
              :key="candidate.position"
              class="position-section"
            >
              <h2>{{ candidate.position }}</h2>

              <label>Firstname:</label>
              <input v-model="candidate.firstname" type="text"  />

              <label>Middlename:</label>
              <input v-model="candidate.middlename" type="text" />

              <label>Lastname:</label>
              <input v-model="candidate.lastname" type="text"  />
            </div>

          <button type="submit" :disabled="!hasAtLeastOneCandidate">
            Save Candidates
          </button>
          </form>
            <button @click.prevent="isOpen = false">Close</button>
        </div>
      </div>
</template>

<script setup>
import api from '../services/api.js'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const isOpen = ref(false)
const message = ref('')
const partylist = ref('')

const positions = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'Public Information Officer',
  'Peace Officer',
  'Representative',
]
const candidates = ref(
  positions.map(position => ({
    position,
    firstname: '',
    middlename: '',
    lastname: '',
  }))
)


const submitCandidates = async () => {

    message.value = ''

    const filteredCandidates = candidates.value
      .filter(c =>
        c.firstname.trim() !== '' ||
        c.lastname.trim() !== ''
      )
      .map(c => ({
        position: c.position,
        firstname: c.firstname.trim(),
        middlename: c.middlename.trim(),
        lastname: c.lastname.trim(),
        partylist: partylist.value
      }))
  try {
    const response = await api.post('/candidatesEntry', filteredCandidates)

    message.value = response.data.message
    isOpen.value = false

    // Reset form input fields
    candidates.value = positions.map(position => ({
      position,
      firstname: '',
      middlename: '',
      lastname: '',
    }))
    partylist.value = ''

  } catch (err) {
    message.value = err.response?.data?.message || 'Please try again.'
    isOpen.value = false

  }
}

const hasAtLeastOneCandidate = computed(() =>
  candidates.value.some(c => c.firstname || c.lastname)
)



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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  height: 85%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
}

</style>
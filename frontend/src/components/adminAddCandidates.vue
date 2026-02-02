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
        c.firstname.trim() !== '' || c.lastname.trim() !== '')
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

    
    filteredCandidates.forEach(newC => {
      const existingIndex = candidates.value.findIndex(
        c => c.position === newC.position && c.firstname === '' && c.lastname === ''
      );
      if (existingIndex !== -1) {
        candidates.value[existingIndex] = { ...newC };
      } else {
        candidates.value.push({ ...newC });
      }
    });

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
    setTimeout(() => {
      message.value = ''
    }, 5000)
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
  max-height: 90vh;

}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start; /* aligns modal slightly from top */
  justify-content: center;
  padding-top: 1rem; /* space from top */
  overflow-y: auto;
  z-index: 1000;
}

/* Modal content */
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

/* Form inside modal */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Grouping inputs */
.position-section {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: #fafafa;
}

.position-section h2 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

/* Inputs */
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}

/* Buttons */
button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #28a745;
  color: white;
  font-weight: 600;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.modal-content > button {
  background-color: #dc3545;
  color: white;
  margin-top: 1rem;
}

.modal-content > button:hover {
  background-color: #c82333;
}

/* Success message */
.success-message {
  color: green;
  font-weight: bold;
  margin-bottom: 1rem;
}


</style>
<template>
  <section
    v-for="position in positions"
    :key="position"
    class="position-section"
  >
    <h2 class="position-title">{{ position }}</h2>

    <div class="cards-wrapper">
      <div
        v-for="candidate in candidatesByPosition(position)" :key="candidate.id"
        class="candidate-card" :class="{ selected: selectedByPosition[position] === candidate.id }"
        @click.prevent="selectCandidate(position, candidate.id)"
      >
        <p class="partylist">{{ candidate.partylist }}</p>
        <p class="name">
          {{ candidate.firstname }}
          {{ candidate.middlename || '' }}
          {{ candidate.lastname }}
        </p>
      </div>

      <p
        v-if="candidatesByPosition(position).length === 0"
        class="empty"
      >
        No candidates
      </p>
    </div>
  </section>
<div class="vote-wrapper">
  <button
    class="vote-btn"
    @click="submitVote"
    :disabled="loading"
  >
    <span v-if="loadingButton">Submitting...</span>
    <span v-else>Vote</span>
  </button>
</div>
</template>

<script setup>
import api from '../services/api.js'
import { ref, onMounted } from 'vue'

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
const selectedByPosition = ref({})
const loadingButton = ref(false) //for button tracking if submitting


const fetchCandidates = async () => {
  const response = await api.get('/getCandidates')
  candidates.value = response.data.data
}

const candidatesByPosition = (position) => {
  return candidates.value
    .filter(c => c.position === position)
    .sort((a, b) => a.lastname.localeCompare(b.lastname))
}

const selectCandidate = (position, candidateId) => {
  selectedByPosition.value[position] = candidateId
}

const submitVote = async () => {
  try {
    loadingButton.value = true 
    await api.post('/submitVote', {votes: selectedByPosition.value})

    alert('Vote submitted successfully')
    selectedByPosition.value = {}
  } catch (err) {
    if(err.response?.status === 400){
      alert('Vote already commited. Double Entry is prohibited')
    }
    selectedByPosition.value = {}

  } finally {
    loadingButton.value = false
  }
}

onMounted(fetchCandidates)
</script>

<style scoped>

.partylist {
  font-size: 0.7rem;
  color: #555;
  font-style: italic;
}

.position-section {
  margin-bottom: 2rem;
}

.position-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.cards-wrapper {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.candidate-card {
  min-width: 220px;
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.2s;
}

.candidate-card {
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
}

.candidate-card:hover {
  transform: translateY(-2px);
}

.candidate-card.selected {
  border-color: #42b983;
  background: #f0fff8;
}

.name {
  font-weight: 600;
}

.empty {
  color: #888;
  font-style: italic;
}

.vote-wrapper {
  margin-top: 2rem;
  text-align: center;
}

.vote-btn {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  cursor: pointer;
}

.vote-btn:hover {
  opacity: 0.9;
}
</style>

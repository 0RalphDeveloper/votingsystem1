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
        class="candidate-card"
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

const fetchCandidates = async () => {
  const response = await api.get('/getCandidates')
  candidates.value = response.data.data
}

const candidatesByPosition = (position) => {
return candidates.value
  .filter(c => c.position === position)
  .sort((a, b) => a.lastname.localeCompare(b.lastname))
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
}

.name {
  font-weight: 600;
}

.empty {
  color: #888;
  font-style: italic;
}
</style>


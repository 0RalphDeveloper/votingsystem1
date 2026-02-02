<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import api from '../services/api.js'

const route = useRoute()
const candidateId = route.params.id

onMounted(async () => {
  const res = await api.get(`/getCandidate/${candidateId}`)
  console.log(res.data)
})
</script>

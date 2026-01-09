<template>
    <div class="dashboard-layout">
    <Adminsidebar />
    <main class="main-content">
  <div>
    <h2>Candidates Page</h2>

  </div>
    </main>
  </div>
</template>

<script setup>
import api from '../../services/api.js'
import Adminsidebar from '@/components/adminsidebar.vue'

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
</style>

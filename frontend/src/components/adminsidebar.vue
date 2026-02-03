<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Voting System</h2>
    </div>

    <ul class="sidebar-links">
      <li>
        <router-link to="/admindashboard" class="link" active-class="active">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>
      </li>

      <li>
        <router-link to="/candidates" class="link" active-class="active">
          <i class="fas fa-person"></i>
          <span>Candidates</span>
        </router-link>
      </li>

      <li>
        <router-link to="/admincandidatesranking" class="link" active-class="active">
          <i class="fas fa-person"></i>
          <span>Candidates Ranking</span>
        </router-link>
      </li>

        <li>
        <router-link to="/admintrackvotes" class="link" active-class="active">
          <i class="fas fa-person"></i>
          <span>Monitor Votes</span>
        </router-link>
      </li>


      <li>
        <button class="link logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

// Logout user
const handleLogout = async () => {
  try {
    await api.post('/logoutadmin', {}, { withCredentials: true })
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: linear-gradient(180deg, #144b18, #2e7d32);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 2rem 0.75rem;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #fbc02d;
}

.sidebar-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.sidebar-links li {
  margin-bottom: 0.75rem;
}

.link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.link i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
  color: #fbc02d;
}

.link:hover {
  background-color: #fff3cd;
  color: #1f2933;
}

.link:hover i {
  color: #2e7d32;
}

.link.active {
  background-color: #fbc02d;
  color: #1f2933;
  font-weight: 600;
}

.link.active i {
  color: #1b5e20;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

/* Logout emphasis */
.logout-btn:hover {
  background-color: #695932b4;
}

</style>

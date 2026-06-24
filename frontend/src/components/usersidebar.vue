<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Voting System</h2>
    </div>

    <ul class="sidebar-links">
      <li>
        <router-link to="/dashboard" class="link" active-class="active">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/usercandidates" class="link" active-class="active">
          <i class="fas fa-person"></i>
          <span>Candidates</span>
        </router-link>
      </li>
      <li>
        <router-link to="/candidatesranking" class="link" active-class="active">
          <i class="fas fa-ranking-star"></i>
          <span>Ranking</span>
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

  <!-- Mobile bottom nav — shown only on small screens -->
  <nav class="bottom-nav">
    <router-link to="/dashboard" class="bottom-nav-item" active-class="active">
      <i class="fas fa-tachometer-alt"></i>
      <span>Home</span>
    </router-link>
    <router-link to="/usercandidates" class="bottom-nav-item" active-class="active">
      <i class="fas fa-person"></i>
      <span>Candidates</span>
    </router-link>
    <router-link to="/candidatesranking" class="bottom-nav-item" active-class="active">
      <i class="fas fa-ranking-star"></i>
      <span>Ranking</span>
    </router-link>
    <button class="bottom-nav-item logout-nav" @click="handleLogout">
      <i class="fas fa-sign-out-alt"></i>
      <span>Logout</span>
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const handleLogout = async () => {
  try {
    await api.post('/logoutuser', {}, { withCredentials: true })
    router.push('/scan')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<style scoped>
/* ── Desktop sidebar ── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: linear-gradient(180deg, #144b18, #2e7d32);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 2rem 0.75rem;
  box-shadow: 2px 0 12px rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.sidebar-header h2 {
  font-size: 1.2rem;
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

.sidebar-links li { margin-bottom: 0.75rem; }

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

.link i { width: 20px; text-align: center; font-size: 1rem; color: #fbc02d; }
.link:hover { background-color: #fff3cd; color: #1f2933; }
.link:hover i { color: #2e7d32; }
.link.active { background-color: #fbc02d; color: #1f2933; font-weight: 600; }
.link.active i { color: #1b5e20; }

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.logout-btn:hover { background-color: rgba(105,89,50,0.7); }

/* ── Bottom nav (mobile only) ── */
.bottom-nav { display: none; }

@media (max-width: 768px) {
  .sidebar { display: none; }

  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #144b18, #2e7d32);
    z-index: 200;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
    padding: 0.4rem 0 env(safe-area-inset-bottom, 0.5rem);
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: rgba(255,255,255,0.65);
    font-size: 0.65rem;
    font-weight: 500;
    text-decoration: none;
    padding: 0.35rem 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .bottom-nav-item i { font-size: 1.15rem; }

  .bottom-nav-item.active,
  .bottom-nav-item:hover { color: #fbc02d; }

  .logout-nav { color: rgba(255,255,255,0.65); }
  .logout-nav:hover { color: #fbc02d; }
}
</style>
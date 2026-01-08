<template>
  <div class="register-container">
    <!-- Left side with image -->
    <div class="register-image"></div>

    <!-- Right side registration card -->
    <div class="register-card">
      <div class="header">
        <h2>Vote Wisely</h2>
        <p class="subtitle">Start your journey to vote wisely.</p>
      </div>

      <form @submit.prevent="register" class="form">
        <!-- Email Field -->
        <div class="input-group">
          <input
            id="email"
            v-model="email"
            type="email"
            required
          />
          <label for="email" :class="{ active: email }">Email</label>
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <div class="input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
            />
            <label for="password" :class="{ active: password }">Password</label>
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="register-btn">Sign Up</button>

        <div v-if="message" class="message">{{ message }}</div>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const showPassword = ref(false)
const router = useRouter()
const email = ref('')
const password = ref('')
const message = ref('')

const register = async () => {
  try {
    await api.post('/register', { email: email.value, password: password.value })
    message.value = 'Account created successfully!'
    email.value = ''
    password.value = ''
    router.push('/login')
  } catch (err) {
    message.value = err.response?.data?.message || 'Registration failed'
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }

/* ===== Split Screen ===== */
.register-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.register-image {
  flex: 1;
  background-image: url('/images/voting.jpg');
  background-size: cover;
  background-position: center;
}

.register-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background-color: #ffffff;
}

/* Header */
.header { text-align: center; margin-bottom: 2rem; }
.header h2 { font-size: 2rem; font-weight: 700; color: #1a202c; margin-bottom: 0.5rem; }
.subtitle { font-size: 1rem; color: #718096; }

/* ===== Inputs with floating labels ===== */
.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f7fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Floating Label */
.input-group label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #718096;
  pointer-events: none;
  transition: 0.2s ease all;
  background: #f7fafc;
  padding: 0 0.25rem;
}

.input-group input:focus + label,
.input-group label.active {
  top: -0.5rem;
  left: 0.75rem;
  font-size: 0.75rem;
  color: #667eea;
}

/* Password toggle icon */
.input-wrapper { position: relative; }
.toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #667eea;
  font-size: 1rem;
}
.toggle-password:hover { color: #764ba2; }

/* Button */
.register-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #ce8e3a, #a36617);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
}
.register-btn:hover {
 background: linear-gradient(135deg, #d19a4a, #b17725)
}

/* Messages */
.message {
  font-size: 0.875rem;
  color: #2f855a;
  margin-bottom: 1rem;
}

/* Login link */
.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #718096;
}
.login-link a {
  color: #2f439b;
  font-weight: 600;
  text-decoration: none;
}
.login-link a:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 768px) {
  .register-container { flex-direction: column; }
  .register-image { height: 200px; width: 100%; }
  .register-card { width: 100%; padding: 2rem; }
}
</style>

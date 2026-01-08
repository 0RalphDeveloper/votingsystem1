<template>
  <div class="login-container">
    <!-- Left side with background image -->
    <div class="login-image"></div>

    <!-- Right side login card -->
    <div class="login-card">
      <div class="header">
        <h2>Welcome to Cafelax</h2>
        <p class="subtitle">Where every sip feels like home that can't be forgotten.</p>
      </div>

      <form @submit.prevent="login" class="form">
        <div class="input-group">
          <input
            id="email"
            v-model="email"
            type="email"
            required
          />
          <label for="email" :class="{ active: email }">Email</label>
        </div>

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

        <!-- Footer -->
        <div class="form-footer">
          <div></div>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="!loading">Sign In</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </form>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <p class="register">
        Don't have an account?
        <router-link to="/register">Create account</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('error')
const showPassword = ref(false)

const login = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    const token = response.data.token
    const role = response.data.role
    if (token) localStorage.setItem('userToken', token)

    if(role === 'user'){
      router.push('/dashboard')
    }
    else if(role ==='admin'){
      router.push('/admindashboard')
    }
  } catch (err) {
    messageType.value = 'error'
    message.value = err.response?.data?.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.login-image {
  flex: 1;
  background-image: url('/images/voting.jpg');
  background-size: cover;
  background-position: center;
}

.login-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background-color: #ffffff;
}

.header { text-align: center; margin-bottom: 2rem; }
.header h2 { font-size: 2rem; font-weight: 700; color: #1a202c; margin-bottom: 0.5rem; }
.subtitle { font-size: 1rem; color: #718096; }

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

.form-footer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.875rem; }
.forgot-password { color: #455cbe; font-weight: 550; text-decoration: none; }
.forgot-password:hover { text-decoration: underline; }

.login-btn {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #ce8e3a, #a36617);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}
.login-btn:hover:not(:disabled) { background: linear-gradient(135deg, #d19a4a, #b17725); }
.login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.message { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; }
.message.error { background: #fed7d7; color: #c53030; }
.message.success { background: #c6f6d5; color: #2f855a; }

.register { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #718096; }
.register a { color: #2f439b; font-weight: 600; text-decoration: none; }
.register a:hover { text-decoration: underline; }

@media (max-width: 768px) {
  .login-container { flex-direction: column; }
  .login-image { height: 200px; width: 100%; }
  .login-card { width: 100%; padding: 2rem; }
}
</style>

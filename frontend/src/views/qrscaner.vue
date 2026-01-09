<template>
  <div class="scanner-container">
    <div class="content-wrapper">
      <h2 class="title">Vote Now</h2>
      <p class="description">Click the button below to scan your QR code and cast your vote</p>
      
      <!-- Vote Button - shown when scanner is not active -->
      <button 
        v-if="!isScannerActive" 
        @click="startScanning"
        class="vote-button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        Scan QR Code to Vote
      </button>

      <!-- QR Scanner - shown when active -->
      <div v-if="isScannerActive" class="scanner-wrapper">
        <div id="qr-reader"></div>
        
        <button @click="cancelScanning" class="cancel-button">
          Cancel Scanning
        </button>
      </div>

      <!-- Message Display -->
      <p v-if="message" class="message" :class="messageType">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../services/api'

const message = ref('')
const messageType = ref('') // 'success' or 'error'
const isScannerActive = ref(false)
let html5QrCode = null
const router = useRouter()
const qrRegionId = "qr-reader"

// Stop and clear scanner safely
const stopScanner = async () => {
  if (!html5QrCode) return

  try {
    await html5QrCode.stop()
    await html5QrCode.clear()
    html5QrCode = null
  } catch (err) {
    console.warn("Error stopping/clearing scanner (ignored):", err)
  }
}

const handleScan = async (decodedText) => {
  try {
    const res = await api.post('/scan', { scannedValue: decodedText })   
    // message.value = 'Scan successful, proceeding to dashboard...'
    // messageType.value = 'success'
    await stopScanner()
    isScannerActive.value = false
    router.push('/dashboard')

  } catch (err) {
    message.value = 'Scan failed or Student is not in the list.'
    console.log(decodedText)
    messageType.value = 'error'
    await stopScanner()
    isScannerActive.value = false
  }
}


const startScanning = () => {
  isScannerActive.value = true
  message.value = ''
  messageType.value = ''
  
  // Wait for DOM to update before initializing scanner
  setTimeout(() => {
    html5QrCode = new Html5Qrcode(qrRegionId)
    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleScan
      )
      .then(() => {
        console.log('Camera initialized')
        message.value = 'Point your camera at the QR code'
        messageType.value = 'info'
      })
      .catch(err => {
        console.error('Camera init failed:', err)
        message.value = 'Failed to access camera. Please check permissions.'
        messageType.value = 'error'
        isScannerActive.value = false
      })
  }, 100)
}

const cancelScanning = async () => {
  await stopScanner()
  isScannerActive.value = false
  message.value = 'Scanning cancelled'
  messageType.value = 'info'
}

onBeforeUnmount(async () => {
  await stopScanner()
})
</script>

<style scoped>
.scanner-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.description {
  text-align: center;
  color: #718096;
  margin-bottom: 2rem;
}

.vote-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.vote-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.vote-button:active {
  transform: translateY(0);
}

.scanner-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#qr-reader {
  margin: 0 auto;
  width: 100%;
  max-width: 400px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.cancel-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #e53e3e;
  background: white;
  border: 2px solid #e53e3e;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #e53e3e;
  color: white;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.message.error {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #fc8181;
}

.message.info {
  background: #bee3f8;
  color: #2c5282;
  border: 1px solid #90cdf4;
}
</style>
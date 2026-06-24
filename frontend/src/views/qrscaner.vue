<template>
  <div class="scanner-container">
    <div class="content-wrapper">
      <h2 class="title">Vote Now</h2>
      <p class="description">Click the button below to scan your QR code and cast your vote</p>
      
      <button 
        v-if="!isScannerActive" 
        @click="startScanning"
        class="vote-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        Scan QR Code to Vote
      </button>

      <div v-if="isScannerActive" class="scanner-wrapper">
        <!-- The library mounts the video inside here -->
        <div class="scanner-viewport">
          <div id="qr-reader"></div>
          <!-- Our custom canvas overlay draws on top of the video -->
          <canvas ref="overlayCanvas" class="scanner-overlay"></canvas>
          <!-- Corner bracket SVG — pure CSS, always visible on mobile -->
          <div class="scan-frame">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
            <div class="scan-line"></div>
          </div>
          <p class="scan-hint">Align QR code within the frame</p>
        </div>

        <button @click="cancelScanning" class="cancel-button">
          Cancel Scanning
        </button>
      </div>

      <p v-if="message" class="message" :class="messageType">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../services/api'

const message = ref('')
const messageType = ref('')
const isScannerActive = ref(false)
const overlayCanvas = ref(null)
let html5QrCode = null
let overlayAnimFrame = null
const router = useRouter()
const qrRegionId = "qr-reader"

const stopScanner = async () => {
  if (overlayAnimFrame) {
    cancelAnimationFrame(overlayAnimFrame)
    overlayAnimFrame = null
  }
  if (!html5QrCode) return
  try {
    await html5QrCode.stop()
    await html5QrCode.clear()
    html5QrCode = null
  } catch (err) {
    console.warn("Error stopping scanner:", err)
  }
}

// Draws the dark overlay + bright square cutout on the canvas
const drawOverlay = () => {
  const canvas = overlayCanvas.value
  if (!canvas) return

  const parent = canvas.parentElement
  canvas.width = parent.offsetWidth
  canvas.height = parent.offsetHeight

  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Square size = 70% of shortest side, centered
  const boxSize = Math.floor(Math.min(w, h) * 0.7)
  const x = (w - boxSize) / 2
  const y = (h - boxSize) / 2

  // Dark overlay with cutout
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.fillRect(0, 0, w, h)

  // Cut the bright square out of the dark overlay
  ctx.clearRect(x, y, boxSize, boxSize)

  // White border around the cutout
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x, y, boxSize, boxSize)

  overlayAnimFrame = requestAnimationFrame(drawOverlay)
}

const handleScan = async (decodedText) => {
  try {
    await api.post('/scan', { scannedValue: decodedText })
    await stopScanner()
    isScannerActive.value = false
    router.push('/dashboard')
  } catch (err) {
    message.value = 'Scan failed or Student is not in the list.'
    messageType.value = 'error'
    await stopScanner()
    isScannerActive.value = false
  }
}

const startScanning = async () => {
  isScannerActive.value = true
  message.value = ''
  messageType.value = ''

  await nextTick()

  html5QrCode = new Html5Qrcode(qrRegionId)

  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10,
        // Still pass a qrbox so the library knows the scan region internally,
        // but we'll hide its visual overlay via CSS and draw our own
        qrbox: (vw, vh) => {
          const size = Math.floor(Math.min(vw, vh) * 0.7)
          return { width: size, height: size }
        },
        aspectRatio: 1,
      },
      handleScan
    )
    .then(() => {
      // Start drawing our custom overlay once camera is live
      drawOverlay()
    })
    .catch(err => {
      console.error('Camera init failed:', err)
      message.value = 'Failed to access camera. Please check permissions.'
      messageType.value = 'error'
      isScannerActive.value = false
    })
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

.scanner-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Wraps the video + our overlay canvas together */
.scanner-viewport {
  position: relative;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #000;
  /* Square aspect ratio so canvas fills correctly */
  aspect-ratio: 1 / 1;
}

/* Hide html5-qrcode's own shaded overlay — we draw our own */
.scanner-viewport :deep(#qr-shaded-region) {
  display: none !important;
}

/* Also hide its injected status text and file upload UI */
.scanner-viewport :deep(#qr-reader__status_span),
.scanner-viewport :deep(#qr-reader__dashboard_section_csr),
.scanner-viewport :deep(#qr-reader__header_message) {
  display: none !important;
}

#qr-reader {
  width: 100% !important;
  height: 100% !important;
}

/* Make the video fill the viewport square */
.scanner-viewport :deep(video) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  display: block;
}

/* Our canvas overlay — sits on top of the video */
.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Corner bracket frame — drawn with CSS borders, always visible on mobile */
.scan-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: #667eea;
  border-style: solid;
}

.corner.tl { top: 0; left: 0;  border-width: 3px 0 0 3px; border-radius: 3px 0 0 0; }
.corner.tr { top: 0; right: 0; border-width: 3px 3px 0 0; border-radius: 0 3px 0 0; }
.corner.bl { bottom: 0; left: 0;  border-width: 0 0 3px 3px; border-radius: 0 0 0 3px; }
.corner.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; border-radius: 0 0 3px 0; }

/* Animated scan line */
.scan-line {
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0%   { top: 4px; opacity: 1; }
  90%  { top: calc(100% - 4px); opacity: 1; }
  100% { top: calc(100% - 4px); opacity: 0; }
}

.scan-hint {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255,255,255,0.85);
  font-size: 0.8rem;
  font-weight: 500;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
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

.message.success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
.message.error   { background: #fed7d7; color: #742a2a; border: 1px solid #fc8181; }
.message.info    { background: #bee3f8; color: #2c5282; border: 1px solid #90cdf4; }
</style>
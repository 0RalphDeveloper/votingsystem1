import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
// import { Server } from 'socket.io'
import authRoutes from './routes/auth.route.js'
// import { chatSocket } from './socket/chat_socket.js' // make sure path is correct

const app = express()

// Middleware
app.use(cors({ origin: 'http://localhost:5173',
  credentials:true
 }))
app.use(express.json())
app.use(cookieParser()) // important!

// Routes
app.use('/api', authRoutes)

// Create HTTP server
 const server = http.createServer(app)

// // Attach Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST']
//   }
// })

// // Initialize chat sockets
// chatSocket(io)

// Start server
const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on http://localhost:${PORT}`)
})
export default app

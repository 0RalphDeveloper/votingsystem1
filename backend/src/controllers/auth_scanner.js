import 'dotenv/config'
import axios from 'axios'
import crypto from 'crypto'

const DIRECTUS_URL = process.env.DIRECTUS_URL
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN

const directus = axios.create({
  baseURL: `${DIRECTUS_URL}/items`,
  headers: {
    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

export const scanQRCode = async (req, res) => {
  try {
    const { scannedValue } = req.body
    if (!scannedValue) return res.status(400).json({ message: 'ID is required' })

    // Check if scannedValue exists in studentsaccount
    const studentRes = await directus.get('/studentsaccount', {
    params: { 'filter[idNumber][_eq]': scannedValue }
    })

    if (studentRes.data.data.length === 0) {
    return res.status(400).json({ message: 'Invalid student QR code' })
    }
    
    const existingId = await directus.get('/scannedId', {
      params: { 'filter[value][_eq]': scannedValue }
    })

    // Generate token
    const newToken = crypto.randomBytes(16).toString('hex')

    if (existingId.data.data.length === 0) {
      await directus.post('/scannedId', {
        value: scannedValue,
        timestamp: new Date().toISOString(),
        token: newToken
      })
    } else {
      const idToUpdate = existingId.data.data[0].id
      await directus.patch(`/scannedId/${idToUpdate}`, { token: newToken })
    }

    // Set token as HTTP-only cookie
    res.cookie('userToken', newToken, {
      httpOnly: true,       // Cannot be accessed by JS
      secure: false,        // true if using HTTPS
      sameSite: 'lax',      // prevents CSRF in most cases
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.status(200).json({ message: 'ID processed' })
  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ message: 'Failed to save scanned ID' })
  }
}

// Dashboard route
export const getDashboard = async (req, res) => {
  try {
    const token = req.cookies.userToken // read HTTP-only cookie

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    // Find the user/scan record that has this token
    const response = await directus.get('/scannedId', {
      params: { 'filter[token][_eq]': token }
    })

    const data = response.data.data[0]
    if (!data) return res.status(401).json({ message: 'Invalid token' })

    const studentResponse = await directus.get('/studentsaccount', {
      params: { 'filter[idNumber][_eq]': data.value }
    })
    const studentData = studentResponse.data.data[0]
    if (!studentData) {
    return res.status(404).json({ message: 'Student not found' })
    }

    res.status(200).json({
      message: 'Dashboard data',
      value: data.value,
      firstname: studentData.firstname,
      middlename: studentData.middlename,
      lastname:studentData.lastname,
    }) 
 


  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const logout = async (req, res) => {
    const token = req.cookies.userToken // read HTTP-only cookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const userResponse = await directus.get('/scannedId', {
      params: { 'filter[token][_eq]': token }
    })

    const student = userResponse.data.data[0]

    if (!student) {
      return res.status(204).send()
    }

    // Invalidate token
    await directus.patch(`/scannedId/${student.id}`, { token: null })

    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error(err.response?.data || err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}

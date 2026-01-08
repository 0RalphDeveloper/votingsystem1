import 'dotenv/config'  
import axios from 'axios'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

// Directus connection
const DIRECTUS_URL=process.env.DIRECTUS_URL
const DIRECTUS_ADMIN_TOKEN=process.env.DIRECTUS_ADMIN_TOKEN

// Axios instance for login/account collection
const directus = axios.create({
  baseURL: `${DIRECTUS_URL}/items`,
  headers: {
    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

// REGISTER
export const register = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const existing = await directus.get('/useraccount', {
      params: {
        filter: { email: { _eq: email } }
      }
    })

    if (existing.data.data.length > 0) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
// Generate token
    const token = crypto.randomBytes(16).toString('hex')

    const createUser = await directus.post('/useraccount', {
      email,
      password: hashedPassword,
      token: token
    })

    res.status(201).json({ message: 'Account created successfully'})
  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const response = await directus.get('/useraccount', {
      params: {
        filter: { email: { _eq: email } }
      }
    })
    const user = response.data.data[0]

    if (!user) {
      return res.status(404).json({ message: 'Email not found' })
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid user credentials.' })
    }
  // Generate a new token
    const newToken = crypto.randomBytes(16).toString('hex')

    // Update token in Directus
    await directus.patch(`/useraccount/${user.id}`, { token: newToken })

    // Return token + basic user info
    res.status(200).json({
      message: 'Login successful',
      token: newToken,
      role: user.role,
    })
  } catch (err) {
    console.error(err.response?.data || err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// export const dashboarduser = async (req, res) => {
//   try {
//     const userId = req.user.id; // from middleware

//     const response = await directusLogin.get(`?filter[id][_eq]=${userId}`);
//     const user = response.data.data?.[0];

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//       complete: user.complete, // optional field
//     });

//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const dashboardadmin = async (req, res) => {
//   try {
//     const userId = req.user.id; // from middleware

//     const response = await directusLogin.get(`?filter[id][_eq]=${userId}`);
//     const user = response.data.data?.[0];

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//       complete: user.complete// optional field
//     });

//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
      const userResponse = await directus.get('/useraccount', {
      params: {
      filter: { token: { _eq: token } } 
      }
    })

    const user = userResponse.data.data[0]

    if (!user) {
      return res.status(204).send()
    }

    // Invalidate token
    await directus.patch(`/useraccount/${user.id}`, { token: null })


    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error(err.response?.data || err.message)
    return res.status(500).json({ message: 'Server error' })
  }
}







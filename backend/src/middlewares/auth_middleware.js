import 'dotenv/config' 
import axios from 'axios'

const DIRECTUS_URL=process.env.DIRECTUS_URL
const DIRECTUS_ADMIN_TOKEN=process.env.DIRECTUS_ADMIN_TOKEN

const COLLECTION_LOGIN = 'useraccount'

const directusLogin = axios.create({
  baseURL: `${DIRECTUS_URL}/items/${COLLECTION_LOGIN}`,
  headers: {
    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    const response = await directusLogin.get(
      `?filter[token][_eq]=${encodeURIComponent(token)}`
    )

    const user = response.data.data[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next()
  } catch (err) {
    console.error(err.message)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}



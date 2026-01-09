import 'dotenv/config'
import axios from 'axios'

const DIRECTUS_URL = process.env.DIRECTUS_URL
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN

const directus = axios.create({
  baseURL: `${DIRECTUS_URL}/items`,
  headers: {
    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
})

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    const response = await directus.get('/useraccount', {
      params: {
        'filter[token][_eq]': token,
      },
    })

    const user = response.data.data?.[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired session' })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (err) {
    console.error(err.response?.data || err.message)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

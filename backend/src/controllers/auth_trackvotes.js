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

export const trackVotes = async (req, res) => {
    try{
        const response = await directus.get('/trackvotes?fields=*')
        res.status(200).json({
            message: 'Track Data', 
            data: response.data.data
        })    
    }
    catch(err){
        console.error(err.response?.data || err)
        return res.status(500).json({ message: 'Failed to fetch track votes' })   
    }
}

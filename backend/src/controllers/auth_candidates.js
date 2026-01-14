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


export const candidatesEntry = async (req,res) => {
    const candidate = req.body
    try{

        const token = req.cookies.userToken // read HTTP-only cookie
        if (!token) return res.status(401).json({ message: 'Unauthorized' })

    // Optional: filter empty entries
        // const validPayload = candidate.filter(
        // c => c.position && c.firstname && c.lastname
        // )

        // if (!validPayload.length) {
        // return res.status(400).json({ message: 'No valid candidates provided' })
        // }

        const candidatePayload = await directus.post('/candidates', candidate)

        return res.status(201).json({
        message: 'Candidates saved successfully',
        })
    }catch(err){
        console.error(err.response?.data || err)
        return res.status(500).json({ message: 'Failed to save candidates' })
    }


}


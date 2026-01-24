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

        const response = await directus.get('/candidates?fields=firstname,lastname')
        const existingData = response.data.data;

        // Check for duplicates entry
        const duplicate = candidate.some(newCandidate =>
        existingData.some(e =>
            e.firstname === newCandidate.firstname && e.lastname === newCandidate.lastname
        )
        );

        if (duplicate) {
        return res.status(400).json({ message: 'Double Entry is prohibited.' });
        }
        
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

export const getCandidates  = async (req, res) => {
    
    try{
        const response = await directus.get('/candidates?fields=*')
        res.status(200).json({
            message: 'Candidates Data', 
            data: response.data.data
        })    
    }
    catch(err){
        console.error(err.response?.data || err)
        return res.status(500).json({ message: 'Failed to fetch candidates' })   
    }
}

export const submitVote = async (req, res) => {
  try {
    const token = req.cookies.userToken
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { votes } = req.body

    if (!votes || Object.keys(votes).length === 0) {
      return res.status(400).json({ message: 'No votes submitted' })
    }

    const studentResponse = await directus.get('/scannedId', {
    params: {
        filter: {
        token: { _eq: token }
        }
    }
    })

    if (!studentResponse.data.data.length) {
    return res.status(404).json({ message: 'Student not found' })
    }

    const studentId = studentResponse.data.data[0].id

    const existingVote = await directus.get('/studentvotes', {
      params: {
        filter: {
          studentId: { _eq: studentId }
        }
      }
    })

    if (existingVote.data.data.length > 0) {
      return res.status(400).json({
        message: 'You have already voted'
      })
    }

    // Convert votes object into array payload
    const votePayload = Object.entries(votes).map(
      ([position, candidateId]) => ({
        studentId: studentId,
        candidateId
      })
    )

    await directus.post('/studentvotes', votePayload)

    return res.status(201).json({
      message: 'Vote submitted successfully'
    })

  } catch (err) {
    console.error(err.response?.data || err)
    return res.status(500).json({
      message: 'Failed to submit vote'
    })
  }
}

export const getVoteCounts = async (req, res) => {
  try {
    //kukunin muna yung vote counts ng kada ID ng bawat cadidates
    const votesResponse = await directus.get('/studentvotes', {
      params: {
        aggregate: { count: '*' },
        groupBy: 'candidateId',
        fields: ['candidateId']
      }
    });
    //dito ipapasa yung result ng votecounts galing sa reponse sa studentvotes
    const voteCounts = votesResponse.data.data;

    //kukunin and detail information para sa lahat ng candidates
    //sa candidateIds kukunin and bawat Id na ng galing sa voteCounts
    const candidateIds = voteCounts.map(v => v.candidateId);
    const candidatesResponse = await directus.get('/candidates', {
      params: {
        //Kukunin lahat ng ID na laman na galig sa candidateIds tapos kukunin ang firstname middlename, lastname
        filter: { id: { _in: candidateIds } },
        fields: ['id', 'firstname','middlename','lastname', 'position']
      }
    });

    const candidates = candidatesResponse.data.data;

    //pagsamahin kung ilan ang vote counts ng bawat candidates name
    const results = voteCounts.map(v => {
      const candidate = candidates.find(c => c.id === v.candidateId);
      return {
        firstname: candidate?.firstname ?? '',
        middlename: candidate?.middlename ?? '',
        lastname: candidate?.lastname ?? '',
        position: candidate?.position ?? '',
        totalVotes: v.count
      };
    });

    //isesend na yung response galing sa result variable
    return res.status(200).json(results);
  } catch (err) {
    console.error(err.response?.data || err);
    return res.status(500).json({
      message: 'Failed to fetch vote counts'
    });
  }
};






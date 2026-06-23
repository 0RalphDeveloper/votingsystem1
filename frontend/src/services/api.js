import axios from 'axios'

export default axios.create({
  baseURL: 'https://votingsystem1-production.up.railway.app/api',
  withCredentials: true
})


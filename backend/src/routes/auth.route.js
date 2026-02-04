import express from 'express'
import { register, login, dashboardadmin,logoutadmin} from '../controllers/auth_controller.js'
import { scanQRCode, getDashboard, logoutuser} from '../controllers/auth_scanner.js'
import {trackVotes} from '../controllers/auth_trackvotes.js'
import {candidatesEntry, getCandidates, submitVote, getVoteCounts, updateCandidate, deleteCandidate} from '../controllers/auth_candidates.js'
import { requireAuth } from '../middlewares/auth_middleware.js'
import { requireAdmin } from '../middlewares/auth_admin_middleware.js'


const router = express.Router()
router.post('/scan', scanQRCode)
router.post('/logoutuser', logoutuser)
router.post('/logoutadmin', logoutadmin)

router.get('/dashboard', getDashboard)
router.post('/register', register)
router.post('/login', login)
router.get('/dashboardadmin', requireAuth, requireAdmin ,dashboardadmin)
router.post('/candidatesEntry',requireAuth,requireAdmin,candidatesEntry)
router.get('/getCandidates', getCandidates)
router.post('/submitVote', submitVote)
router.get('/getVoteCounts', getVoteCounts)
router.patch('/updateCandidate/:id', updateCandidate)
router.delete('/deleteCandidate/:id', deleteCandidate)
router.get('/trackvotes', trackVotes)
// router.get('/allCustomerOrders', requireAuth, requireAdmin, allCustomerOrders)
// router.patch('/markOrderDone/:orderId', requireAuth, markOrderDone, requireAdmin)

// router.get('/dashboarduser', requireAuth ,dashboarduser)
// router.get('/orders', requireAuth ,getUserOrders)
// router.post('/customerOrder', requireAuth, customerOrder)
// router.post('/customerprofile', requireAuth, customerprofile)
// router.post('/logout', requireAuth, logout)

export default router

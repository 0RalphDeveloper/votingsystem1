import express from 'express'
import { register, login} from '../controllers/auth_controller.js'
import { scanQRCode, getDashboard, logout} from '../controllers/auth_scanner.js'

import { requireAuth } from '../middlewares/auth_middleware.js'
import { requireAdmin } from '../middlewares/auth_admin_middleware.js'


const router = express.Router()
router.post('/scan', scanQRCode)
router.post('/logout', logout)
router.get('/dashboard', getDashboard)
router.post('/register', register)
router.post('/login', login)
// router.get('/dashboardadmin', requireAuth, requireAdmin ,dashboarduser)
// router.get('/allCustomerOrders', requireAuth, requireAdmin, allCustomerOrders)
// router.patch('/markOrderDone/:orderId', requireAuth, markOrderDone, requireAdmin)

// router.get('/dashboarduser', requireAuth ,dashboarduser)
// router.get('/orders', requireAuth ,getUserOrders)
// router.post('/customerOrder', requireAuth, customerOrder)
// router.post('/customerprofile', requireAuth, customerprofile)
// router.post('/logout', requireAuth, logout)

export default router

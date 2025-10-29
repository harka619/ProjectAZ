import { Router } from 'express'
import { register, login, verifyToken } from '../controllers/authController.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', authRequired, verifyToken)

export default router



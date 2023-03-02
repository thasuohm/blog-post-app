import express from 'express'
import { requireAuth } from '../config/middleware'
import jwtDecode from 'jwt-decode'
import user from '../models/user'
import { AuthTokenType } from '../types/token'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello i am user Route!')
})

router.get('/profile', async (req, res) => {
  try {
    const token: string = req.cookies.AUTH_TOKEN
    const payload: AuthTokenType = jwtDecode(token)
    const userInfo = await user.findById(payload.id)
    if (!userInfo) {
      return res.status(401).json({ error: 'User not found' })
    }

    return res
      .status(200)
      .json({ user: { ...userInfo.toObject(), password: null } })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

// Add more routes as needed

export default router

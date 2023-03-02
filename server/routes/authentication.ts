import express from 'express'
import user from '../models/user'
import { validateString } from '../utils/helperFunction/string'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthTokenType } from '../types/token'
import jwtDecode from 'jwt-decode'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const nodeEnv = process.env.NODE_ENV
const jwtSecret = process.env.JWT_SECRET!
const router = express.Router()
const saltRounds = 12
router.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    const { displayName, password, email } = req.body

    if (
      !validateString(displayName) ||
      !validateString(password) ||
      !validateString(email)
    ) {
      return res.status(400).json({ error: 'Invalid data' })
    }

    const userInfo = await user.findOne({ email })

    if (userInfo) {
      return res.status(409).json({ error: 'This Email has been use' })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new user({ displayName, password: hashedPassword, email })
    await newUser.save()

    return res.status(201).json({ message: 'Register Successfully' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body

    if (!validateString(password) || !validateString(email)) {
      return res.status(400).json({ error: 'Please Enter Email and Password' })
    }

    const userInfo = await user.findOne({ email })
    if (!userInfo) {
      return res.status(401).json({ error: 'User not found' })
    }

    const correctPassword = await bcrypt.compare(password, userInfo.password)
    if (!correctPassword) {
      return res.status(401).json({ error: 'Wrong Password' })
    }

    const token = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      jwtSecret
    )

    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + 3)

    res.cookie('AUTH_TOKEN', token, {
      httpOnly: true,
      secure: nodeEnv === 'development' ? false : true,
      expires: expireDate,
    })
    userInfo.lastLogin = new Date()
    await userInfo.save()

    return res.status(200).json({ message: 'Login Successful', user: userInfo })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

router.post('/logout', (req, res) => {
  try {
    const token: string = req.cookies.AUTH_TOKEN
    if (!token) {
      return res.status(401).json({ error: 'You are not logged in' })
    }
    res.clearCookie('AUTH_TOKEN')
    return res.status(200).json({ message: 'You are logged out' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

export default router

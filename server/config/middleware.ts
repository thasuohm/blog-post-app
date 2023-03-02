import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import user from '../models/user'
import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const jwtSecret = process.env.JWT_SECRET!

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.AUTH_TOKEN
    if (!token) {
      throw new Error('Unauthorized')
    }
    const decoded: any = jwt.verify(token, jwtSecret)
    if (!decoded.id) {
      throw new Error('Invalid token')
    }
    const userInfo = await user.findById(decoded.id)
    if (!userInfo) {
      throw new Error('Unauthorized')
    }

    next()
  } catch (err: any) {
    res.status(401).json({ error: err.message })
  }
}

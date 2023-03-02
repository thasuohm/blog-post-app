import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/authentication'
import userRoute from './routes/user'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import './config/passportConfig'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const dbUrl = process.env.DATABASE_URL!
const port = process.env.PORT ?? 5000

mongoose
  .connect(dbUrl)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error(err))

const app = express()

app.get('/', (req, res) => {
  res.send('Hello, I am Base!')
})

app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())
app.use('/api/auth', authRoute)
app.use(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  userRoute
)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

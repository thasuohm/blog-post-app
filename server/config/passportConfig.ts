import user from '../models/user'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import dotenv from 'dotenv'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const jwtSecret = process.env.JWT_SECRET!

const cookieExtractor = (req: any) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies['AUTH_TOKEN']
  }
  return token
}

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: jwtSecret,
    },
    async (jwtPayload, done) => {
      try {
        // Check if user exists in the database and return it
        const userInfo = await user.findById(jwtPayload.id)
        if (userInfo) {
          done(null, userInfo)
        } else {
          done(null, false)
        }
      } catch (error) {
        done(error, false)
      }
    }
  )
)

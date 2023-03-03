import express from 'express'
import jwtDecode from 'jwt-decode'
import user from '../models/user'
import { AuthTokenType } from '../types/token'
import blogPost from '../models/blogPost'

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

router.get('/myblog', async (req, res) => {
  try {
    const token: string = req.cookies.AUTH_TOKEN
    const payload: AuthTokenType = jwtDecode(token)
    const userInfo = await user.findById(payload.id)
    const { search, tags, page, limit } = req.query
    const query = {}
    let skip = 0
    let count = await blogPost.countDocuments()

    if (!userInfo) {
      return res.status(401).json({ error: 'User not found' })
    }

    if (search) {
      query['$or'] = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }

    if (tags) {
      query['tags'] = { $in: tags.toString().split(',') }
    }

    if (page && limit) {
      skip = (+page - 1) * +limit
    }

    const blogList = await blogPost
      .find({ author: userInfo.id, ...query })
      .skip(skip)
      .limit(limit ? +limit : 0)

    const blogCount = await blogPost.countDocuments({
      author: userInfo.id,
      ...query,
    })

    return res.status(200).json({ blogList, blogCount })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

export default router

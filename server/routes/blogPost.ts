import express from 'express'
import jwtDecode from 'jwt-decode'
import passport from 'passport'
import blogPost from '../models/blogPost'
import user from '../models/user'
import { BlogPostInterface, CreateBlogPostInterFace } from '../types/blogPost'
import { AuthTokenType } from '../types/token'
import { validateString } from '../utils/helperFunction/string'
import { initializeApp } from 'firebase/app'
import multer from 'multer'
import { firebaseConfig } from '../config/firebase'
import { getStorage } from 'firebase/storage'

const router = express.Router()

initializeApp(firebaseConfig)

const storage = getStorage()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', async (req, res) => {
  try {
    const { search, tags, page, limit } = req.query
    const query = {}
    let skip = 0
    let count = await blogPost.countDocuments()

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
      .find(query)
      .skip(skip)
      .limit(limit ? +limit : 0)

    if (!blogList) {
      return res.status(404).json({ error: 'No blog posts found' })
    }

    return res.status(200).json({
      blogList,
      total: count,
      currentPage: page ? +page : 1,
      totalPages: Math.ceil(count / (limit ? +limit : 1)) || 1,
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

router.post(
  '/create',
  upload.single('filename'),
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const blogPostBody: CreateBlogPostInterFace = req.body.blogPostBody
      const token: string = req.cookies.AUTH_TOKEN
      const payload: AuthTokenType = jwtDecode(token)
      const userInfo = await user.findById(payload.id)
      if (!userInfo) {
        return res.status(401).json({ error: 'User not found' })
      }

      if (
        !validateString(blogPostBody.title) ||
        blogPostBody.content.length < 1
      ) {
        return res
          .status(400)
          .json({ error: 'Please fill Blog information correctly' })
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Please add Cover Image' })
      }

      const metadata = {
        contentType: req.file.mimetype,
      }

      const newBlogPost = new blogPost({
        ...blogPost,
        author: userInfo.id,
      })
      await newBlogPost.save()

      return res.status(201).json({
        message: 'Create Blog Successfully',
        blogPostId: newBlogPost.id,
      })
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }
)

router.put(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { blogPost: blogPostBody }: { blogPost: BlogPostInterface } =
        req.body
      const { title, content, tags } = blogPostBody
      const token: string = req.cookies.AUTH_TOKEN
      const payload: AuthTokenType = jwtDecode(token)
      const blogId = req.params.id

      if (!blogId) {
        return res.status(400).json({ error: 'Invalid blog id' })
      }

      if (!validateString(title) || blogPostBody.content.length < 1) {
        return res
          .status(400)
          .json({ error: 'Please fill Blog information correctly' })
      }

      const userInfo = await user.findById(payload.id)
      if (!userInfo) {
        return res.status(401).json({ error: 'User not found' })
      }

      const blogPostInfo = await blogPost.findById(blogId)
      if (!blogPostInfo) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      if (!blogPostInfo.author !== userInfo.id) {
        return res.status(401).json({ error: 'You are not author' })
      }

      const updatedBlogPost = await blogPost.findByIdAndUpdate(
        blogId,
        { title, content, tags },
        { new: true }
      )

      return res.status(201).json({
        message: 'Update Blog Successfully',
        blogPost: updatedBlogPost,
      })
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }
)

router.put(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const token: string = req.cookies.AUTH_TOKEN
      const payload: AuthTokenType = jwtDecode(token)
      const blogId = req.params.id

      if (!blogId) {
        return res.status(400).json({ error: 'Invalid blog id' })
      }

      const userInfo = await user.findById(payload.id)
      if (!userInfo) {
        return res.status(401).json({ error: 'User not found' })
      }

      const blogPostInfo = await blogPost.findById(blogId)
      if (!blogPostInfo) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      const blogIndex = userInfo.likeBlog.indexOf(blogId)

      if (blogIndex === -1) {
        userInfo.likeBlog.push(blogId)
        await userInfo.save()
        blogPostInfo.totalLike += 1
        await blogPostInfo.save()

        return res.status(200).json({ message: 'Blog liked successfully' })
      } else {
        userInfo.likeBlog.splice(blogIndex, 1)
        await userInfo.save()
        blogPostInfo.totalLike -= 1
        await blogPostInfo.save()
        return res.status(200).json({ message: 'Blog disliked successfully' })
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }
)

export default router

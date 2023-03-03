import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverImage: String,
  content: {
    type: [
      {
        type: {
          type: String,
          enum: ['text', 'image', 'header'],
          required: true,
        },
        text: { type: String },
        image: { type: String },
      },
    ],
    required: true,
  },
  tags: [String],
  totalView: {
    type: Number,
    default: 0,
  },
  totalLike: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastEdit: {
    type: Date,
    default: null,
  },
})

export default mongoose.model('BlogPost', blogPostSchema)

interface BlogContentType {
  type: 'text' | 'image'
  text?: string
  image?: string
}

export interface CreateBlogPostInterFace {
  title: string
  content: BlogContentType[]
  tags?: string[]
}

export interface BlogPostInterface extends CreateBlogPostInterFace {
  id: string
  author: string
  createAt: string
  lastUpdate: string
}

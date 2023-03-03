import React from 'react'
import { Card, Typography, Button, Tag } from 'antd'
import { Link } from 'react-router-dom'

const { Title } = Typography

interface Props {
  coverImage: string
  title: string
  tags: string[]
  id: string
}

const BlogPostCard: React.FC<Props> = ({ coverImage, title, tags, id }) => {
  return (
    <Card
      hoverable
      cover={<img alt="example" src={coverImage} />}
      style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}
      bodyStyle={{ padding: '16px' }}>
      <Title level={4} ellipsis={{ rows: 2 }}>
        {title}
      </Title>
      <div style={{ marginBottom: '12px' }}>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <Button type="primary">
        <Link to={`/blog/${id}`}>Read More</Link>
      </Button>
    </Card>
  )
}

export default BlogPostCard

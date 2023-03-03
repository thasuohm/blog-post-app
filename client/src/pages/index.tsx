import { Col, DatePicker, Layout, Row } from 'antd'
import 'antd/dist/reset.css'
import Search from 'antd/es/input/Search'
import BlogPostCard from '../components/BlogPostCard'
import Navbar from '../components/NavBar'
import { mockBlogCard } from '../data/blogPostCard'

const HomePage = () => {
  const handleChange = () => {}
  const onSearch = () => {}

  return (
    <Layout>
      <Navbar />
      <div
        style={{
          maxWidth: '1200px',
          margin: '24px auto 0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
        <Search
          placeholder="Search blog posts"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />

        <Row gutter={[8, 24]}>
          <Col xs={24} sm={12} md={10} lg={8}>
            <BlogPostCard
              title={mockBlogCard.title}
              coverImage={mockBlogCard.coverImage}
              id={mockBlogCard.id}
              tags={mockBlogCard.tags}
            />
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <BlogPostCard
              title={mockBlogCard.title}
              coverImage={mockBlogCard.coverImage}
              id={mockBlogCard.id}
              tags={mockBlogCard.tags}
            />
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <BlogPostCard
              title={mockBlogCard.title}
              coverImage={mockBlogCard.coverImage}
              id={mockBlogCard.id}
              tags={mockBlogCard.tags}
            />
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <BlogPostCard
              title={mockBlogCard.title}
              coverImage={mockBlogCard.coverImage}
              id={mockBlogCard.id}
              tags={mockBlogCard.tags}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default HomePage

import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const menuItems = [
    { key: 'home', label: <Link to="/">BLOG_POST</Link> },
    {
      key: 'create',
      label: <Link to="/create-blog">Create Blog</Link>,
    },
    {
      key: 'contact',
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: 'login',
      label: <Link to="/login">Login</Link>,
    },
  ]

  return <Menu mode="horizontal" items={menuItems}></Menu>
}

export default Navbar

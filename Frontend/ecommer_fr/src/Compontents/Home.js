import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
    <h1>Welcome to E-commerce FR</h1>
    <Link to="/login">
      <button>login</button>
    </Link>
    <Link to="/register">
      <button>Register</button>
    </Link>
    
    </>
  )
}

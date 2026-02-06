import React, {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigator = useNavigate();
    const handlelogout = ()=>{
        if(localStorage.getItem("auth_token")){
            localStorage.removeItem("auth_token")
        }
        navigator('/login');

    }
    useEffect (()=>{


    })
  return (
    <>
    <h1>Welcome</h1>
    <h3>Dasboard</h3>
    <button onClick={handlelogout}>Logout</button>
    </>
  )
}

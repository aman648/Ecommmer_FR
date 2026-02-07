import React, { useState } from 'react'
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const[email,setemail] = useState("");
  const[name,setname] = useState("");
  const[password,setpassword] = useState("");
  const[Confirm_password,setConfrim_password] = useState("");
  const[response,setresponse]=useState("");
  const navigator = useNavigate();
  const handlesubmit =(e)=>
  {
    if(!email || !name ||!password){
      alert("Please fill the complete form");
    }
    e.preventDefault();
    const username = name
    const user = {
      email,
      username,
      password,
    };
   
    try
    {
      const url = "http://127.0.0.1:5000//api/register"
      axios.post(url,user,{
        headers: {
        "Content-Type": "application/json"
      }
      }).then(
        
        response => setresponse(response.data)
      )

    }
    catch(err){
      setresponse(err)

    }

  }
  const ISmisMatchpassword = Confirm_password && password !== Confirm_password;

  return (
    <>
    <div class="login-card">
    <h1>Register </h1>
    <form onSubmit={handlesubmit} className='auth-form'> 
      <label>
        Name:
        <input type="text" name="username" value={name} onChange={(e)=>setname(e.target.value)} />
      </label>
      <label>
        email:
        <input type="text" name="email" value={email} onChange={(e)=>setemail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={password} onChange={(e)=>setpassword(e.target.value)} />
      </label>
       <label>
         Confirm Password:
        <input type="password" name="Confirm password" value={Confirm_password} onChange={(e)=>setConfrim_password(e.target.value)} />
        {ISmisMatchpassword && <p>password does not password</p>}
      </label>
      <br />
      <input type="submit" value="register" />
    </form>
    <p className="auth-footer">
          Already have an account? <span onClick={()=>navigator('/login')}>Login</span>
        </p>
   
   {response && <p>User Register successfully</p>}
   </div>


    </>
  )
}

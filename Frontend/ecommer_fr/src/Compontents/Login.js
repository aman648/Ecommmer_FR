import axios from 'axios';
import React , { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css';

export default function Login() {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const navigator = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("auth_token")){
      navigator('/Welcome');

    }

  })
  
  const handleSubmit= async (e)=>{
    e.preventDefault();
    if(!email || !password){
      alert("Please fill all the fields");
      return;
    }
    const username  = email;
    const user ={
      username,
      password
    }
    const url = "http://127.0.0.1:5000/api/login";
      try{
        const response = await axios.post(url,user,{
          headers: {
        "Content-Type": "application/json"
       }
       })
       console.log(typeof(response.data));
       const token = response.data.token;
       localStorage.setItem('auth_token',token);
       localStorage.setItem('user_name',username);
      
       navigator("/Welcome");


      }
      catch(err){
        console.log("error",err);


      }
  
    }
  return (
   
    <>
    <div className='login-card'>
    <h1>Login Page</h1>
    <form onSubmit={handleSubmit} className='auth-form'>
      <label>
        Username:
        <input type="text" name="username" value={email} onChange={(e)=>setemail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={password} onChange={(e)=>setpassword(e.target.value)} />
      </label>
      <br />
      <input type="submit" value="Login" />
     
    </form>
     <button className="btn-primary" onClick={()=>navigator('/register')}>Register</button>
     </div>
    
    
    </>
  )
}

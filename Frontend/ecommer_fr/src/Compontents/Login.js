import axios from 'axios';
import React , { useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css';
import { jwtDecode } from 'jwt-decode'; //
import { GoogleLogin } from '@react-oauth/google';


export default function Login() {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const navigator = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("auth_token")){
      navigator('/Welcome');

    }

  })
  const onGoogleSuccess = async (credentialResponse) => {
    // credentialResponse is the object from Google
    console.log('Google Success:', credentialResponse);

    // The JWT ID token is in .credential (NOT .crenditials or .credentials)
    const token = credentialResponse.credential;

    if (!token) {
      alert('No credential received from Google');
      return;
    }

    try {
      // Decode to get user info (email, name, picture, etc.)
      const decoded = jwtDecode(token);
      console.log('Decoded Google user:', decoded);
      const res = await axios.post('http://127.0.0.1:5000/api/google-login', {
      credential: token
    });
    console.log(res.data);
    token = res.data.token

      // Optional: Send this token to your backend to create/verify user session
      // e.g. axios.post('/api/google-login', { token })
      // Then get your own auth_token back

      // For now: store Google token & basic info
      localStorage.setItem('auth_token',token);
      localStorage.setItem('user_name', decoded.name || decoded.email);
      // You could store email, picture, etc.

      navigator('/Welcome');
    } catch (err) {
      console.error('JWT decode failed:', err);
      alert('Google login processing failed');
    }
  };
 
  const onError = () =>{
    alert("Login Failed Please Try again or register User")
  }
  
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
     
        <br />
     <GoogleLogin className ="btn-primary" onSuccess={onGoogleSuccess} onError={onError} />
       </div>
    
    
    </>
  )
}

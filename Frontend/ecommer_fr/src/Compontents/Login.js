import axios from 'axios';
import React , { useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const[response,setresponse] = useState("");
  const navigator = useNavigate();
  const handleSubmit=(e)=>{
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
        const response = axios.post(url,user,{
          headers: {
        "Content-Type": "application/json"
       }
       })
       const token = response.data.token;
       localStorage.setItem('auth_token',token);
       console.log(response.data.token);
       navigator("/welcome");


      }
      catch(err){
        setresponse("Invalid Username or password");


      }
  
    }
  return (
   
    <>
    <h1>Login Page</h1>
    <form onSubmit={handleSubmit}>
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
    {response && <p>Login done</p>}
    
    </>
  )
}

import React, { useState } from 'react'
import Axios from 'axios';
import axios from 'axios';

export default function Register() {
  const[email,setemail] = useState("");
  const[name,setname] = useState("");
  const[password,setpassword] = useState("");
  const[Confirm_password,setConfrim_password] = useState("");
  const[response,setresponse]=useState("");
  const handlesubmit =(e)=>
  {
    if(!email || !name ||!password){
      alert("Please fill the complete form");
    }
    e.preventDefault();
    const user = {
      email,
      name,
      password,
    };
    try
    {
      const url = "http://127.0.0.1:5000//api/Register"
      axios.post(url,user).then(
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
    <h1>Register </h1>
    <form onSubmit={handlesubmit}> 
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
    {response && <p>User Register successfully</p>}



    
    
    
    </>
  )
}

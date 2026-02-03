import React , {useState} from 'react'

export default function Login() {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!email || !password){
      alert("Please fill all the fields");
      return;
    }
    console.log("Email:",email);
    console.log("Password:",password);
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
    </>
  )
}

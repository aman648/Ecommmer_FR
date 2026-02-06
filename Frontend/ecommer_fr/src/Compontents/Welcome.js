import React, {  useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export default function Welcome() {
    const navigator = useNavigate();
    const [products, setProducts] = useState([]);
    const handlelogout = ()=>{
        if(localStorage.getItem("auth_token")){
            localStorage.removeItem("auth_token")
        }
        navigator('/login');

    }
    useEffect (()=>{
        axios.get('http://127.0.0.1:5000/api/getproducts',{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then((res)=>{
            console.log(res.data);
            const data  = res.data;
            
          
            setProducts(data['products']);
        }).catch((err)=>{
            console.log(err);
        })
      


    })
  return (
    <>
    <h1>Welcome</h1>
    <h3>Dasboard</h3>
    <button onClick={handlelogout}>Logout</button>
    <div className='products'>
        {products.map(
            product => <div className='product' key={product.id}>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>{product.price}</p>
            </div>
        )}
      
                
    </div>



    </>
  )
}

import React, {  lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Products = lazy(() => import('./Product'));

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
      


    },[])
  return (
    <>
    <h1>Welcome</h1>
    <h3>Dasboard</h3>
    <button onClick={handlelogout}>Logout</button>
    <div className='products'>
      <Suspense fallback={<div>Loading...</div>}>
        {products.map(
            (product)=>(
                <Products key={product.id} id={product.id} name={product.name} description={product.description} price={product.price}/>
            )
        )}
        </Suspense>
      
                
    </div>



    </>
  )
}

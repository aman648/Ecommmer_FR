import React, {  lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios, { Axios } from 'axios';
import { useState } from 'react';
import Cartitems from './cartitems';

const Products = lazy(() => import('./Product'));

export default function Welcome() {
    const navigator = useNavigate();
    const [products, setProducts] = useState([]);
    const name = localStorage.getItem("user_name");
    const[cart, setCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const cartitems = ()=>{
      //run code for adding it:
        
        
        setCart(!cart);

    }

    useEffect (()=>{
        Axios.get('http://127.0.0.1:5000/api/cartitems',{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then((res)=>{   // Fixed the syntax error in the then block
            console.log(res.data);
            setCartItems(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    })
    const removecartitems = (index)=>{
        const newcartitems = [...cartItems];
        newcartitems.splice(index,1);
        setCartItems(newcartitems);
    }
    const addtocart = (product)=>{
        setCartItems([...cartItems,product])

        
    }

    const handlelogout = ()=>{
        if(localStorage.getItem("auth_token")){
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user_name")
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

  <div className="page">
  <nav className="navbar">
    <h2 className="logo">Dashboard</h2>
    <div className="nav-right">
      <span className="username">Welcome, {name} 👋</span>
      <button className="logout-btn" onClick={handlelogout}>Logout</button>
      <button className="cart-btn" onClick={cartitems}>
        🛒  Cart
      </button>
    </div>
  </nav>
  
    <div className='products'>
      <Suspense fallback={<div>Loading...</div>}>
        {products.map(
            (product)=>(
                <Products key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} handlecart={addtocart} />
            )
        )}
        </Suspense>          
    </div>
    </div>
    {cart && <Cartitems isopen={cart} isclose={()=>setCart(false) } cartitems={cartItems} removecartitems={removecartitems}/>}



    </>
  )
}

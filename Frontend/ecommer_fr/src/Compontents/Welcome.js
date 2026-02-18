import React, {  lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
       const url = "http://127.0.0.1:5000/api/cartitems"
       const user = {
        user_id: localStorage.getItem("user_name")
          
       }
        axios.post(url,user,{
            headers:{
                'Content-Type': 'application/json',
            }
        }).then((res)=>{
            console.log(res.data);
            const data  = res.data;
            
            setCartItems(data['cart_items']);
            // setCartItems(res.data);

            setCart(!cart);
        }).catch((err)=>{
            console.log(err);
        })

    }

    
    const removecartitems = (index)=>{
        const newcartitems = [...cartItems];
        newcartitems.splice(index,1);
        console.log("removing item at index", index);
        console.log("new cart items", cartItems[index].product_id);
        //make api call to remove the item from cart in backend
        const user = {
            user_id: localStorage.getItem("user_name"),
            product_id: cartItems[index].product_id
        }
        const url = "http://127.0.0.1:5000/api/removecart"
        axios.post(url,user,{
            headers:{
                'Content-Type': 'application/json',
            }
        }).then((res)=>{
            setCartItems(newcartitems);
        }).catch((err)=>{
            console.log(err);
        })
    }
    const addtocart = (product)=>{
        //api call to add the product to cart in backend
        console.log("added to cart", product);
        const user = {
            user_id: localStorage.getItem("user_name"),
            product_id: product.id
        }
        const url = "http://127.0.0.1:5000/api/addcart"
        axios.post(url,user,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then((res)=>{
            console.log(res.data);
            setCartItems([...cartItems,product])
        }).catch((err)=>{
            alert("Failed to add to cart");
            console.log(err);
        })
        
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
                <Products key={product.id} id={product.product_id} name={product.name} description={product.description} price={product.price} handlecart={addtocart} />
            )
        )}
        </Suspense>          
    </div>
    </div>
    {cart && <Cartitems isopen={cart} isclose={()=>setCart(false) } cartitems={cartItems} removecartitems={removecartitems}/>}



    </>
  )
}

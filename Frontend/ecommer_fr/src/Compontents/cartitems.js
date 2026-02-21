import React from 'react'
import '../App.css';
import { useNavigate } from 'react-router-dom';


  
export default function Cartitems({isopen,isclose,cartitems,removecartitems}) {
  // const totalprice = cartitems.reduce((total, item) => total + item.price, 0);
   const navigate = useNavigate();

 
  const handlecheckout = () =>{
    navigate('/Checkout')
    
  

  }
  
  
  return (
    <>

    <div className={`cart-sidebar ${isopen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={isclose}>✖</button>
        </div>

        <div className="cart-body">
          {cartitems.map((item,index)=>(
            <>
            <p key={index}>🧾 {item.name}</p> <p>Price: ₹{item.price}</p>
            <button className="cart-remove-btn" onClick={() => removecartitems(index)}>Remove</button>
            </>
            

          ))}
        </div>

        <div className="cart-footer">
          <button className="checkout-btn" onClick={handlecheckout}>Checkout</button>
        </div>
      </div>
    </>
  )
}

import React from 'react'
import '../App.css';


export default function cartitems({isopen,isclose,cartitems,removecartitems}) {
  // const totalprice = cartitems.reduce((total, item) => total + item.price, 0);
  
  
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
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </>
  )
}

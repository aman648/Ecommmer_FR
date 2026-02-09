import React from 'react'
import '../App.css';

export default function cartitems({isopen,isclose}) {
  return (
    <>

    <div className={`cart-sidebar ${isopen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={isclose}>✖</button>
        </div>

        <div className="cart-body">
          <p>🧾 Product 1</p>
          <p>🧾 Product 2</p>
        </div>

        <div className="cart-footer">
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </>
  )
}

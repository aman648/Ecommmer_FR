import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Checkout() {
    const name = localStorage.getItem("user_name");
    const [cartItems, setCartItems] = useState([]);
    const [adeeliveryInfo, setAddDeliveryInfo] = useState("");
    useEffect(()=>{
        const items = JSON.parse(localStorage.getItem("cart_items"));
        if(!items){
            alert("No items in cart");
            return;
        }
        console.log("cart items in checkout", items);
        setCartItems(items);
    },[])
    const navigator = useNavigate();
    // if(!localStorage.getItem("auth_token")){
    //     alert("Please login to access this page");
    //     navigator("/login");
    // }

   
   const handlesubmit = (e)=>{
    
    e.preventDefault();
    console.log("form submitted");
    const data = new FormData(e.target);
    const deliveryInfo = {
        name: data.get("name"),
        address: data.get("address"),
        city: data.get("city"),
        postalCode: data.get("postalCode")
    }
    console.log("delivery info", deliveryInfo);
    setAddDeliveryInfo(deliveryInfo);
    alert("Information saved successfully");
   
   }
   const handlecheckout = ()=>{
    if(!adeeliveryInfo){
        alert("Please add delivery information before placing the order");
        return;
    }
    localStorage.removeItem("cart_items");
    navigator("/orderconfirmation");
   }


  return (
    <>
    <h1>Checkout Page</h1>
    <p>Welcome, {name}!</p>

    <h2>Your Cart Items:</h2>
    
    <ul>
      {cartItems.map((item, index) => (
        <li key={index}>
          {item.name} - ${item.price}
        </li>
      ))}
    </ul>

    <h3>Total: ${cartItems.reduce((total, item) => total + item.price, 0)}</h3>
    <h3>Add Delivery Information</h3>
    <form onSubmit={handlesubmit}>
        <label>name:
        <input type="text" name="name" />
      </label>
      <br />
      <label>
        Address:
        <input type="text" name="address" />
      </label>
      <br />
      <label>
        City:
        <input type="text" name="city" />
      </label>
      <br />
      <label>
        Postal Code:
        <input type="text" name="postalCode" />
      </label>
      <br />
      <button type="submit">Save Information</button>
    </form> 
    <button className='btn btn-checkout' onClick={handlecheckout}>Place Order</button>
    

    

    
    
    </>
  )
}

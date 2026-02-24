import React from 'react'

export default function Orderconfirmation() {
    const handleclick = ()=>{
        window.location.href = '/welcome';
    }
  return (
    <>
    <h1>Your order has been placed successfully!</h1>
    <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
    <button onClick={handleclick}>To Home Page</button>
    
    </>
  )
}

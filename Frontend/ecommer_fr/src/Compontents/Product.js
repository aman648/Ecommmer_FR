import React from 'react';
import '../App.css';

export default function Product({ id, name, description, price, handlecart }) {
  // ← Destructure the props you are actually passing

  const addToCart = () => {
    handlecart({ id, name, description, price });   // ← send the full product object
  };

  return (
    <>
      <div className="product-tile">
        <div className="product-tile__header">
          <h4 className="product-tile__name">{name}</h4>
          <span className="product-tile__price">₹{price}</span>
        </div>
        <p className="product-tile__description">{description}</p>

        <div className="product-tile__footer">
          <button className="btn btn-view">View</button>
          <button className="btn btn-add" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
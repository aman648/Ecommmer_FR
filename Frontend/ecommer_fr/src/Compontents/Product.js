import React from 'react'
import '../App.css';
export default function Product(product) {
  return (
    <>
    <div className="product-tile">
      <div className="product-tile__header">
        <h4 className="product-tile__name">{product.name}</h4>
        <span className="product-tile__price">₹{product.price}</span>
      </div>

      <p className="product-tile__description">
        {product.description}
      </p>

      <div className="product-tile__footer">
        <button className="btn btn-view">View</button>
        <button className="btn btn-add">Add to Cart</button>
      </div>
    </div>
  
    </>
  )
}

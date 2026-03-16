import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ViewProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/getproduct/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
        }).then((res) => {
            // If your Flask backend returns a list (fetchall), 
            // you might need setProduct(res.data.product[0])
            setProduct(res.data.product[0]);
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, [id]);
    

    useEffect(()=>{
        var username = localStorage.getItem("user_name");
        const userinfo = {
            userId: username,
            productId: product.productId

        }
        
        axios.get('http://127.0.0.1:5000/api/getreviews',userinfo,
            {
            headers:{
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem('auth_token')}`    
                } }).then((response) =>{
                    console.log(response.data);
                    setReviews(response.data);

                }
                )
        
    },[])
    const handlesubmitreview = () => {
        alert('Submitted');

    }

    // 1. Add this "Loading" check
    if (!product) {
        return <div>Loading product details...</div>;
    }

    return (
        <>
            <div>Product ID: {id}</div>
            <div className="product-tile">
                <div className="product-tile__header">
                    <h4 className="product-tile__name">{product.name}</h4>
                    <span className="product-tile__price">₹{product.price}</span>
                </div>
                <p className="product-tile__description">{product.description}</p>
                {/* 2. Check your key name: in your JSON it was 'image_url', not 'imgurl' */} 
                <img src={product.image_url} alt={product.name} style={{ width: '200px' }} />
            </div>
            <h3>Reviews</h3>
             {/* Display Reviews */}
            {reviews.map((r) => (
              <div key={r.id}>
             <p>{r.description}</p>
            <small>{new Date(r.createdAt).toLocaleString()}</small>
             <hr/>
            </div>
             ))}

          <textarea
            placeholder="Write your review..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
           />
           <button onClick={handlesubmitreview}>Submt Review </button>
        </>
    );
}
export default ViewProduct;
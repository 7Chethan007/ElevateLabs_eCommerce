import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'
import Recommendations from '../../../recommendations/Recommendations'

const DetailProduct = () => {

    const params = useParams()
    const navigate = useNavigate()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [detailProduct,setDetailProduct] = useState([])
    const addCart = state.userAPI.addCart
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    useEffect(()=> {
        if(params){
            products.forEach(product => {
                if(product._id === params.id) setDetailProduct(product)
            })
        }
    },[params,products])

    const handleAddToCart = () => {
        if (!isLogged) {
            alert("Please log in first.");
            navigate('/login');
            return;
        }
        addCart(detailProduct);
    }

    if(detailProduct.length === 0) return null;

    console.log(detailProduct)
  return (
    <div>
      <div className='detail'>
        <img src={detailProduct.images.url} alt={detailProduct.title}/>
        <div className='box-detail'>
          <div className='row'>
              <h2>{detailProduct.title}</h2>
              <h6>ID: {detailProduct.product_id}</h6>
          </div>
          <span>${detailProduct.price}</span> 
          <p>{detailProduct.description}</p> 
          <p>{detailProduct.content}</p>
          <p>Sold: {detailProduct.sold} units</p>
          <div className='detail-buttons'>
            <button className='cart' onClick={handleAddToCart}>
              Add to Cart
            </button>
            <Link to='/cart' className='cart view-cart'>
              View Cart
            </Link>
          </div>
        </div>
      </div>
      
      {!isAdmin && isLogged && (
        <Recommendations currentProduct={detailProduct} />
      )}
    </div>
  )
}

export default DetailProduct

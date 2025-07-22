import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'

const Cart = () => {
  const state = useContext(GlobalState)
  const [cart] = state.userAPI.cart
  const removeCart = state.userAPI.removeCart
  const increaseQuantity = state.userAPI.increaseQuantity
  const decreaseQuantity = state.userAPI.decreaseQuantity

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
  }

  if(cart.length === 0)
    return <h2 style={{textAlign:"center",fontSize:"3rem", marginTop:"50px"}}>Cart Empty</h2>
  
  return (
    <div className="cart-container">
      <h2 style={{textAlign:"center", marginBottom:"30px"}}>Shopping Cart</h2>
      {cart.map(product => (
        <div key={product._id} className='cart-item'>
          <img src={product.images.url} alt={product.title}/>
          <div className='cart-item-details'>
            <div className='cart-item-header'>
              <h3>{product.title}</h3>
              <button 
                className='remove-btn' 
                onClick={() => removeCart(product._id)}
              >
                ✕
              </button>
            </div>
            <p className='cart-item-id'>ID: {product.product_id}</p>
            <p className='cart-item-price'>${product.price}</p>
            <p className='cart-item-description'>{product.description}</p>
            
            <div className='quantity-controls'>
              <button onClick={() => decreaseQuantity(product._id)}>-</button>
              <span>Quantity: {product.quantity}</span>
              <button onClick={() => increaseQuantity(product._id)}>+</button>
            </div>
            
            <p className='item-total'>
              Subtotal: ${(product.price * product.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
      
      <div className='cart-total'>
        <h3>Total: ${getTotalPrice()}</h3>
        <Link to='/checkout' className='checkout-btn'>Proceed to Checkout</Link>
      </div>
    </div>
  )
}

export default Cart

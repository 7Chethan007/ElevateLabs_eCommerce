import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductList from '../utils/ProductLists/ProductList'
import Recommendations from '../../recommendations/Recommendations'

const Product = () => {
  const state = useContext(GlobalState)
  const [products] = state.productsAPI.products
  const [isAdmin] = state.userAPI.isAdmin
  const [isLogged] = state.userAPI.isLogged

  return (
    <div>
      <div className='products'>      
        {
          products.map(product => {
            return <ProductList key={product._id} product={product} isAdmin={isAdmin}/>
          })
        }      
      </div>
      
      {!isAdmin && isLogged && (
        <Recommendations />
      )}
    </div>
  )
}

export default Product

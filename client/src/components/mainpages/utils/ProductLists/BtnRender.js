import React from 'react'
import { GlobalState } from '../../../../GlobalState'
import { useComparison } from '../../../../contexts/ComparisonContext'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { FaPlus, FaCheck } from 'react-icons/fa'

const BtnRender = ({product}) => {

    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const addCart = state.userAPI.addCart
    const { addToCompare, compareList } = useComparison()

    const isInComparison = compareList.find(item => item._id === product._id)

    const handleAddToCompare = (e) => {
        e.preventDefault()
        addToCompare(product)
    }

  return (
    <div className='row_btn'>
    {
      isAdmin ? 
   <>
      <Link id='btn_buy' to={`#!`} >
      Delete
      </Link>
      <Link id='btn_view' to={`detail/${product._id}`}>
          Edit
      </Link>
      </>
      :
      <>
    <Link id='btn_buy' to={`#!`} onClick={()=> addCart(product)}>
      Buy
    </Link>
    <Link id='btn_view' to={`detail/${product._id}`}>
        View
    </Link>
    <button 
        className={`btn_compare ${isInComparison ? 'in-comparison' : ''}`}
        onClick={handleAddToCompare}
        disabled={isInComparison}
        title={isInComparison ? 'Already in comparison' : 'Add to comparison'}
    >
        {isInComparison ? <FaCheck /> : <FaPlus />}
    </button>
      </>
}
</div>
  )
}

export default BtnRender

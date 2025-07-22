import React, { useContext, useState } from 'react'
import { MdOutlineMenu } from "react-icons/md";
import { MdClose } from 'react-icons/md';
import { MdOutlineAddShoppingCart, MdCompare } from "react-icons/md";
import { FaChartBar } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import { GlobalState } from '../../GlobalState';
import { useComparison } from '../../contexts/ComparisonContext';
import VoiceSearch from '../common/VoiceSearch';
import axios from 'axios';

const Header = () => {

    const state = useContext(GlobalState)
    const [isLogged,setIsLogged] = state.userAPI.isLogged
    const [isAdmin,setIsAdmin] = state.userAPI.isAdmin 
    const [cart] =  state.userAPI.cart
    const { compareList } = useComparison();
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleSearch = async (searchTerm) => {
        if (searchTerm.length > 2) {
            try {
                // Simulate search - in real app, make API call
                const response = await axios.get(`/api/products?search=${searchTerm}`);
                setSearchResults(response.data.products || []);
                setShowSearchResults(true);
            } catch (err) {
                console.error('Search error:', err);
            }
        } else {
            setShowSearchResults(false);
        }
    };

    const logoutUser = async() => {
        await axios.get('/user/logout')

        localStorage.clear()
        setIsAdmin(false)
        setIsLogged(false)
    }

    const adminRouter = ()=>{
        return(
            <>
            <li><Link to='/create_product'>Create Product</Link></li>
            <li><Link to='/category'>Categories </Link></li>
            <li><Link to='/analytics'><FaChartBar /> Analytics</Link></li>
            </>
        )
    }

    const loggedRouter = ()=>{
        return(
            <>
            <li><Link to='/history'>History</Link></li>
            <li><Link to='/' onClick={logoutUser}>Logout</Link></li>
            </>
        )
    }

  return (
    <>
    <header>
        <div className='menu'>
            <MdOutlineMenu size={30}/>
        </div>

        <div className='logo'>
            <h1>
                <Link to="/">{isAdmin?'Admin Panel':'🛍️ ElevateLabs'}</Link>
            </h1>
        </div>

        {/* Voice Search */}
        <div className="header-search">
            <VoiceSearch onSearch={handleSearch} placeholder="Search products..." />
        </div>

        <ul>
            <li><Link to="/">{isAdmin?'Products':'Shop'}</Link></li>

            {isAdmin && adminRouter()}
            {
                isLogged ? loggedRouter() : <li><Link to="/login">Login or Register</Link></li>
            }

            {!isAdmin && (
                <li>
                    <Link to='/compare' className='compare-link'>
                        <MdCompare size={24}/>
                        {compareList.length > 0 && <span className="compare-count">{compareList.length}</span>}
                    </Link>
                </li>
            )}

            <li>
                <MdClose size={30} className='menu'/>
            </li>
        </ul>

        {
            isAdmin ? '' : <div className='cart-icon'>
            <span>{cart.length}</span>
            <Link to='/cart'><MdOutlineAddShoppingCart size={30}/></Link>
        </div>
        }
    </header>

    {/* Search Results Dropdown */}
    {showSearchResults && searchResults.length > 0 && (
        <div className="search-results-dropdown">
            <div className="search-results-header">
                <span>Search Results ({searchResults.length})</span>
                <button onClick={() => setShowSearchResults(false)}>✕</button>
            </div>
            <div className="search-results-list">
                {searchResults.slice(0, 5).map(product => (
                    <Link 
                        key={product._id} 
                        to={`/detail/${product._id}`}
                        className="search-result-item"
                        onClick={() => setShowSearchResults(false)}
                    >
                        <img src={product.images.url} alt={product.title} />
                        <div>
                            <h4>{product.title}</h4>
                            <p>${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )}
    </>
  )
}

export default Header

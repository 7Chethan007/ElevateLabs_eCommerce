import { useEffect, useState } from 'react';
import axios from 'axios';

const UserAPI = (token) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    });

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

                    console.log(res);
                } catch (err) {
                    alert(err.response.data.msg);
                }
            };
            getUser();
        }
    }, [token]);

    const addCart = (product) => {
        if (!isLogged) return alert("Please log in first.");

        const existingItem = cart.find(item => item._id === product._id);

        if (existingItem) {
            // If item exists, increase quantity
            setCart(cart.map(item => 
                item._id === product._id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
            alert(`${product.title} quantity updated in cart!`);
        } else {
            // If item doesn't exist, add new item
            setCart([...cart, { ...product, quantity: 1 }]);
            alert(`${product.title} added to cart!`);
        }
    };

    const removeCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const increaseQuantity = (productId) => {
        setCart(cart.map(item => 
            item._id === productId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    const decreaseQuantity = (productId) => {
        setCart(cart.map(item => 
            item._id === productId 
                ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                : item
        ));
    };

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        removeCart: removeCart,
        increaseQuantity: increaseQuantity,
        decreaseQuantity: decreaseQuantity
    };
};

export default UserAPI;

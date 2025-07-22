import React from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

const ProductComparison = () => {
    const { compareList, removeFromCompare, clearCompareList } = useComparison();

    if (compareList.length === 0) {
        return (
            <div className="comparison-empty">
                <h2>🔍 Product Comparison</h2>
                <p>Select products to compare their features side by side</p>
            </div>
        );
    }

    return (
        <div className="comparison-container">
            <div className="comparison-header">
                <h2>🔍 Compare Products ({compareList.length}/3)</h2>
                <button onClick={clearCompareList} className="clear-comparison">
                    Clear All
                </button>
            </div>

            <div className="comparison-table">
                <div className="comparison-row feature-row">
                    <div className="feature-label">Product</div>
                    {compareList.map(product => (
                        <div key={product._id} className="product-cell">
                            <button 
                                onClick={() => removeFromCompare(product._id)}
                                className="remove-product"
                            >
                                <FaTimes />
                            </button>
                            <img src={product.images.url} alt={product.title} />
                            <h4>{product.title}</h4>
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Price</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            <strong>${product.price}</strong>
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Category</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            {product.category}
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Description</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            {product.description}
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Content</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            {product.content}
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Sales</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            {product.sold} sold
                        </div>
                    ))}
                </div>

                <div className="comparison-row">
                    <div className="feature-label">Actions</div>
                    {compareList.map(product => (
                        <div key={product._id} className="feature-cell">
                            <button className="add-to-cart-btn">
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="comparison-summary">
                <h3>📊 Quick Summary</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <strong>Cheapest:</strong> 
                        {compareList.reduce((min, product) => 
                            product.price < min.price ? product : min
                        ).title}
                    </div>
                    <div className="summary-item">
                        <strong>Most Popular:</strong> 
                        {compareList.reduce((max, product) => 
                            (product.sold || 0) > (max.sold || 0) ? product : max
                        ).title}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductComparison;

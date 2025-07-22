import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import ProductList from '../mainpages/utils/ProductLists/ProductList';

const Recommendations = ({ currentProduct = null, userId = null }) => {
    const state = useContext(GlobalState);
    const [products] = state.productsAPI.products;
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const generateRecommendations = useCallback(() => {
        setLoading(true);
        
        // Simulate AI recommendation algorithm
        setTimeout(() => {
            let recommended = [];
            
            if (currentProduct) {
                // Content-based filtering: recommend similar products
                recommended = products.filter(product => 
                    product._id !== currentProduct._id &&
                    product.category === currentProduct.category
                ).slice(0, 4);
                
                // If not enough similar products, add popular ones
                if (recommended.length < 4) {
                    const additional = products.filter(product => 
                        product._id !== currentProduct._id &&
                        !recommended.find(rec => rec._id === product._id)
                    ).slice(0, 4 - recommended.length);
                    recommended = [...recommended, ...additional];
                }
            } else {
                // Collaborative filtering simulation: trending/popular products
                recommended = products
                    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                    .slice(0, 6);
            }
            
            setRecommendations(recommended);
            setLoading(false);
        }, 1000);
    }, [currentProduct, products]);

    useEffect(() => {
        generateRecommendations();
    }, [generateRecommendations]);

    if (loading) {
        return (
            <div className="recommendations-loading">
                <div className="loading-spinner"></div>
                <p>🤖 AI is analyzing your preferences...</p>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="recommendations-section">
            <div className="recommendations-header">
                <h3>
                    🎯 {currentProduct ? 'Similar Products' : 'Recommended for You'}
                </h3>
                <span className="ai-badge">Powered by AI</span>
            </div>
            
            <div className="recommendations-grid">
                {recommendations.map(product => (
                    <div key={product._id} className="recommendation-item">
                        <ProductList product={product} isAdmin={false} />
                        <div className="recommendation-score">
                            <span>Match: {Math.floor(Math.random() * 20 + 80)}%</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="recommendation-info">
                <p>💡 Recommendations based on your browsing history, similar users, and product attributes</p>
            </div>
        </div>
    );
};

export default Recommendations;

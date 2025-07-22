import React, { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};

export const ComparisonProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const [isCompareMode, setIsCompareMode] = useState(false);

    const addToCompare = (product) => {
        if (compareList.length >= 3) {
            alert('You can compare maximum 3 products at a time');
            return false;
        }
        
        if (compareList.find(item => item._id === product._id)) {
            alert('Product already in comparison list');
            return false;
        }

        setCompareList(prev => [...prev, product]);
        return true;
    };

    const removeFromCompare = (productId) => {
        setCompareList(prev => prev.filter(item => item._id !== productId));
    };

    const clearCompareList = () => {
        setCompareList([]);
        setIsCompareMode(false);
    };

    const toggleCompareMode = () => {
        setIsCompareMode(prev => !prev);
    };

    return (
        <ComparisonContext.Provider value={{
            compareList,
            isCompareMode,
            addToCompare,
            removeFromCompare,
            clearCompareList,
            toggleCompareMode
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};

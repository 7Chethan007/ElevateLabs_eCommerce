import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            <span className="theme-icon">
                {isDarkMode ? <FaSun /> : <FaMoon />}
            </span>
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
    );
};

export default ThemeToggle;

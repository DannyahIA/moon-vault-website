import React, { useState } from 'react';
import './Hamburguer.css';

const Hamburguer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`hamburger-container ${isOpen ? 'open' : ''}`}>
            <button id="hamburger-button" onClick={handleClick}>
                {isOpen ? 'Close' : 'Open'} Menu
            </button>
            <nav id="hamburger-content" className={isOpen ? 'open' : ''}>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Hamburguer;

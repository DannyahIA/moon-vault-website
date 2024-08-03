import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header>
            <div className="logo">Logo</div>
            <div className="website-name">Website Name</div>
            <div className="search-bar">Search Bar</div>
            <div className="links">
                <div className="home"><Link to="/">Home</Link></div>
                <div className="remote-drive"><Link to="/remote-drive">Remote Drive</Link></div>
                <div className="about"><Link to="/about">About</Link></div>
                <div className="contact"><Link to="/contact">Contact</Link></div>
            </div>
            <div className="account-icon"><Link to="/login">Account Icon</Link></div>
        </header>
    );
};

export default Header;
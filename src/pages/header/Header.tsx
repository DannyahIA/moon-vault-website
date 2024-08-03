import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../auth/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    return (
        <header>
            <div className="logo">Logo</div>
            <div className="website-name">Website Name</div>
            <div className="search-bar">Search Bar</div>
            <div className="links">
                <div className="home"><Link to="/">Home</Link></div>
                {isAuthenticated && (
                    <div className="remote-drive"><Link to="/remote-drive">Remote Drive</Link></div>
                )}
                <div className="about"><Link to="/about">About</Link></div>
                <div className="contact"><Link to="/contact">Contact</Link></div>
            </div>
            <div className="account-icon">
                {isAuthenticated ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <Link to="/login">Account Icon</Link>
                )}
            </div>
        </header>
    );
};

export default Header;

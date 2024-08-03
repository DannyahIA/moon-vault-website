import React from 'react';
import './MainPage.css';

const MainPage: React.FC = () => {
    return (
        <div>
            <div className="card-container">
                <div className="card">
                    <h2>About Me</h2>
                    <p>Hi, I'm Daniel Tavares.</p>
                </div>
                <div className="card">
                    <h2>Projects</h2>
                    <p>Check out some of my projects and see what I've been working on.</p>
                </div>
                <div className="card">
                    <h2>Contact</h2>
                    <p>Get in touch with me. I'd love to hear from you!</p>
                </div>
            </div>
            <div className="button-container">
                <button className="button">View Resume</button>
                <button className="button">View Projects</button>
                <button className="button">Contact Me</button>
            </div>
        </div>
    );
};

export default MainPage;
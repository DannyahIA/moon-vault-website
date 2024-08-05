import React from 'react';
import './MainPage.css';

const MainPage: React.FC = () => {
    return (
        <div className="main-page">
            <div className="card-container">
                <div className="card">
                    <h2>About Me</h2>
                    <br></br>
                    <h3>Education</h3>
                    <br></br>
                    <p>Bachelor in Analysis and Systems Development (Technologist), Universidade Positivo, 2024</p>
                    <br></br>
                    <h3>Technical Skills</h3>
                    <br></br>
                    <p>Programming Languages: Golang, Pascal, Java, C#, C, PHP, SQL, HTML, JavaScript, CSS, TypeScript, Python</p>
                    <br></br>
                    <p>Frameworks and Libraries: React (with TypeScript), Node.js, Unity</p>
                    <br></br>
                    <p>Tools and Technologies: MySQL, Git, Docker, Krakend, PostgresSQL, Delphi, DevExpress, FastReport</p>
                    <br></br>
                    <h3>Projects</h3>
                    <br></br>
                    <p><strong>MyPersonalAssistant:</strong></p>
                    <br></br>
                    <p>Role: Developer</p>
                    <br></br>
                    <p>Technologies Used: Golang, Node.js, React (with TypeScript)</p>
                    <br></br>
                    <p>Description: Developing a complex scheduling page with calendar grids, event management, and an expandable list of upcoming appointments.</p>
                    <br></br>
                    <p><strong>Resident Evil 2 Remake Demake:</strong></p>
                    <br></br>
                    <p>Role: Developer</p>
                    <br></br>
                    <p>Technologies Used: Pixel Art, Top-Down Perspective</p>
                    <br></br>
                    <p>Description: Developing a top-down pixel art version of Resident Evil 2 Remake, focusing on exploration and puzzle-solving.</p>
                    <br></br>
                    <h3>Work Experience</h3>
                    <br></br>
                    <p><strong>Internship:</strong></p>
                    <br></br>
                    <p>Role: Software Development Intern</p>
                    <br></br>
                    <p>Technologies Used: Golang, Pascal</p>
                    <br></br>
                    <p>Responsibilities: Assisting in various development tasks, learning new technologies, and contributing to ongoing projects.</p>
                    <br></br>
                    <h3>Additional Information</h3>
                    <br></br>
                    <p>Developing a responsive login page in React, improving UI elements and enhancing user experience.</p>
                    <br></br>
                    <p>Implementing file management functionalities in the RemoteDrive component, including file download, file size display, and folder icon display.</p>
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
                <button className="button" onClick={() => window.location.href = "https://github.com/DannyahIA"}>
                    View Projects
                </button>
                <button className="button">Contact Me</button>
            </div>
        </div>
    );
};

export default MainPage;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/login/Login';
import MainPage from './pages/main-page/MainPage';
import Header from './pages/header/Header';
import RemoteDrive from './pages/remote-drive/RemoteDrive';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import { AuthProvider } from './pages/auth/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <div className="content-wrapper">
                        <Header />
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<MainPage />} />
                                <Route path="/home" element={<MainPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/remote-drive" element={<RemoteDrive />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

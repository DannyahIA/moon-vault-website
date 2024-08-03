import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/login/Login';
import MainPage from './pages/main_page/MainPage';
import Header from './pages/header/Header';
import RemoteDrive from './pages/login/remote-drive/RemoteDrive';

function App() {
  return (
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
                </Routes>
            </div>
        </div>
    </div>
</Router>
  );
}

export default App;

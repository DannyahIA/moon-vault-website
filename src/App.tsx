import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './pages/login/Login';
import MainPage from './pages/main_page/MainPage';
import Hamburguer from './pages/hamburguer/Hamburguer';

function App() {
  return (
    <Router>
    <div className="app">
        <div className="content-wrapper">
            <div className="sidebar">
                <Hamburguer />
            </div>
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </div>
    </div>
</Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import LandingPage from './components/LandingPage/LandingPage';
import AppLayout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <AppLayout>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
        {/* Add other routes here */}
      </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;

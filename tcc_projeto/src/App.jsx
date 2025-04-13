import { useState } from 'react';
import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import IMCCalculator from './pages/IMCCalculator.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {


  return (
    <>
      <Router>
        <Header />
        <IMCCalculator />
        
        <Routes>

        </Routes>
        <Footer />
      </Router>
    </>
  )
} export default App
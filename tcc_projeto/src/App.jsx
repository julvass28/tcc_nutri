import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import IMCCalculator from './components/IMCCalculator.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {


  return (
    <>
      <Router>
        <Header />
        <IMCCalculator />
        <Footer />
        <Routes>

        </Routes>
      </Router>
    </>
  )
} export default App
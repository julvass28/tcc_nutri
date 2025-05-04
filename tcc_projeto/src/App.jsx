import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AGUACalculator from './pages/AGUACalculator.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaRota from './pages/PaginaRota';

function App() {


  return (
      <div>
      <Router>
        <Header />
        <AGUACalculator/>
        
        <Routes>
        <Route path="/especialidade/:tipo" element={<PaginaRota />} />
        </Routes>
        <Footer />
   </Router>
    </div>
  )
} export default App

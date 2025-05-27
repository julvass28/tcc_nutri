import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AGUACalculator from './pages/AGUACalculator.jsx';
import IMCCalculator from './pages/IMCCalculator.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaRota from './pages/PaginaRota';
import FAQContato from './pages/faq_contato.jsx';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {


  return (
    <>
      <Router>
       <Header /> 
       {/* <IMCCalculator /> */}
        
        <Routes>
        <Route path="/perguntas-frequentes" element={<FAQContato />} />
        <Route path="/especialidade/:tipo" element={<PaginaRota />} />
        </Routes>
       <Footer />
      </Router>
    </>
  )
} export default App

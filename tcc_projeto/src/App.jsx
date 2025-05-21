import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
// import IMCCalculator from './pages/IMCCalculator.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PaginaRota from './pages/PaginaRota';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {


  return (
  <>
      <Router>
        <Header />
        {/* <IMCCalculator /> */}
        
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/especialidade/:tipo" element={<PaginaRota />} />
        </Routes>

        <Footer /> 
      </Router>
    </>
  )
} export default App

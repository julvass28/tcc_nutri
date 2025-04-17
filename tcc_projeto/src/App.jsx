import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ReceitasClinicas from './pages/ReceitasClinicas.jsx';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {


  return (
    <>
      <Router>
        <Header />

        <Routes>
          <Route path="/receitas" element={<ReceitasClinicas />} />
        </Routes>


        <Footer />
        <Routes>

        </Routes>
      </Router>
    </>
  )
} export default App
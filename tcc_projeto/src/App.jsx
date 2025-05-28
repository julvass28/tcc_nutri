import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
 import Footer from './components/Footer';
 import IMCCalculator from './pages/IMCCalculator';
import Sobre from './pages/Sobre';
import PaginaRota from './pages/PaginaRota';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';
import Praia from './pages/DicaNutri-Praia';
import Restaurantes from './pages/DicaNutri-Restaurantes';
import FastFood from './pages/DicaNutri-FastFood';
import Shopping from './pages/DicaNutri-Shopping';
import Bar from './pages/DicaNutri-Bar';
import Viagem from './pages/DicaNutri-Viagem';

export default function App() {
  return (
    <Router>
     <Header />
      

     
      <Routes>
        <Route path="/calculadoras/imc" element={<IMCCalculator />} />
       <Route path="/especialidade/:tipo" element={<PaginaRota />} /> 
       <Route path="/sobre" element={<Sobre />} /> 
       
        <Route path="/DicaNutri-Praia" element={<Praia />} />
        <Route path="/DicaNutri-Restaurantes" element={<Restaurantes />} />
        <Route path="/DicaNutri-FastFood" element={<FastFood />} />
        <Route path="/DicaNutri-Shopping" element={<Shopping />} />
        <Route path="/DicaNutri-Bar" element={<Bar />} />
        <Route path="/DicaNutri-Viagem" element={<Viagem />} />
      
      </Routes>


     <Footer />
    </Router>
  );
}

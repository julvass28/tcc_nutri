import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
// import Footer from './components/Footer';
// import IMCCalculator from './pages/IMCCalculator';
// import Sobre from './pages/Sobre';
import PaginaRota from './pages/PaginaRota';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';

import Contato from './pages/Contato';

export default function App() {
  return (
    <Router>
      <Header />
      {/* <Route path="/" element={<IMCCalculator />} /> */}

     
      <Routes>
       <Route path="/especialidade/:tipo" element={<PaginaRota />} /> 
       {/* <Route path="/sobre" element={<Sobre />} />  */}
       <Route path="/contato" element={<Contato />} /> 
      
      </Routes>


      {/* <Footer /> */}
    </Router>
  );
}

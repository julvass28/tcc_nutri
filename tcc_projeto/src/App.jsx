import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ReceitasClinicas from './pages/ReceitasClinicas';
import ReceitasPediatricas from './pages/ReceitasPediatricas';
import ReceitasEsportivas from './pages/ReceitasEsportivas';
import ReceitasEmagrecimento from './pages/ReceitasEmagrecimento';
import ReceitasIntolerancias from './pages/ReceitasIntolerancias';

function App() {
  return (
    <Router>
    
      <Header />

      <Routes>
        <Route path="/Receitas" element={<ReceitasClinicas />} />
        <Route path="/Pediatrica" element={<ReceitasPediatricas />} />
        <Route path="/Esportiva" element={<ReceitasEsportivas />} /> 
        <Route path="/Emagrecimento" element={<ReceitasEmagrecimento/>} />
        <Route path="/Intolerancias" element={<ReceitasIntolerancias/>} />
        
      </Routes>

      <Footer />
  
    </Router>
  );
}

export default App;

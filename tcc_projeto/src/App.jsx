import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ReceitasClinicas from './pages/receitas/ReceitasClinicas';
import ReceitasPediatricas from './pages/receitas/ReceitasPediatricas';
import ReceitasEsportivas from './pages/receitas/ReceitasEsportivas';
import ReceitasEmagrecimento from './pages/receitas/ReceitasEmagrecimento';
import ReceitasIntolerancias from './pages/receitas/ReceitasIntolerancias';
import PudimDeChia from './pages/receitas/PudimDeChia';
import ChaiLatte from './pages/receitas/ChaiLatte';
import Crepioca from './pages/receitas/Crepioca';
import ChipsDeBatata from './pages/receitas/ChipsDeBatata';
import PanquecaDeBananaEAveia from './pages/receitas/PanquecaDeBananaEAveia';
import BoloDeCenoura from './pages/receitas/BoloDeCenoura';
import Nuggets from './pages/receitas/Nuggets';
import SmoothieDeMorango from './pages/receitas/SmoothieDeMorango';
import SmoothieEnergetico from './pages/receitas/SmoothieEnergetico';
import BarrinhaDeCereal from './pages/receitas/BarrinhaDeCereal';
import Hamburguer from './pages/receitas/Hamburguer';
import PaoDeBanana from './pages/receitas/PaoDeBanana';
import Suco from './pages/receitas/Suco';
import SaladaDeQuinoa from './pages/receitas/SaladaDeQuinoa';
import PaoLowCarb from './pages/receitas/PaoLowCarb';
import Omelete from './pages/receitas/Omelete';
import LeiteDeAmendoas from './pages/receitas/LeiteDeAmendoas';
import PaoDeQueijo from './pages/receitas/PaoDeQueijo';
import BoloDeCacau from './pages/receitas/BoloDeCacau';
import PanquecaDeBanana from './pages/receitas/PanquecaDeBanana';

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
        <Route path="/pudim-de-chia" element={<PudimDeChia/>}/>
        <Route path="/ChaiLatte" element={<ChaiLatte/>}/>
        <Route path="/Crepioca" element={<Crepioca/>}/>
        <Route path="/ChipsDeBatata" element={<ChipsDeBatata/>}/>
        <Route path="/PanquecaDeBananaEAveia" element={<PanquecaDeBananaEAveia/>}/>
        <Route path="/BoloDeCenoura" element={<BoloDeCenoura/>}/>
        <Route path="/Nuggets" element={<Nuggets/>}/>
        <Route path="/SmoothieDeMorango" element={<SmoothieDeMorango/>}/>
        <Route path="/SmoothieEnergetico" element={<SmoothieEnergetico/>}/>
        <Route path="/BarrinhaDeCereal" element={<BarrinhaDeCereal/>}/>
        <Route path="/Hamburguer" element={<Hamburguer/>}/>
        <Route path="/PaoDeBanana" element={<PaoDeBanana/>}/>
        <Route path="/Suco" element={<Suco/>}/>
        <Route path="/SaladaDeQuinoa" element={<SaladaDeQuinoa/>}/>
        <Route path="/PaoLowCarb" element={<PaoLowCarb/>}/>
        <Route path="/Omelete" element={<Omelete/>}/>
        <Route path="/LeiteDeAmendoas" element={<LeiteDeAmendoas/>}/>
        <Route path="/PaoDeQueijo" element={<PaoDeQueijo/>}/>
        <Route path="/BoloDeCacau" element={<BoloDeCacau/>}/>
        <Route path="/PanquecaDeBanana" element={<PanquecaDeBanana/>}/>
        
        
      </Routes>

      <Footer />
  
    </Router>
  );
}

export default App;

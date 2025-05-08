import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ReceitasClinicas from './pages/ReceitasClinicas';
import ReceitasPediatricas from './pages/ReceitasPediatricas';
import ReceitasEsportivas from './pages/ReceitasEsportivas';
import ReceitasEmagrecimento from './pages/ReceitasEmagrecimento';
import ReceitasIntolerancias from './pages/ReceitasIntolerancias';
import PudimDeChia from './pages/PudimDeChia';
import ChaiLatte from './pages/ChaiLatte';
import Crepioca from './pages/Crepioca';
import ChipsDeBatata from './pages/ChipsDeBatata';
import PanquecaDeBananaEAveia from './pages/PanquecaDeBananaEAveia';
import BoloDeCenoura from './pages/BoloDeCenoura';
import Nuggets from './pages/Nuggets';
import SmoothieDeMorango from './pages/SmoothieDeMorango';
import SmoothieEnergetico from './pages/SmoothieEnergetico';
import BarrinhaDeCereal from './pages/BarrinhaDeCereal';
import Hamburguer from './pages/Hamburguer';
import PaoDeBanana from './pages/PaoDeBanana';
import Suco from './pages/Suco';
import SaladaDeQuinoa from './pages/SaladaDeQuinoa';
import PaoLowCarb from './pages/PaoLowCarb';
import Omelete from './pages/Omelete';
import LeiteDeAmendoas from './pages/LeiteDeAmendoas';
import PaoDeQueijo from './pages/PaoDeQueijo';
import BoloDeCacau from './pages/BoloDeCacau';
import PanquecaDeBanana from './pages/PanquecaDeBanana';

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

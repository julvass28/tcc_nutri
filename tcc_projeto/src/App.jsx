import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";

// Páginas públicas
import Home from "./pages/Home";
import IMCCalculator from "./pages/IMCCalculator";
import AGUACalculator from "./pages/AGUACalculator";
import GASTOCalculator from "./pages/GASTOCalculator";
import Sobre from "./pages/Sobre";
import PaginaRota from "./pages/PaginaRota";
import FAQContato from "./pages/faq_contato";
import Login from "./pages/Login";
import CriarConta from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Praia from "./pages/DicaNutri-Praia";
import Restaurantes from "./pages/DicaNutri-Restaurantes";
import FastFood from "./pages/DicaNutri-FastFood";
import Shopping from "./pages/DicaNutri-Shopping";
import Bar from "./pages/DicaNutri-Bar";
import Viagem from "./pages/DicaNutri-Viagem";
import ReceitasClinicas from "./pages/receitas/ReceitasClinicas";
import ReceitasPediatricas from "./pages/receitas/ReceitasPediatricas";
import ReceitasEsportivas from "./pages/receitas/ReceitasEsportivas";
import ReceitasEmagrecimento from "./pages/receitas/ReceitasEmagrecimento";
import ReceitasIntolerancias from "./pages/receitas/ReceitasIntolerancias";
import PudimDeChia from "./pages/receitas/PudimDeChia";
import ChaiLatte from "./pages/receitas/ChaiLatte";
import Crepioca from "./pages/receitas/Crepioca";
import ChipsDeBatata from "./pages/receitas/ChipsDeBatata";
import PanquecaDeBananaEAveia from "./pages/receitas/PanquecaDeBananaEAveia";
import BoloDeCenoura from "./pages/receitas/BoloDeCenoura";
import Nuggets from "./pages/receitas/Nuggets";
import SmoothieDeMorango from "./pages/receitas/SmoothieDeMorango";
import SmoothieEnergetico from "./pages/receitas/SmoothieEnergetico";
import BarrinhaDeCereal from "./pages/receitas/BarrinhaDeCereal";
import Hamburguer from "./pages/receitas/Hamburguer";
import PaoDeBanana from "./pages/receitas/PaoDeBanana";
import Suco from "./pages/receitas/Suco";
import SaladaDeQuinoa from "./pages/receitas/SaladaDeQuinoa";
import PaoLowCarb from "./pages/receitas/PaoLowCarb";
import Omelete from "./pages/receitas/Omelete";
import LeiteDeAmendoas from "./pages/receitas/LeiteDeAmendoas";
import PaoDeQueijo from "./pages/receitas/PaoDeQueijo";
import BoloDeCacau from "./pages/receitas/BoloDeCacau";
import PanquecaDeBanana from "./pages/receitas/PanquecaDeBanana";
import PerfilEditar from "./pages/PerfilEditar";
import Perfil from "./pages/perfil";

// Admin
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";

export default function App() {
  return (
  <HorarioProvider>
    <Router>
      <ScrollToTop
        excludePaths={[
          "/DicaNutri-Praia",
          "/DicaNutri-Restaurantes",
          "/DicaNutri-FastFood",
          "/DicaNutri-Shopping",
          "/DicaNutri-Bar",
          "/DicaNutri-Viagem",
          "/receitas/clinica",
          "/receitas/pediatrica",
          "/receitas/esportiva",
          "/receitas/emagrecimento",
          "/receitas/intolerancias",
        ]}
      />

      <Routes>
        {/* Layout PÚBLICO com Header/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calculadoras/consumo-agua" element={<AGUACalculator />} />
          <Route path="/calculadoras/imc" element={<IMCCalculator />} />
          <Route path="/calculadoras/gasto-calorico" element={<GASTOCalculator />} />
          <Route path="/especialidade/:tipo" element={<PaginaRota />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<FAQContato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CriarConta />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/editar" element={<PerfilEditar />} />
          <Route path="/DicaNutri-Praia" element={<Praia />} />
          <Route path="/DicaNutri-Restaurantes" element={<Restaurantes />} />
          <Route path="/DicaNutri-FastFood" element={<FastFood />} />
          <Route path="/DicaNutri-Shopping" element={<Shopping />} />
          <Route path="/DicaNutri-Bar" element={<Bar />} />
          <Route path="/DicaNutri-Viagem" element={<Viagem />} />
          <Route path="/receitas/clinica" element={<ReceitasClinicas />} />
          <Route path="/receitas/pediatrica" element={<ReceitasPediatricas />} />
          <Route path="/receitas/esportiva" element={<ReceitasEsportivas />} />
          <Route path="/receitas/emagrecimento" element={<ReceitasEmagrecimento />} />
          <Route path="/receitas/intolerancias" element={<ReceitasIntolerancias />} />
          <Route path="/receitas/info/PudimDeChia" element={<PudimDeChia />} />
          <Route path="/receitas/info/ChaiLatte" element={<ChaiLatte />} />
          <Route path="/receitas/info/Crepioca" element={<Crepioca />} />
          <Route path="/receitas/info/ChipsDeBatata" element={<ChipsDeBatata />} />
          <Route path="/receitas/info/PanquecaDeBananaEAveia" element={<PanquecaDeBananaEAveia />} />
          <Route path="/receitas/info/BoloDeCenoura" element={<BoloDeCenoura />} />
          <Route path="/receitas/info/Nuggets" element={<Nuggets />} />
          <Route path="/receitas/info/SmoothieDeMorango" element={<SmoothieDeMorango />} />
          <Route path="/receitas/info/SmoothieEnergetico" element={<SmoothieEnergetico />} />
          <Route path="/receitas/info/BarrinhaDeCereal" element={<BarrinhaDeCereal />} />
          <Route path="/receitas/info/Hamburguer" element={<Hamburguer />} />
          <Route path="/receitas/info/PaoDeBanana" element={<PaoDeBanana />} />
          <Route path="/receitas/info/Suco" element={<Suco />} />
          <Route path="/receitas/info/SaladaDeQuinoa" element={<SaladaDeQuinoa />} />
          <Route path="/receitas/info/PaoLowCarb" element={<PaoLowCarb />} />
          <Route path="/receitas/info/Omelete" element={<Omelete />} />
          <Route path="/receitas/info/LeiteDeAmendoas" element={<LeiteDeAmendoas />} />
          <Route path="/receitas/info/PaoDeQueijo" element={<PaoDeQueijo />} />
          <Route path="/receitas/info/BoloDeCacau" element={<BoloDeCacau />} />
          <Route path="/receitas/info/PanquecaDeBanana" element={<PanquecaDeBanana />} />
        </Route>

        {/* Layout ADMIN sem Header/Footer */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminLayout />
            </ProtectedRouteAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
 </HorarioProvider>
  );
}

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";

import "./css/tokens.css";

// termos
import TermosDeServico from "./pages/TermosDeServico";

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
import Anamnese from "./pages/FormularioAnamnese";
import Pagamento from "./pages/Pagamento";
import PagamentoSucesso from "./pages/PagamentoSucesso";
import PagamentoErro from "./pages/PagamentoErro";
import PagamentoPendente from "./pages/PagamentoPendente";
import Agendar from "./pages/Agenda";
// Receitas (novas)
import RecipesAdmin from "./pages/admin/RecipesAdmin";
import RecipeForm from "./pages/admin/RecipeForm";
import RecipesCategory from "./pages/receitas/RecipesCategory";
import RecipeDetail from "./pages/receitas/RecipeDetail";

import PerfilEditar from "./pages/PerfilEditar";
import Perfil from "./pages/perfil";
import AgendarConsulta from "./pages/agendar_consulta";
// import Agendar from "./pages/Agenda";
// Admin
import AdminAgendaFull from "./pages/admin/AdminAgendaFull";
import ProtectedRouteAdmin from "./routes/ProtectedRouteAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import FaqAdmin from "./pages/admin/FaqAdmin";
import FaqForm from "./pages/admin/FaqForm";
import AdminAccountSettingsPage from "./pages/admin/adm_configuracoes";
import AdminPreco from "./pages/admin/AdminPreco";
import AdminAgendaSlots from "./pages/admin/AdminAgendaSlots";
// ====== Redirect de compatibilidade para rotas antigas ======
function LegacyReceitasRedirect() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  // envia para a nova rota de categoria
  React.useEffect(() => {
    navigate(`/receitas/categoria/${categoria}`, { replace: true });
  }, [categoria, navigate]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop
        excludePaths={[
          "/DicaNutri-Praia",
          "/DicaNutri-Restaurantes",
          "/DicaNutri-FastFood",
          "/DicaNutri-Shopping",
          "/DicaNutri-Bar",
          "/DicaNutri-Viagem",
          "/receitas/categoria/clinica",
          "/receitas/categoria/pediatrica",
          "/receitas/categoria/esportiva",
          "/receitas/categoria/emagrecimento",
          "/receitas/categoria/intolerancias"
          
        ]}
      />

      <Routes>
        {/* Layout PÚBLICO com Header/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/pagamento/sucesso" element={<PagamentoSucesso />} />
          <Route path="/pagamento/erro" element={<PagamentoErro />} />
          <Route path="/pagamento/pendente" element={<PagamentoPendente />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/calculadoras/consumo-agua"
            element={<AGUACalculator />}
          />
          <Route path="/calculadoras/imc" element={<IMCCalculator />} />
          <Route
            path="/calculadoras/gasto-calorico"
            element={<GASTOCalculator />}
          />
          <Route path="/especialidade/:tipo" element={<PaginaRota />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<FAQContato />} />
          <Route path="/agendar-consulta" element={<AgendarConsulta />} />
          <Route path="/agendar" element={<Agendar />} />
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
          <Route path="/termos-de-servico" element={<TermosDeServico />} />
          {/* <Route path="/agendar" element={<Agendar />} /> */}
          <Route path="/anamnese" element={<Anamnese />} />
          {/* ===== Primeiro: redireciono as rotas antigas de categoria ===== */}
          <Route
            path="/receitas/:categoria(clinica|pediatrica|esportiva|emagrecimento|intolerancias)"
            element={<LegacyReceitasRedirect />}
          />

          {/* Categoria dinâmica (nova) */}
          <Route
            path="/receitas/categoria/:categoria"
            element={<RecipesCategory />}
          />

          {/* Detalhe por slug */}
          <Route path="/receitas/:slug" element={<RecipeDetail />} />
        </Route>

        {/* Layout Público sem Header/Footer */}

    


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
          <Route path="configuracoes" element={<AdminAccountSettingsPage />} />
          <Route path="receitas" element={<RecipesAdmin />} />
          <Route path="receitas/new" element={<RecipeForm />} />
          <Route path="receitas/:id/edit" element={<RecipeForm />} />
          <Route path="preco" element={<AdminPreco />} />
          <Route path="agenda" element={<AdminAgendaSlots />} />
          <Route path="agenda-full" element={<AdminAgendaFull />} />
          <Route path="faq" element={<FaqAdmin />} />
          <Route path="faq/new" element={<FaqForm />} />
          <Route path="faq/:id/edit" element={<FaqForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

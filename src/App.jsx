import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Funcionario from "./pages/Funcionario";
import ProducaoEstamaparia from "./pages/adm/ProducaoEstamaparia";
import Login from "./pages/Login";
import ListaMaquinarios from "./pages/adm/ListaMaquinarios";
import ListaFuncionarios from "./pages/adm/ListaFuncionarios";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/adm/Dashboard";
import './index.css';
import ProducaoImpressao from "./pages/adm/ProducaoImpressao";
import ProducaoCortePapel from "./pages/adm/ProducaoCortePapel";
import ProducaoEmbalagem from "./pages/adm/ProducaoEmbalagem";
import ProducaoCorteTecido from "./pages/adm/ProducaoCorteTecido";
import ProducaoCostura from "./pages/adm/ProducaoCostura";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rota para funcionário */}
          <Route path="/funcionario" element={<Funcionario />} />

          {/* Rota para o dashboard */}
          <Route
            path="/dashboard"
            element={
              <>
                <NavBar />
                <Dashboard />
              </>
            }
          />

          {/* Rota para estamparia */}
          <Route
            path="/administrador/estamparia"
            element={
              <>
                <NavBar />
                <ProducaoEstamaparia />
              </>
            }
          />

          {/* Rota para impressão */}
          <Route
            path="/administrador/impressao"
            element={
              <>
                <NavBar />
                <ProducaoImpressao />
              </>
            }
          />
          {/* Rota para corte de papel */}
          <Route
            path="/administrador/cortedepapel"
            element={
              <>
                <NavBar />
                <ProducaoCortePapel />
              </>
            }
          />
          {/* Rota para embalagem */} 
          <Route
            path="/administrador/embalagem"
            element={
              <>
                <NavBar />
                <ProducaoEmbalagem />
              </>
            }
          />
          {/* Rota para corte de tecido */}
          <Route
            path="/administrador/cortedetecido"
            element={
              <>
                <NavBar />
                <ProducaoCorteTecido />
              </>
            }
          />
          {/* Rota para costura */}
          <Route
            path="/administrador/costura"
            element={
              <>
                <NavBar />
                <ProducaoCostura />
              </>
            }
          />

          {/* Rota para lista de funcionários */}
          <Route
            path="/administrador/funcionarios"
            element={
              <>
                <NavBar />
                <ListaFuncionarios />
              </>
            }
          />

          {/* Rota para lista de maquinários */}
          <Route
            path="/administrador/maquinarios"
            element={
              <>
                <NavBar />
                <ListaMaquinarios />
              </>
            }
          />

          {/* Rota padrão: login */}
          <Route path="/" element={<Login />} />
        </Routes>

        <p className="text-center mt-5">
          <small>
            Desenvolvido por <a href="https://www.cleilsonalvino.com">Cleilson Alvino</a>
          </small>
        </p>
      </div>
    </Router>
  );
}

export default App;

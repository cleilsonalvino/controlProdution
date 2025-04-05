import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Funcionario from "./pages/Funcionario"; // Importe o componente Funcionario
import Administrador from "./pages/adm/Administrador"; // Importe o componente Administrador
import Login from "./pages/Login"; // Importe o componente Login
import ListaMaquinarios from "./pages/adm/ListaMaquinarios";
import ListaFuncionarios from "./pages/adm/ListaFuncionarios";
import NavBar from "./components/NavBar";
import './index.css' // Importe o componente NavBar
function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rota para funcionário */}
          <Route
            path="/funcionario"
            element={<Funcionario />} // Use o componente como JSX
          ></Route>

          <Route
            path="/administrador"
            element={
              <>
                <NavBar w/>
                <Administrador />
              </>
            }
          />

          {/* Rotas separadas para funcionários e maquinários */}
          <Route
            path="/administrador/funcionarios"
            element={
              <>
                <NavBar />
                <ListaFuncionarios />
              </>
            }
          />
          <Route
            path="/administrador/maquinarios"
            element={
              <>
                <NavBar />
                <ListaMaquinarios />
              </>
            }
          />

          <Route
            path="/"
            element={<Login />} // Adicione o componente de login
          />
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

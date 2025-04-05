import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Funcionario from "./pages/Funcionario"; // Importe o componente Funcionario
import Administrador from "./pages/adm/Administrador"; // Importe o componente Administrador
import Login from "./pages/Login"; // Importe o componente Login
import NavBar from "./components/NavBar";
import ListaMaquinarios from "./pages/adm/ListaMaquinarios";
import ListaFuncionarios from "./pages/adm/ListaFuncionarios";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container-md">
        <Routes>
          {/* Rota para funcionário */}
          <Route
            path="/funcionario"
            element={<Funcionario />} // Use o componente como JSX
          ></Route>

          <Route path="/administrador" element={<Administrador />} />

          {/* Rotas separadas para funcionários e maquinários */}
          <Route
            path="/administrador/funcionarios"
            element={<ListaFuncionarios />}
          />
          <Route
            path="/administrador/maquinarios"
            element={<ListaMaquinarios />}
          />

          <Route
            path="/"
            element={<Login />} // Adicione o componente de login
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

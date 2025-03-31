import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Funcionario from './pages/Funcionario'; // Importe o componente Funcionario
import Administrador from './pages/Administrador'; // Importe o componente Administrador

function App() {
  return (
    <Router>
      <div className="container-md">
        <Routes>
          {/* Rota para funcionário */}
          <Route
            path="/funcionario"
            element={<Funcionario />} // Use o componente como JSX
          />
          {/* Rota para administrador */}
          <Route
            path="/administrador"
            element={<Administrador />} // Adicione o componente correspondente
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
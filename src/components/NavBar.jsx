import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container-fluid">
        {/* Início - sempre à esquerda */}
        <NavLink className="navbar-brand" to="/dashboard">Início</NavLink>

        {/* Botão hamburguer à direita */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links colapsáveis */}
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mx-auto text-start ps-3">
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/cortedetecido">Corte de Tecido</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/impressao">Impressão</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/cortedepapel">Corte de Papel</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/estamparia">Estamparia</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/costura">Costura</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/embalagem">Embalagem</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/funcionarios">Funcionários</NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink className="nav-link-custom" to="/administrador/maquinarios">Maquinários</NavLink>
  </li>
  <li className="nav-item mb-3 d-lg-none">
    <NavLink className="nav-link-custom" to="/">Sair</NavLink>
  </li>
</ul>


          {/* Botão sair fora do menu em telas grandes */}
          <div className="d-none d-lg-flex">
            <NavLink className="nav-link-custom" to="/">Sair</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

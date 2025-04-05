import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container-fluid d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand" to="/administrador">Home</Link>
          <Link className="nav-link m-3" to="/administrador/funcionarios">Funcionários</Link>
          <Link className="nav-link" to="/administrador/maquinarios">Maquinários</Link>
        </div>
        <div className="d-flex align-items-center">
          <Link className="nav-link" to="/">Sair</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

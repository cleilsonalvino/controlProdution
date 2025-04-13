import React, { useState, useEffect } from 'react';
import AddFunc from './AddFunc';

const API_BASE_URL = "http://localhost:3000";

function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);

  async function fetchFuncionarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/funcionarios`);
      if (!response.ok) throw new Error('Erro ao buscar os funcionários');
      const data = await response.json();
      setFuncionarios(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function deletarFuncionario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/deletar-funcionario/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Erro ao deletar o funcionário');
      fetchFuncionarios(); // Atualiza a lista
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Funcionários</h1>
      <AddFunc />
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Setor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.id}</td>
                <td>{funcionario.nome}</td>
                <td>{funcionario.setor}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletarFuncionario(funcionario.id)}
                    >
                      Deletar
                    </button>
                    <button className="btn btn-primary btn-sm">
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaFuncionarios;

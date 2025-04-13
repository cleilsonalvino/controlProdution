import { useState, useEffect } from "react";
import AddMaquinario from "./AddMac";

const API_BASE_URL = "http://localhost:3000";

function ListaMaquinarios() {
  const [maquinarios, setMaquinarios] = useState([]);

  useEffect(() => {
    async function listarMaquinarios() {
      try {
        const response = await fetch(`${API_BASE_URL}/maquinarios`);
        if (!response.ok) throw new Error("Erro ao listar maquinários");
        const data = await response.json();
        setMaquinarios(data);
      } catch (error) {
        console.error("Erro ao listar maquinários:", error);
      }
    }

    listarMaquinarios();
  }, []);

  async function deletarMaquinario(id) {
    if (!window.confirm("Tem certeza que deseja deletar este maquinário?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/deletar-maquinario/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Erro ao deletar o maquinário");

      setMaquinarios((prev) => prev.filter((m) => m.id !== id));
      alert("Maquinário deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o maquinário:", error);
      alert("Erro ao deletar o maquinário: " + error.message);
    }
  }

  return (
    <div className="container mt-4">
      <AddMaquinario />
      <h1 className="mb-4">Lista de Maquinários</h1>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Pedidos em Produção</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {maquinarios.map((maquinario) => (
              <tr key={maquinario.id}>
                <td>{maquinario.nome}</td>
                <td>{maquinario.id}</td>
                <td>{maquinario.pedidos?.length || 0}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletarMaquinario(maquinario.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
            {maquinarios.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Nenhum maquinário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListaMaquinarios;

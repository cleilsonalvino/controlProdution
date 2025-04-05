import { useState, useEffect } from "react";

function ListaMaquinarios() {
  const [maquinarios, setMaquinarios] = useState([]);

  useEffect(() => {
    async function listarMaquinarios() {
      try {
        const response = await fetch("http://localhost:3000/maquinarios");
        if (!response.ok) throw new Error("Erro ao listar maquinários");
        const data = await response.json();
        setMaquinarios(data);
      } catch (error) {
        console.error("Erro ao listar maquinários:", error);
      }
    }

    listarMaquinarios();
  }, []); // O array vazio garante que a função será executada apenas uma vez

  return (
    <div>
      <h1>Lista de Maquinários</h1>
      <table border="1">
        <thead>
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
              <td>{maquinario.pedidos.length}</td>
              <td>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `http://localhost:3000/api/deletar-maquinario/${maquinario.id}`,
                        {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                        }
                      );
                      if (!response.ok) throw new Error("Erro ao deletar o maquinário");
                      setMaquinarios((prevMaquinarios) =>
                        prevMaquinarios.filter((m) => m.id !== maquinario.id)
                      );
                    } catch (error) {
                      console.error("Erro ao deletar o maquinário:", error);
                      alert("Erro ao deletar o maquinário: " + error.message);
                    }
                  }}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaMaquinarios;

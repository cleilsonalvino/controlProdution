import React from "react";

function ListaMaquinarios() {
  const [maquinarios, setMaquinarios] = React.useState([]);

  async function listarMaquinarios() {
    try {
      const response = await fetch("http://3.17.153.198:3000/maquinarios");
      if (!response.ok) throw new Error("Erro ao listar maquinários");
      const data = await response.json();
      setMaquinarios(data);
    } catch (error) {
      console.error("Erro ao listar maquinários:", error);
    }
  }

  return (
    <div>
      <h1>Lista de Maquinários</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          {maquinarios.map((maquinario) => (
            <tr key={maquinario.codigo}>
              <td>{maquinario.nome}</td>
              <td>{maquinario.codigo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaMaquinarios;

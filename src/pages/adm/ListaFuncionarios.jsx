import React, { useState, useEffect } from 'react'

function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([])

  async function fetchFuncionarios() {
    try {
      const response = await fetch('http://3.17.153.198:3000/funcionarios')
      if (!response.ok) throw new Error('Erro ao buscar os funcionários')
      const data = await response.json()
      setFuncionarios(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchFuncionarios()
  }, []) // 🔹 Esse [] faz rodar apenas uma vez ao montar o componente

  async function deletarFuncionario(id) {
    try {
      const response = await fetch(`http://3.17.153.198:3000/deletar-funcionario/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Erro ao deletar o funcionário')
      fetchFuncionarios() // Atualiza a lista após deletar
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Lista de Funcionários</h1>
      <table className="tabela-funcionarios">
        <thead>
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
              <td className="d-flex justify-content-around">
                <button className="btn btn-danger" onClick={() => deletarFuncionario(funcionario.id)}>
                  Deletar
                </button>
                <button className="btn btn-primary">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaFuncionarios

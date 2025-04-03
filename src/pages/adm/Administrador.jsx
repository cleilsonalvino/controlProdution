// Administrador.jsx
import React, { useEffect, useState } from "react";
import "../Administrador.css";
import AddFunc from "./AddFunc";
import ListaFuncionarios from "./ListaFuncionarios";
import AddMaquinario from "./AddMac";
import ListaMaquinarios from "./ListaMaquinarios";

// Funções utilitárias para formatação
const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : "-");
const formatTime = (date) => (date ? new Date(date).toLocaleTimeString() : "-");
const formatMinutes = (minutes) => (minutes ? `${minutes} min` : "-");

function Administrador() {
  const [tabelaPedidos, setTabelaPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTabelaPedidos() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/tabela-pedidos");
        if (!response.ok) throw new Error("Erro ao buscar a tabela de pedidos");
        const data = await response.json();
        setTabelaPedidos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTabelaPedidos();
  }, []);

  async function deletePedido(codigo) {
    if (!window.confirm("Tem certeza que deseja deletar este pedido?")) return;

    try {
      const response = await fetch(
        `http://3.17.153.198:3000/deletar-pedido/${codigo}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar o pedido");

      setTabelaPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido.codigo !== codigo)
      );
      alert("Pedido deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o pedido:", error);
      alert("Erro ao deletar o pedido: " + error.message);
    }
  }

  if (loading) return <div className="tabela-container">Carregando...</div>;
  if (error) return <div className="tabela-container">Erro: {error}</div>;

  return (
    <div className="tabela-container">
      <a href="/funcionario">Funcionário</a>

      <h1>Pedidos</h1>
      <table className="tabela-pedidos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Data Atual</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Funcionário</th>
            <th>Situação</th>
            <th>Hora Início</th>
            <th>Hora Pausa</th>
            <th>Hora Reinício</th>
            <th>Hora Final</th>
            <th>Observações</th>
            <th>Tempo Produzindo</th>
            <th>Tempo Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tabelaPedidos.map((pedido) => (
            <tr key={pedido.codigo}>
              <td>{pedido.codigo}</td>
              <td>{formatDateTime(pedido.dataAtual)}</td>
              <td>{pedido.tipo}</td>
              <td>{pedido.quantidade}</td>
              <td>
                {pedido.funcionarios && pedido.funcionarios.length > 0
                  ? pedido.funcionarios.map((funcionario, index) => (
                      <span key={funcionario.id}>
                        {funcionario.nome}
                        {index < pedido.funcionarios.length - 1 && ", "}
                      </span>
                    ))
                  : "Nenhum funcionário associado"}
              </td>
              <td>{pedido.situacao}</td>
              <td>{formatTime(pedido.horaInicio)}</td>
              <td>{formatTime(pedido.horaPausa)}</td>
              <td>{formatTime(pedido.horaReinicio)}</td>
              <td>{formatTime(pedido.horaFinal)}</td>
              <td>{pedido.observacoes || "-"}</td>
              <td>{formatMinutes(pedido.tempoProduzindo)}</td>
              <td>{formatMinutes(pedido.tempoTotal)}</td>
              <td>
                <button onClick={() => deletePedido(pedido.codigo)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddFunc />
      <ListaFuncionarios />
      <AddMaquinario />
      <ListaMaquinarios />
    </div>
  );
}

export default Administrador;

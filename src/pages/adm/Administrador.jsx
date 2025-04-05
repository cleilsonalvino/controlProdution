import React, { useEffect, useState } from "react";
import "../Administrador.css";
import { Outlet } from 'react-router-dom';

// Utilitários
const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : "-");
const formatTime = (date) => (date ? new Date(date).toLocaleTimeString() : "-");
const formatMinutes = (minutes) => (minutes ? `${minutes} min` : "-");

function Administrador() {
  const [tabelaPedidos, setTabelaPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(null);

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

  useEffect(() => {
    fetchTabelaPedidos();
  }, []);

  async function deletePedido(codigo) {
    if (!window.confirm("Tem certeza que deseja deletar este pedido?")) return;
    try {
      setDeletando(codigo);
      const response = await fetch(`http://localhost:3000/deletar-pedido/${codigo}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erro ao deletar o pedido");

      setTabelaPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido.codigo !== codigo)
      );
      alert("Pedido deletado com sucesso!");
    } catch (error) {
      alert("Erro ao deletar o pedido: " + error.message);
    } finally {
      setDeletando(null);
    }
  }

  if (loading) return <div className="tabela-container">Carregando...</div>;
  if (error) return <div className="tabela-container">Erro: {error}</div>;

  return (
    <div className="tabela-container">
      <a href="/funcionario">Funcionário</a>

      <h1>Pedidos</h1>
      <button onClick={fetchTabelaPedidos} style={{ marginBottom: "10px" }}>Atualizar Tabela</button>

      <table className="tabela-pedidos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Data de Inicio</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Funcionário</th>
            <th>Situação</th>
            <th>Hora Início</th>
            <th>Hora Pausa</th>
            <th>Hora Reinício</th>
            <th>Hora Final</th>
            <th>Observações</th>
            <th>Maquinário Usado</th>
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
                  ? pedido.funcionarios.map((f, i) => (
                      <span key={f.id}>
                        {f.nome}
                        {i < pedido.funcionarios.length - 1 && ", "}
                      </span>
                    ))
                  : "Nenhum funcionário"}
              </td>
              <td>{pedido.situacao}</td>
              <td>{formatTime(pedido.horaInicio)}</td>
              <td>{formatTime(pedido.horaPausa)}</td>
              <td>{formatTime(pedido.horaReinicio)}</td>
              <td>{formatTime(pedido.horaFinal)}</td>
              <td>{pedido.observacoes || "-"}</td>
              <td>
  {pedido.maquinario?.nome || "-"}
</td>

              <td>{formatMinutes(pedido.tempoProduzindo)}</td>
              <td>{formatMinutes(pedido.tempoTotal)}</td>
              <td>
                <button onClick={() => deletePedido(pedido.codigo)} disabled={deletando === pedido.codigo}>
                  {deletando === pedido.codigo ? "Deletando..." : "Deletar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Outlet />
    </div>
  );
}

export default Administrador;

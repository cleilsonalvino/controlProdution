import React, { useEffect, useState } from "react";
import "../Administrador.css";
import GraficoDePedidos from "./Graficos";

// Utilitários
const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : "-");
const formatTime = (date) => (date ? new Date(date).toLocaleTimeString() : "-");
const formatMinutes = (minutes) => (minutes ? `${minutes} min` : "-");

function Administrador() {
  const [tabelaPedidos, setTabelaPedidos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split("T")[0]; // yyyy-mm-dd
  });

  const itensPorPagina = 5;

  async function fetchTabelaPedidos() {
    try {
      setLoading(true);
      const response = await fetch("http://3.17.153.198:3000/tabela-pedidos");
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
      const response = await fetch(
        `http://3.17.153.198:3000/deletar-pedido/${codigo}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar o pedido");

      setTabelaPedidos((prev) =>
        prev.filter((pedido) => pedido.codigo !== codigo)
      );
      alert("Pedido deletado com sucesso!");

      const totalItens = tabelaPedidos.length - 1;
      const totalPaginas = Math.ceil(totalItens / itensPorPagina);
      if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
    } catch (error) {
      alert("Erro ao deletar o pedido: " + error.message);
    } finally {
      setDeletando(null);
    }
  }

  const totalPaginas = Math.ceil(tabelaPedidos.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const pedidosPaginados = tabelaPedidos.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );

  if (loading) return <div className="tabela-container">Carregando...</div>;
  if (error) return <div className="tabela-container">Erro: {error}</div>;

  return (
    <div className="tabela-container p-4">
      <a href="/funcionario">Funcionário</a>

      <h1>Pedidos</h1>
      <button onClick={fetchTabelaPedidos} style={{ marginBottom: "10px" }}>
        Atualizar Tabela
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Código</th>
              <th>Data de Início</th>
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
            {pedidosPaginados.map((pedido) => (
              <tr key={pedido.codigo}>
                <td>{pedido.codigo}</td>
                <td>{formatDateTime(pedido.dataAtual)}</td>
                <td className="text-capitalize">
                  <strong>{pedido.tipo}</strong>

                  {/* Detalhes do tipo PAINEL */}
                  {pedido.tipo === "PAINEL" &&
                    Array.isArray(pedido.metragem) &&
                    pedido.metragem.map((m, i) => (
                      <div key={i} style={{ whiteSpace: "nowrap" }}>
                        {m}
                      </div>
                    ))}

                  {/* Detalhes do tipo LENÇOL */}
                  {pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol && (
                    <div style={{ whiteSpace: "nowrap" }}>
                      Lençol: {pedido.tipoDetalhes.lencol.quantidadeLencol}{" "}
                      <br />
                      Fronha: {pedido.tipoDetalhes.lencol.quantidadeFronha}{" "}
                      <br />
                      Cortina:{" "}
                      {pedido.tipoDetalhes.lencol.quantidadeCortina ?? "-"}
                    </div>
                  )}
                </td>

                <td>{pedido.quantidade}</td>
                <td>
                  {pedido.funcionarios?.length
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
                <td>{pedido.maquinario?.nome || "-"}</td>
                <td>{formatMinutes(pedido.tempoProduzindo)}</td>
                <td>{formatMinutes(pedido.tempoTotal)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePedido(pedido.codigo)}
                    disabled={deletando === pedido.codigo}
                  >
                    {deletando === pedido.codigo ? "Deletando..." : "Deletar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>
      </div>
      <GraficoDePedidos
        dataSelecionada={dataSelecionada}
        fetchTabelaPedidos={fetchTabelaPedidos}
        pedidos={tabelaPedidos.filter((pedido) =>
          pedido.dataAtual?.startsWith(dataSelecionada)
        )}
        setTabelaPedidos={setTabelaPedidos}
      />
    </div>
  );
}

export default Administrador;

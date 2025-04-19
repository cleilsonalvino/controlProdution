import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const GraficoTempoMedio = ({ pedidos }) => {
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
  const [subtiposUnicos, setSubtiposUnicos] = useState([]);
  const [tempoMedioPorTipo, setTempoMedioPorTipo] = useState([]);
  const tiposPrincipais = ["Todos", "CAMISA", "LENÇOL", "PAINEL", "OUTROS"];

  useEffect(() => {
    const extrairSubtipos = (tipo) => {
      const subtipos = new Set();
      pedidos.forEach(pedido => {
        if (pedido.tipo === tipo && pedido.tipoDetalhes) {
          if (tipo === "CAMISA" && pedido.tipoDetalhes.camisa) {
            pedido.tipoDetalhes.camisa.forEach(camisa => camisa.tipo && subtipos.add(camisa.tipo));
          } else if (tipo === "LENÇOL" && pedido.tipoDetalhes.lencol?.tipo) {
            subtipos.add(pedido.tipoDetalhes.lencol.tipo);
          } else if (tipo === "OUTROS" && pedido.tipoDetalhes.outrosTipos) {
            pedido.tipoDetalhes.outrosTipos.forEach(outroTipo => outroTipo.tipo && subtipos.add(outroTipo.tipo));
          }
        }
      });
      return ["Todos", ...Array.from(subtipos).sort()];
    };

    setSubtiposUnicos(extrairSubtipos(tipoSelecionado));
  }, [pedidos, tipoSelecionado]);

  useEffect(() => {
    const tipos = ["CAMISA", "LENÇOL", "PAINEL", "OUTROS"];
    const tempoPorTipoCalculado = tipos.map((tipo) => {
      const pedidosFiltrados = pedidos.filter((pedido) => {
        let subtipoPedido = "";
        if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
          subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
        } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
          subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
        } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
          subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
        }

        return (
          (tipoSelecionado === "Todos" || pedido.tipo === tipoSelecionado) &&
          (subtipoSelecionado === "Todos" || subtipoPedido === subtipoSelecionado)
        );
      });

      const totalTempo = pedidosFiltrados.reduce((acc, pedido) => acc + (pedido.tempoProduzindo || 0), 0);
      const totalQuantidade = pedidosFiltrados.reduce((acc, pedido) => acc + pedido.quantidade, 0);
      const tempoMedio = totalQuantidade > 0 ? totalTempo / totalQuantidade : 0;

      return { tipo, tempoMedio: parseFloat(tempoMedio.toFixed(2)) };
    });
    setTempoMedioPorTipo(tempoPorTipoCalculado);
  }, [pedidos, tipoSelecionado, subtipoSelecionado]);

  return (
    <div>
      <h4 className="text-center mb-3">Tempo Médio por Tipo de Pedido</h4>
      <div className="d-flex justify-content-center mb-3">
        <label className="me-2">Tipo:</label>
        <select
          className="form-select me-2"
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value)}
          style={{ maxWidth: "150px" }}
        >
          {tiposPrincipais.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>
        <label className="me-2">Subtipo:</label>
        <select
          className="form-select"
          value={subtipoSelecionado}
          onChange={(e) => setSubtipoSelecionado(e.target.value)}
          style={{ maxWidth: "200px" }}
          disabled={tipoSelecionado === "Todos"}
        >
          {subtiposUnicos.map((subtipo, index) => (
            <option key={index} value={subtipo}>{subtipo}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={tempoMedioPorTipo}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tempoMedio" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoTempoMedio;
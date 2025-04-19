import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const GraficoProducaoDiaria = ({ pedidos }) => {
  const [dataSelecionadaGrafico, setDataSelecionadaGrafico] = useState(new Date().toISOString().slice(0, 10));
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
  const [subtiposUnicos, setSubtiposUnicos] = useState([]);
  const [producaoPorHora, setProducaoPorHora] = useState([]);
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
    const horas = Array(11).fill(0);
    pedidos.forEach((pedido) => {
      const dataPedido = new Date(pedido.horaInicio);
      const dataSelecionada = new Date(dataSelecionadaGrafico);
      const mesmaData =
        dataPedido.getDate() === dataSelecionada.getDate() &&
        dataPedido.getMonth() === dataSelecionada.getMonth() &&
        dataPedido.getFullYear() === dataSelecionada.getFullYear();
      if (!mesmaData) return;

      let subtipoPedido = "";
      if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
        subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
      } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
        subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
      } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
        subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
      }

      if (
        (tipoSelecionado === "Todos" || pedido.tipo === tipoSelecionado) &&
        (subtipoSelecionado === "Todos" || subtipoPedido === subtipoSelecionado)
      ) {
        const hora = dataPedido.getHours();
        const index = hora - 7;
        if (index >= 0 && index < 11) {
          horas[index] += pedido.quantidade;
        }
      }
    });
    const dadosHora = horas.map((quantidade, index) => ({ hora: `${index + 7}:00`, quantidade }));
    setProducaoPorHora(dadosHora);
  }, [pedidos, dataSelecionadaGrafico, tipoSelecionado, subtipoSelecionado]);

  return (
    <div>
      <h4 className="text-center mb-3">Produção Diária (07:00 - 17:00)</h4>
      <div className="row justify-content-center mb-3">
        <div className="col-md-3">
          <label className="form-label me-2">Data:</label>
          <input
            type="date"
            className="form-control me-2"
            value={dataSelecionadaGrafico}
            onChange={(e) => setDataSelecionadaGrafico(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label me-2">Tipo:</label>
          <select
            className="form-select me-2"
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
          >
            {tiposPrincipais.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label me-2">Subtipo:</label>
          <select
            className="form-select"
            value={subtipoSelecionado}
            onChange={(e) => setSubtipoSelecionado(e.target.value)}
            disabled={tipoSelecionado === "Todos"}
          >
            {subtiposUnicos.map((subtipo, index) => (
              <option key={index} value={subtipo}>{subtipo}</option>
            ))}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={producaoPorHora}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantidade" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoProducaoDiaria;
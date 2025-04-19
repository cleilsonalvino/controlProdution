import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const GraficoProducaoMensal = ({ pedidos }) => {
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
  const [subtiposUnicos, setSubtiposUnicos] = useState([]);
  const [producaoMensal, setProducaoMensal] = useState([]);
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
    const meses = Array(12).fill(0);
    pedidos.forEach((pedido) => {
      const data = new Date(pedido.dataAtual);
      const anoPedido = data.getFullYear();
      const mes = data.getMonth();

      let subtipoPedido = "";
      if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
        subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
      } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
        subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
      } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
        subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
      }

      if (
        anoPedido === parseInt(anoSelecionado) &&
        (tipoSelecionado === "Todos" || pedido.tipo === tipoSelecionado) &&
        (subtipoSelecionado === "Todos" || subtipoPedido === subtipoSelecionado)
      ) {
        meses[mes] += pedido.quantidade;
      }
    });
    const dadosMensais = meses.map((quantidade, index) => ({ mes: `${index + 1}`.padStart(2, "0"), quantidade }));
    setProducaoMensal(dadosMensais);
  }, [pedidos, anoSelecionado, tipoSelecionado, subtipoSelecionado]);

  return (
    <div>
      <h4 className="text-center mb-3">Produção por Mês no Ano</h4>
      <div className="row justify-content-center mb-3">
        <div className="col-md-3">
          <label className="form-label me-2">Ano:</label>
          <input
            type="number"
            className="form-control me-2"
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(e.target.value)}
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
        <BarChart data={producaoMensal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantidade" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoProducaoMensal;
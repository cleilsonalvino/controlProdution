import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const GraficoTempoMedio = ({ pedidos }) => {
  const [tipoSelecionado, setTipoSelecionado] = useState("CAMISA");
  const [quantidadeDigitada, setQuantidadeDigitada] = useState(1);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [subtiposUnicos, setSubtiposUnicos] = useState([]);
  const tiposPrincipais = ["CAMISA", "LENÇOL", "PAINEL", "OUTROS"];

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
      return Array.from(subtipos).sort();
    };

    setSubtiposUnicos(extrairSubtipos(tipoSelecionado));
  }, [pedidos, tipoSelecionado]);

  useEffect(() => {
    const calcularTempoMedio = () => {
      const resultados = [];

      subtiposUnicos.forEach(subtipo => {
        const pedidosFiltrados = pedidos.filter((pedido) => {
          let subtipoPedido = "";
          if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
            subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
          } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
            subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
          } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
            subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
          }
          return pedido.tipo === tipoSelecionado && subtipoPedido === subtipo;
        });

        if (pedidosFiltrados.length > 0 && quantidadeDigitada > 0) {
          const totalTempoEmMinutos = pedidosFiltrados.reduce((acc, pedido) => {
            const tempoString = pedido.tempoProduzindo || "00:00:00";
            const [horas, minutos, segundos] = tempoString.split(':').map(Number);
            const tempoTotalPedidoEmMinutos = (horas * 60) + minutos + (segundos / 60);
            return acc + tempoTotalPedidoEmMinutos;
          }, 0);

          const tempoMedioCalculado = parseFloat((totalTempoEmMinutos / quantidadeDigitada).toFixed(2));
          const quantidadeTotalPedidosFiltrados = pedidosFiltrados.reduce((acc, pedido) => acc + pedido.quantidade, 0);

          resultados.push({ name: subtipo, tempoMedio: tempoMedioCalculado, quantidade: quantidadeTotalPedidosFiltrados });
        } else if (pedidosFiltrados.length > 0 && quantidadeDigitada <= 0) {
          resultados.push({ name: subtipo, tempoMedio: 0, quantidade: 0 });
        }
      });
      setDadosGrafico(resultados);
    };

    calcularTempoMedio();
  }, [pedidos, quantidadeDigitada, tipoSelecionado, subtiposUnicos]);

  const handleQuantidadeChange = (e) => {
    setQuantidadeDigitada(parseInt(e.target.value) || 1);
  };

  const handleTipoChange = (e) => {
    setTipoSelecionado(e.target.value);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Tempo Médio de Produção</h4>
      <div className="d-flex justify-content-center mb-3">
        <label className="me-2">Tipo:</label>
        <select
          className="form-select me-2"
          value={tipoSelecionado}
          onChange={handleTipoChange}
          style={{ maxWidth: "150px" }}
        >
          {tiposPrincipais.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>
        <label className="me-2">Qtd. para Média:</label>
        <input
          type="number"
          className="form-control"
          value={quantidadeDigitada}
          onChange={handleQuantidadeChange}
          min="1"
          style={{ maxWidth: "100px" }}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} min`, 'Tempo Médio']} labelFormatter={(value) => `Subtipo: ${value}`} />
          <Bar dataKey="tempoMedio" fill="#a8dadc" />
        </BarChart>
      </ResponsiveContainer>

      {dadosGrafico.length > 0 && (
        <div className="mt-2 text-center">
          {dadosGrafico.map((item, index) => (
            <p key={index}>
              Tempo médio de produção para <strong>{tipoSelecionado} - {item.name}</strong> (Quantidade Consultada: {quantidadeDigitada}, Total Pedidos: {item.quantidade}): <strong>{item.tempoMedio} min</strong>
            </p>
          ))}
        </div>
      )}

      {dadosGrafico.length === 0 && (
        <p className="text-center mt-2">
          Nenhum subtipo encontrado para o tipo selecionado.
        </p>
      )}
    </div>
  );
};

export default GraficoTempoMedio;
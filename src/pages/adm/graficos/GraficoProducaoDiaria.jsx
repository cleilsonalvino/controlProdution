import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const GraficoProducaoDiaria = ({ pedidos }) => {
  const [dataSelecionadaGrafico, setDataSelecionadaGrafico] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().slice(0, 10);
  });
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
  const [subtiposUnicos, setSubtiposUnicos] = useState([]);
  const [producaoPorHora, setProducaoPorHora] = useState([]);
  const [totaisPorTipo, setTotaisPorTipo] = useState({});
  const tiposPrincipais = ["Todos", "CAMISA", "LENÇOL", "PAINEL", "OUTROS"];

  useEffect(() => {
    const extrairSubtipos = (tipo) => {
      const subtipos = new Set();
      pedidos.forEach((pedido) => {
        if (pedido.tipo === tipo && pedido.tipoDetalhes) {
          if (tipo === "CAMISA" && pedido.tipoDetalhes.camisa) {
            pedido.tipoDetalhes.camisa.forEach(
              (camisa) => camisa.tipo && subtipos.add(camisa.tipo)
            );
          } else if (tipo === "LENÇOL" && pedido.tipoDetalhes.lencol?.tipo) {
            subtipos.add(pedido.tipoDetalhes.lencol.tipo);
          } else if (tipo === "OUTROS" && pedido.tipoDetalhes.outrosTipos) {
            pedido.tipoDetalhes.outrosTipos.forEach(
              (outroTipo) => outroTipo.tipo && subtipos.add(outroTipo.tipo)
            );
          }
        }
      });
      return ["Todos", ...Array.from(subtipos).sort()];
    };

    setSubtiposUnicos(extrairSubtipos(tipoSelecionado));
  }, [pedidos, tipoSelecionado]);

  useEffect(() => {
    const horas = Array(11).fill(0);
    const totais = {};

    pedidos.forEach((pedido) => {
      if (pedido.situacao === "Finalizado" && pedido.horaFinal) {
        const dataFinalPedido = new Date(pedido.horaFinal);
        const [ano, mes, dia] = dataSelecionadaGrafico.split('-');
        const dataSelecionadaObj = new Date(Date.UTC(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 0, 0, 0) - 3 * 60 * 60 * 1000);

        const mesmoDia =
          dataFinalPedido.getUTCDate() === dataSelecionadaObj.getUTCDate() &&
          dataFinalPedido.getUTCMonth() === dataSelecionadaObj.getUTCMonth() &&
          dataFinalPedido.getUTCFullYear() === dataSelecionadaObj.getUTCFullYear();

        if (mesmoDia) {
          const horaFinal = dataFinalPedido.getHours();
          const minutoFinal = dataFinalPedido.getMinutes();

          if (horaFinal >= 7 && horaFinal <= 17) {
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
              let index;
              if (horaFinal === 7 && minutoFinal >= 20) index = 0;
              else if (horaFinal > 7 && horaFinal < 17) index = horaFinal - 7;
              else if (horaFinal === 17 && minutoFinal <= 20) index = 10;
              else index = -1;

              if (index >= 0 && index < 11 && typeof pedido.quantidade === 'number' && !isNaN(pedido.quantidade)) {
                horas[index] += pedido.quantidade;
              }

              if (totais[pedido.tipo]) {
                totais[pedido.tipo] += pedido.quantidade;
              } else {
                totais[pedido.tipo] = pedido.quantidade;
              }
            }
          }
        }
      }
    });

    const dadosHora = horas.map((quantidade, index) => {
      let horaInicio;
      let horaFim;

      if (index === 0) {
        horaInicio = "7:20";
        horaFim = "8:00";
      } else if (index === 10) {
        horaInicio = "17:00";
        horaFim = "17:20";
      } else {
        horaInicio = `${index + 7}:00`;
        horaFim = `${index + 8}:00`;
      }

      return { hora: `${horaInicio}-${horaFim}`, quantidade };
    });

    setProducaoPorHora(dadosHora);
    setTotaisPorTipo(totais);
  }, [pedidos, dataSelecionadaGrafico, tipoSelecionado, subtipoSelecionado]);

  return (
    <div>
      <small className="text-danger">Para selecionar a data atual, escolha o dia seguinte, deu bug, ainda vou ajeitar</small>
      <h4 className="text-center mb-3">
        Produção Finalizada Diária (07:20 - 17:20)
      </h4>
      <div className="row justify-content-center mb-3">
        <div className="col-md-3">
          <label className="form-label me-2">Data:</label>
          <input
            type="date"
            className="form-control me-2"
            value={dataSelecionadaGrafico}
            onChange={(e) => {
              setDataSelecionadaGrafico(e.target.value);
              console.log("Data selecionada:", e.target.value);
            }}
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
              <option key={index} value={tipo}>
                {tipo}
              </option>
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
              <option key={index} value={subtipo}>
                {subtipo}
              </option>
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
          <Bar dataKey="quantidade" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h5 className="mt-4 text-center">Total por Tipo</h5>
      <ul className="list-unstyled text-center">
        {Object.keys(totaisPorTipo).map((tipo) => (
          <li key={tipo}>
            <strong>{tipo}:</strong> {totaisPorTipo[tipo]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraficoProducaoDiaria;
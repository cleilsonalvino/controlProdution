import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Certifique-se de que o useState está sendo chamado dentro da função do componente
function GraficoDePedidos({ pedidos }) {
  const STATUS_LABELS = ["Pendente", "Em andamento", "Pausado", "Finalizado"];

  const [dadosBarras, setDadosBarras] = useState([]);
  const [dadosPizza, setDadosPizza] = useState([]);
  const [dadosStatus, setDadosStatus] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A",
    "#8E44AD",
    "#2ECC71",
  ];

  useEffect(() => {
    const gerarDados = () => {
      const inicioDia = new Date(dataSelecionada);
      inicioDia.setHours(7, 20, 0, 0);
      const fimDia = new Date(dataSelecionada);
      fimDia.setHours(17, 20, 0, 0);
  
      const intervalos = [];
      let atual = new Date(inicioDia);
      while (atual < fimDia) {
        const proximo = new Date(atual);
        proximo.setHours(atual.getHours() + 1);
        intervalos.push({
          label: `${atual.getHours().toString().padStart(2, "0")}:${atual
            .getMinutes()
            .toString()
            .padStart(2, "0")} - ${proximo
            .getHours()
            .toString()
            .padStart(2, "0")}:${proximo
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          inicio: new Date(atual),
          fim: new Date(proximo),
          quantidade: 0,
        });
        atual = proximo;
      }
  
      const pizza = {};
      const situacaoContagem = {
        "Em andamento": 0,
        Pausado: 0,
        Finalizado: 0,
      };
  
      pedidos.forEach((pedido) => {
        if (!pedido.horaInicio || !pedido.quantidade) return;
  
        const hora = new Date(pedido.horaInicio);
        const dataHoraInicio = new Date(
          hora.getFullYear(),
          hora.getMonth(),
          hora.getDate()
        );
  
        if (dataHoraInicio.getTime() !== dataSelecionada.getTime()) return;
  
        // Gráfico de barras por horário
        intervalos.forEach((intervalo) => {
          if (hora >= intervalo.inicio && hora < intervalo.fim) {
            intervalo.quantidade += pedido.quantidade;
          }
        });
  
        // Gráfico de pizza por funcionário
        if (pedido.funcionarios && pedido.funcionarios.length > 0) {
          pedido.funcionarios.forEach((f) => {
            if (!pizza[f.nome]) pizza[f.nome] = 0;
            pizza[f.nome] += pedido.quantidade;
          });
        } else {
          if (!pizza["Sem Funcionário"]) pizza["Sem Funcionário"] = 0;
          pizza["Sem Funcionário"] += pedido.quantidade;
        }
  
        // Contagem de situação (excluindo "Pendente")
        const situacao = pedido.situacao;
        if (situacao === "Em andamento") {
          situacaoContagem["Em andamento"] += 1;
        } else if (situacao === "Pausado") {
          situacaoContagem.Pausado += 1;
        } else if (situacao === "Finalizado") {
          situacaoContagem.Finalizado += 1;
        }
      });
  
      setDadosBarras(intervalos);
  
      const pizzaArray = Object.entries(pizza).map(([nome, quantidade]) => ({
        nome,
        quantidade,
      }));
      setDadosPizza(pizzaArray);
  
      const situacaoArray = STATUS_LABELS.filter(
        (situacao) => situacao !== "Pendente"
      ).map((situacao) => ({
        situacao,
        quantidade: situacaoContagem[situacao],
      }));
      setDadosStatus(situacaoArray);
    };
  
    gerarDados();
  }, [dataSelecionada, pedidos]);
  

  function formatarDataParaInput(date) {
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const dia = date.getDate().toString().padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  return (
    <div className="container">
      <h2 className="mt-4">Produção por Período (07:20 às 17:20)</h2>
      <input
      
        type="date"
        value={formatarDataParaInput(dataSelecionada)}
        onChange={(e) => {
          const partes = e.target.value.split("-");
          const novaData = new Date(partes[0], partes[1] - 1, partes[2]);
          novaData.setHours(0, 0, 0, 0);
          setDataSelecionada(novaData);
        }}
        className="form-control mb-4 "
        style={{ maxWidth: "250px" }}
      />

      <div className="row align-items-center justify-content-center">
        {/* Gráfico de Barras - Produção por Hora */}
        <div className="col-12 col-lg-6 mb-4 ">
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - Por Funcionário */}
        <div className="col-12 col-lg-6 mb-4">
          <h4 className="text-center mb-3">Produção por Funcionário</h4>
          <div style={{ width: "100%", height: 300 }}>
            {dadosPizza.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    dataKey="quantidade"
                    nameKey="nome"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center mt-5">
                Sem dados de produção para esta data.
              </p>
            )}
          </div>
        </div>

        {/* Gráfico de Status dos Pedidos */}
        <div className="col-12 mb-4">
          <h4 className="text-center mb-3">Status dos Pedidos no Dia</h4>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="situacao" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraficoDePedidos;

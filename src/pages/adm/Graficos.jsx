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

function GraficoDePedidos({ pedidos }) {
  const STATUS_LABELS = ["Pendente", "Em andamento", "Pausado", "Finalizado"];
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#8E44AD", "#2ECC71",
  ];

  const [dadosBarras, setDadosBarras] = useState([]);
  const [dadosPizza, setDadosPizza] = useState([]);
  const [dadosStatus, setDadosStatus] = useState([]);
  const [tempoMedioTipos, setTempoMedioTipos] = useState([]);
  const [quantidadeReferencia, setQuantidadeReferencia] = useState(50);
  const [inputValue, setInputValue] = useState(50);
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
  });
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [dadosMensais, setDadosMensais] = useState([]);

  function formatarMinutosParaHoraBrasileira(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    if (horas > 0 && mins > 0) return `${horas}h ${mins}min`;
    if (horas > 0) return `${horas}h`;
    return `${mins}min`;
  }

  function formatarDataParaInput(date) {
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const dia = date.getDate().toString().padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  useEffect(() => {
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
      if (
        !pedido.horaInicio ||
        !pedido.quantidade ||
        pedido.situacao !== "Finalizado" // <-- aqui o filtro extra
      ) return;
  
      const hora = new Date(pedido.horaInicio);
      const dataHoraInicio = new Date(hora.getFullYear(), hora.getMonth(), hora.getDate());
  
      if (dataHoraInicio.getTime() !== dataSelecionada.getTime()) return;
  
      intervalos.forEach((intervalo) => {
        if (hora >= intervalo.inicio && hora < intervalo.fim) {
          intervalo.quantidade += pedido.quantidade;
        }
      });
  
      if (pedido.funcionarios && pedido.funcionarios.length > 0) {
        pedido.funcionarios.forEach((f) => {
          if (!pizza[f.nome]) pizza[f.nome] = 0;
          pizza[f.nome] += pedido.quantidade;
        });
      } else {
        pizza["Sem Funcionário"] = (pizza["Sem Funcionário"] || 0) + pedido.quantidade;
      }
  
      const situacao = pedido.situacao;
      if (situacao === "Em andamento") situacaoContagem["Em andamento"] += 1;
      else if (situacao === "Pausado") situacaoContagem.Pausado += 1;
      else if (situacao === "Finalizado") situacaoContagem.Finalizado += 1;
    });
  
    const pizzaArray = Object.entries(pizza).map(([nome, quantidade]) => ({ nome, quantidade }));
    const situacaoArray = STATUS_LABELS.filter((s) => s !== "Pendente").map((situacao) => ({
      situacao,
      quantidade: situacaoContagem[situacao],
    }));
  
    setDadosBarras(intervalos);
    setDadosPizza(pizzaArray);
    setDadosStatus(situacaoArray);
  }, [dataSelecionada, pedidos]);
  

  useEffect(() => {
    const tipos = { CAMISA: [], PAINEL: [], LENÇOL: [] };

    pedidos.forEach((pedido) => {
      const partes = pedido.tempoProduzindo?.split(":");
      if (!partes || partes.length !== 3) return;

      const minutos = parseInt(partes[0]) * 60 + parseInt(partes[1]);
      if (tipos[pedido.tipo]) {
        tipos[pedido.tipo].push({
          tempo: minutos,
          quantidade: pedido.quantidade,
        });
      }
    });

    const medias = Object.entries(tipos).map(([tipo, registros]) => {
      const totalMinutos = registros.reduce((acc, cur) => acc + cur.tempo, 0);
      const totalQuantidade = registros.reduce((acc, cur) => acc + cur.quantidade, 0);

      const tempoCalculado =
        totalQuantidade > 0
          ? (totalMinutos / totalQuantidade) * quantidadeReferencia
          : 0;

      return {
        tipo,
        tempo: tempoCalculado,
      };
    });
    
    setTempoMedioTipos(medias);
  }, [pedidos, quantidadeReferencia]);

  useEffect(() => {
    const porMes = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(0, i).toLocaleString("pt-BR", { month: "long" }),
      quantidade: 0,
    }));

    pedidos.forEach((pedido) => {
      if (!pedido.horaInicio || !pedido.quantidade) return;
      const data = new Date(pedido.horaInicio);
      if (data.getFullYear() === parseInt(anoSelecionado)) {
        porMes[data.getMonth()].quantidade += pedido.quantidade;
      }
    });

    setDadosMensais(porMes);
  }, [anoSelecionado, pedidos]);

  return (
    <div className="container">
      <h2 className="mt-4">Produção por Período (07:20 às 17:20)</h2>

      {/* Seletor de data */}
      <input
        type="date"
        value={formatarDataParaInput(dataSelecionada)}
        onChange={(e) => {
          const partes = e.target.value.split("-");
          const novaData = new Date(partes[0], partes[1] - 1, partes[2]);
          novaData.setHours(0, 0, 0, 0);
          setDataSelecionada(novaData);
        }}
        className="form-control mb-4"
        style={{ maxWidth: "250px" }}
      />

      <div className="row align-items-center justify-content-center">
        {/* Barras por horário */}
        <div className="col-12 col-lg-6 mb-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pizza por funcionário */}
        <div className="col-12 col-lg-6 mb-4">
          <h4 className="text-center mb-3">Produção por Funcionário</h4>
          {dadosPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center mt-5">Sem dados de produção para esta data.</p>
          )}
        </div>

        {/* Status dos pedidos */}
        <div className="col-12 mb-4">
          <h4 className="text-center mb-3">Status dos Pedidos no Dia</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="situacao" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tempo médio global */}
        <div className="col-12 mb-4">
          <h4 className="text-center mb-3">Tempo Médio Global (por tipo)</h4>
          <div className="d-flex justify-content-center mb-3">
            <label className="me-2">Quantidade de referência:</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => {
                const valor = Number(inputValue);
                if (!isNaN(valor) && valor > 0) {
                  setQuantidadeReferencia(valor);
                } else {
                  setInputValue(quantidadeReferencia);
                }
              }}
              style={{ width: "100px" }}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tempoMedioTipos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip formatter={formatarMinutosParaHoraBrasileira} />
              <Bar dataKey="tempo" fill="#FF5733" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Produção mensal por ano */}
        <div className="col-12 mb-4">
          <h4 className="text-center mb-3">Produção Mensal no Ano</h4>
          <div className="d-flex justify-content-center mb-3">
            <input
              type="number"
              className="form-control"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              style={{ width: "100px" }}
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosMensais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#00A3E0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default GraficoDePedidos;

import React from "react";
import GraficoTempoMedio from "./graficos/GraficoTempoMedio";
import GraficoProducaoMensal from "./graficos/GraficoProducaoMensal";
import GraficoProducaoDiaria from "./graficos/GraficoProducaoDiaria";
import GraficoCrescimentoProducao from "./graficos/GraficoCrescimentoProducao";
import RelatorioCompleto from "./graficos/RelatorioCompleto";

const GraficoDePedidos = ({ pedidos }) => {
  return (
    <div className="container mt-4">
      <hr className="my-5" />
            <GraficoTempoMedio pedidos={pedidos} />
            <hr className="my-5" />
      <RelatorioCompleto
        pedidosMensais={pedidos}
        pedidosCrescimento={pedidos}
        pedidosDiarios={pedidos}
      />
    </div>
  );
};

export default GraficoDePedidos;

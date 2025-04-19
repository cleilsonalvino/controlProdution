import React from "react";
import GraficoTempoMedio from "./graficos/GraficoTempoMedio";
import GraficoProducaoMensal from "./graficos/GraficoProducaoMensal";
import GraficoProducaoDiaria from "./graficos/GraficoProducaoDiaria";

const GraficoDePedidos = ({ pedidos }) => {
  return (
    <div className="container mt-4">
      <GraficoTempoMedio pedidos={pedidos} />
      <hr className="my-5" />
      <GraficoProducaoMensal pedidos={pedidos} />
      <hr className="my-5" />
      <GraficoProducaoDiaria pedidos={pedidos} />
    </div>
  );
};

export default GraficoDePedidos;
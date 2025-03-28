import React from 'react';
import ListaPedidos from './components/ListaPedidos';

function App() {
  const pedidos = [
    { codigo: 101, nome: "João", tipo: "CAMISA", quantidade: 5, funcionario: "Cleilson", data: "27/03/2025" },
    { codigo: 102, nome: "Maria", tipo: "PAINEL", quantidade: 2, data: "27/03/2025" },
    { codigo: 103, nome: "Carlos", tipo: "OUTROS", quantidade: 10, data: "27/03/2025" },
  ];

  return (
    <div className="container">
      <h1>Lista de Pedidos</h1>
      <ListaPedidos pedidos={pedidos} />
    </div>
  );
}

export default App;

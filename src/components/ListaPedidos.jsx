import React from 'react';
import CardPedido from './CardPedido';
import './index.css'

function ListaPedidos({ pedidos }) {
  return (
    <div className="lista-pedidos">
      {pedidos.map((pedido) => (
        <CardPedido key={pedido.codigo} pedido={pedido} />
      ))}
    </div>
  );
}

export default ListaPedidos;

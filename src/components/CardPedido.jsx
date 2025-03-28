import React from 'react';

function CardPedido({ pedido }) {
  return (
    <div className="card boxPedido sm">
      <h3>Pedido #{pedido.codigo}</h3>
      <p><strong>Nome:</strong> {pedido.nome}</p>
      <p><strong>Tipo:</strong> {pedido.tipo}</p>
      <p><strong>Quantidade:</strong> {pedido.quantidade}</p>
      <p><strong>Data:</strong> {pedido.data}</p>
      <p><strong>Quem fez: {pedido.funcionario}</strong></p>
      <button className="btn">Ver detalhes</button>
    </div>
  );
}

export default CardPedido;

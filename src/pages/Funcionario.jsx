import React, { useState } from 'react';
import ListaPedidos from '../components/ListaPedidos';
import NovoPedido from '../components/NovoPedido';

function Funcionario() {
  // Estado para armazenar a lista de pedidos
  const [pedidos, setPedidos] = useState([]);

  // Função para adicionar um novo pedido
  const adicionarPedido = (novoPedido) => {
    setPedidos([...pedidos, novoPedido]); // Adiciona o novo pedido à lista
  };

  return (
    <div className="container-md">
      <h1 className='text-center m-4'>Lista de Pedidos</h1>
      <a href="/administrador">ADM</a>
      {/* Passando a função adicionarPedido para o componente NovoPedido */}
      <NovoPedido adicionarPedido={adicionarPedido} />
      {/* Passando a lista de pedidos para o componente ListaPedidos */}
      <ListaPedidos pedidos={pedidos} />
    </div>
  );
}

export default Funcionario;

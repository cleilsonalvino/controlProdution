import React, { useState, useEffect } from "react";
import CardPedido from "./CardPedido";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function listarPedidos() {
      try {
        const response = await fetch(`${API_BASE_URL}/pedidos`);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao listar pedidos:", error);
      }
    }

    listarPedidos();
  }, []);

  // Função para atualizar um pedido na lista de pedidos
  const handleUpdatePedidoLista = (pedidoAtualizado) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.codigo === pedidoAtualizado.codigo ? pedidoAtualizado : pedido
      )
    );
  };

  return (
    <div>
      {(() => {
        const pedidosFiltrados = pedidos.filter(pedido => pedido.situacao !== 'Finalizado');

        return pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map((pedido) => (
            <CardPedido
              key={pedido.codigo}
              pedido={pedido}
              onUpdatePedido={handleUpdatePedidoLista} // Passa a função para o CardPedido
            />
          ))
        ) : (
          <p>Não há pedidos no momento.</p>
        );
      })()}
    </div>
  );
}

export default ListaPedidos;
import React, { useState, useEffect } from "react";
import CardPedido from "./CardPedido";

const API_BASE_URL = process.env.VITE_REACT_APP_API_BASE_URL;

function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);  // Estado para armazenar a lista de pedidos

  // Função para listar os pedidos
  useEffect(() => {
    async function listarPedidos() {
      try {
        const response = await fetch(`${API_BASE_URL}/pedidos`);  // Altere para a URL correta da sua API
        const data = await response.json();
        setPedidos(data);  // Atualiza o estado com a lista de pedidos
      } catch (error) {
        console.error("Erro ao listar pedidos:", error);
      }
    }

    listarPedidos();  // Chama a função ao carregar o componente
  }, []);

  return (
<div>
  {(() => {
    const pedidosFiltrados = pedidos.filter(pedido => pedido.situacao !== 'Finalizado');

    return pedidosFiltrados.length > 0 ? (
      pedidosFiltrados.map((pedido) => (
        <CardPedido key={pedido.codigo} pedido={pedido} />
      ))
    ) : (
      <p>Não há pedidos no momento.</p>
    );
  })()}
</div>


  );
}

export default ListaPedidos;

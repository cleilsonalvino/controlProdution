import React, { useState, useEffect } from "react";
import CardPedido from "./CardPedido";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosOriginais, setPedidosOriginais] = useState([]);

  useEffect(() => {
    async function listarPedidos() {
      try {
        const response = await fetch(`${API_BASE_URL}/pedidos`);
        const data = await response.json();
        setPedidos(data);
        setPedidosOriginais(data);
      } catch (error) {
        console.error("Erro ao listar pedidos:", error);
      }
    }

    listarPedidos();
  }, []);

  const handleUpdatePedidoLista = (pedidoAtualizado) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.codigo === pedidoAtualizado.codigo ? pedidoAtualizado : pedido
      )
    );

    setPedidosOriginais((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.codigo === pedidoAtualizado.codigo ? pedidoAtualizado : pedido
      )
    );
  };

const pesquisarPedido = (event) => {
    const valor = event.target.value;
  
    if (!valor) {
      setPedidos(pedidosOriginais);
      return;
    }
  
    const pedidosFiltrados = pedidosOriginais.filter((pedido) =>
      pedido.codigo.toString().includes(valor)
    );
    setPedidos(pedidosFiltrados);
  };
  

  return (
    <div>
      <input
        type="text"
        className="form-control mb-3 mt-3"
        placeholder="Pesquise pelo código"
        onChange={pesquisarPedido}
      />

      {(() => {
        const pedidosAtivos = pedidos.filter(
          (pedido) => pedido.situacao !== "Finalizado"
        );

        return pedidosAtivos.length > 0 ? (
          pedidosAtivos.map((pedido) => (
            <CardPedido
              key={pedido.codigo}
              pedido={pedido}
              onUpdatePedido={handleUpdatePedidoLista}
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

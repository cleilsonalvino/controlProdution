import React, { useState, useEffect } from "react";
import './index.css'; // Importando o CSS para estilização

function CardPedido({ pedido, onUpdatePedido }) {
  const [localPedido, setLocalPedido] = useState(pedido);
  const [isRunning, setIsRunning] = useState(pedido.situacao === "Em andamento");

  const atualizarPedido = (data) => {
    setLocalPedido(data);
    setIsRunning(data.situacao === "Em andamento");
    if (onUpdatePedido) onUpdatePedido(data);
  };

  // Função para iniciar o pedido
  const iniciarPedido = async () => {
    try {
      const response = await fetch(`http://3.17.153.198:3000/iniciar-pedido/${pedido.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao iniciar o pedido");
      const data = await response.json();
      atualizarPedido(data);
    } catch (error) {
      console.error("Erro ao iniciar o pedido:", error);
    }
  };

  // Função para pausar o pedido
  const pausarPedido = async () => {
    try {
      const response = await fetch(`http://3.17.153.198:3000/pausar-pedido/${pedido.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao pausar o pedido");
      const data = await response.json();
      atualizarPedido(data);
    } catch (error) {
      console.error("Erro ao pausar o pedido:", error);
    }
  };

  // Função para reiniciar o pedido
  const reiniciarPedido = async () => {
    try {
      const response = await fetch(`http://3.17.153.198:3000/reiniciar-pedido/${pedido.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao reiniciar o pedido");
      const data = await response.json();
      atualizarPedido(data);
    } catch (error) {
      console.error("Erro ao reiniciar o pedido:", error);
    }
  };

  // Função para finalizar o pedido
  const finalizarPedido = async () => {
    try {
      const response = await fetch(`http://3.17.153.198:3000/finalizar-pedido/${pedido.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao finalizar o pedido");
      const data = await response.json();
      atualizarPedido(data);
    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
    }
  };

  const deletePedido = async () => {
    try {
      const response = await fetch(`http://3.17.153.198:3000/deletar-pedido/${pedido.codigo}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erro ao deletar o pedido");
      const alertPlaceholder = document.createElement("div");
      alertPlaceholder.className = "alert alert-success";
      alertPlaceholder.role = "alert";
      alertPlaceholder.innerText = "Pedido deletado com sucesso!";
      const parentDiv = document.querySelector(".boxPedido");
      parentDiv.appendChild(alertPlaceholder);

      setTimeout(() => {
        alertPlaceholder.remove();
        if (onUpdatePedido) onUpdatePedido(null);
      }, 3000);
    } catch (error) {
      console.error("Erro ao deletar o pedido:", error);
    }
  };

  // Buscar o estado inicial do pedido ao montar o componente
  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await fetch(`http://3.17.153.198:3000/pedidos`);
        const pedidos = await response.json();
        const pedidoAtual = pedidos.find((p) => p.codigo === pedido.codigo);
        atualizarPedido(pedidoAtual);
      } catch (error) {
        console.error("Erro ao buscar o pedido:", error);
      }
    };
    fetchPedido();
  }, [pedido.codigo]);

  // Lógica para habilitar/desabilitar botões com base na situação
  const situacao = localPedido.situacao;
  const isPendente = situacao === "Pendente";
  const isPausado = situacao === "Pausado";
  const isEmAndamento = situacao === "Em andamento";
  const isFinalizado = situacao === "Finalizado";

  return (
    <div className="card boxPedido mt-4 mb-4 p-3">
      <div className="container d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-danger"
          onClick={deletePedido}
          disabled={isFinalizado} // Desabilita "Excluir" se finalizado
        >
          Excluir
        </button>
        <h3 className="text-center">Pedido #{localPedido.codigo}</h3>
        <span className="text-warning">{situacao}</span>
      </div>
      <p><strong>Tipo:</strong> {localPedido.tipo}</p>
      <p><strong>Quantidade:</strong> {localPedido.quantidade}</p>
      <p><strong>Data:</strong> {new Date(localPedido.dataAtual).toLocaleDateString("pt-BR")}</p>
      <p><strong>Responsavel:</strong> {localPedido.responsavel}</p>

      <div className="d-flex gap-2">
        {isRunning ? (
          <button
            className="btn btn-outline-warning"
            onClick={pausarPedido}
            disabled={!isEmAndamento} // Só habilita "Pausar" se em andamento
          >
            Pausar
          </button>
        ) : (
          <button
            className="btn btn-outline-primary"
            onClick={iniciarPedido}
            disabled={!isPendente} // Só habilita "Iniciar" se pendente
          >
            Iniciar
          </button>
        )}
        <button
          className="btn btn-outline-success"
          onClick={reiniciarPedido}
          disabled={!isPausado} // Só habilita "Reiniciar" se pausado
        >
          Reiniciar
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={finalizarPedido}
          disabled={!isEmAndamento} // Só habilita "Finalizar" se em andamento
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}

export default CardPedido;
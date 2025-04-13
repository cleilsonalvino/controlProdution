import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000";

function Modal({ onClose }) {
  // Estado do pedido
  const [pedido, setPedido] = useState({
    codigo: 0,
    tipo: "",
    quantidade: 0,
    metragens: [],
    funcionarios: [],
  });

  // Estado para armazenar os funcionários
  const [funcionarios, setFuncionarios] = useState([]);

  // Buscar funcionários ao abrir o modal
  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const response = await fetch(`${API_BASE_URL}/funcionarios`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Erro ao buscar funcionários");

        const data = await response.json();
        setFuncionarios(data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      }
    }

    fetchFuncionarios();
  }, []);

  // Adicionar pedido
  const handleAdicionarPedido = async (pedido) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adicionar-pedido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new Error("Falha ao adicionar o pedido");

      const data = await response.json();
      console.log("Pedido adicionado:", data);
    } catch (error) {
      console.log("Erro ao salvar dados:", error);
    }
  };

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "funcionarios") {
      // Convertendo opções selecionadas para um array de números
      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
        parseInt(opt.value)
      );
      setPedido((prevPedido) => ({
        ...prevPedido,
        [name]: selectedOptions,
      }));
    } else {
      setPedido((prevPedido) => ({
        ...prevPedido,
        [name]: value,
      }));
    }
  };

  // Enviar o pedido e fechar o modal
  const handleSubmit = async () => {
    if (
      !pedido.codigo ||
      !pedido.tipo ||
      !pedido.quantidade ||
      pedido.funcionarios.length === 0 ||
      (pedido.tipo === "PAINEL" &&
        (!pedido.metragens ||
          pedido.metragens.length !== Number(pedido.quantidade) ||
          pedido.metragens.some((m) => m.includes("_") || m.trim() === ""))
      )
    ) {
      alert("Todos os campos devem ser preenchidos.");
      return;
    }
    

    await handleAdicionarPedido(pedido);
    onClose();
    window.location.reload();
  };

  return (
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Novo Pedido</h1>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="codigo">Código:</label>
                <input
                  type="number"
                  id="codigo"
                  name="codigo"
                  value={pedido.codigo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="tipo">Tipo do Pedido:</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={pedido.tipo}
                  onChange={(e) => {
                    const { value } = e.target;
                    setPedido((prev) => ({
                      ...prev,
                      tipo: value,
                      metragens: value === "PAINEL" ? prev.metragens : [],
                    }));
                  }}
                  className="form-control"
                >
                  <option value="">Selecione</option>
                  <option value="CAMISA">CAMISA</option>
                  
                  <option value="PAINEL">PAINEL</option>
                  <option value="LENÇOL">LENÇOL</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>

              {pedido.tipo === "CAMISA" && 
                  <div className="form-group mt-3 mb-3">
                    <label htmlFor="camisa">Tipo:</label>
                    <select name="" id="">
                      <option value="">Selecione</option>
                      <option value="TRADICIONAL">TRADICIONAL</option>
                      <option value="MANGA LONGA">MANGA LONGA</option>
                      <option value="REGATA">REGATA</option>
                      <option value="PARCIAL - FRENTE">PARCIAL - FRENTE</option>
                      <option value="PARCIAL - COSTA">PARCIAL - COSTA</option>
                      <option value="PARCIAL - MANGA">PARCIAL - MANGA</option>

                    </select>
                  </div>
                }

              {pedido.tipo === "LENÇOL" &&
                  <div className="form-group mt-3 mb-3">
                    <label htmlFor="lençol">Tipo:</label>
                    <select name="" id="">
                      <option value="">Selecione</option>
                      <option value="LENÇOL CASAL">LENÇOL CASAL</option>
                      <option value="LENÇOL SOLTEIRO">LENÇOL SOLTEIRO</option>
                      <option value="KIT CASAL">KIT CASAL</option>
                      <option value="KIT SOLTEIRO">KIT SOLTEIRO</option>
                      <option value="CONJUNTO DE COZINHA">CONJUNTO DE COZINHA</option>
                    </select>
                  </div>
                }

              {pedido.tipo === "OUTROS" &&
                  <div className="form-group mt-3 mb-3">
                    <label htmlFor="outros">Tipo:</label>
                    <select name="" id="">
                      <option value="">Selecione</option>
                      <option value="CONJUNTO DE COZINHA">CONJUNTO DE COZINHA</option>
                      <option value="TERCEIROS">TERCEIROS</option>
                    </select>
                  </div>
                }
                

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade:</label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={pedido.quantidade}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="responsavel">Responsáveis:</label>
                <select
                  name="funcionarios"
                  id="responsavel"
                  multiple // Permite múltipla seleção
                  value={pedido.funcionarios}
                  onChange={handleChange}
                  className="form-control"
                >
                  {funcionarios.map((funcionario) => (
                    <option key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome}
                    </option>
                  ))}
                </select>
              </div>
              {pedido.tipo === "PAINEL" && (
  <>
    <button
      type="button"
      className="btn btn-sm btn-secondary mb-2 mt-2"
      onClick={() => {
        const metragemPrincipal = pedido.metragens?.[0] || "";
        const novasMetragens = Array.from(
          { length: Number(pedido.quantidade) || 0 },
          () => metragemPrincipal
        );

        handleChange({
          target: {
            name: "metragens",
            value: novasMetragens,
          },
        });
      }}
    >
      Repetir a 1ª metragem para todos
    </button>

    {Array.from({ length: Number(pedido.quantidade) || 0 }).map(
      (_, index) => (
        <div key={index} className="form-group">
          <label htmlFor={`metragem-${index}`}>
            Metragem {index + 1}:
          </label>
          <input
            type="text"
            id={`metragem-${index}`}
            name={`metragem-${index}`}
            value={pedido.metragens?.[index] || ""}
            onChange={(e) => {
              let numeros = e.target.value
                .replace(/\D/g, "")
                .slice(0, 6);
              const preenchido = numeros.padEnd(6, "_");
              const formatado = `${preenchido[0]},${preenchido[1]}${preenchido[2]} x ${preenchido[3]},${preenchido[4]}${preenchido[5]}`;

              const novasMetragens = [...(pedido.metragens || [])];
              novasMetragens[index] = formatado;

              handleChange({
                target: {
                  name: "metragens",
                  value: novasMetragens,
                },
              });
            }}
            placeholder="_,__ x _,__"
            className="form-control"
            inputMode="numeric"
          />
        </div>
      )
    )}
  </>
)}


            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;

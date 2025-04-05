import React, { useState, useEffect } from 'react';

function Modal({ onClose }) {
  // Estado do pedido
  const [pedido, setPedido] = useState({
    codigo: 0,
    tipo: '',
    quantidade: 0,
    funcionarios: [], // Corrigido: Criado o campo para armazenar os IDs dos funcionários
  });

  // Estado para armazenar os funcionários
  const [funcionarios, setFuncionarios] = useState([]);

  // Buscar funcionários ao abrir o modal
  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        const response = await fetch('http://localhost:3000/funcionarios', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erro ao buscar funcionários');

        const data = await response.json();
        setFuncionarios(data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    }

    fetchFuncionarios();
  }, []);

  // Adicionar pedido
  const handleAdicionarPedido = async (pedido) => {
    try {
      const response = await fetch("http://localhost:3000/adicionar-pedido", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) throw new Error('Falha ao adicionar o pedido');

      const data = await response.json();
      console.log('Pedido adicionado:', data);
    } catch (error) {
      console.log("Erro ao salvar dados:", error);
    }
  };

  // Lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "funcionarios") {
      // Convertendo opções selecionadas para um array de números
      const selectedOptions = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
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
    if (!pedido.codigo || !pedido.tipo || !pedido.quantidade || pedido.funcionarios.length === 0) {
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
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
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
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Selecione</option>
                  <option value="CAMISA">CAMISA</option>
                  <option value="PAINEL">PAINEL</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Fechar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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

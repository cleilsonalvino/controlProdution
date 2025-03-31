import React, { useState } from 'react';

function Modal({ onClose, adicionarPedido }) {

  // Função para adicionar o pedido via API
  const handleAdicionarPedido = async (pedido) => {
    try {
      const response = await fetch("http://3.17.153.198:3000/adicionar-pedido", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedido),  // Garantir que o pedido seja convertido para JSON
      });

      if (!response.ok) {
        
        throw new Error('Falha ao adicionar o pedido');
      }
      
      // Aqui você pode manipular a resposta se necessário, por exemplo:
      const data = await response.json();
      console.log('Pedido adicionado:', data);
    } catch (error) {
      console.log(pedido)
      console.log("Erro ao salvar dados:", error);  // Corrigir o console.log
    }
  };

  const [pedido, setPedido] = useState({
    codigo: Number(0),
    tipo: '',
    quantidade: Number(0),
    responsavel: '',
  });

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido((prevPedido) => ({
      ...prevPedido,
      [name]: value,
    }));
  };

  // Função para enviar o pedido e fechar o modal
  const handleSubmit = async () => {
    if (!pedido.codigo || !pedido.tipo || !pedido.quantidade || !pedido.responsavel) {
      alert("Todos os campos devem ser preenchidos.");
      return;
    }

    await handleAdicionarPedido(pedido);  // Espera a requisição antes de fechar o modal
    onClose(); // Fecha o modal
    window.location.reload(); // Atualiza a página para refletir as mudanças
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
                onClick={onClose} // Fecha o modal
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
                <label htmlFor="responsavel">Responsável:</label>
                <input
                  type="text"
                  id="responsavel"
                  name="responsavel"
                  value={pedido.responsavel}
                  onChange={handleChange}
                  className="form-control"
                />
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

import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import "./index.css";

const API_BASE_URL = process.env.VITE_REACT_APP_API_BASE_URL;
 
function CardPedido({ pedido, onUpdatePedido }) {
  const [localPedido, setLocalPedido] = useState(pedido);
  const [editandoCampo, setEditandoCampo] = useState(null);
  const [formData, setFormData] = useState({
    codigo: pedido.codigo,
    tipo: pedido.tipo,
    quantidade: pedido.quantidade,
    observacoes: pedido.observacoes || "",
  });
  const [maquinarios, setMaquinarios] = useState([]);
  const [maquinarioSelecionado, setMaquinarioSelecionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalPedido(pedido);
    setFormData({
      codigo: pedido.codigo,
      tipo: pedido.tipo,
      quantidade: pedido.quantidade,
      observacoes: pedido.observacoes || "",
    });
  }, [pedido]);

  useEffect(() => {
    async function listarMaquinarios() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/maquinarios`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao listar maquinários");
        }
        const data = await response.json();
        setMaquinarios(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    listarMaquinarios();
  }, []);

  const fazerRequisicao = async (rota, metodo, corpo = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${rota}/${pedido.codigo}`, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: corpo ? JSON.stringify(corpo) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao ${rota.replace("-", " ")}`);
      }
      const data = await response.json();
      setLocalPedido(data);
      if (onUpdatePedido) onUpdatePedido(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarCampo = async (campo) => {
    if (!campo) return;
    try {
      const response = await fetch(`${API_BASE_URL}/atualizar-pedido/${pedido.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: formData[campo] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar campo");
      }

      const pedidoAtualizado = await response.json();
      setLocalPedido(pedidoAtualizado);
      if (onUpdatePedido) onUpdatePedido(pedidoAtualizado);
    } catch (error) {
      setError(error.message);
    } finally {
      setEditandoCampo(null);
    }
  };

  const confirmarMaquinarioEIniciar = async () => {
    const idMaquinario = Number(maquinarioSelecionado);
    if (!maquinarioSelecionado || isNaN(idMaquinario) || idMaquinario <= 0) {
      setError("Selecione um maquinário válido antes de iniciar o pedido.");
      return;
    }

    try {
      await fazerRequisicao("iniciar-pedido", "POST");
      const responseVinculacao = await fetch(`${API_BASE_URL}/vincular-maquinario/${pedido.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maquinarioId: idMaquinario }),
      });

      if (!responseVinculacao.ok) {
        const errorData = await responseVinculacao.json();
        throw new Error(errorData.error || "Erro ao vincular maquinário");
      }

      const pedidoAtualizado = await responseVinculacao.json();
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditableCampo = (campo, label, tipo = "text") => (
    <p>
      <strong>{label}:</strong>{" "}
      {editandoCampo === campo ? (
        <input
          type={tipo}
          value={formData[campo]}
          onChange={(e) => setFormData({ ...formData, [campo]: tipo === "number" ? Number(e.target.value) : e.target.value })}
          onBlur={() => atualizarCampo(campo)}
          autoFocus
          className="form-control d-inline-block w-auto"
        />
      ) : (
        <span style={{ cursor: "pointer" }} onClick={() => setEditandoCampo(campo)}>
          {formData[campo] || <em>Editar...</em>}
        </span>
      )}
    </p>
  );

  return (
    <div className="card boxPedido mt-4 mb-4 p-3">
      <div className="container d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-center">
          {editandoCampo === "codigo" ? (
            <input
              type="number"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: Number(e.target.value) })}
              onBlur={() => atualizarCampo("codigo")}
              autoFocus
              className="form-control d-inline-block w-auto"
            />
          ) : (
            <span style={{ cursor: "pointer" }} onClick={() => setEditandoCampo("codigo")}>
              Pedido #{formData.codigo}
            </span>
          )}
        </h3>
        <span className="text-warning">{localPedido.situacao}</span>
      </div>

      {renderEditableCampo("tipo", "Tipo")}
      {renderEditableCampo("quantidade", "Quantidade", "number")}

      <p><strong>Data:</strong> {new Date(localPedido.dataAtual).toLocaleDateString("pt-BR")}</p>
      <p><strong>Maquinário(s):</strong> 
        {localPedido.maquinarios?.length > 0 
          ? localPedido.maquinarios.map(m => m.maquinario.nome).join(", ") 
          : "Não vinculado"}
      </p>
      <p><strong>Funcionário(s):</strong> 
        {localPedido.funcionarios?.length > 0
          ? localPedido.funcionarios.map(f => f.nome).join(", ")  
          : "Não vinculado"}
      </p>

      {error && <div className="alert alert-danger mt-2">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-danger"
          onClick={() => fazerRequisicao("finalizar-pedido", "POST")}
          disabled={localPedido.situacao !== "Em andamento" || isLoading}
        >
          {isLoading ? "Carregando..." : "Finalizar"}
        </button>
        <button
          className="btn btn-outline-warning"
          onClick={() => fazerRequisicao("pausar-pedido", "POST")}
          disabled={localPedido.situacao !== "Em andamento" || isLoading}
        >
          {isLoading ? "Carregando..." : "Pausar"}
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => fazerRequisicao("reiniciar-pedido", "POST")}
          disabled={localPedido.situacao !== "Pausado" || isLoading}
        >
          {isLoading ? "Carregando..." : "Reiniciar"}
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowModal(true)}
          disabled={localPedido.situacao !== "Pendente" || isLoading}
        >
          {isLoading ? "Carregando..." : "Iniciar"}
        </button>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecionar Maquinário</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Escolha o maquinário para este pedido:</p>
                <select
                  className="form-select"
                  onChange={(e) => setMaquinarioSelecionado(e.target.value)}
                  value={maquinarioSelecionado}
                  disabled={isLoading}
                >
                  <option value="">Selecione um maquinário</option>
                  {maquinarios.map((maquinario) => (
                    <option key={maquinario.id} value={maquinario.id}>
                      {maquinario.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isLoading}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmarMaquinarioEIniciar} disabled={isLoading || !maquinarioSelecionado}>
                  {isLoading ? "Carregando..." : "Confirmar e Iniciar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CardPedido.propTypes = {
  pedido: PropTypes.shape({
    codigo: PropTypes.number.isRequired,
    situacao: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    quantidade: PropTypes.number.isRequired,
    dataAtual: PropTypes.string.isRequired,
    observacoes: PropTypes.string,
    maquinarios: PropTypes.array,
    funcionarios: PropTypes.array,
  }).isRequired,
  onUpdatePedido: PropTypes.func,
};

export default CardPedido;

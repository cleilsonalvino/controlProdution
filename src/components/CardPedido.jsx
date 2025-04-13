import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./index.css";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

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
  const [maquinarioSelecionado, setMaquinarioSelecionado] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditMaquinarioModal, setShowEditMaquinarioModal] = useState(false);
  const [maquinariosSelecionadosEdicao, setMaquinariosSelecionadosEdicao] =
    useState([]);

  const abrirModalEdicaoMaquinarios = () => {
    const selecionados =
      localPedido.maquinarios?.map(
        (m) => m.maquinarioId?.toString() || m.maquinario?.id?.toString()
      ) || [];
      setMaquinariosSelecionadosEdicao(selecionados);
    setShowEditMaquinariosModal(true);
  };

  const salvarMaquinariosEditados = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vincular-maquinario/${pedido.codigo}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            maquinarioIds: editMaquinariosSelecionados.map(Number),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar maquinários");
      }

      const pedidoAtualizado = await response.json();
      if (onUpdatePedido) onUpdatePedido(pedidoAtualizado);
      setShowEditMaquinariosModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

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

  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState(null);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const valor = e.target.value;
    setObservacao(valor);

    if (valor.length > 200) {
      setError("Máximo de 200 caracteres atingido.");
      return;
    } else {
      setError(null);
    }

    // Limpa o timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Define novo timeout de 500ms
    debounceRef.current = setTimeout(() => {
      enviarObservacao(valor);
    }, 500);
  };

  const enviarObservacao = async (valor) => {
    try {
      const response = await fetch(`${API_BASE_URL}/observacao-pedido/${pedido.codigo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ observacao: valor }),
      });

      if (!response.ok) throw new Error("Erro ao salvar observação");

      const resultado = await response.json();
      setStatus("Observação salva com sucesso!");
      console.log("Pedido atualizado:", resultado);
    } catch (err) {
      setStatus("Erro ao salvar observação.");
      console.error(err);
    }
  };
  
  const atualizarCampo = async (campo) => {
    if (!campo) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/atualizar-pedido/${pedido.codigo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [campo]: formData[campo] }),
        }
      );

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
    if (!maquinarioSelecionado || maquinarioSelecionado.length === 0) {
      setError("Selecione pelo menos um maquinário antes de iniciar o pedido.");
      return;
    }

    try {
      // Primeiro, inicia o pedido
      await fazerRequisicao("iniciar-pedido", "POST");

      // Depois, vincula todos os maquinários
      const responseVinculacao = await fetch(
        `${API_BASE_URL}/vincular-maquinario/${pedido.codigo}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            maquinarioIds: maquinarioSelecionado.map(Number),
          }),
        }
      );

      if (!responseVinculacao.ok) {
        const errorData = await responseVinculacao.json();
        throw new Error(errorData.error || "Erro ao vincular maquinário");
      }

      const pedidoAtualizado = await responseVinculacao.json();
      if (onUpdatePedido) onUpdatePedido(pedidoAtualizado);
      setShowModal(false);
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
          onChange={(e) =>
            setFormData({
              ...formData,
              [campo]:
                tipo === "number" ? Number(e.target.value) : e.target.value,
            })
          }
          onBlur={() => atualizarCampo(campo)}
          autoFocus
          className="form-control d-inline-block w-auto"
        />
      ) : (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setEditandoCampo(campo)}
        >
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
              onChange={(e) =>
                setFormData({ ...formData, codigo: Number(e.target.value) })
              }
              onBlur={() => atualizarCampo("codigo")}
              autoFocus
              className="form-control d-inline-block w-auto"
            />
          ) : (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setEditandoCampo("codigo")}
            >
              Pedido #{formData.codigo}
            </span>
          )}
        </h3>
        <span className="text-warning">{localPedido.situacao}</span>
      </div>

      {renderEditableCampo("tipo", "Tipo")}
      {renderEditableCampo("quantidade", "Quantidade", "number")}

      <p>
        <strong>Data:</strong>{" "}
        {new Date(localPedido.dataAtual).toLocaleDateString("pt-BR")}
      </p>
      <p>
        <strong>Maquinário(s):</strong>{" "}
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            setMaquinariosSelecionadosEdicao(
              localPedido.maquinarios?.map(
                (m) => m.maquinarioId || m.maquinario.id
              ) || []
            );
            setShowEditMaquinarioModal(true);
          }}
        >
          {localPedido.maquinarios?.length > 0
            ? localPedido.maquinarios.map((m) => m.maquinario.nome).join(", ")
            : "Não vinculado"}
        </span>
      </p>

      <p>
        <strong>Funcionário(s):</strong>
        {localPedido.funcionarios?.length > 0
          ? localPedido.funcionarios.map((f) => f.nome).join(", ")
          : "Não vinculado"}
      </p>
      <p>
        <input
          type="text"
          className="form-control"
          placeholder="Digite aqui as observações, se houver..."
          value={observacao}
          onChange={handleChange}
        />
      </p>
      {error && <small style={{ color: "red" }}>{error}</small>}
      {status && <small style={{ color: "green" }}>{status}</small>}

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
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecionar Maquinário</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <select
                className="form-select"
                multiple
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setMaquinarioSelecionado(selectedValues);
                }}
                value={maquinarioSelecionado}
                disabled={isLoading}
              >
                <option value="">Selecione um ou mais maquinários</option>
                {maquinarios.map((maquinario) => (
                  <option key={maquinario.id} value={maquinario.id}>
                    {maquinario.nome}
                  </option>
                ))}
              </select>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmarMaquinarioEIniciar}
                  disabled={isLoading || !maquinarioSelecionado}
                >
                  {isLoading ? "Carregando..." : "Confirmar e Iniciar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditMaquinarioModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Maquinários</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditMaquinarioModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {maquinarios.map((m) => (
                  <div key={m.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={m.id}
                      id={`maquinario-${m.id}`}
                      checked={maquinariosSelecionadosEdicao.includes(m.id)}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setMaquinariosSelecionadosEdicao((prev) =>
                          e.target.checked
                            ? [...prev, id]
                            : prev.filter((mid) => mid !== id)
                        );
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`maquinario-${m.id}`}
                    >
                      {m.nome}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditMaquinarioModal(false)}
                >
                  Cancelar
                </button>
                <button
  className="btn btn-success"
  disabled={isLoading}
  onClick={async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/editar-maquinarios/${pedido.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maquinarioIds: maquinariosSelecionadosEdicao }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao editar maquinários");
      }

      const pedidoAtualizado = await response.json(); // 👈 garante que você está recebendo o pedido atualizado
      setLocalPedido(pedidoAtualizado); // 👈 atualiza o estado local do pedido

      if (onUpdatePedido) {
        onUpdatePedido(pedidoAtualizado); // 👈 notifica o componente pai
        window.location.reload(); // 👈 recarrega a página para refletir as mudanças
      }

      setShowEditMaquinarioModal(false); // 👈 fecha o modal
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }}
>
  {isLoading ? "Salvando..." : "Salvar"}
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

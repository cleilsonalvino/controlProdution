import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

function EditarPedidoComFixIDs() {
  const { codigo: pedidoEditadoCodigo } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState({
    codigo: "",
    tipo: "",
    quantidade: 0,
    situacao: "",
    horaInicio: null,
    horaFinal: null,
    observacoes: "",
    tempoProduzindo: "",
    tempoTotal: "",
    funcionarios: [],
    maquinarios: [],
    pausas: [],
    tipoDetalhes: {
      lencol: null,
      metragens: [],
      camisa: [],
      outrosTipos: null,
    },
  });

  const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
  const [maquinariosDisponiveis, setMaquinariosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [funcResponse, maqResponse, pedidoResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/funcionarios`),
          fetch(`${API_BASE_URL}/maquinarios`),
          pedidoEditadoCodigo ? fetch(`${API_BASE_URL}/dados-pedido/${pedidoEditadoCodigo}`) : Promise.resolve(null)
        ]);

        if (!funcResponse.ok) throw new Error("Erro ao buscar funcionários");
        const funcData = await funcResponse.json();
        // Garantir que os IDs dos funcionários disponíveis sejam números
        setFuncionariosDisponiveis(funcData.map(f => ({ ...f, id: parseInt(f.id, 10) })));

        if (!maqResponse.ok) throw new Error("Erro ao buscar maquinários");
        const maqData = await maqResponse.json();
        // Garantir que os IDs dos maquinários disponíveis sejam números
        setMaquinariosDisponiveis(maqData.map(m => ({ ...m, id: parseInt(m.id, 10) })));

        if (pedidoResponse) {
          if (!pedidoResponse.ok) throw new Error("Erro ao buscar pedido");
          const data = await pedidoResponse.json();
          setPedido({
            codigo: data.codigo || "",
            tipo: data.tipo || "",
            quantidade: data.quantidade || 0,
            situacao: data.situacao || "",
            horaInicio: data.horaInicio ? new Date(data.horaInicio) : null,
            horaFinal: data.horaFinal ? new Date(data.horaFinal) : null,
            observacoes: data.observacoes || "",
            tempoProduzindo: data.tempoProduzindo || "",
            tempoTotal: data.tempoTotal || "",
            // Garantir que os IDs dos funcionários do pedido sejam números
            funcionarios: data.funcionarios ? data.funcionarios.map(f => ({ id: parseInt(f.id, 10) })) : [],
            // Garantir que os IDs dos maquinários do pedido sejam números
            maquinarios: data.maquinarios ? data.maquinarios.map(m => ({ id: parseInt(m.id, 10) })) : [],
            pausas: data.pausas ? data.pausas.map(p => ({ 
              id: p.id ? parseInt(p.id, 10) : undefined,
              horaPausa: p.horaPausa ? new Date(p.horaPausa) : null,
              horaRetorno: p.horaRetorno ? new Date(p.horaRetorno) : null 
            })) : [],
            tipoDetalhes: {
              lencol: data.tipoDetalhes?.lencol || null,
              metragens: (data.tipoDetalhes?.metragens || []).map(m => ({ ...m, id: m.id ? parseInt(m.id, 10) : undefined })),
              camisa: (data.tipoDetalhes?.camisa || []).map(c => ({ ...c, id: c.id ? parseInt(c.id, 10) : undefined })),
              outrosTipos: data.tipoDetalhes?.outrosTipos ? { ...data.tipoDetalhes.outrosTipos, id: data.tipoDetalhes.outrosTipos.id ? parseInt(data.tipoDetalhes.outrosTipos.id, 10) : undefined } : null,
            },
          });
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
      }
      setLoading(false);
    }

    fetchData();
  }, [pedidoEditadoCodigo]);

  const handleChange = (e) => {
    const { name, value, type: inputType } = e.target; // Renomeado type para inputType para evitar conflito
    const parsedValue = inputType === 'number' ? parseInt(value) : value;

    if (name.startsWith("tipoDetalhes.")) {
      const parts = name.split(".");
      const category = parts[1];
      
      setPedido(prevPedido => {
        const newTipoDetalhes = JSON.parse(JSON.stringify(prevPedido.tipoDetalhes));

        if (category === "metragens" || category === "camisa") {
          const index = parseInt(parts[2]);
          const field = parts[3];
          if (!newTipoDetalhes[category]) newTipoDetalhes[category] = [];
          if (!newTipoDetalhes[category][index]) newTipoDetalhes[category][index] = {};
          newTipoDetalhes[category][index][field] = parsedValue;
        } else if (category === "lencol" || category === "outrosTipos") {
          const field = parts[2];
          if (!newTipoDetalhes[category]) newTipoDetalhes[category] = {}; 
          newTipoDetalhes[category][field] = field.startsWith('quantidade') ? parseInt(parsedValue) || 0 : parsedValue;
        }
        return { ...prevPedido, tipoDetalhes: newTipoDetalhes };
      });
    } else if (name === "horaInicio" || name === "horaFinal") {
        setPedido(prevPedido => ({
            ...prevPedido,
            [name]: value ? new Date(value) : null,
        }));
    } else {
      setPedido(prevPedido => ({
        ...prevPedido,
        [name]: parsedValue,
      }));
    }
  };

  const handleMultiSelectChange = (collectionName, itemId) => {
    const numericItemId = parseInt(itemId, 10); // Garantir que o ID sendo manipulado é numérico
    setPedido(prevPedido => {
      const currentSelection = prevPedido[collectionName];
      const isSelected = currentSelection.some(item => item.id === numericItemId);
      let newSelection;
      if (isSelected) {
        newSelection = currentSelection.filter(item => item.id !== numericItemId);
      } else {
        newSelection = [...currentSelection, { id: numericItemId }];
      }
      return { ...prevPedido, [collectionName]: newSelection };
    });
  };

const handlePausaChange = (index, field, value) => {
  const updatedPausas = pedido.pausas.map((pausa, i) => {
    if (i === index) {
      const dataLocal = new Date(value);
      // Corrige para o horário local
      const dataAjustada = new Date(dataLocal.getTime() - (3 * 60 * 60 * 1000));
      return { ...pausa, [field]: dataAjustada };
    }
    return pausa;
  });

  setPedido(prevPedido => ({ ...prevPedido, pausas: updatedPausas }));
};

  const handleAdicionarPausa = () => {
    setPedido(prevPedido => ({ ...prevPedido, pausas: [...prevPedido.pausas, { horaPausa: null, horaRetorno: null }] }));
  };

  const handleRemoverPausa = (index) => {
    setPedido(prevPedido => ({ ...prevPedido, pausas: prevPedido.pausas.filter((_, i) => i !== index) }));
  };

  const handleAddMetragem = () => {
    setPedido(prev => ({
        ...prev,
        tipoDetalhes: {
            ...prev.tipoDetalhes,
            metragens: [...(prev.tipoDetalhes.metragens || []), { valor: "" }]
        }
    }));
  };
  const handleRemoveMetragem = (index) => {
    setPedido(prev => ({
        ...prev,
        tipoDetalhes: {
            ...prev.tipoDetalhes,
            metragens: (prev.tipoDetalhes.metragens || []).filter((_, i) => i !== index)
        }
    }));
  };

  const handleAddCamisa = () => {
    setPedido(prev => ({
        ...prev,
        tipoDetalhes: {
            ...prev.tipoDetalhes,
            camisa: [...(prev.tipoDetalhes.camisa || []), { tipo: "" }]
        }
    }));
  };
  const handleRemoveCamisa = (index) => {
    setPedido(prev => ({
        ...prev,
        tipoDetalhes: {
            ...prev.tipoDetalhes,
            camisa: (prev.tipoDetalhes.camisa || []).filter((_, i) => i !== index)
        }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = { ...pedido };
    if (payload.tipo !== "LENÇOL" || !payload.tipoDetalhes.lencol || Object.keys(payload.tipoDetalhes.lencol).length === 0) {
        payload.tipoDetalhes.lencol = null;
    }
    if (payload.tipo !== "PAINEL" && payload.tipo !== "OUTROS") { // Ajuste para permitir metragens em OUTROS se necessário
        if (!payload.tipoDetalhes.metragens || payload.tipoDetalhes.metragens.length === 0) {
            payload.tipoDetalhes.metragens = [];
        }
    }
    if (payload.tipo !== "CAMISA") {
        if (!payload.tipoDetalhes.camisa || payload.tipoDetalhes.camisa.length === 0) {
            payload.tipoDetalhes.camisa = [];
        }
    }
    if (payload.tipo !== "OUTROS" || !payload.tipoDetalhes.outrosTipos || Object.keys(payload.tipoDetalhes.outrosTipos).length === 0) {
        payload.tipoDetalhes.outrosTipos = null;
    }
    
    const finalPayload = {
        ...payload,
        horaInicio: payload.horaInicio ? payload.horaInicio.toISOString() : null,
        horaFinal: payload.horaFinal ? payload.horaFinal.toISOString() : null,
        pausas: payload.pausas.map(p => ({
            id: p.id, // Enviar ID da pausa se existir
            horaPausa: p.horaPausa ? new Date(p.horaPausa).toISOString() : null,
            horaRetorno: p.horaRetorno ? new Date(p.horaRetorno).toISOString() : null,
        })),
        tipoDetalhes: {
            lencol: payload.tipoDetalhes.lencol,
            metragens: payload.tipoDetalhes.metragens.map(m => ({ valor: m.valor })),
            camisa: payload.tipoDetalhes.camisa.map(c => ({ tipo: c.tipo })),
            outrosTipos: payload.tipoDetalhes.outrosTipos,
        }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/editar-pedido/${pedido.codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao editar o pedido:", errorData);
        throw new Error(errorData.message || "Erro ao editar o pedido");
      }

      const data = await response.json();
      console.log("Pedido editado com sucesso:", data);
      alert("Pedido editado com sucesso!");
      navigate(`/administrador/estamparia`);
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      setError(err.message || "Falha ao salvar dados. Verifique o console para mais detalhes.");
      alert(`Erro ao salvar: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando dados do pedido...</p>;

  return (
    <div className="container">
      <h1>Editar Pedido {pedido.codigo ? `(${pedido.codigo})` : ''}</h1>
      {error && <p style={{color: 'red'}}>Erro: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código:</label>
          <input type="text" name="codigo" value={pedido.codigo} readOnly />
        </div>

        <div className="form-group">
          <label>Tipo do Pedido:</label>
          <select name="tipo" value={pedido.tipo} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="CAMISA">CAMISA</option>
            <option value="PAINEL">PAINEL (Usa Metragens)</option>
            <option value="LENÇOL">LENÇOL</option>
            <option value="OUTROS">OUTROS</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantidade:</label>
          <input type="number" name="quantidade" value={pedido.quantidade} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Situação:</label>
          <select name="situacao" value={pedido.situacao} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Pendente">Pendente</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hora de Início:</label>
          <input type="datetime-local" name="horaInicio" value={pedido.horaInicio ? new Date(pedido.horaInicio).toISOString().slice(0, 16) : ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Hora Final:</label>
          <input type="datetime-local" name="horaFinal" value={pedido.horaFinal ? new Date(pedido.horaFinal).toISOString().slice(0, 16) : ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Observações:</label>
          <textarea name="observacoes" value={pedido.observacoes || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Tempo Produzindo:</label>
          <input type="text" name="tempoProduzindo" value={pedido.tempoProduzindo || ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Tempo Total:</label>
          <input type="text" name="tempoTotal" value={pedido.tempoTotal || ""} onChange={handleChange} />
        </div>

        {pedido.tipo === "CAMISA" && (
          <div className="form-group">
            <h3>Detalhes da Camisa</h3>
            {(pedido.tipoDetalhes.camisa || []).map((cam, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                <label>Tipo de Camisa #{index + 1}:</label>
                <select
                  name={`tipoDetalhes.camisa.${index}.tipo`}
                  value={cam.tipo || ""}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="TRADICIONAL">TRADICIONAL</option>
                  <option value="MANGA LONGA">MANGA LONGA</option>
                  <option value="KIT UNIFORME">KIT UNIFORME</option>
                  <option value="REGATA">REGATA</option>
                  <option value="PARCIAL - FRENTE">PARCIAL - FRENTE</option>
                  <option value="PARCIAL - COSTA">PARCIAL - COSTA</option>
                  <option value="PARCIAL - MANGA">PARCIAL - MANGA</option>
                </select>
                <button type="button" onClick={() => handleRemoveCamisa(index)} style={{ marginLeft: '10px' }}>Remover Camisa</button>
              </div>
            ))}
            <button type="button" onClick={handleAddCamisa}>Adicionar Tipo de Camisa</button>
          </div>
        )}

        {pedido.tipo === "LENÇOL" && (
          <div className="form-group">
            <h3>Detalhes do Lençol</h3>
            {!pedido.tipoDetalhes.lencol && <button type="button" onClick={() => setPedido(p => ({...p, tipoDetalhes: {...p.tipoDetalhes, lencol: { tipo: '', quantidadeLencol: 0, quantidadeFronha: 0}}}))}>Adicionar Detalhes Lençol</button>}
            {pedido.tipoDetalhes.lencol && (
            <>
                <div>
                <label>Tipo de Lençol:</label>
                <select name="tipoDetalhes.lencol.tipo" value={pedido.tipoDetalhes.lencol.tipo || ""} onChange={handleChange}>
                    <option value="">Selecione</option>
                    <option value="LENÇOL CASAL">LENÇOL CASAL/COUCHA</option>
                    <option value="LENÇOL SOLTEIRO">LENÇOL SOLTEIRO</option>
                    <option value="KIT CASAL">KIT CASAL</option>
                    <option value="KIT SOLTEIRO">KIT SOLTEIRO</option>
                </select>
                </div>
                <div>
                <label>Quantidade Lençol:</label>
                <input type="number" name="tipoDetalhes.lencol.quantidadeLencol" value={pedido.tipoDetalhes.lencol.quantidadeLencol || 0} onChange={handleChange} />
                </div>
                <div>
                <label>Quantidade Fronha:</label>
                <input type="number" name="tipoDetalhes.lencol.quantidadeFronha" value={pedido.tipoDetalhes.lencol.quantidadeFronha || 0} onChange={handleChange} />
                </div>
                <div>
                <label>Quantidade Cortina (Opcional):</label>
                <input type="number" name="tipoDetalhes.lencol.quantidadeCortina" value={pedido.tipoDetalhes.lencol.quantidadeCortina || ""} onChange={handleChange} />
                </div>
            </>
            )}
          </div>
        )}

        {(pedido.tipo === "PAINEL" || pedido.tipo === "OUTROS") && ( // Permitir metragens para PAINEL e OUTROS
            <div className="form-group">
                <h3>Metragens</h3>
                {(pedido.tipoDetalhes.metragens || []).map((metragem, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', border: '1px solid #eee', padding: '10px' }}>
                        <label style={{ marginRight: '5px' }}>Metragem #{index + 1}:</label>
                        <input
                            type="text"
                            name={`tipoDetalhes.metragens.${index}.valor`}
                            value={metragem.valor || ""}
                            onChange={handleChange}
                            placeholder="Ex: 1.50x2.00"
                        />
                        <button type="button" onClick={() => handleRemoveMetragem(index)} style={{ marginLeft: '10px' }}>Remover</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddMetragem}>Adicionar Metragem</button>
            </div>
        )}

        {pedido.tipo === "OUTROS" && (
          <div className="form-group">
            <h3>Detalhes de Outros Tipos</h3>
            {!pedido.tipoDetalhes.outrosTipos && <button type="button" onClick={() => setPedido(p => ({...p, tipoDetalhes: {...p.tipoDetalhes, outrosTipos: { tipo: ''}}}))}>Adicionar Detalhes Outros</button>}
            {pedido.tipoDetalhes.outrosTipos && (
            <>
                <label>Descrição do Tipo:</label>
                <input
                type="text"
                name="tipoDetalhes.outrosTipos.tipo"
                value={pedido.tipoDetalhes.outrosTipos.tipo || ""}
                onChange={handleChange}
                />
            </>
            )}
          </div>
        )}

        <div className="form-group">
          <label>Funcionários:</label>
          <div>
            {(funcionariosDisponiveis || []).map((funcionario) => (
              <div key={funcionario.id}>
                <input
                  type="checkbox"
                  id={`func-${funcionario.id}`}
                  value={funcionario.id} // value é importante para forms tradicionais, mas aqui o checked é o principal
                  checked={(pedido.funcionarios || []).some(f => f.id === funcionario.id)}
                  onChange={() => handleMultiSelectChange('funcionarios', funcionario.id)}
                />
                <label htmlFor={`func-${funcionario.id}`}>{funcionario.nome}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Maquinários:</label>
          <div>
            {(maquinariosDisponiveis || []).map((maquinario) => (
              <div key={maquinario.id}>
                <input
                  type="checkbox"
                  id={`maq-${maquinario.id}`}
                  value={maquinario.id}
                  checked={(pedido.maquinarios || []).some(m => m.id === maquinario.id)}
                  onChange={() => handleMultiSelectChange('maquinarios', maquinario.id)}
                />
                <label htmlFor={`maq-${maquinario.id}`}>{maquinario.nome}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Pausas:</label>
          {(pedido.pausas || []).map((pausa, index) => (
            <div key={pausa.id || index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <div>
                <label>Hora da Pausa:</label>
                <input
                  type="datetime-local"
                  value={pausa.horaPausa ? new Date(pausa.horaPausa).toISOString().slice(0, 16) : ""}
                  onChange={(e) => handlePausaChange(index, 'horaPausa', e.target.value)}
                />
              </div>
              <div>
                <label>Hora de Retorno:</label>
                <input
                  type="datetime-local"
                  value={pausa.horaRetorno ? new Date(pausa.horaRetorno).toISOString().slice(0, 16) : ""}
                  onChange={(e) => handlePausaChange(index, 'horaRetorno', e.target.value)}
                />
              </div>
              <button type="button" onClick={() => handleRemoverPausa(index)}>Remover Pausa</button>
            </div>
          ))}
          <button type="button" onClick={handleAdicionarPausa}>Adicionar Pausa</button>
        </div>

        <button type="submit" disabled={loading}>Salvar Pedido</button>
      </form>
    </div>
  );
}

export default EditarPedidoComFixIDs;


import React, { useState } from 'react';
import Modal from './Modal';
import FiltroPedidos from './FiltroPedidos';

function NovoPedido({ adicionarPedido, filtroCodigo, setFiltroCodigo }) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="d-flex row-nowrap">
      <button className="btn btn-outline-primary" onClick={() => setModalAberto(true)}>
        Novo
      </button>



      {modalAberto && (
        <Modal 
          onClose={() => setModalAberto(false)} 
          adicionarPedido={adicionarPedido} 
        />
      )}
    </div>
  );
}

export default NovoPedido;

import React, { useState } from 'react';
import Modal from './Modal';

function NovoPedido({ adicionarPedido }) {
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

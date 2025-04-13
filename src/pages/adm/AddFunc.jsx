import React, { useRef, useState } from 'react';
import Modal from 'react-modal';

const API_BASE_URL = process.env.VITE_REACT_APP_API_BASE_URL;

Modal.setAppElement('#root');

function AddFunc() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nomeRef = useRef();
    const setorRef = useRef();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    async function adicionarFuncionario(event) {
        event.preventDefault();

        const nome = nomeRef.current.value;
        const setor = setorRef.current.value;

        const response = await fetch(`${API_BASE_URL}/adicionar-funcionario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, setor }),
        });

        if (response.ok) {
            alert('Funcionário adicionado com sucesso!');
            setIsModalOpen(false);
        } else {
            alert('Erro ao adicionar funcionário');
        }
    }

    return (
        <div>
            <button onClick={handleOpenModal} style={styles.button}>
                Novo Funcionário
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={customStyles}
                contentLabel="Adicionar Funcionário"
            >
                <div>
                    <button onClick={handleCloseModal} style={styles.closeButton}>
                        &times;
                    </button>
                    <p>Adicionar funcionário</p>
                    <form onSubmit={adicionarFuncionario} className='p-4'>
                        <label className='mb-4'>Nome:</label>
                        <input type="text" ref={nomeRef} required />
                        <br />
                        <label>Setor:</label>
                        <select ref={setorRef} required>
                            <option value="">Selecione um setor</option>
                            <option value="cortedetecido">Corte de Tecido</option>
                            <option value="impressao">Impressão</option>
                            <option value="cortedepapel">Corte de Papel</option>
                            <option value="sublimacao">Sublimação</option>
                            <option value="costura">Costura</option>
                            <option value="embalagem">Embalagem</option>
                        </select>
                        <br />
                        <button type="submit" className='mt-3 btn btn-primary'>Adicionar</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

const styles = {
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        float: 'right',
    },
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

export default AddFunc;

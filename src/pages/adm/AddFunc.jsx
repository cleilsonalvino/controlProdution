import React from 'react';
import Modal from 'react-modal';

// Configuração de acessibilidade para o react-modal
Modal.setAppElement('#root');

function AddFunc() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    async function adicioanrFuncionario() {
        const response = await fetch('http://localhost:3000/adicionar-funcionario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: document.getElementById('nome').value,
                setor: document.getElementById('setor').value,
            }),
        });
    }

    return (
        <div>
            <button onClick={handleOpenModal} style={styles.button}>
                Novo Funcionario
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={customStyles}
                contentLabel="Exemplo de Modal"
            >
                <div>
                    <button onClick={handleCloseModal} style={styles.closeButton}>
                        &times;
                    </button>
                    <p>Adicionar funcionario</p>
                    <form onSubmit={adicioanrFuncionario} className='p-4'>
                        <label htmlFor="nome" className='mb-4'>Nome:</label>
                        <input type="text" id="nome" name="nome" required />
                        <br />
                        <label htmlFor="setor">Setor:</label>
                        <select name="" id="setor" required>
                            <option value="">Selecione um setor</option>
                            <option value="cortedetecido">Corte de Tecido</option>
                            <option value="impressao">Impressao</option>
                            <option value="cortedepapel">Corte de Papel</option>
                            <option value="sublimacao">Sublimação</option>
                            <option value="costura">Costura</option>
                            <option value="embalagem">Embalagem</option>
                        </select>
                        <br />
                        <button type="submit" className='mt-3 btn btn-primary' onClick={adicioanrFuncionario}>Adicionar</button>
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
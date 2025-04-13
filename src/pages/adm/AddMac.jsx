import React, { useState } from 'react';
import Modal from 'react-modal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Configuração de acessibilidade para o react-modal
Modal.setAppElement('#root');

function AddMaquinario() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    function handleInputChange(event) {
        setNome(event.target.value);
    }

    async function adicionarMaquinario(event) {
        event.preventDefault();

        if (!nome.trim()) {
            alert("O nome do maquinário é obrigatório!");
            return;
        }

        setIsLoading(true);
        console.log("Enviando:", { nome }); // 🔥 Depuração

        try {
            const response = await fetch(`${API_BASE_URL}/adicionar-maquinario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome }),
            });

            const data = await response.json();
            console.log("Resposta do servidor:", data); // 🚀 Depuração

            if (!response.ok) throw new Error(data.error || 'Erro ao adicionar maquinário.');

            alert('Maquinário adicionado com sucesso!');
            setIsModalOpen(false);
            setNome(""); // Limpa o campo
        } catch (error) {
            console.error("Erro ao adicionar maquinário:", error);
            alert(`Erro: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button onClick={handleOpenModal} style={styles.button}>
                Novo Maquinário
            </button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={customStyles}
                contentLabel="Adicionar Maquinário"
            >
                <div>
                    <button onClick={handleCloseModal} style={styles.closeButton}>
                        &times;
                    </button>
                    <p>Adicionar Maquinário</p>
                    <form onSubmit={adicionarMaquinario} className='p-4'>
                        <label htmlFor="nome" className='mb-4'>Nome:</label>
                        <input type="text" id="nome" name="nome" required value={nome} onChange={handleInputChange} />
                        <br />
                        <button type="submit" className='mt-3 btn btn-primary' disabled={isLoading}>
                            {isLoading ? "Adicionando..." : "Adicionar"}
                        </button>
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

export default AddMaquinario;

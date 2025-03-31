import React, { useEffect, useState } from 'react';
import './Administrador.css'; // Importando o arquivo CSS

function Administrador() {
    const [tabelaPedidos, setTabelaPedidos] = useState([]);

    useEffect(() => {
        async function fetchTabelaPedidos() {
            try {
                const response = await fetch('http://3.17.153.198:3000/tabela-pedidos');
                if (!response.ok) {
                    throw new Error('Erro ao buscar a tabela de pedidos');
                }
                const data = await response.json();
                setTabelaPedidos(data);
            } catch (error) {
                console.error('Erro ao buscar a tabela de pedidos:', error);
            }
        }

        fetchTabelaPedidos();
    }, []);

    return (
        <div className="tabela-container">
            <a href="/funcionario">Funcionario</a>
            <table className="tabela-pedidos">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Data Atual</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Responsável</th>
                        <th>Situação</th>
                        <th>Hora Início</th>
                        <th>Hora Pausa</th>
                        <th>Hora Reinício</th>
                        <th>Hora Final</th>
                        <th>Observações</th>
                        <th>Tempo Produzindo</th>
                        <th>Tempo Total</th>
                    </tr>
                </thead>
                <tbody>
                    {tabelaPedidos.map((pedido) => (
                        <tr key={pedido.codigo}>
                            <td>{pedido.codigo}</td>
                            <td>{new Date(pedido.dataAtual).toLocaleString()}</td>
                            <td>{pedido.tipo}</td>
                            <td>{pedido.quantidade}</td>
                            <td>{pedido.responsavel}</td>
                            <td>{pedido.situacao}</td>
                            <td>{pedido.horaInicio ? new Date(pedido.horaInicio).toLocaleString() : '-'}</td>
                            <td>{pedido.horaPausa ? new Date(pedido.horaPausa).toLocaleString() : '-'}</td>
                            <td>{pedido.horaReinicio ? new Date(pedido.horaReinicio).toLocaleString() : '-'}</td>
                            <td>{pedido.horaFinal ? new Date(pedido.horaFinal).toLocaleString() : '-'}</td>
                            <td>{pedido.observacoes || '-'}</td>
                            <td>{pedido.tempoProduzindo ? new Date(pedido.tempoProduzindo).toLocaleString() : '-'}</td>
                            <td>{pedido.tempoTotal ? new Date(pedido.tempoTotal).toLocaleString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Administrador;
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FiDownload } from "react-icons/fi"; // Importe o ícone

const GraficoCrescimentoProducao = forwardRef(({ pedidos }, ref) => {
    const [dataSelecionadaGrafico, setDataSelecionadaGrafico] = useState(() => {
        const hoje = new Date();
        return hoje.toISOString().slice(0, 7); // AAAA-MM
    });
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
    const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
    const [subtiposUnicos, setSubtiposUnicos] = useState([]);
    const [producaoPorDia, setProducaoPorDia] = useState([]);
    const tiposPrincipais = ["Todos", "CAMISA", "LENÇOL", "PAINEL", "OUTROS"];
    const graficoRef = useRef(null);

    useImperativeHandle(ref, () => ({
        graficoRef: graficoRef,
        dataSelecionadaGrafico: dataSelecionadaGrafico,
        tipoSelecionado: tipoSelecionado,
        subtipoSelecionado: subtipoSelecionado,
        producaoPorDia: producaoPorDia,
    }));

    useEffect(() => {
        const extrairSubtipos = (tipo) => {
            const subtipos = new Set();
            pedidos.forEach((pedido) => {
                if (pedido.tipo === tipo && pedido.tipoDetalhes) {
                    if (tipo === "CAMISA" && pedido.tipoDetalhes.camisa) {
                        pedido.tipoDetalhes.camisa.forEach(
                            (camisa) => camisa.tipo && subtipos.add(camisa.tipo)
                        );
                    } else if (tipo === "LENÇOL" && pedido.tipoDetalhes.lencol?.tipo) {
                        subtipos.add(pedido.tipoDetalhes.lencol.tipo);
                    } else if (tipo === "OUTROS" && pedido.tipoDetalhes.outrosTipos) {
                        pedido.tipoDetalhes.outrosTipos.forEach(
                            (outroTipo) => outroTipo.tipo && subtipos.add(outroTipo.tipo)
                        );
                    }
                }
            });
            return ["Todos", ...Array.from(subtipos).sort()];
        };

        setSubtiposUnicos(extrairSubtipos(tipoSelecionado));
    }, [pedidos, tipoSelecionado]);

    useEffect(() => {
        const producaoDiaria = {};
        const [anoSelecionado, mesSelecionado] = dataSelecionadaGrafico.split('-');
        const primeiroDiaDoMes = new Date(Date.UTC(parseInt(anoSelecionado), parseInt(mesSelecionado) - 1, 1, 0, 0, 0) - 3 * 60 * 60 * 1000);
        const ultimoDiaDoMes = new Date(Date.UTC(parseInt(anoSelecionado), parseInt(mesSelecionado), 0, 23, 59, 59) - 3 * 60 * 60 * 1000);

        pedidos.forEach((pedido) => {
            if (pedido.situacao === "Finalizado" && pedido.horaFinal) {
                const dataFinalPedido = new Date(pedido.horaFinal);

                const dentroDoMes =
                    dataFinalPedido >= primeiroDiaDoMes && dataFinalPedido <= ultimoDiaDoMes;

                if (dentroDoMes) {
                    const dia = dataFinalPedido.getUTCDate();
                    let subtipoPedido = "";
                    if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
                        subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
                    } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
                        subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
                    } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
                        subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
                    }

                    if (
                        (tipoSelecionado === "Todos" || pedido.tipo === tipoSelecionado) &&
                        (subtipoSelecionado === "Todos" || subtipoPedido === subtipoSelecionado)
                    ) {
                        if (producaoDiaria[dia]) {
                            producaoDiaria[dia] += pedido.quantidade;
                        } else {
                            producaoDiaria[dia] = pedido.quantidade;
                        }
                    }
                }
            }
        });

        const dadosDia = Object.keys(producaoDiaria)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((dia) => ({
                dia: parseInt(dia),
                quantidade: producaoDiaria[dia] || 0,
            }));

        setProducaoPorDia(dadosDia);
    }, [pedidos, dataSelecionadaGrafico, tipoSelecionado, subtipoSelecionado]);

    const handleChangeMes = (e) => {
        setDataSelecionadaGrafico(e.target.value);
    };

    const gerarPDF = async () => {
        const chartElement = graficoRef.current;
        if (!chartElement) return;

        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');

        const doc = new jsPDF('p', 'pt', 'a4'); // Mantendo a orientação paisagem, ajuste se necessário
        const titulo = `Relatório de Crescimento da Produção - ${dataSelecionadaGrafico}`;
        const tipo = tipoSelecionado !== "Todos" ? `Tipo: ${tipoSelecionado}` : "Todos os Tipos";
        const subtipo = tipoSelecionado !== "Todos" && subtipoSelecionado !== "Todos" ? ` | Subtipo: ${subtipoSelecionado}` : "";

        // Calcular a quantidade total
        const totalQuantidade = producaoPorDia.reduce((acc, item) => acc + item.quantidade, 0);

        // Adicionar texto
        doc.setFontSize(16);
        doc.text(titulo, 14, 20);

        doc.setFontSize(12);
        doc.text(`${tipo}${subtipo}`, 14, 36);
        doc.text(`Quantidade total: ${totalQuantidade}`, 14, 52);

        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Ajustar a posição da imagem para baixo (aumentei o valor de Y)
        doc.addImage(imgData, 'PNG', 14, 70, imgWidth, imgHeight);
        doc.save(`crescimento_producao_${dataSelecionadaGrafico}.pdf`);
    };

    return (
        <div>
            <h4 className="text-center mb-3">
                Crescimento da Produção Mensal
            </h4>
            <div className="row justify-content-center mb-3">
                <div className="col-md-3">
                    <label className="form-label me-2">Mês e Ano:</label>
                    <input
                        type="month"
                        className="form-control me-2"
                        value={dataSelecionadaGrafico}
                        onChange={handleChangeMes}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label me-2">Tipo:</label>
                    <select
                        className="form-select me-2"
                        value={tipoSelecionado}
                        onChange={(e) => setTipoSelecionado(e.target.value)}
                    >
                        {tiposPrincipais.map((tipo, index) => (
                            <option key={index} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label me-2">Subtipo:</label>
                    <select
                        className="form-select"
                        value={subtipoSelecionado}
                        onChange={(e) => setSubtipoSelecionado(e.target.value)}
                        disabled={tipoSelecionado === "Todos"}
                    >
                        {subtiposUnicos.map((subtipo, index) => (
                            <option key={index} value={subtipo}>
                                {subtipo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-danger w-100 mt-3" onClick={gerarPDF}>
                        <FiDownload className="me-2" size={20} />
                        Gerar PDF
                    </button>
                </div>
            </div>
            <div style={{color: '#004E89', } } >
                <ResponsiveContainer width="100%" height={300} ref={graficoRef}>
                    <LineChart data={producaoPorDia} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" style={{ fill: '#E2EF70' }} />
                        <YAxis style={{ fill: '#E2EF70' }}/>
                        <Tooltip style={{ fill: '#004E89' }}/>
                        <Line type="monotone" dataKey="quantidade" stroke="#E2EF70" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default GraficoCrescimentoProducao;
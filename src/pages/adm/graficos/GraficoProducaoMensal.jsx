import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload } from "react-icons/fi";

const GraficoProducaoMensal = forwardRef(({ pedidos }, ref) => {
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
    const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
    const [subtipoSelecionado, setSubtipoSelecionado] = useState("Todos");
    const [subtiposUnicos, setSubtiposUnicos] = useState([]);
    const [producaoMensal, setProducaoMensal] = useState([]);
    const tiposPrincipais = ["Todos", "CAMISA", "LENÇOL", "PAINEL", "OUTROS"];
    const chartRef = useRef(null);

    useImperativeHandle(ref, () => ({
        chartRef: chartRef,
        anoSelecionado: anoSelecionado,
        tipoSelecionado: tipoSelecionado,
        subtipoSelecionado: subtipoSelecionado,
        producaoMensal: producaoMensal,
    }));

    useEffect(() => {
        const extrairSubtipos = (tipo) => {
            const subtipos = new Set();
            pedidos.forEach(pedido => {
                if (pedido.tipo === tipo && pedido.tipoDetalhes) {
                    if (tipo === "CAMISA" && pedido.tipoDetalhes.camisa) {
                        pedido.tipoDetalhes.camisa.forEach(camisa => camisa.tipo && subtipos.add(camisa.tipo));
                    } else if (tipo === "LENÇOL" && pedido.tipoDetalhes.lencol?.tipo) {
                        subtipos.add(pedido.tipoDetalhes.lencol.tipo);
                    } else if (tipo === "OUTROS" && pedido.tipoDetalhes.outrosTipos) {
                        pedido.tipoDetalhes.outrosTipos.forEach(outroTipo => outroTipo.tipo && subtipos.add(outroTipo.tipo));
                    }
                }
            });
            return ["Todos", ...Array.from(subtipos).sort()];
        };

        setSubtiposUnicos(extrairSubtipos(tipoSelecionado));
    }, [pedidos, tipoSelecionado]);

    useEffect(() => {
        const meses = Array(12).fill(0);
        pedidos.forEach((pedido) => {
            const data = new Date(pedido.dataAtual);
            const anoPedido = data.getFullYear();
            const mes = data.getMonth();

            let subtipoPedido = "";
            if (pedido.tipo === "CAMISA" && pedido.tipoDetalhes?.camisa?.length > 0) {
                subtipoPedido = pedido.tipoDetalhes.camisa[0]?.tipo;
            } else if (pedido.tipo === "LENÇOL" && pedido.tipoDetalhes?.lencol?.tipo) {
                subtipoPedido = pedido.tipoDetalhes.lencol.tipo;
            } else if (pedido.tipo === "OUTROS" && pedido.tipoDetalhes?.outrosTipos?.length > 0) {
                subtipoPedido = pedido.tipoDetalhes.outrosTipos[0]?.tipo;
            }

            if (
                anoPedido === parseInt(anoSelecionado) &&
                (tipoSelecionado === "Todos" || pedido.tipo === tipoSelecionado) &&
                (subtipoSelecionado === "Todos" || subtipoPedido === subtipoSelecionado)
            ) {
                meses[mes] += pedido.quantidade;
            }
        });
        const dadosMensais = meses.map((quantidade, index) => ({
            mes: `${(index + 1).toString().padStart(2, "0")}`,
            quantidade
        }));
        setProducaoMensal(dadosMensais);
    }, [pedidos, anoSelecionado, tipoSelecionado, subtipoSelecionado]);

    const exportarPDF = async () => {
        const chartElement = chartRef.current;
        if (!chartElement) return;

        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF("p", "mm", "a4");
        const titulo = `Relatório de Produção Mensal - ${anoSelecionado}`;
        const tipo = tipoSelecionado !== "Todos" ? `Tipo: ${tipoSelecionado}` : "Todos os Tipos";
        const subtipo = tipoSelecionado !== "Todos" && subtipoSelecionado !== "Todos" ? ` | Subtipo: ${subtipoSelecionado}` : "";

        const totalQuantidade = producaoMensal.reduce((acc, item) => acc + item.quantidade, 0);

        doc.setFontSize(16);
        doc.text(titulo, 14, 20);

        doc.setFontSize(12);
        doc.text(`${tipo}${subtipo}`, 14, 28);
        doc.text(`Quantidade total: ${totalQuantidade}`, 14, 36);

        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 14, 42, imgWidth, imgHeight);
        doc.save(`producao_mensal_${anoSelecionado}.pdf`);
    };


    return (
        <div>
            <h4 className="text-center mb-3">Produção por Mês no Ano</h4>

            <div className="row justify-content-center mb-3">
                <div className="col-md-3">
                    <label className="form-label">Ano:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={anoSelecionado}
                        onChange={(e) => setAnoSelecionado(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Tipo:</label>
                    <select
                        className="form-select"
                        value={tipoSelecionado}
                        onChange={(e) => setTipoSelecionado(e.target.value)}
                    >
                        {tiposPrincipais.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Subtipo:</label>
                    <select
                        className="form-select"
                        value={subtipoSelecionado}
                        onChange={(e) => setSubtipoSelecionado(e.target.value)}
                        disabled={tipoSelecionado === "Todos"}
                    >
                        {subtiposUnicos.map((subtipo, index) => (
                            <option key={index} value={subtipo}>{subtipo}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button onClick={exportarPDF} className="btn btn-danger w-100 mt-3">
                      <FiDownload className="me-2" size={20} />
                        Gerar PDF
                    </button>
                </div>
            </div>

            <div ref={chartRef} style={{ backgroundColor: "transparent", padding: "10px", color: "black" }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={producaoMensal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" style={{ fill: "#E2EF70" }} />
                        <YAxis  style={{fill: "#E2EF70"}} />
                        <Tooltip itemStyle={{fill: "white"}} />
                        <Bar dataKey="quantidade" fill="#A0DDE6"  filter="brightness(0.8)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default GraficoProducaoMensal;
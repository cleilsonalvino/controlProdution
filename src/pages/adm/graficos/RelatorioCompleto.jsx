import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import GraficoProducaoMensal from './GraficoProducaoMensal';
import GraficoCrescimentoProducao from './GraficoCrescimentoProducao';
import GraficoProducaoDiaria from './GraficoProducaoDiaria';
import { FiDownload } from 'react-icons/fi';

const RelatorioCompleto = ({ pedidosMensais, pedidosCrescimento, pedidosDiarios }) => {
    const refGraficoMensal = useRef(null);
    const refGraficoCrescimento = useRef(null);
    const refGraficoDiario = useRef(null);

    const gerarConteudoPDFMensal = async (doc, startY) => {
        if (!refGraficoMensal.current || !refGraficoMensal.current.chartRef?.current) {
            console.error("Elemento do gráfico mensal não encontrado.");
            return startY;
        }
        const chartElement = refGraficoMensal.current.chartRef.current;
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");
        const titulo = `Relatório de Produção Mensal - ${refGraficoMensal.current.anoSelecionado}`;
        const tipo = refGraficoMensal.current.tipoSelecionado !== "Todos" ? `Tipo: ${refGraficoMensal.current.tipoSelecionado}` : "Todos os Tipos";
        const subtipo = refGraficoMensal.current.subtipoSelecionado !== "Todos" ? ` | Subtipo: ${refGraficoMensal.current.subtipoSelecionado}` : "";
        const totalQuantidade = refGraficoMensal.current.producaoMensal?.reduce((acc, item) => acc + item.quantidade, 0) || 0;

        let currentY = startY;
        doc.setFontSize(12); // Diminuindo ainda mais a fonte do título
        doc.text(titulo, 14, currentY);
        currentY += 5;
        doc.setFontSize(9); // Diminuindo ainda mais a fonte das informações
        doc.text(`${tipo}${subtipo}`, 14, currentY);
        currentY += 4;
        doc.text(`Quantidade total: ${totalQuantidade}`, 14, currentY);
        currentY += 6;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width * 1.3; // Diminuindo ainda mais a altura
        doc.addImage(imgData, "PNG", 14, currentY, imgWidth, imgHeight);
        return currentY + imgHeight + 6; // Diminuindo ainda mais o espaço após
    };

    const gerarConteudoPDFCrescimento = async (doc, startY) => {
        if (!refGraficoCrescimento.current || !refGraficoCrescimento.current.graficoRef?.current) {
            console.error("Elemento do gráfico de crescimento não encontrado.");
            return startY;
        }
        const chartElement = refGraficoCrescimento.current.graficoRef.current;
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');
        const titulo = `Relatório de Crescimento da Produção - ${refGraficoCrescimento.current.dataSelecionadaGrafico}`;
        const tipo = refGraficoCrescimento.current.tipoSelecionado !== "Todos" ? `Tipo: ${refGraficoCrescimento.current.tipoSelecionado}` : "Todos os Tipos";
        const subtipo = refGraficoCrescimento.current.subtipoSelecionado !== "Todos" ? ` | Subtipo: ${refGraficoCrescimento.current.subtipoSelecionado}` : "";
        const totalQuantidade = refGraficoCrescimento.current.producaoPorDia?.reduce((acc, item) => acc + item.quantidade, 0) || 0;

        let currentY = startY;
        doc.setFontSize(12); // Diminuindo ainda mais a fonte do título
        doc.text(titulo, 14, currentY);
        currentY += 5;
        doc.setFontSize(9); // Diminuindo ainda mais a fonte das informações
        doc.text(`${tipo}${subtipo}`, 14, currentY);
        currentY += 4;
        doc.text(`Quantidade total: ${totalQuantidade}`, 14, currentY);
        currentY += 6;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width * 1.5; // Diminuindo ainda mais a altura
        doc.addImage(imgData, 'PNG', 14, currentY, imgWidth, imgHeight);
        return currentY + imgHeight + 6; // Diminuindo ainda mais o espaço após
    };

    const gerarConteudoPDFDiario = async (doc, startY) => {
        if (!refGraficoDiario.current || !refGraficoDiario.current.graficoDiarioRef?.current) {
            console.error("Elemento do gráfico diário não encontrado.");
            return startY;
        }
        const chartContainer = refGraficoDiario.current.graficoDiarioRef.current;
        const canvas = await html2canvas(chartContainer);
        const imgData = canvas.toDataURL("image/png");
        const titulo = `Relatório de Produção Diária - ${refGraficoDiario.current.dataSelecionadaGrafico}`;
        const tipo = refGraficoDiario.current.tipoSelecionado !== "Todos" ? `Tipo: ${refGraficoDiario.current.tipoSelecionado}` : "Todos os Tipos";
        const subtipo = refGraficoDiario.current.subtipoSelecionado !== "Todos" ? ` | Subtipo: ${refGraficoDiario.current.subtipoSelecionado}` : "";

        let currentY = startY;
        doc.setFontSize(12); // Diminuindo ainda mais a fonte do título
        doc.text(titulo, 14, currentY);
        currentY += 5;
        doc.setFontSize(9); // Diminuindo ainda mais a fonte das informações
        doc.text(`${tipo}${subtipo}`, 14, currentY);
        currentY += 6;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 28;
        const imgHeight = (canvas.height * imgWidth) / canvas.width * 1.5; // Diminuindo ainda mais a altura
        doc.addImage(imgData, "PNG", 14, currentY, imgWidth, imgHeight);
        return currentY + imgHeight + 6; // Diminuindo ainda mais o espaço após
    };

    const exportarTodosPDFs = async () => {
        const doc = new jsPDF("p", "mm", "a4");
        let currentY = 10; // Posição inicial Y ainda mais perto da borda

        currentY = await gerarConteudoPDFMensal(doc, currentY);
        currentY += 5; // Espaço ainda menor entre os gráficos

        if (currentY + 110 > doc.internal.pageSize.getHeight()) { // Altura limite ainda menor
            doc.addPage();
            currentY = 10;
        }
        currentY = await gerarConteudoPDFCrescimento(doc, currentY);
        currentY += 5; // Espaço ainda menor entre os gráficos

        if (currentY + 110 > doc.internal.pageSize.getHeight()) { // Altura limite ainda menor
            doc.addPage();
            currentY = 10;
        }
        await gerarConteudoPDFDiario(doc, currentY);

        doc.save("relatorio_completo.pdf");
    };

    return (
        <div className="container text-center">
            <GraficoProducaoMensal ref={refGraficoMensal} pedidos={pedidosMensais} />
            <GraficoCrescimentoProducao ref={refGraficoCrescimento} pedidos={pedidosCrescimento} />
            <GraficoProducaoDiaria ref={refGraficoDiario} pedidos={pedidosDiarios} />
            <button onClick={exportarTodosPDFs} className="btn btn-primary mt-3 "> 
                <FiDownload className="me-2" size={20} />
                Gerar Relatório Completo em PDF
            </button>
        </div>
    );
};

export default RelatorioCompleto;
// Salvar dados no localStorage
function salvarDados() {
    const dadosPedido = {
        codPedido: document.getElementById('cod_pedido').value,
        quantidade: document.getElementById('quantidade').value,
        dataPedido: new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }), 
        horaInicio: document.getElementById('hora_inicio').value,
        horaPausa: document.getElementById('hora_pausa').value,
        horaReinicio: document.getElementById('hora_reinicio').value,
        horaFinal: document.getElementById('hora_final').value,
        observacao: document.getElementById('observacao').value,
    };

    localStorage.setItem('pedidoDados', JSON.stringify(dadosPedido));
}

// Função para carregar dados salvos
function carregarDados() {
    const dadosPedido = JSON.parse(localStorage.getItem('pedidoDados'));

    if (dadosPedido) {
        document.getElementById('cod_pedido').value = dadosPedido.codPedido;
        document.getElementById('quantidade').value = dadosPedido.quantidade;
        document.getElementById('data_pedido').innerText = dadosPedido.dataPedido;
        document.getElementById('hora_inicio').value = dadosPedido.horaInicio;
        document.getElementById('hora_pausa').value = dadosPedido.horaPausa;
        document.getElementById('hora_reinicio').value = dadosPedido.horaReinicio;
        document.getElementById('hora_final').value = dadosPedido.horaFinal;
        document.getElementById('observacao').value = dadosPedido.observacao;
    }
}

function registrarDataAtual() {
    const dataPedido = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    document.getElementById('data_pedido').innerHTML = dataPedido;
}

// Adiciona eventos para salvar dados em tempo real
function ativarSalvamentoAutomatico() {
    const camposTextoNumero = ['cod_pedido', 'quantidade', 'observacao'];

    camposTextoNumero.forEach(campoId => {
        const campo = document.getElementById(campoId);
        campo.addEventListener('input', salvarDados,);
    });
    
}

// Função para enviar e limpar dados
function enviarDadoss() {
    const dadosPedido = JSON.parse(localStorage.getItem('pedidoDados'));

    if (!dadosPedido || !dadosPedido.codPedido || !dadosPedido.quantidade) {
        alert("Preencha todos os campos antes de enviar.");
        return;
    }

    console.log("Dados enviados com sucesso:", dadosPedido);
    alert("Dados enviados com sucesso!");

    localStorage.removeItem('pedidoDados');
    document.querySelectorAll('input, textarea').forEach(campo => campo.value = '');
    document.getElementById('data_pedido').innerText = '';
}

// Carrega os dados e ativa eventos ao iniciar a página
window.onload = function () {
    registrarDataAtual()
    carregarDados();
    ativarSalvamentoAutomatico();
};

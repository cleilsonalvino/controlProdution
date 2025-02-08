// Função para salvar os dados no localStorage
function salvarDados() {
    // Cria objeto com os dados principais
    const dadosPedido = {
      codPedido: document.getElementById('cod_pedido').value,
      tipoPedido: document.getElementById('tipo_pedido').value,
      quantidade: document.getElementById('quantidade').value,
      dataPedido: new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      horaInicio: document.getElementById('hora_inicio').value,
      horaPausa: document.getElementById('hora_pausa').value,
      horaReinicio: document.getElementById('hora_reinicio').value,
      horaFinal: document.getElementById('hora_final').value,
      observacao: document.getElementById('observacao').value,
    };
  
    // Se o tipo for PAINEL ou OUTROS, incluir dados adicionais
    if (dadosPedido.tipoPedido === "PAINEL") {
      dadosPedido.metPainel = document.getElementById('met_painel').value;
    } else if (dadosPedido.tipoPedido === "OUTROS") {
      dadosPedido.outros = document.getElementById('outros').value;
    }
  
    localStorage.setItem('pedidoDados', JSON.stringify(dadosPedido));
  }
  
  // Função para registrar o horário atual nos campos (início, pausa, reinício e final)
  function registrarHora(tipo) {
    const campo = document.getElementById('hora_' + tipo);
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (campo) {
      campo.value = horaAtual;
    }
    salvarDados(); // Atualiza os dados no localStorage
  }
  
  // Função para carregar os dados salvos
  function carregarDados() {
    const dadosPedido = JSON.parse(localStorage.getItem('pedidoDados'));
  
    if (dadosPedido) {
      document.getElementById('cod_pedido').value = dadosPedido.codPedido || '';
      document.getElementById('tipo_pedido').value = dadosPedido.tipoPedido || '';
      document.getElementById('quantidade').value = dadosPedido.quantidade || '';
      document.getElementById('data_pedido').innerText = dadosPedido.dataPedido || '';
      document.getElementById('hora_inicio').value = dadosPedido.horaInicio || '';
      document.getElementById('hora_pausa').value = dadosPedido.horaPausa || '';
      document.getElementById('hora_reinicio').value = dadosPedido.horaReinicio || '';
      document.getElementById('hora_final').value = dadosPedido.horaFinal || '';
      document.getElementById('observacao').value = dadosPedido.observacao || '';
  
      // Exibe os campos adicionais conforme o tipo salvo
      if (dadosPedido.tipoPedido === "PAINEL") {
        document.getElementById('grupo_met_painel').classList.remove('hidden');
        document.getElementById('met_painel').value = dadosPedido.metPainel || '';
      } else if (dadosPedido.tipoPedido === "OUTROS") {
        document.getElementById('grupo_outros').classList.remove('hidden');
        document.getElementById('outros').value = dadosPedido.outros || '';
      }
    }
  }
  
  // Função para registrar a data atual
  function registrarDataAtual() {
    const dataPedido = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    document.getElementById('data_pedido').innerText = dataPedido;
  }
  
  // Habilita o salvamento automático em alguns campos
  function ativarSalvamentoAutomatico() {
    // Campos de texto e número
    const campos = ['cod_pedido', 'quantidade', 'observacao'];
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if(campo) {
        campo.addEventListener('input', salvarDados);
      }
    });
  
    // Campo select de tipo do pedido
    const selectTipo = document.getElementById('tipo_pedido');
    selectTipo.addEventListener('change', function() {
      const tipo = this.value;
      // Exibe/esconde os campos adicionais conforme o tipo selecionado
      if (tipo === "PAINEL") {
        document.getElementById('grupo_met_painel').classList.remove('hidden');
        document.getElementById('grupo_outros').classList.add('hidden');
      } else if (tipo === "OUTROS") {
        document.getElementById('grupo_outros').classList.remove('hidden');
        document.getElementById('grupo_met_painel').classList.add('hidden');
      } else {
        document.getElementById('grupo_met_painel').classList.add('hidden');
        document.getElementById('grupo_outros').classList.add('hidden');
      }
      salvarDados();
    });
  
    // Campos adicionais também salvam os dados quando alterados
    const camposAdicionais = ['met_painel', 'outros'];
    camposAdicionais.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if(campo) {
        campo.addEventListener('input', salvarDados);
      }
    });
  }
  
  // Função para enviar e limpar os dados
  function enviarDados() {
    const dadosPedido = JSON.parse(localStorage.getItem('pedidoDados'));
  
    // Valida se os campos obrigatórios foram preenchidos
    if (!dadosPedido || !dadosPedido.codPedido || !dadosPedido.quantidade || !dadosPedido.tipoPedido) {
      alert("Preencha todos os campos obrigatórios antes de enviar.");
      return;
    }
  
    console.log("Dados enviados com sucesso:", dadosPedido);
    alert("Dados enviados com sucesso!");
  
    // Limpa o localStorage e os campos do formulário
    localStorage.removeItem('pedidoDados');
    document.querySelectorAll('input, textarea, select').forEach(campo => campo.value = '');
    document.getElementById('data_pedido').innerText = '';
  
    // Esconde os campos adicionais
    document.getElementById('grupo_met_painel').classList.add('hidden');
    document.getElementById('grupo_outros').classList.add('hidden');
  }
  
  // Inicialização quando a página é carregada
  window.onload = function () {
    registrarDataAtual();
    carregarDados();
    ativarSalvamentoAutomatico();
  };
  
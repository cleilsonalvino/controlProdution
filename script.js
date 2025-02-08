// Função para salvar os dados no localStorage
function salvarDados() {
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
      // Campos de funcionário
      funcionario1: document.getElementById('funcionario1').value,
      funcionario2: document.getElementById('funcionario2').value
    };
  
    // Se o tipo for PAINEL ou OUTROS, adiciona os campos extras
    if (dadosPedido.tipoPedido === "PAINEL") {
        // Obtemos o valor digitado no campo "met_painel"
        const metPainelValue = document.getElementById('met_painel').value;
        // Atualizamos a propriedade tipoPedido, concatenando "PAINEL " com o valor da metragem
        dadosPedido.tipoPedido = "PAINEL " + metPainelValue;
    }
    
     else if (dadosPedido.tipoPedido === "OUTROS") {
      dadosPedido.outros = document.getElementById('outros').value;
    }
  
    localStorage.setItem('pedidoDados', JSON.stringify(dadosPedido));
  }
  
  // Função para registrar o horário atual nos campos (início, pausa, reinício e final)
  function registrarHora(tipo) {
    const campo = document.getElementById('hora_' + tipo);
    const horaAtual = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    if (campo) {
      campo.value = horaAtual;
    }
    salvarDados();
  }
  
  // Função para carregar os dados salvos no localStorage
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
      document.getElementById('funcionario1').value = dadosPedido.funcionario1 || '';
      document.getElementById('funcionario2').value = dadosPedido.funcionario2 || '';
  
      // Exibe os campos adicionais conforme o tipo do pedido
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
  
  // Ativa o salvamento automático em diversos campos
  function ativarSalvamentoAutomatico() {
    // Campos que já devem atualizar o localStorage automaticamente
    const campos = ['cod_pedido', 'quantidade', 'observacao', 'funcionario1', 'funcionario2'];
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.addEventListener('input', salvarDados);
      }
    });
  
    // Atualiza ao mudar o tipo do pedido (exibe/esconde campos extras)
    const selectTipo = document.getElementById('tipo_pedido');
    selectTipo.addEventListener('change', function() {
      const tipo = this.value;
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
  
    // Campos dos grupos adicionais
    const camposAdicionais = ['met_painel', 'outros'];
    camposAdicionais.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.addEventListener('input', salvarDados);
      }
    });
  }
  
  // Função para enviar os dados
  function enviarDados() {
    const dadosPedido = JSON.parse(localStorage.getItem('pedidoDados'));
  
    // Valida os campos obrigatórios
    if (!dadosPedido || !dadosPedido.codPedido || !dadosPedido.quantidade || !dadosPedido.tipoPedido) {
      alert("Preencha todos os campos obrigatórios antes de enviar.");
      return;
    }
  
    // Verifica se ao menos um nome de funcionário foi preenchido
    if (!dadosPedido.funcionario1 && !dadosPedido.funcionario2) {
      alert("Preencha pelo menos o nome de um funcionário.");
      return;
    }
  
    // Envio local (ou exibição) de confirmação
    console.log("Dados prontos para envio:", dadosPedido);
    alert("Dados validados com sucesso! Enviando para o SheetDB...");
  
    // Chama a função que envia para o SheetDB
    enviarParaSheetDB();
  
    // Opcional: Limpa o localStorage e os campos do formulário
    localStorage.removeItem('pedidoDados');
    document.querySelectorAll('input, textarea, select').forEach(campo => campo.value = '');
    document.getElementById('data_pedido').innerText = '';
    
    // Esconde os campos adicionais
    document.getElementById('grupo_met_painel').classList.add('hidden');
    document.getElementById('grupo_outros').classList.add('hidden');
  }
  

  function enviarParaSheetDB() {
    // Recupera os dados salvos no localStorage
    const dadosPedido = JSON.parse(localStorage.getItem("pedidoDados"));
  
    if (!dadosPedido) {
      alert("Nenhum dado encontrado para enviar.");
      return;
    }
  
    // Cria o objeto que será enviado no formato esperado pelo SheetDB
    const payload = {
      data: [ 
        {
          codPedido: dadosPedido.codPedido || "",
          tipoPedido: dadosPedido.tipoPedido || "",
          quantidade: dadosPedido.quantidade || "",
          dataPedido: dadosPedido.dataPedido || "",
          horaInicio: dadosPedido.horaInicio || "",
          horaPausa: dadosPedido.horaPausa || "00:00",
          horaReinicio: dadosPedido.horaReinicio || "00:00",
          horaFinal: dadosPedido.horaFinal || "",
          observacao: dadosPedido.observacao || "",
          funcionario1: dadosPedido.funcionario1 || "",
          funcionario2: dadosPedido.funcionario2 || ""
        }
      ]
    };
  
    // Envia os dados para o SheetDB
    fetch("https://sheetdb.io/api/v1/invgs30c98aol", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na rede ao enviar os dados");
      }
      return response.json();
    })
    .then(result => {
      console.log("Dados enviados com sucesso:", result);
      alert("Dados enviados para SheetDB com sucesso!");
      // Opcional: se desejar, limpe o localStorage ou faça outras ações
    })
    .catch(error => {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao enviar os dados para o SheetDB.");
    });
  }
  
  
  // Inicialização ao carregar a página
  window.onload = function () {
    registrarDataAtual();
    carregarDados();
    ativarSalvamentoAutomatico();
  };
  
// Exemplo em JavaScript
const pausas = [
    { horaPausa: new Date("2025-04-05T10:00:00"), horaRetorno: new Date("2025-04-05T10:15:00") },
    { horaPausa: new Date("2025-04-05T12:30:00"), horaRetorno: new Date("2025-04-05T12:45:00") }
  ];
  
  const totalPausaMs = pausas.reduce((total, pausa) => {
    return total + (pausa.horaRetorno.getTime() - pausa.horaPausa.getTime());
  }, 0);
  
  const minutos = Math.floor(totalPausaMs / 60000);
  console.log(`Tempo total de pausa: ${minutos} minutos`);
  
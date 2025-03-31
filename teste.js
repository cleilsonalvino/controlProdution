import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

async function adicionarProduto(
  codigo,
  nome,
  tipo,
  quantidade,
  horaInicio,
  horaPausa,
  horaReinicio,
  horaFim,
  responsavel,
  observacoes
) {
  try {
    // Adicionando todos os campos corretamente
    await addDoc(collection(db, "Pedidos"), {
      codigo: codigo,
      nome: nome,
      tipo: tipo,
      quantidade: quantidade,
      horaInicio: horaInicio,
      horaPausa: horaPausa,
      horaReinicio: horaReinicio,
      horaFim: horaFim,
      responsavel: responsavel,
      observacoes: observacoes,
      dataCriacao: new Date(), // Adiciona a data/hora atual
    });
    console.log("Pedido adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar pedido: ", error);
  }
}

// Chamada da função com todos os parâmetros
adicionarProduto(
  "001",
  "Cleilson",
  "CAMISA",
  50,
  "08:00",
  "10:30",
  "11:00",
  "17:00",
  "João Silva",
  "Urgente, precisa ser entregue amanhã."
);

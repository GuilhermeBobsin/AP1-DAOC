import { lerTema } from "./storage.js";
import { pegarProdutos } from "./api.js";

function aplicarTema(tema) {
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(tema);
}

const tema = lerTema();
aplicarTema(tema);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function carregarDetalhes() {
  const produtos = await pegarProdutos();
  const produto = produtos.find(p => p.id == id);

  if (!produto) {
    document.getElementById("conteudo").innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  document.getElementById("conteudo").innerHTML = `
    <div class="card">
      <img src="${produto.image}" alt="">
      <h2>${produto.title}</h2>
      <p><strong>Preço:</strong> R$ ${produto.price}</p>
      <p><strong>Descrição:</strong> ${produto.description}</p>
      <p><strong>Avaliação:</strong> ⭐ ${produto.rating.rate} (${produto.rating.count} avaliações)</p>
    </div>
  `;
}

carregarDetalhes();

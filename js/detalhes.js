import { lerTema } from "./storage.js";
import { pegarProdutos } from "./api.js";

const menu = document.getElementById("menu");
const loading = document.getElementById("loading");

function aplicarTema(tema) {
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(tema);
}

aplicarTema(lerTema());

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function carregarDetalhes() {
  loading.style.display = "flex";
  const produtos = await pegarProdutos();
  const produto = produtos.find(p => p.id == id);

  const conteudo = document.getElementById("conteudo");
  if (!produto) {
    conteudo.innerHTML = "<p class='vazio'>Produto não encontrado.</p>";
    loading.style.display = "none";
    return;
  }

  conteudo.innerHTML = `
        <div class="card card-detalhe">
            <img src="${produto.image}" alt="${produto.title}">
            <h2>${produto.title}</h2>
            <p><strong>Preço:</strong> R$ ${produto.price}</p>
            <p><strong>Descrição:</strong> ${produto.description}</p>
            <p><strong>Avaliação:</strong> ⭐ ${produto.rating.rate} (${produto.rating.count})</p>
        </div>
    `;
  loading.style.display = "none";
}

carregarDetalhes();

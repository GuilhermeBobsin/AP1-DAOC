import { pegarProdutos, pegarCategorias, pegarProdutosPorCategoria } from "./api.js";
import { lerFavoritos, lerTema, salvarTema } from "./storage.js";
import { mostrarProdutos } from "./ui.js";

const menu = document.getElementById("menu");
const secProdutos = document.getElementById("pagina-produtos");
const secFavs = document.getElementById("pagina-favoritos");
const loading = document.getElementById("loading");

let todosProdutos = [], todos = [], categorias = [], filtroMin = null, filtroMax = null, filtroAvaliacao = null;

async function carregar() {
  loading.style.display = "flex";
  categorias = await pegarCategorias();
  todosProdutos = await pegarProdutos();
  todos = [...todosProdutos];
  montarMenu();
  montarFiltros();
  aplicarTema(lerTema());
  atualizar();
  loading.style.display = "none";
}

function aplicarTema(tema) {
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(tema);
  salvarTema(tema);
}

function mostrarPagina(nome) {
  secProdutos.classList.add("escondido");
  secFavs.classList.add("escondido");
  document.getElementById("pagina-detalhes").classList.add("escondido");

  if (nome === "produtos") secProdutos.classList.remove("escondido");
  if (nome === "favoritos") secFavs.classList.remove("escondido");
  if (nome === "detalhes") document.getElementById("pagina-detalhes").classList.remove("escondido");
}


const traducoesCategorias = {
  "electronics": "Eletrônicos",
  "jewelery": "Joias",
  "men's clothing": "Roupas masculinas",
  "women's clothing": "Roupas femininas"
};

function montarMenu() {
  menu.innerHTML = "";

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Início";
  btnTodos.onclick = () => {
    todos = [...todosProdutos];
    atualizar();
    mostrarPagina("produtos");
  }
  menu.appendChild(btnTodos);

  const sel = document.createElement("select");
  sel.innerHTML = `<option value="">Categorias</option>` + categorias.map(c => `<option value="${c}">${traducoesCategorias[c] || c}</option>`).join('');
  sel.onchange = async () => {
    if (sel.value) todos = await pegarProdutosPorCategoria(sel.value);
    else todos = [...todosProdutos];
    atualizar();
    mostrarPagina("produtos");
  }
  menu.appendChild(sel);

  const btnFavs = document.createElement("button");
  btnFavs.textContent = "Favoritos";
  btnFavs.onclick = () => mostrarPagina("favoritos");
  menu.appendChild(btnFavs);

  const btnTema = document.createElement("button");
  btnTema.textContent = "Trocar tema";
  btnTema.onclick = () => aplicarTema(document.body.classList.contains("escuro") ? "claro" : "escuro");
  menu.appendChild(btnTema);
}

function montarFiltros() {
  const filtroContainer = document.createElement("div");
  filtroContainer.style.position = "relative";
  filtroContainer.style.display = "inline-block";

  const btnFiltro = document.createElement("button");
  btnFiltro.textContent = "Filtros";
  filtroContainer.appendChild(btnFiltro);

  const divFiltro = document.createElement("div");
  divFiltro.className = "popup-filtro";
  divFiltro.innerHTML = `
    <label>Preço mínimo: <input type="double" id="min-preco" placeholder="R$"></label>
    <label>Preço máximo: <input type="double" id="max-preco" placeholder="R$"></label>
    <label>Avaliação:
      <select id="sel-avaliacao">
        <option value="">Todas</option>
        <option value="mais">Melhor avaliado</option>
        <option value="pior">Pior avaliado</option>
      </select>
    </label>
    <button id="btn-aplicar">Aplicar</button>
    <button id="btn-limpar">Limpar</button>
  `;
  filtroContainer.appendChild(divFiltro);
  menu.appendChild(filtroContainer);

  btnFiltro.onclick = () => {
    divFiltro.style.display = divFiltro.style.display === "block" ? "none" : "block";
  };

  const btnAplicar = divFiltro.querySelector("#btn-aplicar");
  const btnLimpar = divFiltro.querySelector("#btn-limpar");
  const inputMin = divFiltro.querySelector("#min-preco");
  const inputMax = divFiltro.querySelector("#max-preco");
  const selAval = divFiltro.querySelector("#sel-avaliacao");

  btnAplicar.onclick = () => {
    filtroMin = inputMin.value ? +inputMin.value : null;
    filtroMax = inputMax.value ? +inputMax.value : null;
    filtroAvaliacao = selAval.value || null;
    atualizar();
    divFiltro.style.display = "none";
  }

  btnLimpar.onclick = () => {
    filtroMin = filtroMax = filtroAvaliacao = null;
    inputMin.value = "";
    inputMax.value = "";
    selAval.value = "";
    atualizar();
    divFiltro.style.display = "none";
  }
}

function atualizar() {
  let lista = [...todos];
  if (filtroMin !== null) lista = lista.filter(p => p.price >= filtroMin);
  if (filtroMax !== null) lista = lista.filter(p => p.price <= filtroMax);
  if (filtroAvaliacao === "mais") lista.sort((a, b) => b.rating.rate - a.rating.rate);
  if (filtroAvaliacao === "pior") lista.sort((a, b) => a.rating.rate - b.rating.rate);

  mostrarProdutos(lista, secProdutos, atualizar);

  const favIds = lerFavoritos();
  const favs = todosProdutos.filter(p => favIds.includes(p.id));
  mostrarProdutos(favs, secFavs, atualizar);
}

async function mostrarDetalhes(id) {
  loading.style.display = "flex";

  const produto = todosProdutos.find(p => p.id === id);
  const secDetalhes = document.getElementById("pagina-detalhes");

  if (!produto) {
    secDetalhes.innerHTML = "<p class='vazio'>Produto não encontrado.</p>";
    mostrarPagina("detalhes");
    loading.style.display = "none";
    return;
  }

  secDetalhes.innerHTML = `
    <div class="card card-detalhe">
      <img src="${produto.image}" alt="${produto.title}">
      <h2>${produto.title}</h2>
      <p><strong>Preço:</strong> R$ ${produto.price}</p>
      <p><strong>Descrição:</strong> ${produto.description}</p>
      <p><strong>Avaliação:</strong> ⭐ ${produto.rating.rate} (${produto.rating.count})</p>
    </div>
  `;

  mostrarPagina("detalhes");
  loading.style.display = "none";
}

export { mostrarDetalhes };

carregar();

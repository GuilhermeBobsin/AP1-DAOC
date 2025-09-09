import { pegarProdutos, pegarCategorias, pegarProdutosPorCategoria } from "./api.js";
import { lerFavoritos, lerTema, salvarTema } from "./storage.js";
import { mostrarProdutos } from "./ui.js";

const menu = document.getElementById("menu");
const secProdutos = document.getElementById("pagina-produtos");
const secFavs = document.getElementById("pagina-favoritos");
const loading = document.getElementById("loading");

let todos = [], categorias = [], filtroMin = null, filtroMax = null, filtroAvaliacao = null;

async function carregar() {
  loading.style.display = "flex";
  categorias = await pegarCategorias();
  todos = await pegarProdutos();
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
  if (nome === "produtos") secProdutos.classList.remove("escondido");
  if (nome === "favoritos") secFavs.classList.remove("escondido");
}

function montarMenu() {
  menu.innerHTML = "";

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todos";
  btnTodos.onclick = async () => {
    todos = await pegarProdutos();
    atualizar();
    mostrarPagina("produtos");
  }
  menu.appendChild(btnTodos);

  const sel = document.createElement("select");
  sel.innerHTML = `<option value="">Categorias</option>` + categorias.map(c => `<option value="${c}">${c}</option>`).join('');
  sel.onchange = async () => {
    if (sel.value) todos = await pegarProdutosPorCategoria(sel.value);
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
  const btnFiltro = document.createElement("button");
  btnFiltro.textContent = "Filtros";
  menu.appendChild(btnFiltro);

  const divFiltro = document.createElement("div");
  divFiltro.className = "popup-filtro";
  divFiltro.innerHTML = `
    <label>Preço mínimo: <input type="number" id="min-preco" placeholder="R$"></label>
    <label>Preço máximo: <input type="number" id="max-preco" placeholder="R$"></label>
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
  menu.appendChild(divFiltro);

  btnFiltro.onclick = () => {
    divFiltro.style.display = divFiltro.style.display === "block" ? "none" : "block";
  };

  document.getElementById("btn-aplicar").onclick = () => {
    const min = document.getElementById("min-preco").value;
    const max = document.getElementById("max-preco").value;
    const aval = document.getElementById("sel-avaliacao").value;
    filtroMin = min ? +min : null;
    filtroMax = max ? +max : null;
    filtroAvaliacao = aval || null;
    atualizar();
    divFiltro.style.display = "none"; 
  };

  document.getElementById("btn-limpar").onclick = () => {
    filtroMin = filtroMax = filtroAvaliacao = null;
    document.getElementById("min-preco").value = "";
    document.getElementById("max-preco").value = "";
    document.getElementById("sel-avaliacao").value = "";
    atualizar();
    divFiltro.style.display = "none"; 
  };
}


function atualizar() {
  let lista = [...todos];
  if (filtroMin !== null) lista = lista.filter(p => p.price >= filtroMin);
  if (filtroMax !== null) lista = lista.filter(p => p.price <= filtroMax);
  if (filtroAvaliacao === "mais") lista.sort((a, b) => b.rating.rate - a.rating.rate);
  if (filtroAvaliacao === "pior") lista.sort((a, b) => a.rating.rate - b.rating.rate);

  mostrarProdutos(lista, secProdutos, atualizar);

  const favIds = JSON.parse(localStorage.getItem("favoritos")) || [];
  const favs = todos.filter(p => favIds.includes(p.id));
  mostrarProdutos(favs, secFavs, atualizar);
}

carregar();

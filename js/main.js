import { pegarProdutos, pegarCategorias, pegarProdutosPorCategoria } from "./api.js";
import { lerFavoritos, salvarFavoritos, lerTema, salvarTema } from "./storage.js";
import { mostrarProdutos, criarCard } from "./ui.js";

const menuNav = document.getElementById("menu-nav");
const secProdutos = document.getElementById("pagina-produtos");
const secFavs = document.getElementById("pagina-favoritos");

let todos = [];
let categorias = [];
let filtroMin = null;
let filtroMax = null;
let filtroAvaliacao = null;

async function carregar() {
  categorias = await pegarCategorias();
  todos = await pegarProdutos();
  aplicarTema(lerTema());
  montarMenu();
  atualizar();
}

function mostrarPagina(nome) {
  secProdutos.classList.add("escondido");
  secFavs.classList.add("escondido");
  if (nome === "produtos") secProdutos.classList.remove("escondido");
  if (nome === "favoritos") secFavs.classList.remove("escondido");
}

function aplicarTema(tema) {
  document.body.classList.remove("claro", "escuro");
  document.body.classList.add(tema);
  salvarTema(tema);
}

function montarMenu() {
  menuNav.innerHTML = "";

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todos";
  btnTodos.onclick = async () => {
    todos = await pegarProdutos();
    atualizar();
    mostrarPagina("produtos");
  };
  menuNav.appendChild(btnTodos);

  const sel = document.createElement("select");
  sel.id = "categorias";
  sel.innerHTML = `<option value="">Categorias</option>`;
  categorias.forEach(c => sel.innerHTML += `<option value="${c}">${c}</option>`);
  sel.onchange = async () => {
    if (sel.value) todos = await pegarProdutosPorCategoria(sel.value);
    atualizar();
    mostrarPagina("produtos");
  };
  menuNav.appendChild(sel);

  const btnFavs = document.createElement("button");
  btnFavs.textContent = "Favoritos";
  btnFavs.onclick = () => mostrarPagina("favoritos");
  menuNav.appendChild(btnFavs);

  const btnFiltro = document.createElement("button");
  btnFiltro.textContent = "Filtrar valor";
  menuNav.appendChild(btnFiltro);

  const divFiltro = document.createElement("div");
  divFiltro.className = "popup-filtro";

  const inputMin = document.createElement("input");
  inputMin.type = "number";
  inputMin.placeholder = "Valor mínimo";

  const inputMax = document.createElement("input");
  inputMax.type = "number";
  inputMax.placeholder = "Valor máximo";

  const btnAplicar = document.createElement("button");
  btnAplicar.textContent = "Aplicar";
  btnAplicar.onclick = () => {
    filtroMin = inputMin.value ? Number(inputMin.value) : null;
    filtroMax = inputMax.value ? Number(inputMax.value) : null;
    atualizar();
    divFiltro.style.display = "none";
  };

  const btnLimpar = document.createElement("button");
  btnLimpar.textContent = "Limpar";
  btnLimpar.onclick = () => {
    filtroMin = filtroMax = null;
    inputMin.value = inputMax.value = "";
    atualizar();
    divFiltro.style.display = "none";
  };

  divFiltro.append(inputMin, inputMax, btnAplicar, btnLimpar);
  menuNav.appendChild(divFiltro);
  btnFiltro.onclick = () => divFiltro.style.display = divFiltro.style.display === "block" ? "none" : "block";

  const btnFiltroAval = document.createElement("button");
  btnFiltroAval.textContent = "Filtrar avaliação";
  menuNav.appendChild(btnFiltroAval);

  const divFiltroAval = document.createElement("div");
  divFiltroAval.className = "popup-filtro";

  const btnMais = document.createElement("button");
  btnMais.textContent = "Melhor avaliado";
  btnMais.onclick = () => { filtroAvaliacao = "mais"; atualizar(); divFiltroAval.style.display = "none"; }

  const btnPior = document.createElement("button");
  btnPior.textContent = "Pior avaliado";
  btnPior.onclick = () => { filtroAvaliacao = "pior"; atualizar(); divFiltroAval.style.display = "none"; }

  const btnLimparAval = document.createElement("button");
  btnLimparAval.textContent = "Limpar";
  btnLimparAval.onclick = () => { filtroAvaliacao = null; atualizar(); divFiltroAval.style.display = "none"; }

  divFiltroAval.append(btnMais, btnPior, btnLimparAval);
  menuNav.appendChild(divFiltroAval);
  btnFiltroAval.onclick = () => divFiltroAval.style.display = divFiltroAval.style.display === "block" ? "none" : "block";

  // Tema
  const btnTema = document.createElement("button");
  btnTema.textContent = "Trocar tema";
  btnTema.onclick = () => aplicarTema(document.body.classList.contains("escuro") ? "claro" : "escuro");
  menuNav.appendChild(btnTema);
}

function atualizar() {
  let lista = [...todos];
  if (filtroMin !== null) lista = lista.filter(p => p.price >= filtroMin);
  if (filtroMax !== null) lista = lista.filter(p => p.price <= filtroMax);

  if (filtroAvaliacao === "mais") lista.sort((a, b) => b.rating.rate - a.rating.rate);
  else if (filtroAvaliacao === "pior") lista.sort((a, b) => a.rating.rate - b.rating.rate);

  mostrarProdutos(lista, secProdutos, atualizar);

  const favIds = lerFavoritos();
  const favs = todos.filter(p => favIds.includes(p.id));
  mostrarProdutos(favs, secFavs, atualizar);
}

carregar();

import { pegarProdutos, pegarCategorias, pegarProdutosPorCategoria } from "./api.js";
import { lerFavoritos } from "./storage.js";
import { mostrarProdutos } from "./ui.js";

const menuNav = document.getElementById("menu-nav");
const secProdutos = document.getElementById("pagina-produtos");
const secFavs = document.getElementById("pagina-favoritos");

let todos = [];
let categorias = [];

function mostrarPagina(nome) {
  secProdutos.classList.add("escondido");
  secFavs.classList.add("escondido");
  if (nome === "produtos") secProdutos.classList.remove("escondido");
  if (nome === "favoritos") secFavs.classList.remove("escondido");
}

async function carregar() {
  categorias = await pegarCategorias();
  todos = await pegarProdutos();
  montarMenu();
  atualizar();
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
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = "Categorias";
  sel.appendChild(opt);
  categorias.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    sel.appendChild(o);
  });
  sel.onchange = async () => {
    if (sel.value) {
      todos = await pegarProdutosPorCategoria(sel.value);
      atualizar();
      mostrarPagina("produtos");
    }
  };
  menuNav.appendChild(sel);

  const btnFavs = document.createElement("button");
  btnFavs.textContent = "Favoritos";
  btnFavs.onclick = () => mostrarPagina("favoritos");
  menuNav.appendChild(btnFavs);
}

function atualizar() {
  mostrarProdutos(todos, secProdutos, atualizar);
  const favIds = lerFavoritos();
  const favs = todos.filter(p => favIds.includes(p.id));
  mostrarProdutos(favs, secFavs, atualizar);
}

carregar();

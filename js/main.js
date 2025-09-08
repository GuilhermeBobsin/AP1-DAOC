// main.js
import { pegarProdutos, pegarCategorias, pegarProdutosPorCategoria } from "./api.js";
import { lerFavoritos, lerTema, salvarTema } from "./storage.js";
import { mostrarProdutos } from "./ui.js";

const menu = document.getElementById("menu");
const secProdutos = document.getElementById("pagina-produtos");
const secFavs = document.getElementById("pagina-favoritos");

let todos = [];
let categorias = [];
let filtroMin = null;
let filtroMax = null;
let filtroAvaliacao = null; 

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

async function carregar() {
    categorias = await pegarCategorias();
    todos = await pegarProdutos();
    const temaInicial = lerTema();
    aplicarTema(temaInicial);

    montarMenu();
    atualizar();
}

function montarMenu() {
    menu.innerHTML = "";

    const btnTodos = document.createElement("button");
    btnTodos.textContent = "Todos";
    btnTodos.onclick = async () => {
        todos = await pegarProdutos();
        atualizar();
        mostrarPagina("produtos");
    };
    menu.appendChild(btnTodos);

    const btnFavs = document.createElement("button");
    btnFavs.textContent = "Favoritos";
    btnFavs.onclick = () => mostrarPagina("favoritos");
    menu.appendChild(btnFavs);

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
    menu.appendChild(sel);

 
    const btnFiltro = document.createElement("button");
    btnFiltro.textContent = "Filtrar por valor";
    btnFiltro.classList.add("btn-filtro");
    menu.appendChild(btnFiltro);

    const divFiltro = document.createElement("div");
    divFiltro.id = "area-filtro";
    divFiltro.classList.add("popup-filtro");
    divFiltro.style.display = "none";

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
        filtroMin = null;
        filtroMax = null;
        inputMin.value = "";
        inputMax.value = "";
        atualizar();
        divFiltro.style.display = "none";
    };

    divFiltro.append(inputMin, inputMax, btnAplicar, btnLimpar);
    menu.appendChild(divFiltro);

    btnFiltro.onclick = () => {
        divFiltro.style.display = divFiltro.style.display === "none" ? "block" : "none";
    };

  
    const btnFiltroAvaliacao = document.createElement("button");
    btnFiltroAvaliacao.textContent = "Filtrar por avaliação";
    btnFiltroAvaliacao.classList.add("btn-filtro-avaliacao");
    menu.appendChild(btnFiltroAvaliacao);

    const divFiltroAvaliacao = document.createElement("div");
    divFiltroAvaliacao.id = "area-filtro-avaliacao";
    divFiltroAvaliacao.classList.add("popup-filtro");
    divFiltroAvaliacao.style.display = "none";

    const btnMaisBemAvaliado = document.createElement("button");
    btnMaisBemAvaliado.textContent = "Melhor avaliado";
    btnMaisBemAvaliado.onclick = () => {
        filtroAvaliacao = "mais";
        atualizar();
        divFiltroAvaliacao.style.display = "none";
        mostrarPagina("produtos");
    };

    const btnPiorAvaliado = document.createElement("button");
    btnPiorAvaliado.textContent = "Pior avaliado";
    btnPiorAvaliado.onclick = () => {
        filtroAvaliacao = "pior";
        atualizar();
        divFiltroAvaliacao.style.display = "none";
        mostrarPagina("produtos");
    };

    const btnLimparAval = document.createElement("button");
    btnLimparAval.textContent = "Limpar";
    btnLimparAval.onclick = () => {
        filtroAvaliacao = null;
        atualizar();
        divFiltroAvaliacao.style.display = "none";
    };

    divFiltroAvaliacao.append(btnMaisBemAvaliado, btnPiorAvaliado, btnLimparAval);
    menu.appendChild(divFiltroAvaliacao);

    btnFiltroAvaliacao.onclick = () => {
        divFiltroAvaliacao.style.display =
            divFiltroAvaliacao.style.display === "none" ? "block" : "none";
    };


    const btnTema = document.createElement("button");
    btnTema.textContent = "Trocar tema";
    btnTema.onclick = () => {
        const novoTema = document.body.classList.contains("escuro") ? "claro" : "escuro";
        aplicarTema(novoTema);
    };
    menu.appendChild(btnTema);
}

function atualizar() {
    let lista = [...todos];

    if (filtroMin !== null) {
        lista = lista.filter(p => p.price >= filtroMin);
    }
    if (filtroMax !== null) {
        lista = lista.filter(p => p.price <= filtroMax);
    }

    if (filtroAvaliacao === "mais") {
        lista.sort((a, b) => b.rating.rate - a.rating.rate);
    } else if (filtroAvaliacao === "pior") {
        lista.sort((a, b) => a.rating.rate - b.rating.rate);
    }

    mostrarProdutos(lista, secProdutos, atualizar);

    const favIds = lerFavoritos();
    const favs = todos.filter(p => favIds.includes(p.id));
    mostrarProdutos(favs, secFavs, atualizar);
}

carregar();
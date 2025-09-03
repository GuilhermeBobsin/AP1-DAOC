import { lerFavoritos, salvarFavoritos } from "./storage.js";

export function criarCard(produto, atualizar) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <img src="${produto.image}" alt="">
    <h4>${produto.title}</h4>
    <p>R$ ${produto.price}</p>
    <button></button>
  `;

    const btn = card.querySelector("button");
    const favs = lerFavoritos();
    btn.textContent = favs.includes(produto.id) ? "Remover" : "Favoritar";

    btn.onclick = () => {
        let lista = lerFavoritos();
        if (lista.includes(produto.id)) {
            lista = lista.filter(id => id !== produto.id);
        } else {
            lista.push(produto.id);
        }
        salvarFavoritos(lista);
        atualizar();
    };

    return card;
}

export function mostrarProdutos(lista, onde, atualizar) {
    onde.innerHTML = "";
    lista.forEach(p => onde.appendChild(criarCard(p, atualizar)));
}

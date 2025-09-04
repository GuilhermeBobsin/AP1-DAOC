import { lerFavoritos, salvarFavoritos } from "./storage.js";

export function criarCard(produto, atualizar) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <img src="${produto.image}" alt="">
    <h4>${produto.title}</h4>
    <p>R$ ${produto.price}</p>
    <div class="botoes">
        <button class="btn-fav"></button>
        <button class="btn-detalhes">Ver mais</button>
    </div>
  `;

    const btnFav = card.querySelector(".btn-fav");
    const favs = lerFavoritos();
    btnFav.textContent = favs.includes(produto.id) ? "Remover" : "Favoritar";

    btnFav.onclick = () => {
        let lista = lerFavoritos();
        if (lista.includes(produto.id)) {
            lista = lista.filter(id => id !== produto.id);
        } else {
            lista.push(produto.id);
        }
        salvarFavoritos(lista);
        atualizar();
    };

    const btnDetalhes = card.querySelector(".btn-detalhes");
    btnDetalhes.onclick = () => {
        window.location.href = `detalhes.html?id=${produto.id}`;
    };

    return card;
}

export function mostrarProdutos(lista, onde, atualizar) {
    onde.innerHTML = "";
    lista.forEach(p => onde.appendChild(criarCard(p, atualizar)));
}

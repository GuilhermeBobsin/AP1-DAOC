import { lerFavoritos, salvarFavoritos } from "./storage.js";

function criarEstrelas(rate) {
    const estrelas = Math.round(rate);
    return Array.from({length:5},(_,i) => i<estrelas?'⭐':'☆').join('');
}

export function criarCard(produto, atualizar) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${produto.image}" alt="${produto.title}">
        <h4>${produto.title}</h4>
        <p>R$ ${produto.price.toFixed(2)}</p>
        <p class="avaliacao">${criarEstrelas(produto.rating.rate)} <span>(${produto.rating.count})</span></p>
        <div class="acoes">
            <button class="btn-fav"></button>
            <button class="btn-detalhes">Ver mais</button>
        </div>
    `;
    const btnFav = card.querySelector(".btn-fav");
    const favs = lerFavoritos();
    btnFav.textContent = favs.includes(produto.id) ? "Remover" : "Favoritar";
    btnFav.onclick = () => {
        let lista = lerFavoritos();
        if(lista.includes(produto.id)) lista = lista.filter(id => id!==produto.id);
        else lista.push(produto.id);
        salvarFavoritos(lista);
        atualizar();
    };
    card.querySelector(".btn-detalhes").onclick = () => window.location.href=`detalhes.html?id=${produto.id}`;
    return card;
}

export function mostrarProdutos(lista, onde, atualizar){
    onde.innerHTML="";
    lista.forEach(p => onde.appendChild(criarCard(p, atualizar)));
}

const BASE = "https://fakestoreapi.com";

export async function pegarProdutos() {
  const r = await fetch(`${BASE}/products`);
  return r.json();
}

export async function pegarCategorias() {
  const r = await fetch(`${BASE}/products/categories`);
  return r.json();
}

export async function pegarProdutosPorCategoria(cat) {
  const r = await fetch(`${BASE}/products/category/${cat}`);
  return r.json();
}

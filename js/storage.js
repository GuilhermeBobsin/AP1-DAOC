const LS_FAV = "favoritos";
const LS_THEME = "tema";

export function lerFavoritos(){ return JSON.parse(localStorage.getItem(LS_FAV))||[]; }
export function salvarFavoritos(lista){ localStorage.setItem(LS_FAV, JSON.stringify(lista)); }

export function lerTema(){ return localStorage.getItem(LS_THEME)||"escuro"; }
export function salvarTema(tema){ localStorage.setItem(LS_THEME, tema); }

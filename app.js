const lista = document.getElementById("track-list");
const vacio = document.getElementById("empty-state");
const contador = document.getElementById("track-count");

function crearPista(cancion, indice) {
  const articulo = document.createElement("article");
  articulo.className = "track";

  const arte = document.createElement("div");
  arte.className = "track-art";
  arte.setAttribute("aria-hidden", "true");
  arte.textContent = "♫";

  const info = document.createElement("div");
  const titulo = document.createElement("h3");
  titulo.className = "track-title";
  titulo.textContent = cancion.titulo || `Grabación ${indice + 1}`;
  const subtitulo = document.createElement("div");
  subtitulo.className = "track-subtitle";
  subtitulo.textContent = "JONATHAN DJ";
  info.append(titulo, subtitulo);

  const audio = document.createElement("audio");
  audio.controls = true;
  audio.preload = "none";
  audio.src = cancion.archivo;
  audio.setAttribute("aria-label", `Reproducir ${titulo.textContent}`);

  articulo.append(arte, info, audio);
  return articulo;
}

const validas = Array.isArray(canciones) ? canciones.filter(c => c && c.archivo) : [];
contador.textContent = `${validas.length} ${validas.length === 1 ? "GRABACIÓN" : "GRABACIONES"}`;
vacio.hidden = validas.length > 0;
validas.forEach((cancion, indice) => lista.appendChild(crearPista(cancion, indice)));

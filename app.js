
const lista = document.getElementById("track-list");
const vacio = document.getElementById("empty-state");
const contador = document.getElementById("track-count");

function crearReproductor(cancion) {
  if (cancion.tipo === "mixcloud" && cancion.mixcloud) {
    const reproductor = document.createElement("iframe");

    reproductor.src = cancion.mixcloud;
    reproductor.title = "Reproductor de " + cancion.titulo;
    reproductor.width = "170%";
    reproductor.height = "100";
    reproductor.frameBorder = "0";
    reproductor.allow =
      "encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share";

    return reproductor;
  }

  const reproductor = document.createElement("audio");
  reproductor.controls = true;
  reproductor.preload = "none";
  reproductor.src = cancion.archivo;

  return reproductor;
}

function crearPista(cancion, indice) {
  const articulo = document.createElement("article");
  articulo.className = "track";

  const arte = document.createElement("div");
  arte.className = "track-art";
  arte.setAttribute("aria-hidden", "true");
  arte.textContent = String(indice + 1).padStart(2, "0");

  const contenido = document.createElement("div");
  contenido.className = "track-info";

  const titulo = document.createElement("h3");
  titulo.className = "track-title";
  titulo.textContent = cancion.titulo;

  const subtitulo = document.createElement("p");
  subtitulo.className = "track-subtitle";
  subtitulo.textContent = "JONATHAN DJ";

  contenido.appendChild(titulo);
  contenido.appendChild(subtitulo);

  const reproductor = crearReproductor(cancion);

  articulo.appendChild(arte);
  articulo.appendChild(contenido);
  articulo.appendChild(reproductor);

  return articulo;
}

function esCancionValida(cancion) {
  if (!cancion || !cancion.titulo) {
    return false;
  }

  if (cancion.tipo === "mixcloud") {
    return Boolean(cancion.mixcloud);
  }

  return Boolean(cancion.archivo);
}

const cancionesValidas = Array.isArray(canciones)
  ? canciones.filter(esCancionValida)
  : [];

lista.replaceChildren();

cancionesValidas.forEach((cancion, indice) => {
  lista.appendChild(crearPista(cancion, indice));
});

contador.textContent = String(cancionesValidas.length);
vacio.hidden = cancionesValidas.length > 0;


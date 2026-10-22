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

function convertirSesionMixcloud(sesion) {
  if (!sesion || !sesion.name || !sesion.key) {
    return null;
  }

  return {
    titulo: sesion.name,
    tipo: "mixcloud",
    archivo: "",
    mixcloud:
      "https://player-widget.mixcloud.com/widget/iframe/?feed=" +
      encodeURIComponent(sesion.key)
  };
}

function mostrarCanciones(cancionesParaMostrar) {
  const cancionesValidas = Array.isArray(cancionesParaMostrar)
    ? cancionesParaMostrar.filter(esCancionValida)
    : [];

  lista.replaceChildren();

  cancionesValidas.forEach((cancion, indice) => {
    lista.appendChild(crearPista(cancion, indice));
  });

  contador.textContent = String(cancionesValidas.length);
  vacio.hidden = cancionesValidas.length > 0;
}

async function cargarSesionesMixcloud() {
  const cancionesLocales = Array.isArray(canciones) ? canciones : [];

  try {
    const respuesta = await fetch(
      "https://api.mixcloud.com/andymachuka/cloudcasts/?limit=20",
      { headers: { Accept: "application/json" } }
    );

    if (!respuesta.ok) {
      throw new Error("La API de Mixcloud respondió con un error.");
    }

    const datos = await respuesta.json();
    const sesiones = Array.isArray(datos.data)
      ? datos.data.map(convertirSesionMixcloud).filter(Boolean)
      : [];

    if (sesiones.length > 0) {
      mostrarCanciones(sesiones);
      return;
    }

    throw new Error("Mixcloud no devolvió sesiones para mostrar.");
  } catch (error) {
    console.warn(
      "No se pudieron actualizar las sesiones desde Mixcloud. Se mostrarán las sesiones locales.",
      error
    );
    mostrarCanciones(cancionesLocales);
  }
}

cargarSesionesMixcloud();

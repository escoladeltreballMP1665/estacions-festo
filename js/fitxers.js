/* =====================================================================
   ON SÓN LES IMATGES, ELS VÍDEOS I ELS MODELS 3D
   Adreces relatives a l'arrel del web. Per canviar una foto, substituïu
   el fitxer a la carpeta img/ amb el mateix nom (o canvieu-ne l'adreça aquí).
   ===================================================================== */
const IMATGES = {
  "logo":          "img/logo.webp",
  "logoFosc":      "img/logo-fosc.webp",
  "pick-place":    "img/estacions/pick-place.webp",
  "distribucio":   "img/estacions/distribucio.webp",
  "classificacio": "img/estacions/classificacio.webp",

  // models 3D de Festo, comprimits amb gzip (vegeu 4.11)
  models3d: {
    "pick-place": "models3d/pick-place.bin",
    "distribucio": "models3d/distribucio.bin",
    "classificacio": "models3d/classificacio.bin"
  },

  // vídeos de simulació de Festo (mp4)
  videos: {
    "pick-place": "videos/pick-place.mp4",
    "distribucio": "videos/distribucio.mp4",
    "classificacio": "videos/classificacio.mp4"
  },

  // portada dels vídeos (un fotograma de la simulació de Festo)
  portades: {
    "pick-place":    "img/portades/pick-place.webp",
    "distribucio":   "img/portades/distribucio.webp",
    "classificacio": "img/portades/classificacio.webp"
  },

  // retalls de cada element, trets de la foto de l'estació i ampliats
  retalls: {
    "classificacio": {
      "cables": "img/retalls/classificacio/cables.webp",
      "cinta": "img/retalls/classificacio/cinta.webp",
      "desviador": "img/retalls/classificacio/desviador.webp",
      "deteccio": "img/retalls/classificacio/deteccio.webp",
      "interficie": "img/retalls/classificacio/interficie.webp",
      "rampa": "img/retalls/classificacio/rampa.webp",
      "reflexio": "img/retalls/classificacio/reflexio.webp",
      "topall": "img/retalls/classificacio/topall.webp",
      "valvula": "img/retalls/classificacio/valvula.webp"
    },
    "distribucio": {
      "cables": "img/retalls/distribucio/cables.webp",
      "carregador": "img/retalls/distribucio/carregador.webp",
      "cinta": "img/retalls/distribucio/cinta.webp",
      "interficie": "img/retalls/distribucio/interficie.webp",
      "separador": "img/retalls/distribucio/separador.webp",
      "velcro": "img/retalls/distribucio/velcro.webp"
    },
    "pick-place": {
      "cables": "img/retalls/pick-place/cables.webp",
      "cinta": "img/retalls/pick-place/cinta.webp",
      "interficie": "img/retalls/pick-place/interficie.webp",
      "pickplace": "img/retalls/pick-place/pickplace.webp",
      "separador": "img/retalls/pick-place/separador.webp",
      "velcro": "img/retalls/pick-place/velcro.webp"
    }
  }
};

/* =====================================================================
   PROGRAMA DE L'APP DE LES ESTACIONS FESTO MPS
   El que normalment voldreu canviar:
     - 4.2 DADES: noms, enllaços i taules d'entrades i sortides
     - 4.12 GRAFCET: la seqüència de funcionament de cada estació
   ===================================================================== */
/* ---------------------------------------------------------------------
   4.1 ADRECES DE LES PANTALLES
   Tota l'app és una sola pàgina. La part de l'adreça després de # diu
   quina pantalla es mostra (són també les adreces dels codis QR):
     .../                  -> pantalla principal (amb els 3 botons)
     .../#pick-place       -> estació Pick & Place
     .../#distribucio      -> estació Distributing
     .../#classificacio    -> estació Sorting
   Els noms (pick-place, distribucio, classificacio) són les claus de 4.2.
   --------------------------------------------------------------------- */


/* ---------------------------------------------------------------------
   4.2 DADES DE LES ESTACIONS
   Cada fila de la taula d'entrades i sortides té 6 valors, en aquest ordre:
     [ adreça, símbol, descripció en català, tipus, color del fil, pin SysLink ]
   Tipus: "E" = entrada  ·  "S" = sortida
   Les dades tècniques van sempre en aquest ordre:
     [ pressió, alimentació, nombre d'E/S, dimensions ]
   Cada element de la foto interactiva (els mateixos que a la pàgina
   "Elements" de Festo) té:
     grup ......... per ordenar la llegenda
     nom .......... en català
     original ..... nom que fa servir Festo
     referencia ... número de comanda de Festo
     x, y ......... posició a la foto en %, des de l'esquerra i des de dalt
                    (null si l'element no es veu a la foto)
     retall ....... nom del retall d'aquest element, tret de la foto de l'estació
                    i ampliat (vegeu IMATGES.retalls, part 5); null si no es veu
     caixa ........ [esquerra, dalt, dreta, baix] del retall dins la foto, en %
     descripcio ... què fa
     enllac ....... pàgina o fitxa de Festo (si és buit, porta a la
                    pàgina d'elements de l'estació)
   --------------------------------------------------------------------- */
// Web de Festo Didactic amb totes les estacions MPS (botó "Festo Estacions")
const WEB_ESTACIONS_FESTO = "https://ip.festo-didactic.com/InfoPortal/MPS/Hardware/EN/Stations.html";

const ESTACIONS = {

  "pick-place": {
    nom:        "Pick & Place",
    nomCatala:  "Estació de recollida i col·locació",
    resum:      "Agafa una peça amb ventosa i la col·loca damunt d'una altra que avança per la cinta.",
    esquemes:   "https://ip.festo-didactic.com/InfoPortal/MPS/PickandPlaceStation/Documentation/CircuitDiagrams.pdf",
    paginaComponents: "https://ip.festo-didactic.com/InfoPortal/MPS/PickandPlaceStation/EN/Elements.html",
    grafcet:    "",   // enllaç per obrir el Grafcet a grafcet.io (opcional; el Grafcet és a 4.12)
    dadesTecniques: ["6 bar", "24 V CC · 4,5 A", "7 E / 7 S", "350×700×450 mm"],
    entradesSortides: [
      ["I0", "G1BG1", "Peça a l'inici de la cinta transportadora", "E", "Gris-rosa",    13],
      ["I1", "G1BG2", "Peça a la posició intermèdia de la cinta",  "E", "Vermell-blau", 14],
      ["I2", "G1BG3", "Cap peça al final de la cinta",             "E", "Blanc-verd",   15],
      ["I4", "G2BG1", "Carro retirat",                             "E", "Blanc-groc",   17],
      ["I5", "G2BG2", "Carro avançat",                             "E", "Marró-groc",   18],
      ["I6", "G2BG3", "Ventosa a dalt",                            "E", "Blanc-gris",   19],
      ["I7", "G2BP1", "Peça agafada (pressòstat de buit)",         "E", "Gris-marró",   20],
      ["Q0", "G1MA1", "Cinta transportadora endavant",             "S", "Blanc",         1],
      ["Q1", "G1MA1", "Cinta transportadora enrere",               "S", "Marró",         2],
      ["Q2", "G1MB1", "Avançar el separador",                      "S", "Verd",          3],
      ["Q4", "G2MB2", "Retirar el carro",                          "S", "Gris",          5],
      ["Q5", "G2MB1", "Avançar el carro",                          "S", "Rosa",          6],
      ["Q6", "G2MB3", "Baixar la ventosa",                         "S", "Blau",          7],
      ["Q7", "G2MB4", "Activar el buit",                           "S", "Vermell",       8]
    ],
    adrecesLliures: "I3, Q3",
    components: [
      { grup: "Mòduls", nom: "Mòdul de cinta transportadora",
        original: "Conveyor Module", referencia: "8032692, 8033135", x: 58, y: 58, retall: "cinta", caixa: [34, 46, 75.6, 71],
        descripcio: "Cinta amb el seu motor de 24 V CC i els sensors que detecten la peça. Transporta les peces per l'estació.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/ConveyorModule/EN/index.html" },
      { grup: "Mòduls", nom: "Mòdul Pick & Place (pinça de ventosa)",
        original: "Pick and Place Module (Suction Gripper)", referencia: "8031659", x: 66, y: 27, retall: "pickplace", caixa: [54.1, 0, 85.9, 70.2],
        descripcio: "Manipulador de dos eixos amb ventosa: agafa la tapa i la col·loca damunt de la peça.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/PickandPlaceModule/EN/index.html" },
      { grup: "Actuadors", nom: "Mòdul separador elèctric",
        original: "Sorting gate/separator module, el.", referencia: "532952", x: 47.5, y: 56.5, retall: "separador", caixa: [43.5, 51.8, 51.5, 64.6],
        descripcio: "Separador accionat elèctricament: atura la peça sobre la cinta i la deixa passar quan cal.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Aktor532952/Documentation/DataSheet_en.pdf" },
      { grup: "Connexió elèctrica", nom: "Interfície C",
        original: "C interface", referencia: "8025738", x: 48, y: 77.5, retall: "interficie", caixa: [39.5, 71.5, 56, 83.8],
        descripcio: "Placa on arriba el cable SysLink del PLC i des d'on surten els cables cap als mòduls de l'estació.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8025738/Documentation/DataSheet.pdf" },
      { grup: "Connexió elèctrica", nom: "Cables D-Sub HD de 15 pins",
        original: "15-pin D-Sub-HD cables", referencia: "8033582, 8033583, 8042954, 8033584", x: 26, y: 70, retall: "cables", caixa: [19.5, 59, 50.5, 78.7],
        descripcio: "Cables que connecten cada mòdul amb la interfície C.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8033583/Documentation/DataSheet.pdf" },
      { grup: "Pneumàtica", nom: "Vàlvula d'engegada amb filtre regulador",
        original: "Start-up valve with filter control valve", referencia: "540691", x: null, y: null, retall: null,
        descripcio: "Obre i tanca l'aire comprimit de l'estació, el filtra i en regula la pressió.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part540691/Documentation/DataSheet_en.pdf" },
      { grup: "Accessoris", nom: "Subjectacables amb velcro",
        original: "Cable holder with hook-and-loop", referencia: "8034300", x: 33, y: 78, retall: "velcro", caixa: [29, 74.5, 37.5, 81],
        descripcio: "Brides de velcro que fixen els cables a la placa de perfil.",
        enllac: "" }
    ]
  },

  "distribucio": {
    nom:        "Distributing",
    nomCatala:  "Estació de distribució / transportador",
    resum:      "Expulsa les peces del carregador una a una i les porta per la cinta fins a l'estació següent.",
    esquemes:   "https://ip.festo-didactic.com/InfoPortal/MPS/DistributionConveyorStation/Documentation/CircuitDiagrams.pdf",
    paginaComponents: "https://ip.festo-didactic.com/InfoPortal/MPS/DistributionConveyorStation/EN/Elements.html",
    grafcet:    "",
    dadesTecniques: ["6 bar", "24 V CC · 4,5 A", "6 E / 4 S", "350×700×230 mm"],
    entradesSortides: [
      ["I0", "G1BG1", "Peça a l'inici de la cinta transportadora", "E", "Gris-rosa",    13],
      ["I1", "G1BG2", "Peça a la posició intermèdia de la cinta",  "E", "Vermell-blau", 14],
      ["I2", "G1BG3", "Cap peça al final de la cinta",             "E", "Blanc-verd",   15],
      ["I4", "C2BG2", "Empenyedor del carregador retirat",         "E", "Blanc-groc",   17],
      ["I5", "C2BG3", "Empenyedor del carregador avançat",         "E", "Marró-groc",   18],
      ["I6", "C2BG1", "Carregador buit",                           "E", "Blanc-gris",   19],
      ["Q0", "G1MA1", "Cinta transportadora endavant",             "S", "Blanc",         1],
      ["Q1", "G1MA1", "Cinta transportadora enrere",               "S", "Marró",         2],
      ["Q2", "G1MB1", "Avançar el separador",                      "S", "Verd",          3],
      ["Q4", "C2MB1", "Avançar l'empenyedor del carregador",       "S", "Gris",          5]
    ],
    adrecesLliures: "I3, I7, Q3, Q5, Q6, Q7",
    components: [
      { grup: "Mòduls", nom: "Mòdul de cinta transportadora",
        original: "Conveyor Module", referencia: "8032692, 8033135", x: 55, y: 36, retall: "cinta", caixa: [34.8, 21.7, 76.4, 57.6],
        descripcio: "Cinta amb el seu motor de 24 V CC i els sensors que detecten la peça. Transporta les peces per l'estació.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/ConveyorModule/EN/index.html" },
      { grup: "Mòduls", nom: "Mòdul de carregador apilat",
        original: "Stack Magazine Module", referencia: "8032171, 8032172", x: 70, y: 14, retall: "carregador", caixa: [59.2, 0.4, 91.9, 45.5],
        descripcio: "Carregador on s'apilen les peces i cilindre que les empeny una a una cap a la cinta.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/StackMagazineModule/EN/index.html" },
      { grup: "Actuadors", nom: "Mòdul separador elèctric",
        original: "Sorting gate/separator module, el.", referencia: "532952", x: 46, y: 35, retall: "separador", caixa: [40.6, 28.2, 51.2, 42.3],
        descripcio: "Separador accionat elèctricament: atura la peça sobre la cinta i la deixa passar quan cal.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Aktor532952/Documentation/DataSheet_en.pdf" },
      { grup: "Connexió elèctrica", nom: "Interfície C",
        original: "C interface", referencia: "8025738", x: 47.5, y: 67, retall: "interficie", caixa: [39.1, 59.1, 55.2, 75.9],
        descripcio: "Placa on arriba el cable SysLink del PLC i des d'on surten els cables cap als mòduls de l'estació.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8025738/Documentation/DataSheet.pdf" },
      { grup: "Connexió elèctrica", nom: "Cables D-Sub HD de 15 pins",
        original: "15-pin D-Sub-HD cables", referencia: "8033582, 8033583, 8042954, 8033584", x: 24, y: 47, retall: "cables", caixa: [21.6, 42.1, 49.4, 70.5],
        descripcio: "Cables que connecten cada mòdul amb la interfície C.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8033583/Documentation/DataSheet.pdf" },
      { grup: "Pneumàtica", nom: "Vàlvula d'engegada amb filtre regulador",
        original: "Start-up valve with filter control valve", referencia: "540691", x: null, y: null, retall: null,
        descripcio: "Obre i tanca l'aire comprimit de l'estació, el filtra i en regula la pressió.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part540691/Documentation/DataSheet_en.pdf" },
      { grup: "Accessoris", nom: "Subjectacables amb velcro",
        original: "Cable holder with hook-and-loop", referencia: "8034300", x: 31, y: 67, retall: "velcro", caixa: [28.1, 63, 38, 71.7],
        descripcio: "Brides de velcro que fixen els cables a la placa de perfil.",
        enllac: "" }
    ]
  },

  "classificacio": {
    nom:        "Sorting",
    nomCatala:  "Estació de classificació",
    resum:      "Detecta el material i el color de cada peça i la desvia cap a una de les tres rampes.",
    esquemes:   "https://ip.festo-didactic.com/InfoPortal/MPS/SortingStation/Documentation/CircuitDiagrams.pdf",
    paginaComponents: "https://ip.festo-didactic.com/InfoPortal/MPS/SortingStation/EN/Elements.html",
    grafcet:    "",
    dadesTecniques: ["6 bar", "24 V CC · 4,5 A", "7 E / 4 S", "350×700×230 mm"],
    entradesSortides: [
      ["I0", "G1BG1", "Peça a l'inici de la cinta transportadora", "E", "Gris-rosa",    13],
      ["I1", "G1BG2", "Desviador 1 avançat",                       "E", "Vermell-blau", 14],
      ["I2", "G1BG4", "Rampa plena",                               "E", "Blanc-verd",   15],
      ["I3", "G1BG3", "Desviador 2 avançat",                       "E", "Marró-verd",   16],
      ["I4", "B1BG1", "Peça detectada",                            "E", "Blanc-groc",   17],
      ["I5", "B1BG2", "La peça no és negra (detector òptic)",      "E", "Marró-groc",   18],
      ["I6", "B1BG3", "Peça metàl·lica (detector inductiu)",       "E", "Blanc-gris",   19],
      ["Q0", "G1MA1", "Cinta transportadora endavant",             "S", "Blanc",         1],
      ["Q1", "G1MB1", "Avançar el desviador 1",                    "S", "Marró",         2],
      ["Q2", "G1MB2", "Avançar el desviador 2",                    "S", "Verd",          3],
      ["Q3", "G1MB3", "Retirar el topall",                         "S", "Groc",          4]
    ],
    adrecesLliures: "I7, Q4, Q5, Q6, Q7",
    components: [
      { grup: "Mòduls", nom: "Mòdul de cinta transportadora",
        original: "Conveyor Module", referencia: "8032692, 8033135", x: 63, y: 40, retall: "cinta", caixa: [39.5, 19.4, 77, 54.6],
        descripcio: "Cinta amb el seu motor de 24 V CC i els sensors que detecten la peça. Porta la peça davant dels desviadors.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/ConveyorModule/EN/index.html" },
      { grup: "Mòduls", nom: "Mòdul de detecció",
        original: "Detection Module", referencia: "8044527", x: 42, y: 14, retall: "deteccio", caixa: [35.1, 0, 51.9, 32.3],
        descripcio: "Columna amb els sensors que detecten la peça i en reconeixen el material i el color abans de classificar-la.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/DetectionModule/EN/index.html" },
      { grup: "Sensors", nom: "Sensor de reflexió per al carril guia",
        original: "Retro-reflective sensor for guide rail", referencia: "8063218", x: 59, y: 26, retall: "reflexio", caixa: [54.4, 23.2, 61.7, 28.7],
        descripcio: "Sensor muntat al carril guia que detecta quan una rampa és plena.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Sensor8063218/Documentation/DataSheet.pdf" },
      { grup: "Actuadors", nom: "Topall amb vàlvula",
        original: "Stopper, simple, with valve", referencia: "8046324", x: 51, y: 19, retall: "topall", caixa: [46.4, 14.2, 54.6, 28.1],
        descripcio: "Cilindre amb la seva electrovàlvula que atura la peça mentre s'identifica.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Aktor8046324/Documentation/DataSheet.pdf" },
      { grup: "Actuadors", nom: "Mòdul desviador elèctric",
        original: "Sorting gate/separator module, el.", referencia: "532952", x: 50, y: 35, retall: "desviador", caixa: [42.6, 29.4, 71.2, 42.8],
        descripcio: "Desviador accionat elèctricament que envia la peça cap a la rampa que li toca.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Aktor532952/Documentation/DataSheet_en.pdf" },
      { grup: "Rampes", nom: "Rampa 250",
        original: "Slide 250", referencia: "", x: 80, y: 40, retall: "rampa", caixa: [52.3, 23.9, 94.9, 56.1],
        descripcio: "Rampes de 250 mm on cauen les peces ja classificades. L'estació en té tres.",
        enllac: "" },
      { grup: "Connexió elèctrica", nom: "Interfície C",
        original: "C interface", referencia: "8025738", x: 48, y: 66, retall: "interficie", caixa: [39.1, 58.1, 55.8, 74.4],
        descripcio: "Placa on arriba el cable SysLink del PLC i des d'on surten els cables cap als mòduls de l'estació.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8025738/Documentation/DataSheet.pdf" },
      { grup: "Connexió elèctrica", nom: "Cables D-Sub HD de 15 pins",
        original: "15-pin D-Sub-HD cables", referencia: "8033582, 8033583, 8042954, 8033584", x: 27, y: 42, retall: "cables", caixa: [18.8, 9, 41.7, 68.2],
        descripcio: "Cables que connecten cada mòdul amb la interfície C.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part8033583/Documentation/DataSheet.pdf" },
      { grup: "Pneumàtica", nom: "Vàlvula d'engegada amb filtre regulador",
        original: "Start-up valve with filter control valve", referencia: "540691", x: 69, y: 14, retall: "valvula", caixa: [62.6, 4.9, 75, 28.1],
        descripcio: "Obre i tanca l'aire comprimit de l'estació, el filtra i en regula la pressió.",
        enllac: "https://ip.festo-didactic.com/InfoPortal/MPS/Components/Part540691/Documentation/DataSheet_en.pdf" }
    ]
  }
};


/* ---------------------------------------------------------------------
   4.3 ICONES
   Petits dibuixos fets amb línies (format SVG).
   --------------------------------------------------------------------- */

// Funció que embolcalla el dibuix amb l'etiqueta <svg>
function icona(dibuix, classe = "icona") {
  return `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dibuix}</svg>`;
}

const ICONES = {
  // Els quatre botons de cada estació
  esquemes:   `<path d="M3 12h4l2-5 4 10 2-5h6"/>`,
  taula:      `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>`,
  grafcet:    `<rect x="8" y="2" width="8" height="6"/><rect x="8" y="16" width="8" height="6"/><path d="M12 8v8M9 12h6"/>`,
  components: `<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>`,

  // Senyals petits: enllaç extern, fletxa avall, lupa i tancar
  extern:     `<path d="M7 17 17 7M9 7h8v8"/>`,
  avall:      `<path d="m6 9 6 6 6-6"/>`,
  lupa:       `<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>`,
  dit:        `<path d="M9 11V5a2 2 0 0 1 4 0v5"/><path d="M13 10a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-3-5a2 2 0 0 1 3-2l2 2"/>`,
  anterior:   `<path d="m15 6-6 6 6 6"/>`,
  camera:     `<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>`,
  play:       `<path d="M7 5v14l12-7z"/>`,
  pausa:      `<path d="M8 5v14M16 5v14"/>`,
  cub:        `<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>`,
  llista:     `<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  seguent:    `<path d="m9 6 6 6-6 6"/>`,
  baixa:      `<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>`,
  tancar:     `<path d="M6 6l12 12M18 6 6 18"/>`
};

// Icones de les dades tècniques, en el mateix ordre que dadesTecniques
const ICONES_DADES = [
  `<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4M9 21h6"/>`,                      // manòmetre: pressió
  `<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,                                              // llamp: alimentació
  `<path d="M4 8h13l-3-3M20 16H7l3 3"/>`,                                                 // fletxes: entrades i sortides
  `<rect x="2" y="8" width="20" height="8" rx="1"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4"/>` // regle: dimensions
];


/* ---------------------------------------------------------------------
   4.4 COLORS DELS FILS SYSLINK
   Per pintar el punt de color al costat de cada adreça.
   Un fil "Gris-rosa" es pinta meitat gris i meitat rosa.
   --------------------------------------------------------------------- */
const COLORS_FILS = {
  "Blanc":   "#FFFFFF",
  "Marró":   "#7B4A2A",
  "Verd":    "#2E9E4F",
  "Groc":    "#F2C200",
  "Gris":    "#9AA0A6",
  "Rosa":    "#F08BB4",
  "Blau":    "#2F6FD6",
  "Vermell": "#D23B2E"
};

function estilDelFil(nomDelFil) {
  const [primer, segon] = nomDelFil.split("-");        // "Gris-rosa" -> "Gris" i "rosa"
  const color1 = COLORS_FILS[primer] || "#999999";
  const color2 = COLORS_FILS[segon]  || color1;        // si només hi ha un color, es repeteix
  return `background: linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;
}


/* ---------------------------------------------------------------------
   4.5 PETITES AJUDES
   --------------------------------------------------------------------- */

// Protegeix els textos perquè símbols com < o & no trenquin la pàgina
function textSegur(text) {
  return String(text).replace(/[&<>"]/g, caracter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  }[caracter]));
}

// Enllaç per anar a una estació (#pick-place, #distribucio, #classificacio)
function enllacEstacio(id) {
  return `href="#${id}"`;
}

// Enllaç per tornar a la pantalla principal
function enllacInici() {
  return `href="#"`;
}

// "smooth" (moviment suau) o "auto" (salt directe) si el mòbil demana menys moviment
function moviment() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// Ordre dels grups de la llegenda (el mateix que a la pàgina d'elements de Festo).
// Si un component té un grup que no és aquí, el grup surt al final.
const ORDRE_GRUPS = ["Mòduls", "Sensors", "Actuadors", "Rampes", "Connexió elèctrica", "Pneumàtica", "Accessoris"];

// Amplada i alçada de cada foto (per mantenir la proporció i que els punts no es moguin)
const MIDES_FOTOS = {
  "pick-place":    [809, 888],
  "distribucio":   [809, 602],
  "classificacio": [810, 589]
};

// Logo de l'escola (dues versions: normal i per al mode fosc)
function logo() {
  return `
    <a class="logo" href="https://www.escoladeltreball.org" target="_blank" rel="noopener"
       aria-label="Institut Escola del Treball de Barcelona">
      <img class="logo-clar" src="${IMATGES.logo}"     alt="Institut Escola del Treball de Barcelona">
      <img class="logo-fosc" src="${IMATGES.logoFosc}" alt="Institut Escola del Treball de Barcelona">
    </a>`;
}


/* ---------------------------------------------------------------------
   4.6 PANTALLA PRINCIPAL
   Logo, títol i un botó gran per a cada estació.
   --------------------------------------------------------------------- */
function pantallaPrincipal() {

  // Es crea un botó per a cada estació de la llista ESTACIONS
  const botons = Object.entries(ESTACIONS).map(([id, estacio]) => `
    <a class="boto-estacio liquid" ${enllacEstacio(id)}>
      <span class="textos">
        <span class="nom">${estacio.nom}</span>
        <span class="nom-catala">${estacio.nomCatala}</span>
        <span class="peu-boto">
          <span class="obre">Obre <span aria-hidden="true">›</span></span>
        </span>
      </span>
      <img src="${IMATGES[id]}" alt="" decoding="async">
    </a>`).join("");

  return `
    <div class="pantalla">
      <div class="barra-superior">
        ${logo()}
        <a class="segell vidre liquid" href="${WEB_ESTACIONS_FESTO}" target="_blank" rel="noopener">
          Festo Estacions ${icona(ICONES.extern, "icona-petita")}
        </a>
      </div>

      <header class="portada">
        <div class="avantitol">Mecatrònica Industrial</div>
        <h1>Estacions Festo - MP1765</h1>
      </header>

      <nav class="estacions" aria-label="Estacions">${botons}</nav>

      <footer>Institut Escola del Treball de Barcelona · Departament de Fabricació Mecànica</footer>
    </div>`;
}


/* ---------------------------------------------------------------------
   4.7 PANTALLA DE CADA ESTACIÓ
   Nom, foto, dades tècniques, quatre botons, la taula d'entrades
   i sortides (amb el mòdul de LEDs) i enllaços a les altres estacions.
   --------------------------------------------------------------------- */
function pantallaEstacio(id) {
  const estacio = ESTACIONS[id];

  // Una fila de la taula
  function fila(dades) {
    const [adreca, simbol, descripcio, tipus, fil, pin] = dades;
    const esEntrada = (tipus === "E");
    return `
      <tr data-adreca="${adreca}" data-tipus="${tipus}">
        <td>
          <span class="adreca">
            <span class="fil" style="${estilDelFil(fil)}" title="Fil ${textSegur(fil.toLowerCase())} · pin ${pin}"></span>
            ${adreca}
          </span>
        </td>
        <td class="simbol">${textSegur(simbol)}</td>
        <td>${textSegur(descripcio)}</td>
        <td><span class="tipus ${esEntrada ? "entrada" : "sortida"}">${esEntrada ? "Entrada" : "Sortida"}</span></td>
      </tr>`;
  }

  const filesEntrades = estacio.entradesSortides.filter(f => f[3] === "E").map(fila).join("");
  const filesSortides = estacio.entradesSortides.filter(f => f[3] === "S").map(fila).join("");

  // Dades tècniques, cadascuna amb la seva icona
  const dades = estacio.dadesTecniques.map((dada, i) => `
    <span class="dada">${icona(ICONES_DADES[i] || "", "icona-petita")}${dada}</span>`).join("");

  // Botó del Grafcet: obre el diagrama de 4.12 (si n'hi ha), un enllaç o el missatge "Properament"
  const botoGrafcet = GRAFCETS[id]
    ? `<button class="accio vidre liquid" type="button" id="boto-grafcet" aria-pressed="false" aria-controls="grafcet-es">
         <span class="dalt"><span class="caixa-icona">${icona(ICONES.grafcet)}</span>${icona(ICONES.avall, "senyal")}</span>
         <span><span class="etiqueta">Grafcet</span><span class="pista">Seqüència pas a pas</span></span>
       </button>`
    : estacio.grafcet
    ? `<a class="accio vidre liquid" href="${textSegur(estacio.grafcet)}" target="_blank" rel="noopener">
         <span class="dalt"><span class="caixa-icona">${icona(ICONES.grafcet)}</span>${icona(ICONES.extern, "senyal")}</span>
         <span><span class="etiqueta">Grafcet</span><span class="pista">Obre al Drive</span></span>
       </a>`
    : `<div class="accio properament" role="note" aria-label="Grafcet: properament">
         <span class="dalt"><span class="caixa-icona">${icona(ICONES.grafcet)}</span></span>
         <span><span class="etiqueta">Grafcet</span><span class="pista">Properament</span></span>
       </div>`;

  // Botó "Estacions" per tornar a la pantalla principal
  const botoTornar = `<a class="boto-tornar vidre liquid" ${enllacInici()}><span aria-hidden="true">‹</span> Estacions</a>`;

  // Enllaços a les altres dues estacions
  const altres = Object.entries(ESTACIONS)
    .filter(([altreId]) => altreId !== id)
    .map(([altreId, altra]) => `
      <a class="mini-estacio liquid" ${enllacEstacio(altreId)}>
        <span class="nom">${altra.nom}</span>
        <span class="fletxa">Obre ›</span>
        <img src="${IMATGES[altreId]}" alt="" decoding="async">
      </a>`).join("");

  const pantalla = `
    <div class="pantalla">
      <div class="barra-superior">${logo()}${botoTornar}</div>

      <header class="capcalera-estacio">
        <div class="avantitol">Estació Festo MPS</div>
        <h1>${estacio.nomCatala}</h1>
        <span class="nom-angles">${estacio.nom}</span>
      </header>

      <figure class="fitxa">
        <div class="escenari">
          <div class="carrusel" id="carrusel" aria-label="Foto, vídeo i model 3D de l'estació">
            <div class="diapo diapo-foto" aria-label="Foto">
              ${mapaComponents(id)}
              <span class="nom-peca" id="nom-peca" hidden></span>
              <button class="amplia vidre liquid" type="button" id="obre-visor" aria-label="Amplia la foto de l'estació">
                ${icona(ICONES.lupa, "icona-petita")}Amplia
              </button>
            </div>
            <div class="diapo diapo-video" aria-label="Vídeo">
              ${videoEstacio(id)}
            </div>
            <div class="diapo diapo-3d" aria-label="Model 3D">
              <div class="marc-3d" id="marc-3d">
                <canvas aria-label="Model 3D de l'estació. Arrossega per girar-lo i pessiga per ampliar-lo."></canvas>
                <span class="avis-3d" hidden></span>
                <div class="controls-3d">
                  <span class="pista-3d vidre">${icona(ICONES.dit, "icona-petita")}Gira</span>
                  ${selectorVelocitat()}
                  <button class="boto-3d vidre liquid" type="button" data-3d="play" aria-label="Atura el moviment">${icona(ICONES.pausa, "")}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="selector-diapo vidre" role="group" aria-label="Foto, vídeo o 3D">
            <span class="lent" aria-hidden="true"></span>
            <button type="button" data-diapo="0" aria-pressed="true">${icona(ICONES.camera, "icona-petita")}Foto</button>
            <button type="button" data-diapo="1" aria-pressed="false">${icona(ICONES.play, "icona-petita")}Vídeo</button>
            <button type="button" data-diapo="2" aria-pressed="false">${icona(ICONES.cub, "icona-petita")}3D</button>
          </div>
        </div>
        <div class="info-component compacta" aria-live="polite">${infoComponent(id, null)}</div>
        <figcaption class="fitxa-text">
          <p>${estacio.resum}</p>
          <span class="dades-tecniques">${dades}</span>
        </figcaption>
      </figure>

      <div class="accions">
        <a class="accio vidre liquid" href="${textSegur(estacio.esquemes)}" target="_blank" rel="noopener">
          <span class="dalt"><span class="caixa-icona">${icona(ICONES.esquemes)}</span>${icona(ICONES.extern, "senyal")}</span>
          <span><span class="etiqueta">Esquemes</span><span class="pista">Pneumàtics i elèctrics</span></span>
        </a>

        <button class="accio vidre liquid" type="button" id="boto-taula" aria-pressed="false" aria-controls="taula-es">
          <span class="dalt"><span class="caixa-icona">${icona(ICONES.taula)}</span>${icona(ICONES.avall, "senyal")}</span>
          <span><span class="etiqueta">Entrades/ Sortides PLC</span><span class="pista">Taula en català</span></span>
        </button>

        ${botoGrafcet}

        <a class="accio vidre liquid" href="${textSegur(estacio.paginaComponents)}" target="_blank" rel="noopener">
          <span class="dalt"><span class="caixa-icona">${icona(ICONES.components)}</span>${icona(ICONES.extern, "senyal")}</span>
          <span><span class="etiqueta">Components</span><span class="pista">Web de Festo</span></span>
        </a>
      </div>

      <section class="taula-es" id="taula-es" hidden aria-labelledby="titol-taula">
        <h2 id="titol-taula">Entrades i sortides del PLC</h2>
        <p class="intro">Connexió SysLink de 24 pins. El punt de color és el color del fil.</p>

        ${modulLeds(estacio)}

        <div class="filtre vidre liquid" role="group" aria-label="Filtra la taula">
          <span class="lent" aria-hidden="true"></span>
          <button type="button" data-filtre="totes" aria-pressed="true">Totes</button>
          <button type="button" data-filtre="E" aria-pressed="false">Entrades</button>
          <button type="button" data-filtre="S" aria-pressed="false">Sortides</button>
        </div>

        <div class="lliscador">
          <table>
            <thead>
              <tr><th>Adreça</th><th>Símbol</th><th>Descripció</th><th>Tipus</th></tr>
            </thead>
            <tbody>
              <tr class="separador" data-tipus="E"><td colspan="4">Entrades</td></tr>
              ${filesEntrades}
              <tr class="separador" data-tipus="S"><td colspan="4">Sortides</td></tr>
              ${filesSortides}
            </tbody>
          </table>
        </div>
        <div class="adreces-lliures">Adreces lliures:
          ${estacio.adrecesLliures.split(",").map(a => `<code data-adreca="${a.trim()}">${a.trim()}</code>`).join(" ")}
        </div>
      </section>

      ${GRAFCETS[id] ? seccioGrafcet(id) : ""}

      ${altres ? `<nav class="altres" aria-label="Altres estacions"><h2>Altres estacions</h2><div class="altres-graella">${altres}</div></nav>` : ""}

      <footer>Institut Escola del Treball de Barcelona · Mecatrònica Industrial</footer>
    </div>`;

  // El visor de la foto va fora de la pantalla perquè pugui ocupar tota la finestra.
  // Només hi ha la foto (sense punts ni llista), que es pot ampliar i moure.
  const visor = `
    <div class="visor" id="visor" hidden role="dialog" aria-modal="true" aria-label="Foto ampliada: ${textSegur(estacio.nomCatala)}">
      <div class="visor-zona" id="visor-zona">
        <img id="visor-foto" src="${IMATGES[id]}" alt="Fotografia ampliada de l'${textSegur(estacio.nomCatala.toLowerCase())}" draggable="false">
      </div>
      <div class="visor-zoom" role="group" aria-label="Zoom">
        <button type="button" data-zoom="-1" aria-label="Redueix">${icona(`<path d="M5 12h14"/>`, "")}</button>
        <output id="visor-percent">100 %</output>
        <button type="button" data-zoom="1" aria-label="Amplia">${icona(`<path d="M12 5v14M5 12h14"/>`, "")}</button>
      </div>
      <button class="tancar liquid" type="button" id="tanca-visor" aria-label="Tanca">${icona(ICONES.tancar, "")}</button>
    </div>`;

  return pantalla + visor;
}


/* ---------------------------------------------------------------------
   4.7b FOTO INTERACTIVA DELS COMPONENTS
   mapaComponents -> la foto amb un punt numerat damunt de cada component.
   infoComponent  -> la fitxa de sota la foto: la llista de tots els
                     components, o el detall del que s'ha triat.
   triaComponent  -> marca un component a totes les fotos (la de la
                     pantalla i la del visor) i n'ensenya el detall.
   --------------------------------------------------------------------- */
let estacioActual = null;      // l'estació que es veu ara
let componentTriat = null;     // número del component triat (o null si cap)
let llegendaOberta = false;    // si la llista de components està desplegada

function mapaComponents(id) {
  const [amplada, alcada] = MIDES_FOTOS[id];
  const nomEstacio = ESTACIONS[id].nomCatala.toLowerCase();
  const punts = ESTACIONS[id].components.map((c, n) => c.x === null ? "" : `
    <button class="punt" type="button" data-component="${n}" aria-pressed="false"
            style="left:${c.x}%; top:${c.y}%; --i:${n}" aria-label="${n + 1}. ${textSegur(c.nom)}">${n + 1}</button>`).join("");
  return `
    <div class="mapa" style="--proporcio: ${amplada} / ${alcada}">
      <div class="llenc">
        <img class="foto-base" src="${IMATGES[id]}" alt="Fotografia de l'${textSegur(nomEstacio)} amb els components numerats">
        <img class="peca" id="peca" alt="" draggable="false">
        ${punts}
      </div>
    </div>`;
}

// Velocitat del model 3D: 1 (normal), 0.5 o 0.25 (càmera lenta).
// Es recorda mentre es fa servir l'app.
let velocitat = 1;
const VELOCITATS = [1, 0.5, 0.25];

function selectorVelocitat() {
  return `
    <span class="velocitat vidre" role="group" aria-label="Velocitat del moviment">
      ${VELOCITATS.map(v => `<button type="button" data-velocitat="${v}" aria-pressed="${v === velocitat}"
        aria-label="Velocitat ${v}">${v}</button>`).join("")}
    </span>`;
}

function canviaVelocitat(v) {
  velocitat = v;
  document.querySelectorAll("[data-velocitat]").forEach(b =>
    b.setAttribute("aria-pressed", String(Number(b.dataset.velocitat) === v)));
}

// Diapositiva del vídeo de simulació de Festo. El vídeo és a la carpeta
// videos/ d'aquest web, així que no depèn de la web de Festo.
function videoEstacio(id) {
  const e = ESTACIONS[id];
  return `
    <div style="width:100%">
      <div class="marc-video">
        <video id="video-estacio" muted loop playsinline preload="auto"
               poster="${IMATGES.portades[id]}" aria-label="Simulació de l'${textSegur(e.nomCatala.toLowerCase())}"></video>
      </div>
      <div class="peu-video">${icona(ICONES.play, "icona-petita")}Simulació de Festo</div>
    </div>`;
}

// Adreça del vídeo de simulació de l'estació (carpeta videos/)
function urlVideo(id) {
  return IMATGES.videos[id];
}

// Carrusel foto / vídeo / 3D: el selector segueix el dit. El vídeo i el model
// 3D només es mouen quan es veuen: si es passa a una altra diapositiva o
// es baixa per la pàgina, s'aturen (així el mòbil no gasta bateria).
let observadorCarrusel = null;   // vigila si el carrusel és dins la pantalla
function activarCarrusel() {
  if (observadorCarrusel) observadorCarrusel.disconnect();   // el de la pantalla anterior
  const carrusel = document.getElementById("carrusel");
  if (!carrusel) return;
  const selector = document.querySelector(".selector-diapo");
  const botons = selector.querySelectorAll("button");
  const video = document.getElementById("video-estacio");
  let actual = 0;          // diapositiva que es veu: 0 foto, 1 vídeo, 2 model 3D
  let enPantalla = true;   // si el carrusel és dins la pantalla

  // el vídeo es prepara quan es comença a lliscar cap a ell
  const preparaVideo = () => {
    if (video && !video.getAttribute("src")) {
      const url = urlVideo(estacioActual);
      if (url) video.src = url;
    }
  };

  // engega o atura el vídeo i el 3D segons el que es veu
  const actualitza = () => {
    if (video) {
      if (actual === 1 && enPantalla) { preparaVideo(); video.play().catch(() => {}); }
      else video.pause();
    }
    if (actual === 2 && enPantalla) obre3D(estacioActual, document.getElementById("marc-3d"));
    else actiu3D(false);
  };

  botons.forEach(boto => boto.addEventListener("click", () => {
    const diapo = carrusel.children[Number(boto.dataset.diapo)];
    carrusel.scrollTo({ left: diapo.offsetLeft, behavior: moviment() });
  }));

  carrusel.addEventListener("scroll", () => {
    const progres = Math.min(2, Math.max(0, carrusel.scrollLeft / carrusel.clientWidth));
    selector.style.setProperty("--progres", progres);
    if (progres > 0) preparaVideo();
    const nova = Math.round(progres);
    if (nova === actual) return;
    actual = nova;
    botons.forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.diapo) === nova)));
    if (nova !== 0) triaComponent(null);           // en sortir de la foto, l'element torna al seu lloc
    if (video && nova === 1) video.currentTime = 0;  // el vídeo comença des del principi
    actualitza();
  }, { passive: true });

  observadorCarrusel = new IntersectionObserver(([entrada]) => {
    enPantalla = entrada.isIntersecting;
    actualitza();
  });
  observadorCarrusel.observe(carrusel);
}

// Aixeca lleugerament l'element n de la foto. El retall d'aquest element
// (tret de la mateixa foto i ampliat) es col·loca just damunt del seu lloc
// i puja uns píxels. Amb n = null, torna al seu lloc.
function extreuElement(n) {
  const peca = document.getElementById("peca");
  const nom = document.getElementById("nom-peca");
  if (!peca) return;
  const components = ESTACIONS[estacioActual].components;

  const retalls = IMATGES.retalls[estacioActual] || {};          // per si una estació no en té
  if (n === null || !retalls[components[n].retall]) {
    peca.classList.remove("visible");
    nom.hidden = true;
    return;
  }

  const c = components[n];
  const [x0, y0, x1, y1] = c.caixa;
  peca.classList.remove("visible");
  peca.src = retalls[c.retall];
  peca.alt = c.nom;
  Object.assign(peca.style, {
    left: `${x0}%`, top: `${y0}%`, width: `${x1 - x0}%`, height: `${y1 - y0}%`
  });
  // les peces petites s'aixequen una mica més perquè es vegin bé
  const mida = Math.max(x1 - x0, y1 - y0);
  peca.style.setProperty("--aixeca", mida < 10 ? 1.3 : mida < 20 ? 1.15 : 1.06);
  nom.textContent = c.nom;
  nom.hidden = false;
  colocaNom(nom, c);
  // al fotograma següent, perquè la transició arrenqui des del seu lloc
  requestAnimationFrame(() => requestAnimationFrame(() => peca.classList.add("visible")));
}

// Posa el nom a sobre de la peça; si no hi cap o tapa el botó "Amplia",
// el posa a sota. Mai surt de la foto pels costats.
function colocaNom(nom, c) {
  const diapo = nom.parentElement.getBoundingClientRect();
  const mapa = document.querySelector(".fitxa .mapa").getBoundingClientRect();
  const amplia = document.getElementById("obre-visor").getBoundingClientRect();
  const [x0, y0, x1, y1] = c.caixa;
  const dalt = mapa.top + mapa.height * y0 / 100 - diapo.top;        // vora de dalt de la peça
  const baix = mapa.top + mapa.height * y1 / 100 - diapo.top;        // vora de baix
  const centre = mapa.left + mapa.width * (x0 + x1) / 200 - diapo.left;
  const ample = nom.offsetWidth, alt = nom.offsetHeight;
  const esquerra = Math.min(Math.max(centre - ample / 2, 12), diapo.width - ample - 12);
  const xoca = top => esquerra < amplia.right - diapo.left && esquerra + ample > amplia.left - diapo.left &&
                      top < amplia.bottom - diapo.top && top + alt > amplia.top - diapo.top;
  let top = dalt - alt - 14;
  if (top < 8 || xoca(top)) top = Math.min(baix + 10, diapo.height - alt - 8);
  nom.style.left = `${esquerra}px`;
  nom.style.top = `${top}px`;
}

function infoComponent(id, n) {
  const estacio = ESTACIONS[id];
  const components = estacio.components;

  // Cap component triat: només el botó "Components", que obre i tanca la llista
  if (n === null) {
    // La llista s'agrupa per funció, en l'ordre de ORDRE_GRUPS
    const grups = [...new Set([
      ...ORDRE_GRUPS.filter(grup => components.some(c => c.grup === grup)),
      ...components.map(c => c.grup)
    ])];
    const xips = grups
      .map(grup => {
        const files = components
          .map((c, i) => ({ c, i }))
          .filter(({ c }) => c.grup === grup)
          .map(({ c, i }) => `
            <button class="fila-component liquid" type="button" data-component="${i}">
              <b>${i + 1}</b>
              <span class="noms"><span>${textSegur(c.nom)}</span></span>
              ${icona(ICONES.seguent, "icona-petita")}
            </button>`).join("");
        return `<div class="grup-llegenda"><h3>${grup}</h3><div class="files vidre">${files}</div></div>`;
      }).join("");
    return `
      <button class="boto-llegenda vidre liquid" type="button" data-accio="llegenda" aria-expanded="${llegendaOberta}">
        ${icona(ICONES.llista)}Elements <span class="compte">${components.length}</span>${icona(ICONES.avall, "senyal")}
      </button>
      <div class="info-llista" ${llegendaOberta ? "" : "hidden"}>${xips}</div>`;
  }

  // Un component triat: nom, descripció, enllaç i fletxes per passar al següent
  const c = components[n];
  const enllac = c.enllac || estacio.paginaComponents;
  return `
    <div class="info-cap">
      <span class="info-num">${n + 1}</span>
      <div class="info-titol">
        <strong>${textSegur(c.nom)}</strong>
        <span class="info-original">${textSegur(c.original)}</span>
        <span class="info-ref">${textSegur(c.grup)}${c.referencia ? ` · Ref. ${textSegur(c.referencia)}` : ""}</span>
      </div>
      <button class="info-tanca vidre liquid" type="button" data-accio="llista" aria-label="Tanca i torna a la foto sencera">${icona(ICONES.tancar, "")}</button>
    </div>
    <p class="info-desc">${textSegur(c.descripcio)}${c.x === null ? ` <em>No es veu en aquesta foto.</em>` : ""}</p>
    <div class="info-peu">
      <button class="info-nav vidre liquid" type="button" data-accio="anterior" aria-label="Component anterior">${icona(ICONES.anterior, "")}</button>
      <a class="info-enllac liquid" href="${textSegur(enllac)}" target="_blank" rel="noopener">Veure a Festo ${icona(ICONES.extern, "icona-petita")}</a>
      <button class="info-nav vidre liquid" type="button" data-accio="seguent" aria-label="Component següent">${icona(ICONES.seguent, "")}</button>
    </div>`;
}

function triaComponent(n) {
  if (!estacioActual) return;
  const components = ESTACIONS[estacioActual].components;
  componentTriat = n;

  // Fitxa de sota (a la pantalla i al visor)
  document.querySelectorAll(".info-component").forEach(caixa => {
    caixa.innerHTML = infoComponent(estacioActual, n);
    caixa.classList.toggle("compacta", n === null);
  });
  afegirLlumDit();

  // Punts de la foto
  document.querySelectorAll(".mapa").forEach(mapa => {
    const retalls = IMATGES.retalls[estacioActual] || {};
    mapa.classList.toggle("amb-seleccio", n !== null && Boolean(retalls[components[n].retall]));
    mapa.querySelectorAll(".punt").forEach(punt => {
      punt.setAttribute("aria-pressed", String(Number(punt.dataset.component) === n));
    });
  });

  // L'element surt de la foto (o hi torna)
  extreuElement(n);

  // si s'està veient el vídeo, torna a la foto per veure l'element
  const carrusel = document.getElementById("carrusel");
  if (n !== null && carrusel && carrusel.scrollLeft > 10) carrusel.scrollTo({ left: 0, behavior: moviment() });
}

// Passa al component anterior (-1) o al següent (+1), donant la volta
function passaComponent(pas) {
  const total = ESTACIONS[estacioActual].components.length;
  const actual = componentTriat === null ? -1 : componentTriat;
  triaComponent((actual + pas + total) % total);
}


/* ---------------------------------------------------------------------
   4.8 MÒDUL DE LEDS DEL PLC
   Dibuixa 8 LEDs d'entrada (I0-I7) i 8 de sortida (Q0-Q7).
   Les adreces que fa servir l'estació surten enceses i es poden tocar;
   les lliures surten apagades.
   --------------------------------------------------------------------- */
function modulLeds(estacio) {

  // Guarda cada fila de la taula amb la seva adreça per trobar-la ràpid
  const perAdreca = {};
  estacio.entradesSortides.forEach(fila => { perAdreca[fila[0]] = fila; });

  // Fa una fila de 8 LEDs amb la lletra donada ("I" o "Q")
  function filaDeLeds(lletra, classe, titol) {
    let leds = "";
    for (let numero = 0; numero < 8; numero++) {
      const adreca = lletra + numero;
      const dades = perAdreca[adreca];
      if (dades) {
        leds += `
          <button class="led liquid ${classe}" type="button" data-adreca="${adreca}" aria-pressed="false"
                  aria-label="${adreca}: ${textSegur(dades[2])}" title="${textSegur(dades[2])}">
            <span>${adreca}</span><span class="llum"></span>
          </button>`;
      } else {
        leds += `
          <button class="led lliure liquid" type="button" data-adreca="${adreca}" aria-pressed="false"
                  aria-label="${adreca}: lliure" title="Adreça lliure">
            <span>${adreca}</span><span class="llum"></span>
          </button>`;
      }
    }
    return `<div class="fila-leds"><span class="titol-leds">${titol}</span><div class="leds">${leds}</div></div>`;
  }

  return `
    <div class="modul-plc">
      <div class="modul-capcalera">
        <span>Mòdul E/S · SysLink</span>
        <span class="llegenda">
          <span><i style="background:var(--led-entrada)"></i>Entrada</span>
          <span><i style="background:var(--led-sortida)"></i>Sortida</span>
          <span><i style="background:var(--led-apagat)"></i>Lliure</span>
        </span>
      </div>
      ${filaDeLeds("I", "entrada", "Entrades")}
      ${filaDeLeds("Q", "sortida", "Sortides")}
      <p class="modul-ajuda">Toca un LED per trobar el senyal a la taula.</p>
    </div>`;
}


/* ---------------------------------------------------------------------
   4.9 MOSTRAR LA PANTALLA QUE TOCA
   Mira l'adreça (per exemple ...#distribucio) i dibuixa la pantalla.
   --------------------------------------------------------------------- */
function mostrarPantalla() {
  const contenidor = document.getElementById("app");
  const marca = location.hash.replace("#", "");             // "#distribucio" -> "distribucio"
  const id = ESTACIONS[marca] ? marca : null;
  tanca3D();                                                 // atura el model 3D de la pantalla anterior
  estacioActual = id;
  componentTriat = null;
  llegendaOberta = false;

  contenidor.innerHTML = id ? pantallaEstacio(id) : pantallaPrincipal();
  document.title = id ? `${ESTACIONS[id].nom} · Estacions Festo - MP1765` : "Estacions Festo - MP1765";
  document.documentElement.style.overflow = "";             // per si el visor havia bloquejat la pàgina

  activarBotons();
  activarCarrusel();
  window.scrollTo(0, 0);
}


/* ---------------------------------------------------------------------
   4.10 QUÈ FAN ELS BOTONS DE LA PANTALLA D'ESTACIÓ
   --------------------------------------------------------------------- */
function activarBotons() {

  // Afegeix la llum que segueix el dit a tots els botons de vidre líquid
  afegirLlumDit();

  // a) El botó "Entrades/Sortides PLC" obre i tanca la taula
  const botoTaula = document.getElementById("boto-taula");
  const taula = document.getElementById("taula-es");
  if (botoTaula) {
    botoTaula.addEventListener("click", () => {
      const sObre = taula.hidden;
      if (sObre) tancaDesplegables();                        // només un desplegable obert alhora
      taula.hidden = !sObre;
      botoTaula.setAttribute("aria-pressed", String(sObre));
      if (sObre) {
        moureLent();                                         // col·loca la lent del filtre
        taula.scrollIntoView({ behavior: moviment(), block: "start" });
      }
    });
  }

  // b) El filtre: Totes / Entrades / Sortides
  document.querySelectorAll(".filtre button").forEach(boto => {
    boto.addEventListener("click", () => aplicarFiltre(boto.dataset.filtre));
  });

  // c) Els LEDs: en tocar-ne un, es destaca la seva fila de la taula
  document.querySelectorAll("button.led").forEach(led => {
    led.addEventListener("click", () => destacarAdreca(led.dataset.adreca));
  });

  // d) El botó "Amplia" obre el visor amb la foto; la X o la tecla Esc el tanquen
  const botoAmplia = document.getElementById("obre-visor");
  const visor = document.getElementById("visor");
  if (botoAmplia && visor) {
    const nom = ESTACIONS[estacioActual].nomCatala.toLowerCase();
    botoAmplia.addEventListener("click", () =>
      obreVisor(IMATGES[estacioActual], `Fotografia ampliada de l'${nom}`, botoAmplia));
    document.getElementById("tanca-visor").addEventListener("click", tancarVisor);
    visor.querySelectorAll("[data-zoom]").forEach(boto => {
      boto.addEventListener("click", () => zoomVisor.pas(Number(boto.dataset.zoom)));
    });
    zoomVisor.activa(document.getElementById("visor-zona"), document.getElementById("visor-foto"));
  }

  // f) El botó "Grafcet" obre i tanca la secció del Grafcet
  const botoGrafcet = document.getElementById("boto-grafcet");
  const grafcet = document.getElementById("grafcet-es");
  if (botoGrafcet) {
    botoGrafcet.addEventListener("click", () => {
      const sObre = grafcet.hidden;
      if (sObre) tancaDesplegables();                        // només un desplegable obert alhora
      grafcet.hidden = !sObre;
      botoGrafcet.setAttribute("aria-pressed", String(sObre));
      if (sObre) grafcet.scrollIntoView({ behavior: moviment(), block: "start" });
    });
  }
}

// Tanca les seccions desplegables (taula i Grafcet) i deixa els seus botons sense prémer
function tancaDesplegables() {
  document.querySelectorAll("#taula-es, #grafcet-es").forEach(seccio => { seccio.hidden = true; });
  document.querySelectorAll("#boto-taula, #boto-grafcet").forEach(boto => boto.setAttribute("aria-pressed", "false"));
}

// Obre el visor amb una imatge (la foto de l'estació o el Grafcet)
let obridorVisor = null;      // el botó que l'ha obert: en tancar, s'hi torna
function obreVisor(src, descripcio, obridor) {
  const visor = document.getElementById("visor");
  const foto = document.getElementById("visor-foto");
  foto.src = src;
  foto.alt = descripcio;
  visor.setAttribute("aria-label", descripcio);
  visor.hidden = false;
  document.documentElement.style.overflow = "hidden";       // la pàgina de darrere no es mou
  obridorVisor = obridor;
  zoomVisor.reinicia();
  document.getElementById("tanca-visor").focus();
}

// e) Un sol "escoltador" de clics per als botons que es tornen a dibuixar:
//    velocitat del 3D i foto interactiva (punts, llista i fletxes)
document.addEventListener("click", event => {
  const botoVelocitat = event.target.closest("[data-velocitat]");
  if (botoVelocitat) { canviaVelocitat(Number(botoVelocitat.dataset.velocitat)); return; }

  // tocar la foto fora d'un punt torna l'element al seu lloc
  if (event.target.closest(".llenc") && !event.target.closest(".punt") && componentTriat !== null) {
    triaComponent(null);
    return;
  }
  const element = event.target.closest("[data-component], [data-accio]");
  if (!element || !estacioActual) return;
  if (element.dataset.component !== undefined) {
    const n = Number(element.dataset.component);
    const desDeLaLlista = element.classList.contains("fila-component");
    llegendaOberta = false;
    triaComponent(n === componentTriat && element.classList.contains("punt") ? null : n);
    // si s'ha triat des de la llista, puja fins a la foto per veure l'element
    if (desDeLaLlista) portaA(document.querySelector(".fitxa .mapa"));
  } else if (element.dataset.accio === "llegenda") {
    const caixa = element.closest(".info-component");      // es guarda abans de redibuixar
    llegendaOberta = !llegendaOberta;
    triaComponent(null);
    // porta la llista a la vista
    if (llegendaOberta) portaA(caixa.querySelector(".info-llista"), "nearest");
  } else if (element.dataset.accio === "llista")    { llegendaOberta = false; triaComponent(null); }
  else if (element.dataset.accio === "anterior")    passaComponent(-1);
  else if (element.dataset.accio === "seguent")     passaComponent(+1);
});

// Mostra només les files del tipus triat ("E", "S" o "totes")
function aplicarFiltre(filtre) {
  document.querySelectorAll(".filtre button").forEach(boto => {
    boto.setAttribute("aria-pressed", String(boto.dataset.filtre === filtre));
  });
  document.querySelectorAll("#taula-es tbody tr").forEach(fila => {
    fila.hidden = (filtre !== "totes" && fila.dataset.tipus !== filtre);
  });
  moureLent();
}

// Il·lumina la fila d'una adreça i hi porta la pantalla
function destacarAdreca(adreca) {
  aplicarFiltre("totes");
  document.querySelectorAll("button.led").forEach(led => {
    led.setAttribute("aria-pressed", String(led.dataset.adreca === adreca));
  });
  // la fila de la taula, o l'adreça a la llista d'adreces lliures
  const desti = document.querySelector(`#taula-es tr[data-adreca="${adreca}"]`)
             || document.querySelector(`.adreces-lliures code[data-adreca="${adreca}"]`);
  if (!desti) return;
  desti.classList.remove("destacada");
  void desti.offsetWidth;                                    // reinicia l'animació
  desti.classList.add("destacada");
  portaA(desti);
}

// Porta la pantalla fins a un element. Si el moviment suau no hi arriba
// (passa en alguns mòbils), hi salta directament.
function portaA(element, bloc = "center") {
  element.scrollIntoView({ behavior: moviment(), block: bloc });
  setTimeout(() => {
    const caixa = element.getBoundingClientRect();
    if (caixa.top < 0 || caixa.bottom > window.innerHeight) element.scrollIntoView({ block: bloc });
  }, 800);
}

// Tanca el visor i torna al botó que l'havia obert
function tancarVisor() {
  const visor = document.getElementById("visor");
  if (!visor || visor.hidden) return;
  visor.hidden = true;
  document.documentElement.style.overflow = "";
  if (obridorVisor) obridorVisor.focus();
}


/* ---------------------------------------------------------------------
   4.10b ZOOM DEL VISOR
   La foto es mou i s'amplia canviant la seva transformació:
     translate(x, y) scale(escala)
   - Dos dits: pessigar per ampliar o reduir.
   - Un dit o el ratolí: arrossegar per moure la foto (si està ampliada).
   - Doble toc: amplia al punt tocat (o torna a la mida normal).
   - Roda del ratolí i botons − +: amplia o redueix.
   --------------------------------------------------------------------- */
const zoomVisor = {
  escala: 1, x: 0, y: 0,
  MIN: 1, MAX: 5,
  zona: null, foto: null,
  dits: new Map(),            // dits (o ratolí) que toquen la zona ara mateix
  inici: null,                // estat en començar un gest
  darrerToc: 0,               // per detectar el doble toc

  activa(zona, foto) {
    this.zona = zona;
    this.foto = foto;
    this.dits.clear();
    zona.addEventListener("pointerdown", e => this.baixa(e));
    zona.addEventListener("pointermove", e => this.mou(e));
    zona.addEventListener("pointerup", e => this.puja(e));
    zona.addEventListener("pointercancel", e => this.puja(e));
    zona.addEventListener("wheel", e => {
      e.preventDefault();
      this.ampliaA(this.escala * Math.exp(-e.deltaY * 0.0025), e.clientX, e.clientY, false);
    }, { passive: false });
  },

  reinicia() {
    this.escala = 1; this.x = 0; this.y = 0;
    this.aplica(false);
  },

  // Aplica la transformació a la foto i actualitza el percentatge
  aplica(suau = true) {
    if (!this.foto) return;
    this.foto.classList.toggle("suau", suau);
    this.foto.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.escala})`;
    document.getElementById("visor-percent").textContent = `${Math.round(this.escala * 100)} %`;
  },

  // No deixa que la foto marxi massa lluny de la pantalla
  limita() {
    const zona = this.zona.getBoundingClientRect();
    const ample = this.foto.offsetWidth * this.escala;
    const alt = this.foto.offsetHeight * this.escala;
    const maxX = Math.max(0, (ample - zona.width) / 2 + 40);
    const maxY = Math.max(0, (alt - zona.height) / 2 + 40);
    this.x = Math.min(maxX, Math.max(-maxX, this.x));
    this.y = Math.min(maxY, Math.max(-maxY, this.y));
  },

  // Amplia fins a "nova" escala mantenint quiet el punt (px, py) de la pantalla
  ampliaA(nova, px, py, suau = true) {
    nova = Math.min(this.MAX, Math.max(this.MIN, nova));
    const zona = this.zona.getBoundingClientRect();
    const cx = px - (zona.left + zona.width / 2);
    const cy = py - (zona.top + zona.height / 2);
    const factor = nova / this.escala;
    this.x = cx - (cx - this.x) * factor;
    this.y = cy - (cy - this.y) * factor;
    this.escala = nova;
    if (nova === 1) { this.x = 0; this.y = 0; }
    this.limita();
    this.aplica(suau);
  },

  // Botons − + : amplia o redueix des del centre
  pas(direccio) {
    const zona = this.zona.getBoundingClientRect();
    this.ampliaA(this.escala * (direccio > 0 ? 1.6 : 1 / 1.6), zona.left + zona.width / 2, zona.top + zona.height / 2);
  },

  baixa(e) {
    this.zona.setPointerCapture(e.pointerId);
    this.dits.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.comencaGest();
  },

  comencaGest() {
    const punts = [...this.dits.values()];
    this.inici = { escala: this.escala, x: this.x, y: this.y, punts, mogut: false };
    if (punts.length === 2) {
      this.inici.distancia = Math.hypot(punts[0].x - punts[1].x, punts[0].y - punts[1].y);
      this.inici.mig = { x: (punts[0].x + punts[1].x) / 2, y: (punts[0].y + punts[1].y) / 2 };
    }
  },

  mou(e) {
    if (!this.dits.has(e.pointerId)) return;
    this.dits.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const punts = [...this.dits.values()];
    const ini = this.inici;

    if (punts.length === 2 && ini.distancia) {
      // Pessigar: l'escala segueix la distància entre els dos dits
      const distancia = Math.hypot(punts[0].x - punts[1].x, punts[0].y - punts[1].y);
      const mig = { x: (punts[0].x + punts[1].x) / 2, y: (punts[0].y + punts[1].y) / 2 };
      this.escala = ini.escala; this.x = ini.x; this.y = ini.y;
      this.ampliaA(ini.escala * distancia / ini.distancia, ini.mig.x, ini.mig.y, false);
      this.x += mig.x - ini.mig.x;
      this.y += mig.y - ini.mig.y;
      this.limita();
      this.aplica(false);
      ini.mogut = true;
    } else if (punts.length === 1) {
      // Arrossegar
      const dx = punts[0].x - ini.punts[0].x;
      const dy = punts[0].y - ini.punts[0].y;
      if (Math.hypot(dx, dy) > 6) ini.mogut = true;
      if (this.escala > 1) {
        this.x = ini.x + dx;
        this.y = ini.y + dy;
        this.limita();
        this.aplica(false);
      }
    }
  },

  puja(e) {
    if (!this.dits.has(e.pointerId)) return;
    const eraToc = this.dits.size === 1 && this.inici && !this.inici.mogut;
    this.dits.delete(e.pointerId);
    if (this.dits.size > 0) { this.comencaGest(); return; }

    // Doble toc: amplia x2,5 on s'ha tocat, o torna a la mida normal
    if (eraToc) {
      const ara = Date.now();
      if (ara - this.darrerToc < 320) {
        this.ampliaA(this.escala > 1.05 ? 1 : 2.5, e.clientX, e.clientY);
        this.darrerToc = 0;
      } else {
        this.darrerToc = ara;
      }
    }
  }
};


/* ---------------------------------------------------------------------
   4.11 VISOR 3D
   Mostra el model 3D de Festo de l'estació i el fa funcionar.
   - Els models són a la carpeta models3d/, comprimits (fitxers .bin).
   - La llibreria three.js es descarga de jsDelivr només quan s'obre la
     pestanya 3D (així la resta de l'app carrega igual de ràpid).
   - Els moviments són els mateixos que fa servir Festo a la seva web
     (els seus fitxers Animate.js), adaptats a aquesta app.
   --------------------------------------------------------------------- */
const URL_THREE = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";
const URL_ORBIT = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
const URL_ENTORN = "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js";

const graus = g => g * Math.PI / 180;

// Peces de cada estació, en el mateix ordre que els models comprimits.
// pos i rot: on es col·loca cada peça (mm i graus), igual que a Festo.
const MODELS_3D = {
  "pick-place": {
    peces: [
      { nom: "static",      pos: [-475, 784, 294] },
      { nom: "axis1",       pos: [-475, 784, 294] },
      { nom: "axis2",       pos: [-475, 784, 294] },
      { nom: "thermometer", pos: [-430, 905, 188], rot: [-10, 0, -15] },
      { nom: "can",         pos: [-430.3, 900, 110] },
      { nom: "conveyor",    pos: [-316, 775, 51] },
      { nom: "separator",   pos: [-424.95, 876.27, 58.34], rot: [0, 31.5, 0] },
      { nom: "plate",       pos: [-805, 0, -110], rot: [0, 90, 0] }
    ],
    camera: [-1250, 1575, -625], objectiu: [-650, 925, -25],
    pas: pasPickPlace
  },
  "distribucio": {
    peces: [
      { nom: "static",    pos: [-315, 782, 350] },
      { nom: "pusher" },
      { nom: "red" },
      { nom: "black" },
      { nom: "silver" },
      { nom: "conveyor",  pos: [-157, 775, 490], rot: [0, -90, 0] },
      { nom: "separator", pos: [-165, 876.27, 465.5], rot: [0, -90, 0] },
      { nom: "plate" }
    ],
    camera: [600, 1500, -350], objectiu: [0, 850, 250],
    pas: pasDistribucio
  },
  "classificacio": {
    peces: [
      { nom: "modules",   pos: [-315, 775, 50] },
      { nom: "stopper",   pos: [-315, 775, 50] },
      { nom: "separator", pos: [-386.87, 876.27, 61.12], rot: [0, -3, 0] },
      { nom: "separator", pos: [-461.87, 876.27, 61.12], rot: [0, -3, 0] },   // el segon desviador és una còpia
      { nom: "red",       pos: [-350, 500, 0], peca: true },       // peca: s'amaga mentre espera
      { nom: "black",     pos: [-350, 500, 0], peca: true },       // sota la màquina
      { nom: "silver",    pos: [-350, 500, 0], peca: true },
      { nom: "plate",     pos: [-805, 0, -110], rot: [0, 90, 0] }
    ],
    camera: [-1250, 1575, -625], objectiu: [-650, 925, -25],
    pas: pasClassificacio
  }
};

/* ---------- Moviments de cada estació (un pas = 1/60 de segon) ---------- */

// Pick & Place: la cinta porta el pot, la ventosa agafa la tapa i la hi posa
function pasPickPlace(d, s) {
  const v = 2;
  if (!s.t) {
    const durades = [41, 24, 2, 24, 79, 12, 2, 12, 79, 10, 50, 10];
    s.t = []; let acc = 0; for (const x of durades) { acc += x; s.t.push(acc); }
  }
  const t = s.t;
  if (s.temps === 0) {
    d[1].position.set(-475, 787, 294);
    d[2].position.set(-475, 787, 294);
    d[3].position.set(-430, 905, 188);
    d[3].rotation.set(graus(-10), 0, graus(-15));
    d[4].position.set(-290.3, 900, 110);
    d[6].rotation.set(0, graus(31.5), 0);
  }
  s.temps += v;
  const T = s.temps;
  if (T < t[0]) d[4].translateX(-v * 3.5);
  else if (T < t[1]) d[2].translateY(-v);
  else if (T < t[2]) { d[3].rotation.set(0, 0, 0); d[3].translateY(2); }
  else if (T < t[3]) { d[2].translateY(v); d[3].translateY(v); }
  else if (T < t[4]) { d[1].translateZ(-v); d[2].translateZ(-v); d[3].translateZ(-v); }
  else if (T < t[5]) { d[2].translateY(-v); d[3].translateY(-v); }
  else if (T < t[6]) { }
  else if (T < t[7]) d[2].translateY(v);
  else if (T < t[8]) { d[1].translateZ(v); d[2].translateZ(v); }
  else if (T < t[9]) d[6].rotateY(graus(-v * 31.5 / 10));
  else if (T < t[10]) { d[3].translateX(-v * 3.5); d[4].translateX(-v * 3.5); }
  else if (T < t[11]) { }
  else s.temps = 0;
}

// Distribució: l'empenyedor treu les peces del carregador i la cinta se les emporta
function pasDistribucio(d, s) {
  const X = -315, Y = 782, Z = 350;
  const posa = (p, x, y, z) => d[p].position.set(X + x, Y + y, Z + z);
  if (s.temps === 0) { posa(1, 0, 0, 0); posa(2, 0, 2, 0); posa(3, 0, 27, 0); posa(4, 0, 52, 0); }
  const T0 = s.temps;
  const salts = {
    40:   () => { posa(3, 0, 12, 0); posa(4, 0, 37, 0); },
    100:  () => posa(2, 100, -5, 0),
    200:  () => { posa(3, 0, 2, 0); posa(4, 0, 27, 0); },
    325:  () => posa(2, 0, 52, 0),
    390:  () => { posa(4, 0, 12, 0); posa(2, 0, 37, 0); },
    450:  () => posa(3, 100, -5, 0),
    550:  () => { posa(4, 0, 2, 0); posa(2, 0, 27, 0); },
    675:  () => posa(3, 0, 52, 0),
    740:  () => { posa(2, 0, 12, 0); posa(3, 0, 37, 0); },
    800:  () => posa(4, 100, -5, 0),
    900:  () => { posa(2, 0, 2, 0); posa(3, 0, 27, 0); },
    1025: () => posa(4, 0, 52, 0)
  };
  if (salts[T0]) salts[T0]();
  s.temps += 5;
  const T = s.temps;
  // cada peça: l'empenyedor avança, torna i la cinta s'emporta la peça
  const cicle = (inici, peca) => {
    const u = T - inici;
    if (u < 101) { posa(1, u, 0, 0); posa(peca, u, 2, 0); }
    else if (u < 201) { posa(1, 200 - u, 0, 0); if (u > 150) posa(peca, 100, -5, 150 - u); }
    else if (u < 321) posa(peca, 100, -5, 150 - u);
  };
  if (T < 351) cicle(0, 2);
  else if (T < 701) cicle(350, 3);
  else if (T < 1051) cicle(700, 4);
  else s.temps = 0;
}

// Classificació: cada peça s'atura al topall, es detecta i el desviador l'envia a la seva rampa
function pasClassificacio(d, s) {
  const v = 2;
  if (!s.t) {
    const durades = [15, 50, 11, 11, 13, 17, 9, 5, 3, 76, 11, 51, 11, 15, 50, 13, 62, 9, 5, 3, 76, 11, 51,
                     11, 15, 50, 11, 11, 13, 37, 9, 5, 3, 76, 11, 51];
    s.t = []; let acc = 0; for (const x of durades) { acc += x; s.t.push(acc); }
  }
  const t = s.t;
  if (s.temps === 0) {
    d[1].position.set(-315, 775, 50);
    d[2].position.set(-386.87, 876.27, 61.12); d[2].rotation.set(0, graus(-6), 0);
    d[3].position.set(-461.87, 876.27, 61.12); d[3].rotation.set(0, graus(-6), 0);
    for (const p of [4, 5, 6]) { d[p].position.set(-350, 500, 0); d[p].rotation.set(0, 0, 0); }
    d[4].position.set(-281, 900, 108);
  }
  s.temps += v;
  const T = s.temps;
  if (T < t[0]) d[4].translateX(-v * 3.5);
  else if (T < t[1]) { }
  else if (T < t[2]) d[2].rotation.set(0, graus(24.5), 0);
  else if (T < t[3]) { }
  else if (T < t[4]) d[1].translateZ(v * 2);
  else if (T < t[5]) d[4].translateX(-v * 3.3);
  else if (T < t[6]) { d[4].translateX(-v * 3); d[4].translateZ(v * 2); }
  else if (T < t[7]) d[4].translateZ(v * 2);
  else if (T < t[8]) { d[4].rotation.set(graus(22), 0, 0); d[4].translateY(-5); }
  else if (T < t[9]) { d[4].translateY(-v * 0.035); d[4].translateZ(v * 3); }
  else if (T < t[10]) { d[1].translateZ(-v * 2); d[2].rotation.set(0, graus(-6), 0); }
  else if (T < t[11]) { }
  else if (T < t[12]) d[5].position.set(-281, 900, 108);
  else if (T < t[13]) d[5].translateX(-v * 3.5);
  else if (T < t[14]) { }
  else if (T < t[15]) d[1].translateZ(v * 2);
  else if (T < t[16]) d[5].translateX(-v * 3.3);
  else if (T < t[17]) { d[5].translateX(-v * 3.6); d[5].translateZ(v * 2); }
  else if (T < t[18]) d[5].translateZ(v * 2);
  else if (T < t[19]) { d[5].rotation.set(graus(22), 0, 0); d[5].translateY(-5); }
  else if (T < t[20]) { d[5].translateY(-v * 0.035); d[5].translateZ(v * 3); }
  else if (T < t[21]) d[1].translateZ(-v * 2);
  else if (T < t[22]) { }
  else if (T < t[23]) d[6].position.set(-281, 900, 108);
  else if (T < t[24]) d[6].translateX(-v * 3.5);
  else if (T < t[25]) { }
  else if (T < t[26]) d[3].rotation.set(0, graus(24.5), 0);
  else if (T < t[27]) { }
  else if (T < t[28]) d[1].translateZ(v * 2);
  else if (T < t[29]) d[6].translateX(-v * 3.55);
  else if (T < t[30]) { d[6].translateX(-v * 3); d[6].translateZ(v * 2); }
  else if (T < t[31]) d[6].translateZ(v * 2);
  else if (T < t[32]) { d[6].rotation.set(graus(22), 0, 0); d[6].translateY(-2); }
  else if (T < t[33]) { d[6].translateY(-v * 0.035); d[6].translateZ(v * 3); }
  else if (T < t[34]) { d[1].translateZ(-v * 2); d[3].rotation.set(0, graus(-6), 0); }
  else if (T < t[35]) { }
  else s.temps = 0;
}

/* ---------- Lectura dels models comprimits ----------
   Cada model és: [mida de la capçalera][capçalera JSON][nombres de 16 bits].
   Per ocupar la meitat, els nombres no es desen tal qual: cada un és la
   diferència amb l'anterior (en "zig-zag", perquè les negatives siguin
   petites) i primer van tots els bytes baixos i després tots els alts.
   Així el gzip troba molts més patrons repetits. No es perd cap detall. */

// Descomprimeix el model (text base64 + gzip) i en fa les peces de three.js
async function llegeixModel(THREE, adreca) {
  const resposta = await fetch(adreca);
  if (!resposta.ok) throw new Error(`No s'ha pogut baixar ${adreca}`);
  const flux = resposta.body.pipeThrough(new DecompressionStream("gzip"));
  const dades = new Uint8Array(await new Response(flux).arrayBuffer());
  const midaJson = new DataView(dades.buffer).getUint32(0, true);
  const info = JSON.parse(new TextDecoder().decode(dades.subarray(4, 4 + midaJson)));
  let cursor = 4 + midaJson;

  // Llegeix "quants" nombres. Amb trams = 3, són tres llistes seguides
  // (totes les x, totes les y i totes les z), i cadascuna comença de zero.
  const llegeix = (quants, trams = 1) => {
    const baixos = dades.subarray(cursor, cursor + quants);
    const alts = dades.subarray(cursor + quants, cursor + 2 * quants);
    cursor += 2 * quants;
    const valors = new Uint16Array(quants), llarg = quants / trams;
    let valor = 0;
    for (let i = 0; i < quants; i++) {
      if (i % llarg === 0) valor = 0;
      const z = baixos[i] | alts[i] << 8;
      valor = (valor + ((z >>> 1) ^ -(z & 1))) & 0xFFFF;    // zig-zag -> diferència -> valor
      valors[i] = valor;
    }
    return valors;
  };

  const peces = {};
  for (const part of info.parts) {
    const grup = new THREE.Group();
    for (const m of part.meshes) {
      // posicions: nombres de 0 a 65535 dins la caixa [min, max] de la malla
      const q = llegeix(m.n * 3, 3);
      const pos = new Float32Array(m.n * 3);
      for (let k = 0; k < 3; k++) {
        const escala = (m.max[k] - m.min[k]) / 65535;
        for (let j = 0; j < m.n; j++) pos[j * 3 + k] = m.min[k] + q[k * m.n + j] * escala;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setIndex(new THREE.BufferAttribute(llegeix(m.i), 1));
      geo.computeVertexNormals();
      const color = new THREE.Color().setRGB(m.c[0], m.c[1], m.c[2]);
      const lluminos = (m.c[0] + m.c[1] + m.c[2]) / 3;
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: lluminos > .55 ? .38 : .55,              // l'alumini clar brilla una mica més
        metalness: lluminos > .55 ? .35 : .05,
        transparent: m.o < 1, opacity: m.o
      });
      grup.add(new THREE.Mesh(geo, material));
    }
    peces[part.name] = grup;
  }
  return peces;
}

/* ---------- El visor ---------- */

let visor3d = null;          // el visor obert (només n'hi ha un)

async function obre3D(id, capa) {
  if (visor3d && visor3d.id === id) { actiu3D(true); return; }
  tanca3D();
  const estat = { id, actiu: true, tancat: false };
  visor3d = estat;
  const avis = capa.querySelector(".avis-3d");
  avis.hidden = false;
  if (!IMATGES.models3d[id]) {                                   // estació sense model 3D
    avis.textContent = "El model 3D d'aquesta estació és a la seva pàgina.";
    return;
  }
  avis.textContent = "Carregant el model 3D…";

  try {
    const [THREE, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
      import(URL_THREE), import(URL_ORBIT), import(URL_ENTORN)
    ]);
    if (estat.tancat) return;
    const config = MODELS_3D[id];
    const peces = await llegeixModel(THREE, IMATGES.models3d[id]);
    if (estat.tancat) return;

    // Escena, càmera i llum
    const llenc = capa.querySelector("canvas");
    const renderer = new THREE.WebGLRenderer({ canvas: llenc, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const escena = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    escena.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
    const llum = new THREE.DirectionalLight(0xffffff, 1.4);
    llum.position.set(1200, 2600, 900);
    escena.add(llum, new THREE.HemisphereLight(0xffffff, 0x8899aa, .5));

    // Peces col·locades com a la web de Festo
    const d = config.peces.map(p => {
      const g = peces[p.nom].parent ? peces[p.nom].clone() : peces[p.nom];
      if (p.pos) g.position.set(...p.pos);
      if (p.rot) g.rotation.set(graus(p.rot[0]), graus(p.rot[1]), graus(p.rot[2]));
      escena.add(g);
      return g;
    });

    // Primer pas de la simulació: col·loca les peces mòbils al seu lloc inicial
    const simulacio = { temps: 0 };
    config.pas(d, simulacio);
    config.peces.forEach((p, i) => { if (p.peca) d[i].visible = d[i].position.y > 700; });

    // Ombra suau a terra, sota la placa
    const caixa = new THREE.Box3();
    d.forEach(g => { if (g.visible) caixa.expandByObject(g); });
    const centre = caixa.getCenter(new THREE.Vector3());
    const mida = caixa.getSize(new THREE.Vector3());
    // l'enquadrament es fa sobre els mòduls (sense la placa), perquè es vegin grans
    const caixaModuls = new THREE.Box3();
    config.peces.forEach((p, i) => { if (p.nom !== "plate" && d[i].visible) caixaModuls.expandByObject(d[i]); });
    const ombraTex = (() => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(0,30,50,.35)"); g.addColorStop(1, "rgba(0,30,50,0)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const ombra = new THREE.Mesh(new THREE.PlaneGeometry(mida.x * 1.5, mida.z * 1.5),
      new THREE.MeshBasicMaterial({ map: ombraTex, transparent: true, depthWrite: false }));
    ombra.rotation.x = -Math.PI / 2;
    ombra.position.set(centre.x, caixa.min.y - 2, centre.z);
    escena.add(ombra);

    // Càmera: el punt de vista de Festo, ajustat perquè hi càpiga tota l'estació
    const camera = new THREE.PerspectiveCamera(35, 1, 20, 20000);
    const objectiu = caixaModuls.getCenter(new THREE.Vector3());
    const direccio = new THREE.Vector3(...config.camera).sub(new THREE.Vector3(...config.objectiu)).normalize();
    const radi = caixaModuls.getSize(new THREE.Vector3()).length() / 2;
    const vistaInicial = () => {
      const aspecte = llenc.clientWidth / llenc.clientHeight || 1;
      const fov = graus(camera.fov) / 2;
      const distancia = radi / Math.sin(Math.min(fov, Math.atan(Math.tan(fov) * aspecte))) * 1.1;
      camera.position.copy(objectiu).addScaledVector(direccio, distancia);
      controls.target.copy(objectiu);
      controls.update();
    };
    const controls = new OrbitControls(camera, llenc);
    controls.enableDamping = true;
    controls.dampingFactor = .08;
    controls.enablePan = false;
    controls.minDistance = radi * .4;
    controls.maxDistance = radi * 6;
    controls.maxPolarAngle = graus(88);           // no es pot mirar per sota de terra
    controls.autoRotate = true;
    controls.autoRotateSpeed = .6;
    controls.addEventListener("start", () => { controls.autoRotate = false; });

    const ajustaMida = () => {
      const w = llenc.clientWidth, h = llenc.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    ajustaMida();
    vistaInicial();

    // Bucle: els moviments de Festo van a passos de 1/60 s (a velocitat 1×).
    // A càmera lenta els passos s'espaien, i entre pas i pas cada peça es
    // dibuixa a mig camí (interpolació), perquè el moviment sigui suau.
    let enMarxa = true, darrer = performance.now(), acumulat = 0;
    const abans = d.map(g => ({ p: g.position.clone(), q: g.quaternion.clone() }));
    const ara_ = d.map(g => ({ p: g.position.clone(), q: g.quaternion.clone() }));
    const desa = llista => d.forEach((g, i) => { llista[i].p.copy(g.position); llista[i].q.copy(g.quaternion); });
    const bucle = ara => {
      if (estat.tancat) return;
      if (!estat.actiu) { estat.frame = 0; return; }     // amagat: deixa de dibuixar fins que es torni a veure
      estat.frame = requestAnimationFrame(bucle);
      if (enMarxa) {
        acumulat = Math.min(acumulat + (ara - darrer) / (1000 / 60) * velocitat, 4);
        while (acumulat >= 1) {
          desa(abans);
          config.pas(d, simulacio);
          acumulat -= 1;
        }
        desa(ara_);
        // les peces que esperen sota la màquina no es veuen
        config.peces.forEach((p, i) => { if (p.peca) d[i].visible = d[i].position.y > 700; });
      }
      darrer = ara;
      controls.update();
      // posició intermèdia entre l'últim pas i el següent (si la peça no ha saltat)
      const f = enMarxa ? acumulat : 1;
      d.forEach((g, i) => {
        if (abans[i].p.distanceTo(ara_[i].p) < 60) {
          g.position.lerpVectors(abans[i].p, ara_[i].p, f);
          g.quaternion.slerpQuaternions(abans[i].q, ara_[i].q, f);
        }
      });
      renderer.render(escena, camera);
      d.forEach((g, i) => { g.position.copy(ara_[i].p); g.quaternion.copy(ara_[i].q); });
    };
    estat.repren = () => {
      if (estat.frame) return;
      darrer = performance.now();
      estat.frame = requestAnimationFrame(bucle);
    };
    if (estat.actiu) estat.repren();

    // Botó d'aturar / posar en marxa
    const botoPlay = capa.querySelector("[data-3d='play']");
    const posaBoto = () => {
      botoPlay.innerHTML = icona(enMarxa ? ICONES.pausa : ICONES.play, "");
      botoPlay.setAttribute("aria-label", enMarxa ? "Atura el moviment" : "Posa en marxa");
      afegirLlumDit();
    };
    botoPlay.onclick = () => { enMarxa = !enMarxa; posaBoto(); };
    posaBoto();

    const observador = new ResizeObserver(ajustaMida);
    observador.observe(llenc);
    estat.allibera = () => {
      observador.disconnect();
      controls.dispose();
      escena.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
      pmrem.dispose();
      renderer.dispose();
    };
    avis.hidden = true;
    capa.classList.add("carregat");
  } catch (error) {
    if (estat.tancat) return;
    console.error(error);
    avis.textContent = "No s'ha pogut carregar el model 3D. Comprova la connexió a internet.";
  }
}

// Posa en marxa o atura el dibuix del model (sense tancar-lo)
function actiu3D(actiu) {
  if (!visor3d) return;
  visor3d.actiu = actiu;
  if (actiu && visor3d.repren) visor3d.repren();
}

// Atura el visor (en canviar de pantalla) i allibera la memòria
function tanca3D() {
  if (!visor3d) return;
  visor3d.tancat = true;
  cancelAnimationFrame(visor3d.frame);
  if (visor3d.allibera) visor3d.allibera();
  visor3d = null;
}


/* ---------------------------------------------------------------------
   4.12 GRAFCET DE CADA ESTACIÓ
   La seqüència de funcionament de cada estació, tal com la descriuen els
   manuals de Festo, escrita com a dades. A partir d'aquestes dades l'app
   dibuixa el diagrama (dibuixaGrafcet) i la secció amb què fa cada pas
   i les variables (seccioGrafcet).

   Com s'escriu (la mateixa notació que grafcet.io, norma IEC 60848):
     { pas: 3, accions: ["Q6", "Q7"] }   un pas i les sortides que activa
     { pas: 0, inicial: true }           el pas inicial (doble quadrat)
     { si: "I5" }                        la transició: condició per passar al pas següent
     { si: "I2", torna: 1 }              transició que torna al pas 1
     { tria: [ {nom, sequencia}, ... ] }  divergència en O: es fa només una de les branques
   Condicions:
     A · B    A i B alhora          A + B    A o B
     !A       A no està activat (es dibuixa amb una ratlla a sobre)
     1s/X6    ha passat 1 s des que s'ha activat el pas 6
     Marxa    polsador START del panell de control
   Accions:
     Q0        contínua: la sortida està activa mentre el pas està actiu
     Q2 := 1   memoritzada: s'escriu en activar-se el pas i es manté
   --------------------------------------------------------------------- */
const GRAFCETS = {

  "pick-place": {
    passos: {
      0:  "Posició inicial: carro retirat, ventosa a dalt i separador avançat.",
      1:  "Espera que arribi una peça a l'inici de la cinta.",
      2:  "La cinta porta la peça fins al separador.",
      3:  "La ventosa baixa i agafa una tapa de la rampa.",
      4:  "La ventosa puja amb la tapa.",
      5:  "El carro porta la tapa damunt de la peça.",
      6:  "La ventosa baixa la tapa fins a la peça.",
      7:  "S'atura el buit i la tapa queda col·locada.",
      8:  "La ventosa puja.",
      9:  "El carro torna enrere.",
      10: "El separador es retira i la cinta s'emporta la peça.",
      11: "El separador torna a avançar i la peça arriba al final de la cinta.",
      12: "Espera que es retiri la peça del final de la cinta."
    },
    sequencia: [
      { pas: 0, inicial: true, accions: ["Q2 := 1"] },
      { si: "Marxa · I4 · I6 · !I0" },
      { pas: 1 },
      { si: "I0" },
      { pas: 2, accions: ["Q0"] },
      { si: "I1" },
      { pas: 3, accions: ["Q6", "Q7"] },
      { si: "I7" },
      { pas: 4, accions: ["Q7"] },
      { si: "I6" },
      { pas: 5, accions: ["Q5", "Q7"] },
      { si: "I5" },
      { pas: 6, accions: ["Q6", "Q7"] },
      { si: "1s/X6" },
      { pas: 7, accions: ["Q6"] },
      { si: "!I7" },
      { pas: 8 },
      { si: "I6" },
      { pas: 9, accions: ["Q4"] },
      { si: "I4" },
      { pas: 10, accions: ["Q0", "Q2 := 0"] },
      { si: "!I1" },
      { pas: 11, accions: ["Q0", "Q2 := 1"] },
      { si: "!I2" },
      { pas: 12 },
      { si: "I2", torna: 1 }
    ]
  },

  "distribucio": {
    passos: {
      0: "Posició inicial: empenyedor retirat i cinta aturada.",
      1: "L'empenyedor treu una peça del carregador.",
      2: "L'empenyedor torna enrere.",
      3: "La cinta porta la peça fins al final.",
      4: "Espera que es retiri la peça del final de la cinta. Si el carregador és buit, cal tornar a prémer Marxa."
    },
    sequencia: [
      { pas: 0, inicial: true },
      { si: "Marxa · I4 · !I0 · !I6" },
      { pas: 1, accions: ["Q4"] },
      { si: "I5" },
      { pas: 2 },
      { si: "I4" },
      { pas: 3, accions: ["Q0"] },
      { si: "!I2" },
      { pas: 4 },
      { tria: [
        { nom: "Queden peces",    sequencia: [{ si: "I2 · !I6", torna: 1 }] },
        { nom: "Carregador buit", sequencia: [{ si: "I2 · I6", torna: 0 }] }
      ] }
    ]
  },

  "classificacio": {
    passos: {
      0:  "Posició inicial: cinta aturada, topall avançat i desviadors retirats.",
      1:  "La cinta s'atura i s'espera una peça a l'inici (si cap rampa no és plena).",
      2:  "La cinta porta la peça fins al topall.",
      3:  "Els sensors identifiquen el material i el color de la peça.",
      4:  "Peça negra: es retira el topall i la peça va a la rampa del final.",
      5:  "Peça metàl·lica: avança el desviador 2.",
      6:  "Es retira el topall i la peça cau a la rampa del mig.",
      7:  "El desviador 2 torna enrere.",
      8:  "Peça vermella: avança el desviador 1.",
      9:  "Es retira el topall i la peça cau a la primera rampa.",
      10: "El desviador 1 torna enrere."
    },
    sequencia: [
      { pas: 0, inicial: true },
      { si: "Marxa · !I1 · !I3 · !I2" },
      { pas: 1, accions: ["Q0 := 0"] },
      { si: "I0 · !I2" },
      { pas: 2, accions: ["Q0 := 1"] },
      { si: "I4" },
      { pas: 3 },
      { tria: [
        { nom: "Negra", sequencia: [
          { si: "1s/X3 · !I5 · !I6" }, { pas: 4, accions: ["Q3"] }, { si: "3s/X4" }
        ] },
        { nom: "Metàl·lica", sequencia: [
          { si: "1s/X3 · I6" }, { pas: 5, accions: ["Q2"] }, { si: "I3" },
          { pas: 6, accions: ["Q2", "Q3"] }, { si: "3s/X6" }, { pas: 7 }, { si: "!I3" }
        ] },
        { nom: "Vermella", sequencia: [
          { si: "1s/X3 · I5 · !I6" }, { pas: 8, accions: ["Q1"] }, { si: "I1" },
          { pas: 9, accions: ["Q1", "Q3"] }, { si: "3s/X9" }, { pas: 10 }, { si: "!I1" }
        ] }
      ], torna: 1 }
    ]
  }
};

// Variables que no són a la taula d'entrades i sortides de l'estació
const VARIABLES_PANELL = { "Marxa": "Polsador START del panell de control" };


/* ---------- Disposició: on va cada element del diagrama ----------
   Es calcula per blocs: cada seqüència es dibuixa en una columna (x = 0)
   començant per dalt (y = 0). Les branques d'una divergència són blocs
   que es col·loquen un al costat de l'altre. Els salts enrere (torna)
   es dibuixen al final, per l'esquerra, quan ja se sap on és cada pas. */

// Amplada d'un text (la lletra és monoespaiada: tots els caràcters fan igual)
const ampleText = (text, M) => text.replace(/!/g, "").length * M.caracter;

function blocGrafcet(elements, M, entrada = null, comptador = { n: 0 }) {
  const b = { passos: [], accions: [], transicions: [], linies: [], ors: [], etiquetes: [], salts: [], enllacos: [] };
  let y = 0, calEntrada = false, acabaEnSalt = false;
  let anterior = entrada;                     // sortida de l'element anterior: { id, port }
  const enllaca = (id, port = "top") => { if (anterior) b.enllacos.push({ de: anterior, a: { id, port } }); };

  for (const e of elements) {
    if (e.pas !== undefined) {
      if (calEntrada) { b.linies.push([0, y, 0, y + M.tram]); y += M.tram; calEntrada = false; }
      const id = `step-${e.pas}`;
      enllaca(id);
      b.passos.push({ id, num: e.pas, inicial: Boolean(e.inicial), x: 0, y });
      if (e.accions && e.accions.length) {
        let x = M.pas / 2 + M.accioSeparacio;
        const caixes = e.accions.map((text, k) => {
          const w = Math.max(M.accioMin, ampleText(text, M) + 2 * M.accioMarge);
          const caixa = { id: `action-${e.pas}-${k + 1}`, text, x, w, memoritzada: text.includes(":=") };
          x += w + (M.entreAccions || 0);
          return caixa;
        });
        b.accions.push({ pas: e.pas, y: y + M.pas / 2, caixes });
      }
      anterior = { id, port: "bottom" };
      y += M.pas;
    } else if (e.si !== undefined) {
      const id = `transition-${++comptador.n}`;
      enllaca(id);
      b.linies.push([0, y, 0, y + 2 * M.tram]);
      b.transicions.push({ id, x: 0, y: y + M.tram, text: e.si });
      anterior = { id, port: "bottom" };
      y += 2 * M.tram;
      if (e.torna !== undefined) { b.salts.push({ de: anterior, x: 0, y, a: e.torna }); acabaEnSalt = true; anterior = null; break; }
    } else if (e.tria) {
      // Divergència en O: una línia horitzontal simple i una branca sota cada transició
      const idDiv = `or-${++comptador.n}`;
      enllaca(idDiv);
      const yDiv = y + M.divergencia;
      b.linies.push([0, y, 0, yDiv]);
      const branques = e.tria.map((br, k) => blocGrafcet(br.sequencia, M, { id: idDiv, port: `source-${k}` }, comptador));
      const xs = [0];
      for (let k = 1; k < branques.length; k++) {
        xs[k] = xs[k - 1] + branques[k - 1].dre + M.entreBranques - branques[k].esq;
      }
      b.ors.push({ id: idDiv, tipus: "divergencia", y: yDiv, x1: xs[0] - M.ala, x2: xs[xs.length - 1] + M.ala, xs: xs.slice() });
      const yIni = yDiv + M.etiqueta;
      const finals = [];
      branques.forEach((bb, k) => {
        b.linies.push([xs[k], yDiv, xs[k], yIni]);
        if (e.tria[k].nom) b.etiquetes.push({ x: xs[k] + M.barra / 2 + 6, y: yDiv + M.etiqueta / 2, text: `"${e.tria[k].nom}"` });
        afegeixBloc(b, bb, xs[k], yIni);
        finals.push({ x: xs[k], y: yIni + bb.alt, salt: bb.acabaEnSalt, sortida: bb.sortida });
      });
      const convergents = finals.filter(f => !f.salt);
      if (!convergents.length) { y = Math.max(...finals.map(f => f.y)); acabaEnSalt = true; anterior = null; break; }
      // Convergència en O: les branques s'ajunten en una altra línia simple
      const idConv = `or-${++comptador.n}`;
      const yConv = Math.max(...convergents.map(f => f.y)) + M.convergencia;
      convergents.forEach((f, k) => {
        b.linies.push([f.x, f.y, f.x, yConv]);
        b.enllacos.push({ de: f.sortida, a: { id: idConv, port: `handle-${k}` } });
      });
      b.ors.push({ id: idConv, tipus: "convergencia", y: yConv, x1: convergents[0].x - M.ala,
                   x2: convergents[convergents.length - 1].x + M.ala, xs: convergents.map(f => f.x) });
      anterior = { id: idConv, port: "bottom" };
      y = yConv;
      if (e.torna !== undefined) { b.salts.push({ de: anterior, x: 0, y, a: e.torna }); acabaEnSalt = true; anterior = null; break; }
      calEntrada = true;
    }
  }
  b.alt = y;
  b.acabaEnSalt = acabaEnSalt;
  b.sortida = anterior;
  limitsBloc(b, M);
  return b;
}

// Afegeix el bloc "fill" dins de "b", desplaçat (dx, dy)
function afegeixBloc(b, fill, dx, dy) {
  fill.passos.forEach(p => b.passos.push({ ...p, x: p.x + dx, y: p.y + dy }));
  fill.accions.forEach(a => b.accions.push({ ...a, x0: (a.x0 || 0) + dx, y: a.y + dy }));
  fill.transicions.forEach(t => b.transicions.push({ ...t, x: t.x + dx, y: t.y + dy }));
  fill.linies.forEach(([x1, y1, x2, y2]) => b.linies.push([x1 + dx, y1 + dy, x2 + dx, y2 + dy]));
  fill.ors.forEach(o => b.ors.push({ ...o, y: o.y + dy, x1: o.x1 + dx, x2: o.x2 + dx, xs: o.xs.map(x => x + dx) }));
  fill.etiquetes.forEach(e => b.etiquetes.push({ ...e, x: e.x + dx, y: e.y + dy }));
  fill.salts.forEach(s => b.salts.push({ ...s, x: s.x + dx, y: s.y + dy }));
  fill.enllacos.forEach(e => b.enllacos.push(e));
}

// Calcula fins on arriba el bloc per l'esquerra (esq) i per la dreta (dre)
function limitsBloc(b, M) {
  let esq = -M.pas / 2, dre = M.pas / 2;
  b.passos.forEach(p => { esq = Math.min(esq, p.x - M.pas / 2); dre = Math.max(dre, p.x + M.pas / 2); });
  b.accions.forEach(a => {
    const darrera = a.caixes[a.caixes.length - 1];
    dre = Math.max(dre, (a.x0 || 0) + darrera.x + darrera.w);
    esq = Math.min(esq, (a.x0 || 0) - M.pas / 2);
  });
  b.transicions.forEach(t => {
    esq = Math.min(esq, t.x - M.barra / 2);
    dre = Math.max(dre, t.x + M.barra / 2 + M.textSeparacio + ampleText(t.text, M));
  });
  b.etiquetes.forEach(e => { dre = Math.max(dre, e.x + ampleText(e.text, M) * M.etiquetaEscala); });
  b.ors.forEach(o => { esq = Math.min(esq, o.x1); dre = Math.max(dre, o.x2); });
  b.esq = esq;
  b.dre = dre;
}

// Disposició completa, amb els salts enrere ja traçats per l'esquerra
function disposaGrafcet(sequencia, M) {
  const b = blocGrafcet(sequencia, M);
  const pasNum = {};
  b.passos.forEach(p => { pasNum[p.num] = p; });

  // els salts que van més amunt fan servir el carril de més a l'esquerra i giren més avall,
  // així les línies no es creuen
  const salts = b.salts.slice().sort((s, t) => pasNum[t.a].y - pasNum[s.a].y);
  b.camins = salts.map((s, i) => {
    const desti = pasNum[s.a];
    const xCarril = b.esq - M.carril * (i + 1);
    const yGir = s.y + M.baixadaSalt + M.carril * i * 0.75;
    const yUnio = desti.y - M.unio;
    return {
      a: s.a, de: s,
      punts: [[s.x, s.y], [s.x, yGir], [xCarril, yGir], [xCarril, yUnio], [desti.x, yUnio]],
      // el pas inicial no té cap línia a sobre: n'hi cal un tros fins al quadrat
      tros: pasNum[s.a].inicial || !b.linies.some(([x1, y1, x2, y2]) => x1 === desti.x && y2 === desti.y)
        ? [desti.x, yUnio, desti.x, desti.y] : null,
      fletxa: [xCarril, (yGir + yUnio) / 2]
    };
  });
  b.esq = Math.min(b.esq, ...b.camins.map(c => c.punts[2][0]));
  b.dalt = Math.min(0, ...b.camins.map(c => c.punts[3][1]));
  b.baix = Math.max(b.alt, ...b.camins.map(c => c.punts[1][1]));
  return b;
}


/* ---------- Dibuix (SVG) ---------- */
const MIDES_DIBUIX = {
  pas: 44, tram: 22, barra: 28, ala: 14,
  caracter: 8.4, lletra: 14,            // IBM Plex Mono de 14 px: 0,6 × 14 = 8,4 px per caràcter
  accioSeparacio: 20, accioAlt: 30, accioMin: 40, accioMarge: 10,
  textSeparacio: 10, divergencia: 16, convergencia: 12, etiqueta: 26, etiquetaEscala: .86,
  entreBranques: 34, carril: 18, baixadaSalt: 14, unio: 12
};

// Escriu una condició o una acció amb les negacions (!A) com una ratlla a sobre
function textGrafcet(text, x, y, M, color, mida = M.lletra) {
  const net = text.replace(/!/g, "");
  const ample = net.length * M.caracter * mida / M.lletra;
  let ratlles = "", pos = 0;
  text.replace(/!?[^\s·+]+|[\s·+]/g, tros => {
    if (tros.startsWith("!")) {
      const x1 = x + pos * M.caracter * mida / M.lletra;
      const x2 = x1 + (tros.length - 1) * M.caracter * mida / M.lletra;
      ratlles += `<line x1="${x1.toFixed(1)}" y1="${(y - mida * .86).toFixed(1)}" x2="${x2.toFixed(1)}" y2="${(y - mida * .86).toFixed(1)}"/>`;
      pos += tros.length - 1;
    } else pos += tros.length;
    return tros;
  });
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" textLength="${ample.toFixed(1)}" lengthAdjust="spacingAndGlyphs">${textSegur(net)}</text>` +
         (ratlles ? `<g stroke="${color}" stroke-width="1.2">${ratlles}</g>` : "");
}

function dibuixaGrafcet(def, { paper = false } = {}) {
  const M = MIDES_DIBUIX;
  const d = disposaGrafcet(def.sequencia, M);
  const tinta = paper ? "#10202C" : "currentColor";
  const suau = paper ? "#556672" : "var(--text-suau)";
  const marge = 14;
  const x0 = d.esq - marge, y0 = d.dalt - marge;
  const w = d.dre - d.esq + 2 * marge, h = d.baix - d.dalt + 2 * marge;
  const n = v => v.toFixed(1);
  let s = "";

  // línies d'enllaç
  s += `<g stroke="${tinta}" stroke-width="1.6" fill="none">`;
  d.linies.forEach(([x1, y1, x2, y2]) => { s += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/>`; });
  // divergències i convergències en O (línia simple)
  d.ors.forEach(o => { s += `<line x1="${n(o.x1)}" y1="${n(o.y)}" x2="${n(o.x2)}" y2="${n(o.y)}"/>`; });
  // salts enrere
  d.camins.forEach(c => {
    s += `<polyline points="${c.punts.map(p => p.map(n).join(",")).join(" ")}"/>`;
    if (c.tros) s += `<line x1="${n(c.tros[0])}" y1="${n(c.tros[1])}" x2="${n(c.tros[2])}" y2="${n(c.tros[3])}"/>`;
  });
  s += `</g>`;
  d.camins.forEach(c => {
    const [fx, fy] = c.fletxa;
    s += `<path d="M${n(fx - 5)},${n(fy + 4)} L${n(fx)},${n(fy - 5)} L${n(fx + 5)},${n(fy + 4)} Z" fill="${tinta}"/>`;
  });

  // transicions: barra i condició
  s += `<g fill="${tinta}" font-family="IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace" font-size="${M.lletra}" font-weight="500">`;
  d.transicions.forEach(t => {
    s += `<rect x="${n(t.x - M.barra / 2)}" y="${n(t.y - 1.6)}" width="${M.barra}" height="3.2"/>`;
    s += textGrafcet(t.text, t.x + M.barra / 2 + M.textSeparacio, t.y + M.lletra * .36, M, tinta);
  });
  s += `</g>`;

  // passos
  s += `<g stroke="${tinta}" stroke-width="1.6" fill="${paper ? "#FFFFFF" : "var(--superficie)"}">`;
  d.passos.forEach(p => {
    s += `<rect x="${n(p.x - M.pas / 2)}" y="${n(p.y)}" width="${M.pas}" height="${M.pas}"/>`;
    if (p.inicial) s += `<rect x="${n(p.x - M.pas / 2 + 4)}" y="${n(p.y + 4)}" width="${M.pas - 8}" height="${M.pas - 8}"/>`;
  });
  s += `</g>`;
  s += `<g fill="${tinta}" font-family="IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace" font-size="16" font-weight="600" text-anchor="middle">`;
  d.passos.forEach(p => { s += `<text x="${n(p.x)}" y="${n(p.y + M.pas / 2 + 5.6)}">${p.num}</text>`; });
  s += `</g>`;

  // accions
  d.accions.forEach(a => {
    const pas = d.passos.find(p => p.num === a.pas);
    const xBase = pas.x;
    const yMig = a.y;
    const primera = a.caixes[0];
    s += `<line x1="${n(xBase + M.pas / 2)}" y1="${n(yMig)}" x2="${n(xBase + primera.x)}" y2="${n(yMig)}" stroke="${tinta}" stroke-width="1.6"/>`;
    a.caixes.forEach(c => {
      const x = xBase + c.x;
      s += `<rect x="${n(x)}" y="${n(yMig - M.accioAlt / 2)}" width="${n(c.w)}" height="${M.accioAlt}" fill="${paper ? "#FFFFFF" : "var(--superficie)"}" stroke="${tinta}" stroke-width="1.6"/>`;
      const xt = x + (c.w - ampleText(c.text, M)) / 2;
      s += `<g fill="${tinta}" font-family="IBM Plex Mono, ui-monospace, Menlo, Consolas, monospace" font-size="${M.lletra}" font-weight="500">${textGrafcet(c.text, xt, yMig + M.lletra * .36, M, tinta)}</g>`;
      if (c.memoritzada) {
        // acció memoritzada en activar-se el pas: fletxa cap amunt sota la caixa (IEC 60848)
        const fx = x + 9, fy = yMig + M.accioAlt / 2;
        s += `<line x1="${n(fx)}" y1="${n(fy + 12)}" x2="${n(fx)}" y2="${n(fy + 3)}" stroke="${tinta}" stroke-width="1.6"/>`;
        s += `<path d="M${n(fx - 4)},${n(fy + 6)} L${n(fx)},${n(fy)} L${n(fx + 4)},${n(fy + 6)} Z" fill="${tinta}"/>`;
      }
    });
  });

  // noms de les branques (comentaris entre cometes)
  s += `<g fill="${suau}" font-family="Barlow, system-ui, sans-serif" font-size="13" font-style="italic" font-weight="600">`;
  d.etiquetes.forEach(e => { s += `<text x="${n(e.x)}" y="${n(e.y + 4)}">${textSegur(e.text)}</text>`; });
  s += `</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(x0)} ${n(y0)} ${n(w)} ${n(h)}" width="${n(w)}" height="${n(h)}"` +
         ` role="img">${paper ? `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" fill="#FFFFFF"/>` : ""}${s}</svg>`;
}


/* ---------- Secció del Grafcet a la pantalla de l'estació ---------- */

// Variables que fa servir el Grafcet, amb el símbol i la descripció de la taula
// d'entrades i sortides: primer Marxa, després les entrades i les sortides
function variablesGrafcet(id) {
  const textos = [];
  const recull = seq => seq.forEach(e => {
    if (e.si) textos.push(e.si);
    if (e.accions) textos.push(...e.accions);
    if (e.tria) e.tria.forEach(branca => recull(branca.sequencia));
  });
  recull(GRAFCETS[id].sequencia);
  const noms = new Set(textos.join(" ").match(/\b(Marxa|[IQ]\d)\b/g));
  const ordre = nom => nom === "Marxa" ? 0 : (nom[0] === "I" ? 10 : 20) + Number(nom.slice(1));
  return [...noms].sort((a, b) => ordre(a) - ordre(b)).map(nom => {
    if (VARIABLES_PANELL[nom]) return [nom, "Panell", VARIABLES_PANELL[nom]];
    const fila = ESTACIONS[id].entradesSortides.find(f => f[0] === nom);
    return fila ? [nom, fila[1], fila[2]] : [nom, "", ""];
  });
}

function seccioGrafcet(id) {
  const g = GRAFCETS[id];
  const enllac = ESTACIONS[id].grafcet;
  const passos = Object.entries(g.passos).map(([num, text]) => `
    <li${num === "0" ? ' class="inicial"' : ""}><b>${num}</b><span>${textSegur(text)}</span></li>`).join("");
  const variables = variablesGrafcet(id).map(([nom, simbol, text]) => `
    <li><code>${nom}</code><span class="simbol">${textSegur(simbol)}</span><span>${textSegur(text)}</span></li>`).join("");
  return `
    <section class="grafcet-es" id="grafcet-es" hidden aria-labelledby="titol-grafcet">
      <h2 id="titol-grafcet">Grafcet</h2>
      <p class="intro">Seqüència de funcionament segons el manual de Festo, amb la notació de la norma IEC 60848.</p>
      <div class="grafcet-dibuix">${dibuixaGrafcet(g)}</div>
      ${enllac ? `<div class="grafcet-enllacos">
        <a class="info-enllac liquid" href="${textSegur(enllac)}" target="_blank" rel="noopener">Obre a grafcet.io ${icona(ICONES.extern, "icona-petita")}</a>
      </div>` : ""}
      <h3>Què fa cada pas</h3>
      <ol class="passos-grafcet">${passos}</ol>
      <h3>Variables</h3>
      <ul class="variables-grafcet">${variables}</ul>
      <h3>Com es llegeix</h3>
      <ul class="notacio-grafcet">
        <li><code>I4 · I6</code><span>Les dues condicions alhora.</span></li>
        <li><code><span class="no">I0</span></code><span>La ratlla de sobre vol dir que el senyal no hi és.</span></li>
        <li><code>1s/X6</code><span>Ha passat 1 segon des que s'ha activat el pas 6.</span></li>
        <li><code><span class="caixa">Q0</span></code><span>Sortida activa mentre el pas està actiu.</span></li>
        <li><code><span class="caixa">Q2 := 1</span>↑</code><span>Sortida que es posa a 1 en entrar al pas i s'hi queda.</span></li>
        <li><code>↑ 1</code><span>Línia que torna al pas indicat.</span></li>
      </ul>
    </section>`;
}


/* ---------------------------------------------------------------------
   4.13 VIDRE LÍQUID (com els botons d'iOS)
   Quan es prem un botó amb la classe "liquid":
     - es marca com a "premut" (el CSS el fa créixer amb un rebot),
     - la llum es col·loca just sota el dit,
     - el botó s'estira uns píxels cap a on es mou el dit.
   Quan es deixa anar, tot torna a lloc.
   --------------------------------------------------------------------- */
let botoPremut = null;     // el botó que s'està prement ara mateix

// Afegeix l'element de llum a cada botó de vidre líquid (si encara no en té)
function afegirLlumDit() {
  document.querySelectorAll(".liquid").forEach(boto => {
    if (!boto.querySelector(":scope > .llum-dit")) {
      boto.insertAdjacentHTML("beforeend", '<span class="llum-dit" aria-hidden="true"></span>');
    }
  });
}

// Guarda on és el dit dins del botó i retorna la posició de -1 a 1
// (i la mida del botó)
function posicioDelDit(boto, event) {
  const caixa = boto.getBoundingClientRect();
  const x = event.clientX - caixa.left;
  const y = event.clientY - caixa.top;
  boto.style.setProperty("--x", `${x}px`);
  boto.style.setProperty("--y", `${y}px`);
  const limita = valor => Math.max(-1, Math.min(1, valor));
  return { dx: limita(x / caixa.width * 2 - 1), dy: limita(y / caixa.height * 2 - 1), caixa };
}

function activarVidreLiquid() {
  document.addEventListener("pointerdown", event => {
    const boto = event.target.closest(".liquid");
    if (!boto) return;
    botoPremut = boto;
    posicioDelDit(boto, event);
    boto.classList.add("premut");
  });

  document.addEventListener("pointermove", event => {
    if (botoPremut) {
      const { dx, dy, caixa } = posicioDelDit(botoPremut, event);
      if (moviment() === "auto") return;                       // menys moviment: no s'estira
      const estil = botoPremut.style;
      estil.setProperty("--tx", `${dx * 3}px`);               // es mou fins a 3 px cap al dit
      estil.setProperty("--ty", `${dy * 2}px`);
      estil.setProperty("--sx", 1 + Math.abs(dx) * 5 / caixa.width);   // i s'estira fins a 5 px
      estil.setProperty("--sy", 1 + Math.abs(dy) * 4 / caixa.height);
    } else if (event.pointerType === "mouse") {
      const boto = event.target.closest(".liquid");
      if (boto) posicioDelDit(boto, event);                  // la llum segueix el ratolí
    }
  });

  const deixarAnar = () => {
    if (!botoPremut) return;
    botoPremut.classList.remove("premut");
    ["--tx", "--ty", "--sx", "--sy"].forEach(v => botoPremut.style.removeProperty(v));
    botoPremut = null;
  };
  document.addEventListener("pointerup", deixarAnar);
  document.addEventListener("pointercancel", deixarAnar);   // per exemple, si es fa scroll
}

// Mou la lent del filtre sota l'opció triada
function moureLent() {
  const filtre = document.querySelector(".filtre");
  if (!filtre) return;
  const actiu = filtre.querySelector('button[aria-pressed="true"]');
  const lent = filtre.querySelector(".lent");
  if (!actiu || !actiu.offsetWidth) return;                 // la taula encara està amagada
  lent.style.width = `${actiu.offsetWidth}px`;
  lent.style.translate = `${actiu.offsetLeft}px 0`;
}


/* ---------------------------------------------------------------------
   4.14 ARRENCADA
   Quan la pàgina s'ha acabat de carregar (també les imatges de la PART 5),
   es mostra la primera pantalla. Quan canvia l'adreça (#...), es torna a dibuixar.
   La tecla Esc tanca el visor de la foto.
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", mostrarPantalla);
window.addEventListener("hashchange", mostrarPantalla);
document.addEventListener("keydown", event => {
  const visor = document.getElementById("visor");
  if (!visor || visor.hidden) return;
  if (event.key === "Escape") tancarVisor();
  if (event.key === "+" || event.key === "=") zoomVisor.pas(+1);   // al visor, + i -
  if (event.key === "-") zoomVisor.pas(-1);                        // amplien i redueixen
});
window.addEventListener("resize", moureLent);
activarVidreLiquid();

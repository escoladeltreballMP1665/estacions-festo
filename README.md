# Estacions Festo MPS · MP1765

App web de les estacions Festo MPS del laboratori de Mecatrònica Industrial de l'Institut Escola del Treball de Barcelona: foto interactiva amb els elements, vídeo de simulació, model 3D, entrades i sortides del PLC i Grafcet de cada estació.

## Adreces

| Pantalla | Adreça |
|---|---|
| Inici | `/` |
| Pick & Place | `/#pick-place` |
| Distributing (distribució) | `/#distribucio` |
| Sorting (classificació) | `/#classificacio` |

Els codis QR de la carpeta `qr/` porten directament a cada estació.

## Estructura

```
index.html          capçalera de la pàgina i caixa buida on es dibuixa l'app
css/estils.css      colors, mides, posició i animacions
js/app.js           dades de les estacions, pantalles i botons
js/fitxers.js       on són les fotos, els vídeos i els models 3D
img/                logo, fotos de les estacions, portades i retalls dels elements
videos/             vídeos de simulació de Festo (mp4)
models3d/           models 3D de Festo comprimits (gzip)
qr/                 codis QR de cada estació
```

El que normalment es canvia és a `js/app.js`:

- **4.2 DADES**: noms, enllaços i taules d'entrades i sortides.
- **4.12 GRAFCET**: la seqüència de funcionament de cada estació.

## Publicar-la (GitHub Pages)

*Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)`.*
Al cap d'un minut la web és a `https://USUARI.github.io/NOM-DEL-REPOSITORI/`.

## Provar-la a l'ordinador

Cal obrir-la amb un servidor (els models 3D no es carreguen obrint l'`index.html` directament):

```
python -m http.server
```

i anar a <http://localhost:8000>.

## Crèdits

Fotos, vídeos de simulació i models 3D: [Festo Didactic](https://ip.festo-didactic.com/InfoPortal/MPS/Hardware/EN/Stations.html). El visor 3D fa servir [three.js](https://threejs.org/).

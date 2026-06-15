# La Neverita — Helados Artesanales
## Estructura del proyecto

```
la-neverita/
│
├── index.html          ← Página principal (abre este en el navegador)
│
├── css/
│   └── styles.css      ← Todos los estilos (tokens, layout, componentes)
│
├── js/
│   └── app.js          ← Catálogo, carrito, filtros, WhatsApp
│
└── images/
    ├── logo.svg              ← Logo de La Neverita
    ├── hero-illustration.svg ← Ilustración del hero
    ├── helado.svg            ← Imagen para productos de helados
    ├── bebida.svg            ← Imagen para productos de bebidas
    ├── postre.svg            ← Imagen para productos de postres
    └── whatsapp.svg          ← Ícono de WhatsApp
```

## Cómo usar

1. Abre `index.html` en tu navegador (doble clic o arrastra a Chrome/Firefox).
2. **Todos los archivos deben estar juntos** en la misma carpeta para que funcione.

## Personalización rápida

### Cambiar número de WhatsApp
Abre `js/app.js` y edita la línea:
```js
const WA_NUMBER = '573204033985'; // código país + número, sin "+"
```

### Agregar o editar productos
En `js/app.js`, busca el array `catalog` y agrega/modifica entradas:
```js
{ id:15, name:'Nuevo Sabor', emoji:'🍒', price:10000, cat:'helados',
  desc:'Descripción del producto.', featured:false, isNew:true }
```
- `cat` puede ser: `'helados'`, `'bebidas'` o `'postres'`
- `featured: true` lo muestra en la sección "Más pedidos"
- `isNew: true` muestra la etiqueta "Nuevo"

### Cambiar colores o fuentes
Edita las variables CSS en `css/styles.css` dentro del bloque `:root { ... }`.

## Tecnologías
- HTML5 semántico
- CSS3 con custom properties (variables)
- JavaScript vanilla (sin librerías)
- SVGs propios (sin dependencias externas de imágenes)
- Google Fonts (DM Serif Display + DM Sans)

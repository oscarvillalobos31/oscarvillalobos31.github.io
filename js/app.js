/* ============================================
   La Neverita — app.js
   Catálogo, carrito, filtros, WhatsApp
============================================ */

/* ------------------------------------------
   CONFIG — cambia tu número aquí
   Formato: código país + número, sin "+"
------------------------------------------ */
const WA_NUMBER = '573204033985'; 

/* ------------------------------------------
   IMÁGENES POR CATEGORÍA
   Rutas relativas a index.html
------------------------------------------ */ 
const CAT_SVG = {
  helados: 'images/helado.svg',
  bebidas: 'images/bebida.svg',
  postres: 'images/postre.svg',
};

const THUMB_BG = {
  helados: 'linear-gradient(135deg,#FFE8EF,#FFF0E8)',
  bebidas: 'linear-gradient(135deg,#D6F5F3,#EAF9FF)',
  postres: 'linear-gradient(135deg,#FFF3D6,#FFE8F5)',
};

/* ------------------------------------------
   CATÁLOGO DE PRODUCTOS
------------------------------------------ */
const catalog = [
  // HELADOS
  // { id:1,  name:'Cono Vainilla Suave',  emoji:'🍦', price:8000,  cat:'helados', desc:'Cremoso y clásico, derrite en la boca.',       featured:true,  isNew:false },
  // { id:2,  name:'Copa de Fresa',        emoji:'🍓', price:10000, cat:'helados', desc:'Fresas naturales, crema batida y sirope.',      featured:true,  isNew:false },
  // { id:3,  name:'Doble Chocolate',      emoji:'🍫', price:12000, cat:'helados', desc:'Intenso, oscuro, puro placer cacaotero.',       featured:true,  isNew:false },
  { id:4,  name:'Coco-Oreo',       emoji:'🥥', price:10000, cat:'helados', desc:'Mango de la región, sin aditivos.',             featured:false, isNew:false, img:'images/coco-oreo.png' },

  { id:5,  name:'Copo de felicidades',      emoji:'🌿', price:11000, cat:'helados', desc:'Fresco, con trozos de chocolate negro.',        featured:false, isNew:true,  img:'images/copo-de-felicidades.png' },

  { id:6,  name:'Fresas con crema',     emoji:'🍧', price:11000,  cat:'helados', desc:'Cítrico y refrescante, cero grasa.',           featured:false, isNew:true,  img:'images/fresas-con-crema.png' },
  // BEBIDAS
  // { id:7,  name:'Malteada de Oreo',     emoji:'🥛', price:14000, cat:'bebidas', desc:'Espesa, fría y con galleta triturada.',        featured:true,  isNew:false },
  { id:8,  name:'Fresas tentacion',   emoji:'🍹', price:11000, cat:'bebidas', desc:'Mix de frutas frescas al momento.',            featured:false, isNew:false, img:'images/fresas-tentación.png'  },

  { id:9,  name:'nube de fresa',     emoji:'🥥', price:9000,  cat:'bebidas', desc:'La combinación perfecta para el calor.',      featured:false, isNew:false, img:'images/nubefresa.png' },

  { id:10, name:'nube de algodón',    emoji:'🍓', price:13000, cat:'bebidas', desc:'Fresas reales, helado y leche entera.',        featured:false, isNew:true, img:'images/NubeAlgodon.png'  },
  // POSTRES
  // { id:11, name:'Brownie con Helado',   emoji:'🍮', price:13000, cat:'postres', desc:'Tibio por dentro, frío por fuera.',            featured:true,  isNew:false },
  { id:12, name:'Fresas con Crema Premium',     emoji:'🫓', price:11000, cat:'postres', desc:'Fino, dorado, con fresa y Nutella.',           featured:false, isNew:false, img:'images/FresasconCremaPremium.png' },

  { id:13, name:'Peletas de Helado Oreo',      emoji:'🧇', price:15000, cat:'postres', desc:'Con helado, miel y frutas mixtas.',            featured:false, isNew:false, img:'images/peletasdeheladooreo.png' },
  
  { id:14, name:'Sundae Clásico',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/paletasdefresa.png' },

  { id:15, name:'Paletas tres leches',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/peletatresleches.png' },

  { id:16, name:'Sundae Clásico',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/peletamaracuya.png' },

   { id:17, name:'Mangolada',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/mangolada.jpg' },

    { id:17, name:'Mangonada',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/mangonada.jpg' }
    ,

     { id:17, name:'Ensalada de frutas',       emoji:'🍨', price:12000, cat:'postres', desc:'Helado, caramelo casero y maní tostado.',      featured:false, isNew:false, img:'images/ensaladadefrutas.jpg' }
    ,
];

/* ------------------------------------------
   ESTADO
------------------------------------------ */
let cart = {};
let activeTab = 'todos';

/* ------------------------------------------
   UTILIDADES
------------------------------------------ */
const fmt = n => '$' + n.toLocaleString('es-CO');

const catLabel = cat => ({ helados:'Helado', bebidas:'Bebida', postres:'Postre' }[cat] || cat);

function productImg(catOrProduct, className = 'product-svg') {
  let src = '';
  let alt = '';
  let previewAttrs = '';
  if (typeof catOrProduct === 'string') {
    src = CAT_SVG[catOrProduct] || '';
  } else if (catOrProduct && typeof catOrProduct === 'object') {
    src = catOrProduct.img || CAT_SVG[catOrProduct.cat] || '';
    alt = catOrProduct.name || '';
    previewAttrs = `data-preview-src="${src}" data-preview-alt="${alt}"`;
  }
  return `<img src="${src}" alt="${alt}" class="${className} product-preview" ${previewAttrs} loading="lazy">`;
}

/* ------------------------------------------
   RENDER — FEATURED STRIP
------------------------------------------ */ 
function renderFeatured(filter) {
  const wrap   = document.getElementById('featured-wrap');
  const scroll = document.getElementById('featured-scroll');
  scroll.innerHTML = '';

  const items = filter === 'todos'
    ? catalog.filter(p => p.featured)
    : catalog.filter(p => p.featured && p.cat === filter);

  wrap.style.display = items.length ? '' : 'none';

  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'feat-card';
    card.innerHTML = `
      <div class="feat-thumb" style="background:${THUMB_BG[p.cat]}">
        <span class="feat-badge">⭐ Popular</span>
        ${productImg(p)}
      </div>
      <div class="feat-body">
        <div class="feat-name">${p.name}</div>
        <div class="feat-desc">${p.desc}</div>
        <div class="feat-footer">
          <span class="feat-price">${fmt(p.price)}</span>
          <button class="btn-add" id="fadd-${p.id}" onclick="addItem(${p.id})">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar
          </button>
        </div>
      </div>
    `;
    scroll.appendChild(card);
    attachImagePreview(card);
  });
}

/* ------------------------------------------
   RENDER — MAIN PRODUCT GRID
------------------------------------------ */
function renderGrid(filter) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  const all     = filter === 'todos' ? catalog : catalog.filter(p => p.cat === filter);
  const visible = filter === 'todos' ? all.filter(p => !p.featured) : all;

  document.getElementById('grid-heading').textContent =
    { todos:'Menú completo', helados:'Helados', bebidas:'Bebidas', postres:'Postres' }[filter] || 'Menú';

  visible.forEach(p => {
    const card = document.createElement('div');
    card.className = 'prod-card';
    card.innerHTML = `
      <div class="prod-thumb" data-cat="${p.cat}">
        ${p.isNew ? '<span class="prod-new">Nuevo</span>' : ''}
        ${productImg(p)}
      </div>
      <div class="prod-body">
        <div class="prod-cat-tag">${catLabel(p.cat)}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-footer">
          <span class="prod-price">${fmt(p.price)}</span>
          ${p.name && p.name.toLowerCase().includes('ensalada')
            ? `<button class="btn-add btn-choose" onclick="openFruitPicker(${p.id})">Escoger frutas</button>`
            : `<button class="btn-add" id="gadd-${p.id}" onclick="addItem(${p.id})">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar
              </button>`}
        </div>
      </div>
    `;
    grid.appendChild(card);
    attachImagePreview(card);
  });
}

/* ------------------------------------------
   TABS — FILTER
------------------------------------------ */
function filterTab(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeTab = cat;
  renderFeatured(cat);
  renderGrid(cat);
}

/* ------------------------------------------
   CARRITO — AGREGAR
------------------------------------------ */
function addItem(id) {
  const item = catalog.find(p => p.id === id);
  if (!item) return;
  if (cart[id]) cart[id].qty++;
  else cart[id] = { item, qty: 1 };
  syncCartUI();
  showToast(`${item.emoji}  ${item.name} añadido`);
  flashAddBtn(id);
}

function flashAddBtn(id) {
  ['fadd-', 'gadd-'].forEach(prefix => {
    const btn = document.getElementById(prefix + id);
    if (!btn) return;
    btn.classList.add('added');
    btn.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Agregado
    `;
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar
      `;
    }, 1400);
  });
}

/* ------------------------------------------
   CARRITO — CAMBIAR CANTIDAD / VACIAR
------------------------------------------ */
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  syncCartUI();
}

function clearCart() {
  if (!Object.keys(cart).length) return;
  cart = {};
  syncCartUI();
  showToast('Pedido vaciado');
}

/* ------------------------------------------
   CARRITO — SINCRONIZAR UI
------------------------------------------ */
function syncCartUI() {
  const entries    = Object.values(cart);
  const totalQty   = entries.reduce((s, e) => s + e.qty, 0);
  const totalPrice = entries.reduce((s, e) => s + e.qty * e.item.price, 0);

  // Badge del nav
  const badge = document.getElementById('cart-count');
  badge.textContent = totalQty;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 400);

  // Lista en el drawer
  const container = document.getElementById('drawer-items');
  container.innerHTML = '';

  if (!entries.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <div class="empty-title">Tu pedido está vacío</div>
        <div class="empty-hint">Agrega helados y postres desde el menú</div>
      </div>
    `;
  } else {
    entries.forEach(({ item: p, qty }) => {
      const row = document.createElement('div');
      row.className = 'ci';
      row.innerHTML = `
        <div class="ci-thumb">${p.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          <div class="ci-unit">${fmt(p.price)} c/u</div>
        </div>
        <div class="ci-qty">
          <button class="ci-btn del" onclick="changeQty(${p.id},-1)" aria-label="Reducir">−</button>
          <span class="ci-n">${qty}</span>
          <button class="ci-btn" onclick="changeQty(${p.id},1)" aria-label="Aumentar">+</button>
        </div>
        <div class="ci-total">${fmt(p.price * qty)}</div>
      `;
      container.appendChild(row);
    });
  }

  // Resumen
  document.getElementById('order-summary').innerHTML = `
    <div class="os-row">
      <span>Subtotal (${totalQty} producto${totalQty !== 1 ? 's' : ''})</span>
      <span>${fmt(totalPrice)}</span>
    </div>
    <div class="os-row"><span>Domicilio</span><span>A coordinar 🛵</span></div>
    <div class="os-row divider total"><span>Total</span><span>${fmt(totalPrice)}</span></div>
  `;
}

/* ------------------------------------------
   DRAWER — ABRIR / CERRAR
------------------------------------------ */
function openCart() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('scrim').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('scrim').classList.remove('open');
  document.body.style.overflow = '';
}

/* ------------------------------------------
   TOAST
------------------------------------------ */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2400);
}

/* ------------------------------------------
   WHATSAPP
------------------------------------------ */
function sendWA() {
  const entries = Object.values(cart);
  if (!entries.length) { showToast('Agrega productos primero'); return; }

  const totalPrice = entries.reduce((s, e) => s + e.qty * e.item.price, 0);
  const lines = entries.map(({ item: p, qty }) =>
    `• ${p.name} x${qty} — ${fmt(p.price * qty)}`
  ).join('\n');

  const msg =
    `Hola 👋 Quiero realizar el siguiente pedido en *La Neverita* 🍦\n\n` +
    `${lines}\n\n` +
    `*Total: ${fmt(totalPrice)}*\n\n` +
    `¡Gracias!`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ------------------------------------------
   TECLADO — cerrar con Escape
------------------------------------------ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

/* ------------------------------------------
   INIT
------------------------------------------ */
// Logo lightbox handlers
function openLogoLightbox() {
  const lb = document.getElementById('logo-lightbox');
  if (!lb) return;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLogoLightbox() {
  const lb = document.getElementById('logo-lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function openProductPreview(src, alt) {
  const modal = document.getElementById('product-preview-modal');
  if (!modal) return;
  modal.querySelector('img').src = src;
  modal.querySelector('img').alt = alt;
  modal.querySelector('.preview-label').textContent = alt || 'Imagen del producto';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductPreview() {
  const modal = document.getElementById('product-preview-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function attachImagePreview(card) {
  const previewImages = card.querySelectorAll('.product-preview');
  previewImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.onclick = () => openProductPreview(img.dataset.previewSrc, img.dataset.previewAlt);
  });
}

// init binding (script is loaded at end of body)
(() => {
  const link = document.getElementById('logo-link');
  if (link) link.addEventListener('click', e => { e.preventDefault(); openLogoLightbox(); });

  const lb = document.getElementById('logo-lightbox');
  if (lb) {
    lb.addEventListener('click', e => {
      if (e.target.classList.contains('lightbox-close') || e.target.classList.contains('lightbox-backdrop') || e.target.id === 'logo-lightbox') {
        closeLogoLightbox();
      }
    });
  }

  const preview = document.getElementById('product-preview-modal');
  if (preview) {
    preview.addEventListener('click', e => {
      if (e.target.classList.contains('lightbox-close') || e.target.classList.contains('lightbox-backdrop') || e.target.id === 'product-preview-modal') {
        closeProductPreview();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLogoLightbox();
      closeProductPreview();
      closeFruitPicker();
    }
  });
})();

/* ------------------------------------------
   FRUIT PICKER
------------------------------------------ */
const AVAILABLE_FRUITS = [
  { id: 'mango', label: 'Mango' },
  { id: 'fresa', label: 'Fresa' },
  { id: 'banano', label: 'Banano' },
  { id: 'kiwi', label: 'Kiwi' },
  { id: 'pina', label: 'Piña' },
  { id: 'melon', label: 'Melón' },
  { id: 'papaya', label: 'Papaya' },
  { id: 'sandia', label: 'Sandía' },
  { id: 'manzana', label: 'Manzana' },
  { id: 'pera', label: 'Pera' },
  { id: 'uva', label: 'Uva' },
  { id: 'durazno', label: 'Durazno' }
];

let _fruitPickingFor = null;

function openFruitPicker(id) {
  const product = catalog.find(p => p.id === id || p.name && p.name.toLowerCase().includes('ensalada'));
  if (!product) return;
  _fruitPickingFor = product;
  const modal = document.getElementById('fruit-modal');
  const list = modal.querySelector('.fruit-list');
  list.innerHTML = '';
  AVAILABLE_FRUITS.forEach(f => {
    const div = document.createElement('label');
    div.className = 'fruit-item';
    div.innerHTML = `<input type="checkbox" name="fruit" value="${f.label}"> <span>${f.label}</span>`;
    list.appendChild(div);
  });
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // bind add button
  const addBtn = document.getElementById('fruit-add-btn');
  if (addBtn) {
    addBtn.onclick = e => { e.preventDefault(); confirmFruitSelection(); };
  }

  // close handlers
  modal.addEventListener('click', fruitModalClickHandler);
}

function fruitModalClickHandler(e) {
  if (e.target.classList.contains('lightbox-close') || e.target.classList.contains('lightbox-backdrop') || e.target.id === 'fruit-modal') {
    closeFruitPicker();
  }
}

function closeFruitPicker() {
  const modal = document.getElementById('fruit-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modal.removeEventListener('click', fruitModalClickHandler);
  _fruitPickingFor = null;
}

function confirmFruitSelection() {
  const modal = document.getElementById('fruit-modal');
  const checked = Array.from(modal.querySelectorAll('input[name="fruit"]:checked')).map(i => i.value);
  if (!_fruitPickingFor) return closeFruitPicker();

  // create a unique cart key based on id + selections
  const key = `${_fruitPickingFor.id}:${checked.join(',')}`;
  const item = { ..._fruitPickingFor, name: `${_fruitPickingFor.name}${checked.length ? ' (' + checked.join(', ') + ')' : ''}` };
  if (cart[key]) cart[key].qty++;
  else cart[key] = { item, qty: 1 };

  syncCartUI();
  showToast(`${_fruitPickingFor.emoji} ${item.name} añadido`);
  closeFruitPicker();
}

renderFeatured('todos');
renderGrid('todos');
syncCartUI();

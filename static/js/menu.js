// menu.js – carta pública
let allItems = [];

async function loadMenu() {
  const res = await fetch("/api/menu");
  allItems = await res.json();
  renderMenu("Todos");
}

const categoryImages = {
  "Pollos": [
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c4?w=400&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&q=80",
  ],
  "Acompañamientos": [
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  ],
  "Salsas": [
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  ],
  "Bebidas": [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
    "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&q=80",
  ]
};
const catCounters = {};

function getImage(categoria) {
  const imgs = categoryImages[categoria] || ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80"];
  catCounters[categoria] = (catCounters[categoria] || 0);
  const img = imgs[catCounters[categoria] % imgs.length];
  catCounters[categoria]++;
  return img;
}

function renderMenu(cat) {
  const grid = document.getElementById("menuGrid");
  Object.keys(catCounters).forEach(k => catCounters[k] = 0);
  const filtered = cat === "Todos" ? allItems : allItems.filter(i => i.categoria === cat);
  const available = filtered.filter(i => i.disponible);
  const unavailable = filtered.filter(i => !i.disponible);
  const sorted = [...available, ...unavailable];

  if (sorted.length === 0) {
    grid.innerHTML = `<p class="menu-loading">No hay platos en esta categoría.</p>`;
    return;
  }

  grid.innerHTML = sorted.map(item => `
    <div class="menu-card ${item.disponible ? "" : "unavailable"}">
      <img src="${getImage(item.categoria)}" alt="${item.nombre}" class="menu-card-img"/>
      <div class="menu-card-body">
        <div class="menu-card-header">
          <span class="menu-card-name">${item.nombre}</span>
          <span class="menu-card-price">S/ ${item.precio.toFixed(2)}</span>
        </div>
        <div class="menu-card-cat">${categoryEmoji(item.categoria)} ${item.categoria}</div>
        <div class="menu-card-desc">${item.descripcion || ""}</div>
        ${!item.disponible ? '<span class="badge-unavailable">No disponible</span>' : ""}
      </div>
    </div>
  `).join("");
}

// Filtros de categoría
document.getElementById("categoryFilter").addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(btn.dataset.cat);
});

loadMenu();

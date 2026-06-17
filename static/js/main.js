// main.js – utilidades globales

function showAlert(elId, msg, type = "error") {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}

function categoryEmoji(cat) {
  const map = { "Pollos": "🍗", "Acompañamientos": "🍟", "Salsas": "🫙", "Bebidas": "🥤" };
  return map[cat] || "🍽️";
}

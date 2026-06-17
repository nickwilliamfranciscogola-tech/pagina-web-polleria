// admin.js
let menuData = [];

async function loadAdminMenu() {
  const res = await fetch("/api/menu");
  menuData = await res.json();
  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById("adminMenuList");
  document.getElementById("itemCount").textContent = `${menuData.length} platos`;

  if (menuData.length === 0) {
    list.innerHTML = `<p style="color:var(--humo);text-align:center;padding:2rem">El menú está vacío.</p>`;
    return;
  }

  // Agrupar por categoría
  const grouped = {};
  menuData.forEach(item => {
    if (!grouped[item.categoria]) grouped[item.categoria] = [];
    grouped[item.categoria].push(item);
  });

  list.innerHTML = Object.entries(grouped).map(([cat, items]) => `
    <div style="margin-bottom:0.5rem">
      <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;
                color:var(--humo);padding:0.6rem 0 0.3rem">${categoryEmoji(cat)} ${cat}</p>
      ${items.map(item => `
        <div class="admin-menu-item">
          <div class="ami-info">
            <div class="ami-name" style="${!item.disponible ? 'opacity:0.5' : ''}">${item.nombre}</div>
            <div class="ami-meta">${item.descripcion || "Sin descripción"}</div>
          </div>
          <span class="ami-price">S/ ${item.precio.toFixed(2)}</span>
          <div class="ami-actions">
            <button class="btn btn-toggle ${item.disponible ? 'active' : ''}"
              onclick="toggleItem(${item.id})">
              ${item.disponible ? "✔ Activo" : "✖ Inactivo"}
            </button>
            <button class="btn btn-danger" onclick="deleteItem(${item.id})">Eliminar</button>
          </div>
        </div>
      `).join("")}
    </div>
  `).join("");
}

async function addItem() {
  const nombre = document.getElementById("fNombre").value.trim();
  const precio = document.getElementById("fPrecio").value;
  const categoria = document.getElementById("fCategoria").value;
  const descripcion = document.getElementById("fDescripcion").value.trim();

  if (!nombre || !precio || !categoria) {
    showAlert("formAlert", "Completa nombre, precio y categoría.");
    return;
  }

  const res = await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, precio: parseFloat(precio), categoria, descripcion })
  });
  const data = await res.json();

  if (data.success) {
    showAlert("formAlert", `"${data.item.nombre}" agregado con éxito ✓`, "success");
    document.getElementById("fNombre").value = "";
    document.getElementById("fPrecio").value = "";
    document.getElementById("fCategoria").value = "";
    document.getElementById("fDescripcion").value = "";
    loadAdminMenu();
  } else {
    showAlert("formAlert", "Error al agregar el plato.");
  }
}

async function deleteItem(id) {
  const item = menuData.find(i => i.id === id);
  if (!confirm(`¿Eliminar "${item?.nombre}"?`)) return;

  const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (data.success) loadAdminMenu();
}

async function toggleItem(id) {
  const res = await fetch(`/api/menu/${id}`, { method: "PUT" });
  const data = await res.json();
  if (data.success) loadAdminMenu();
}

loadAdminMenu();

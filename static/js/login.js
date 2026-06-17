// login.js
async function doLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");

  if (!username || !password) {
    showAlert("loginError", "Completa usuario y contraseña.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Ingresando…";

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (data.success) {
    window.location.href = "/admin";
  } else {
    showAlert("loginError", data.message || "Credenciales incorrectas.");
    btn.disabled = false;
    btn.textContent = "Ingresar al panel";
  }
}

// Enter key support
document.addEventListener("keydown", e => {
  if (e.key === "Enter") doLogin();
});

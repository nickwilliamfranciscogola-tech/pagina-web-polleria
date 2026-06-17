from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import json, os

app = Flask(__name__)
app.secret_key = "polleria_secret_2024"

# --- Base de datos en memoria ---
ADMIN = {
    "username": "admin",
    "password": generate_password_hash("admin123")
}

menu_items = [
    {"id": 1, "nombre": "Pollo a la Brasa (1/4)", "precio": 18.00, "categoria": "Pollos", "descripcion": "Jugoso cuarto de pollo marinado con hierbas especiales", "disponible": True},
    {"id": 2, "nombre": "Pollo a la Brasa (1/2)", "precio": 32.00, "categoria": "Pollos", "descripcion": "Media unidad de nuestro clásico pollo a la brasa", "disponible": True},
    {"id": 3, "nombre": "Pollo a la Brasa (1 entero)", "precio": 58.00, "categoria": "Pollos", "descripcion": "Pollo entero para compartir en familia", "disponible": True},
    {"id": 4, "nombre": "Papas Fritas", "precio": 8.00, "categoria": "Acompañamientos", "descripcion": "Papas doradas y crocantes", "disponible": True},
    {"id": 5, "nombre": "Ensalada Fresca", "precio": 6.00, "categoria": "Acompañamientos", "descripcion": "Mix de vegetales frescos con aderezo de la casa", "disponible": True},
    {"id": 6, "nombre": "Crema de Ají", "precio": 3.00, "categoria": "Salsas", "descripcion": "Salsa picante de ají amarillo", "disponible": True},
    {"id": 7, "nombre": "Inca Kola 1L", "precio": 7.00, "categoria": "Bebidas", "descripcion": "Botella de Inca Kola", "disponible": True},
    {"id": 8, "nombre": "Chicha Morada", "precio": 6.00, "categoria": "Bebidas", "descripcion": "Bebida tradicional peruana", "disponible": True},
]
next_id = 9

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/menu")
def menu():
    return render_template("menu.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        if data["username"] == ADMIN["username"] and check_password_hash(ADMIN["password"], data["password"]):
            session["admin"] = True
            return jsonify({"success": True})
        return jsonify({"success": False, "message": "Credenciales incorrectas"})
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

@app.route("/admin")
def admin():
    if not session.get("admin"):
        return redirect(url_for("login"))
    return render_template("admin.html")

# --- API ---
@app.route("/api/menu", methods=["GET"])
def get_menu():
    return jsonify(menu_items)

@app.route("/api/menu", methods=["POST"])
def add_item():
    global next_id
    if not session.get("admin"):
        return jsonify({"error": "No autorizado"}), 401
    data = request.get_json()
    item = {
        "id": next_id,
        "nombre": data["nombre"],
        "precio": float(data["precio"]),
        "categoria": data["categoria"],
        "descripcion": data.get("descripcion", ""),
        "disponible": True
    }
    next_id += 1
    menu_items.append(item)
    return jsonify({"success": True, "item": item})

@app.route("/api/menu/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    if not session.get("admin"):
        return jsonify({"error": "No autorizado"}), 401
    global menu_items
    before = len(menu_items)
    menu_items = [i for i in menu_items if i["id"] != item_id]
    if len(menu_items) < before:
        return jsonify({"success": True})
    return jsonify({"error": "Ítem no encontrado"}), 404

@app.route("/api/menu/<int:item_id>", methods=["PUT"])
def toggle_item(item_id):
    if not session.get("admin"):
        return jsonify({"error": "No autorizado"}), 401
    for item in menu_items:
        if item["id"] == item_id:
            item["disponible"] = not item["disponible"]
            return jsonify({"success": True, "disponible": item["disponible"]})
    return jsonify({"error": "Ítem no encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)

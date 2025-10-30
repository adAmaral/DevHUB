const API_URL = "http://localhost:8080/DevHUB/api/auth";

const DevHUBAuth = {
  async register(e) {
    e.preventDefault();
    const nome = document.getElementById("cad-nome").value;
    const tipo = document.getElementById("cad-tipo").value;
    const email = document.getElementById("cad-email").value;
    const senha = document.getElementById("cad-senha").value;

    await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, tipo, email, senha }),
    });
    alert("Conta criada com sucesso!");
    return false;
  },

  async login(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    const resp = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (resp.ok) {
      const user = await resp.json();
      localStorage.setItem("usuario", JSON.stringify(user));
      alert("Bem-vindo, " + user.nome);
      window.location.href = "marketplace.html";
    } else {
      alert("Credenciais inválidas");
    }
    return false;
  },
};

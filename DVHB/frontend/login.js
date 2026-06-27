const API_BASE_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');

function showError(text) {
  errorMessage.textContent = text;
  errorMessage.hidden = false;
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;
}

function setRememberedCredentials() {
  const remembered = localStorage.getItem('rememberedCredentials');
  if (!remembered) {
    return;
  }

  try {
    const parsed = JSON.parse(remembered);
    if (parsed.email) emailInput.value = parsed.email;
    if (parsed.password) passwordInput.value = parsed.password;
    rememberInput.checked = true;
  } catch (e) {
    localStorage.removeItem('rememberedCredentials');
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  clearError();

  const email = emailInput.value.trim();
  const senha = passwordInput.value;
  const remember = rememberInput.checked;

  if (!email || !senha) {
    showError('Informe e-mail e senha para continuar.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || 'Falha ao conectar ao servidor.');
      return;
    }

    // Login OK
    const profile = data.user;
    localStorage.setItem('authUser', JSON.stringify(profile));

    if (remember) {
      localStorage.setItem(
        'rememberedCredentials',
        JSON.stringify({ email, password: senha })
      );
    } else {
      localStorage.removeItem('rememberedCredentials');
    }

    // Mantém conectado (token/session no localStorage) - sem UX de sucesso conforme solicitado
    localStorage.setItem('persistedLogin', 'true');

    // redirecionamento padrão (ajuste conforme sua rota real):
    window.location.href = '/';
  } catch (error) {
    console.error('erro-login', error);
    showError('Erro de rede. Verifique sua conexão e tente novamente.');
  }
}

loginForm.addEventListener('submit', handleLoginSubmit);
setRememberedCredentials();

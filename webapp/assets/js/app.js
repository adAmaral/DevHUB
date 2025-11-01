(() => {
  const CONTEXT_PATH = (() => {
    const [, ctx] = window.location.pathname.split('/');
    return ctx ? `/${ctx}` : '';
  })();

  const API_BASE_URL = `${window.location.origin}${CONTEXT_PATH}`;

  const ApiClient = {
    async request(path, options = {}) {
      const url = `${API_BASE_URL}${path}`;
      const config = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      };

      if (config.body && typeof config.body !== 'string') {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, config);

      let payload = null;
      const contentType = response.headers.get('content-type') || '';
      if (response.status !== 204 && contentType.includes('application/json')) {
        payload = await response.json();
      }

      if (!response.ok) {
        const message = payload?.erro || payload?.message || `Erro HTTP ${response.status}`;
        throw new Error(message);
      }

      return payload;
    },

    showMessage(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.style.cssText = `position:fixed;top:20px;right:20px;padding:14px 18px;border-radius:8px;color:#fff;font-weight:600;z-index:1100;max-width:320px;box-shadow:0 10px 25px rgba(15,23,42,.15);`;

      const palette = {
        success: '#16a34a',
        error: '#dc2626',
        warning: '#facc15',
        info: '#2563eb'
      };

      notification.style.backgroundColor = palette[type] || palette.info;
      if (type === 'warning') {
        notification.style.color = '#1f2937';
      }

      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4200);
    }
  };

  const DevHubAuth = (() => {
    let currentUser = null;

    async function loadSession(force = false) {
      if (currentUser && !force) return currentUser;
      try {
        const user = await ApiClient.request('/auth/me');
        currentUser = user;
        return user;
      } catch (err) {
        currentUser = null;
        return null;
      }
    }

    function redirectByType(user) {
      if (!user) return;
      switch (user.tipo) {
        case 'empresa':
          window.location.href = 'admin-empresa.html';
          break;
        case 'freelancer':
          window.location.href = 'admin-freelancer.html';
          break;
        case 'cliente':
          window.location.href = 'perfil-cliente.html';
          break;
        default:
          window.location.href = 'marketplace.html';
      }
    }

    async function register(data) {
      const payload = {
        nome: data.nome.trim(),
        tipo: data.tipo,
        email: data.email.trim().toLowerCase(),
        senha: data.senha
      };

      if (!payload.nome || !payload.tipo || !payload.email || !payload.senha) {
        throw new Error('Preencha todos os campos.');
      }
      if (payload.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      await ApiClient.request('/auth/register', { method: 'POST', body: payload });
      ApiClient.showMessage('Cadastro realizado com sucesso!', 'success');

      // login automático
      const user = await ApiClient.request('/auth/login', { method: 'POST', body: { email: payload.email, senha: payload.senha } });
      currentUser = user;
      redirectByType(user);
    }

    async function login(data) {
      const payload = {
        email: data.email.trim().toLowerCase(),
        senha: data.senha
      };

      if (!payload.email || !payload.senha) {
        throw new Error('Informe e-mail e senha.');
      }

      const user = await ApiClient.request('/auth/login', { method: 'POST', body: payload });
      currentUser = user;
      ApiClient.showMessage(`Bem-vindo, ${user.nome}!`, 'success');
      redirectByType(user);
    }

    async function logout() {
      await ApiClient.request('/auth/logout', { method: 'POST' });
      currentUser = null;
      ApiClient.showMessage('Você saiu da conta.', 'info');
      setTimeout(() => window.location.href = 'index.html', 1200);
    }

    async function ensureAuthenticated({ requiredType } = {}) {
      const user = await loadSession();
      if (!user) {
        ApiClient.showMessage('Faça login para continuar.', 'warning');
        setTimeout(() => window.location.href = 'auth.html', 1200);
        throw new Error('Sessão não encontrada');
      }
      if (requiredType && user.tipo !== requiredType) {
        ApiClient.showMessage('Você não tem acesso a esta área.', 'error');
        redirectByType(user);
        throw new Error('Perfil sem permissão');
      }
      return user;
    }

    function attachHandlers() {
      const loginForm = document.getElementById('form-login');
      if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          try {
            await login({
              email: document.getElementById('login-email').value,
              senha: document.getElementById('login-senha').value
            });
          } catch (err) {
            ApiClient.showMessage(err.message, 'error');
          }
        });
      }

      const registerForm = document.getElementById('form-register');
      if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          try {
            await register({
              nome: document.getElementById('cad-nome').value,
              tipo: document.getElementById('cad-tipo').value,
              email: document.getElementById('cad-email').value,
              senha: document.getElementById('cad-senha').value
            });
          } catch (err) {
            ApiClient.showMessage(err.message, 'error');
          }
        });
      }

      const logoutButton = document.getElementById('btn-logout');
      if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
          try {
            await logout();
          } catch (err) {
            ApiClient.showMessage(err.message, 'error');
          }
        });
      }
    }

    return {
      loadSession,
      ensureAuthenticated,
      attachHandlers,
      logout,
      get currentUser() {
        return currentUser;
      }
    };
  })();

  const DevHubUI = (() => {
    function updateNav(user) {
      const authLinks = document.querySelectorAll('[data-auth-link]');
      authLinks.forEach(link => {
        if (user) {
          link.textContent = `Olá, ${user.nome}`;
          link.href = user.tipo === 'empresa' ? 'admin-empresa.html'
                    : user.tipo === 'freelancer' ? 'admin-freelancer.html'
                    : 'perfil-cliente.html';
        } else {
          link.textContent = 'Entrar / Cadastrar';
          link.href = 'auth.html';
        }
      });
    }

    async function init() {
      const user = await DevHubAuth.loadSession();
      updateNav(user);
    }

    return { init };
  })();

  const DevHubMarketplace = (() => {
    const fallbackProducts = [
      { id: 1, title: 'Logo e Identidade Visual', type: 'Serviço', cat: 'Design', price: 450, rating: 4.9 },
      { id: 2, title: 'Landing Page Profissional', type: 'Serviço', cat: 'Programação', price: 1200, rating: 4.8 },
      { id: 3, title: 'Gestão de Tráfego 30 dias', type: 'Serviço', cat: 'Marketing', price: 850, rating: 4.7 },
      { id: 4, title: 'Kit embalagens personalizadas', type: 'Produto', cat: 'Comércio', price: 199, rating: 4.6 }
    ];

    function render(list = fallbackProducts) {
      const container = document.getElementById('cards');
      if (!container) return;
      if (!list.length) {
        container.innerHTML = '<p style="color:#4a4f58">Nenhuma oferta encontrada.</p>';
        return;
      }
      container.innerHTML = list.map(item => `
        <article class="item-card">
          <div class="cover"></div>
          <div class="body">
            <strong>${item.title}</strong>
            <div class="meta">
              <span class="badge">${item.cat} · ${item.type}</span>
              <span class="rating">★ ${item.rating.toFixed(1)}</span>
            </div>
            <div class="meta">
              <span class="price">R$ ${item.price.toLocaleString('pt-BR')}</span>
              <button class="btn btn-primary" type="button">Contatar</button>
            </div>
          </div>
        </article>`).join('');
    }

    function searchData(query) {
      return fallbackProducts.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    }

    function applyFilters() {
      const category = document.getElementById('f-cat')?.value || '';
      const type = document.getElementById('f-type')?.value || '';
      const order = document.getElementById('f-order')?.value || '';
      const base = fallbackProducts.filter(item => {
        const matchCategory = !category || item.cat === category;
        const matchType = !type || item.type === type;
        return matchCategory && matchType;
      });

      let result = [...base];
      switch (order) {
        case 'Mais recentes':
          result.reverse();
          break;
        case 'Menor preço':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'Maior preço':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'Melhor avaliados':
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
      render(result);
    }

    function attachSearch() {
      const searchInput = document.getElementById('search');
      if (!searchInput) return;
      const execute = () => {
        const query = searchInput.value.trim();
        render(query ? searchData(query) : fallbackProducts);
      };
      searchInput.addEventListener('input', execute);
      searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); execute(); } });

      const searchButton = document.getElementById('btn-search');
      if (searchButton) {
        searchButton.addEventListener('click', execute);
      }

      const filterButton = document.getElementById('btn-filters');
      if (filterButton) {
        filterButton.addEventListener('click', applyFilters);
      }
    }

    function init() {
      render();
      attachSearch();
    }

    return { init };
  })();

  const DevHubTheme = (() => {
    const STORAGE_KEY = 'devhub-theme';
    let currentTheme = 'light';

    function updateButtonLabel() {
      const button = document.getElementById('btn-theme-toggle');
      if (!button) return;
      if (currentTheme === 'dark') {
        button.textContent = 'Modo claro';
        button.setAttribute('aria-label', 'Ativar modo claro');
      } else {
        button.textContent = 'Modo escuro';
        button.setAttribute('aria-label', 'Ativar modo escuro');
      }
    }

    function apply(theme, persist = true) {
      currentTheme = theme === 'dark' ? 'dark' : 'light';
      document.body.classList.toggle('theme-dark', currentTheme === 'dark');
      document.body.classList.toggle('theme-light', currentTheme !== 'dark');
      updateButtonLabel();
      if (persist) {
        try {
          localStorage.setItem(STORAGE_KEY, currentTheme);
        } catch (err) {
          console.warn('Não foi possível salvar tema:', err.message);
        }
      }
    }

    function ensureButton() {
      const inner = document.querySelector('.navbar .inner');
      if (!inner) return;

      let nav = inner.querySelector('nav');
      if (!nav) {
        nav = document.createElement('nav');
        nav.className = 'header-actions';
        inner.appendChild(nav);
      }

      let button = document.getElementById('btn-theme-toggle');
      if (!button) {
        button = document.createElement('button');
        button.id = 'btn-theme-toggle';
        button.type = 'button';
        button.className = 'btn btn-outline btn-theme';
        button.addEventListener('click', () => {
          apply(currentTheme === 'dark' ? 'light' : 'dark');
        });
        nav.appendChild(button);
      }
      updateButtonLabel();
    }

    function init() {
      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem(STORAGE_KEY);
      } catch (err) {
        savedTheme = null;
      }
      apply(savedTheme === 'dark' ? 'dark' : 'light', false);
      ensureButton();
    }

    return { init };
  })();

  const DevHubForms = (() => {
    function initCreateListingForm() {
      const form = document.getElementById('create-listing-form');
      if (!form) return;
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        ApiClient.showMessage('Recebemos seu envio! Nossa equipe entrará em contato em breve para validar e publicar seu anúncio.', 'success');
        form.reset();
      });
    }

    function init() {
      initCreateListingForm();
    }

    return { init };
  })();

  document.addEventListener('DOMContentLoaded', async () => {
    DevHubTheme.init();
    DevHubAuth.attachHandlers();
    DevHubUI.init();
    DevHubForms.init();

    const bodyPage = document.body?.dataset?.page;
    if (!bodyPage || bodyPage === 'auth') {
      // nothing extra here
    }

    if (document.getElementById('cards')) {
      DevHubMarketplace.init();
    }
  });

  window.ApiClient = ApiClient;
  window.DevHubAuth = DevHubAuth;
  window.DevHubTheme = DevHubTheme;
})();

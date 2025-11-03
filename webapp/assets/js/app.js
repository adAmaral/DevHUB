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
      if (currentUser && !force) {
        console.log('[LOAD SESSION DEBUG] Usando usuário em cache');
        return currentUser;
      }
      
      try {
        console.log('[LOAD SESSION DEBUG] Tentando carregar sessão via GET /auth/me');
        console.log('[LOAD SESSION DEBUG] URL completa:', `${API_BASE_URL}/auth/me`);
        console.log('[LOAD SESSION DEBUG] Credentials: include');
        
        const user = await ApiClient.request('/auth/me');
        console.log('[LOAD SESSION DEBUG] Sessão carregada com sucesso:', user);
        console.log('[LOAD SESSION DEBUG] Campos do usuário:', Object.keys(user || {}));
        console.log('[LOAD SESSION DEBUG] user.id:', user?.id, 'user.id_usuario:', user?.id_usuario);
        console.log('[LOAD SESSION DEBUG] user.tipo:', user?.tipo);
        
        // Aceitar tanto 'id' quanto 'id_usuario'
        const userId = user?.id || user?.id_usuario;
        
        if (user && userId && user.tipo) {
          // Normalizar para sempre usar 'id'
          if (!user.id && user.id_usuario) {
            user.id = user.id_usuario;
          }
          currentUser = user;
          return user;
        } else {
          console.warn('[LOAD SESSION DEBUG] Usuário retornado é inválido:', user);
          console.warn('[LOAD SESSION DEBUG] userId:', userId, 'tipo:', user?.tipo);
          currentUser = null;
          return null;
        }
      } catch (err) {
        console.error('[LOAD SESSION DEBUG] Erro ao carregar sessão:', err);
        console.error('[LOAD SESSION DEBUG] Erro message:', err.message);
        console.error('[LOAD SESSION DEBUG] Erro completo:', err);
        currentUser = null;
        return null;
      }
    }

    function redirectByType(user) {
      if (!user) {
        console.error('[REDIRECT DEBUG] Usuário não fornecido para redirecionamento');
        return;
      }
      
      if (!user.tipo) {
        console.error('[REDIRECT DEBUG] Usuário não tem tipo!', user);
        return;
      }
      
      console.log('[REDIRECT DEBUG] Redirecionando usuário tipo:', user.tipo);
      
      let redirectUrl = null;
      switch (user.tipo) {
        case 'empresa':
          redirectUrl = 'admin-empresa.html';
          break;
        case 'freelancer':
          redirectUrl = 'admin-freelancer.html';
          break;
        case 'cliente':
          redirectUrl = 'perfil-cliente.html';
          break;
        default:
          redirectUrl = 'marketplace.html';
          console.warn('[REDIRECT DEBUG] Tipo desconhecido, redirecionando para marketplace:', user.tipo);
      }
      
      if (redirectUrl) {
        console.log('[REDIRECT DEBUG] Redirecionando para:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error('[REDIRECT DEBUG] URL de redirecionamento não definida!');
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

      console.log('[REGISTER DEBUG] Tentando cadastrar usuário:', payload.email);
      const registerResult = await ApiClient.request('/auth/register', { method: 'POST', body: payload });
      console.log('[REGISTER DEBUG] Cadastro retornou:', registerResult);
      
      if (registerResult && registerResult.sucesso) {
        // login automático após registro bem-sucedido
        // Pequeno delay para garantir que o INSERT foi commitado no banco
        console.log('[REGISTER DEBUG] Aguardando 800ms antes do login automático...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log('[REGISTER DEBUG] Fazendo login automático após cadastro...');
        console.log('[REGISTER DEBUG] Email para login:', payload.email);
        console.log('[REGISTER DEBUG] Senha (tamanho):', payload.senha ? payload.senha.length : 0);
        
        try {
          const user = await ApiClient.request('/auth/login', { method: 'POST', body: { email: payload.email, senha: payload.senha } });
          console.log('[REGISTER DEBUG] Login automático bem-sucedido:', user);
          
          if (!user || !user.tipo) {
            throw new Error('Login retornou usuário inválido');
          }
          
          // Mostrar mensagem de sucesso apenas após login bem-sucedido
          ApiClient.showMessage(`Bem-vindo, ${user.nome}!`, 'success');
          
          currentUser = user;
          setTimeout(() => {
            console.log('[REGISTER DEBUG] Redirecionando após login automático');
            redirectByType(user);
          }, 500);
        } catch (loginErr) {
          console.error('[REGISTER DEBUG] Erro no login automático após cadastro:', loginErr);
          console.error('[REGISTER DEBUG] Erro message:', loginErr.message);
          
          // Não mostrar mensagem de erro, apenas redirecionar para login
          // O cadastro foi bem-sucedido, apenas o login automático falhou
          console.log('[REGISTER DEBUG] Login automático falhou, mas cadastro foi bem-sucedido. Redirecionando...');
          
          // Não mostrar mensagem de erro aqui, apenas redirecionar silenciosamente
          setTimeout(() => {
            window.location.href = 'auth.html';
          }, 1000);
        }
      } else {
        throw new Error('Cadastro não foi bem-sucedido');
      }
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
      console.log('[LOGIN DEBUG] Usuário retornado:', user);
      console.log('[LOGIN DEBUG] Tipo do usuário:', user?.tipo);
      
      if (!user) {
        throw new Error('Login falhou - usuário não retornado');
      }
      
      if (!user.tipo) {
        console.error('[LOGIN DEBUG] Usuário não tem tipo!', user);
        throw new Error('Erro: tipo de usuário não encontrado');
      }
      
      currentUser = user;
      ApiClient.showMessage(`Bem-vindo, ${user.nome}!`, 'success');
      
      // Pequeno delay para garantir que a mensagem seja exibida antes do redirect
      setTimeout(() => {
        console.log('[LOGIN DEBUG] Redirecionando para tipo:', user.tipo);
        redirectByType(user);
      }, 500);
    }

    async function logout() {
      await ApiClient.request('/auth/logout', { method: 'POST' });
      currentUser = null;
      ApiClient.showMessage('Você saiu da conta.', 'info');
      setTimeout(() => window.location.href = 'index.html', 1200);
    }

    async function ensureAuthenticated({ requiredType } = {}) {
      console.log('[ENSURE AUTH DEBUG] Verificando autenticação, requiredType:', requiredType);
      
      // Tentar carregar sessão com force=true para garantir que verifica no servidor
      const user = await loadSession(true);
      console.log('[ENSURE AUTH DEBUG] Usuário retornado do loadSession:', user);
      
      if (!user) {
        console.warn('[ENSURE AUTH DEBUG] Usuário não encontrado, redirecionando para login');
        console.warn('[ENSURE AUTH DEBUG] Pode ser que a sessão expirou ou não foi criada corretamente');
        ApiClient.showMessage('Faça login para continuar.', 'warning');
        setTimeout(() => {
          console.log('[ENSURE AUTH DEBUG] Redirecionando para auth.html');
          window.location.href = 'auth.html';
        }, 1200);
        throw new Error('Sessão não encontrada');
      }
      
      if (requiredType && user.tipo !== requiredType) {
        console.warn('[ENSURE AUTH DEBUG] Tipo não corresponde. Esperado:', requiredType, 'Encontrado:', user.tipo);
        ApiClient.showMessage('Você não tem acesso a esta área.', 'error');
        setTimeout(() => redirectByType(user), 500);
        throw new Error('Perfil sem permissão');
      }
      
      console.log('[ENSURE AUTH DEBUG] Autenticação verificada com sucesso para:', user.email);
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
      { id: 4, title: 'Kit embalagens personalizadas', type: 'Produto', cat: 'Comércio', price: 199, rating: 4.6 },
      { id: 5, title: 'Consultoria para branding DevHub', type: 'Serviço', cat: 'Design', price: 650, rating: 4.9 }
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

    function extractCardData(card) {
      const titleEl = card.querySelector('strong');
      const badgeEl = card.querySelector('.badge');
      const priceEl = card.querySelector('.price');
      const ratingEl = card.querySelector('.rating');

      if (!titleEl || !badgeEl || !priceEl || !ratingEl) return null;

      const title = titleEl.textContent.trim();
      const badgeText = badgeEl.textContent.trim();
      const [cat, type] = badgeText.split(' · ');
      const priceText = priceEl.textContent.replace(/[^\d,]/g, '').replace(',', '.');
      const price = parseFloat(priceText) || 0;
      const ratingText = ratingEl.textContent.trim();
      const rating = parseFloat(ratingText.replace(/[^\d.]/g, '')) || 0;

      return { title, cat: cat || '', type: type || '', price, rating, element: card };
    }

    function filterManualCards() {
      const container = document.getElementById('cards');
      if (!container || container.dataset.manual !== 'true') return;

      const cards = Array.from(container.querySelectorAll('.item-card'));
      if (!cards.length) return;

      const searchQuery = (document.getElementById('search')?.value || '').trim().toLowerCase();
      const category = document.getElementById('f-cat')?.value || '';
      const type = document.getElementById('f-type')?.value || '';
      const order = document.getElementById('f-order')?.value || '';

      const cardData = cards.map(extractCardData).filter(Boolean);
      
      let filtered = cardData.filter(data => {
        const matchSearch = !searchQuery || data.title.toLowerCase().includes(searchQuery);
        const matchCategory = !category || data.cat === category;
        const matchType = !type || data.type === type;
        return matchSearch && matchCategory && matchType;
      });

      // Aplicar ordenação
      switch (order) {
        case 'Mais recentes':
          filtered = [...filtered].reverse();
          break;
        case 'Menor preço':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'Maior preço':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'Melhor avaliados':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }

      // Ocultar todos os cards primeiro
      cards.forEach(card => {
        card.style.display = 'none';
      });

      // Mostrar apenas os filtrados, na ordem correta
      if (filtered.length === 0) {
        const noResults = container.querySelector('.no-results');
        if (!noResults) {
          const p = document.createElement('p');
          p.className = 'no-results';
          p.style.cssText = 'color:#4a4f58; grid-column: 1 / -1; padding: 2rem; text-align: center;';
          p.textContent = 'Nenhuma oferta encontrada.';
          container.appendChild(p);
        }
      } else {
        const noResults = container.querySelector('.no-results');
        if (noResults) noResults.remove();

        // Se há ordenação específica, reordenar visualmente movendo elementos
        if (order && order !== '') {
          // Coletar todos os elementos filtrados
          const elementsToReorder = filtered.map(data => data.element);
          // Remover temporariamente do DOM
          elementsToReorder.forEach(el => {
            if (el.parentNode === container) {
              el.remove();
            }
          });
          // Reinserir na ordem correta
          elementsToReorder.forEach(el => {
            container.appendChild(el);
          });
        }

        // Mostrar os cards filtrados
        filtered.forEach(data => {
          data.element.style.display = '';
        });
      }
    }

    function searchData(query) {
      return fallbackProducts.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    }

    function applyFilters() {
      const container = document.getElementById('cards');
      if (!container) return;

      if (container.dataset.manual === 'true') {
        filterManualCards();
        return;
      }

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
      const container = document.getElementById('cards');
      const isManual = container?.dataset.manual === 'true';

      const searchInput = document.getElementById('search');
      if (!searchInput) return;

      const execute = () => {
        if (isManual) {
          filterManualCards();
        } else {
          const query = searchInput.value.trim();
          render(query ? searchData(query) : fallbackProducts);
        }
      };

      searchInput.addEventListener('input', execute);
      searchInput.addEventListener('keydown', e => { 
        if (e.key === 'Enter') { 
          e.preventDefault(); 
          execute(); 
        } 
      });

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
      const container = document.getElementById('cards');
      if (!container) return;
      
      if (container.dataset.manual === 'true') {
        attachSearch();
        return;
      }
      
      render();
      attachSearch();
    }

    return { init };
  })();

  const DevHubTheme = (() => {
    const STORAGE_KEY = 'devhub-theme';
    const ICON_MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z"></path></svg>';
    const ICON_SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line></svg>';
    let currentTheme = 'light';

    function updateButtonLabel() {
      const button = document.getElementById('btn-theme-toggle');
      if (!button) return;
      const isDark = currentTheme === 'dark';
      button.innerHTML = isDark ? ICON_SUN : ICON_MOON;
      button.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
      button.setAttribute('title', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
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
      nav.classList.add('header-actions');

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

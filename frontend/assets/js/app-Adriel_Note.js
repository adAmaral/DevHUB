// Produtos fictícios
const products = [
  { id: 1, title: 'Logo e Identidade Visual', type:'Serviço', cat:'Design', price: 450, rating: 4.9 },
  { id: 2, title: 'Landing Page Profissional', type:'Serviço', cat:'Programação', price: 1200, rating: 4.8 },
  { id: 3, title: 'Gestão de Tráfego 30 dias', type:'Serviço', cat:'Marketing', price: 850, rating: 4.7 },
  { id: 4, title: 'Kit embalagens personalizadas', type:'Produto', cat:'Comércio', price: 199, rating: 4.6 },
  { id: 5, title: 'E-commerce completo', type:'Serviço', cat:'Programação', price: 3500, rating: 5.0 },
  { id: 6, title: 'Fotos para catálogo (20)', type:'Serviço', cat:'Design', price: 590, rating: 4.8 },
];

// Configuração da API
const API_BASE_URL = '/api';

const Summit = {
  renderCards: (list = products) => {
    const el = document.getElementById('cards');
    if (!el) return;
    el.innerHTML = list.map(p => `
      <article class="item-card">
        <div class="cover"></div>
        <div class="body">
          <strong>${p.title}</strong>
          <div class="meta">
            <span class="badge">${p.cat} · ${p.type}</span>
            <span class="rating">★ ${p.rating.toFixed(1)}</span>
          </div>
          <div class="meta">
            <span class="price">R$ ${p.price.toLocaleString('pt-BR')}</span>
            <button class="btn btn-primary" onclick="alert('Contato enviado ao anunciante!')">Contatar</button>
          </div>
        </div>
      </article>
    `).join('');
  },
  search: () => {
    const q = (document.getElementById('search')?.value || '').toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q));
    Summit.renderCards(filtered);
  },
  applyFilters: () => {
    const cat = document.getElementById('f-cat')?.value || '';
    const typ = document.getElementById('f-type')?.value || '';
    const ord = document.getElementById('f-order')?.value || '';

    let list = products.filter(p => (!cat || p.cat === cat) && (!typ || p.type === typ));

    if (ord === 'Mais recentes') list = list.reverse();
    if (ord === 'Menor preço') list = list.sort((a,b)=>a.price-b.price);
    if (ord === 'Maior preço') list = list.sort((a,b)=>b.price-a.price);
    if (ord === 'Melhor avaliados') list = list.sort((a,b)=>b.rating-a.rating);

    Summit.renderCards(list);
  }
};

// Utilitários para API
const ApiUtils = {
  // Função para fazer requisições HTTP
  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Mostrar mensagens para o usuário
  showMessage(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      max-width: 300px;
      word-wrap: break-word;
    `;

    // Definir cor baseada no tipo
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#28a745';
        break;
      case 'error':
        notification.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#212529';
        break;
      default:
        notification.style.backgroundColor = '#17a2b8';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
};

// ====== Cadastro/Login (chama Node.js API) ======
const SummitAuth = {
  register: async (e) => {
    e.preventDefault();
    
    try {
      const nome = document.getElementById('cad-nome').value.trim();
      const tipo = document.getElementById('cad-tipo').value;
      const email = document.getElementById('cad-email').value.toLowerCase().trim();
      const senha = document.getElementById('cad-senha').value;

      // Validações básicas
      if (!nome || !tipo || !email || !senha) {
        ApiUtils.showMessage('Todos os campos são obrigatórios', 'error');
        return false;
      }

      if (senha.length < 6) {
        ApiUtils.showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
        return false;
      }

      const usuario = { nome, tipo, email, senha };

      // Cadastrar via API Node.js
      const response = await ApiUtils.request('/cadastrar', {
        method: 'POST',
        body: JSON.stringify(usuario)
      });

      if (response.status === 'ok') {
        ApiUtils.showMessage('Cadastro realizado com sucesso!', 'success');
        
        // Salvar dados do usuário no localStorage (sem a senha)
        const { senha: _, ...usuarioSemSenha } = usuario;
        localStorage.setItem('summitCurrentUser', JSON.stringify(usuarioSemSenha));

        // Redirecionar baseado no tipo de usuário
        setTimeout(() => {
          if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
          else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
          else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
        }, 1500);
      }

    } catch (error) {
      ApiUtils.showMessage(error.message || 'Erro ao cadastrar usuário', 'error');
    }

    return false;
  },

  login: async (e) => {
    e.preventDefault();
    
    try {
      const email = document.getElementById('login-email').value.toLowerCase().trim();
      const senha = document.getElementById('login-senha').value;

      if (!email || !senha) {
        ApiUtils.showMessage('Email e senha são obrigatórios', 'error');
        return false;
      }

      // Fazer login via API Node.js
      const response = await ApiUtils.request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });

      if (response.status === 'ok') {
        ApiUtils.showMessage('Login realizado com sucesso!', 'success');
        
        // Salvar dados do usuário no localStorage
        localStorage.setItem('summitCurrentUser', JSON.stringify(response.usuario));

        // Redirecionar baseado no tipo de usuário
        setTimeout(() => {
          const tipo = response.usuario.tipo;
          if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
          else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
          else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
          else window.location.href = 'marketplace.html';
        }, 1500);
      }

    } catch (error) {
      ApiUtils.showMessage(error.message || 'Erro ao fazer login', 'error');
    }

    return false;
  },

  // Função para logout
  logout: () => {
    localStorage.removeItem('summitCurrentUser');
    ApiUtils.showMessage('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  },

  // Verificar se usuário está logado
  isLoggedIn: () => {
    return localStorage.getItem('summitCurrentUser') !== null;
  },

  // Obter dados do usuário atual
  getCurrentUser: () => {
    const userData = localStorage.getItem('summitCurrentUser');
    return userData ? JSON.parse(userData) : null;
  }
};

// Função para listar usuários (para debug/admin)
const SummitAdmin = {
  async listarUsuarios() {
    try {
      const response = await ApiUtils.request('/usuarios');
      console.log('Usuários cadastrados:', response);
      return response;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }
};

// Inicialização quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
  Summit.renderCards();
  
  // Verificar se usuário está logado e atualizar interface
  const currentUser = SummitAuth.getCurrentUser();
  if (currentUser) {
    console.log('Usuário logado:', currentUser.nome);
    
    // Atualizar links de navegação se necessário
    const authLinks = document.querySelectorAll('a[href="auth.html"]');
    authLinks.forEach(link => {
      if (link.textContent.includes('Entrar')) {
        link.textContent = `Olá, ${currentUser.nome}`;
        link.href = `perfil-${currentUser.tipo}.html`;
      }
    });
  }
});

// Expor funções globalmente para uso em HTML
window.Summit = Summit;
window.SummitAuth = SummitAuth;
window.SummitAdmin = SummitAdmin;

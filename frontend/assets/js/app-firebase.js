// ==============================
// 🔥 APLICAÇÃO COM FIREBASE
// ==============================

// Importar Firebase (usando CDN - veja index.html)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Variáveis globais Firebase
let app;
let auth;
let db;

// Inicializar Firebase
function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK não carregado. Verifique se os scripts estão incluídos no HTML.');
    return false;
  }

  try {
    // Inicializar Firebase App
    app = firebase.initializeApp(window.firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('✅ Firebase inicializado com sucesso!');
    
    // Listener para mudanças no estado de autenticação
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('👤 Usuário autenticado:', user.email);
        atualizarInterfaceUsuario(user);
      } else {
        console.log('👤 Nenhum usuário autenticado');
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    return false;
  }
}

// Atualizar interface quando usuário está logado
function atualizarInterfaceUsuario(user) {
  // Buscar dados completos do usuário no Firestore
  db.collection('usuarios').doc(user.uid).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        localStorage.setItem('summitCurrentUser', JSON.stringify({
          id: user.uid,
          email: user.email,
          ...userData
        }));
        
        // Atualizar links de navegação
        const authLinks = document.querySelectorAll('a[href="auth.html"]');
        authLinks.forEach(link => {
          if (link.textContent.includes('Entrar')) {
            link.textContent = `Olá, ${userData.nome}`;
            link.href = `perfil-${userData.tipo}.html`;
          }
        });
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
}

// Produtos fictícios (mantido para demonstração)
const products = [
  { id: 1, title: 'Logo e Identidade Visual', type:'Serviço', cat:'Design', price: 450, rating: 4.9 },
  { id: 2, title: 'Landing Page Profissional', type:'Serviço', cat:'Programação', price: 1200, rating: 4.8 },
  { id: 3, title: 'Gestão de Tráfego 30 dias', type:'Serviço', cat:'Marketing', price: 850, rating: 4.7 },
  { id: 4, title: 'Kit embalagens personalizadas', type:'Produto', cat:'Comércio', price: 199, rating: 4.6 },
  { id: 5, title: 'E-commerce completo', type:'Serviço', cat:'Programação', price: 3500, rating: 5.0 },
  { id: 6, title: 'Fotos para catálogo (20)', type:'Serviço', cat:'Design', price: 590, rating: 4.8 },
];

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

// Utilitários
const ApiUtils = {
  showMessage(message, type = 'info') {
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

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
};

// ====== Cadastro/Login com Firebase ======
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

      // Criar usuário no Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      // Atualizar perfil com nome
      await user.updateProfile({
        displayName: nome
      });

      // Salvar dados adicionais no Firestore
      await db.collection('usuarios').doc(user.uid).set({
        nome: nome,
        email: email,
        tipo: tipo,
        ativo: true,
        data_cadastro: firebase.firestore.FieldValue.serverTimestamp(),
        data_atualizacao: firebase.firestore.FieldValue.serverTimestamp()
      });

      ApiUtils.showMessage('Cadastro realizado com sucesso!', 'success');

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
        else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
        else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
      }, 1500);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      let mensagem = 'Erro ao cadastrar usuário';
      
      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Email já cadastrado';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'Senha muito fraca';
      }
      
      ApiUtils.showMessage(mensagem, 'error');
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

      // Fazer login com Firebase Authentication
      const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      // Buscar dados do usuário no Firestore
      const docRef = await db.collection('usuarios').doc(user.uid).get();
      
      if (!docRef.exists) {
        ApiUtils.showMessage('Dados do usuário não encontrados', 'error');
        return false;
      }

      const userData = docRef.data();

      ApiUtils.showMessage('Login realizado com sucesso!', 'success');

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        const tipo = userData.tipo;
        if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
        else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
        else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
        else window.location.href = 'marketplace.html';
      }, 1500);

    } catch (error) {
      console.error('Erro no login:', error);
      
      let mensagem = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        mensagem = 'Email ou senha incorretos';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Email inválido';
      } else if (error.code === 'auth/user-disabled') {
        mensagem = 'Usuário desativado';
      }
      
      ApiUtils.showMessage(mensagem, 'error');
    }

    return false;
  },

  logout: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('summitCurrentUser');
      ApiUtils.showMessage('Logout realizado com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } catch (error) {
      console.error('Erro no logout:', error);
      ApiUtils.showMessage('Erro ao fazer logout', 'error');
    }
  },

  isLoggedIn: () => {
    return auth.currentUser !== null;
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('summitCurrentUser');
    return userData ? JSON.parse(userData) : null;
  }
};

// Funções administrativas
const SummitAdmin = {
  async listarUsuarios() {
    try {
      const snapshot = await db.collection('usuarios')
        .orderBy('data_cadastro', 'desc')
        .limit(50)
        .get();
      
      const usuarios = [];
      snapshot.forEach((doc) => {
        usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Usuários cadastrados:', usuarios);
      return usuarios;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  },

  async buscarUsuarioPorId(id) {
    try {
      const doc = await db.collection('usuarios').doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }
};

// Inicialização quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
  // Inicializar Firebase
  initFirebase();
  
  // Renderizar cards
  Summit.renderCards();
  
  // Verificar se usuário está logado
  const currentUser = SummitAuth.getCurrentUser();
  if (currentUser) {
    console.log('Usuário logado:', currentUser.nome);
  }
});

// Expor funções globalmente para uso em HTML
window.Summit = Summit;
window.SummitAuth = SummitAuth;
window.SummitAdmin = SummitAdmin;
window.initFirebase = initFirebase;


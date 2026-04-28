/**
 * Camada de API mockada.
 * Objetivo: manter o frontend pronto para trocar mocks por backend real (Node/Java/PHP + MySQL).
 */

const MOCK_PRODUTOS = [
  { id: 1, nome: 'CloudScale Pro', descricao: 'Escalabilidade cloud com observabilidade.', preco: 49, imagem: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900' },
  { id: 2, nome: 'InsightX Analytics', descricao: 'Métricas em tempo real para times de produto.', preco: 12, imagem: 'https://images.unsplash.com/photo-1551281044-8b7a4cee4c9c?w=900' },
  { id: 3, nome: 'Sentinel Guard', descricao: 'Segurança e monitoramento de ameaças.', preco: 29, imagem: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900' },
  { id: 4, nome: 'DevConsole Plus', descricao: 'Ferramentas de produtividade para dev teams.', preco: 0, imagem: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=900' },
];

const MOCK_USERS = [{ id: 1, nome: 'Admin DevHub', email: 'admin@devhub.com', senha: '123456' }];

function randomDelay() {
  return Math.floor(Math.random() * 400) + 100; // 100ms até 500ms
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateRequest(handler) {
  try {
    await wait(randomDelay());
    return await handler();
  } catch (error) {
    throw new Error(error.message || 'Falha inesperada na camada mock.');
  }
}

export async function getProdutos() {
  try {
    // FUTURO: substituir por fetch('/api/produtos')
    return await simulateRequest(async () => [...MOCK_PRODUTOS]);
  } catch (error) {
    throw new Error('Erro ao buscar produtos: ' + error.message);
  }
}

export async function getProdutoById(id) {
  try {
    // FUTURO: substituir por fetch(`/api/produtos/${id}`)
    return await simulateRequest(async () => {
      const produto = MOCK_PRODUTOS.find((item) => item.id === Number(id));
      if (!produto) throw new Error('Produto não encontrado.');
      return { ...produto };
    });
  } catch (error) {
    throw new Error('Erro ao buscar produto: ' + error.message);
  }
}

export async function login(email, senha) {
  try {
    // FUTURO: substituir por fetch('/api/auth/login', { method: 'POST', body: ... })
    return await simulateRequest(async () => {
      const user = MOCK_USERS.find((u) => u.email === email && u.senha === senha);
      if (!user) throw new Error('Credenciais inválidas.');
      return { token: 'mock-token', usuario: { id: user.id, nome: user.nome, email: user.email } };
    });
  } catch (error) {
    throw new Error('Erro no login: ' + error.message);
  }
}

export async function register(usuario) {
  try {
    // FUTURO: substituir por fetch('/api/auth/register', { method: 'POST', body: ... })
    return await simulateRequest(async () => {
      const exists = MOCK_USERS.some((u) => u.email === usuario.email);
      if (exists) throw new Error('E-mail já cadastrado.');

      const novo = { id: Date.now(), ...usuario };
      MOCK_USERS.push(novo);
      return { id: novo.id, nome: novo.nome, email: novo.email };
    });
  } catch (error) {
    throw new Error('Erro no cadastro: ' + error.message);
  }
}

// Sistema de Autenticação e Gerenciamento de Usuários
class AuthService {
    constructor() {
        this.storageKey = 'workspace_users';
        this.sessionKey = 'workspace_session';
        this.init();
    }

    init() {
        // Inicializa o storage se não existir
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Gera um ID único para o usuário
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Valida email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Valida CNPJ (formato básico)
    isValidCNPJ(cnpj) {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cnpjRegex.test(cnpj);
    }

    // Formata CNPJ
    formatCNPJ(cnpj) {
        const numbers = cnpj.replace(/\D/g, '');
        if (numbers.length !== 14) return cnpj;
        return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }

    // Verifica se o email já está cadastrado
    emailExists(email) {
        const users = this.getUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Retorna todos os usuários
    getUsers() {
        const users = localStorage.getItem(this.storageKey);
        return users ? JSON.parse(users) : [];
    }

    // Salva usuários no localStorage
    saveUsers(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    // Registra um novo usuário
    register(userData) {
        // Validações
        if (!userData.nome || !userData.email || !userData.senha || !userData.accountType) {
            return { success: false, message: 'Por favor, preencha todos os campos obrigatórios.' };
        }

        if (!this.isValidEmail(userData.email)) {
            return { success: false, message: 'Por favor, insira um email válido.' };
        }

        if (userData.senha !== userData.confirmarSenha) {
            return { success: false, message: 'As senhas não coincidem.' };
        }

        if (userData.senha.length < 6) {
            return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
        }

        // Validações específicas para Empresa
        if (userData.accountType === 'empresa') {
            if (!userData.nomeEmpresa || !userData.cnpj) {
                return { success: false, message: 'Por favor, preencha todos os campos da empresa.' };
            }
            if (!this.isValidCNPJ(userData.cnpj)) {
                return { success: false, message: 'CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX' };
            }
        }

        // Verifica se o email já existe
        if (this.emailExists(userData.email)) {
            return { success: false, message: 'Este email já está cadastrado.' };
        }

        // Cria o objeto do usuário
        const user = {
            id: this.generateId(),
            nome: userData.nome,
            email: userData.email.toLowerCase(),
            senha: userData.senha, // Em produção, usar hash (bcrypt)
            accountType: userData.accountType,
            createdAt: new Date().toISOString(),
            // Campos específicos por tipo
            ...(userData.accountType === 'empresa' && {
                nomeEmpresa: userData.nomeEmpresa,
                cnpj: this.formatCNPJ(userData.cnpj),
                telefone: userData.telefone || '',
                endereco: userData.endereco || ''
            }),
            ...(userData.accountType === 'freelancer' && {
                telefone: userData.telefone || '',
                especialidade: userData.especialidade || ''
            }),
            ...(userData.accountType === 'cliente' && {
                telefone: userData.telefone || ''
            })
        };

        // Salva o usuário
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);

        // Faz login automático após cadastro
        this.login(userData.email, userData.senha);

        return { 
            success: true, 
            message: 'Conta criada com sucesso!',
            user: user
        };
    }

    // Faz login
    login(email, senha) {
        const users = this.getUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.senha === senha
        );

        if (!user) {
            return { success: false, message: 'Email ou senha incorretos.' };
        }

        // Cria sessão
        const session = {
            userId: user.id,
            email: user.email,
            accountType: user.accountType,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        return { success: true, user: user, session: session };
    }

    // Faz logout
    logout() {
        localStorage.removeItem(this.sessionKey);
        return { success: true, message: 'Logout realizado com sucesso.' };
    }

    // Verifica se há uma sessão ativa
    getSession() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    // Retorna o usuário logado
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;

        const users = this.getUsers();
        return users.find(u => u.id === session.userId) || null;
    }

    // Verifica se o usuário está autenticado
    isAuthenticated() {
        return this.getSession() !== null;
    }

    // Redireciona para a página correta baseada no tipo de conta
    redirectByAccountType(accountType) {
        const routes = {
            'empresa': 'Dashboard.html',
            'freelancer': 'freelancer.html',
            'cliente': 'Marketplace.html' // Marketplace é a página principal para clientes
        };

        const route = routes[accountType] || 'Marketplace.html';
        window.location.href = route;
    }

    // Protege rotas - redireciona se não estiver autenticado
    protectRoute(requiredAccountType = null) {
        if (!this.isAuthenticated()) {
            window.location.href = 'Cadastro.html';
            return false;
        }

        const session = this.getSession();
        if (requiredAccountType && session.accountType !== requiredAccountType) {
            // Redireciona para a página correta do tipo de conta
            this.redirectByAccountType(session.accountType);
            return false;
        }

        return true;
    }

    // Protege Marketplace - permite todos os tipos de conta autenticados
    protectMarketplace() {
        if (!this.isAuthenticated()) {
            window.location.href = 'Cadastro.html';
            return false;
        }
        return true;
    }
}

// Instância global do serviço de autenticação
const authService = new AuthService();


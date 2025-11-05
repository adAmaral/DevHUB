// Sistema de Autenticação e Gerenciamento de Usuários - Spring Boot API
const API_BASE_URL = window.location.origin;

class AuthService {
    constructor() {
        this.sessionKey = 'workspace_session';
        this.apiBaseUrl = API_BASE_URL;
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

    // Registra um novo usuário
    async register(userData) {
        try {
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

            // Chamar API Spring Boot
            const response = await fetch(`${this.apiBaseUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nome: userData.nome,
                    email: userData.email,
                    senha: userData.senha,
                    confirmarSenha: userData.confirmarSenha,
                    accountType: userData.accountType,
                    telefone: userData.telefone || '',
                    nomeEmpresa: userData.nomeEmpresa || '',
                    cnpj: userData.cnpj ? this.formatCNPJ(userData.cnpj) : '',
                    endereco: userData.endereco || ''
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.erro || data.message || 'Erro ao criar conta. Tente novamente.';
                return { success: false, message: errorMessage };
            }

            // Salvar sessão localmente
            if (data.user) {
                // Garantir que tipo seja string
                const accountType = data.user.tipo || data.user.accountType;
                const session = {
                    userId: data.user.id,
                    email: data.user.email,
                    accountType: accountType,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
                
                // Garantir que user.tipo seja string para o frontend
                data.user.tipo = accountType;
                data.user.accountType = accountType;
            }

            return {
                success: true,
                message: data.message || 'Conta criada com sucesso!',
                user: data.user
            };
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return { success: false, message: 'Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.' };
        }
    }

    // Faz login
    async login(email, senha) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.erro || data.message || 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
                return { success: false, message: errorMessage };
            }

            // Salvar sessão localmente
            if (data.user) {
                // Garantir que tipo seja string
                const accountType = data.user.tipo || data.user.accountType;
                const session = {
                    userId: data.user.id,
                    email: data.user.email,
                    accountType: accountType,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
                
                // Garantir que user.tipo seja string para o frontend
                data.user.tipo = accountType;
                data.user.accountType = accountType;
            }

            return { success: true, user: data.user, session: JSON.parse(localStorage.getItem(this.sessionKey)) };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, message: 'Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.' };
        }
    }

    // Faz logout
    async logout() {
        try {
            await fetch(`${this.apiBaseUrl}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.removeItem(this.sessionKey);
            return { success: true, message: 'Logout realizado com sucesso.' };
        }
    }

    // Verifica se há uma sessão ativa
    getSession() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    // Retorna o usuário logado (busca do servidor)
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/auth/me`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                return null;
            }

            const user = await response.json();
            
            // Atualizar sessão local
            if (user && user.id) {
                const session = {
                    userId: user.id,
                    email: user.email,
                    accountType: user.tipo,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            }

            return user;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    // Verifica se o usuário está autenticado (sem chamar servidor toda vez)
    isAuthenticated() {
        const session = this.getSession();
        return session !== null;
    }
    
    // Verifica autenticação com o servidor (para validação real)
    async checkAuthentication() {
        try {
            const user = await this.getCurrentUser();
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    // Redireciona para a página correta baseada no tipo de conta
    redirectByAccountType(accountType) {
        if (!accountType) {
            console.error('Tipo de conta não fornecido');
            return;
        }
        
        const routes = {
            'empresa': 'Perfil-Empresa.html',
            'freelancer': 'freelancer.html',
            'cliente': 'Marketplace.html'
        };

        // Normalizar o tipo (pode vir como string ou enum)
        const normalizedType = accountType.toString().toLowerCase();
        const routeFile = routes[normalizedType] || 'Marketplace.html';
        
        // Determinar o caminho correto baseado na localização atual
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        
        // Se já estamos em /pages/, usar apenas o nome do arquivo
        // Se estamos na raiz, usar pages/nome.html
        const route = isInPagesFolder ? routeFile : `pages/${routeFile}`;
        
        console.log('Redirecionando para:', route, 'Tipo:', normalizedType);
        console.log('Página atual:', currentPath, 'Está em pages?:', isInPagesFolder);
        
        // Evitar redirecionamento infinito - verificar se já está na página correta
        const currentPage = currentPath.split('/').pop() || currentPath;
        const routePage = routeFile;
        
        // Só não redirecionar se já estiver na página correta
        if (currentPage === routePage) {
            console.log('Já está na página correta:', currentPage, '==', routePage);
            return; // Já está na página correta
        }
        
        console.log('Redirecionando de', currentPath, 'para', route);
        console.log('Página atual:', currentPage, 'Página destino:', routePage);
        window.location.href = route;
    }

    // Protege rotas - redireciona se não estiver autenticado
    async protectRoute(requiredAccountType = null) {
        // Verificar primeiro no localStorage (mais rápido)
        if (!this.isAuthenticated()) {
            window.location.href = 'Login.html';
            return false;
        }
        
        // Verificar com servidor em background
        const authenticated = await this.checkAuthentication();
        if (!authenticated) {
            localStorage.removeItem(this.sessionKey);
            window.location.href = 'Login.html';
            return false;
        }

        const session = this.getSession();
        if (requiredAccountType && session && session.accountType !== requiredAccountType) {
            // Redireciona para a página correta do tipo de conta
            this.redirectByAccountType(session.accountType);
            return false;
        }

        return true;
    }

    // Protege Marketplace - permite todos os tipos de conta autenticados
    async protectMarketplace() {
        if (!this.isAuthenticated()) {
            window.location.href = 'Login.html';
            return false;
        }
        
        const authenticated = await this.checkAuthentication();
        if (!authenticated) {
            localStorage.removeItem(this.sessionKey);
            window.location.href = 'Login.html';
            return false;
        }
        return true;
    }
}

// Instância global do serviço de autenticação
const authService = new AuthService();


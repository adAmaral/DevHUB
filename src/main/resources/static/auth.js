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
                return { success: false, message: data.erro || 'Erro ao criar conta.' };
            }

            // Salvar sessão localmente
            if (data.user) {
                const session = {
                    userId: data.user.id,
                    email: data.user.email,
                    accountType: data.user.tipo,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            }

            return {
                success: true,
                message: data.message || 'Conta criada com sucesso!',
                user: data.user
            };
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return { success: false, message: 'Erro ao conectar com o servidor.' };
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
                return { success: false, message: data.erro || 'Email ou senha incorretos.' };
            }

            // Salvar sessão localmente
            if (data.user) {
                const session = {
                    userId: data.user.id,
                    email: data.user.email,
                    accountType: data.user.tipo,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
            }

            return { success: true, user: data.user, session: JSON.parse(localStorage.getItem(this.sessionKey)) };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, message: 'Erro ao conectar com o servidor.' };
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
        const routes = {
            'empresa': 'pages/Perfil-Empresa.html',
            'freelancer': 'pages/freelancer.html',
            'cliente': 'pages/Marketplace.html'
        };

        const route = routes[accountType] || 'pages/Marketplace.html';
        
        // Evitar redirecionamento infinito - verificar se já está na página correta
        const currentPath = window.location.pathname;
        if (currentPath.includes(route)) {
            return; // Já está na página correta
        }
        
        window.location.href = route;
    }

    // Protege rotas - redireciona se não estiver autenticado
    async protectRoute(requiredAccountType = null) {
        // Verificar primeiro no localStorage (mais rápido)
        if (!this.isAuthenticated()) {
            window.location.href = 'pages/Login.html';
            return false;
        }
        
        // Verificar com servidor em background
        const authenticated = await this.checkAuthentication();
        if (!authenticated) {
            localStorage.removeItem(this.sessionKey);
            window.location.href = 'pages/Login.html';
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
            window.location.href = 'pages/Login.html';
            return false;
        }
        
        const authenticated = await this.checkAuthentication();
        if (!authenticated) {
            localStorage.removeItem(this.sessionKey);
            window.location.href = 'pages/Login.html';
            return false;
        }
        return true;
    }
}

// Instância global do serviço de autenticação
const authService = new AuthService();


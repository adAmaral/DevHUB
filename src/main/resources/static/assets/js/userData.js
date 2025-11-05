// Sistema para carregar e exibir dados do usuário logado
class UserDataService {
    constructor() {
        this.user = null;
    }

    // Carrega dados do usuário do servidor
    async loadUserData() {
        try {
            const user = await authService.getCurrentUser();
            if (user) {
                this.user = user;
                return user;
            }
            return null;
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            return null;
        }
    }

    // Preenche dados do usuário no sidebar
    fillSidebarUserData() {
        const user = this.user;
        if (!user) return;

        // Preencher nome
        const nomeElements = document.querySelectorAll('[data-user-nome]');
        nomeElements.forEach(el => {
            el.textContent = user.nome || 'Usuário';
        });

        // Preencher email
        const emailElements = document.querySelectorAll('[data-user-email]');
        emailElements.forEach(el => {
            el.textContent = user.email || '';
        });

        // Preencher plano (pode ser customizado baseado no tipo)
        const planoElements = document.querySelectorAll('[data-user-plano]');
        planoElements.forEach(el => {
            const planos = {
                'empresa': 'Plano Premium',
                'freelancer': 'Plano Pro',
                'cliente': 'Plano Básico'
            };
            el.textContent = planos[user.tipo] || 'Plano';
        });

        // Preencher avatar se houver
        const avatarElements = document.querySelectorAll('[data-user-avatar]');
        if (user.fotoUrl) {
            avatarElements.forEach(el => {
                el.style.backgroundImage = `url('${user.fotoUrl}')`;
            });
        }
    }

    // Preenche dados do usuário em inputs de formulário
    fillFormUserData() {
        const user = this.user;
        if (!user) return;

        // Preencher campos de configuração
        const nomeInput = document.getElementById('configNome');
        if (nomeInput) nomeInput.value = user.nome || '';

        const emailInput = document.getElementById('configEmail');
        if (emailInput) emailInput.value = user.email || '';

        const telefoneInput = document.getElementById('configTelefone');
        if (telefoneInput) telefoneInput.value = user.telefone || '';

        const especialidadeInput = document.getElementById('configEspecialidade');
        if (especialidadeInput) especialidadeInput.value = user.especialidade || '';

        const nomeEmpresaInput = document.getElementById('configNomeEmpresa');
        if (nomeEmpresaInput) nomeEmpresaInput.value = user.nomeEmpresa || '';

        const cnpjInput = document.getElementById('configCNPJ');
        if (cnpjInput) cnpjInput.value = user.cnpj || '';
    }

    // Preenche mensagens de boas-vindas
    fillWelcomeMessages() {
        const user = this.user;
        if (!user) return;

        const welcomeElements = document.querySelectorAll('[data-user-welcome]');
        welcomeElements.forEach(el => {
            const nome = user.nome || 'Usuário';
            const messages = {
                'default': `Bem-vindo, ${nome}!`,
                'back': `Bem-vindo de volta, ${nome}!`,
                'custom': el.getAttribute('data-welcome-text') || `Olá, ${nome}!`
            };
            const type = el.getAttribute('data-welcome-type') || 'default';
            el.textContent = messages[type] || messages.default;
        });
    }

    // Inicializa e carrega todos os dados
    async init() {
        await this.loadUserData();
        this.fillSidebarUserData();
        this.fillFormUserData();
        this.fillWelcomeMessages();
    }
}

// Instância global
const userDataService = new UserDataService();


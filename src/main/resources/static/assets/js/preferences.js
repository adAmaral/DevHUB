// Serviço para gerenciar preferências do usuário
class PreferencesService {
    constructor() {
        this.preferences = {
            darkMode: false,
            notificacoesEmail: true,
            notificacoesPush: true,
            notificacoesVendas: true
        };
        this.loading = false;
    }

    async init() {
        await this.loadPreferences();
        this.applyPreferences();
    }

    async loadPreferences() {
        try {
            const response = await fetch('/api/auth/preferencias');
            if (response.ok) {
                const data = await response.json();
                if (data.preferencias) {
                    try {
                        const prefs = JSON.parse(data.preferencias);
                        this.preferences = { ...this.preferences, ...prefs };
                    } catch (e) {
                        console.warn('Erro ao parsear preferências:', e);
                    }
                }
            }
        } catch (error) {
            console.warn('Erro ao carregar preferências:', error);
            // Tenta carregar do localStorage como fallback
            this.loadFromLocalStorage();
        }
    }

    async savePreferences(newPreferences = null) {
        if (this.loading) return;
        
        if (newPreferences) {
            this.preferences = { ...this.preferences, ...newPreferences };
        }

        try {
            this.loading = true;
            const response = await fetch('/api/auth/preferencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.preferences)
            });

            if (response.ok) {
                // Salvar também no localStorage como backup
                this.saveToLocalStorage();
                return true;
            } else {
                const error = await response.json();
                console.error('Erro ao salvar preferências:', error);
                // Salvar no localStorage como fallback
                this.saveToLocalStorage();
                return false;
            }
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            // Salvar no localStorage como fallback
            this.saveToLocalStorage();
            return false;
        } finally {
            this.loading = false;
        }
    }

    async toggleDarkMode() {
        this.preferences.darkMode = !this.preferences.darkMode;
        this.applyDarkMode();
        await this.savePreferences();
    }

    applyDarkMode() {
        const html = document.documentElement;
        if (this.preferences.darkMode) {
            html.classList.remove('light');
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
        }
    }

    applyPreferences() {
        this.applyDarkMode();
        // Aplicar outras preferências conforme necessário
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('Erro ao salvar no localStorage:', e);
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const prefs = JSON.parse(stored);
                this.preferences = { ...this.preferences, ...prefs };
            }
        } catch (e) {
            console.warn('Erro ao carregar do localStorage:', e);
        }
    }

    getPreference(key) {
        return this.preferences[key];
    }

    async setPreference(key, value) {
        this.preferences[key] = value;
        await this.savePreferences();
    }
}

// Instância global
const preferencesService = new PreferencesService();

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        preferencesService.init();
    });
} else {
    preferencesService.init();
}


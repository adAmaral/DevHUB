// Sistema de Notificações e Confirmações
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Criar container de notificações
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border max-w-md animate-slide-in-right ${
            type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
        }`;
        
        const icon = type === 'success' ? 'check_circle' :
                    type === 'error' ? 'error' :
                    type === 'warning' ? 'warning' : 'info';
        
        notification.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <p class="flex-1 text-sm font-medium">${message}</p>
            <button onclick="this.parentElement.remove()" class="text-current opacity-70 hover:opacity-100">
                <span class="material-symbols-outlined text-lg">close</span>
            </button>
        `;
        
        this.container.appendChild(notification);
        
        // Auto remover após duração
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slide-out-right 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
        
        return notification;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    confirm(message, title = 'Confirmar') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-800 animate-scale-in">
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${title}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">${message}</p>
                        <div class="flex gap-3 justify-end">
                            <button class="cancel-btn px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                Cancelar
                            </button>
                            <button class="confirm-btn px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const cancelBtn = modal.querySelector('.cancel-btn');
            const confirmBtn = modal.querySelector('.confirm-btn');
            
            const close = (result) => {
                modal.style.animation = 'scale-out 0.2s ease-out';
                setTimeout(() => modal.remove(), 200);
                resolve(result);
            };
            
            cancelBtn.onclick = () => close(false);
            confirmBtn.onclick = () => close(true);
            
            modal.onclick = (e) => {
                if (e.target === modal) close(false);
            };
        });
    }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-right {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slide-out-right {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    @keyframes scale-in {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    @keyframes scale-out {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(0.95);
            opacity: 0;
        }
    }
    .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
    }
    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }
`;
document.head.appendChild(style);

// Instância global
const notifications = new NotificationSystem();


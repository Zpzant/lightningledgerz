/**
 * LIGHTNING LEDGERZ - Professional Assistant
 * =====================================================
 * Clean, minimal AI assistant for enterprise financial software.
 * Replaces flashy avatars with Goldman/McKinsey-tier UI.
 *
 * Design principles:
 * - Subtle and professional
 * - Only appears when needed
 * - No animations or flashing
 * - Clean typography
 */

class ProfessionalAssistant {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.userName = null;

        // Professional color scheme
        this.colors = {
            primary: '#0A2540',      // Deep navy
            accent: '#635BFF',       // Subtle purple (Stripe-style)
            success: '#30D158',      // Clean green
            warning: '#FFD60A',      // Gold
            background: '#FFFFFF',
            surface: '#F7F8FA',
            text: '#1A1A1A',
            muted: '#697386'
        };

        this.init();
    }

    init() {
        // Don't auto-show anything - wait for user interaction
        this.addStyles();
        this.createAssistantButton();
        this.createAssistantPanel();

        // Hide old avatar systems
        this.hideOldAvatars();
    }

    hideOldAvatars() {
        // Hide the old flashy avatar elements
        const selectorsToHide = [
            '.avatar-selector-btn',
            '.avatar-selector-panel',
            '.avatar-container',
            '.avatar-speech-bubble',
            '.lightning-bolt-container',
            '#alaina-avatar',
            '#zac-avatar',
            '#bolt-avatar',
            '#zeus-avatar',
            '.avatar-floating'
        ];

        selectorsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    addStyles() {
        if (document.getElementById('professional-assistant-styles')) return;

        const style = document.createElement('style');
        style.id = 'professional-assistant-styles';
        style.textContent = `
            /* Hide old flashy avatars */
            .avatar-selector-btn,
            .avatar-selector-panel,
            .avatar-container,
            .avatar-speech-bubble,
            .lightning-bolt-container,
            #alaina-avatar,
            #zac-avatar,
            #bolt-avatar,
            #zeus-avatar,
            .avatar-floating {
                display: none !important;
            }

            /* Professional Assistant Button */
            .pro-assistant-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: ${this.colors.primary};
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 2px 12px rgba(10, 37, 64, 0.3);
            }

            .pro-assistant-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(10, 37, 64, 0.4);
            }

            .pro-assistant-btn svg {
                width: 24px;
                height: 24px;
            }

            /* Assistant Panel */
            .pro-assistant-panel {
                position: fixed;
                bottom: 96px;
                right: 24px;
                width: 380px;
                max-height: 520px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .pro-assistant-panel.open {
                display: flex;
            }

            /* Panel Header */
            .pro-panel-header {
                padding: 16px 20px;
                background: ${this.colors.primary};
                color: white;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .pro-panel-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255,255,255,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }

            .pro-panel-info {
                flex: 1;
            }

            .pro-panel-name {
                font-weight: 600;
                font-size: 15px;
                margin: 0;
            }

            .pro-panel-status {
                font-size: 12px;
                opacity: 0.8;
                margin: 2px 0 0;
            }

            .pro-panel-close {
                background: none;
                border: none;
                color: white;
                opacity: 0.7;
                cursor: pointer;
                padding: 4px;
                font-size: 18px;
                line-height: 1;
            }

            .pro-panel-close:hover {
                opacity: 1;
            }

            /* Panel Content */
            .pro-panel-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: ${this.colors.surface};
            }

            /* Quick Actions */
            .pro-quick-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                gap: 10px;
                margin-bottom: 16px;
            }

            .pro-quick-btn {
                background: white;
                border: 1px solid #E3E8EE;
                border-radius: 8px;
                padding: 14px 12px;
                text-align: left;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            .pro-quick-btn:hover {
                border-color: ${this.colors.accent};
                box-shadow: 0 2px 8px rgba(99, 91, 255, 0.1);
            }

            .pro-quick-icon {
                font-size: 20px;
                margin-bottom: 6px;
            }

            .pro-quick-label {
                font-size: 13px;
                font-weight: 500;
                color: ${this.colors.text};
                display: block;
            }

            .pro-quick-desc {
                font-size: 11px;
                color: ${this.colors.muted};
                margin-top: 2px;
            }

            /* Messages */
            .pro-messages {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .pro-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.5;
            }

            .pro-message.assistant {
                background: white;
                border: 1px solid #E3E8EE;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }

            .pro-message.user {
                background: ${this.colors.primary};
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }

            /* Welcome Card */
            .pro-welcome-card {
                background: white;
                border: 1px solid #E3E8EE;
                border-radius: 10px;
                padding: 16px;
                margin-bottom: 16px;
            }

            .pro-welcome-title {
                font-size: 15px;
                font-weight: 600;
                color: ${this.colors.text};
                margin: 0 0 6px;
            }

            .pro-welcome-text {
                font-size: 13px;
                color: ${this.colors.muted};
                margin: 0;
                line-height: 1.5;
            }

            /* Input Area */
            .pro-panel-input {
                padding: 16px;
                background: white;
                border-top: 1px solid #E3E8EE;
            }

            .pro-input-wrapper {
                display: flex;
                gap: 8px;
            }

            .pro-input-field {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #E3E8EE;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .pro-input-field:focus {
                border-color: ${this.colors.accent};
            }

            .pro-send-btn {
                background: ${this.colors.primary};
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }

            .pro-send-btn:hover {
                background: #0D3057;
            }

            /* Notification Badge */
            .pro-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: ${this.colors.success};
                color: white;
                font-size: 10px;
                font-weight: 600;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .pro-assistant-panel {
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    max-height: 70vh;
                    border-radius: 16px 16px 0 0;
                }

                .pro-assistant-btn {
                    bottom: 16px;
                    right: 16px;
                    width: 52px;
                    height: 52px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createAssistantButton() {
        if (document.getElementById('pro-assistant-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'pro-assistant-btn';
        btn.className = 'pro-assistant-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
    }

    createAssistantPanel() {
        if (document.getElementById('pro-assistant-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'pro-assistant-panel';
        panel.className = 'pro-assistant-panel';
        panel.innerHTML = `
            <div class="pro-panel-header">
                <div class="pro-panel-avatar">
                    <img src="zac_mps.jpg" alt="Zac" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.parentElement.innerHTML='⚡'">
                </div>
                <div class="pro-panel-info">
                    <p class="pro-panel-name">Zac Prizant</p>
                    <p class="pro-panel-status">Financial Strategist AI</p>
                </div>
                <button class="pro-panel-close" onclick="window.ProAssistant.close()">&times;</button>
            </div>
            <div class="pro-panel-content" id="pro-panel-content">
                <div class="pro-welcome-card">
                    <h3 class="pro-welcome-title">Welcome to Lightning Ledgerz</h3>
                    <p class="pro-welcome-text">Get instant financial insights, generate reports, and analyze your data with AI-powered tools.</p>
                </div>
                <div class="pro-quick-actions">
                    <button class="pro-quick-btn" onclick="window.ProAssistant.action('bva')">
                        <span class="pro-quick-icon">📊</span>
                        <span class="pro-quick-label">Budget vs Actual</span>
                        <span class="pro-quick-desc">Variance analysis</span>
                    </button>
                    <button class="pro-quick-btn" onclick="window.ProAssistant.action('pl')">
                        <span class="pro-quick-icon">📋</span>
                        <span class="pro-quick-label">P&L Statement</span>
                        <span class="pro-quick-desc">Income statement</span>
                    </button>
                    <button class="pro-quick-btn" onclick="window.ProAssistant.action('excel')">
                        <span class="pro-quick-icon">📐</span>
                        <span class="pro-quick-label">Excel Formulas</span>
                        <span class="pro-quick-desc">INDEX MATCH, SUMIFS</span>
                    </button>
                    <button class="pro-quick-btn" onclick="window.ProAssistant.action('upload')">
                        <span class="pro-quick-icon">📁</span>
                        <span class="pro-quick-label">Upload Data</span>
                        <span class="pro-quick-desc">CSV/Excel files</span>
                    </button>
                    <button class="pro-quick-btn" onclick="window.ProAssistant.action('deck')">
                        <span class="pro-quick-icon">🎯</span>
                        <span class="pro-quick-label">Create Deck</span>
                        <span class="pro-quick-desc">Consulting-grade</span>
                    </button>
                </div>
                <div class="pro-messages" id="pro-messages"></div>
            </div>
            <div class="pro-panel-input">
                <div class="pro-input-wrapper">
                    <input type="text" class="pro-input-field" id="pro-input-field" placeholder="Ask about your finances..." onkeypress="if(event.key==='Enter')window.ProAssistant.send()">
                    <button class="pro-send-btn" onclick="window.ProAssistant.send()">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('pro-assistant-panel');
        if (panel) {
            panel.classList.toggle('open', this.isOpen);
        }
    }

    open() {
        this.isOpen = true;
        const panel = document.getElementById('pro-assistant-panel');
        if (panel) panel.classList.add('open');
    }

    close() {
        this.isOpen = false;
        const panel = document.getElementById('pro-assistant-panel');
        if (panel) panel.classList.remove('open');
    }

    action(type) {
        this.close();

        switch (type) {
            case 'bva':
                if (typeof openBudgetVsActual === 'function') {
                    openBudgetVsActual();
                } else if (typeof openFinancialHub === 'function') {
                    openFinancialHub();
                }
                break;
            case 'pl':
                if (typeof openPLStatement === 'function') {
                    openPLStatement();
                } else if (typeof openFinancialHub === 'function') {
                    openFinancialHub();
                }
                break;
            case 'excel':
                if (typeof openExcelAI === 'function') {
                    openExcelAI();
                }
                break;
            case 'upload':
                if (typeof openFinancialHub === 'function') {
                    openFinancialHub();
                }
                break;
            case 'deck':
                if (typeof openAIPresentationChat === 'function') {
                    openAIPresentationChat();
                }
                break;
        }
    }

    send() {
        const input = document.getElementById('pro-input-field');
        const text = input?.value?.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        // Simple response logic
        setTimeout(() => {
            this.handleQuery(text);
        }, 500);
    }

    addMessage(text, type) {
        const container = document.getElementById('pro-messages');
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = `pro-message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);

        // Scroll to bottom
        const content = document.getElementById('pro-panel-content');
        if (content) content.scrollTop = content.scrollHeight;
    }

    handleQuery(text) {
        const lower = text.toLowerCase();

        if (lower.includes('budget') || lower.includes('variance') || lower.includes('actual')) {
            this.addMessage("I can help with Budget vs Actual analysis. Click 'Budget vs Actual' above to generate a variance report, or upload your data in the Upload Data section.", 'assistant');
        } else if (lower.includes('p&l') || lower.includes('income') || lower.includes('profit')) {
            this.addMessage("For P&L statements, click 'P&L Statement' above. You can also upload your GL export to generate a full income statement with margins.", 'assistant');
        } else if (lower.includes('upload') || lower.includes('import') || lower.includes('data')) {
            this.addMessage("Click 'Upload Data' to import your financial files. We support CSV and Excel formats for budgets, actuals, and GL exports.", 'assistant');
        } else if (lower.includes('presentation') || lower.includes('deck') || lower.includes('powerpoint')) {
            this.addMessage("Click 'Create Deck' to generate AI-powered presentations from your financial data. Our system creates McKinsey-quality slides automatically.", 'assistant');
        } else {
            this.addMessage("I can help you with:\n• Budget vs Actual analysis\n• P&L statements\n• Data uploads\n• Presentation creation\n\nWhat would you like to do?", 'assistant');
        }
    }

    // Welcome message for logged-in users
    welcomeUser(firstName) {
        this.userName = firstName;
        const welcomeCard = document.querySelector('.pro-welcome-card');
        if (welcomeCard) {
            welcomeCard.querySelector('.pro-welcome-title').textContent = `Welcome back, ${firstName}`;
            welcomeCard.querySelector('.pro-welcome-text').textContent = 'Ready to analyze your finances? Choose an action below or ask me anything.';
        }
    }

    // Show a notification
    notify(message) {
        const btn = document.getElementById('pro-assistant-btn');
        if (btn && !this.isOpen) {
            // Add badge
            let badge = btn.querySelector('.pro-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'pro-badge';
                badge.textContent = '1';
                btn.appendChild(badge);
            }
        }

        // Add message when opened
        this.pendingMessage = message;
    }
}

// Initialize
window.ProAssistant = new ProfessionalAssistant();

// Override the old avatar welcome functions
window.welcomeUserWithAvatar = function(firstName) {
    if (window.ProAssistant) {
        window.ProAssistant.welcomeUser(firstName);
    }
};

console.log('✓ Professional Assistant loaded');

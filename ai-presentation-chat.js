/**
 * AI Presentation Chat - Conversational Deck Builder
 * Clean PopAI-style interface with avatar integration
 */

class AIPresentationChat {
    constructor() {
        this.messages = [];
        this.currentAvatar = 'zac'; // Default
        this.avatarData = {
            zac: {
                name: 'Zac',
                title: 'Your Financial Strategist',
                image: 'zac_mps.jpg',
                greeting: "Hey! I'm Zac. Let's build a killer presentation together. What's it about?",
                style: 'energetic'
            },
            alaina: {
                name: 'Alaina',
                title: 'Your Creative Director',
                image: 'alaina-avatar.png',
                greeting: "Hi there! I'm Alaina. Ready to create something beautiful? Tell me about your presentation.",
                style: 'warm'
            },
            bolt: {
                name: 'Bolt',
                title: 'Your Speed Expert',
                image: 'bolt-avatar.png',
                greeting: "Let's move fast! What presentation do you need? I'll have it ready in no time.",
                style: 'fast'
            },
            zeus: {
                name: 'Zeus',
                title: 'Your Power Presenter',
                image: 'zeus-avatar.png',
                greeting: "Ready to create something powerful? Tell me your vision and I'll bring the thunder.",
                style: 'powerful'
            }
        };
        this.slides = [];
        this.isGenerating = false;

        this.init();
    }

    init() {
        // Detect selected avatar from localStorage or window
        this.detectAvatar();
        this.createInterface();
        this.attachEventListeners();
    }

    detectAvatar() {
        // Check localStorage for selected avatar
        const saved = localStorage.getItem('selectedAvatar');
        if (saved && this.avatarData[saved]) {
            this.currentAvatar = saved;
        }
        // Also check if window has avatar selection
        if (window.currentSelectedAvatar && this.avatarData[window.currentSelectedAvatar]) {
            this.currentAvatar = window.currentSelectedAvatar;
        }
    }

    createInterface() {
        // Remove existing if any
        const existing = document.getElementById('ai-pres-chat-modal');
        if (existing) existing.remove();

        const avatar = this.avatarData[this.currentAvatar];

        const modal = document.createElement('div');
        modal.id = 'ai-pres-chat-modal';
        modal.className = 'ai-pres-chat-modal';
        modal.innerHTML = `
            <div class="ai-pres-chat-container">
                <!-- Header -->
                <div class="ai-pres-chat-header">
                    <div class="ai-pres-chat-title">
                        <span class="lightning-icon">⚡</span>
                        <span>AI Presentation Builder</span>
                    </div>
                    <div class="ai-pres-chat-actions">
                        <button class="ai-pres-btn-secondary" onclick="aiPresChat.toggleSlidePanel()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                            <span class="slide-count">0 Slides</span>
                        </button>
                        <button class="ai-pres-btn-primary" onclick="aiPresChat.downloadDeck()" id="download-deck-btn" disabled>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download PPTX
                        </button>
                        <button class="ai-pres-close" onclick="aiPresChat.close()">&times;</button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="ai-pres-chat-main">
                    <!-- Chat Panel -->
                    <div class="ai-pres-chat-panel">
                        <!-- Avatar Header -->
                        <div class="ai-pres-avatar-header">
                            <div class="ai-pres-avatar-img">
                                <img src="${avatar.image}" alt="${avatar.name}" onerror="this.src='https://via.placeholder.com/80?text=${avatar.name[0]}'">
                            </div>
                            <div class="ai-pres-avatar-info">
                                <h3>${avatar.name}</h3>
                                <p>${avatar.title}</p>
                            </div>
                            <button class="change-avatar-btn" onclick="aiPresChat.showAvatarSelector()">
                                Change
                            </button>
                        </div>

                        <!-- Chat Messages -->
                        <div class="ai-pres-messages" id="ai-pres-messages">
                            <div class="ai-message">
                                <div class="ai-message-avatar">
                                    <img src="${avatar.image}" alt="${avatar.name}" onerror="this.src='https://via.placeholder.com/40?text=${avatar.name[0]}'">
                                </div>
                                <div class="ai-message-content">
                                    <div class="ai-message-name">${avatar.name}</div>
                                    <div class="ai-message-text">${avatar.greeting}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Prompts -->
                        <div class="ai-pres-quick-prompts">
                            <button onclick="aiPresChat.usePrompt('Create a quarterly financial report for my company')">📊 Financial Report</button>
                            <button onclick="aiPresChat.usePrompt('Build an investor pitch deck for a SaaS startup')">🚀 Investor Pitch</button>
                            <button onclick="aiPresChat.usePrompt('Make a sales presentation with KPIs and growth metrics')">📈 Sales Deck</button>
                            <button onclick="aiPresChat.usePrompt('Create a project status update presentation')">📋 Status Update</button>
                        </div>

                        <!-- Chat Input -->
                        <div class="ai-pres-chat-input-container">
                            <textarea
                                id="ai-pres-chat-input"
                                placeholder="Describe your presentation... e.g., 'Create a Q4 financial report with revenue trends and KPIs'"
                                rows="2"
                            ></textarea>
                            <button class="ai-pres-send-btn" onclick="aiPresChat.sendMessage()" id="ai-pres-send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Slides Panel (Hidden by default) -->
                    <div class="ai-pres-slides-panel hidden" id="ai-pres-slides-panel">
                        <div class="slides-panel-header">
                            <h3>Your Slides</h3>
                            <button onclick="aiPresChat.toggleSlidePanel()" class="close-slides-btn">&times;</button>
                        </div>
                        <div class="slides-list" id="slides-list">
                            <div class="no-slides">
                                <p>No slides yet. Start chatting to generate your presentation!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Theme Selector (Bottom) -->
                <div class="ai-pres-themes">
                    <span class="themes-label">Theme:</span>
                    <div class="theme-options">
                        <button class="theme-btn active" data-theme="professional" onclick="aiPresChat.setTheme('professional')">Professional</button>
                        <button class="theme-btn" data-theme="minimal" onclick="aiPresChat.setTheme('minimal')">Minimal</button>
                        <button class="theme-btn" data-theme="bold" onclick="aiPresChat.setTheme('bold')">Bold</button>
                        <button class="theme-btn" data-theme="dark" onclick="aiPresChat.setTheme('dark')">Dark</button>
                    </div>
                </div>
            </div>

            <!-- Avatar Selector Modal -->
            <div class="avatar-selector-modal hidden" id="avatar-selector-modal">
                <div class="avatar-selector-content">
                    <h3>Choose Your Presentation Helper</h3>
                    <div class="avatar-options">
                        ${Object.keys(this.avatarData).map(key => `
                            <div class="avatar-option ${key === this.currentAvatar ? 'selected' : ''}" onclick="aiPresChat.selectAvatar('${key}')">
                                <img src="${this.avatarData[key].image}" alt="${this.avatarData[key].name}" onerror="this.src='https://via.placeholder.com/60?text=${this.avatarData[key].name[0]}'">
                                <span>${this.avatarData[key].name}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="close-avatar-selector" onclick="aiPresChat.hideAvatarSelector()">Done</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('ai-pres-chat-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ai-pres-chat-styles';
        styles.textContent = `
            .ai-pres-chat-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 100000;
                overflow: hidden;
            }

            .ai-pres-chat-modal.active {
                display: flex;
            }

            .ai-pres-chat-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #0a0a0a;
            }

            /* Header */
            .ai-pres-chat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 24px;
                background: rgba(0,0,0,0.8);
                border-bottom: 1px solid rgba(255,51,51,0.3);
            }

            .ai-pres-chat-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.3rem;
                font-weight: 700;
                color: #fff;
            }

            .lightning-icon {
                font-size: 1.5rem;
            }

            .ai-pres-chat-actions {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .ai-pres-btn-secondary {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s;
            }

            .ai-pres-btn-secondary:hover {
                background: rgba(255,255,255,0.2);
            }

            .ai-pres-btn-primary {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border: none;
                color: #fff;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                transition: all 0.2s;
            }

            .ai-pres-btn-primary:hover:not(:disabled) {
                transform: scale(1.02);
                box-shadow: 0 4px 20px rgba(255,51,51,0.4);
            }

            .ai-pres-btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .ai-pres-close {
                background: none;
                border: none;
                color: #888;
                font-size: 28px;
                cursor: pointer;
                padding: 0 8px;
                transition: color 0.2s;
            }

            .ai-pres-close:hover {
                color: #ff3333;
            }

            /* Main Content */
            .ai-pres-chat-main {
                flex: 1;
                display: flex;
                overflow: hidden;
            }

            /* Chat Panel */
            .ai-pres-chat-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }

            /* Avatar Header */
            .ai-pres-avatar-header {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(255,51,51,0.1), rgba(255,51,51,0.05));
                border-radius: 16px;
                margin-bottom: 20px;
            }

            .ai-pres-avatar-img {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid #ff3333;
                flex-shrink: 0;
            }

            .ai-pres-avatar-img img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .ai-pres-avatar-info {
                flex: 1;
            }

            .ai-pres-avatar-info h3 {
                color: #fff;
                margin: 0 0 4px 0;
                font-size: 1.2rem;
            }

            .ai-pres-avatar-info p {
                color: #888;
                margin: 0;
                font-size: 0.9rem;
            }

            .change-avatar-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: all 0.2s;
            }

            .change-avatar-btn:hover {
                background: rgba(255,51,51,0.2);
                border-color: #ff3333;
            }

            /* Messages */
            .ai-pres-messages {
                flex: 1;
                overflow-y: auto;
                padding: 10px 0;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .ai-message, .user-message {
                display: flex;
                gap: 12px;
                animation: fadeIn 0.3s ease;
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .ai-message-avatar, .user-message-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
            }

            .ai-message-avatar img, .user-message-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .ai-message-content, .user-message-content {
                max-width: 70%;
            }

            .ai-message-name {
                color: #ff3333;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .ai-message-text {
                background: rgba(255,255,255,0.05);
                padding: 12px 16px;
                border-radius: 16px;
                border-top-left-radius: 4px;
                color: #e0e0e0;
                line-height: 1.5;
            }

            .user-message-content .ai-message-text {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                color: #fff;
                border-top-left-radius: 16px;
                border-top-right-radius: 4px;
            }

            /* Slide Preview in Message */
            .slide-preview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
                margin-top: 12px;
            }

            .slide-preview-item {
                background: #1a1a1a;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.2s;
                border: 2px solid transparent;
            }

            .slide-preview-item:hover {
                border-color: #ff3333;
                transform: scale(1.02);
            }

            .slide-preview-thumb {
                aspect-ratio: 16/9;
                background: #222;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }

            .slide-preview-title {
                padding: 8px;
                font-size: 0.75rem;
                color: #ccc;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            /* Quick Prompts */
            .ai-pres-quick-prompts {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px 0;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .ai-pres-quick-prompts button {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.15);
                color: #ccc;
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .ai-pres-quick-prompts button:hover {
                background: rgba(255,51,51,0.15);
                border-color: rgba(255,51,51,0.5);
                color: #fff;
            }

            /* Chat Input */
            .ai-pres-chat-input-container {
                display: flex;
                gap: 12px;
                padding: 16px;
                background: rgba(255,255,255,0.03);
                border-radius: 16px;
                border: 1px solid rgba(255,255,255,0.1);
            }

            #ai-pres-chat-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #fff;
                font-size: 1rem;
                resize: none;
                outline: none;
                font-family: inherit;
            }

            #ai-pres-chat-input::placeholder {
                color: #666;
            }

            .ai-pres-send-btn {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border: none;
                border-radius: 50%;
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                flex-shrink: 0;
            }

            .ai-pres-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 20px rgba(255,51,51,0.4);
            }

            .ai-pres-send-btn.loading {
                animation: pulse 1s infinite;
            }

            /* Slides Panel */
            .ai-pres-slides-panel {
                width: 350px;
                background: rgba(0,0,0,0.5);
                border-left: 1px solid rgba(255,255,255,0.1);
                display: flex;
                flex-direction: column;
            }

            .ai-pres-slides-panel.hidden {
                display: none;
            }

            .slides-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .slides-panel-header h3 {
                color: #fff;
                margin: 0;
            }

            .close-slides-btn {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
            }

            .slides-list {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }

            .no-slides {
                text-align: center;
                color: #666;
                padding: 40px 20px;
            }

            /* Themes */
            .ai-pres-themes {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px 24px;
                background: rgba(0,0,0,0.5);
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .themes-label {
                color: #888;
                font-size: 0.9rem;
            }

            .theme-options {
                display: flex;
                gap: 8px;
            }

            .theme-btn {
                padding: 8px 16px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.15);
                color: #888;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .theme-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .theme-btn.active {
                background: #ff3333;
                border-color: #ff3333;
                color: #fff;
            }

            /* Avatar Selector Modal */
            .avatar-selector-modal {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }

            .avatar-selector-modal.hidden {
                display: none;
            }

            .avatar-selector-content {
                background: #1a1a1a;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                border: 1px solid rgba(255,51,51,0.3);
            }

            .avatar-selector-content h3 {
                color: #fff;
                margin: 0 0 24px 0;
            }

            .avatar-options {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 24px;
            }

            .avatar-option {
                cursor: pointer;
                text-align: center;
                padding: 12px;
                border-radius: 12px;
                transition: all 0.2s;
                border: 2px solid transparent;
            }

            .avatar-option:hover {
                background: rgba(255,51,51,0.1);
            }

            .avatar-option.selected {
                border-color: #ff3333;
                background: rgba(255,51,51,0.15);
            }

            .avatar-option img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 8px;
            }

            .avatar-option span {
                display: block;
                color: #fff;
                font-size: 0.9rem;
            }

            .close-avatar-selector {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border: none;
                color: #fff;
                padding: 12px 32px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .close-avatar-selector:hover {
                transform: scale(1.05);
            }

            /* Typing indicator */
            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #ff3333;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typing {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .ai-pres-chat-header {
                    padding: 12px 16px;
                }

                .ai-pres-chat-title {
                    font-size: 1rem;
                }

                .ai-pres-btn-secondary span {
                    display: none;
                }

                .ai-pres-btn-primary span {
                    display: none;
                }

                .ai-pres-chat-panel {
                    padding: 12px;
                }

                .ai-pres-avatar-header {
                    padding: 12px;
                }

                .ai-pres-avatar-img {
                    width: 50px;
                    height: 50px;
                }

                .ai-pres-avatar-info h3 {
                    font-size: 1rem;
                }

                .ai-pres-quick-prompts {
                    overflow-x: auto;
                    flex-wrap: nowrap;
                    padding-bottom: 8px;
                }

                .ai-pres-quick-prompts button {
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .ai-pres-slides-panel {
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    max-width: 300px;
                    z-index: 5;
                }

                .theme-options {
                    overflow-x: auto;
                }

                .theme-btn {
                    white-space: nowrap;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    attachEventListeners() {
        // Enter key to send
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                const input = document.getElementById('ai-pres-chat-input');
                if (document.activeElement === input) {
                    e.preventDefault();
                    this.sendMessage();
                }
            }
        });
    }

    open() {
        this.detectAvatar(); // Re-detect in case it changed
        this.createInterface(); // Rebuild with current avatar
        document.getElementById('ai-pres-chat-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.getElementById('ai-pres-chat-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    usePrompt(prompt) {
        const input = document.getElementById('ai-pres-chat-input');
        input.value = prompt;
        input.focus();
    }

    async sendMessage() {
        const input = document.getElementById('ai-pres-chat-input');
        const message = input.value.trim();
        if (!message || this.isGenerating) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Generate presentation
        this.isGenerating = true;
        document.getElementById('ai-pres-send-btn').classList.add('loading');

        try {
            // Simulate AI response (in production, this would call Claude API)
            await this.generatePresentation(message);
        } catch (error) {
            this.hideTyping();
            this.addMessage("Sorry, I encountered an error. Please try again.", 'ai');
        }

        this.isGenerating = false;
        document.getElementById('ai-pres-send-btn').classList.remove('loading');
    }

    addMessage(text, type) {
        const messagesContainer = document.getElementById('ai-pres-messages');
        const avatar = this.avatarData[this.currentAvatar];

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message' : 'ai-message';

        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="user-message-avatar">
                    <div style="width:100%;height:100%;background:#ff3333;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">You</div>
                </div>
                <div class="user-message-content">
                    <div class="ai-message-text">${text}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message-avatar">
                    <img src="${avatar.image}" alt="${avatar.name}" onerror="this.src='https://via.placeholder.com/40?text=${avatar.name[0]}'">
                </div>
                <div class="ai-message-content">
                    <div class="ai-message-name">${avatar.name}</div>
                    <div class="ai-message-text">${text}</div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ type, text });
    }

    addMessageWithSlides(text, slides) {
        const messagesContainer = document.getElementById('ai-pres-messages');
        const avatar = this.avatarData[this.currentAvatar];

        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';

        let slidesHtml = '<div class="slide-preview-grid">';
        slides.forEach((slide, idx) => {
            slidesHtml += `
                <div class="slide-preview-item" onclick="aiPresChat.previewSlide(${idx})">
                    <div class="slide-preview-thumb">${slide.icon || '📊'}</div>
                    <div class="slide-preview-title">${slide.title}</div>
                </div>
            `;
        });
        slidesHtml += '</div>';

        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                <img src="${avatar.image}" alt="${avatar.name}" onerror="this.src='https://via.placeholder.com/40?text=${avatar.name[0]}'">
            </div>
            <div class="ai-message-content">
                <div class="ai-message-name">${avatar.name}</div>
                <div class="ai-message-text">${text}${slidesHtml}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Update slide count
        document.querySelector('.slide-count').textContent = `${this.slides.length} Slides`;
        document.getElementById('download-deck-btn').disabled = false;
    }

    showTyping() {
        const messagesContainer = document.getElementById('ai-pres-messages');
        const avatar = this.avatarData[this.currentAvatar];

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">
                <img src="${avatar.image}" alt="${avatar.name}" onerror="this.src='https://via.placeholder.com/40?text=${avatar.name[0]}'">
            </div>
            <div class="ai-message-content">
                <div class="ai-message-name">${avatar.name}</div>
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    async generatePresentation(prompt) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.hideTyping();

        // Generate slides based on prompt
        const slides = this.createSlidesFromPrompt(prompt);
        this.slides = slides;

        const avatar = this.avatarData[this.currentAvatar];
        let responseText = '';

        switch (avatar.style) {
            case 'energetic':
                responseText = `Boom! 💥 I've created ${slides.length} slides for you! Here's what we've got:`;
                break;
            case 'warm':
                responseText = `I've put together ${slides.length} beautiful slides for your presentation. Take a look:`;
                break;
            case 'fast':
                responseText = `Done! ${slides.length} slides ready. Here they are:`;
                break;
            case 'powerful':
                responseText = `Behold! ${slides.length} powerful slides that will command attention:`;
                break;
            default:
                responseText = `I've generated ${slides.length} slides for you:`;
        }

        this.addMessageWithSlides(responseText, slides);
        this.updateSlidesPanel();
    }

    createSlidesFromPrompt(prompt) {
        const promptLower = prompt.toLowerCase();
        let slides = [];

        // Determine presentation type and generate appropriate slides
        if (promptLower.includes('financial') || promptLower.includes('report') || promptLower.includes('quarterly')) {
            slides = [
                { title: 'Executive Summary', icon: '📋', type: 'title' },
                { title: 'Revenue Overview', icon: '💰', type: 'chart' },
                { title: 'Expense Analysis', icon: '📊', type: 'chart' },
                { title: 'Profit & Loss', icon: '📈', type: 'table' },
                { title: 'Key Metrics', icon: '🎯', type: 'kpi' },
                { title: 'Cash Flow', icon: '💵', type: 'chart' },
                { title: 'Year-over-Year', icon: '📆', type: 'comparison' },
                { title: 'Forecast', icon: '🔮', type: 'chart' },
                { title: 'Recommendations', icon: '💡', type: 'bullets' },
                { title: 'Next Steps', icon: '➡️', type: 'bullets' }
            ];
        } else if (promptLower.includes('investor') || promptLower.includes('pitch')) {
            slides = [
                { title: 'Cover Slide', icon: '🚀', type: 'title' },
                { title: 'The Problem', icon: '❓', type: 'bullets' },
                { title: 'Our Solution', icon: '💡', type: 'bullets' },
                { title: 'Market Opportunity', icon: '🌍', type: 'chart' },
                { title: 'Business Model', icon: '💰', type: 'diagram' },
                { title: 'Traction', icon: '📈', type: 'chart' },
                { title: 'The Team', icon: '👥', type: 'team' },
                { title: 'Financials', icon: '📊', type: 'table' },
                { title: 'The Ask', icon: '🎯', type: 'bullets' },
                { title: 'Contact', icon: '📧', type: 'contact' }
            ];
        } else if (promptLower.includes('sales') || promptLower.includes('kpi')) {
            slides = [
                { title: 'Sales Overview', icon: '📊', type: 'title' },
                { title: 'Revenue by Region', icon: '🗺️', type: 'chart' },
                { title: 'Top Performers', icon: '🏆', type: 'table' },
                { title: 'Pipeline Analysis', icon: '📈', type: 'funnel' },
                { title: 'Win/Loss Analysis', icon: '⚖️', type: 'chart' },
                { title: 'KPI Dashboard', icon: '🎯', type: 'kpi' },
                { title: 'Customer Segments', icon: '👥', type: 'chart' },
                { title: 'Goals vs Actual', icon: '📊', type: 'comparison' }
            ];
        } else {
            // Default presentation
            slides = [
                { title: 'Title Slide', icon: '📋', type: 'title' },
                { title: 'Agenda', icon: '📝', type: 'bullets' },
                { title: 'Overview', icon: '🔍', type: 'bullets' },
                { title: 'Key Points', icon: '💡', type: 'bullets' },
                { title: 'Data Analysis', icon: '📊', type: 'chart' },
                { title: 'Summary', icon: '✅', type: 'bullets' },
                { title: 'Next Steps', icon: '➡️', type: 'bullets' }
            ];
        }

        return slides;
    }

    updateSlidesPanel() {
        const slidesList = document.getElementById('slides-list');

        if (this.slides.length === 0) {
            slidesList.innerHTML = '<div class="no-slides"><p>No slides yet. Start chatting to generate your presentation!</p></div>';
            return;
        }

        let html = '';
        this.slides.forEach((slide, idx) => {
            html += `
                <div class="slide-preview-item" style="margin-bottom: 10px;" onclick="aiPresChat.previewSlide(${idx})">
                    <div class="slide-preview-thumb">${slide.icon}</div>
                    <div class="slide-preview-title">${idx + 1}. ${slide.title}</div>
                </div>
            `;
        });

        slidesList.innerHTML = html;
    }

    toggleSlidePanel() {
        const panel = document.getElementById('ai-pres-slides-panel');
        panel.classList.toggle('hidden');
    }

    previewSlide(index) {
        // Could open full slide editor here
        console.log('Preview slide:', index, this.slides[index]);
    }

    setTheme(theme) {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        this.currentTheme = theme;
    }

    showAvatarSelector() {
        document.getElementById('avatar-selector-modal').classList.remove('hidden');
    }

    hideAvatarSelector() {
        document.getElementById('avatar-selector-modal').classList.add('hidden');
    }

    selectAvatar(avatarKey) {
        this.currentAvatar = avatarKey;
        localStorage.setItem('selectedAvatar', avatarKey);

        // Update selection UI
        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.classList.toggle('selected', opt.querySelector('span').textContent === this.avatarData[avatarKey].name);
        });

        // Rebuild interface with new avatar
        this.hideAvatarSelector();
        this.createInterface();
        document.getElementById('ai-pres-chat-modal').classList.add('active');
    }

    async downloadDeck() {
        if (this.slides.length === 0) return;

        // Use PptxGenJS if available
        if (typeof PptxGenJS !== 'undefined') {
            const pptx = new PptxGenJS();
            pptx.title = 'AI Generated Presentation';
            pptx.author = 'Lightning Ledgerz';

            this.slides.forEach(slide => {
                const pptSlide = pptx.addSlide();

                // Add title
                pptSlide.addText(slide.title, {
                    x: 0.5,
                    y: 0.5,
                    w: '90%',
                    fontSize: 32,
                    bold: true,
                    color: '333333'
                });

                // Add icon/placeholder
                pptSlide.addText(slide.icon, {
                    x: '40%',
                    y: '40%',
                    fontSize: 72
                });
            });

            await pptx.writeFile({ fileName: 'Lightning_Ledgerz_Presentation.pptx' });
        } else {
            alert('PowerPoint generation requires PptxGenJS. Please ensure it is loaded.');
        }
    }
}

// Initialize
let aiPresChat;
document.addEventListener('DOMContentLoaded', () => {
    aiPresChat = new AIPresentationChat();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!aiPresChat) {
            aiPresChat = new AIPresentationChat();
        }
    }, 100);
}

// Global function to open
window.openAIPresentationChat = function() {
    if (aiPresChat) {
        aiPresChat.open();
    } else {
        aiPresChat = new AIPresentationChat();
        aiPresChat.open();
    }
};

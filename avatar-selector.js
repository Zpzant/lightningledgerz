// =====================================================
// LIGHTNING LEDGERZ - AVATAR SELECTOR
// Switch between different avatar characters
// =====================================================

class AvatarSelector {
    constructor() {
        this.currentAvatar = 'zac';
        this.avatars = {
            zac: {
                name: 'Zac',
                title: 'Financial Strategist',
                icon: '🎩',
                color: '#ff3333',
                description: 'Sharp, professional, edgy style'
            },
            bolt: {
                name: 'Bolt',
                title: 'Lightning Helper',
                icon: '⚡',
                color: '#ffd700',
                description: 'Cute, energetic lightning mascot'
            },
            zeus: {
                name: 'Zeus',
                title: 'Lord of Thunder',
                icon: '⚡',
                color: '#8866ff',
                description: 'Majestic Greek god of finance'
            },
            alaina: {
                name: 'Alaina',
                title: 'Lady Lightning',
                icon: '👩',
                color: '#ff6699',
                description: 'Stylish financial spark'
            }
        };
        this.init();
    }

    init() {
        this.addStyles();
        this.createSelectorButton();
        this.createSelectorPanel();
        this.loadSavedAvatar();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'avatar-selector-styles';
        style.textContent = `
            .avatar-selector-btn {
                position: fixed;
                bottom: 240px;
                right: 20px;
                width: 55px;
                height: 55px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border: 3px solid #ffd700;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                z-index: 9997;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(255, 51, 51, 0.5), 0 0 15px rgba(255, 215, 0, 0.3);
                animation: avatarBtnPulse 2s ease-in-out infinite;
            }

            @keyframes avatarBtnPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(255, 51, 51, 0.5), 0 0 15px rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 4px 30px rgba(255, 51, 51, 0.8), 0 0 25px rgba(255, 215, 0, 0.5); }
            }

            .avatar-selector-btn:hover {
                transform: scale(1.15);
                border-color: #fff;
                box-shadow: 0 6px 35px rgba(255, 51, 51, 0.7);
            }

            .avatar-selector-panel {
                position: fixed;
                bottom: 305px;
                right: 20px;
                width: 280px;
                background: linear-gradient(145deg, rgba(20, 20, 20, 0.98), rgba(30, 30, 30, 0.98));
                border: 2px solid #ff3333;
                border-radius: 15px;
                padding: 15px;
                z-index: 9999;
                display: none;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 51, 51, 0.2);
                animation: slideIn 0.3s ease;
            }

            .avatar-selector-panel.visible {
                display: block;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .avatar-selector-title {
                color: #ff3333;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 12px;
                text-align: center;
            }

            .avatar-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid transparent;
            }

            .avatar-option:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.1);
            }

            .avatar-option.active {
                background: rgba(255, 51, 51, 0.15);
                border-color: #ff3333;
            }

            .avatar-option-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid currentColor;
            }

            .avatar-option-info {
                flex: 1;
            }

            .avatar-option-name {
                font-weight: 600;
                color: #fff;
                font-size: 14px;
            }

            .avatar-option-title {
                font-size: 11px;
                color: #888;
            }

            .avatar-option-check {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid #444;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: transparent;
            }

            .avatar-option.active .avatar-option-check {
                border-color: #4caf50;
                background: #4caf50;
                color: #fff;
            }

            .avatar-selector-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                color: #666;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .avatar-selector-close:hover {
                color: #ff3333;
            }

            /* Mobile adjustments */
            @media (max-width: 768px) {
                #avatar-selector-container {
                    bottom: 220px !important;
                    right: 10px !important;
                }

                .avatar-selector-btn {
                    width: 48px;
                    height: 48px;
                    font-size: 20px;
                }

                .avatar-selector-panel {
                    bottom: 290px;
                    right: 10px;
                    width: 260px;
                    padding: 12px;
                }

                .avatar-option {
                    padding: 10px 12px;
                }

                .avatar-option-icon {
                    width: 38px;
                    height: 38px;
                    font-size: 18px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createSelectorButton() {
        // Create container for button and label
        const container = document.createElement('div');
        container.id = 'avatar-selector-container';
        container.style.cssText = `
            position: fixed;
            bottom: 240px;
            right: 20px;
            z-index: 9997;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        `;

        const btn = document.createElement('button');
        btn.id = 'avatar-selector-btn';
        btn.className = 'avatar-selector-btn';
        btn.innerHTML = '🔄';
        btn.title = 'Switch Avatar Character';
        btn.style.position = 'static';
        btn.addEventListener('click', () => this.togglePanel());

        // Add label below button
        const label = document.createElement('div');
        label.style.cssText = `
            background: rgba(0,0,0,0.8);
            color: #ffd700;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
        `;
        label.textContent = 'Switch Avatar';

        container.appendChild(btn);
        container.appendChild(label);
        document.body.appendChild(container);
        this.selectorBtn = btn;
        this.selectorContainer = container;
    }

    createSelectorPanel() {
        const panel = document.createElement('div');
        panel.id = 'avatar-selector-panel';
        panel.className = 'avatar-selector-panel';
        panel.innerHTML = `
            <button class="avatar-selector-close" onclick="avatarSelector.togglePanel()">×</button>
            <div class="avatar-selector-title">Choose Your Guide</div>
            ${Object.entries(this.avatars).map(([key, avatar]) => `
                <div class="avatar-option ${key === this.currentAvatar ? 'active' : ''}"
                     data-avatar="${key}"
                     style="--avatar-color: ${avatar.color}"
                     onclick="avatarSelector.selectAvatar('${key}')">
                    <div class="avatar-option-icon" style="color: ${avatar.color}; border-color: ${avatar.color}">
                        ${avatar.icon}
                    </div>
                    <div class="avatar-option-info">
                        <div class="avatar-option-name">${avatar.name}</div>
                        <div class="avatar-option-title">${avatar.title}</div>
                    </div>
                    <div class="avatar-option-check">✓</div>
                </div>
            `).join('')}
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,51,51,0.3);">
                <button onclick="avatarSelector.goToAvatarBuilder()" style="
                    width: 100%;
                    padding: 12px 15px;
                    background: linear-gradient(135deg, #ff3333, #cc0000);
                    border: 2px solid #ffd700;
                    border-radius: 10px;
                    color: #fff;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 20px rgba(255,51,51,0.5)'"
                   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                    <span style="font-size: 18px;">✨</span>
                    Create Your Own Avatar
                </button>
            </div>
        `;
        document.body.appendChild(panel);
        this.panel = panel;
    }

    togglePanel() {
        this.panel.classList.toggle('visible');
    }

    selectAvatar(avatarKey) {
        if (!this.avatars[avatarKey]) return;

        // Hide all avatars
        this.hideAllAvatars();

        // Update current avatar
        this.currentAvatar = avatarKey;
        localStorage.setItem('selected_avatar', avatarKey);

        // Update panel UI
        this.panel.querySelectorAll('.avatar-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.avatar === avatarKey);
        });

        // Update button color to match selected avatar
        this.selectorBtn.style.borderColor = this.avatars[avatarKey].color;

        // Show selected avatar
        this.showCurrentAvatar();

        // Close panel
        this.togglePanel();
    }

    hideAllAvatars() {
        if (window.zacAvatar) window.zacAvatar.hide();
        if (window.boltAvatar) window.boltAvatar.hide();
        if (window.zeusAvatar) window.zeusAvatar.hide();
        if (window.alainaAvatar) window.alainaAvatar.hide();
    }

    showCurrentAvatar() {
        // Hide all avatars first to prevent overlap
        this.hideAllAvatars();

        // Remove any dismissed state
        sessionStorage.removeItem('zac_dismissed');
        const bringBackBtn = document.getElementById('bringBackZacBtn');
        if (bringBackBtn) bringBackBtn.classList.remove('visible');

        switch(this.currentAvatar) {
            case 'zac':
                if (window.zacAvatar) {
                    window.zacAvatar.show();
                    window.zacAvatar.showSpeech("Zac here! What can I help you with?", "Ready to assist");
                }
                break;
            case 'bolt':
                if (window.boltAvatar) {
                    window.boltAvatar.show();
                    window.boltAvatar.showSpeech("Zap! Bolt at your service!", "Lightning Helper");
                }
                break;
            case 'zeus':
                if (window.zeusAvatar) {
                    window.zeusAvatar.show();
                    window.zeusAvatar.showSpeech("The God of Thunder awaits your command.", "Zeus Speaks");
                }
                break;
            case 'alaina':
                if (window.alainaAvatar) {
                    window.alainaAvatar.show();
                    window.alainaAvatar.showSpeech("Hey! Alaina here, ready to spark things up!", "Lady Lightning");
                }
                break;
        }
    }

    loadSavedAvatar() {
        const saved = localStorage.getItem('selected_avatar');
        if (saved && this.avatars[saved]) {
            this.currentAvatar = saved;
            this.selectorBtn.style.borderColor = this.avatars[saved].color;

            // Update panel if it exists
            setTimeout(() => {
                if (this.panel) {
                    this.panel.querySelectorAll('.avatar-option').forEach(opt => {
                        opt.classList.toggle('active', opt.dataset.avatar === saved);
                    });
                }
            }, 100);
        }
    }

    welcomeBack(userName) {
        // Hide all avatars first to prevent overlap
        this.hideAllAvatars();

        switch(this.currentAvatar) {
            case 'zac':
                if (window.zacAvatar) window.zacAvatar.welcomeBack(userName);
                break;
            case 'bolt':
                if (window.boltAvatar) window.boltAvatar.welcomeBack(userName);
                break;
            case 'zeus':
                if (window.zeusAvatar) window.zeusAvatar.welcomeBack(userName);
                break;
            case 'alaina':
                if (window.alainaAvatar) window.alainaAvatar.welcomeBack(userName);
                break;
        }
    }

    getCurrentAvatar() {
        return this.currentAvatar;
    }

    goToAvatarBuilder() {
        // Close the selector panel
        this.togglePanel();

        // Check if user is logged in
        if (!window.currentUser) {
            alert("Please sign in first to create your own avatar.");
            if (window.showSignUp) window.showSignUp();
            return;
        }

        // Navigate to profile page and switch to avatar tab
        document.getElementById("services").style.display = "none";
        document.getElementById("about").style.display = "none";
        document.getElementById("contact").style.display = "none";
        document.getElementById("dashboard").classList.add('hidden');
        document.getElementById("admin").classList.add('hidden');
        document.getElementById("profile").classList.remove('hidden');

        // Switch to avatar tab
        if (window.switchProfileTab) {
            window.switchProfileTab('avatar');
        }

        // Scroll to profile section
        document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
    }
}

// Initialize avatar selector
let avatarSelector = null;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for other avatar scripts to load
    setTimeout(() => {
        avatarSelector = new AvatarSelector();

        // Clear any dismissed state
        sessionStorage.removeItem('zac_dismissed');

        // Show the current avatar after initialization
        setTimeout(() => {
            if (avatarSelector) {
                avatarSelector.showCurrentAvatar();
            }
        }, 1000);
    }, 500);
});

// Global access
window.avatarSelector = {
    selectAvatar: (key) => avatarSelector?.selectAvatar(key),
    togglePanel: () => avatarSelector?.togglePanel(),
    getCurrentAvatar: () => avatarSelector?.getCurrentAvatar(),
    welcomeBack: (name) => avatarSelector?.welcomeBack(name),
    showCurrentAvatar: () => avatarSelector?.showCurrentAvatar(),
    goToAvatarBuilder: () => avatarSelector?.goToAvatarBuilder()
};

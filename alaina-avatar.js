// =====================================================
// LIGHTNING LEDGERZ - ALAINA AVATAR SYSTEM
// Lady Lightning - Blonde girl with lightning bolt hair
// Modern, stylish, professional financial advisor
// =====================================================

class AlainaAvatar {
    constructor() {
        this.container = null;
        this.speechBubble = null;
        this.currentPose = 'standing';
        this.isVisible = false;
        this.personality = {
            name: 'Alaina',
            title: 'Lady Lightning',
            greeting: "Hey there! I'm Alaina, your financial spark. Let's light up those numbers!",
            style: 'friendly'
        };
        this.init();
    }

    init() {
        this.createAvatarContainer();
        this.createSpeechBubble();
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.id = 'alaina-avatar-styles';
        style.textContent = `
            @keyframes alainaIdle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
            @keyframes alainaGlow {
                0%, 100% { filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.3)) drop-shadow(0 0 25px rgba(255, 51, 51, 0.2)); }
                50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 40px rgba(255, 51, 51, 0.3)); }
            }
            @keyframes alainaHairFlow {
                0%, 100% { transform: rotate(0deg) translateX(0); }
                50% { transform: rotate(2deg) translateX(2px); }
            }
            @keyframes alainaBlink {
                0%, 42%, 44%, 100% { transform: scaleY(1); }
                43% { transform: scaleY(0.1); }
            }
            @keyframes alainaSpark {
                0%, 85%, 100% { opacity: 0; }
                88%, 92% { opacity: 1; }
            }
            @keyframes hairGlow {
                0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5)); }
                50% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)); }
            }
            #alaina-avatar-container {
                animation: alainaIdle 3s ease-in-out infinite;
            }
            #alaina-avatar {
                animation: alainaGlow 3s ease-in-out infinite;
            }
            .alaina-eye {
                animation: alainaBlink 4s ease-in-out infinite;
                transform-origin: center;
            }
            .alaina-hair-flow {
                animation: alainaHairFlow 4s ease-in-out infinite;
                transform-origin: top center;
            }
            .alaina-hair-tip {
                animation: hairGlow 2s ease-in-out infinite;
            }
            .alaina-spark {
                animation: alainaSpark 3s ease-in-out infinite;
            }

            /* Mobile responsive Alaina */
            @media (max-width: 768px) {
                #alaina-avatar-container {
                    bottom: 10px !important;
                    right: 10px !important;
                }
                #alaina-avatar {
                    width: 100px !important;
                    height: 200px !important;
                }
                #alaina-speech-bubble {
                    max-width: 230px !important;
                    padding: 12px 15px !important;
                    font-size: 13px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createAvatarContainer() {
        this.container = document.createElement('div');
        this.container.id = 'alaina-avatar-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9998;
            display: none;
            flex-direction: column;
            align-items: flex-end;
            gap: 15px;
        `;

        const avatar = document.createElement('div');
        avatar.id = 'alaina-avatar';
        avatar.innerHTML = this.getAvatarSVG('standing');
        avatar.style.cssText = `
            width: 140px;
            height: 280px;
            cursor: pointer;
            transition: transform 0.3s ease;
        `;

        // Change Avatar label on hover
        const changeAvatarLabel = document.createElement('div');
        changeAvatarLabel.className = 'change-avatar-label';
        changeAvatarLabel.textContent = 'Change Avatar';
        changeAvatarLabel.style.cssText = `
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffd700;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 10001;
            border: 1px solid #ff6699;
        `;
        this.container.appendChild(changeAvatarLabel);

        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.03)';
            changeAvatarLabel.style.opacity = '1';
        });
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
            changeAvatarLabel.style.opacity = '0';
        });
        avatar.addEventListener('click', () => {
            // Toggle speech/chat - no login required for preset avatars
            this.toggleSpeech();
        });

        // Create dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'alaina-dismiss-btn';
        dismissBtn.innerHTML = '×';
        dismissBtn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ff6699;
            color: #ff6699;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: all 0.3s ease;
            line-height: 1;
        `;
        dismissBtn.addEventListener('mouseenter', () => {
            dismissBtn.style.background = '#ff6699';
            dismissBtn.style.color = '#fff';
        });
        dismissBtn.addEventListener('mouseleave', () => {
            dismissBtn.style.background = 'rgba(0, 0, 0, 0.8)';
            dismissBtn.style.color = '#ff6699';
        });
        dismissBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide();
        });

        this.container.appendChild(dismissBtn);
        this.container.appendChild(avatar);
        document.body.appendChild(this.container);
    }

    createSpeechBubble() {
        this.speechBubble = document.createElement('div');
        this.speechBubble.id = 'alaina-speech-bubble';
        this.speechBubble.style.cssText = `
            background: linear-gradient(145deg, rgba(25, 15, 25, 0.98), rgba(40, 20, 40, 0.98));
            border: 2px solid #ff6699;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 360px;
            color: #fff;
            font-size: 15px;
            line-height: 1.6;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 102, 153, 0.2), 0 0 60px rgba(255, 215, 0, 0.1);
            position: relative;
            display: none;
            animation: speechFadeIn 0.4s ease;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -12px;
            right: 45px;
            width: 0;
            height: 0;
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 14px solid #ff6699;
        `;
        this.speechBubble.appendChild(arrow);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: #ff6699;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideSpeech();
        });
        this.speechBubble.appendChild(closeBtn);

        const titleEl = document.createElement('div');
        titleEl.id = 'alaina-speech-title';
        titleEl.style.cssText = `
            color: #ff6699;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
        `;
        this.speechBubble.appendChild(titleEl);

        const textContainer = document.createElement('div');
        textContainer.id = 'alaina-speech-text';
        textContainer.style.cssText = `padding-right: 20px; font-size: 15px;`;
        this.speechBubble.appendChild(textContainer);

        // Chat input
        const chatContainer = document.createElement('div');
        chatContainer.id = 'alaina-chat-container';
        chatContainer.style.cssText = `
            display: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 102, 153, 0.3);
        `;

        const chatInputWrapper = document.createElement('div');
        chatInputWrapper.style.cssText = `display: flex; gap: 8px; align-items: center;`;

        const chatInput = document.createElement('input');
        chatInput.id = 'alaina-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Ask Alaina...';
        chatInput.style.cssText = `
            flex: 1;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 102, 153, 0.4);
            border-radius: 10px;
            padding: 10px 15px;
            color: #fff;
            font-size: 14px;
            outline: none;
        `;
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleChatInput(chatInput.value);
                chatInput.value = '';
            }
        });

        const sendBtn = document.createElement('button');
        sendBtn.innerHTML = '⚡';
        sendBtn.style.cssText = `
            background: linear-gradient(135deg, #ff6699, #ff3366);
            border: none;
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s;
        `;
        sendBtn.addEventListener('click', () => {
            this.handleChatInput(chatInput.value);
            chatInput.value = '';
        });

        chatInputWrapper.appendChild(chatInput);
        chatInputWrapper.appendChild(sendBtn);
        chatContainer.appendChild(chatInputWrapper);
        this.speechBubble.appendChild(chatContainer);

        // Quick Actions section (same as Zac)
        const quickActions = document.createElement('div');
        quickActions.id = 'alaina-quick-actions';
        quickActions.style.cssText = `
            display: none;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 102, 153, 0.3);
        `;

        const actions = [
            { icon: '📤', label: 'Upload Financials', action: 'upload' },
            { icon: '📊', label: 'Build Model', action: 'model' },
            { icon: '📈', label: 'View Reports', action: 'reports' },
            { icon: '💳', label: 'Upgrade Plan', action: 'upgrade' }
        ];

        actions.forEach(act => {
            const btn = document.createElement('button');
            btn.innerHTML = `${act.icon} ${act.label}`;
            btn.dataset.action = act.action;
            btn.style.cssText = `
                background: rgba(255, 102, 153, 0.15);
                border: 1px solid rgba(255, 102, 153, 0.4);
                color: #fff;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 102, 153, 0.3)';
                btn.style.borderColor = '#ff6699';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255, 102, 153, 0.15)';
                btn.style.borderColor = 'rgba(255, 102, 153, 0.4)';
            });
            btn.addEventListener('click', () => this.handleQuickAction(act.action));
            quickActions.appendChild(btn);
        });

        this.speechBubble.appendChild(quickActions);

        this.container.insertBefore(this.speechBubble, this.container.firstChild);
    }

    handleQuickAction(action) {
        switch(action) {
            case 'upload':
                this.showSpeech("Let me zap open the upload panel for you!", "Upload Financials");
                this.setPose('pointing');
                setTimeout(() => {
                    if (typeof showUploadModal === 'function') showUploadModal();
                }, 500);
                break;
            case 'model':
                this.showSpeech("Let's build a financial model! What type? Three-Statement, DCF, or LBO?", "Model Builder");
                this.setPose('happy');
                break;
            case 'reports':
                this.showSpeech("Sparking up your reports dashboard!", "View Reports");
                this.setPose('pointing');
                // Navigate to reports
                const dashboard = document.getElementById('dashboard');
                if (dashboard) {
                    dashboard.classList.remove('hidden');
                    document.getElementById('services').style.display = 'none';
                    dashboard.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            case 'upgrade':
                this.showSpeech("Let's power up your account!", "Upgrade Plan");
                this.setPose('waving');
                // Scroll to packages
                const packages = document.getElementById('services');
                if (packages) {
                    packages.style.display = 'block';
                    packages.scrollIntoView({ behavior: 'smooth' });
                }
                break;
        }
    }

    getAvatarSVG(pose) {
        const isWaving = pose === 'waving';
        const isPointing = pose === 'pointing';
        const isThumbsUp = pose === 'thumbsup';
        const isHappy = pose === 'happy';

        return `
        <svg viewBox="0 0 140 280" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Disney Princess Skin tones - softer, peachy -->
                <linearGradient id="alainaSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffe8dc"/>
                    <stop offset="30%" style="stop-color:#ffdcc8"/>
                    <stop offset="70%" style="stop-color:#fad0bc"/>
                    <stop offset="100%" style="stop-color:#f0c4b0"/>
                </linearGradient>
                <linearGradient id="alainaSkinShadow" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#fad0bc"/>
                    <stop offset="100%" style="stop-color:#e0b8a0"/>
                </linearGradient>

                <!-- Gorgeous Golden Blonde Hair -->
                <linearGradient id="alainaHairMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fff9e6"/>
                    <stop offset="15%" style="stop-color:#ffe066"/>
                    <stop offset="40%" style="stop-color:#ffd633"/>
                    <stop offset="70%" style="stop-color:#e6b800"/>
                    <stop offset="100%" style="stop-color:#cc9900"/>
                </linearGradient>
                <linearGradient id="alainaHairHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffffee"/>
                    <stop offset="50%" style="stop-color:#fff9cc"/>
                    <stop offset="100%" style="stop-color:#ffe066"/>
                </linearGradient>
                <linearGradient id="hairTip" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffd700"/>
                    <stop offset="50%" style="stop-color:#ffaa00"/>
                    <stop offset="100%" style="stop-color:#ff6699"/>
                </linearGradient>

                <!-- Beautiful Pink Princess Dress -->
                <linearGradient id="alainaOutfit" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffb3d9"/>
                    <stop offset="30%" style="stop-color:#ff99cc"/>
                    <stop offset="70%" style="stop-color:#ff66b2"/>
                    <stop offset="100%" style="stop-color:#ff4da6"/>
                </linearGradient>
                <linearGradient id="alainaOutfitDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4da6"/>
                    <stop offset="100%" style="stop-color:#cc3385"/>
                </linearGradient>
                <linearGradient id="alainaOutfitLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffcce6"/>
                    <stop offset="100%" style="stop-color:#ffb3d9"/>
                </linearGradient>

                <!-- Sparkly Gold accents -->
                <linearGradient id="alainaGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fffacd"/>
                    <stop offset="25%" style="stop-color:#ffd700"/>
                    <stop offset="50%" style="stop-color:#ffcc00"/>
                    <stop offset="75%" style="stop-color:#ffc200"/>
                    <stop offset="100%" style="stop-color:#daa520"/>
                </linearGradient>

                <!-- Big Disney Eyes - Bright Blue -->
                <radialGradient id="alainaEyeWhite" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="80%" style="stop-color:#f0f8ff"/>
                    <stop offset="100%" style="stop-color:#e8f4ff"/>
                </radialGradient>
                <radialGradient id="alainaIris" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" style="stop-color:#87ceeb"/>
                    <stop offset="30%" style="stop-color:#4db8ff"/>
                    <stop offset="60%" style="stop-color:#1e90ff"/>
                    <stop offset="100%" style="stop-color:#0066cc"/>
                </radialGradient>
                <radialGradient id="alainaIrisInner" cx="40%" cy="40%" r="50%">
                    <stop offset="0%" style="stop-color:#00bfff"/>
                    <stop offset="100%" style="stop-color:#0077cc"/>
                </radialGradient>

                <!-- Pretty Pink Lips -->
                <linearGradient id="alainaLips" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff9eb8"/>
                    <stop offset="40%" style="stop-color:#ff7aa0"/>
                    <stop offset="100%" style="stop-color:#ff5588"/>
                </linearGradient>

                <!-- Tiara/Crown gradient -->
                <linearGradient id="tiaraGold" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style="stop-color:#daa520"/>
                    <stop offset="30%" style="stop-color:#ffd700"/>
                    <stop offset="50%" style="stop-color:#ffec8b"/>
                    <stop offset="70%" style="stop-color:#ffd700"/>
                    <stop offset="100%" style="stop-color:#b8860b"/>
                </linearGradient>
                <radialGradient id="gemPink" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" style="stop-color:#ffccdd"/>
                    <stop offset="50%" style="stop-color:#ff66aa"/>
                    <stop offset="100%" style="stop-color:#cc3377"/>
                </radialGradient>
                <radialGradient id="gemBlue" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" style="stop-color:#ccefff"/>
                    <stop offset="50%" style="stop-color:#66ccff"/>
                    <stop offset="100%" style="stop-color:#0088cc"/>
                </radialGradient>

                <!-- Filters -->
                <filter id="alainaShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.25"/>
                </filter>
                <filter id="alainaGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feFlood flood-color="#ffd700" flood-opacity="0.6"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="pinkGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feFlood flood-color="#ff66b2" flood-opacity="0.4"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="sparkleFilter" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="1.5" result="blur"/>
                    <feFlood flood-color="#ffffff" flood-opacity="0.9"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="eyeSparkle" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="0.8" result="blur"/>
                    <feFlood flood-color="#ffffff" flood-opacity="1"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- AMBIENT PRINCESS GLOW -->
            <ellipse cx="70" cy="140" rx="55" ry="100" fill="#ff99cc" opacity="0.06"/>
            <ellipse cx="70" cy="140" rx="45" ry="85" fill="#ffd700" opacity="0.04"/>

            <!-- BEAUTIFUL FLOWING PRINCESS DRESS -->
            <g class="alaina-outfit" filter="url(#pinkGlow)">
                <!-- Dress skirt - flowing and puffy -->
                <path d="M 25 140
                         Q 15 170 20 210
                         Q 25 245 45 265
                         Q 70 275 95 265
                         Q 115 245 120 210
                         Q 125 170 115 140
                         Z"
                    fill="url(#alainaOutfit)"/>

                <!-- Skirt layers/ruffles -->
                <path d="M 25 180 Q 45 195 70 190 Q 95 195 115 180"
                    stroke="url(#alainaOutfitLight)" stroke-width="8" fill="none" opacity="0.5"/>
                <path d="M 22 210 Q 50 230 70 225 Q 90 230 118 210"
                    stroke="url(#alainaOutfitLight)" stroke-width="8" fill="none" opacity="0.4"/>
                <path d="M 28 240 Q 55 260 70 255 Q 85 260 112 240"
                    stroke="url(#alainaOutfitLight)" stroke-width="6" fill="none" opacity="0.35"/>

                <!-- Dress fold shadows -->
                <path d="M 45 145 Q 40 180 42 220 Q 45 250 50 265" stroke="url(#alainaOutfitDark)" stroke-width="3" fill="none" opacity="0.25"/>
                <path d="M 65 140 Q 60 180 62 230 Q 65 255 68 270" stroke="url(#alainaOutfitDark)" stroke-width="2" fill="none" opacity="0.2"/>
                <path d="M 75 140 Q 80 180 78 230 Q 75 255 72 270" stroke="url(#alainaOutfitDark)" stroke-width="2" fill="none" opacity="0.2"/>
                <path d="M 95 145 Q 100 180 98 220 Q 95 250 90 265" stroke="url(#alainaOutfitDark)" stroke-width="3" fill="none" opacity="0.25"/>

                <!-- Bodice -->
                <path d="M 42 95
                         Q 35 105 35 120
                         Q 35 135 42 145
                         Q 70 155 98 145
                         Q 105 135 105 120
                         Q 105 105 98 95
                         Z"
                    fill="url(#alainaOutfit)" filter="url(#alainaShadow)"/>

                <!-- Bodice highlight -->
                <path d="M 50 100 Q 70 95 90 100" stroke="url(#alainaOutfitLight)" stroke-width="4" fill="none" opacity="0.4"/>

                <!-- Pretty sweetheart neckline detail -->
                <path d="M 45 95 Q 55 102 70 105 Q 85 102 95 95" stroke="url(#alainaOutfitLight)" stroke-width="3" fill="none"/>

                <!-- Sparkly Gold belt with bow -->
                <path d="M 38 142 Q 70 138 102 142" stroke="url(#alainaGold)" stroke-width="7" fill="none"/>
                <ellipse cx="70" cy="140" rx="10" ry="7" fill="url(#alainaGold)"/>
                <!-- Bow ribbons -->
                <path d="M 60 140 Q 50 145 45 155 Q 48 148 60 143" fill="url(#alainaGold)" opacity="0.8"/>
                <path d="M 80 140 Q 90 145 95 155 Q 92 148 80 143" fill="url(#alainaGold)" opacity="0.8"/>

                <!-- Tiny sparkles on dress -->
                <g class="alaina-spark" filter="url(#sparkleFilter)">
                    <circle cx="45" cy="180" r="1.5" fill="#fff"/>
                    <circle cx="85" cy="200" r="1.2" fill="#fff"/>
                    <circle cx="55" cy="230" r="1" fill="#fff"/>
                    <circle cx="90" cy="245" r="1.3" fill="#fff"/>
                    <circle cx="70" cy="210" r="1.5" fill="#fff"/>
                </g>
            </g>

            <!-- CUTE SHOES peeking under dress -->
            <g>
                <ellipse cx="55" cy="268" rx="10" ry="5" fill="url(#alainaGold)"/>
                <ellipse cx="85" cy="268" rx="10" ry="5" fill="url(#alainaGold)"/>
            </g>

            <!-- ARMS -->
            ${isWaving ? `
            <!-- Left arm gracefully at side -->
            <g>
                <path d="M 42 98 Q 28 112 24 140 L 30 143 Q 33 115 44 102"
                    fill="url(#alainaSkin)" filter="url(#alainaShadow)"/>
                <path d="M 24 140 Q 20 160 22 175 L 30 177 Q 28 162 30 143"
                    fill="url(#alainaSkin)"/>
                <!-- Delicate hand -->
                <ellipse cx="26" cy="180" rx="8" ry="9" fill="url(#alainaSkin)"/>
            </g>
            <!-- Right arm waving adorably -->
            <g>
                <path d="M 98 98 Q 115 85 125 55 L 118 52 Q 112 80 96 92"
                    fill="url(#alainaSkin)" filter="url(#alainaShadow)"/>
                <path d="M 125 55 Q 130 35 128 15 L 120 13 Q 124 35 118 52"
                    fill="url(#alainaSkin)"/>
                <!-- Cute waving hand -->
                <g transform="translate(118, 5)">
                    <ellipse cx="6" cy="10" rx="8" ry="9" fill="url(#alainaSkin)"/>
                    <rect x="1" y="-4" width="3.5" height="11" rx="1.75" fill="url(#alainaSkin)" transform="rotate(-15, 2.75, 0)"/>
                    <rect x="6" y="-6" width="3.5" height="13" rx="1.75" fill="url(#alainaSkin)"/>
                    <rect x="11" y="-4" width="3.5" height="11" rx="1.75" fill="url(#alainaSkin)" transform="rotate(10, 12.75, 0)"/>
                    <rect x="15" y="-1" width="3" height="9" rx="1.5" fill="url(#alainaSkin)" transform="rotate(20, 16.5, 0)"/>
                </g>
            </g>
            ` : `
            <!-- Arms gracefully at sides -->
            <g>
                <path d="M 42 98 Q 28 112 24 140 L 30 143 Q 33 115 44 102"
                    fill="url(#alainaSkin)" filter="url(#alainaShadow)"/>
                <path d="M 24 140 Q 20 160 22 175 L 30 177 Q 28 162 30 143"
                    fill="url(#alainaSkin)"/>
                <ellipse cx="26" cy="180" rx="8" ry="9" fill="url(#alainaSkin)"/>
            </g>
            <g>
                <path d="M 98 98 Q 112 112 116 140 L 110 143 Q 107 115 96 102"
                    fill="url(#alainaSkin)" filter="url(#alainaShadow)"/>
                <path d="M 116 140 Q 120 160 118 175 L 110 177 Q 112 162 110 143"
                    fill="url(#alainaSkin)"/>
                <ellipse cx="114" cy="180" rx="8" ry="9" fill="url(#alainaSkin)"/>
            </g>
            `}

            <!-- NECK - elegant and slender -->
            <path d="M 62 88 Q 62 78 64 70 L 76 70 Q 78 78 78 88" fill="url(#alainaSkin)"/>

            <!-- Beautiful Necklace with heart pendant -->
            <path d="M 55 85 Q 70 92 85 85" stroke="url(#alainaGold)" stroke-width="2" fill="none"/>
            <g filter="url(#alainaGlow)">
                <!-- Heart pendant -->
                <path d="M 70 95 Q 65 92 65 96 Q 65 100 70 104 Q 75 100 75 96 Q 75 92 70 95" fill="#ff66aa"/>
                <circle cx="67" cy="96" r="1" fill="#ffccdd" opacity="0.6"/>
            </g>

            <!-- HEAD - Cute Disney proportions (slightly larger, rounder) -->
            <ellipse cx="70" cy="45" rx="30" ry="34" fill="url(#alainaSkin)" filter="url(#alainaShadow)"/>

            <!-- EARS - small and cute -->
            <ellipse cx="40" cy="48" rx="3.5" ry="6" fill="url(#alainaSkinShadow)"/>
            <ellipse cx="100" cy="48" rx="3.5" ry="6" fill="url(#alainaSkinShadow)"/>

            <!-- Pretty Earrings -->
            <g filter="url(#alainaGlow)">
                <circle cx="40" cy="54" r="3" fill="url(#gemPink)"/>
                <circle cx="100" cy="54" r="3" fill="url(#gemPink)"/>
                <circle cx="40" cy="54" r="1" fill="#ffccdd" opacity="0.7"/>
                <circle cx="100" cy="54" r="1" fill="#ffccdd" opacity="0.7"/>
            </g>

            <!-- GORGEOUS RAPUNZEL-STYLE FLOWING BLONDE HAIR -->
            <g class="alaina-hair-flow">
                <!-- LONG flowing hair behind - Rapunzel style -->
                <path d="M 35 55 Q 20 85 15 130 Q 10 180 20 220 Q 25 250 35 260"
                    stroke="url(#alainaHairMain)" stroke-width="22" fill="none" stroke-linecap="round"/>
                <path d="M 105 55 Q 120 85 125 130 Q 130 180 120 220 Q 115 250 105 260"
                    stroke="url(#alainaHairMain)" stroke-width="20" fill="none" stroke-linecap="round"/>

                <!-- Main hair crown -->
                <path d="M 40 48
                         Q 30 25 45 5
                         Q 55 -8 70 -10
                         Q 85 -8 95 5
                         Q 110 25 100 48
                         Q 95 30 70 22
                         Q 45 30 40 48"
                    fill="url(#alainaHairMain)"/>

                <!-- Side swept bangs - elegant -->
                <path d="M 42 35 Q 35 25 45 18 Q 55 20 58 32" fill="url(#alainaHairMain)"/>
                <path d="M 98 35 Q 105 28 100 18 Q 88 16 85 28" fill="url(#alainaHairMain)"/>

                <!-- Soft bangs across forehead -->
                <path d="M 48 25 Q 55 22 62 26 Q 65 30 62 35" fill="url(#alainaHairMain)" opacity="0.9"/>
                <path d="M 78 26 Q 85 22 92 25 Q 95 28 90 33" fill="url(#alainaHairMain)" opacity="0.9"/>

                <!-- Flowing side piece - LONG flowing down -->
                <path d="M 100 48 Q 115 60 120 90 Q 128 140 125 190 Q 120 230 112 250"
                    stroke="url(#alainaHairMain)" stroke-width="16" fill="none" stroke-linecap="round"/>

                <!-- Hair flowing down left side - EXTRA LONG -->
                <path d="M 40 48 Q 25 70 18 110 Q 12 160 15 210 Q 20 245 30 260"
                    stroke="url(#alainaHairMain)" stroke-width="16" fill="none" stroke-linecap="round"/>

                <!-- Beautiful hair wave sections -->
                <path d="M 22 180 Q 15 200 20 220" stroke="url(#alainaHairMain)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M 118 180 Q 125 200 120 220" stroke="url(#alainaHairMain)" stroke-width="11" fill="none" stroke-linecap="round"/>

                <!-- Lightning bolt hair tips - LEFT SIDE - magical! -->
                <g class="alaina-hair-tip" filter="url(#alainaGlow)">
                    <path d="M 30 260
                             L 20 268
                             L 28 265
                             L 18 278
                             L 32 268
                             L 26 270
                             L 35 262
                             Z"
                        fill="url(#hairTip)"/>
                </g>

                <!-- Lightning bolt hair tips - RIGHT SIDE - magical! -->
                <g class="alaina-hair-tip" filter="url(#alainaGlow)">
                    <path d="M 105 260
                             L 118 268
                             L 108 265
                             L 122 278
                             L 105 268
                             L 112 270
                             L 102 262
                             Z"
                        fill="url(#hairTip)"/>
                </g>

                <!-- Lightning bolt hair tip - TOP RIGHT flowing piece -->
                <g class="alaina-hair-tip" filter="url(#alainaGlow)">
                    <path d="M 112 250
                             L 125 252
                             L 115 255
                             L 130 260
                             L 112 258
                             L 120 256
                             Z"
                        fill="url(#hairTip)"/>
                </g>

                <!-- Hair highlights -->
                <path d="M 50 5 Q 70 -5 90 5" stroke="url(#alainaHairHighlight)" stroke-width="5" fill="none" opacity="0.7"/>
                <path d="M 55 18 Q 70 12 85 18" stroke="#ffffee" stroke-width="2.5" fill="none" opacity="0.5"/>
                <path d="M 22 100 Q 18 130 22 160" stroke="#ffffcc" stroke-width="4" fill="none" opacity="0.4"/>
                <path d="M 118 100 Q 122 130 118 160" stroke="#ffffcc" stroke-width="4" fill="none" opacity="0.4"/>
                <path d="M 20 200 Q 18 220 25 240" stroke="#fffacd" stroke-width="3" fill="none" opacity="0.5"/>
                <path d="M 120 200 Q 122 220 115 240" stroke="#fffacd" stroke-width="3" fill="none" opacity="0.5"/>
            </g>

            <!-- BEAUTIFUL TIARA/CROWN -->
            <g filter="url(#alainaGlow)">
                <!-- Tiara base -->
                <path d="M 45 15 Q 50 18 55 15 Q 60 12 65 15 Q 70 8 75 15 Q 80 12 85 15 Q 90 18 95 15"
                    stroke="url(#tiaraGold)" stroke-width="4" fill="none"/>

                <!-- Center peak with gem -->
                <path d="M 65 15 L 70 2 L 75 15" fill="url(#tiaraGold)"/>
                <ellipse cx="70" cy="6" rx="4" ry="5" fill="url(#gemPink)"/>
                <circle cx="69" cy="5" r="1.5" fill="#ffddee" opacity="0.8"/>

                <!-- Side peaks with gems -->
                <path d="M 52 16 L 55 8 L 58 16" fill="url(#tiaraGold)"/>
                <circle cx="55" cy="11" r="2.5" fill="url(#gemBlue)"/>
                <circle cx="54.5" cy="10.5" r="1" fill="#ccefff" opacity="0.8"/>

                <path d="M 82 16 L 85 8 L 88 16" fill="url(#tiaraGold)"/>
                <circle cx="85" cy="11" r="2.5" fill="url(#gemBlue)"/>
                <circle cx="84.5" cy="10.5" r="1" fill="#ccefff" opacity="0.8"/>

                <!-- Tiny diamonds -->
                <circle cx="60" cy="14" r="1.5" fill="#fff" filter="url(#eyeSparkle)"/>
                <circle cx="80" cy="14" r="1.5" fill="#fff" filter="url(#eyeSparkle)"/>
            </g>

            <!-- CUTE DISNEY-STYLE FACE -->

            <!-- BIG SPARKLY EYES -->
            <g class="alaina-eye">
                <!-- Left eye - big and expressive -->
                <ellipse cx="56" cy="44" rx="12" ry="11" fill="url(#alainaEyeWhite)"/>
                <!-- Iris - large and bright -->
                <ellipse cx="57" cy="45" rx="8" ry="8" fill="url(#alainaIris)"/>
                <ellipse cx="56" cy="46" rx="5" ry="5" fill="url(#alainaIrisInner)"/>
                <!-- Pupil -->
                <circle cx="56" cy="46" r="3" fill="#003355"/>
                <!-- Eye sparkles - Disney magic! -->
                <circle cx="60" cy="42" r="3" fill="#fff" filter="url(#eyeSparkle)"/>
                <circle cx="53" cy="48" r="1.5" fill="#fff" opacity="0.7"/>
                <circle cx="58" cy="49" r="0.8" fill="#fff" opacity="0.5"/>
                <!-- Beautiful long lashes -->
                <path d="M 46 37 Q 52 33 60 35 Q 65 34 68 37" stroke="#4a3a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M 44 40 L 41 36" stroke="#4a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M 47 37 L 45 33" stroke="#4a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M 51 35 L 50 31" stroke="#4a3a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                <path d="M 55 34 L 55 30" stroke="#4a3a2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </g>
            <g class="alaina-eye">
                <!-- Right eye -->
                <ellipse cx="84" cy="44" rx="12" ry="11" fill="url(#alainaEyeWhite)"/>
                <ellipse cx="83" cy="45" rx="8" ry="8" fill="url(#alainaIris)"/>
                <ellipse cx="84" cy="46" rx="5" ry="5" fill="url(#alainaIrisInner)"/>
                <circle cx="84" cy="46" r="3" fill="#003355"/>
                <!-- Eye sparkles -->
                <circle cx="88" cy="42" r="3" fill="#fff" filter="url(#eyeSparkle)"/>
                <circle cx="81" cy="48" r="1.5" fill="#fff" opacity="0.7"/>
                <circle cx="86" cy="49" r="0.8" fill="#fff" opacity="0.5"/>
                <!-- Long lashes -->
                <path d="M 72 37 Q 80 33 88 35 Q 93 34 96 37" stroke="#4a3a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M 96 40 L 99 36" stroke="#4a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M 93 37 L 95 33" stroke="#4a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M 89 35 L 90 31" stroke="#4a3a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                <path d="M 85 34 L 85 30" stroke="#4a3a2a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            </g>

            <!-- Elegant eyebrows -->
            <path d="M 47 30 Q 55 26 65 30" stroke="#c9a860" stroke-width="2" fill="none"/>
            <path d="M 75 30 Q 85 26 93 30" stroke="#c9a860" stroke-width="2" fill="none"/>

            <!-- Cute button nose -->
            <ellipse cx="70" cy="55" rx="3" ry="2" fill="url(#alainaSkinShadow)" opacity="0.4"/>
            <path d="M 70 48 Q 71 52 70 55" stroke="url(#alainaSkinShadow)" stroke-width="1.5" fill="none" opacity="0.3"/>

            <!-- CUTE FRECKLES -->
            <g opacity="0.35">
                <circle cx="52" cy="52" r="1" fill="#d4a890"/>
                <circle cx="48" cy="54" r="0.8" fill="#d4a890"/>
                <circle cx="55" cy="55" r="0.9" fill="#d4a890"/>
                <circle cx="50" cy="57" r="0.7" fill="#d4a890"/>
                <circle cx="88" cy="52" r="1" fill="#d4a890"/>
                <circle cx="92" cy="54" r="0.8" fill="#d4a890"/>
                <circle cx="85" cy="55" r="0.9" fill="#d4a890"/>
                <circle cx="90" cy="57" r="0.7" fill="#d4a890"/>
            </g>

            <!-- Pretty Pink Lips -->
            ${isHappy ? `
                <!-- Big smile -->
                <path d="M 58 66 Q 70 78 82 66" stroke="url(#alainaLips)" stroke-width="3" fill="none"/>
                <path d="M 60 66 Q 70 74 80 66" fill="url(#alainaLips)"/>
                <ellipse cx="70" cy="69" rx="6" ry="3" fill="#fff" opacity="0.25"/>
            ` : `
                <!-- Sweet smile -->
                <path d="M 62 65 Q 70 70 78 65" stroke="url(#alainaLips)" stroke-width="2.5" fill="none"/>
                <ellipse cx="70" cy="64" rx="7" ry="3.5" fill="url(#alainaLips)"/>
                <path d="M 64 63 Q 70 61 76 63" fill="#ffb8c8" opacity="0.5"/>
                <ellipse cx="70" cy="62" rx="3" ry="1.2" fill="#ffccdd" opacity="0.6"/>
            `}

            <!-- Rosy blush cheeks -->
            <ellipse cx="48" cy="55" rx="8" ry="5" fill="#ffaaaa" opacity="0.3"/>
            <ellipse cx="92" cy="55" rx="8" ry="5" fill="#ffaaaa" opacity="0.3"/>

            <!-- MAGICAL SPARKLES all around -->
            <g class="alaina-spark" filter="url(#sparkleFilter)">
                <circle cx="132" cy="5" r="2.5" fill="#ffd700"/>
                <circle cx="140" cy="-5" r="1.8" fill="#fff"/>
                <circle cx="125" cy="-2" r="1.2" fill="#ff99cc"/>
            </g>
            <g class="alaina-spark" filter="url(#sparkleFilter)" style="animation-delay: 0.5s;">
                <circle cx="15" cy="90" r="2" fill="#ffd700"/>
                <circle cx="10" cy="100" r="1.3" fill="#fff"/>
                <circle cx="20" cy="105" r="1" fill="#ff99cc"/>
            </g>
            <g class="alaina-spark" filter="url(#sparkleFilter)" style="animation-delay: 1s;">
                <circle cx="8" cy="60" r="1.5" fill="#fff"/>
                <circle cx="130" cy="50" r="1.2" fill="#ffd700"/>
            </g>
            <g class="alaina-spark" filter="url(#sparkleFilter)" style="animation-delay: 1.5s;">
                <circle cx="35" cy="160" r="1.5" fill="#ff99cc"/>
                <circle cx="105" cy="165" r="1.2" fill="#fff"/>
            </g>
        </svg>
        `;
    }

    show() {
        this.container.style.display = 'flex';
        this.isVisible = true;
    }

    hide() {
        this.container.style.display = 'none';
        this.isVisible = false;
    }

    showSpeech(text, title = '') {
        const textEl = document.getElementById('alaina-speech-text');
        const titleEl = document.getElementById('alaina-speech-title');
        if (textEl) textEl.textContent = text;
        if (titleEl) titleEl.textContent = title;
        this.speechBubble.style.display = 'block';
    }

    hideSpeech() {
        this.speechBubble.style.display = 'none';
    }

    toggleSpeech() {
        if (this.speechBubble.style.display === 'none') {
            this.showSpeech("Hey! What can I spark up for you today?", "Lady Lightning");
            this.enableChatMode();
        } else {
            this.hideSpeech();
        }
    }

    setPose(pose) {
        this.currentPose = pose;
        const avatar = document.getElementById('alaina-avatar');
        if (avatar) {
            avatar.innerHTML = this.getAvatarSVG(pose);
        }
    }

    enableChatMode() {
        const chatContainer = document.getElementById('alaina-chat-container');
        const quickActions = document.getElementById('alaina-quick-actions');
        if (chatContainer) chatContainer.style.display = 'block';
        if (quickActions) quickActions.style.display = 'flex';
    }

    handleChatInput(message) {
        if (!message.trim()) return;

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('upload') || lowerMsg.includes('financial')) {
            this.showSpeech("On it! Let me zap open the upload panel for you!", "Upload Time");
            this.setPose('pointing');
            setTimeout(() => {
                if (typeof showUploadModal === 'function') showUploadModal();
            }, 500);
        } else if (lowerMsg.includes('package') || lowerMsg.includes('upgrade')) {
            this.showSpeech("Ooh, great choice! Let me show you our lightning-fast packages!", "Packages");
            this.setPose('happy');
        } else if (lowerMsg.includes('help')) {
            this.showSpeech("I'm here to help! I can help you upload financials, build reports, navigate around - just ask!", "Here to Help");
            this.setPose('waving');
        } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            this.showSpeech("Hey there! I'm Alaina, Lady Lightning! Ready to electrify your finances?", "Hello!");
            this.setPose('waving');
        } else {
            this.showSpeech(`Got it! "${message}" - let's make it happen!`, "On It!");
            this.setPose('thumbsup');
        }
        this.enableChatMode();
    }

    welcomeBack(userName) {
        this.show();
        this.setPose('waving');
        this.showSpeech(`${userName}! So good to see you! Ready to light up those numbers?`, "Welcome Back");
        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 5000);
    }

    celebrate() {
        this.show();
        this.setPose('happy');
        this.showSpeech("Amazing work! Your financial data is looking absolutely electric!", "Fantastic!");
    }
}

// Initialize Alaina
let alainaAvatar = null;

// Make Alaina globally available
window.initAlainaAvatar = function() {
    if (!alainaAvatar) {
        alainaAvatar = new AlainaAvatar();
    }
    return alainaAvatar;
};

window.alainaAvatar = {
    show: () => { if (!alainaAvatar) alainaAvatar = new AlainaAvatar(); alainaAvatar.show(); },
    hide: () => alainaAvatar?.hide(),
    welcomeBack: (name) => { if (!alainaAvatar) alainaAvatar = new AlainaAvatar(); alainaAvatar.welcomeBack(name); },
    celebrate: () => { if (!alainaAvatar) alainaAvatar = new AlainaAvatar(); alainaAvatar.celebrate(); },
    showSpeech: (text, title) => { if (!alainaAvatar) alainaAvatar = new AlainaAvatar(); alainaAvatar.showSpeech(text, title); },
    setPose: (pose) => alainaAvatar?.setPose(pose)
};

// =====================================================
// LIGHTNING LEDGERZ - BOLT AVATAR SYSTEM
// Cute lightning bolt mascot with arms and legs
// Friendly helper character
// =====================================================

class BoltAvatar {
    constructor() {
        this.container = null;
        this.speechBubble = null;
        this.currentPose = 'standing';
        this.isVisible = false;
        this.personality = {
            name: 'Bolt',
            title: 'Lightning Helper',
            greeting: "Zap! I'm Bolt, your speedy financial assistant!",
            style: 'energetic'
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
        style.id = 'bolt-avatar-styles';
        style.textContent = `
            @keyframes boltBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes boltGlow {
                0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)); }
                50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1)); }
            }
            @keyframes boltSpark {
                0%, 90%, 100% { opacity: 0; }
                92%, 95% { opacity: 1; }
            }
            @keyframes boltWave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(20deg); }
                75% { transform: rotate(-15deg); }
            }
            @keyframes boltBlink {
                0%, 40%, 44%, 100% { transform: scaleY(1); }
                42% { transform: scaleY(0.1); }
            }
            @keyframes electricArc {
                0%, 100% { opacity: 0.3; stroke-dashoffset: 0; }
                50% { opacity: 1; stroke-dashoffset: 10; }
            }
            #bolt-avatar-container {
                animation: boltBounce 2s ease-in-out infinite;
            }
            #bolt-avatar {
                animation: boltGlow 2s ease-in-out infinite;
            }
            .bolt-spark {
                animation: boltSpark 3s ease-in-out infinite;
            }
            .bolt-eye {
                animation: boltBlink 4s ease-in-out infinite;
                transform-origin: center;
            }
            .bolt-wave-arm {
                animation: boltWave 0.6s ease-in-out infinite;
                transform-origin: 85px 100px;
            }

            /* Mobile responsive Bolt */
            @media (max-width: 768px) {
                #bolt-avatar-container {
                    bottom: 10px !important;
                    right: 10px !important;
                }
                #bolt-avatar {
                    width: 80px !important;
                    height: 160px !important;
                }
                #bolt-speech-bubble {
                    max-width: 220px !important;
                    padding: 10px 12px !important;
                    font-size: 12px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createAvatarContainer() {
        this.container = document.createElement('div');
        this.container.id = 'bolt-avatar-container';
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
        avatar.id = 'bolt-avatar';
        avatar.innerHTML = this.getAvatarSVG('standing');
        avatar.style.cssText = `
            width: 120px;
            height: 240px;
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
            border: 1px solid #ffd700;
        `;
        this.container.appendChild(changeAvatarLabel);

        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.05)';
            changeAvatarLabel.style.opacity = '1';
        });
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
            changeAvatarLabel.style.opacity = '0';
        });
        avatar.addEventListener('click', () => {
            this.toggleSpeech();
        });

        // Create dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'bolt-dismiss-btn';
        dismissBtn.innerHTML = '×';
        dismissBtn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ffd700;
            color: #ffd700;
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
            dismissBtn.style.background = '#ffd700';
            dismissBtn.style.color = '#000';
        });
        dismissBtn.addEventListener('mouseleave', () => {
            dismissBtn.style.background = 'rgba(0, 0, 0, 0.8)';
            dismissBtn.style.color = '#ffd700';
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
        this.speechBubble.id = 'bolt-speech-bubble';
        this.speechBubble.style.cssText = `
            background: linear-gradient(145deg, rgba(25, 25, 15, 0.98), rgba(40, 35, 10, 0.98));
            border: 2px solid #ffd700;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 350px;
            color: #fff;
            font-size: 15px;
            line-height: 1.6;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.2);
            position: relative;
            display: none;
            animation: speechFadeIn 0.4s ease;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -12px;
            right: 40px;
            width: 0;
            height: 0;
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 14px solid #ffd700;
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
            color: #ffd700;
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
        titleEl.id = 'bolt-speech-title';
        titleEl.style.cssText = `
            color: #ffd700;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
        `;
        this.speechBubble.appendChild(titleEl);

        const textContainer = document.createElement('div');
        textContainer.id = 'bolt-speech-text';
        textContainer.style.cssText = `padding-right: 20px; font-size: 15px;`;
        this.speechBubble.appendChild(textContainer);

        // Chat input
        const chatContainer = document.createElement('div');
        chatContainer.id = 'bolt-chat-container';
        chatContainer.style.cssText = `
            display: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
        `;

        const chatInputWrapper = document.createElement('div');
        chatInputWrapper.style.cssText = `display: flex; gap: 8px; align-items: center;`;

        const chatInput = document.createElement('input');
        chatInput.id = 'bolt-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Ask Bolt anything...';
        chatInput.style.cssText = `
            flex: 1;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 215, 0, 0.4);
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
            background: #ffd700;
            border: none;
            color: #000;
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

        this.container.insertBefore(this.speechBubble, this.container.firstChild);
    }

    getAvatarSVG(pose) {
        const isWaving = pose === 'waving';
        const isPointing = pose === 'pointing';
        const isThumbsUp = pose === 'thumbsup';
        const isHappy = pose === 'happy';

        return `
        <svg viewBox="0 0 120 240" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Lightning bolt gradient -->
                <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fff700"/>
                    <stop offset="30%" style="stop-color:#ffd700"/>
                    <stop offset="70%" style="stop-color:#ffaa00"/>
                    <stop offset="100%" style="stop-color:#ff8800"/>
                </linearGradient>
                <linearGradient id="boltShine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffffd0"/>
                    <stop offset="50%" style="stop-color:#ffd700"/>
                    <stop offset="100%" style="stop-color:#cc9900"/>
                </linearGradient>

                <!-- Glow effect -->
                <filter id="boltGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feFlood flood-color="#ffd700" flood-opacity="0.5"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <!-- Spark filter -->
                <filter id="sparkFilter" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="2" result="blur"/>
                    <feFlood flood-color="#ffffff" flood-opacity="0.8"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                <!-- Hand gradient -->
                <linearGradient id="boltHand" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fff"/>
                    <stop offset="100%" style="stop-color:#ffd700"/>
                </linearGradient>

                <!-- Shoe gradient -->
                <linearGradient id="boltShoe" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4444"/>
                    <stop offset="100%" style="stop-color:#cc0000"/>
                </linearGradient>
            </defs>

            <!-- AMBIENT GLOW -->
            <ellipse cx="60" cy="130" rx="40" ry="80" fill="#ffd700" opacity="0.08"/>

            <!-- LEGS -->
            <g>
                <!-- Left leg -->
                <rect x="35" y="155" width="12" height="40" rx="6" fill="url(#boltGradient)"/>
                <!-- Right leg -->
                <rect x="73" y="155" width="12" height="40" rx="6" fill="url(#boltGradient)"/>

                <!-- Left shoe -->
                <ellipse cx="41" cy="198" rx="14" ry="8" fill="url(#boltShoe)"/>
                <ellipse cx="43" cy="195" rx="6" ry="3" fill="#ff6666" opacity="0.5"/>

                <!-- Right shoe -->
                <ellipse cx="79" cy="198" rx="14" ry="8" fill="url(#boltShoe)"/>
                <ellipse cx="81" cy="195" rx="6" ry="3" fill="#ff6666" opacity="0.5"/>
            </g>

            <!-- MAIN LIGHTNING BOLT BODY -->
            <g filter="url(#boltGlowFilter)">
                <!-- Main bolt shape -->
                <path d="M 75 10
                         L 85 10
                         L 55 75
                         L 80 75
                         L 40 160
                         L 55 100
                         L 35 100
                         L 75 10"
                    fill="url(#boltGradient)" stroke="#cc9900" stroke-width="2"/>

                <!-- Shine highlight -->
                <path d="M 72 15
                         L 78 15
                         L 55 65
                         L 70 65
                         L 48 120"
                    fill="none" stroke="url(#boltShine)" stroke-width="4" opacity="0.6"/>
            </g>

            <!-- FACE -->
            <g transform="translate(35, 50)">
                <!-- Eyes -->
                <g class="bolt-eye">
                    <ellipse cx="15" cy="30" rx="10" ry="12" fill="#fff"/>
                    <ellipse cx="16" cy="30" rx="6" ry="7" fill="#1a1a1a"/>
                    <circle cx="18" cy="28" r="3" fill="#fff"/>
                </g>
                <g class="bolt-eye">
                    <ellipse cx="45" cy="30" rx="10" ry="12" fill="#fff"/>
                    <ellipse cx="44" cy="30" rx="6" ry="7" fill="#1a1a1a"/>
                    <circle cx="46" cy="28" r="3" fill="#fff"/>
                </g>

                <!-- Eyebrows (expressive) -->
                ${isHappy ? `
                    <path d="M 8 18 Q 15 14 22 18" stroke="#cc9900" stroke-width="3" fill="none"/>
                    <path d="M 38 18 Q 45 14 52 18" stroke="#cc9900" stroke-width="3" fill="none"/>
                ` : `
                    <path d="M 8 20 Q 15 16 22 20" stroke="#cc9900" stroke-width="3" fill="none"/>
                    <path d="M 38 20 Q 45 16 52 20" stroke="#cc9900" stroke-width="3" fill="none"/>
                `}

                <!-- Mouth -->
                ${isHappy || isThumbsUp ? `
                    <path d="M 20 48 Q 30 60 40 48" stroke="#cc9900" stroke-width="3" fill="none"/>
                    <path d="M 22 48 Q 30 56 38 48" fill="#fff"/>
                ` : `
                    <path d="M 22 50 Q 30 58 38 50" stroke="#cc9900" stroke-width="3" fill="none"/>
                `}

                <!-- Rosy cheeks -->
                <ellipse cx="8" cy="42" rx="6" ry="4" fill="#ffaa88" opacity="0.4"/>
                <ellipse cx="52" cy="42" rx="6" ry="4" fill="#ffaa88" opacity="0.4"/>
            </g>

            <!-- ARMS -->
            ${isWaving ? `
            <!-- Left arm - static -->
            <g>
                <rect x="10" y="85" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(-20, 15, 85)"/>
                <ellipse cx="5" cy="118" rx="10" ry="10" fill="url(#boltHand)"/>
                <!-- Fingers -->
                <ellipse cx="0" cy="112" rx="4" ry="5" fill="url(#boltHand)"/>
                <ellipse cx="8" cy="108" rx="4" ry="5" fill="url(#boltHand)"/>
            </g>
            <!-- Right arm - waving -->
            <g class="bolt-wave-arm">
                <rect x="95" y="60" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(30, 100, 60)"/>
                <ellipse cx="115" cy="48" rx="10" ry="10" fill="url(#boltHand)"/>
                <!-- Fingers spread for wave -->
                <ellipse cx="118" cy="40" rx="4" ry="6" fill="url(#boltHand)" transform="rotate(-20, 118, 40)"/>
                <ellipse cx="125" cy="44" rx="4" ry="5" fill="url(#boltHand)" transform="rotate(-10, 125, 44)"/>
                <ellipse cx="128" cy="52" rx="4" ry="5" fill="url(#boltHand)"/>
            </g>
            ` : isPointing ? `
            <!-- Left arm - at side -->
            <g>
                <rect x="8" y="85" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(-15, 13, 85)"/>
                <ellipse cx="2" cy="118" rx="10" ry="10" fill="url(#boltHand)"/>
            </g>
            <!-- Right arm - pointing -->
            <g>
                <rect x="95" y="80" width="10" height="40" rx="5" fill="url(#boltGradient)" transform="rotate(-70, 100, 80)"/>
                <ellipse cx="130" cy="65" rx="8" ry="8" fill="url(#boltHand)"/>
                <!-- Pointing finger -->
                <rect x="135" y="60" width="20" height="6" rx="3" fill="url(#boltHand)"/>
            </g>
            ` : isThumbsUp ? `
            <!-- Left arm - at side -->
            <g>
                <rect x="8" y="85" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(-15, 13, 85)"/>
                <ellipse cx="2" cy="118" rx="10" ry="10" fill="url(#boltHand)"/>
            </g>
            <!-- Right arm - thumbs up -->
            <g>
                <rect x="95" y="70" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(-40, 100, 70)"/>
                <ellipse cx="118" cy="55" rx="10" ry="10" fill="url(#boltHand)"/>
                <!-- Thumb up -->
                <rect x="115" y="38" width="7" height="18" rx="3.5" fill="url(#boltHand)"/>
                <ellipse cx="118.5" cy="38" rx="4" ry="4" fill="url(#boltHand)"/>
            </g>
            ` : `
            <!-- Default arms at sides -->
            <g>
                <rect x="8" y="85" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(-15, 13, 85)"/>
                <ellipse cx="2" cy="118" rx="10" ry="10" fill="url(#boltHand)"/>
            </g>
            <g>
                <rect x="100" y="85" width="10" height="35" rx="5" fill="url(#boltGradient)" transform="rotate(15, 105, 85)"/>
                <ellipse cx="115" cy="118" rx="10" ry="10" fill="url(#boltHand)"/>
            </g>
            `}

            <!-- ELECTRIC SPARKS -->
            <g class="bolt-spark" filter="url(#sparkFilter)">
                <circle cx="20" cy="40" r="3" fill="#fff"/>
                <circle cx="100" cy="60" r="2" fill="#fff"/>
                <circle cx="30" cy="140" r="2" fill="#fff"/>
                <circle cx="90" cy="130" r="2.5" fill="#fff"/>
            </g>

            <!-- Mini lightning bolts around -->
            <g class="bolt-spark" opacity="0.7">
                <path d="M 10 30 L 15 35 L 12 35 L 18 42" stroke="#ffd700" stroke-width="2" fill="none"/>
                <path d="M 108 45 L 112 50 L 109 50 L 115 58" stroke="#ffd700" stroke-width="2" fill="none"/>
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
        const textEl = document.getElementById('bolt-speech-text');
        const titleEl = document.getElementById('bolt-speech-title');
        if (textEl) textEl.textContent = text;
        if (titleEl) titleEl.textContent = title;
        this.speechBubble.style.display = 'block';
    }

    hideSpeech() {
        this.speechBubble.style.display = 'none';
    }

    toggleSpeech() {
        if (this.speechBubble.style.display === 'none') {
            this.showSpeech("Zap! What can I help you with today?", "Bolt");
            this.enableChatMode();
        } else {
            this.hideSpeech();
        }
    }

    setPose(pose) {
        this.currentPose = pose;
        const avatar = document.getElementById('bolt-avatar');
        if (avatar) {
            avatar.innerHTML = this.getAvatarSVG(pose);
        }
    }

    enableChatMode() {
        const chatContainer = document.getElementById('bolt-chat-container');
        if (chatContainer) chatContainer.style.display = 'block';
    }

    handleChatInput(message) {
        if (!message.trim()) return;

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('upload') || lowerMsg.includes('financial')) {
            this.showSpeech("Zap! Let me open the upload panel for you!", "Upload");
            this.setPose('pointing');
            setTimeout(() => {
                if (typeof showUploadModal === 'function') showUploadModal();
            }, 500);
        } else if (lowerMsg.includes('package') || lowerMsg.includes('upgrade')) {
            this.showSpeech("Lightning fast! Check out our packages!", "Packages");
            this.setPose('pointing');
        } else if (lowerMsg.includes('help')) {
            this.showSpeech("I can help you upload financials, generate reports, and navigate the app! Just ask!", "Bolt Help");
            this.setPose('waving');
        } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            this.showSpeech("Zap zap! Great to meet you! I'm Bolt, your speedy helper!", "Hello!");
            this.setPose('waving');
        } else {
            this.showSpeech(`Got it! "${message}" - let me help you with that!`, "On It!");
            this.setPose('thumbsup');
        }
        this.enableChatMode();
    }

    welcomeBack(userName) {
        this.show();
        this.setPose('waving');
        this.showSpeech(`Zap! Welcome back, ${userName}! Ready to crunch some numbers?`, "Hey There!");
        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 5000);
    }

    celebrate() {
        this.show();
        this.setPose('happy');
        this.showSpeech("Zap zap! Awesome job! Your data is looking electric!", "Great Work!");
    }
}

// Initialize Bolt
let boltAvatar = null;

// Make Bolt globally available
window.initBoltAvatar = function() {
    if (!boltAvatar) {
        boltAvatar = new BoltAvatar();
    }
    return boltAvatar;
};

window.boltAvatar = {
    show: () => { if (!boltAvatar) boltAvatar = new BoltAvatar(); boltAvatar.show(); },
    hide: () => boltAvatar?.hide(),
    welcomeBack: (name) => { if (!boltAvatar) boltAvatar = new BoltAvatar(); boltAvatar.welcomeBack(name); },
    celebrate: () => { if (!boltAvatar) boltAvatar = new BoltAvatar(); boltAvatar.celebrate(); },
    showSpeech: (text, title) => { if (!boltAvatar) boltAvatar = new BoltAvatar(); boltAvatar.showSpeech(text, title); },
    setPose: (pose) => boltAvatar?.setPose(pose)
};

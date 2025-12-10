// =====================================================
// LIGHTNING LEDGERZ - ZEUS AVATAR SYSTEM
// Realistic Greek God of Thunder
// Muscular physique, white toga, gold accessories
// Based on classical depictions with modern styling
// =====================================================

class ZeusAvatar {
    constructor() {
        this.container = null;
        this.speechBubble = null;
        this.currentPose = 'standing';
        this.isVisible = false;
        this.personality = {
            name: 'Zeus',
            title: 'Lord of Thunder',
            greeting: "Greetings, mortal. I am Zeus, and I shall bring divine clarity to your finances.",
            style: 'majestic'
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
        style.id = 'zeus-avatar-styles';
        style.textContent = `
            @keyframes zeusIdle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            @keyframes zeusGlow {
                0%, 100% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 30px rgba(138, 130, 255, 0.2)); }
                50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 50px rgba(138, 130, 255, 0.4)); }
            }
            @keyframes zeusLightning {
                0%, 85%, 100% { opacity: 0; }
                88%, 92% { opacity: 1; }
            }
            @keyframes zeusBlink {
                0%, 42%, 44%, 100% { transform: scaleY(1); }
                43% { transform: scaleY(0.1); }
            }
            @keyframes zeusBeardFlow {
                0%, 100% { transform: skewX(0deg); }
                50% { transform: skewX(1deg); }
            }
            @keyframes togaFlow {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(1deg); }
            }
            @keyframes electricPulse {
                0%, 100% { stroke-opacity: 0.3; }
                50% { stroke-opacity: 0.8; }
            }
            #zeus-avatar-container {
                animation: zeusIdle 4s ease-in-out infinite;
            }
            #zeus-avatar {
                animation: zeusGlow 3s ease-in-out infinite;
            }
            .zeus-eye {
                animation: zeusBlink 5s ease-in-out infinite;
                transform-origin: center;
            }
            .zeus-beard {
                animation: zeusBeardFlow 4s ease-in-out infinite;
            }
            .zeus-toga-flow {
                animation: togaFlow 3s ease-in-out infinite;
            }
            .zeus-lightning-bolt {
                animation: zeusLightning 4s ease-in-out infinite;
            }
            .zeus-electric {
                animation: electricPulse 2s ease-in-out infinite;
            }

            /* Mobile responsive Zeus */
            @media (max-width: 768px) {
                #zeus-avatar-container {
                    bottom: 10px !important;
                    right: 10px !important;
                }
                #zeus-avatar {
                    width: 110px !important;
                    height: 220px !important;
                }
                #zeus-speech-bubble {
                    max-width: 240px !important;
                    padding: 12px 15px !important;
                    font-size: 13px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createAvatarContainer() {
        this.container = document.createElement('div');
        this.container.id = 'zeus-avatar-container';
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
        avatar.id = 'zeus-avatar';
        avatar.innerHTML = this.getAvatarSVG('standing');
        avatar.style.cssText = `
            width: 160px;
            height: 320px;
            cursor: pointer;
            transition: transform 0.3s ease;
        `;

        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.03)';
        });
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
        });
        avatar.addEventListener('click', () => {
            this.toggleSpeech();
        });

        // Create dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'zeus-dismiss-btn';
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
        this.speechBubble.id = 'zeus-speech-bubble';
        this.speechBubble.style.cssText = `
            background: linear-gradient(145deg, rgba(20, 15, 35, 0.98), rgba(35, 25, 55, 0.98));
            border: 2px solid #ffd700;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 380px;
            color: #fff;
            font-size: 15px;
            line-height: 1.6;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.2), 0 0 60px rgba(138, 130, 255, 0.1);
            position: relative;
            display: none;
            animation: speechFadeIn 0.4s ease;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -12px;
            right: 50px;
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
        titleEl.id = 'zeus-speech-title';
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
        textContainer.id = 'zeus-speech-text';
        textContainer.style.cssText = `padding-right: 20px; font-size: 15px;`;
        this.speechBubble.appendChild(textContainer);

        // Chat input
        const chatContainer = document.createElement('div');
        chatContainer.id = 'zeus-chat-container';
        chatContainer.style.cssText = `
            display: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 215, 0, 0.3);
        `;

        const chatInputWrapper = document.createElement('div');
        chatInputWrapper.style.cssText = `display: flex; gap: 8px; align-items: center;`;

        const chatInput = document.createElement('input');
        chatInput.id = 'zeus-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Speak to Zeus...';
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
            background: linear-gradient(135deg, #ffd700, #cc9900);
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
        const isLightning = pose === 'lightning';

        return `
        <svg viewBox="0 0 160 320" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Realistic skin tones -->
                <linearGradient id="zeusSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f5d0b5"/>
                    <stop offset="30%" style="stop-color:#e8c4a8"/>
                    <stop offset="70%" style="stop-color:#d4a88a"/>
                    <stop offset="100%" style="stop-color:#c49a7c"/>
                </linearGradient>
                <linearGradient id="zeusSkinShadow" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#d4a88a"/>
                    <stop offset="100%" style="stop-color:#b8896b"/>
                </linearGradient>

                <!-- Muscular definition -->
                <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f5d0b5"/>
                    <stop offset="100%" style="stop-color:#e8c4a8"/>
                </linearGradient>
                <linearGradient id="muscleShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#c49a7c"/>
                    <stop offset="100%" style="stop-color:#a87d5f"/>
                </linearGradient>

                <!-- White toga with golden trim -->
                <linearGradient id="togaWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="30%" style="stop-color:#f8f8f8"/>
                    <stop offset="70%" style="stop-color:#f0f0f0"/>
                    <stop offset="100%" style="stop-color:#e8e8e8"/>
                </linearGradient>
                <linearGradient id="togaShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e0e0e0"/>
                    <stop offset="100%" style="stop-color:#c8c8c8"/>
                </linearGradient>

                <!-- Gold accessories -->
                <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fff8dc"/>
                    <stop offset="25%" style="stop-color:#ffd700"/>
                    <stop offset="50%" style="stop-color:#ffed4a"/>
                    <stop offset="75%" style="stop-color:#ffd700"/>
                    <stop offset="100%" style="stop-color:#cc9900"/>
                </linearGradient>
                <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffd700"/>
                    <stop offset="100%" style="stop-color:#996600"/>
                </linearGradient>

                <!-- White/silver hair and beard -->
                <linearGradient id="zeusHair" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="30%" style="stop-color:#e8e8e8"/>
                    <stop offset="70%" style="stop-color:#d0d0d0"/>
                    <stop offset="100%" style="stop-color:#b8b8b8"/>
                </linearGradient>
                <linearGradient id="zeusBeard" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f5f5f5"/>
                    <stop offset="50%" style="stop-color:#e0e0e0"/>
                    <stop offset="100%" style="stop-color:#c8c8c8"/>
                </linearGradient>

                <!-- Eye colors -->
                <radialGradient id="zeusEyeWhite" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#f5f5f5"/>
                </radialGradient>
                <radialGradient id="zeusIris" cx="35%" cy="35%" r="60%">
                    <stop offset="0%" style="stop-color:#6699ff"/>
                    <stop offset="40%" style="stop-color:#3366cc"/>
                    <stop offset="100%" style="stop-color:#1a3d7a"/>
                </radialGradient>

                <!-- Lightning bolt -->
                <linearGradient id="zeusLightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffcc"/>
                    <stop offset="30%" style="stop-color:#ffd700"/>
                    <stop offset="70%" style="stop-color:#ffaa00"/>
                    <stop offset="100%" style="stop-color:#ff8800"/>
                </linearGradient>

                <!-- Filters -->
                <filter id="zeusShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/>
                </filter>
                <filter id="zeusGoldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feFlood flood-color="#ffd700" flood-opacity="0.6"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="lightningGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feFlood flood-color="#ffd700" flood-opacity="0.9"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- AMBIENT DIVINE GLOW -->
            <ellipse cx="80" cy="180" rx="70" ry="120" fill="url(#goldShine)" opacity="0.05"/>

            <!-- SANDALS -->
            <g>
                <!-- Left sandal -->
                <ellipse cx="55" cy="298" rx="18" ry="8" fill="#8B4513"/>
                <path d="M 40 290 Q 55 285 70 290 L 70 298 L 40 298 Z" fill="url(#goldDark)"/>
                <path d="M 50 290 L 50 275" stroke="url(#goldShine)" stroke-width="3"/>
                <path d="M 60 290 L 60 275" stroke="url(#goldShine)" stroke-width="3"/>

                <!-- Right sandal -->
                <ellipse cx="105" cy="298" rx="18" ry="8" fill="#8B4513"/>
                <path d="M 90 290 Q 105 285 120 290 L 120 298 L 90 298 Z" fill="url(#goldDark)"/>
                <path d="M 100 290 L 100 275" stroke="url(#goldShine)" stroke-width="3"/>
                <path d="M 110 290 L 110 275" stroke="url(#goldShine)" stroke-width="3"/>
            </g>

            <!-- MUSCULAR LEGS (partially visible under toga) -->
            <g>
                <!-- Left leg -->
                <path d="M 50 230 Q 45 260 50 290 Q 55 295 60 290 Q 65 260 60 230" fill="url(#zeusSkin)"/>
                <path d="M 52 245 Q 48 265 52 285" stroke="url(#muscleShadow)" stroke-width="2" fill="none" opacity="0.3"/>

                <!-- Right leg -->
                <path d="M 100 230 Q 95 260 100 290 Q 105 295 110 290 Q 115 260 110 230" fill="url(#zeusSkin)"/>
                <path d="M 105 245 Q 102 265 105 285" stroke="url(#muscleShadow)" stroke-width="2" fill="none" opacity="0.3"/>
            </g>

            <!-- TOGA (main draping) -->
            <g class="zeus-toga-flow">
                <!-- Main toga body -->
                <path d="M 30 105
                         Q 20 140 25 180
                         L 30 240
                         Q 80 250 130 240
                         L 135 180
                         Q 140 140 130 105
                         Z"
                    fill="url(#togaWhite)" filter="url(#zeusShadow)"/>

                <!-- Toga folds and draping -->
                <path d="M 40 120 Q 35 160 40 200 Q 45 220 50 240" stroke="url(#togaShadow)" stroke-width="3" fill="none" opacity="0.4"/>
                <path d="M 60 110 Q 55 150 60 190 Q 65 215 70 235" stroke="url(#togaShadow)" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M 100 110 Q 105 150 100 190 Q 95 215 90 235" stroke="url(#togaShadow)" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M 120 120 Q 125 160 120 200 Q 115 220 110 240" stroke="url(#togaShadow)" stroke-width="3" fill="none" opacity="0.4"/>

                <!-- Toga over shoulder -->
                <path d="M 40 105 Q 30 80 50 70 L 80 75 Q 85 85 80 105" fill="url(#togaWhite)"/>
                <path d="M 45 90 Q 55 80 70 85" stroke="url(#togaShadow)" stroke-width="2" fill="none" opacity="0.3"/>

                <!-- Gold trim on toga -->
                <path d="M 30 105 Q 80 95 130 105" stroke="url(#goldShine)" stroke-width="4" fill="none"/>
                <path d="M 25 180 Q 80 175 135 180" stroke="url(#goldShine)" stroke-width="3" fill="none"/>
                <path d="M 30 240 Q 80 250 130 240" stroke="url(#goldShine)" stroke-width="4" fill="none"/>
            </g>

            <!-- EXPOSED MUSCULAR ARM (RIGHT) -->
            ${isWaving ? `
            <g>
                <!-- Upper arm -->
                <path d="M 125 105 Q 145 90 155 55 L 145 50 Q 138 85 120 98"
                    fill="url(#zeusSkin)" filter="url(#zeusShadow)"/>
                <!-- Bicep definition -->
                <ellipse cx="140" cy="75" rx="12" ry="18" fill="url(#muscleHighlight)" opacity="0.3"/>
                <!-- Forearm -->
                <path d="M 155 55 Q 160 30 158 10 L 148 8 Q 150 30 145 50"
                    fill="url(#zeusSkin)"/>
                <!-- Hand waving -->
                <g transform="translate(145, 0)">
                    <ellipse cx="8" cy="12" rx="12" ry="14" fill="url(#zeusSkin)"/>
                    <rect x="0" y="-8" width="5" height="16" rx="2.5" fill="url(#zeusSkin)" transform="rotate(-15, 2.5, 0)"/>
                    <rect x="7" y="-10" width="5" height="18" rx="2.5" fill="url(#zeusSkin)"/>
                    <rect x="14" y="-8" width="5" height="16" rx="2.5" fill="url(#zeusSkin)" transform="rotate(10, 16.5, 0)"/>
                    <rect x="20" y="-4" width="4" height="12" rx="2" fill="url(#zeusSkin)" transform="rotate(20, 22, 0)"/>
                </g>
            </g>
            ` : isLightning ? `
            <g>
                <!-- Arm raised holding lightning -->
                <path d="M 125 105 Q 150 85 160 45 L 150 40 Q 142 78 120 98"
                    fill="url(#zeusSkin)" filter="url(#zeusShadow)"/>
                <ellipse cx="145" cy="70" rx="14" ry="20" fill="url(#muscleHighlight)" opacity="0.3"/>
                <!-- Hand gripping lightning bolt -->
                <ellipse cx="155" cy="30" rx="14" ry="16" fill="url(#zeusSkin)"/>

                <!-- LIGHTNING BOLT IN HAND -->
                <g filter="url(#lightningGlow)">
                    <path d="M 165 -20 L 175 -20 L 155 25 L 170 25 L 140 80 L 152 35 L 140 35 L 165 -20"
                        fill="url(#zeusLightningGrad)" stroke="#cc9900" stroke-width="1"/>
                </g>
            </g>
            ` : `
            <g>
                <!-- Right arm at side -->
                <path d="M 125 105 Q 140 120 145 155 L 137 158 Q 134 125 120 108"
                    fill="url(#zeusSkin)" filter="url(#zeusShadow)"/>
                <ellipse cx="135" cy="130" rx="10" ry="15" fill="url(#muscleHighlight)" opacity="0.3"/>
                <path d="M 145 155 Q 148 185 145 210 L 135 212 Q 138 185 137 158"
                    fill="url(#zeusSkin)"/>
                <ellipse cx="140" cy="218" rx="12" ry="14" fill="url(#zeusSkin)"/>
            </g>
            `}

            <!-- LEFT ARM (under toga usually) -->
            <g>
                <path d="M 35 105 Q 20 120 15 155 L 23 158 Q 26 125 40 108"
                    fill="url(#zeusSkin)" filter="url(#zeusShadow)"/>
                <path d="M 15 155 Q 12 185 15 210 L 25 212 Q 22 185 23 158"
                    fill="url(#zeusSkin)"/>
                <ellipse cx="20" cy="218" rx="12" ry="14" fill="url(#zeusSkin)"/>
            </g>

            <!-- MUSCULAR CHEST (visible at neckline) -->
            <g>
                <ellipse cx="80" cy="95" rx="35" ry="20" fill="url(#zeusSkin)"/>
                <!-- Pec definition -->
                <path d="M 55 90 Q 70 100 80 95 Q 90 100 105 90" stroke="url(#muscleShadow)" stroke-width="2" fill="none" opacity="0.4"/>
                <ellipse cx="65" cy="92" rx="12" ry="8" fill="url(#muscleHighlight)" opacity="0.2"/>
                <ellipse cx="95" cy="92" rx="12" ry="8" fill="url(#muscleHighlight)" opacity="0.2"/>
            </g>

            <!-- NECK (thick, powerful) -->
            <path d="M 65 80 Q 65 70 68 60 L 92 60 Q 95 70 95 80" fill="url(#zeusSkin)"/>
            <path d="M 70 75 L 70 65" stroke="url(#muscleShadow)" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M 90 75 L 90 65" stroke="url(#muscleShadow)" stroke-width="2" fill="none" opacity="0.3"/>

            <!-- GOLD SHOULDER CLASP -->
            <g filter="url(#zeusGoldGlow)">
                <ellipse cx="45" cy="90" rx="10" ry="10" fill="url(#goldShine)"/>
                <circle cx="45" cy="90" r="5" fill="url(#goldDark)"/>
                <circle cx="45" cy="90" r="2" fill="#fff8dc"/>
            </g>

            <!-- HEAD -->
            <ellipse cx="80" cy="35" rx="32" ry="38" fill="url(#zeusSkin)" filter="url(#zeusShadow)"/>

            <!-- EARS -->
            <ellipse cx="48" cy="38" rx="5" ry="9" fill="url(#zeusSkinShadow)"/>
            <ellipse cx="112" cy="38" rx="5" ry="9" fill="url(#zeusSkinShadow)"/>

            <!-- FLOWING WHITE HAIR -->
            <g class="zeus-beard">
                <!-- Main hair mass -->
                <path d="M 48 35
                         Q 42 10 55 -5
                         Q 70 -12 80 -10
                         Q 90 -12 105 -5
                         Q 118 10 112 35
                         Q 105 15 80 12
                         Q 55 15 48 35"
                    fill="url(#zeusHair)"/>

                <!-- Hair waves and curls -->
                <path d="M 52 5 Q 48 -5 55 -8 Q 62 -5 58 5" fill="url(#zeusHair)"/>
                <path d="M 75 -2 Q 72 -12 80 -14 Q 88 -12 85 -2" fill="url(#zeusHair)"/>
                <path d="M 98 5 Q 95 -5 102 -8 Q 112 -5 108 5" fill="url(#zeusHair)"/>

                <!-- Side hair flowing down -->
                <path d="M 48 35 Q 40 50 45 70" stroke="url(#zeusHair)" stroke-width="8" fill="none"/>
                <path d="M 112 35 Q 120 50 115 70" stroke="url(#zeusHair)" stroke-width="8" fill="none"/>

                <!-- Hair highlights -->
                <path d="M 55 0 Q 70 -5 95 0" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.5"/>
            </g>

            <!-- MAJESTIC BEARD -->
            <g class="zeus-beard">
                <!-- Main beard shape -->
                <path d="M 55 55
                         Q 50 70 55 90
                         Q 60 110 80 115
                         Q 100 110 105 90
                         Q 110 70 105 55"
                    fill="url(#zeusBeard)"/>

                <!-- Beard curls and waves -->
                <path d="M 58 70 Q 55 80 60 95" stroke="#c8c8c8" stroke-width="3" fill="none" opacity="0.5"/>
                <path d="M 70 75 Q 68 90 72 105" stroke="#c8c8c8" stroke-width="2" fill="none" opacity="0.4"/>
                <path d="M 80 78 Q 80 95 80 110" stroke="#d8d8d8" stroke-width="2" fill="none" opacity="0.5"/>
                <path d="M 90 75 Q 92 90 88 105" stroke="#c8c8c8" stroke-width="2" fill="none" opacity="0.4"/>
                <path d="M 102 70 Q 105 80 100 95" stroke="#c8c8c8" stroke-width="3" fill="none" opacity="0.5"/>

                <!-- Mustache -->
                <path d="M 60 55 Q 70 62 80 58 Q 90 62 100 55" fill="url(#zeusBeard)"/>
            </g>

            <!-- EYES - Intense blue -->
            <g class="zeus-eye">
                <ellipse cx="68" cy="35" rx="9" ry="7" fill="url(#zeusEyeWhite)"/>
                <ellipse cx="69" cy="35" rx="5" ry="5" fill="url(#zeusIris)"/>
                <circle cx="69" cy="35" r="2.5" fill="#0a1a3d"/>
                <circle cx="71" cy="33" r="1.5" fill="#fff"/>
            </g>
            <g class="zeus-eye">
                <ellipse cx="92" cy="35" rx="9" ry="7" fill="url(#zeusEyeWhite)"/>
                <ellipse cx="91" cy="35" rx="5" ry="5" fill="url(#zeusIris)"/>
                <circle cx="91" cy="35" r="2.5" fill="#0a1a3d"/>
                <circle cx="93" cy="33" r="1.5" fill="#fff"/>
            </g>

            <!-- EYEBROWS - Strong, white -->
            <path d="M 56 26 Q 68 20 78 26" stroke="url(#zeusHair)" stroke-width="4" fill="none"/>
            <path d="M 82 26 Q 92 20 104 26" stroke="url(#zeusHair)" stroke-width="4" fill="none"/>

            <!-- NOSE - Greek profile -->
            <path d="M 80 28 Q 82 40 80 50 Q 76 52 74 50"
                stroke="url(#zeusSkinShadow)" stroke-width="2.5" fill="none"/>

            <!-- GOLD CROWN/LAUREL -->
            <g filter="url(#zeusGoldGlow)">
                <path d="M 50 8 Q 65 0 80 2 Q 95 0 110 8 Q 105 15 80 12 Q 55 15 50 8"
                    fill="url(#goldShine)"/>
                <!-- Laurel leaves -->
                <ellipse cx="55" cy="8" rx="6" ry="3" fill="url(#goldShine)" transform="rotate(-30, 55, 8)"/>
                <ellipse cx="65" cy="4" rx="6" ry="3" fill="url(#goldShine)" transform="rotate(-15, 65, 4)"/>
                <ellipse cx="80" cy="2" rx="6" ry="3" fill="url(#goldShine)"/>
                <ellipse cx="95" cy="4" rx="6" ry="3" fill="url(#goldShine)" transform="rotate(15, 95, 4)"/>
                <ellipse cx="105" cy="8" rx="6" ry="3" fill="url(#goldShine)" transform="rotate(30, 105, 8)"/>
            </g>

            <!-- GOLD ARM BAND -->
            <g filter="url(#zeusGoldGlow)">
                <ellipse cx="135" cy="115" rx="8" ry="4" fill="url(#goldShine)"/>
                <ellipse cx="25" cy="115" rx="8" ry="4" fill="url(#goldShine)"/>
            </g>

            <!-- AMBIENT LIGHTNING EFFECTS -->
            <g class="zeus-lightning-bolt" opacity="0">
                <path d="M 10 50 L 20 65 L 15 65 L 28 85" stroke="#ffd700" stroke-width="2" fill="none" filter="url(#lightningGlow)"/>
                <path d="M 150 100 L 140 115 L 145 115 L 132 135" stroke="#ffd700" stroke-width="2" fill="none" filter="url(#lightningGlow)"/>
            </g>

            <!-- ELECTRIC AURA -->
            <g class="zeus-electric" opacity="0.3">
                <circle cx="35" cy="150" r="3" fill="#ffd700"/>
                <circle cx="125" cy="170" r="2" fill="#ffd700"/>
                <circle cx="40" cy="200" r="2" fill="#ffd700"/>
                <circle cx="120" cy="220" r="2.5" fill="#ffd700"/>
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
        const textEl = document.getElementById('zeus-speech-text');
        const titleEl = document.getElementById('zeus-speech-title');
        if (textEl) textEl.textContent = text;
        if (titleEl) titleEl.textContent = title;
        this.speechBubble.style.display = 'block';
    }

    hideSpeech() {
        this.speechBubble.style.display = 'none';
    }

    toggleSpeech() {
        if (this.speechBubble.style.display === 'none') {
            this.showSpeech("Speak, mortal. What financial wisdom do you seek?", "Zeus Speaks");
            this.enableChatMode();
        } else {
            this.hideSpeech();
        }
    }

    setPose(pose) {
        this.currentPose = pose;
        const avatar = document.getElementById('zeus-avatar');
        if (avatar) {
            avatar.innerHTML = this.getAvatarSVG(pose);
        }
    }

    enableChatMode() {
        const chatContainer = document.getElementById('zeus-chat-container');
        if (chatContainer) chatContainer.style.display = 'block';
    }

    handleChatInput(message) {
        if (!message.trim()) return;

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('upload') || lowerMsg.includes('financial')) {
            this.showSpeech("By the power of Olympus, I shall open the sacred upload portal!", "Divine Upload");
            this.setPose('lightning');
            setTimeout(() => {
                if (typeof showUploadModal === 'function') showUploadModal();
            }, 500);
        } else if (lowerMsg.includes('package') || lowerMsg.includes('upgrade')) {
            this.showSpeech("Behold our divine offerings! Choose your path to financial enlightenment.", "Sacred Packages");
            this.setPose('pointing');
        } else if (lowerMsg.includes('help')) {
            this.showSpeech("I, Zeus, command the thunderclouds and the financial heavens. Ask, and wisdom shall be bestowed upon you!", "Divine Guidance");
            this.setPose('waving');
        } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            this.showSpeech("Greetings, mortal! I am Zeus, God of Thunder and Master of Financial Lightning. How may I illuminate your path?", "Welcome");
            this.setPose('waving');
        } else {
            this.showSpeech(`Your inquiry about "${message}" has been heard. The gods shall provide clarity!`, "Oracle Response");
            this.setPose('lightning');
        }
        this.enableChatMode();
    }

    welcomeBack(userName) {
        this.show();
        this.setPose('waving');
        this.showSpeech(`${userName}! The God of Thunder welcomes your return to Olympus. Let us forge financial glory together!`, "Welcome Back");
        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 5000);
    }

    smite() {
        this.show();
        this.setPose('lightning');
        this.showSpeech("By the power of Mount Olympus! Your data shall be transformed!", "Divine Power!");
    }
}

// Initialize Zeus
let zeusAvatar = null;

// Make Zeus globally available
window.initZeusAvatar = function() {
    if (!zeusAvatar) {
        zeusAvatar = new ZeusAvatar();
    }
    return zeusAvatar;
};

window.zeusAvatar = {
    show: () => { if (!zeusAvatar) zeusAvatar = new ZeusAvatar(); zeusAvatar.show(); },
    hide: () => zeusAvatar?.hide(),
    welcomeBack: (name) => { if (!zeusAvatar) zeusAvatar = new ZeusAvatar(); zeusAvatar.welcomeBack(name); },
    smite: () => { if (!zeusAvatar) zeusAvatar = new ZeusAvatar(); zeusAvatar.smite(); },
    showSpeech: (text, title) => { if (!zeusAvatar) zeusAvatar = new ZeusAvatar(); zeusAvatar.showSpeech(text, title); },
    setPose: (pose) => zeusAvatar?.setPose(pose)
};

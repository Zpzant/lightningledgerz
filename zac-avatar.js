// =====================================================
// LIGHTNING LEDGERZ - ZAC AVATAR SYSTEM
// Premium 3D Fortnite/Metal Gear/Hogwarts style
// Black suit, red tie, popped collar, slick hair
// =====================================================

class ZacAvatar {
    constructor() {
        this.container = null;
        this.speechBubble = null;
        this.currentPose = 'standing';
        this.isVisible = false;
        this.walkthroughStep = 0;
        this.walkthroughMessages = [
            { text: "Welcome to Lightning Ledgerz! I'm Zac, your financial strategist.", pose: "waving", title: "Lord of Lightning" },
            { text: "I'll help you transform complex financial data into crystal-clear insights.", pose: "pointing", title: "Your Guide" },
            { text: "Upload your documents - PDFs, Excel, PowerPoints - and watch the magic happen.", pose: "standing", title: "Data Wizard" },
            { text: "Check out our packages - from startup essentials to enterprise-grade analytics.", pose: "pointing", title: "Solutions Expert" },
            { text: "Generate McKinsey-quality reports with a single click. AI-powered brilliance.", pose: "thumbsup", title: "Report Master" },
            { text: "Ready to supercharge your business? Let's get started!", pose: "waving", title: "Let's Go!" }
        ];
        this.init();
    }

    init() {
        this.createAvatarContainer();
        this.createSpeechBubble();
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes speechFadeIn {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes zacIdle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            @keyframes zacBlink {
                0%, 42%, 44%, 100% { transform: scaleY(1); }
                43% { transform: scaleY(0.1); }
            }
            @keyframes waveHand {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(15deg); }
                75% { transform: rotate(-10deg); }
            }
            @keyframes tieWave {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(2deg); }
            }
            @keyframes glowPulse {
                0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 51, 51, 0.3)); }
                50% { filter: drop-shadow(0 0 20px rgba(255, 51, 51, 0.6)); }
            }
            #zac-avatar-container {
                animation: zacIdle 4s ease-in-out infinite;
            }
            .zac-eye-group {
                animation: zacBlink 5s ease-in-out infinite;
                transform-origin: center;
            }
            .zac-wave-arm {
                animation: waveHand 0.8s ease-in-out infinite;
                transform-origin: 100px 130px;
            }
            .zac-tie {
                animation: tieWave 3s ease-in-out infinite;
                transform-origin: top center;
            }
            #zac-avatar {
                animation: glowPulse 3s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    createAvatarContainer() {
        this.container = document.createElement('div');
        this.container.id = 'zac-avatar-container';
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
        avatar.id = 'zac-avatar';
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
            if (this.walkthroughStep < this.walkthroughMessages.length) {
                this.nextWalkthroughStep();
            } else {
                this.toggleSpeech();
            }
        });

        this.container.appendChild(avatar);
        document.body.appendChild(this.container);
    }

    createSpeechBubble() {
        this.speechBubble = document.createElement('div');
        this.speechBubble.id = 'zac-speech-bubble';
        this.speechBubble.style.cssText = `
            background: linear-gradient(145deg, rgba(15, 15, 15, 0.98), rgba(30, 30, 30, 0.98));
            border: 2px solid #ff3333;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 340px;
            color: #fff;
            font-size: 15px;
            line-height: 1.6;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 51, 51, 0.15), inset 0 1px 0 rgba(255,255,255,0.1);
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
            border-top: 14px solid #ff3333;
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
            color: #ff3333;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            transition: transform 0.2s;
        `;
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.transform = 'scale(1.2)');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.transform = 'scale(1)');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideSpeech();
        });
        this.speechBubble.appendChild(closeBtn);

        const titleEl = document.createElement('div');
        titleEl.id = 'zac-speech-title';
        titleEl.style.cssText = `
            color: #ff3333;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
        `;
        this.speechBubble.appendChild(titleEl);

        const textContainer = document.createElement('div');
        textContainer.id = 'zac-speech-text';
        textContainer.style.cssText = `padding-right: 20px; font-size: 15px;`;
        this.speechBubble.appendChild(textContainer);

        const continueHint = document.createElement('div');
        continueHint.id = 'zac-continue-hint';
        continueHint.style.cssText = `
            margin-top: 15px;
            font-size: 11px;
            color: #ff6666;
            text-align: right;
            opacity: 0.8;
        `;
        continueHint.textContent = 'Click Zac to continue →';
        this.speechBubble.appendChild(continueHint);

        this.container.insertBefore(this.speechBubble, this.container.firstChild);
    }

    getAvatarSVG(pose) {
        const isWaving = pose === 'waving';
        const isPointing = pose === 'pointing';
        const isThumbsUp = pose === 'thumbsup';

        return `
        <svg viewBox="0 0 160 320" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Premium skin tones -->
                <linearGradient id="skinPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#fce4d6"/>
                    <stop offset="40%" style="stop-color:#f5d0b5"/>
                    <stop offset="100%" style="stop-color:#e8b89d"/>
                </linearGradient>
                <linearGradient id="skinShadowPremium" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#e8b89d"/>
                    <stop offset="100%" style="stop-color:#d4a084"/>
                </linearGradient>

                <!-- Slick black hair -->
                <linearGradient id="hairSlick" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a"/>
                    <stop offset="30%" style="stop-color:#0d0d0d"/>
                    <stop offset="70%" style="stop-color:#1a1a1a"/>
                    <stop offset="100%" style="stop-color:#0d0d0d"/>
                </linearGradient>
                <linearGradient id="hairShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#333"/>
                    <stop offset="50%" style="stop-color:#1a1a1a"/>
                    <stop offset="100%" style="stop-color:#0d0d0d"/>
                </linearGradient>

                <!-- Premium black suit -->
                <linearGradient id="suitPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a"/>
                    <stop offset="50%" style="stop-color:#0f0f0f"/>
                    <stop offset="100%" style="stop-color:#050505"/>
                </linearGradient>
                <linearGradient id="suitShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a2a2a"/>
                    <stop offset="100%" style="stop-color:#0a0a0a"/>
                </linearGradient>

                <!-- Crisp white shirt -->
                <linearGradient id="shirtCrisp" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#f0f0f0"/>
                </linearGradient>

                <!-- Power red tie -->
                <linearGradient id="tiePower" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4444"/>
                    <stop offset="50%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#cc0000"/>
                </linearGradient>
                <linearGradient id="tieShine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ff6666"/>
                    <stop offset="50%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#cc0000"/>
                </linearGradient>

                <!-- Premium pants -->
                <linearGradient id="pantsPremium" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#151515"/>
                    <stop offset="50%" style="stop-color:#1a1a1a"/>
                    <stop offset="100%" style="stop-color:#101010"/>
                </linearGradient>

                <!-- Polished shoes -->
                <linearGradient id="shoesPolish" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a"/>
                    <stop offset="50%" style="stop-color:#0d0d0d"/>
                    <stop offset="100%" style="stop-color:#000000"/>
                </linearGradient>
                <linearGradient id="shoeShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#333"/>
                    <stop offset="100%" style="stop-color:#0d0d0d"/>
                </linearGradient>

                <!-- Eye details -->
                <radialGradient id="eyeWhitePremium" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#f5f5f5"/>
                </radialGradient>
                <radialGradient id="irisPremium" cx="35%" cy="35%" r="60%">
                    <stop offset="0%" style="stop-color:#5a7d3a"/>
                    <stop offset="60%" style="stop-color:#3d5229"/>
                    <stop offset="100%" style="stop-color:#2a3d1c"/>
                </radialGradient>

                <!-- Shadow filters -->
                <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/>
                </filter>
                <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
                <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feFlood flood-color="#ff3333" flood-opacity="0.5"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- LEGS -->
            <path d="M 58 200 L 52 270 Q 50 280 55 282 L 72 282 Q 78 280 76 270 L 68 200"
                fill="url(#pantsPremium)" filter="url(#subtleShadow)"/>
            <path d="M 92 200 L 84 270 Q 82 280 87 282 L 105 282 Q 111 280 108 270 L 102 200"
                fill="url(#pantsPremium)" filter="url(#subtleShadow)"/>

            <!-- SHOES - polished oxfords -->
            <ellipse cx="63" cy="290" rx="20" ry="10" fill="url(#shoesPolish)" filter="url(#subtleShadow)"/>
            <ellipse cx="63" cy="288" rx="17" ry="7" fill="url(#shoeShine)"/>
            <ellipse cx="58" cy="286" rx="4" ry="2" fill="#444" opacity="0.5"/>

            <ellipse cx="97" cy="290" rx="20" ry="10" fill="url(#shoesPolish)" filter="url(#subtleShadow)"/>
            <ellipse cx="97" cy="288" rx="17" ry="7" fill="url(#shoeShine)"/>
            <ellipse cx="92" cy="286" rx="4" ry="2" fill="#444" opacity="0.5"/>

            <!-- TORSO - fitted suit jacket -->
            <path d="M 45 105
                     Q 38 115 38 135
                     L 42 200
                     L 118 200
                     L 122 135
                     Q 122 115 115 105
                     L 108 98 L 52 98 Z"
                fill="url(#suitPremium)" filter="url(#premiumShadow)"/>

            <!-- Suit jacket details - lapels with popped collar effect -->
            <path d="M 60 98 L 52 135 L 60 142 L 68 105 Z" fill="url(#suitShine)"/>
            <path d="M 100 98 L 108 135 L 100 142 L 92 105 Z" fill="url(#suitShine)"/>

            <!-- Popped collar -->
            <path d="M 52 98 L 58 88 L 68 95 L 80 88 L 92 95 L 102 88 L 108 98 L 100 105 L 80 92 L 60 105 Z"
                fill="#fff" stroke="#eee" stroke-width="1"/>

            <!-- White dress shirt visible -->
            <path d="M 68 98 L 64 150 L 80 165 L 96 150 L 92 98 Z" fill="url(#shirtCrisp)"/>

            <!-- POWER TIE - red silk -->
            <g class="zac-tie">
                <path d="M 74 95 L 80 175 L 86 95 L 82 92 L 80 95 L 78 92 Z" fill="url(#tiePower)" filter="url(#glowRed)"/>
                <path d="M 76 92 L 80 98 L 84 92 L 82 90 L 80 92 L 78 90 Z" fill="url(#tieShine)"/>
                <!-- Tie texture lines -->
                <line x1="78" y1="100" x2="82" y2="100" stroke="#cc0000" stroke-width="0.5" opacity="0.5"/>
                <line x1="77.5" y1="120" x2="82.5" y2="120" stroke="#cc0000" stroke-width="0.5" opacity="0.5"/>
                <line x1="77" y1="140" x2="83" y2="140" stroke="#cc0000" stroke-width="0.5" opacity="0.5"/>
            </g>

            <!-- Suit buttons - gold -->
            <circle cx="80" cy="155" r="4" fill="#d4af37" stroke="#b8960c" stroke-width="1"/>
            <circle cx="80" cy="172" r="4" fill="#d4af37" stroke="#b8960c" stroke-width="1"/>

            <!-- Pocket square - red accent -->
            <path d="M 50 120 L 48 132 L 58 130 Z" fill="#ff3333" opacity="0.9"/>

            <!-- LEFT ARM -->
            <g>
                <path d="M 45 105 Q 28 120 25 150 L 32 153 Q 34 125 47 112"
                    fill="url(#suitPremium)" filter="url(#subtleShadow)"/>
                <path d="M 25 150 Q 20 175 22 195 L 32 198 Q 32 178 32 153"
                    fill="url(#suitPremium)"/>
                <!-- Cuff -->
                <rect x="20" y="190" width="15" height="8" rx="2" fill="#fff"/>
                <!-- Hand -->
                <g transform="translate(18, 195)">
                    <ellipse cx="10" cy="10" rx="12" ry="14" fill="url(#skinPremium)"/>
                    <ellipse cx="22" cy="6" rx="5" ry="7" fill="url(#skinPremium)" transform="rotate(25, 22, 6)"/>
                    <rect x="3" y="22" width="5" height="16" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="9" y="22" width="5" height="18" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="15" y="22" width="5" height="17" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="21" y="20" width="4" height="14" rx="2" fill="url(#skinPremium)"/>
                </g>
            </g>

            <!-- RIGHT ARM (pose-dependent) -->
            ${isWaving ? `
            <g class="zac-wave-arm">
                <path d="M 115 105 Q 135 95 145 70 L 138 66 Q 130 88 117 100"
                    fill="url(#suitPremium)" filter="url(#subtleShadow)"/>
                <path d="M 145 70 Q 155 45 158 25 L 150 22 Q 148 42 138 66"
                    fill="url(#suitPremium)"/>
                <rect x="148" y="18" width="12" height="6" rx="2" fill="#fff" transform="rotate(-15, 154, 21)"/>
                <g transform="translate(148, 8) rotate(-15)">
                    <ellipse cx="10" cy="12" rx="12" ry="14" fill="url(#skinPremium)"/>
                    <rect x="2" y="-8" width="5" height="16" rx="2.5" fill="url(#skinPremium)" transform="rotate(-10, 4, 0)"/>
                    <rect x="8" y="-10" width="5" height="18" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="14" y="-9" width="5" height="17" rx="2.5" fill="url(#skinPremium)" transform="rotate(8, 16, 0)"/>
                    <rect x="20" y="-6" width="4" height="14" rx="2" fill="url(#skinPremium)" transform="rotate(15, 22, 0)"/>
                    <ellipse cx="0" cy="10" rx="5" ry="7" fill="url(#skinPremium)" transform="rotate(-25, 0, 10)"/>
                </g>
            </g>
            ` : isPointing ? `
            <g>
                <path d="M 115 105 Q 140 100 155 95 L 153 88 Q 138 92 117 98"
                    fill="url(#suitPremium)" filter="url(#subtleShadow)"/>
                <path d="M 155 95 Q 175 90 190 85 L 188 78 Q 173 82 153 88"
                    fill="url(#suitPremium)"/>
                <rect x="183" y="75" width="10" height="5" rx="2" fill="#fff"/>
                <g transform="translate(188, 72)">
                    <ellipse cx="8" cy="12" rx="11" ry="13" fill="url(#skinPremium)"/>
                    <rect x="12" y="-8" width="5" height="26" rx="2.5" fill="url(#skinPremium)"/>
                    <ellipse cx="2" cy="22" rx="5" ry="7" fill="url(#skinShadowPremium)"/>
                    <ellipse cx="8" cy="24" rx="4" ry="6" fill="url(#skinShadowPremium)"/>
                    <ellipse cx="14" cy="23" rx="3.5" ry="5.5" fill="url(#skinShadowPremium)"/>
                    <ellipse cx="-2" cy="10" rx="5" ry="6" fill="url(#skinPremium)" transform="rotate(-15, -2, 10)"/>
                </g>
            </g>
            ` : isThumbsUp ? `
            <g>
                <path d="M 115 105 Q 128 92 132 75 L 125 72 Q 122 88 115 100"
                    fill="url(#suitPremium)" filter="url(#subtleShadow)"/>
                <path d="M 132 75 Q 136 55 136 40 L 128 38 Q 130 54 125 72"
                    fill="url(#suitPremium)"/>
                <rect x="125" y="34" width="12" height="5" rx="2" fill="#fff"/>
                <g transform="translate(120, 18)">
                    <ellipse cx="12" cy="20" rx="12" ry="14" fill="url(#skinPremium)"/>
                    <ellipse cx="6" cy="32" rx="10" ry="6" fill="url(#skinShadowPremium)"/>
                    <rect x="14" y="-8" width="8" height="26" rx="4" fill="url(#skinPremium)"/>
                    <ellipse cx="18" cy="-10" rx="4.5" ry="5" fill="url(#skinPremium)"/>
                </g>
            </g>
            ` : `
            <g>
                <path d="M 115 105 Q 132 120 135 150 L 128 153 Q 126 125 113 112"
                    fill="url(#suitPremium)" filter="url(#subtleShadow)"/>
                <path d="M 135 150 Q 140 175 138 195 L 128 198 Q 128 178 128 153"
                    fill="url(#suitPremium)"/>
                <rect x="125" y="190" width="15" height="8" rx="2" fill="#fff"/>
                <g transform="translate(122, 195)">
                    <ellipse cx="10" cy="10" rx="12" ry="14" fill="url(#skinPremium)"/>
                    <ellipse cx="-2" cy="6" rx="5" ry="7" fill="url(#skinPremium)" transform="rotate(-25, -2, 6)"/>
                    <rect x="3" y="22" width="5" height="16" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="9" y="22" width="5" height="18" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="15" y="22" width="5" height="17" rx="2.5" fill="url(#skinPremium)"/>
                    <rect x="21" y="20" width="4" height="14" rx="2" fill="url(#skinPremium)"/>
                </g>
            </g>
            `}

            <!-- NECK -->
            <path d="M 68 95 Q 68 82 70 78 L 90 78 Q 92 82 92 95" fill="url(#skinPremium)"/>

            <!-- HEAD -->
            <ellipse cx="80" cy="52" rx="35" ry="40" fill="url(#skinPremium)" filter="url(#premiumShadow)"/>

            <!-- Ears -->
            <ellipse cx="45" cy="55" rx="6" ry="10" fill="url(#skinShadowPremium)"/>
            <ellipse cx="46" cy="55" rx="4" ry="7" fill="url(#skinPremium)"/>
            <ellipse cx="115" cy="55" rx="6" ry="10" fill="url(#skinShadowPremium)"/>
            <ellipse cx="114" cy="55" rx="4" ry="7" fill="url(#skinPremium)"/>

            <!-- SLICK HAIR - swept back style -->
            <path d="M 45 48
                     Q 45 22 55 12
                     Q 70 2 80 2
                     Q 90 2 105 12
                     Q 115 22 115 48
                     Q 112 35 100 32
                     Q 85 28 80 28
                     Q 75 28 60 32
                     Q 48 35 45 48"
                fill="url(#hairSlick)"/>

            <!-- Hair shine/highlights -->
            <path d="M 55 20 Q 70 10 95 18" stroke="url(#hairShine)" stroke-width="4" fill="none" opacity="0.6"/>
            <path d="M 50 30 Q 65 22 90 28" stroke="#333" stroke-width="2" fill="none" opacity="0.4"/>

            <!-- Side hair -->
            <path d="M 45 48 Q 40 42 42 30 Q 48 35 52 42 Z" fill="url(#hairSlick)"/>
            <path d="M 115 48 Q 120 42 118 30 Q 112 35 108 42 Z" fill="url(#hairSlick)"/>

            <!-- FACE -->
            <!-- Eyebrows - strong, groomed -->
            <path d="M 55 38 Q 63 33 72 38" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 88 38 Q 97 33 105 38" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>

            <!-- Eyes -->
            <g class="zac-eye-group">
                <ellipse cx="63" cy="50" rx="11" ry="8" fill="url(#eyeWhitePremium)"/>
                <ellipse cx="64" cy="50" rx="6" ry="6" fill="url(#irisPremium)"/>
                <circle cx="64" cy="50" r="3" fill="#1a1a1a"/>
                <circle cx="66" cy="48" r="2" fill="#fff"/>
                <circle cx="62" cy="52" r="1" fill="#fff" opacity="0.5"/>
            </g>
            <g class="zac-eye-group">
                <ellipse cx="97" cy="50" rx="11" ry="8" fill="url(#eyeWhitePremium)"/>
                <ellipse cx="96" cy="50" rx="6" ry="6" fill="url(#irisPremium)"/>
                <circle cx="96" cy="50" r="3" fill="#1a1a1a"/>
                <circle cx="98" cy="48" r="2" fill="#fff"/>
                <circle cx="94" cy="52" r="1" fill="#fff" opacity="0.5"/>
            </g>

            <!-- Nose - refined -->
            <path d="M 80 50 Q 83 60 80 68 Q 76 70 74 67"
                stroke="url(#skinShadowPremium)" stroke-width="2.5" fill="none" stroke-linecap="round"/>

            <!-- Mouth -->
            ${pose === 'thumbsup' ? `
                <path d="M 65 78 Q 80 92 95 78" stroke="#a04040" stroke-width="2" fill="none"/>
                <path d="M 68 78 Q 80 88 92 78" fill="#fff"/>
            ` : `
                <path d="M 68 78 Q 80 88 92 78" stroke="#a04040" stroke-width="3" fill="none" stroke-linecap="round"/>
            `}

            <!-- Cheek highlights -->
            <ellipse cx="55" cy="65" rx="8" ry="5" fill="#f5c4b8" opacity="0.3"/>
            <ellipse cx="105" cy="65" rx="8" ry="5" fill="#f5c4b8" opacity="0.3"/>

            <!-- Jawline -->
            <path d="M 48 62 Q 52 82 80 92 Q 108 82 112 62"
                stroke="url(#skinShadowPremium)" stroke-width="1.5" fill="none" opacity="0.2"/>

            <!-- Watch on left wrist -->
            <rect x="18" y="188" width="18" height="12" rx="3" fill="#1a1a1a" stroke="#d4af37" stroke-width="1"/>
            <rect x="21" y="190" width="12" height="8" rx="1" fill="#111"/>
            <circle cx="27" cy="194" r="3" fill="none" stroke="#ff3333" stroke-width="0.5"/>
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
        const textEl = document.getElementById('zac-speech-text');
        const titleEl = document.getElementById('zac-speech-title');
        if (textEl) textEl.textContent = text;
        if (titleEl) titleEl.textContent = title;
        this.speechBubble.style.display = 'block';
    }

    hideSpeech() {
        this.speechBubble.style.display = 'none';
    }

    toggleSpeech() {
        if (this.speechBubble.style.display === 'none') {
            this.showSpeech("Need help? I'm here to guide you through your financial journey.", "Zac - Your Guide");
        } else {
            this.hideSpeech();
        }
    }

    setPose(pose) {
        this.currentPose = pose;
        const avatar = document.getElementById('zac-avatar');
        if (avatar) {
            avatar.innerHTML = this.getAvatarSVG(pose);
        }
    }

    startWalkthrough() {
        this.walkthroughStep = 0;
        this.show();
        this.nextWalkthroughStep();
    }

    nextWalkthroughStep() {
        if (this.walkthroughStep >= this.walkthroughMessages.length) {
            const hint = document.getElementById('zac-continue-hint');
            if (hint) hint.textContent = 'Click Zac anytime for assistance';
            this.showSpeech("Ready when you are! Click me anytime you need guidance.", "At Your Service");
            this.setPose('thumbsup');
            return;
        }

        const step = this.walkthroughMessages[this.walkthroughStep];
        this.setPose(step.pose);
        this.showSpeech(step.text, step.title);
        this.walkthroughStep++;

        const hint = document.getElementById('zac-continue-hint');
        if (hint) {
            if (this.walkthroughStep >= this.walkthroughMessages.length) {
                hint.textContent = 'Click to finish →';
            } else {
                hint.textContent = `${this.walkthroughStep}/${this.walkthroughMessages.length} - Click to continue →`;
            }
        }
    }

    welcomeBack(userName) {
        this.show();
        this.setPose('waving');
        this.showSpeech(`Hi, ${userName}! Great to have you back. Let's make some financial magic happen.`, "Welcome Back");

        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 5000);
    }

    celebrateUpload() {
        this.show();
        this.setPose('thumbsup');
        this.showSpeech("Excellent! Your files are uploaded. I'm analyzing the data now.", "Processing");

        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 4000);
    }

    suggestUpgrade(currentTier) {
        this.show();
        this.setPose('pointing');
        const messages = {
            basic: "Ready for AI-powered insights? Gold members get automated PowerPoint generation!",
            gold: "Take it to the next level! Diamond includes QuickBooks integration.",
            trial: "Loving the trial? Upgrade now to keep your data and unlock all features!"
        };
        this.showSpeech(messages[currentTier] || messages.trial, "Upgrade Available");
    }
}

// Initialize Zac
let zacAvatar = null;

document.addEventListener('DOMContentLoaded', () => {
    zacAvatar = new ZacAvatar();

    const hasSeenWalkthrough = localStorage.getItem('zac_walkthrough_seen');

    if (!hasSeenWalkthrough) {
        setTimeout(() => {
            zacAvatar.startWalkthrough();
            localStorage.setItem('zac_walkthrough_seen', 'true');
        }, 2500);
    } else {
        // Always show Zac on the homepage after walkthrough is seen
        setTimeout(() => {
            zacAvatar.show();
            zacAvatar.speak("Welcome back! Click me if you need help.", "Ready to assist!");
        }, 1500);
    }
});

// Make Zac globally available
window.zacAvatar = {
    show: () => zacAvatar?.show(),
    hide: () => zacAvatar?.hide(),
    welcomeBack: (name) => zacAvatar?.welcomeBack(name),
    celebrateUpload: () => zacAvatar?.celebrateUpload(),
    startWalkthrough: () => zacAvatar?.startWalkthrough(),
    suggestUpgrade: (tier) => zacAvatar?.suggestUpgrade(tier)
};

// =====================================================
// LIGHTNING LEDGERZ - ZAC AVATAR SYSTEM
// Realistic Bitmoji/Fortnite/Hogwarts Mystery style
// Human proportions, real hands, spiky hair
// =====================================================

class ZacAvatar {
    constructor() {
        this.container = null;
        this.speechBubble = null;
        this.currentPose = 'standing';
        this.isVisible = false;
        this.walkthroughStep = 0;
        this.walkthroughMessages = [
            { text: "Hey there! I'm Zac, your financial guide at Lightning Ledgerz!", pose: "waving" },
            { text: "Let me show you around! We've got powerful tools to supercharge your finances.", pose: "pointing" },
            { text: "Upload your financial documents - PDFs, Excel files, PowerPoints - I'll help analyze them.", pose: "standing" },
            { text: "Check out our packages below - from Basic budgeting to Diamond-tier QuickBooks integration!", pose: "pointing" },
            { text: "Create your own avatar, track spending, and generate professional reports.", pose: "thumbsup" },
            { text: "Ready to get started? Sign up and let's transform your financial game!", pose: "waving" }
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
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes zacBreathe {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(1.02); }
            }
            @keyframes zacBlink {
                0%, 45%, 55%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.1); }
            }
            @keyframes waveHand {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(20deg); }
                75% { transform: rotate(-10deg); }
            }
            @keyframes floatAvatar {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }
            #zac-avatar-container {
                animation: floatAvatar 3s ease-in-out infinite;
            }
            .zac-eye {
                animation: zacBlink 4s ease-in-out infinite;
                transform-origin: center;
            }
            .zac-wave-arm {
                animation: waveHand 0.6s ease-in-out infinite;
                transform-origin: 85px 120px;
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
            gap: 10px;
        `;

        const avatar = document.createElement('div');
        avatar.id = 'zac-avatar';
        avatar.innerHTML = this.getAvatarSVG('standing');
        avatar.style.cssText = `
            width: 140px;
            height: 280px;
            cursor: pointer;
            transition: transform 0.3s ease;
            filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4));
        `;

        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.05)';
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
            background: linear-gradient(135deg, rgba(20, 20, 20, 0.98), rgba(40, 40, 40, 0.98));
            border: 2px solid #ff3333;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 320px;
            color: #fff;
            font-size: 15px;
            line-height: 1.6;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 51, 51, 0.2);
            position: relative;
            display: none;
            animation: speechFadeIn 0.3s ease;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -12px;
            right: 40px;
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 12px solid #ff3333;
        `;
        this.speechBubble.appendChild(arrow);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            background: none;
            border: none;
            color: #ff3333;
            font-size: 22px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideSpeech();
        });
        this.speechBubble.appendChild(closeBtn);

        const textContainer = document.createElement('div');
        textContainer.id = 'zac-speech-text';
        textContainer.style.cssText = `padding-right: 15px;`;
        this.speechBubble.appendChild(textContainer);

        const continueHint = document.createElement('div');
        continueHint.id = 'zac-continue-hint';
        continueHint.style.cssText = `
            margin-top: 15px;
            font-size: 12px;
            color: #ff6666;
            text-align: right;
            opacity: 0.8;
        `;
        continueHint.textContent = 'Click Zac to continue →';
        this.speechBubble.appendChild(continueHint);

        this.container.insertBefore(this.speechBubble, this.container.firstChild);
    }

    getAvatarSVG(pose) {
        // Realistic human proportions (8 heads tall concept scaled down)
        // Bitmoji/Fortnite/Hogwarts Mystery style
        const isWaving = pose === 'waving';
        const isPointing = pose === 'pointing';
        const isThumbsUp = pose === 'thumbsup';

        return `
        <svg viewBox="0 0 140 280" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Skin gradients for 3D effect -->
                <linearGradient id="skinMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f5d0b5"/>
                    <stop offset="50%" style="stop-color:#e8b89d"/>
                    <stop offset="100%" style="stop-color:#d4a084"/>
                </linearGradient>
                <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#d4a084"/>
                    <stop offset="100%" style="stop-color:#c9956c"/>
                </linearGradient>

                <!-- Hair gradient - dark brown with highlights -->
                <linearGradient id="hairMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a3728"/>
                    <stop offset="30%" style="stop-color:#3d2d20"/>
                    <stop offset="100%" style="stop-color:#2a1f15"/>
                </linearGradient>
                <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#6b5344"/>
                    <stop offset="100%" style="stop-color:#4a3728"/>
                </linearGradient>

                <!-- Suit gradients -->
                <linearGradient id="suitMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2d2d2d"/>
                    <stop offset="100%" style="stop-color:#1a1a1a"/>
                </linearGradient>
                <linearGradient id="suitHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#3d3d3d"/>
                    <stop offset="50%" style="stop-color:#2d2d2d"/>
                    <stop offset="100%" style="stop-color:#1a1a1a"/>
                </linearGradient>

                <!-- Shirt -->
                <linearGradient id="shirtMain" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#e8e8e8"/>
                </linearGradient>

                <!-- Tie - Lightning red -->
                <linearGradient id="tieMain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4444"/>
                    <stop offset="50%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#cc2222"/>
                </linearGradient>

                <!-- Pants -->
                <linearGradient id="pantsMain" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#252525"/>
                    <stop offset="50%" style="stop-color:#2a2a2a"/>
                    <stop offset="100%" style="stop-color:#1f1f1f"/>
                </linearGradient>

                <!-- Shoes -->
                <linearGradient id="shoeMain" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a2a2a"/>
                    <stop offset="100%" style="stop-color:#151515"/>
                </linearGradient>

                <!-- Eye whites -->
                <radialGradient id="eyeWhite" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#f0f0f0"/>
                </radialGradient>

                <!-- Iris -->
                <radialGradient id="irisColor" cx="40%" cy="40%" r="50%">
                    <stop offset="0%" style="stop-color:#6b8e4e"/>
                    <stop offset="100%" style="stop-color:#3d5229"/>
                </radialGradient>

                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                </filter>
            </defs>

            <!-- LEGS & FEET -->
            <!-- Left leg -->
            <path d="M 52 175 L 48 230 L 45 245 Q 44 252 50 252 L 62 252 Q 68 252 68 248 L 65 230 L 60 175"
                fill="url(#pantsMain)" filter="url(#softShadow)"/>
            <!-- Right leg -->
            <path d="M 80 175 L 75 230 L 72 245 Q 71 252 77 252 L 90 252 Q 96 252 96 248 L 95 230 L 88 175"
                fill="url(#pantsMain)" filter="url(#softShadow)"/>

            <!-- Left shoe -->
            <ellipse cx="54" cy="258" rx="16" ry="8" fill="url(#shoeMain)"/>
            <ellipse cx="54" cy="256" rx="14" ry="6" fill="#333"/>
            <!-- Right shoe -->
            <ellipse cx="86" cy="258" rx="16" ry="8" fill="url(#shoeMain)"/>
            <ellipse cx="86" cy="256" rx="14" ry="6" fill="#333"/>

            <!-- TORSO -->
            <!-- Main suit jacket -->
            <path d="M 40 95
                     Q 35 100 35 115
                     L 38 175
                     L 102 175
                     L 105 115
                     Q 105 100 100 95
                     L 95 90 L 45 90 Z"
                fill="url(#suitMain)" filter="url(#softShadow)"/>

            <!-- Suit lapels -->
            <path d="M 55 90 L 50 115 L 55 120 L 60 95 Z" fill="url(#suitHighlight)"/>
            <path d="M 85 90 L 90 115 L 85 120 L 80 95 Z" fill="url(#suitHighlight)"/>

            <!-- Shirt visible -->
            <path d="M 60 90 L 57 130 L 70 140 L 83 130 L 80 90 Z" fill="url(#shirtMain)"/>

            <!-- Collar -->
            <path d="M 55 90 L 60 85 L 70 92 L 80 85 L 85 90 L 80 95 L 70 88 L 60 95 Z" fill="#fff"/>

            <!-- Tie -->
            <path d="M 65 92 L 70 150 L 75 92 L 72 90 L 70 92 L 68 90 Z" fill="url(#tieMain)"/>
            <path d="M 67 90 L 70 95 L 73 90 Z" fill="url(#tieMain)"/>

            <!-- Suit buttons -->
            <circle cx="70" cy="130" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
            <circle cx="70" cy="145" r="3" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>

            <!-- Lightning bolt lapel pin -->
            <g transform="translate(48, 105) scale(0.35)">
                <path d="M 15 0 L 8 15 L 14 15 L 3 30 L 20 12 L 14 12 Z" fill="#ff3333"/>
            </g>

            <!-- LEFT ARM (always down) -->
            <g>
                <!-- Upper arm -->
                <path d="M 40 95 Q 25 105 22 130 L 28 132 Q 30 110 42 100"
                    fill="url(#suitMain)" filter="url(#softShadow)"/>
                <!-- Forearm -->
                <path d="M 22 130 Q 18 150 20 165 L 28 167 Q 28 152 28 132"
                    fill="url(#suitMain)"/>
                <!-- Hand -->
                <g transform="translate(18, 165)">
                    <!-- Palm -->
                    <ellipse cx="8" cy="8" rx="10" ry="12" fill="url(#skinMain)"/>
                    <!-- Thumb -->
                    <ellipse cx="18" cy="5" rx="4" ry="6" fill="url(#skinMain)" transform="rotate(30, 18, 5)"/>
                    <!-- Fingers -->
                    <rect x="2" y="18" width="4" height="14" rx="2" fill="url(#skinMain)"/>
                    <rect x="7" y="18" width="4" height="16" rx="2" fill="url(#skinMain)"/>
                    <rect x="12" y="18" width="4" height="15" rx="2" fill="url(#skinMain)"/>
                    <rect x="17" y="16" width="3.5" height="12" rx="2" fill="url(#skinMain)"/>
                </g>
            </g>

            <!-- RIGHT ARM (pose-dependent) -->
            ${isWaving ? `
            <g class="zac-wave-arm">
                <!-- Upper arm raised -->
                <path d="M 100 95 Q 115 90 125 75 L 120 70 Q 112 82 102 90"
                    fill="url(#suitMain)" filter="url(#softShadow)"/>
                <!-- Forearm -->
                <path d="M 125 75 Q 135 55 140 40 L 133 38 Q 130 52 120 70"
                    fill="url(#suitMain)"/>
                <!-- Waving hand -->
                <g transform="translate(130, 25) rotate(-20)">
                    <ellipse cx="8" cy="10" rx="10" ry="12" fill="url(#skinMain)"/>
                    <!-- Spread fingers for wave -->
                    <rect x="0" y="-8" width="4" height="14" rx="2" fill="url(#skinMain)" transform="rotate(-15, 2, 0)"/>
                    <rect x="5" y="-10" width="4" height="16" rx="2" fill="url(#skinMain)"/>
                    <rect x="10" y="-9" width="4" height="15" rx="2" fill="url(#skinMain)" transform="rotate(10, 12, 0)"/>
                    <rect x="15" y="-6" width="3.5" height="12" rx="2" fill="url(#skinMain)" transform="rotate(20, 16, 0)"/>
                    <ellipse cx="0" cy="8" rx="4" ry="6" fill="url(#skinMain)" transform="rotate(-30, 0, 8)"/>
                </g>
            </g>
            ` : isPointing ? `
            <g>
                <!-- Upper arm extended -->
                <path d="M 100 95 Q 120 95 130 90 L 128 85 Q 118 88 102 90"
                    fill="url(#suitMain)" filter="url(#softShadow)"/>
                <!-- Forearm pointing -->
                <path d="M 130 90 Q 145 88 160 85 L 158 80 Q 143 82 128 85"
                    fill="url(#suitMain)"/>
                <!-- Pointing hand -->
                <g transform="translate(155, 75)">
                    <ellipse cx="5" cy="10" rx="9" ry="11" fill="url(#skinMain)"/>
                    <!-- Index finger pointing -->
                    <rect x="8" y="-5" width="4" height="22" rx="2" fill="url(#skinMain)"/>
                    <!-- Other fingers curled -->
                    <ellipse cx="0" cy="18" rx="4" ry="6" fill="url(#skinMain)"/>
                    <ellipse cx="5" cy="20" rx="3.5" ry="5" fill="url(#skinMain)"/>
                    <ellipse cx="10" cy="19" rx="3" ry="5" fill="url(#skinMain)"/>
                    <!-- Thumb -->
                    <ellipse cx="-3" cy="8" rx="4" ry="5" fill="url(#skinMain)" transform="rotate(-20, -3, 8)"/>
                </g>
            </g>
            ` : isThumbsUp ? `
            <g>
                <!-- Upper arm up -->
                <path d="M 100 95 Q 112 85 115 70 L 110 68 Q 108 80 100 90"
                    fill="url(#suitMain)" filter="url(#softShadow)"/>
                <!-- Forearm -->
                <path d="M 115 70 Q 118 55 118 45 L 112 44 Q 113 54 110 68"
                    fill="url(#suitMain)"/>
                <!-- Thumbs up hand -->
                <g transform="translate(105, 25)">
                    <!-- Fist -->
                    <ellipse cx="10" cy="18" rx="10" ry="12" fill="url(#skinMain)"/>
                    <!-- Curled fingers -->
                    <ellipse cx="5" cy="28" rx="8" ry="5" fill="url(#skinShadow)"/>
                    <!-- Thumb up! -->
                    <rect x="12" y="-8" width="7" height="22" rx="3.5" fill="url(#skinMain)"/>
                    <ellipse cx="15.5" cy="-8" rx="3.5" ry="4" fill="url(#skinMain)"/>
                </g>
            </g>
            ` : `
            <g>
                <!-- Upper arm -->
                <path d="M 100 95 Q 115 105 118 130 L 112 132 Q 110 110 98 100"
                    fill="url(#suitMain)" filter="url(#softShadow)"/>
                <!-- Forearm -->
                <path d="M 118 130 Q 122 150 120 165 L 112 167 Q 112 152 112 132"
                    fill="url(#suitMain)"/>
                <!-- Hand -->
                <g transform="translate(108, 165)">
                    <ellipse cx="8" cy="8" rx="10" ry="12" fill="url(#skinMain)"/>
                    <ellipse cx="-2" cy="5" rx="4" ry="6" fill="url(#skinMain)" transform="rotate(-30, -2, 5)"/>
                    <rect x="2" y="18" width="4" height="14" rx="2" fill="url(#skinMain)"/>
                    <rect x="7" y="18" width="4" height="16" rx="2" fill="url(#skinMain)"/>
                    <rect x="12" y="18" width="4" height="15" rx="2" fill="url(#skinMain)"/>
                    <rect x="17" y="16" width="3.5" height="12" rx="2" fill="url(#skinMain)"/>
                </g>
            </g>
            `}

            <!-- NECK -->
            <path d="M 60 85 Q 60 75 62 70 L 78 70 Q 80 75 80 85" fill="url(#skinMain)"/>

            <!-- HEAD -->
            <ellipse cx="70" cy="50" rx="30" ry="35" fill="url(#skinMain)" filter="url(#softShadow)"/>

            <!-- Ear left -->
            <ellipse cx="40" cy="52" rx="5" ry="8" fill="url(#skinShadow)"/>
            <ellipse cx="41" cy="52" rx="3" ry="5" fill="url(#skinMain)"/>

            <!-- Ear right -->
            <ellipse cx="100" cy="52" rx="5" ry="8" fill="url(#skinShadow)"/>
            <ellipse cx="99" cy="52" rx="3" ry="5" fill="url(#skinMain)"/>

            <!-- SPIKY HAIR -->
            <!-- Base hair shape -->
            <path d="M 40 45
                     Q 40 25 50 18
                     Q 60 12 70 10
                     Q 80 12 90 18
                     Q 100 25 100 45
                     Q 98 35 90 35
                     Q 80 30 70 28
                     Q 60 30 50 35
                     Q 42 35 40 45"
                fill="url(#hairMain)"/>

            <!-- Spiky hair pieces -->
            <path d="M 45 30 L 40 8 L 50 25 Z" fill="url(#hairHighlight)"/>
            <path d="M 52 22 L 48 0 L 58 18 Z" fill="url(#hairMain)"/>
            <path d="M 60 18 L 60 -5 L 68 15 Z" fill="url(#hairHighlight)"/>
            <path d="M 70 15 L 72 -8 L 78 14 Z" fill="url(#hairMain)"/>
            <path d="M 80 18 L 85 -2 L 88 18 Z" fill="url(#hairHighlight)"/>
            <path d="M 88 25 L 98 5 L 95 28 Z" fill="url(#hairMain)"/>

            <!-- Hair sides -->
            <path d="M 40 45 Q 35 40 38 30 Q 42 35 45 40 Z" fill="url(#hairMain)"/>
            <path d="M 100 45 Q 105 40 102 30 Q 98 35 95 40 Z" fill="url(#hairMain)"/>

            <!-- FACE -->
            <!-- Eyebrows -->
            <path d="M 48 38 Q 55 34 62 38" stroke="#3d2d20" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M 78 38 Q 85 34 92 38" stroke="#3d2d20" stroke-width="2.5" fill="none" stroke-linecap="round"/>

            <!-- Eyes -->
            <g class="zac-eye">
                <!-- Left eye -->
                <ellipse cx="55" cy="48" rx="9" ry="7" fill="url(#eyeWhite)"/>
                <ellipse cx="56" cy="48" rx="5" ry="5" fill="url(#irisColor)"/>
                <circle cx="56" cy="48" r="2.5" fill="#1a1a1a"/>
                <circle cx="58" cy="46" r="1.5" fill="#fff"/>
            </g>
            <g class="zac-eye">
                <!-- Right eye -->
                <ellipse cx="85" cy="48" rx="9" ry="7" fill="url(#eyeWhite)"/>
                <ellipse cx="84" cy="48" rx="5" ry="5" fill="url(#irisColor)"/>
                <circle cx="84" cy="48" r="2.5" fill="#1a1a1a"/>
                <circle cx="86" cy="46" r="1.5" fill="#fff"/>
            </g>

            <!-- Nose -->
            <path d="M 70 48 Q 72 55 70 60 Q 67 62 65 60"
                stroke="url(#skinShadow)" stroke-width="2" fill="none" stroke-linecap="round"/>

            <!-- Mouth -->
            ${pose === 'thumbsup' ? `
                <!-- Big smile -->
                <path d="M 55 70 Q 70 82 85 70" stroke="#b35959" stroke-width="2" fill="none"/>
                <path d="M 58 70 Q 70 78 82 70" fill="#fff"/>
            ` : `
                <!-- Friendly smile -->
                <path d="M 58 70 Q 70 78 82 70" stroke="#b35959" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            `}

            <!-- Subtle cheek highlights -->
            <ellipse cx="48" cy="60" rx="6" ry="4" fill="#f0b8a8" opacity="0.4"/>
            <ellipse cx="92" cy="60" rx="6" ry="4" fill="#f0b8a8" opacity="0.4"/>

            <!-- Jawline definition -->
            <path d="M 42 60 Q 45 75 70 82 Q 95 75 98 60"
                stroke="url(#skinShadow)" stroke-width="1" fill="none" opacity="0.3"/>
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

    showSpeech(text) {
        const textEl = document.getElementById('zac-speech-text');
        if (textEl) {
            textEl.textContent = text;
        }
        this.speechBubble.style.display = 'block';
    }

    hideSpeech() {
        this.speechBubble.style.display = 'none';
    }

    toggleSpeech() {
        if (this.speechBubble.style.display === 'none') {
            this.showSpeech("Need help? Click any package to learn more, or sign up to get started!");
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
            if (hint) hint.textContent = 'Click Zac anytime for help!';
            this.showSpeech("That's the tour! I'll be here if you need me. Click me anytime!");
            this.setPose('thumbsup');
            return;
        }

        const step = this.walkthroughMessages[this.walkthroughStep];
        this.setPose(step.pose);
        this.showSpeech(step.text);
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
        this.showSpeech(`Hi, ${userName}! Great to see you back. Ready to tackle your finances?`);

        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 5000);
    }

    celebrateUpload() {
        this.show();
        this.setPose('thumbsup');
        this.showSpeech("Awesome! Your files are uploaded. I'm analyzing them now!");

        setTimeout(() => {
            this.hideSpeech();
            this.setPose('standing');
        }, 4000);
    }

    suggestUpgrade(currentTier) {
        this.show();
        this.setPose('pointing');
        const messages = {
            basic: "Hey! Want more features? Gold members get AI-powered PowerPoint reports!",
            gold: "You're doing great! Upgrade to Diamond for QuickBooks integration!"
        };
        this.showSpeech(messages[currentTier] || messages.basic);
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
        }, 2000);
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

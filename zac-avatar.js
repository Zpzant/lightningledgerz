// =====================================================
// LIGHTNING LEDGERZ - ZAC AVATAR SYSTEM
// 3D-style character like Boris from SparkChess/Fortnite
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
            { text: "Let me show you around! We've got some powerful tools to supercharge your finances.", pose: "pointing" },
            { text: "Upload your financial documents - PDFs, Excel files, even PowerPoints - and I'll help you make sense of them.", pose: "standing" },
            { text: "Check out our packages below - from Basic budgeting to Diamond-tier QuickBooks integration!", pose: "pointing" },
            { text: "Create your own avatar, track your spending, and generate professional reports.", pose: "thumbsup" },
            { text: "Ready to get started? Sign up and let's transform your financial game!", pose: "waving" }
        ];
        this.init();
    }

    init() {
        this.createAvatarContainer();
        this.createSpeechBubble();
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
            transition: all 0.3s ease;
        `;

        // Create the 3D-style avatar
        const avatar = document.createElement('div');
        avatar.id = 'zac-avatar';
        avatar.innerHTML = this.getAvatarSVG('standing');
        avatar.style.cssText = `
            width: 180px;
            height: 250px;
            cursor: pointer;
            transition: transform 0.3s ease;
            filter: drop-shadow(0 10px 30px rgba(255, 51, 51, 0.4));
        `;

        // Add hover effect
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.05)';
        });
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
        });

        // Click to continue walkthrough or toggle speech
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
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 30, 30, 0.95));
            border: 2px solid #ff3333;
            border-radius: 20px;
            padding: 20px 25px;
            max-width: 300px;
            color: #fff;
            font-size: 15px;
            line-height: 1.5;
            box-shadow: 0 10px 40px rgba(255, 51, 51, 0.3), 0 0 20px rgba(255, 51, 51, 0.1);
            position: relative;
            display: none;
            animation: speechFadeIn 0.3s ease;
        `;

        // Add speech bubble arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -10px;
            right: 30px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #ff3333;
        `;
        this.speechBubble.appendChild(arrow);

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            color: #ff3333;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        `;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideSpeech();
        });
        this.speechBubble.appendChild(closeBtn);

        // Add text container
        const textContainer = document.createElement('div');
        textContainer.id = 'zac-speech-text';
        this.speechBubble.appendChild(textContainer);

        // Add continue hint
        const continueHint = document.createElement('div');
        continueHint.id = 'zac-continue-hint';
        continueHint.style.cssText = `
            margin-top: 15px;
            font-size: 12px;
            color: #ff6666;
            text-align: right;
        `;
        continueHint.textContent = 'Click Zac to continue →';
        this.speechBubble.appendChild(continueHint);

        this.container.insertBefore(this.speechBubble, this.container.firstChild);

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes speechFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes zacBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes zacWave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(20deg); }
                75% { transform: rotate(-20deg); }
            }
        `;
        document.head.appendChild(style);
    }

    getAvatarSVG(pose) {
        // 3D-style character SVG - professional business look with Fortnite-esque style
        const poses = {
            standing: {
                leftArm: 'M 45 100 Q 30 130 35 160',
                rightArm: 'M 115 100 Q 130 130 125 160',
                expression: 'smile'
            },
            waving: {
                leftArm: 'M 45 100 Q 30 130 35 160',
                rightArm: 'M 115 100 Q 150 80 160 50',
                expression: 'smile'
            },
            pointing: {
                leftArm: 'M 45 100 Q 30 130 35 160',
                rightArm: 'M 115 100 Q 160 100 180 90',
                expression: 'focused'
            },
            thumbsup: {
                leftArm: 'M 45 100 Q 30 130 35 160',
                rightArm: 'M 115 100 Q 130 80 135 60',
                expression: 'excited'
            }
        };

        const p = poses[pose] || poses.standing;

        return `
        <svg viewBox="0 0 180 250" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradients for 3D effect -->
                <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#e8b89d"/>
                    <stop offset="100%" style="stop-color:#c9956c"/>
                </linearGradient>
                <linearGradient id="suitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a2a2a"/>
                    <stop offset="100%" style="stop-color:#1a1a1a"/>
                </linearGradient>
                <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#e0e0e0"/>
                </linearGradient>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3a2a1a"/>
                    <stop offset="100%" style="stop-color:#2a1a0a"/>
                </linearGradient>
                <linearGradient id="tieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#cc0000"/>
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
                </filter>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Body/Suit -->
            <path d="M 50 95 Q 40 130 45 200 L 60 200 L 65 150 L 80 200 L 100 200 L 95 150 L 100 200 L 120 200 Q 125 130 115 95 Z"
                fill="url(#suitGradient)" filter="url(#shadow)"/>

            <!-- Shirt/Collar -->
            <path d="M 60 95 L 80 120 L 100 95" fill="url(#shirtGradient)" stroke="#ddd" stroke-width="1"/>

            <!-- Tie -->
            <path d="M 75 95 L 80 140 L 85 95 Z" fill="url(#tieGradient)" filter="url(#glow)"/>

            <!-- Left Arm -->
            <path d="${p.leftArm}" stroke="url(#suitGradient)" stroke-width="20" stroke-linecap="round" fill="none" filter="url(#shadow)"/>
            <circle cx="${p.leftArm.includes('35 160') ? '35' : '35'}" cy="${p.leftArm.includes('35 160') ? '165' : '165'}" r="12" fill="url(#skinGradient)"/>

            <!-- Right Arm -->
            <path d="${p.rightArm}" stroke="url(#suitGradient)" stroke-width="20" stroke-linecap="round" fill="none" filter="url(#shadow)"
                ${pose === 'waving' ? 'style="animation: zacWave 0.5s ease infinite"' : ''}/>
            ${pose === 'thumbsup' ? `
                <g transform="translate(130, 50)">
                    <circle r="12" fill="url(#skinGradient)"/>
                    <ellipse cx="0" cy="-20" rx="6" ry="12" fill="url(#skinGradient)"/>
                </g>
            ` : `
                <circle cx="${pose === 'waving' ? '165' : pose === 'pointing' ? '185' : '125'}"
                    cy="${pose === 'waving' ? '45' : pose === 'pointing' ? '85' : '165'}"
                    r="12" fill="url(#skinGradient)"/>
            `}

            <!-- Head -->
            <ellipse cx="80" cy="55" rx="35" ry="40" fill="url(#skinGradient)" filter="url(#shadow)"/>

            <!-- Hair -->
            <path d="M 45 45 Q 50 15 80 10 Q 110 15 115 45 Q 115 35 100 35 Q 80 25 60 35 Q 45 35 45 45"
                fill="url(#hairGradient)"/>

            <!-- Eyes -->
            <g>
                <ellipse cx="65" cy="50" rx="8" ry="6" fill="#fff"/>
                <ellipse cx="95" cy="50" rx="8" ry="6" fill="#fff"/>
                <circle cx="67" cy="50" r="4" fill="#3a2a1a"/>
                <circle cx="97" cy="50" r="4" fill="#3a2a1a"/>
                <circle cx="68" cy="49" r="1.5" fill="#fff"/>
                <circle cx="98" cy="49" r="1.5" fill="#fff"/>
            </g>

            <!-- Eyebrows -->
            <path d="M 55 42 Q 65 38 75 42" stroke="#3a2a1a" stroke-width="2" fill="none"/>
            <path d="M 85 42 Q 95 38 105 42" stroke="#3a2a1a" stroke-width="2" fill="none"/>

            <!-- Nose -->
            <path d="M 80 50 Q 82 60 80 65 Q 78 65 76 62" stroke="#c9956c" stroke-width="2" fill="none"/>

            <!-- Mouth -->
            ${p.expression === 'smile' ? `
                <path d="M 65 75 Q 80 85 95 75" stroke="#cc6666" stroke-width="2" fill="none"/>
            ` : p.expression === 'excited' ? `
                <path d="M 65 72 Q 80 88 95 72" stroke="#cc6666" stroke-width="2" fill="#fff"/>
            ` : `
                <path d="M 70 75 Q 80 78 90 75" stroke="#cc6666" stroke-width="2" fill="none"/>
            `}

            <!-- Lightning bolt badge on lapel -->
            <g transform="translate(55, 105) scale(0.4)">
                <path d="M 20 0 L 10 20 L 18 20 L 5 40 L 25 15 L 17 15 Z" fill="#ff3333" filter="url(#glow)"/>
            </g>

            <!-- Feet/Shoes -->
            <ellipse cx="62" cy="210" rx="18" ry="8" fill="#1a1a1a"/>
            <ellipse cx="98" cy="210" rx="18" ry="8" fill="#1a1a1a"/>
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

    // Walkthrough functionality
    startWalkthrough() {
        this.walkthroughStep = 0;
        this.show();
        this.nextWalkthroughStep();
    }

    nextWalkthroughStep() {
        if (this.walkthroughStep >= this.walkthroughMessages.length) {
            // End of walkthrough
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

    // Quick messages for different scenarios
    welcomeBack(userName) {
        this.show();
        this.setPose('waving');
        this.showSpeech(`Hi, ${userName}! Great to see you back. Ready to tackle your finances?`);

        // Auto-hide after 5 seconds
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

    // Check if first visit (no user logged in)
    const hasSeenWalkthrough = localStorage.getItem('zac_walkthrough_seen');

    if (!hasSeenWalkthrough) {
        // Show Zac after a short delay
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

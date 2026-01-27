// =====================================================
// LIGHTNING LEDGERZ - ZAC AVATAR SYSTEM
// Flynn Rider-inspired Disney style
// Charming rogue in a sharp suit with red tie
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
            { text: "Generate Fortune-500 quality reports with a single click. AI-powered brilliance.", pose: "thumbsup", title: "Report Master" },
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
                50% { transform: translateY(-5px); }
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
                0%, 100% { filter: drop-shadow(0 0 15px rgba(255, 51, 51, 0.4)) drop-shadow(0 0 30px rgba(255, 51, 51, 0.2)); }
                50% { filter: drop-shadow(0 0 25px rgba(255, 51, 51, 0.7)) drop-shadow(0 0 50px rgba(255, 51, 51, 0.4)); }
            }
            @keyframes electricPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }
            @keyframes lightningFlicker {
                0%, 90%, 100% { opacity: 0; }
                92%, 95% { opacity: 1; }
            }
            @keyframes hairShine {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.7; }
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
            .zac-electric {
                animation: electricPulse 2s ease-in-out infinite;
            }
            .zac-lightning {
                animation: lightningFlicker 4s ease-in-out infinite;
            }
            .zac-hair-shine {
                animation: hairShine 3s ease-in-out infinite;
            }

            /* Mobile responsive Zac */
            @media (max-width: 768px) {
                #zac-avatar-container {
                    bottom: 10px !important;
                    right: 10px !important;
                }
                #zac-avatar {
                    width: 100px !important;
                    height: 200px !important;
                }
                #zac-speech-bubble {
                    max-width: 250px !important;
                    padding: 12px 15px !important;
                    font-size: 13px !important;
                }
                #zac-dismiss-btn {
                    width: 24px !important;
                    height: 24px !important;
                    font-size: 16px !important;
                    top: -8px !important;
                    right: -8px !important;
                }
                #zac-quick-actions {
                    gap: 5px !important;
                }
                #zac-quick-actions button {
                    padding: 5px 8px !important;
                    font-size: 10px !important;
                }
                #zac-chat-input {
                    padding: 8px 10px !important;
                    font-size: 12px !important;
                }
                .bring-back-zac {
                    width: 40px !important;
                    height: 40px !important;
                    font-size: 18px !important;
                    bottom: 10px !important;
                    right: 10px !important;
                }
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
            border: 1px solid #ff3333;
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
            if (this.walkthroughStep < this.walkthroughMessages.length) {
                this.nextWalkthroughStep();
            } else {
                // After tour, prompt sign up
                if (!window.currentUser && window.showSignUp) {
                    window.showSignUp();
                } else {
                    this.toggleSpeech();
                }
            }
        });

        // Create dismiss button
        const dismissBtn = document.createElement('button');
        dismissBtn.id = 'zac-dismiss-btn';
        dismissBtn.innerHTML = '×';
        dismissBtn.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ff3333;
            color: #ff3333;
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
            dismissBtn.style.background = '#ff3333';
            dismissBtn.style.color = '#fff';
        });
        dismissBtn.addEventListener('mouseleave', () => {
            dismissBtn.style.background = 'rgba(0, 0, 0, 0.8)';
            dismissBtn.style.color = '#ff3333';
        });
        dismissBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide();
            // Store preference so Zac doesn't auto-show again this session
            sessionStorage.setItem('zac_dismissed', 'true');
            // Show the "Bring back Zac" button
            const bringBackBtn = document.getElementById('bringBackZacBtn');
            if (bringBackBtn) bringBackBtn.classList.add('visible');
        });

        this.container.style.position = 'fixed';
        this.container.appendChild(dismissBtn);
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
            max-width: 380px;
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

        // Quick Actions section
        const quickActions = document.createElement('div');
        quickActions.id = 'zac-quick-actions';
        quickActions.style.cssText = `
            display: none;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 51, 51, 0.3);
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
                background: rgba(255, 51, 51, 0.15);
                border: 1px solid rgba(255, 51, 51, 0.4);
                color: #fff;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 51, 51, 0.3)';
                btn.style.borderColor = '#ff3333';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(255, 51, 51, 0.15)';
                btn.style.borderColor = 'rgba(255, 51, 51, 0.4)';
            });
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleQuickAction(act.action);
            });
            quickActions.appendChild(btn);
        });
        this.speechBubble.appendChild(quickActions);

        // Chat input area
        const chatContainer = document.createElement('div');
        chatContainer.id = 'zac-chat-container';
        chatContainer.style.cssText = `
            display: none;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 51, 51, 0.3);
        `;

        const chatInputWrapper = document.createElement('div');
        chatInputWrapper.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        const chatInput = document.createElement('input');
        chatInput.id = 'zac-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Ask me anything...';
        chatInput.style.cssText = `
            flex: 1;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 51, 51, 0.4);
            border-radius: 10px;
            padding: 10px 15px;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        `;
        chatInput.addEventListener('focus', () => {
            chatInput.style.borderColor = '#ff3333';
        });
        chatInput.addEventListener('blur', () => {
            chatInput.style.borderColor = 'rgba(255, 51, 51, 0.4)';
        });
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleChatInput(chatInput.value);
                chatInput.value = '';
            }
        });

        const sendBtn = document.createElement('button');
        sendBtn.innerHTML = '➤';
        sendBtn.style.cssText = `
            background: #ff3333;
            border: none;
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        `;
        sendBtn.addEventListener('mouseenter', () => {
            sendBtn.style.transform = 'scale(1.1)';
            sendBtn.style.background = '#ff5555';
        });
        sendBtn.addEventListener('mouseleave', () => {
            sendBtn.style.transform = 'scale(1)';
            sendBtn.style.background = '#ff3333';
        });
        sendBtn.addEventListener('click', () => {
            this.handleChatInput(chatInput.value);
            chatInput.value = '';
        });

        // File upload button
        const uploadBtn = document.createElement('label');
        uploadBtn.innerHTML = '📎';
        uploadBtn.style.cssText = `
            background: rgba(255, 51, 51, 0.2);
            border: 1px solid rgba(255, 51, 51, 0.4);
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        uploadBtn.addEventListener('mouseenter', () => {
            uploadBtn.style.background = 'rgba(255, 51, 51, 0.4)';
        });
        uploadBtn.addEventListener('mouseleave', () => {
            uploadBtn.style.background = 'rgba(255, 51, 51, 0.2)';
        });

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.xlsx,.xls,.csv,.pptx,.doc,.docx';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        uploadBtn.appendChild(fileInput);

        chatInputWrapper.appendChild(uploadBtn);
        chatInputWrapper.appendChild(chatInput);
        chatInputWrapper.appendChild(sendBtn);
        chatContainer.appendChild(chatInputWrapper);
        this.speechBubble.appendChild(chatContainer);

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

    handleQuickAction(action) {
        switch(action) {
            case 'upload':
                this.showSpeech("Let me help you upload your financials. You can drag files here or click the 📎 button!", "Upload Mode");
                if (typeof showUploadModal === 'function') {
                    showUploadModal();
                }
                break;
            case 'model':
                this.showModelOptions();
                break;
            case 'reports':
                this.showSpeech("Taking you to your reports dashboard...", "View Reports");
                setTimeout(() => {
                    if (typeof showPage === 'function') {
                        showPage('demo');
                    }
                }, 500);
                break;
            case 'upgrade':
                this.showSpeech("Let me show you our packages. Pick the one that fits your needs!", "Upgrade");
                setTimeout(() => {
                    if (typeof showPage === 'function') {
                        showPage('packages');
                    }
                }, 500);
                break;
        }
    }

    showModelOptions() {
        const textEl = document.getElementById('zac-speech-text');
        const titleEl = document.getElementById('zac-speech-title');
        if (titleEl) titleEl.textContent = 'Build Financial Model';
        if (textEl) {
            textEl.innerHTML = `
                <p style="margin-bottom: 12px;">What type of model would you like to build?</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button onclick="zacAvatar.selectModel('three-statement')" style="background: rgba(255,51,51,0.2); border: 1px solid #ff3333; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s;">
                        📊 <strong>Three-Statement Model</strong><br>
                        <small style="opacity: 0.7;">Income, Balance Sheet, Cash Flow</small>
                    </button>
                    <button onclick="zacAvatar.selectModel('dcf')" style="background: rgba(255,51,51,0.2); border: 1px solid #ff3333; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s;">
                        📈 <strong>DCF Valuation</strong><br>
                        <small style="opacity: 0.7;">Discounted Cash Flow Analysis</small>
                    </button>
                    <button onclick="zacAvatar.selectModel('lbo')" style="background: rgba(255,51,51,0.2); border: 1px solid #ff3333; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.2s;">
                        🏢 <strong>LBO Model</strong><br>
                        <small style="opacity: 0.7;">Leveraged Buyout Analysis</small>
                    </button>
                </div>
            `;
        }
        this.speechBubble.style.display = 'block';
        this.showChatMode(false);
    }

    selectModel(type) {
        const modelNames = {
            'three-statement': 'Three-Statement Model',
            'dcf': 'DCF Valuation',
            'lbo': 'LBO Model'
        };
        this.showSpeech(`Great choice! Let's build your ${modelNames[type]}. First, I'll need some financial data. Would you like to upload documents or enter data manually?`, 'Building Model');
        this.setPose('pointing');

        // Store selected model type for later use
        this.selectedModelType = type;
        this.enableChatMode();
    }

    handleChatInput(message) {
        if (!message.trim()) return;

        const lowerMsg = message.toLowerCase();

        // Keywords for navigation
        if (lowerMsg.includes('upload') || lowerMsg.includes('financial') || lowerMsg.includes('document')) {
            this.showSpeech("Opening the upload panel for you!", "Upload Financials");
            this.setPose('pointing');
            setTimeout(() => {
                if (typeof showUploadModal === 'function') showUploadModal();
            }, 500);
        } else if (lowerMsg.includes('quickbooks') || lowerMsg.includes('connect')) {
            this.showSpeech("QuickBooks integration is available with Gold and Diamond packages. Would you like to see our upgrade options?", "QuickBooks");
            this.setPose('pointing');
        } else if (lowerMsg.includes('package') || lowerMsg.includes('upgrade') || lowerMsg.includes('pricing')) {
            this.showSpeech("Let me take you to our packages!", "Packages");
            setTimeout(() => {
                if (typeof showPage === 'function') showPage('packages');
            }, 500);
        } else if (lowerMsg.includes('report') || lowerMsg.includes('dashboard') || lowerMsg.includes('demo')) {
            this.showSpeech("Opening your reports dashboard!", "Reports");
            setTimeout(() => {
                if (typeof showPage === 'function') showPage('demo');
            }, 500);
        } else if (lowerMsg.includes('profile') || lowerMsg.includes('account') || lowerMsg.includes('settings')) {
            this.showSpeech("Taking you to your profile settings!", "Profile");
            setTimeout(() => {
                if (typeof showPage === 'function') showPage('profile');
            }, 500);
        } else if (lowerMsg.includes('model') || lowerMsg.includes('dcf') || lowerMsg.includes('lbo') || lowerMsg.includes('three statement')) {
            this.showModelOptions();
        } else if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
            this.showHelpOptions();
        } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
            this.showSpeech("Hey there! 👋 What can I help you with today?", "Zac");
            this.setPose('waving');
            this.enableChatMode();
        } else {
            // Default AI-like response
            this.showSpeech(`I understand you're asking about "${message}". I can help you upload financials, build models (Three-Statement, DCF, LBO), view reports, or manage your account. What would you like to do?`, "Let me help");
            this.enableChatMode();
        }
    }

    handleFileUpload(files) {
        if (files.length === 0) return;

        const fileList = Array.from(files).map(f => f.name).join(', ');
        this.showSpeech(`Got it! Processing ${files.length} file(s): ${fileList}. I'll analyze these and add them to your workspace.`, "Uploading...");
        this.setPose('thumbsup');

        // Trigger the actual upload if upload modal exists
        if (typeof handleChatFileUpload === 'function') {
            handleChatFileUpload(files);
        } else {
            // Show the upload modal with files pre-selected indicator
            setTimeout(() => {
                if (typeof showUploadModal === 'function') {
                    showUploadModal();
                    this.showSpeech("Files received! Drag them into the upload area or use the file picker to confirm.", "Ready to Upload");
                }
            }, 1500);
        }
    }

    showHelpOptions() {
        const textEl = document.getElementById('zac-speech-text');
        const titleEl = document.getElementById('zac-speech-title');
        if (titleEl) titleEl.textContent = 'How Can I Help?';
        if (textEl) {
            textEl.innerHTML = `
                <p style="margin-bottom: 10px;">Here's what I can do for you:</p>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
                    <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">📤 <strong>Upload Financials</strong> - Import PDFs, Excel, CSV</li>
                    <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">📊 <strong>Build Models</strong> - Three-Statement, DCF, LBO</li>
                    <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">📈 <strong>Generate Reports</strong> - AI-powered insights</li>
                    <li style="padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">🔗 <strong>Connect QuickBooks</strong> - Sync your data</li>
                    <li style="padding: 5px 0;">💎 <strong>Upgrade Plan</strong> - Unlock more features</li>
                </ul>
                <p style="margin-top: 12px; font-size: 12px; opacity: 0.8;">Just type what you need or use the quick actions below!</p>
            `;
        }
        this.speechBubble.style.display = 'block';
        this.enableChatMode();
    }

    enableChatMode() {
        const chatContainer = document.getElementById('zac-chat-container');
        const quickActions = document.getElementById('zac-quick-actions');
        const continueHint = document.getElementById('zac-continue-hint');

        if (chatContainer) chatContainer.style.display = 'block';
        if (quickActions) quickActions.style.display = 'flex';
        if (continueHint) continueHint.style.display = 'none';

        this.chatModeEnabled = true;
    }

    showChatMode(show = true) {
        const chatContainer = document.getElementById('zac-chat-container');
        const quickActions = document.getElementById('zac-quick-actions');
        if (chatContainer) chatContainer.style.display = show ? 'block' : 'none';
        if (quickActions) quickActions.style.display = show ? 'flex' : 'none';
    }

    getAvatarSVG(pose) {
        const isWaving = pose === 'waving';
        const isPointing = pose === 'pointing';
        const isThumbsUp = pose === 'thumbsup';

        return `
        <svg viewBox="0 0 160 320" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Flynn Rider skin tones - warm and tan -->
                <linearGradient id="flynnSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f5d4bc"/>
                    <stop offset="40%" style="stop-color:#e8c4a8"/>
                    <stop offset="100%" style="stop-color:#d9b090"/>
                </linearGradient>
                <linearGradient id="flynnSkinShadow" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#d9b090"/>
                    <stop offset="100%" style="stop-color:#c9a080"/>
                </linearGradient>

                <!-- Flynn's signature brown swoopy hair -->
                <linearGradient id="flynnHair" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4a3728"/>
                    <stop offset="30%" style="stop-color:#3d2d20"/>
                    <stop offset="60%" style="stop-color:#5a4030"/>
                    <stop offset="100%" style="stop-color:#3d2d20"/>
                </linearGradient>
                <linearGradient id="flynnHairHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6b5040"/>
                    <stop offset="50%" style="stop-color:#5a4030"/>
                    <stop offset="100%" style="stop-color:#4a3728"/>
                </linearGradient>

                <!-- Sharp charcoal suit -->
                <linearGradient id="suitCharcoal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#3a3a3a"/>
                    <stop offset="30%" style="stop-color:#2d2d2d"/>
                    <stop offset="70%" style="stop-color:#333333"/>
                    <stop offset="100%" style="stop-color:#252525"/>
                </linearGradient>
                <linearGradient id="suitLapel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#454545"/>
                    <stop offset="50%" style="stop-color:#333333"/>
                    <stop offset="100%" style="stop-color:#2a2a2a"/>
                </linearGradient>

                <!-- Crisp white shirt -->
                <linearGradient id="whiteShirt" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="50%" style="stop-color:#f8f8f8"/>
                    <stop offset="100%" style="stop-color:#eeeeee"/>
                </linearGradient>

                <!-- Lightning red tie -->
                <linearGradient id="redTie" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff4444"/>
                    <stop offset="50%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#cc2222"/>
                </linearGradient>
                <linearGradient id="redTieShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff6666"/>
                    <stop offset="50%" style="stop-color:#ff3333"/>
                    <stop offset="100%" style="stop-color:#dd2222"/>
                </linearGradient>

                <!-- Charcoal pants -->
                <linearGradient id="suitPants" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#2a2a2a"/>
                    <stop offset="50%" style="stop-color:#333333"/>
                    <stop offset="100%" style="stop-color:#252525"/>
                </linearGradient>

                <!-- Polished dress shoes -->
                <linearGradient id="dressShoes" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a1a"/>
                    <stop offset="50%" style="stop-color:#0d0d0d"/>
                    <stop offset="100%" style="stop-color:#000000"/>
                </linearGradient>
                <linearGradient id="shoeShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#444"/>
                    <stop offset="100%" style="stop-color:#1a1a1a"/>
                </linearGradient>

                <!-- Flynn's warm brown eyes -->
                <radialGradient id="eyeWhite" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" style="stop-color:#ffffff"/>
                    <stop offset="100%" style="stop-color:#f5f5f5"/>
                </radialGradient>
                <radialGradient id="flynnEyes" cx="35%" cy="35%" r="60%">
                    <stop offset="0%" style="stop-color:#8b6914"/>
                    <stop offset="40%" style="stop-color:#6b4c0a"/>
                    <stop offset="100%" style="stop-color:#4a3508"/>
                </radialGradient>

                <!-- Goatee/stubble color -->
                <linearGradient id="goatee" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#3d2d20"/>
                    <stop offset="100%" style="stop-color:#2a1f15"/>
                </linearGradient>

                <!-- Shadow and glow filters -->
                <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.4"/>
                </filter>
                <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.25"/>
                </filter>
                <filter id="tieGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feFlood flood-color="#ff3333" flood-opacity="0.4"/>
                    <feComposite in2="blur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- AMBIENT GLOW EFFECT -->
            <ellipse cx="80" cy="200" rx="60" ry="100" fill="#ff3333" opacity="0.03" class="zac-electric"/>

            <!-- LEGS - Tailored suit pants -->
            <path d="M 58 200 L 54 270 Q 52 278 56 280 L 71 280 Q 75 278 73 270 L 68 200"
                fill="url(#suitPants)" filter="url(#subtleShadow)"/>
            <path d="M 92 200 L 87 270 Q 85 278 89 280 L 104 280 Q 108 278 106 270 L 102 200"
                fill="url(#suitPants)" filter="url(#subtleShadow)"/>

            <!-- Pant creases -->
            <line x1="63" y1="205" x2="63" y2="275" stroke="#1a1a1a" stroke-width="0.5" opacity="0.3"/>
            <line x1="97" y1="205" x2="97" y2="275" stroke="#1a1a1a" stroke-width="0.5" opacity="0.3"/>

            <!-- DRESS SHOES - Polished -->
            <path d="M 50 278 Q 46 284 50 292 L 78 292 Q 82 284 78 278 Z" fill="url(#dressShoes)" filter="url(#subtleShadow)"/>
            <ellipse cx="64" cy="284" rx="14" ry="5" fill="url(#shoeShine)" opacity="0.6"/>

            <path d="M 82 278 Q 78 284 82 292 L 110 292 Q 114 284 110 278 Z" fill="url(#dressShoes)" filter="url(#subtleShadow)"/>
            <ellipse cx="96" cy="284" rx="14" ry="5" fill="url(#shoeShine)" opacity="0.6"/>

            <!-- TORSO - Sharp tailored suit jacket -->
            <path d="M 42 105
                     Q 34 115 34 135
                     L 38 200
                     L 122 200
                     L 126 135
                     Q 126 115 118 105
                     L 110 95 L 50 95 Z"
                fill="url(#suitCharcoal)" filter="url(#softShadow)"/>

            <!-- Suit jacket details - seams -->
            <path d="M 80 95 L 80 200" stroke="#222" stroke-width="1" opacity="0.3"/>
            <path d="M 55 110 Q 45 150 46 200" stroke="#222" stroke-width="1" opacity="0.2"/>
            <path d="M 105 110 Q 115 150 114 200" stroke="#222" stroke-width="1" opacity="0.2"/>

            <!-- Suit lapels - peaked style -->
            <path d="M 55 95 L 42 125 L 50 140 L 65 105 Z" fill="url(#suitLapel)"/>
            <path d="M 105 95 L 118 125 L 110 140 L 95 105 Z" fill="url(#suitLapel)"/>

            <!-- Lapel edge highlight -->
            <path d="M 55 95 L 42 125" stroke="#555" stroke-width="1" opacity="0.4"/>
            <path d="M 105 95 L 118 125" stroke="#555" stroke-width="1" opacity="0.4"/>

            <!-- White dress shirt showing -->
            <path d="M 65 95 L 62 160 L 80 170 L 98 160 L 95 95 Z" fill="url(#whiteShirt)"/>

            <!-- Shirt collar -->
            <path d="M 60 95 L 65 80 L 80 88 L 95 80 L 100 95" fill="url(#whiteShirt)" stroke="#ddd" stroke-width="0.5"/>

            <!-- RED TIE - Lightning Ledgerz signature -->
            <g filter="url(#tieGlow)">
                <path d="M 75 88 L 72 95 L 74 140 L 80 155 L 86 140 L 88 95 L 85 88 Z" fill="url(#redTie)"/>
                <!-- Tie knot -->
                <ellipse cx="80" cy="90" rx="6" ry="4" fill="url(#redTieShine)"/>
                <!-- Tie shine -->
                <path d="M 78 95 L 77 135" stroke="#ff6666" stroke-width="1.5" opacity="0.4"/>
            </g>

            <!-- Suit buttons -->
            <circle cx="80" cy="165" r="3" fill="#222" stroke="#333" stroke-width="0.5"/>
            <circle cx="80" cy="180" r="3" fill="#222" stroke="#333" stroke-width="0.5"/>

            <!-- Pocket square - red accent -->
            <path d="M 48 118 L 52 108 L 60 110 L 56 120 Z" fill="#ff3333" opacity="0.9"/>

            <!-- LEFT ARM -->
            <g>
                <path d="M 42 105 Q 25 118 22 148 L 30 152 Q 32 125 44 110"
                    fill="url(#suitCharcoal)" filter="url(#subtleShadow)"/>
                <path d="M 22 148 Q 16 175 18 195 L 30 198 Q 30 178 30 152"
                    fill="url(#suitCharcoal)"/>
                <!-- Suit cuff -->
                <rect x="15" y="190" width="18" height="10" rx="2" fill="#2a2a2a"/>
                <!-- White shirt cuff showing -->
                <rect x="15" y="196" width="18" height="4" rx="1" fill="#fff"/>
                <!-- Cuff link -->
                <circle cx="24" cy="193" r="2" fill="#ff3333"/>
                <!-- Hand -->
                <g transform="translate(14, 198)">
                    <ellipse cx="10" cy="8" rx="11" ry="12" fill="url(#flynnSkin)"/>
                    <ellipse cx="21" cy="5" rx="5" ry="6" fill="url(#flynnSkin)" transform="rotate(25, 21, 5)"/>
                    <rect x="4" y="18" width="4.5" height="14" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="9" y="18" width="4.5" height="16" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="14" y="18" width="4.5" height="15" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="19" y="16" width="4" height="12" rx="2" fill="url(#flynnSkin)"/>
                </g>
            </g>

            <!-- RIGHT ARM (pose-dependent) -->
            ${isWaving ? `
            <g class="zac-wave-arm">
                <path d="M 118 105 Q 138 95 148 68 L 140 64 Q 132 86 120 98"
                    fill="url(#suitCharcoal)" filter="url(#subtleShadow)"/>
                <path d="M 148 68 Q 158 42 160 22 L 152 20 Q 150 40 140 64"
                    fill="url(#suitCharcoal)"/>
                <rect x="150" y="16" width="12" height="8" rx="2" fill="#2a2a2a" transform="rotate(-15, 156, 20)"/>
                <rect x="150" y="21" width="12" height="3" rx="1" fill="#fff" transform="rotate(-15, 156, 22)"/>
                <g transform="translate(150, 6) rotate(-15)">
                    <ellipse cx="10" cy="10" rx="11" ry="12" fill="url(#flynnSkin)"/>
                    <rect x="2" y="-8" width="4.5" height="14" rx="2" fill="url(#flynnSkin)" transform="rotate(-10, 4, 0)"/>
                    <rect x="8" y="-10" width="4.5" height="16" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="14" y="-9" width="4.5" height="15" rx="2" fill="url(#flynnSkin)" transform="rotate(8, 16, 0)"/>
                    <rect x="20" y="-6" width="4" height="12" rx="2" fill="url(#flynnSkin)" transform="rotate(15, 22, 0)"/>
                    <ellipse cx="0" cy="8" rx="5" ry="6" fill="url(#flynnSkin)" transform="rotate(-25, 0, 8)"/>
                </g>
            </g>
            ` : isPointing ? `
            <g>
                <path d="M 118 105 Q 142 98 157 92 L 155 85 Q 140 90 120 96"
                    fill="url(#suitCharcoal)" filter="url(#subtleShadow)"/>
                <path d="M 157 92 Q 177 86 192 80 L 190 73 Q 175 78 155 85"
                    fill="url(#suitCharcoal)"/>
                <rect x="185" y="70" width="10" height="6" rx="2" fill="#2a2a2a"/>
                <g transform="translate(190, 68)">
                    <ellipse cx="8" cy="10" rx="10" ry="11" fill="url(#flynnSkin)"/>
                    <rect x="12" y="-8" width="5" height="24" rx="2.5" fill="url(#flynnSkin)"/>
                    <ellipse cx="2" cy="20" rx="5" ry="6" fill="url(#flynnSkinShadow)"/>
                    <ellipse cx="8" cy="22" rx="4" ry="5.5" fill="url(#flynnSkinShadow)"/>
                    <ellipse cx="14" cy="21" rx="3.5" ry="5" fill="url(#flynnSkinShadow)"/>
                    <ellipse cx="-2" cy="8" rx="4.5" ry="5.5" fill="url(#flynnSkin)" transform="rotate(-15, -2, 8)"/>
                </g>
            </g>
            ` : isThumbsUp ? `
            <g>
                <path d="M 118 105 Q 130 90 134 72 L 126 69 Q 124 86 118 98"
                    fill="url(#suitCharcoal)" filter="url(#subtleShadow)"/>
                <path d="M 134 72 Q 138 52 138 36 L 130 34 Q 132 52 126 69"
                    fill="url(#suitCharcoal)"/>
                <rect x="127" y="30" width="12" height="6" rx="2" fill="#2a2a2a"/>
                <g transform="translate(122, 16)">
                    <ellipse cx="12" cy="18" rx="11" ry="12" fill="url(#flynnSkin)"/>
                    <ellipse cx="6" cy="28" rx="9" ry="5.5" fill="url(#flynnSkinShadow)"/>
                    <rect x="14" y="-8" width="7" height="24" rx="3.5" fill="url(#flynnSkin)"/>
                    <ellipse cx="17.5" cy="-10" rx="4" ry="4.5" fill="url(#flynnSkin)"/>
                </g>
            </g>
            ` : `
            <g>
                <path d="M 118 105 Q 135 118 138 148 L 130 152 Q 128 125 116 110"
                    fill="url(#suitCharcoal)" filter="url(#subtleShadow)"/>
                <path d="M 138 148 Q 143 175 140 195 L 130 198 Q 130 178 130 152"
                    fill="url(#suitCharcoal)"/>
                <rect x="127" y="190" width="18" height="10" rx="2" fill="#2a2a2a"/>
                <rect x="127" y="196" width="18" height="4" rx="1" fill="#fff"/>
                <circle cx="136" cy="193" r="2" fill="#ff3333"/>
                <g transform="translate(124, 198)">
                    <ellipse cx="10" cy="8" rx="11" ry="12" fill="url(#flynnSkin)"/>
                    <ellipse cx="-1" cy="5" rx="5" ry="6" fill="url(#flynnSkin)" transform="rotate(-25, -1, 5)"/>
                    <rect x="4" y="18" width="4.5" height="14" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="9" y="18" width="4.5" height="16" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="14" y="18" width="4.5" height="15" rx="2" fill="url(#flynnSkin)"/>
                    <rect x="19" y="16" width="4" height="12" rx="2" fill="url(#flynnSkin)"/>
                </g>
            </g>
            `}

            <!-- NECK -->
            <path d="M 68 93 Q 68 82 70 76 L 90 76 Q 92 82 92 93" fill="url(#flynnSkin)"/>

            <!-- HEAD - Disney proportions, slightly larger eyes area -->
            <ellipse cx="80" cy="50" rx="34" ry="38" fill="url(#flynnSkin)" filter="url(#softShadow)"/>

            <!-- EARS - Disney style -->
            <ellipse cx="46" cy="52" rx="5" ry="9" fill="url(#flynnSkinShadow)"/>
            <ellipse cx="47" cy="52" rx="3.5" ry="6" fill="url(#flynnSkin)"/>
            <ellipse cx="114" cy="52" rx="5" ry="9" fill="url(#flynnSkinShadow)"/>
            <ellipse cx="113" cy="52" rx="3.5" ry="6" fill="url(#flynnSkin)"/>

            <!-- FLYNN'S SIGNATURE HAIR - Brown, wavy, swoopy -->
            <!-- Main hair mass -->
            <path d="M 46 48
                     Q 44 25 52 12
                     Q 60 2 75 0
                     Q 90 -2 102 6
                     Q 115 15 116 35
                     Q 118 48 114 50
                     Q 108 35 95 28
                     Q 80 22 70 26
                     Q 55 30 46 48"
                fill="url(#flynnHair)"/>

            <!-- Signature swoop on the right side -->
            <path d="M 105 20 Q 125 8 135 15 Q 130 25 118 28 Q 108 30 102 25 Z" fill="url(#flynnHair)"/>

            <!-- Front swoopy bangs -->
            <path d="M 55 30 Q 48 18 55 8 Q 62 16 65 28 Q 60 32 55 30 Z" fill="url(#flynnHair)"/>
            <path d="M 68 24 Q 65 10 72 4 Q 80 12 78 24 Q 72 28 68 24 Z" fill="url(#flynnHair)"/>
            <path d="M 85 20 Q 88 6 98 5 Q 100 15 95 24 Q 88 26 85 20 Z" fill="url(#flynnHairHighlight)"/>

            <!-- Hair highlights/shine -->
            <path d="M 55 20 Q 72 8 105 18" stroke="#7a6050" stroke-width="3" fill="none" opacity="0.5" class="zac-hair-shine"/>
            <path d="M 50 32 Q 70 22 100 28" stroke="#6a5040" stroke-width="2" fill="none" opacity="0.4"/>

            <!-- Side hair -->
            <path d="M 46 48 Q 40 40 42 30 Q 50 34 54 42 Z" fill="url(#flynnHair)"/>
            <path d="M 114 50 Q 120 42 118 32 Q 110 35 108 45 Z" fill="url(#flynnHair)"/>

            <!-- Sideburns -->
            <path d="M 46 48 Q 44 58 46 65" stroke="url(#goatee)" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
            <path d="M 114 48 Q 116 58 114 65" stroke="url(#goatee)" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>

            <!-- FACE -->
            <!-- Eyebrows - Flynn's expressive, slightly raised brows -->
            <path d="M 54 36 Q 58 31 65 33 Q 71 35 72 37" stroke="#3d2d20" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 88 37 Q 89 35 95 33 Q 102 31 106 36" stroke="#3d2d20" stroke-width="3" fill="none" stroke-linecap="round"/>

            <!-- EYES - Large Disney style with warm brown -->
            <g class="zac-eye-group">
                <!-- Left eye -->
                <ellipse cx="63" cy="48" rx="11" ry="9" fill="url(#eyeWhite)"/>
                <ellipse cx="64" cy="48" rx="7" ry="7" fill="url(#flynnEyes)"/>
                <circle cx="64" cy="48" r="3.5" fill="#2a1f15"/>
                <!-- Eye sparkle/reflection -->
                <circle cx="66" cy="46" r="2.5" fill="#fff"/>
                <circle cx="62" cy="50" r="1.2" fill="#fff" opacity="0.6"/>
                <!-- Upper eyelid line -->
                <path d="M 53 44 Q 63 40 73 44" stroke="#3d2d20" stroke-width="1.5" fill="none"/>
            </g>
            <g class="zac-eye-group">
                <!-- Right eye -->
                <ellipse cx="97" cy="48" rx="11" ry="9" fill="url(#eyeWhite)"/>
                <ellipse cx="96" cy="48" rx="7" ry="7" fill="url(#flynnEyes)"/>
                <circle cx="96" cy="48" r="3.5" fill="#2a1f15"/>
                <circle cx="98" cy="46" r="2.5" fill="#fff"/>
                <circle cx="94" cy="50" r="1.2" fill="#fff" opacity="0.6"/>
                <path d="M 87 44 Q 97 40 107 44" stroke="#3d2d20" stroke-width="1.5" fill="none"/>
            </g>

            <!-- NOSE - Flynn's distinctive nose -->
            <path d="M 80 48 Q 84 58 80 66 Q 75 68 72 64"
                stroke="url(#flynnSkinShadow)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Nose highlight -->
            <ellipse cx="78" cy="54" rx="2" ry="3" fill="#f8dcc8" opacity="0.4"/>

            <!-- 5 O'CLOCK SHADOW - Light stubble across jaw -->
            <!-- Chin area stubble -->
            <ellipse cx="80" cy="82" rx="18" ry="10" fill="url(#goatee)" opacity="0.12"/>
            <!-- Jaw line stubble -->
            <path d="M 52 65 Q 65 80 80 85 Q 95 80 108 65" fill="url(#goatee)" opacity="0.08"/>
            <!-- Cheek stubble -->
            <ellipse cx="55" cy="68" rx="8" ry="6" fill="url(#goatee)" opacity="0.1"/>
            <ellipse cx="105" cy="68" rx="8" ry="6" fill="url(#goatee)" opacity="0.1"/>

            <!-- MOUTH - Flynn's signature smirk -->
            ${pose === 'thumbsup' ? `
                <!-- Big smile showing teeth -->
                <path d="M 65 74 Q 80 88 95 74" stroke="#9a5050" stroke-width="2" fill="none"/>
                <path d="M 68 74 Q 80 84 92 74" fill="#fff"/>
                <path d="M 68 74 Q 80 76 92 74" fill="#c06060"/>
            ` : `
                <!-- Classic Flynn smirk - one side higher -->
                <path d="M 68 74 Q 78 78 85 75 Q 92 73 95 70" stroke="#9a5050" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <!-- Slight smile line -->
                <path d="M 68 74 Q 76 77 82 75" fill="none" stroke="#b57070" stroke-width="1" opacity="0.5"/>
            `}

            <!-- Cheek contours -->
            <ellipse cx="53" cy="60" rx="6" ry="4" fill="#f0c0b0" opacity="0.3"/>
            <ellipse cx="107" cy="60" rx="6" ry="4" fill="#f0c0b0" opacity="0.3"/>

            <!-- JAWLINE - Strong, defined -->
            <path d="M 48 58 Q 54 78 80 88 Q 106 78 112 58"
                stroke="url(#flynnSkinShadow)" stroke-width="1.5" fill="none" opacity="0.2"/>

            <!-- LUXURY WATCH - subtle red accent -->
            <rect x="13" y="188" width="20" height="14" rx="4" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
            <rect x="16" y="191" width="14" height="8" rx="2" fill="#111"/>
            <text x="23" y="197" font-size="5" fill="#ff3333" text-anchor="middle" font-family="monospace" font-weight="bold">ZAC</text>
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
            this.showSpeech("What can I help you with today?", "Ask Zac");
            this.enableChatMode();
        } else {
            this.hideSpeech();
            this.showChatMode(false);
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
            this.showSpeech("Ready when you are! What can I help you with?", "At Your Service");
            this.setPose('thumbsup');
            this.enableChatMode();
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
    const wasDismissed = sessionStorage.getItem('zac_dismissed');

    // Show "Bring back Zac" button if he was dismissed
    if (wasDismissed) {
        const bringBackBtn = document.getElementById('bringBackZacBtn');
        if (bringBackBtn) bringBackBtn.classList.add('visible');
        return;
    }

    if (!hasSeenWalkthrough) {
        setTimeout(() => {
            zacAvatar.startWalkthrough();
            localStorage.setItem('zac_walkthrough_seen', 'true');
        }, 2500);
    } else {
        // Always show Zac on the homepage after walkthrough is seen
        setTimeout(() => {
            zacAvatar.show();
            zacAvatar.showSpeech("Welcome back! What can I help you with?", "Ready to assist!");
            zacAvatar.enableChatMode();
        }, 1500);
    }
});

// Function to bring back Zac
function bringBackZac() {
    sessionStorage.removeItem('zac_dismissed');
    const bringBackBtn = document.getElementById('bringBackZacBtn');
    if (bringBackBtn) bringBackBtn.classList.remove('visible');

    if (zacAvatar) {
        zacAvatar.show();
        zacAvatar.showSpeech("I'm back! What can I help you with?", "Hey there!");
        zacAvatar.setPose('waving');
        zacAvatar.enableChatMode();
    }
}

window.bringBackZac = bringBackZac;

// Make Zac globally available
window.zacAvatar = {
    show: () => zacAvatar?.show(),
    hide: () => zacAvatar?.hide(),
    welcomeBack: (name) => zacAvatar?.welcomeBack(name),
    celebrateUpload: () => zacAvatar?.celebrateUpload(),
    startWalkthrough: () => zacAvatar?.startWalkthrough(),
    suggestUpgrade: (tier) => zacAvatar?.suggestUpgrade(tier),
    selectModel: (type) => zacAvatar?.selectModel(type),
    showSpeech: (text, title) => zacAvatar?.showSpeech(text, title),
    enableChatMode: () => zacAvatar?.enableChatMode()
};

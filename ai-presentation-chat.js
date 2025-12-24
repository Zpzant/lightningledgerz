/**
 * AI Presentation Chat - Conversational Deck Builder
 * Clean PopAI-style interface with avatar integration
 */

class AIPresentationChat {
    constructor() {
        this.messages = [];
        this.currentAvatar = 'zac'; // Default

        // FREEMIUM MODEL - Daily deck generation tries per tier
        this.tierLimits = {
            free: { triesPerDay: 1, name: 'Free', canExport: false, premiumTemplates: false, maxSlides: 5 },
            basic: { triesPerDay: 3, name: 'Basic', canExport: true, premiumTemplates: false, maxSlides: 15 },
            gold: { triesPerDay: 10, name: 'Gold', canExport: true, premiumTemplates: true, maxSlides: 30 },
            diamond: { triesPerDay: -1, name: 'Diamond', canExport: true, premiumTemplates: true, maxSlides: -1 } // -1 = unlimited
        };
        this.selectedSlideCount = 5; // Default slide count

        this.currentTier = this.detectUserTier();
        this.usage = this.loadUsage();

        this.avatarData = {
            zac: {
                name: 'Zac',
                title: 'Your Financial Strategist',
                greeting: "Hey! I'm Zac. Let's build a killer presentation together. What's it about?",
                style: 'energetic',
                color: '#ff3333'
            },
            alaina: {
                name: 'Alaina',
                title: 'Your Creative Director',
                greeting: "Hi there! I'm Alaina. Ready to create something beautiful? Tell me about your presentation.",
                style: 'warm',
                color: '#ff69b4'
            },
            bolt: {
                name: 'Bolt',
                title: 'Your Speed Expert',
                greeting: "Let's move fast! What presentation do you need? I'll have it ready in no time.",
                style: 'fast',
                color: '#ffd700'
            },
            zeus: {
                name: 'Zeus',
                title: 'Your Power Presenter',
                greeting: "Ready to create something powerful? Tell me your vision and I'll bring the thunder.",
                style: 'powerful',
                color: '#9370db'
            }
        };
        this.uploadedPDF = null;
        this.pdfData = null;
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

    // FREEMIUM: Detect user's membership tier
    detectUserTier() {
        // Check from Supabase user data or localStorage
        const userTier = localStorage.getItem('userTier') || window.currentUserTier;
        if (userTier && this.tierLimits[userTier]) {
            return userTier;
        }
        // Check if user is logged in with a subscription
        if (window.currentUser && window.currentUser.package_tier) {
            return window.currentUser.package_tier;
        }
        return 'free';
    }

    // FREEMIUM: Load usage from localStorage
    loadUsage() {
        const saved = localStorage.getItem('presentationUsage');
        if (saved) {
            const usage = JSON.parse(saved);
            // Reset if it's a new day
            const now = new Date();
            const savedDate = new Date(usage.resetDate);
            if (now.toDateString() !== savedDate.toDateString()) {
                return this.resetUsage();
            }
            return usage;
        }
        return this.resetUsage();
    }

    // FREEMIUM: Reset daily usage
    resetUsage() {
        const usage = {
            triesUsed: 0,
            decksCreated: 0,
            resetDate: new Date().toISOString()
        };
        localStorage.setItem('presentationUsage', JSON.stringify(usage));
        return usage;
    }

    // FREEMIUM: Save usage
    saveUsage() {
        localStorage.setItem('presentationUsage', JSON.stringify(this.usage));
    }

    // FREEMIUM: Check if user can generate more decks today
    canGenerateDeck() {
        const limit = this.tierLimits[this.currentTier].triesPerDay;
        if (limit === -1) return true; // Unlimited
        return this.usage.triesUsed < limit;
    }

    // FREEMIUM: Get remaining tries today
    getRemainingTries() {
        const limit = this.tierLimits[this.currentTier].triesPerDay;
        if (limit === -1) return '∞';
        return Math.max(0, limit - this.usage.triesUsed);
    }

    // FREEMIUM: Get max slides allowed for tier
    getMaxSlides() {
        const max = this.tierLimits[this.currentTier].maxSlides;
        return max === -1 ? 50 : max; // 50 is the absolute max even for unlimited
    }

    // Get mini avatar SVG for chat (uses the animated avatar classes)
    getAvatarSVG(avatarKey, size = 50) {
        const color = this.avatarData[avatarKey]?.color || '#ff3333';

        // Mini animated avatar SVGs matching the main site avatars
        const avatars = {
            zac: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
                <defs>
                    <linearGradient id="zacHair" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a3728"/>
                        <stop offset="100%" style="stop-color:#2d1f15"/>
                    </linearGradient>
                    <linearGradient id="zacSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#f5d0b0"/>
                        <stop offset="100%" style="stop-color:#e8b896"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#1a1a2e"/>
                <ellipse cx="50" cy="58" rx="28" ry="32" fill="url(#zacSkin)"/>
                <path d="M22 40 Q50 10 78 40 Q75 25 50 22 Q25 25 22 40" fill="url(#zacHair)"/>
                <path d="M30 38 Q50 32 70 38 L68 48 Q50 42 32 48 Z" fill="url(#zacHair)"/>
                <ellipse cx="38" cy="52" rx="5" ry="6" fill="#fff"/>
                <ellipse cx="62" cy="52" rx="5" ry="6" fill="#fff"/>
                <circle cx="39" cy="53" r="3" fill="#3d2314"/>
                <circle cx="63" cy="53" r="3" fill="#3d2314"/>
                <circle cx="40" cy="52" r="1" fill="#fff"/>
                <circle cx="64" cy="52" r="1" fill="#fff"/>
                <path d="M45 68 Q50 72 55 68" stroke="#c9967a" stroke-width="2" fill="none"/>
                <path d="M44 72 Q50 78 56 72" stroke="#ff3333" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M50 82 L50 95 L46 98 L54 98 L50 95" fill="#ff3333"/>
            </svg>`,

            alaina: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
                <defs>
                    <linearGradient id="alainaHair" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8B4513"/>
                        <stop offset="100%" style="stop-color:#5D3A1A"/>
                    </linearGradient>
                    <linearGradient id="alainaSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffe4d0"/>
                        <stop offset="100%" style="stop-color:#f5d0b8"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#1a1a2e"/>
                <ellipse cx="50" cy="58" rx="26" ry="30" fill="url(#alainaSkin)"/>
                <path d="M20 45 Q20 15 50 15 Q80 15 80 45 L78 70 Q75 55 70 50 L70 45 Q70 30 50 28 Q30 30 30 45 L30 50 Q25 55 22 70 Z" fill="url(#alainaHair)"/>
                <ellipse cx="38" cy="52" rx="4" ry="5" fill="#fff"/>
                <ellipse cx="62" cy="52" rx="4" ry="5" fill="#fff"/>
                <circle cx="39" cy="53" r="2.5" fill="#4a7c59"/>
                <circle cx="63" cy="53" r="2.5" fill="#4a7c59"/>
                <circle cx="40" cy="52" r="0.8" fill="#fff"/>
                <circle cx="64" cy="52" r="0.8" fill="#fff"/>
                <path d="M32 46 Q38 44 42 46" stroke="#5D3A1A" stroke-width="1.5" fill="none"/>
                <path d="M58 46 Q62 44 68 46" stroke="#5D3A1A" stroke-width="1.5" fill="none"/>
                <ellipse cx="32" cy="58" rx="4" ry="2" fill="#ffb6c1" opacity="0.5"/>
                <ellipse cx="68" cy="58" rx="4" ry="2" fill="#ffb6c1" opacity="0.5"/>
                <path d="M45 72 Q50 76 55 72" stroke="#ff69b4" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`,

            bolt: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
                <defs>
                    <linearGradient id="boltGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffd700"/>
                        <stop offset="100%" style="stop-color:#ff8c00"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#1a1a2e"/>
                <circle cx="50" cy="50" r="35" fill="url(#boltGlow)" opacity="0.3"/>
                <path d="M55 20 L40 48 L50 48 L45 80 L60 45 L50 45 Z" fill="#ffd700" stroke="#ff8c00" stroke-width="2"/>
                <circle cx="38" cy="55" r="6" fill="#fff"/>
                <circle cx="62" cy="55" r="6" fill="#fff"/>
                <circle cx="39" cy="56" r="3.5" fill="#1a1a2e"/>
                <circle cx="63" cy="56" r="3.5" fill="#1a1a2e"/>
                <circle cx="40" cy="54" r="1.2" fill="#ffd700"/>
                <circle cx="64" cy="54" r="1.2" fill="#ffd700"/>
                <path d="M42 72 Q50 78 58 72" stroke="#ffd700" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>`,

            zeus: `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
                <defs>
                    <linearGradient id="zeusBeard" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#c0c0c0"/>
                        <stop offset="100%" style="stop-color:#808080"/>
                    </linearGradient>
                    <linearGradient id="zeusSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#f0d0b0"/>
                        <stop offset="100%" style="stop-color:#d4a574"/>
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="#1a1a2e"/>
                <ellipse cx="50" cy="55" rx="30" ry="35" fill="url(#zeusSkin)"/>
                <path d="M20 35 Q30 5 50 10 Q70 5 80 35 L75 45 Q50 38 25 45 Z" fill="url(#zeusBeard)"/>
                <path d="M30 65 Q50 90 70 65 Q65 80 50 85 Q35 80 30 65" fill="url(#zeusBeard)"/>
                <ellipse cx="38" cy="48" rx="5" ry="6" fill="#fff"/>
                <ellipse cx="62" cy="48" rx="5" ry="6" fill="#fff"/>
                <circle cx="39" cy="49" r="3" fill="#4169e1"/>
                <circle cx="63" cy="49" r="3" fill="#4169e1"/>
                <circle cx="40" cy="48" r="1" fill="#fff"/>
                <circle cx="64" cy="48" r="1" fill="#fff"/>
                <path d="M30 42 Q38 38 44 42" stroke="#808080" stroke-width="2.5" fill="none"/>
                <path d="M56 42 Q62 38 70 42" stroke="#808080" stroke-width="2.5" fill="none"/>
                <path d="M42 62 L45 58 L50 65 L55 58 L58 62" stroke="#9370db" stroke-width="2" fill="none"/>
            </svg>`
        };

        return avatars[avatarKey] || avatars.zac;
    }

    // PDF Upload and Processing
    async processPDF(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const arrayBuffer = await file.arrayBuffer();

                // Use PDF.js to extract content
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const extractedData = {
                    text: [],
                    pageCount: pdf.numPages,
                    images: [],
                    tables: []
                };

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);

                    // Extract text
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    extractedData.text.push({
                        page: i,
                        content: pageText
                    });

                    // Extract images (render page to canvas)
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                    // Store page as image for slide backgrounds
                    extractedData.images.push({
                        page: i,
                        dataUrl: canvas.toDataURL('image/jpeg', 0.8)
                    });
                }

                this.pdfData = extractedData;
                resolve(extractedData);
            } catch (error) {
                console.error('PDF processing error:', error);
                reject(error);
            }
        });
    }

    // Generate slides from PDF content
    generateSlidesFromPDF(pdfData, userPrompt) {
        const slides = [];

        // Title slide
        slides.push({
            title: 'Presentation',
            icon: '📋',
            type: 'title',
            content: userPrompt || 'Generated from PDF'
        });

        // Analyze text to create content slides
        pdfData.text.forEach((pageData, index) => {
            const text = pageData.content.trim();
            if (text.length > 50) {
                // Detect slide type based on content
                let slideType = 'bullets';
                let icon = '📝';

                if (text.match(/\d+%|\$[\d,]+|revenue|profit|growth/i)) {
                    slideType = 'kpi';
                    icon = '📊';
                } else if (text.match(/chart|graph|trend|analysis/i)) {
                    slideType = 'chart';
                    icon = '📈';
                } else if (text.match(/team|members|staff|department/i)) {
                    slideType = 'team';
                    icon = '👥';
                }

                // Extract a title from the first line or first ~50 chars
                const lines = text.split(/[.!?\n]/);
                const title = lines[0]?.substring(0, 60) || `Page ${index + 1}`;

                slides.push({
                    title: title.trim(),
                    icon: icon,
                    type: slideType,
                    content: text.substring(0, 500),
                    sourceImage: pdfData.images[index]?.dataUrl
                });
            }
        });

        // Summary slide
        slides.push({
            title: 'Key Takeaways',
            icon: '✅',
            type: 'bullets',
            content: 'Summary points from the document'
        });

        return slides;
    }

    // Handle PDF file upload
    handlePDFUpload(file) {
        if (!file || file.type !== 'application/pdf') {
            this.addMessage("Please upload a valid PDF file.", 'ai');
            return;
        }

        this.uploadedPDF = file;
        this.addMessage(`📄 I've received your PDF: "${file.name}". Processing it now...`, 'ai');

        this.showTyping();

        this.processPDF(file).then(pdfData => {
            this.hideTyping();
            const pageCount = pdfData.pageCount;
            const wordCount = pdfData.text.reduce((sum, p) => sum + p.content.split(' ').length, 0);

            this.addMessage(
                `I've analyzed your ${pageCount}-page PDF with approximately ${wordCount} words. ` +
                `I found text, images, and potential data visualizations. ` +
                `Now tell me what kind of presentation you'd like to create from this content!`,
                'ai'
            );
        }).catch(error => {
            this.hideTyping();
            this.addMessage("Sorry, I had trouble reading that PDF. Please try another file.", 'ai');
        });
    }

    // FREEMIUM: Show upgrade modal
    showUpgradeModal(reason = 'limit') {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <button class="upgrade-modal-close" onclick="this.closest('.upgrade-modal-overlay').remove()">&times;</button>
                <div class="upgrade-icon">🚀</div>
                <h2>${reason === 'limit' ? 'You\'ve Hit Your Limit!' : 'Upgrade to Unlock'}</h2>
                <p class="upgrade-subtitle">
                    ${reason === 'limit'
                        ? `You've created ${this.usage.slidesCreated} slides this month. Upgrade to create more amazing presentations!`
                        : 'This feature is available on higher tiers. Upgrade to unlock premium templates, unlimited slides, and more!'}
                </p>
                <div class="upgrade-tiers">
                    <div class="upgrade-tier">
                        <h3>⚡ Basic</h3>
                        <div class="tier-price">$29<span>/month</span></div>
                        <ul>
                            <li>✓ 20 slides/month</li>
                            <li>✓ 10 presentations</li>
                            <li>✓ Export to PPTX</li>
                            <li>✓ Remove watermark</li>
                        </ul>
                        <button onclick="showSignUp(); this.closest('.upgrade-modal-overlay').remove();" class="tier-btn basic">Get Basic</button>
                    </div>
                    <div class="upgrade-tier featured">
                        <div class="tier-badge">MOST POPULAR</div>
                        <h3>✨ Gold</h3>
                        <div class="tier-price">$49<span>/month</span></div>
                        <ul>
                            <li>✓ 100 slides/month</li>
                            <li>✓ 50 presentations</li>
                            <li>✓ Premium templates</li>
                            <li>✓ AI image generation</li>
                            <li>✓ Custom branding</li>
                        </ul>
                        <button onclick="showSignUp(); this.closest('.upgrade-modal-overlay').remove();" class="tier-btn gold">Get Gold</button>
                    </div>
                    <div class="upgrade-tier">
                        <h3>💎 Diamond</h3>
                        <div class="tier-price">$99<span>/month</span></div>
                        <ul>
                            <li>✓ Unlimited slides</li>
                            <li>✓ Unlimited presentations</li>
                            <li>✓ All premium features</li>
                            <li>✓ Priority support</li>
                            <li>✓ 1-on-1 coaching</li>
                        </ul>
                        <button onclick="showSignUp(); this.closest('.upgrade-modal-overlay').remove();" class="tier-btn diamond">Get Diamond</button>
                    </div>
                </div>
                <p class="upgrade-note">All plans include a 15-day free trial. No credit card required to start.</p>
            </div>
        `;
        document.body.appendChild(modal);
        this.addUpgradeModalStyles();
    }

    // FREEMIUM: Update usage display in header
    updateUsageDisplay() {
        const counter = document.getElementById('slide-usage-counter');
        if (counter) {
            const remaining = this.getRemainingTries();
            const limit = this.tierLimits[this.currentTier].triesPerDay;
            if (limit === -1) {
                counter.innerHTML = `<span class="usage-unlimited">∞ Unlimited Decks</span>`;
            } else {
                const percentage = (remaining / limit) * 100;
                let colorClass = 'usage-good';
                if (percentage <= 33) colorClass = 'usage-warning';
                if (percentage <= 0) colorClass = 'usage-empty';
                counter.innerHTML = `
                    <span class="${colorClass}">${remaining}/${limit} tries today</span>
                    <div class="usage-bar">
                        <div class="usage-fill ${colorClass}" style="width: ${Math.max(0, percentage)}%"></div>
                    </div>
                `;
            }
        }
    }

    // FREEMIUM: Add upgrade modal styles
    addUpgradeModalStyles() {
        if (document.getElementById('upgrade-modal-styles')) return;
        const styles = document.createElement('style');
        styles.id = 'upgrade-modal-styles';
        styles.textContent = `
            .upgrade-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 200000;
                animation: fadeIn 0.3s ease;
            }
            .upgrade-modal {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 24px;
                padding: 40px;
                max-width: 900px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                border: 2px solid rgba(255,51,51,0.3);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            .upgrade-modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                color: #888;
                font-size: 32px;
                cursor: pointer;
            }
            .upgrade-modal-close:hover { color: #ff3333; }
            .upgrade-icon {
                font-size: 64px;
                text-align: center;
                margin-bottom: 16px;
            }
            .upgrade-modal h2 {
                text-align: center;
                color: #fff;
                font-size: 2rem;
                margin-bottom: 8px;
            }
            .upgrade-subtitle {
                text-align: center;
                color: rgba(255,255,255,0.7);
                margin-bottom: 32px;
                font-size: 1.1rem;
            }
            .upgrade-tiers {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            .upgrade-tier {
                background: rgba(255,255,255,0.05);
                border: 2px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                padding: 24px;
                text-align: center;
                position: relative;
            }
            .upgrade-tier.featured {
                border-color: #ffd700;
                background: rgba(255,215,0,0.05);
                transform: scale(1.05);
            }
            .tier-badge {
                position: absolute;
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #000;
                padding: 4px 16px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 700;
            }
            .upgrade-tier h3 {
                color: #fff;
                margin-bottom: 12px;
                font-size: 1.3rem;
            }
            .tier-price {
                font-size: 2.5rem;
                font-weight: 800;
                color: #ff3333;
                margin-bottom: 16px;
            }
            .tier-price span {
                font-size: 1rem;
                font-weight: 400;
                color: rgba(255,255,255,0.5);
            }
            .upgrade-tier ul {
                list-style: none;
                padding: 0;
                margin: 0 0 20px 0;
                text-align: left;
            }
            .upgrade-tier li {
                color: rgba(255,255,255,0.8);
                padding: 8px 0;
                font-size: 0.9rem;
            }
            .tier-btn {
                width: 100%;
                padding: 14px;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
            }
            .tier-btn.basic {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                color: #fff;
            }
            .tier-btn.gold {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #000;
            }
            .tier-btn.diamond {
                background: linear-gradient(135deg, #fff, #e0e0e0);
                color: #000;
            }
            .tier-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(255,51,51,0.4);
            }
            .upgrade-note {
                text-align: center;
                color: rgba(255,255,255,0.5);
                font-size: 0.85rem;
                margin-top: 24px;
            }
            @media (max-width: 768px) {
                .upgrade-tiers {
                    grid-template-columns: 1fr;
                }
                .upgrade-tier.featured {
                    transform: scale(1);
                    order: -1;
                }
            }
        `;
        document.head.appendChild(styles);
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
                        <div id="slide-usage-counter" class="slide-usage-counter"></div>
                    </div>
                    <div class="ai-pres-chat-actions">
                        <button class="ai-pres-btn-upgrade" onclick="aiPresChat.showUpgradeModal('feature')" id="header-upgrade-btn">
                            <span>🚀</span>
                            <span>Upgrade</span>
                        </button>
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
                            <div class="ai-pres-avatar-img ai-pres-avatar-svg">
                                ${this.getAvatarSVG(this.currentAvatar, 70)}
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
                                <div class="ai-message-avatar ai-message-avatar-svg">
                                    ${this.getAvatarSVG(this.currentAvatar, 40)}
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

                        <!-- Slide Count Selector -->
                        <div class="slide-count-selector">
                            <span class="selector-label">Slides to generate:</span>
                            <div class="slide-count-buttons" id="slide-count-buttons">
                                <button class="slide-count-btn" data-count="3" onclick="aiPresChat.setSlideCount(3)">3</button>
                                <button class="slide-count-btn active" data-count="5" onclick="aiPresChat.setSlideCount(5)">5</button>
                                <button class="slide-count-btn" data-count="8" onclick="aiPresChat.setSlideCount(8)">8</button>
                                <button class="slide-count-btn" data-count="10" onclick="aiPresChat.setSlideCount(10)">10</button>
                                <button class="slide-count-btn" data-count="15" onclick="aiPresChat.setSlideCount(15)">15</button>
                            </div>
                            <span class="slide-limit-note" id="slide-limit-note">(max ${this.getMaxSlides()} for ${this.tierLimits[this.currentTier].name})</span>
                        </div>

                        <!-- Chat Input -->
                        <div class="ai-pres-chat-input-container">
                            <input type="file" id="pdf-upload-input" accept=".pdf" style="display:none" onchange="aiPresChat.handlePDFUpload(this.files[0])">
                            <button class="ai-pres-upload-btn" onclick="document.getElementById('pdf-upload-input').click()" title="Upload PDF">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                            </button>
                            <textarea
                                id="ai-pres-chat-input"
                                placeholder="Upload a PDF or describe your presentation... e.g., 'Create a Q4 financial report'"
                                rows="2"
                            ></textarea>
                            <button class="ai-pres-send-btn" onclick="aiPresChat.sendMessage()" id="ai-pres-send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div class="pdf-upload-hint">
                            <span>📄 Upload a PDF to extract content for your slides</span>
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
                                <div class="avatar-option-svg">${this.getAvatarSVG(key, 60)}</div>
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

            /* Upgrade Button */
            .ai-pres-btn-upgrade {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                border: none;
                color: #000;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 700;
                transition: all 0.2s;
                animation: upgradeGlow 2s ease-in-out infinite;
            }

            .ai-pres-btn-upgrade:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            }

            @keyframes upgradeGlow {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
                50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
            }

            /* Usage Counter */
            .slide-usage-counter {
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-left: 16px;
                padding-left: 16px;
                border-left: 1px solid rgba(255,255,255,0.2);
            }

            .slide-usage-counter span {
                font-size: 0.75rem;
                font-weight: 500;
            }

            .usage-good { color: #4ade80; }
            .usage-warning { color: #fbbf24; }
            .usage-empty { color: #ef4444; }
            .usage-unlimited { color: #ffd700; }

            .usage-bar {
                width: 80px;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
            }

            .usage-fill {
                height: 100%;
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            .usage-fill.usage-good { background: #4ade80; }
            .usage-fill.usage-warning { background: #fbbf24; }
            .usage-fill.usage-empty { background: #ef4444; }

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

            /* PDF Upload Button */
            .ai-pres-upload-btn {
                width: 48px;
                height: 48px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 12px;
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                flex-shrink: 0;
            }

            .ai-pres-upload-btn:hover {
                background: rgba(255,51,51,0.2);
                border-color: #ff3333;
            }

            .pdf-upload-hint {
                text-align: center;
                padding: 8px;
                color: rgba(255,255,255,0.5);
                font-size: 0.8rem;
            }

            /* SVG Avatar Containers */
            .ai-pres-avatar-svg {
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
            }

            .ai-pres-avatar-svg svg {
                border-radius: 50%;
            }

            .ai-message-avatar-svg {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .avatar-option-svg {
                margin-bottom: 8px;
            }

            /* Slide Count Selector */
            .slide-count-selector {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                flex-wrap: wrap;
            }

            .selector-label {
                color: rgba(255,255,255,0.7);
                font-size: 0.85rem;
            }

            .slide-count-buttons {
                display: flex;
                gap: 8px;
            }

            .slide-count-btn {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.15);
                color: #ccc;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .slide-count-btn:hover {
                background: rgba(255,51,51,0.15);
                border-color: rgba(255,51,51,0.5);
            }

            .slide-count-btn.active {
                background: #ff3333;
                border-color: #ff3333;
                color: #fff;
            }

            .slide-count-btn.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .slide-limit-note {
                color: rgba(255,255,255,0.4);
                font-size: 0.75rem;
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
        this.currentTier = this.detectUserTier(); // Re-detect tier
        this.createInterface(); // Rebuild with current avatar
        document.getElementById('ai-pres-chat-modal').classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize usage display
        this.updateUsageDisplay();

        // Hide upgrade button for Diamond users
        const upgradeBtn = document.getElementById('header-upgrade-btn');
        if (upgradeBtn && this.currentTier === 'diamond') {
            upgradeBtn.style.display = 'none';
        }
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
                <div class="ai-message-avatar ai-message-avatar-svg">
                    ${this.getAvatarSVG(this.currentAvatar, 40)}
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
            <div class="ai-message-avatar ai-message-avatar-svg">
                ${this.getAvatarSVG(this.currentAvatar, 40)}
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
        // FREEMIUM: Check if user has tries left today
        if (!this.canGenerateDeck()) {
            this.hideTyping();
            this.addMessage(`You've used all ${this.tierLimits[this.currentTier].triesPerDay} deck generations for today! Come back tomorrow or upgrade for more.`, 'ai');
            this.showUpgradeModal('limit');
            return;
        }

        // Simulate API processing delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        this.hideTyping();

        // Generate intelligent slides based on prompt
        const slidesToCreate = this.createSlidesFromPrompt(prompt, this.selectedSlideCount);

        this.slides = slidesToCreate;

        // FREEMIUM: Update usage (count as one try)
        this.usage.triesUsed += 1;
        this.usage.decksCreated += 1;
        this.saveUsage();
        this.updateUsageDisplay();

        const avatar = this.avatarData[this.currentAvatar];
        let responseText = '';

        // Extract company name for personalized response
        const companyMatch = prompt.match(/(?:for|my company|called|named)\s+([A-Z][a-zA-Z\s]+?)(?:\s+a|\s+in|\s*,|$)/i);
        const companyName = companyMatch ? companyMatch[1].trim() : 'your company';

        switch (avatar.style) {
            case 'energetic':
                responseText = `Boom! 💥 I've created ${slidesToCreate.length} custom slides for ${companyName}! Check these out:`;
                break;
            case 'warm':
                responseText = `I've crafted ${slidesToCreate.length} beautiful slides tailored for ${companyName}. Here's what I've prepared:`;
                break;
            case 'fast':
                responseText = `Done! ${slidesToCreate.length} slides for ${companyName} - ready to impress:`;
                break;
            case 'powerful':
                responseText = `Behold! ${slidesToCreate.length} powerful slides for ${companyName} that will command attention:`;
                break;
            default:
                responseText = `I've generated ${slidesToCreate.length} customized slides for ${companyName}:`;
        }

        this.addMessageWithSlides(responseText, slidesToCreate);
        this.updateSlidesPanel();
    }

    // Intelligent slide generation from prompt
    createSlidesFromPrompt(prompt, targetSlideCount = 5) {
        const promptLower = prompt.toLowerCase();
        let slides = [];

        // Extract key information from prompt
        const extractedInfo = this.extractPromptInfo(prompt);

        // Always start with a title slide
        slides.push({
            title: extractedInfo.companyName || 'Presentation',
            subtitle: extractedInfo.presentationType || 'Business Overview',
            icon: '📋',
            type: 'title',
            content: extractedInfo.location ? `Based in ${extractedInfo.location}` : ''
        });

        // Generate slides based on what was requested
        const requestedSlides = this.parseRequestedSlides(prompt, extractedInfo);
        slides = slides.concat(requestedSlides);

        // Trim or pad to target count
        if (slides.length > targetSlideCount) {
            slides = slides.slice(0, targetSlideCount);
        } else {
            // Add relevant filler slides
            const fillerSlides = this.getFillerSlides(extractedInfo, targetSlideCount - slides.length);
            slides = slides.concat(fillerSlides);
        }

        return slides.slice(0, targetSlideCount);
    }

    // Extract useful information from the prompt
    extractPromptInfo(prompt) {
        const info = {
            companyName: null,
            location: null,
            industry: null,
            presentationType: null,
            topics: [],
            hasImages: false,
            hasCharts: false,
            hasComparison: false
        };

        // Extract company name
        const companyMatch = prompt.match(/(?:for|my company|called|named)\s+([A-Z][a-zA-Z\s]+?)(?:\s+a|\s+in|\s*,|$)/i);
        if (companyMatch) info.companyName = companyMatch[1].trim();

        // Extract location
        const locationMatch = prompt.match(/(?:in|located in|based in)\s+([A-Za-z\s,]+?)(?:\s*,|\s+need|\s+show|$)/i);
        if (locationMatch) info.location = locationMatch[1].trim();

        // Detect industry
        if (prompt.match(/vacation|rental|airbnb|hotel|hospitality/i)) info.industry = 'hospitality';
        if (prompt.match(/tech|software|saas|startup/i)) info.industry = 'tech';
        if (prompt.match(/real estate|property/i)) info.industry = 'real_estate';
        if (prompt.match(/retail|store|shop/i)) info.industry = 'retail';

        // Detect presentation type
        if (prompt.match(/status|update|progress/i)) info.presentationType = 'Status Update';
        if (prompt.match(/investor|pitch|funding/i)) info.presentationType = 'Investor Pitch';
        if (prompt.match(/financial|report|quarterly/i)) info.presentationType = 'Financial Report';
        if (prompt.match(/sales|revenue/i)) info.presentationType = 'Sales Report';
        if (prompt.match(/project|proposal/i)) info.presentationType = 'Project Proposal';

        // Detect specific requests
        info.hasImages = prompt.match(/picture|image|photo|visual/i) !== null;
        info.hasCharts = prompt.match(/chart|graph|pie|bar/i) !== null;
        info.hasComparison = prompt.match(/vs|versus|compare|comparison|fancy.*cheap|expensive.*affordable/i) !== null;

        // Extract specific topics mentioned
        const topicMatches = prompt.match(/(?:show|include|need|want)\s+([^,.]+)/gi);
        if (topicMatches) {
            info.topics = topicMatches.map(t => t.replace(/^(?:show|include|need|want)\s+/i, '').trim());
        }

        return info;
    }

    // Parse specific slides requested in prompt
    parseRequestedSlides(prompt, info) {
        const slides = [];
        const promptLower = prompt.toLowerCase();

        // Check for year-over-year
        if (promptLower.match(/year.over.year|yoy|year.*year/i)) {
            slides.push({
                title: `${info.companyName || 'Company'} - Year Over Year Performance`,
                icon: '📈',
                type: 'comparison',
                content: 'Year over year growth metrics and trends'
            });
        }

        // Check for pro forma
        if (promptLower.match(/pro.?forma|projection|forecast/i)) {
            slides.push({
                title: 'Pro Forma Projections',
                icon: '🔮',
                type: 'table',
                content: 'Financial projections and forecasts'
            });
        }

        // Check for pie chart / cost breakdown
        if (promptLower.match(/pie.*chart|cost.*chart|breakdown|expense/i)) {
            slides.push({
                title: 'Cost Breakdown',
                icon: '🥧',
                type: 'chart',
                chartType: 'pie',
                content: 'Expense distribution analysis'
            });
        }

        // Check for comparison (fancy vs cheap)
        if (info.hasComparison) {
            slides.push({
                title: 'Option Comparison',
                icon: '⚖️',
                type: 'comparison',
                content: 'Premium vs Standard options with pricing'
            });
            slides.push({
                title: 'Premium Option Features',
                icon: '✨',
                type: 'bullets',
                content: 'High-end features and benefits'
            });
            slides.push({
                title: 'Standard Option Features',
                icon: '💰',
                type: 'bullets',
                content: 'Budget-friendly option details'
            });
        }

        // Check for reasons/justification
        if (promptLower.match(/reason|why|justify|competition|competitor/i)) {
            slides.push({
                title: 'Why This Investment?',
                icon: '🎯',
                type: 'bullets',
                content: 'Key reasons and competitive analysis'
            });
        }

        // Check for images/visuals
        if (info.hasImages) {
            if (info.industry === 'hospitality' || promptLower.includes('beach')) {
                slides.push({
                    title: `${info.location || 'Property'} Visual Gallery`,
                    icon: '🏖️',
                    type: 'gallery',
                    content: 'Property and location highlights'
                });
            } else {
                slides.push({
                    title: 'Visual Overview',
                    icon: '🖼️',
                    type: 'gallery',
                    content: 'Key visuals and imagery'
                });
            }
        }

        // Check for financing options
        if (promptLower.match(/financ|gate|loan|funding|invest/i)) {
            slides.push({
                title: 'Financing Options',
                icon: '💳',
                type: 'table',
                content: 'Available financing and payment structures'
            });
        }

        return slides;
    }

    // Get filler slides based on context
    getFillerSlides(info, count) {
        const fillers = [];
        const allFillers = [
            { title: 'Executive Summary', icon: '📋', type: 'bullets', content: 'Key highlights and overview' },
            { title: 'Market Analysis', icon: '📊', type: 'chart', content: 'Industry trends and positioning' },
            { title: 'Key Metrics', icon: '🎯', type: 'kpi', content: 'Performance indicators' },
            { title: 'Timeline', icon: '📅', type: 'timeline', content: 'Project milestones and schedule' },
            { title: 'Next Steps', icon: '➡️', type: 'bullets', content: 'Action items and recommendations' },
            { title: 'Contact Information', icon: '📧', type: 'contact', content: 'Get in touch' }
        ];

        // Add industry-specific fillers
        if (info.industry === 'hospitality') {
            allFillers.unshift(
                { title: 'Property Overview', icon: '🏠', type: 'bullets', content: 'Property details and amenities' },
                { title: 'Occupancy Rates', icon: '📈', type: 'chart', content: 'Booking and occupancy trends' },
                { title: 'Guest Reviews', icon: '⭐', type: 'bullets', content: 'Customer testimonials and ratings' }
            );
        }

        for (let i = 0; i < count && i < allFillers.length; i++) {
            fillers.push(allFillers[i]);
        }

        return fillers;
    }

    // Legacy method for backward compatibility
    createSlidesFromPromptLegacy(prompt) {
        const promptLower = prompt.toLowerCase();
        let slides = [];

        if (promptLower.includes('sales') || promptLower.includes('kpi')) {
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

    setSlideCount(count) {
        const maxSlides = this.getMaxSlides();
        if (count > maxSlides) {
            this.showUpgradeModal('feature');
            return;
        }

        this.selectedSlideCount = count;

        // Update button states
        document.querySelectorAll('.slide-count-btn').forEach(btn => {
            const btnCount = parseInt(btn.dataset.count);
            btn.classList.toggle('active', btnCount === count);
            btn.classList.toggle('disabled', btnCount > maxSlides);
        });
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

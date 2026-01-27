/**
 * Presentation Showcase - Front and Center Hero Section
 * The BEST AI Presentation Builder - Lightning Ledgerz
 *
 * Strategy: Make it SO OBVIOUS this is better than Gamma, Beautiful.ai, PopAI
 */

class PresentationShowcase {
    constructor() {
        this.currentSlide = 0;
        this.demoSlides = [
            {
                title: 'Q4 Financial Performance',
                subtitle: 'Executive Summary',
                type: 'title',
                theme: 'executive',
                icon: '📊'
            },
            {
                title: 'Revenue Growth',
                subtitle: '+47% YoY',
                type: 'kpi',
                theme: 'executive',
                value: '$12.4M',
                change: '+47%',
                icon: '📈'
            },
            {
                title: 'Revenue by Segment',
                type: 'donut',
                theme: 'executive',
                data: [
                    { label: 'Enterprise', value: 45, color: '#4F46E5' },
                    { label: 'Mid-Market', value: 30, color: '#7C3AED' },
                    { label: 'SMB', value: 18, color: '#A78BFA' },
                    { label: 'Consumer', value: 7, color: '#C4B5FD' }
                ]
            },
            {
                title: 'Monthly Recurring Revenue',
                type: 'chart',
                theme: 'executive',
                trend: 'up'
            },
            {
                title: 'Key Recommendations',
                type: 'bullets',
                theme: 'executive',
                bullets: [
                    'Expand enterprise sales team by 40%',
                    'Launch mid-market self-serve portal',
                    'Invest $2M in product development'
                ]
            }
        ];

        this.themes = [
            { id: 'executive', name: 'Executive Blue', primary: '#0066CC', bg: '#f8f9fa' },
            { id: 'dark', name: 'Dark Mode', primary: '#8B5CF6', bg: '#0f0f0f' },
            { id: 'minimal', name: 'Minimal White', primary: '#1f2937', bg: '#ffffff' },
            { id: 'goldman', name: 'Goldman Style', primary: '#00205B', bg: '#f5f5f5' },
            { id: 'mckinsey', name: 'McKinsey Blue', primary: '#004B87', bg: '#ffffff' },
            { id: 'gradient', name: 'Modern Gradient', primary: '#6366f1', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
        ];

        this.init();
    }

    init() {
        this.injectShowcase();
        this.startAutoRotate();
    }

    injectShowcase() {
        // Find the AI Presentation section and replace/enhance it
        const existingSection = document.getElementById('ppt-showcase-section');
        if (existingSection) {
            existingSection.innerHTML = this.buildShowcaseHTML();
            this.attachEvents();
        }
    }

    buildShowcaseHTML() {
        return `
            <div class="pres-showcase-container">
                <!-- Hero Header -->
                <div class="pres-hero-header">
                    <div class="pres-hero-badge">
                        <span class="badge-icon">⚡</span>
                        <span class="badge-text">AI-POWERED</span>
                    </div>
                    <h1 class="pres-hero-title">
                        Create <span class="gradient-text">Stunning Presentations</span>
                        <br>in Seconds, Not Hours
                    </h1>
                    <p class="pres-hero-subtitle">
                        The most powerful AI presentation builder. McKinsey-quality slides,
                        beautiful charts with no gridlines, and consulting-grade templates.
                        <strong>Better than Gamma. Better than Beautiful.ai. Better than anything.</strong>
                    </p>

                    <!-- CTA Buttons -->
                    <div class="pres-hero-ctas">
                        <button class="pres-cta-primary" onclick="openAIPresentationChat()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            Start Creating - It's Free
                        </button>
                        <button class="pres-cta-secondary" onclick="this.closest('.pres-showcase-container').querySelector('.pres-demo-section').scrollIntoView({behavior:'smooth'})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            Watch Demo
                        </button>
                    </div>

                    <!-- Trust Badges -->
                    <div class="pres-trust-badges">
                        <div class="trust-item">
                            <span class="trust-number">50+</span>
                            <span class="trust-label">Templates</span>
                        </div>
                        <div class="trust-divider"></div>
                        <div class="trust-item">
                            <span class="trust-number">10K+</span>
                            <span class="trust-label">Decks Created</span>
                        </div>
                        <div class="trust-divider"></div>
                        <div class="trust-item">
                            <span class="trust-number">4.9★</span>
                            <span class="trust-label">User Rating</span>
                        </div>
                    </div>
                </div>

                <!-- Live Demo Section -->
                <div class="pres-demo-section">
                    <div class="pres-demo-wrapper">
                        <!-- Left: Chat Interface Preview -->
                        <div class="pres-demo-chat">
                            <div class="demo-chat-header">
                                <div class="demo-avatar">
                                    <img src="zac_mps.jpg" alt="AI Assistant" onerror="this.innerHTML='⚡'">
                                </div>
                                <div class="demo-chat-title">
                                    <span class="chat-name">Zac</span>
                                    <span class="chat-status">Your AI Presentation Assistant</span>
                                </div>
                            </div>
                            <div class="demo-chat-messages">
                                <div class="demo-msg ai">
                                    <p>What kind of presentation do you need? I can create investor pitches, financial reports, sales decks, and more.</p>
                                </div>
                                <div class="demo-msg user">
                                    <p>Create a Q4 financial report with revenue breakdown and KPIs</p>
                                </div>
                                <div class="demo-msg ai typing">
                                    <p>Perfect! I'm generating your presentation now...</p>
                                    <div class="typing-dots"><span></span><span></span><span></span></div>
                                </div>
                            </div>
                            <div class="demo-chat-input">
                                <input type="text" placeholder="Describe your presentation..." readonly>
                                <button class="demo-send-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Right: Live Slide Preview -->
                        <div class="pres-demo-preview">
                            <div class="preview-toolbar">
                                <div class="preview-dots">
                                    <span class="dot red"></span>
                                    <span class="dot yellow"></span>
                                    <span class="dot green"></span>
                                </div>
                                <div class="preview-title">Live Preview</div>
                                <div class="preview-theme-select">
                                    <select id="demo-theme-select" onchange="presShowcase.changeTheme(this.value)">
                                        ${this.themes.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="preview-slide-container" id="demo-slide-container">
                                ${this.renderSlide(this.demoSlides[0])}
                            </div>
                            <div class="preview-slide-nav">
                                <button class="slide-nav-btn" onclick="presShowcase.prevSlide()">‹</button>
                                <div class="slide-indicators" id="slide-indicators">
                                    ${this.demoSlides.map((_, i) => `
                                        <span class="slide-dot ${i === 0 ? 'active' : ''}" onclick="presShowcase.goToSlide(${i})"></span>
                                    `).join('')}
                                </div>
                                <button class="slide-nav-btn" onclick="presShowcase.nextSlide()">›</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Feature Grid -->
                <div class="pres-features-grid">
                    <div class="pres-feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Consulting-Grade Quality</h3>
                        <p>McKinsey, BCG, and Bain-style templates. Pyramid principle structure. Executive summaries that impress.</p>
                    </div>
                    <div class="pres-feature-card">
                        <div class="feature-icon">📊</div>
                        <h3>Beautiful Data Viz</h3>
                        <p>No ugly gridlines. Gradient charts. Clean financials. Your data has never looked this good.</p>
                    </div>
                    <div class="pres-feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>AI-Powered Speed</h3>
                        <p>Describe what you need. Get a complete deck in seconds. Edit with natural language.</p>
                    </div>
                    <div class="pres-feature-card">
                        <div class="feature-icon">🎨</div>
                        <h3>Smart Auto-Formatting</h3>
                        <p>Like Beautiful.ai but better. Slides adapt to your content. Always perfectly balanced.</p>
                    </div>
                    <div class="pres-feature-card">
                        <div class="feature-icon">💼</div>
                        <h3>Industry Templates</h3>
                        <p>Real estate, SaaS, finance, consulting. Pre-built decks for every industry and use case.</p>
                    </div>
                    <div class="pres-feature-card">
                        <div class="feature-icon">📤</div>
                        <h3>Export Anywhere</h3>
                        <p>PowerPoint, Google Slides, PDF. Your deck works everywhere, with real formulas intact.</p>
                    </div>
                </div>

                <!-- Template Gallery -->
                <div class="pres-template-gallery">
                    <h2 class="gallery-title">Start with a Template</h2>
                    <p class="gallery-subtitle">Professional templates designed by finance experts</p>

                    <div class="template-categories">
                        <button class="cat-btn active" data-cat="all">All</button>
                        <button class="cat-btn" data-cat="finance">Finance</button>
                        <button class="cat-btn" data-cat="investor">Investor</button>
                        <button class="cat-btn" data-cat="consulting">Consulting</button>
                        <button class="cat-btn" data-cat="sales">Sales</button>
                    </div>

                    <div class="template-grid" id="template-grid">
                        ${this.renderTemplateCards()}
                    </div>
                </div>

                <!-- Bottom CTA -->
                <div class="pres-bottom-cta">
                    <h2>Ready to Create Amazing Presentations?</h2>
                    <p>Join thousands of professionals who've upgraded their presentations</p>
                    <button class="pres-cta-primary large" onclick="openAIPresentationChat()">
                        ⚡ Start Creating for Free
                    </button>
                </div>
            </div>

            <style>
                .pres-showcase-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 4rem 2rem;
                }

                /* Hero Header */
                .pres-hero-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .pres-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, rgba(255,51,51,0.15), rgba(255,51,51,0.05));
                    border: 1px solid rgba(255,51,51,0.3);
                    padding: 8px 20px;
                    border-radius: 50px;
                    margin-bottom: 1.5rem;
                }

                .badge-icon {
                    font-size: 1.2rem;
                }

                .badge-text {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #ff3333;
                    letter-spacing: 1px;
                }

                .pres-hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    color: #fff;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #ff3333, #ff6b6b, #ffd700);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .pres-hero-subtitle {
                    font-size: 1.25rem;
                    color: rgba(255,255,255,0.7);
                    max-width: 700px;
                    margin: 0 auto 2rem;
                    line-height: 1.6;
                }

                .pres-hero-subtitle strong {
                    color: #fff;
                }

                /* CTA Buttons */
                .pres-hero-ctas {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .pres-cta-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #ff3333, #cc0000);
                    color: #fff;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 20px rgba(255,51,51,0.4);
                }

                .pres-cta-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(255,51,51,0.5);
                }

                .pres-cta-primary.large {
                    padding: 20px 48px;
                    font-size: 1.2rem;
                }

                .pres-cta-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border: 2px solid rgba(255,255,255,0.2);
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .pres-cta-secondary:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.4);
                }

                /* Trust Badges */
                .pres-trust-badges {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .trust-item {
                    text-align: center;
                }

                .trust-number {
                    display: block;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #ff3333;
                }

                .trust-label {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.5);
                }

                .trust-divider {
                    width: 1px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                }

                /* Demo Section */
                .pres-demo-section {
                    margin-bottom: 4rem;
                }

                .pres-demo-wrapper {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 2rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    overflow: hidden;
                }

                /* Chat Demo */
                .pres-demo-chat {
                    background: rgba(0,0,0,0.3);
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid rgba(255,255,255,0.1);
                }

                .demo-chat-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .demo-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid #ff3333;
                }

                .demo-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .chat-name {
                    display: block;
                    color: #fff;
                    font-weight: 700;
                }

                .chat-status {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.5);
                }

                .demo-chat-messages {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .demo-msg {
                    max-width: 85%;
                }

                .demo-msg.ai {
                    align-self: flex-start;
                }

                .demo-msg.user {
                    align-self: flex-end;
                }

                .demo-msg p {
                    padding: 12px 16px;
                    border-radius: 16px;
                    margin: 0;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .demo-msg.ai p {
                    background: rgba(255,255,255,0.08);
                    color: #e0e0e0;
                    border-bottom-left-radius: 4px;
                }

                .demo-msg.user p {
                    background: linear-gradient(135deg, #ff3333, #cc0000);
                    color: #fff;
                    border-bottom-right-radius: 4px;
                }

                .demo-msg.typing .typing-dots {
                    display: flex;
                    gap: 4px;
                    margin-top: 8px;
                }

                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    background: #ff3333;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite;
                }

                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingBounce {
                    0%, 100% { transform: translateY(0); opacity: 0.4; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }

                .demo-chat-input {
                    display: flex;
                    gap: 10px;
                    padding: 16px 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .demo-chat-input input {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: #fff;
                    font-size: 0.95rem;
                }

                .demo-send-btn {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #ff3333, #cc0000);
                    border: none;
                    border-radius: 10px;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Preview Section */
                .pres-demo-preview {
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }

                .preview-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .preview-dots {
                    display: flex;
                    gap: 6px;
                }

                .preview-dots .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .dot.red { background: #ff5f57; }
                .dot.yellow { background: #febc2e; }
                .dot.green { background: #28c840; }

                .preview-title {
                    flex: 1;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                }

                .preview-theme-select select {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    cursor: pointer;
                }

                .preview-slide-container {
                    flex: 1;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    min-height: 350px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }

                .preview-slide-nav {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin-top: 16px;
                }

                .slide-nav-btn {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .slide-nav-btn:hover {
                    background: rgba(255,51,51,0.2);
                    border-color: #ff3333;
                }

                .slide-indicators {
                    display: flex;
                    gap: 8px;
                }

                .slide-dot {
                    width: 10px;
                    height: 10px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .slide-dot.active {
                    background: #ff3333;
                    transform: scale(1.2);
                }

                /* Slide Content Styles */
                .slide-content {
                    width: 100%;
                    height: 100%;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                }

                .slide-content.title-slide {
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: linear-gradient(135deg, #0066CC 0%, #004999 100%);
                    color: #fff;
                }

                .slide-content.title-slide h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .slide-content.title-slide p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }

                .slide-content.kpi-slide {
                    background: #f8f9fa;
                    justify-content: center;
                    align-items: center;
                }

                .kpi-card {
                    text-align: center;
                }

                .kpi-value {
                    font-size: 4rem;
                    font-weight: 800;
                    color: #0066CC;
                }

                .kpi-change {
                    font-size: 1.5rem;
                    color: #10b981;
                    font-weight: 600;
                }

                .kpi-label {
                    font-size: 1.2rem;
                    color: #666;
                    margin-top: 0.5rem;
                }

                .slide-content.donut-slide {
                    background: #f8f9fa;
                }

                .donut-slide h2 {
                    color: #333;
                    margin-bottom: 20px;
                }

                .donut-chart-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                }

                .donut-legend {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .legend-color {
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                }

                .legend-label {
                    color: #333;
                    font-size: 0.95rem;
                }

                .legend-value {
                    color: #666;
                    font-weight: 600;
                    margin-left: auto;
                }

                /* Features Grid */
                .pres-features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }

                .pres-feature-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 28px;
                    transition: all 0.3s;
                }

                .pres-feature-card:hover {
                    background: rgba(255,51,51,0.05);
                    border-color: rgba(255,51,51,0.3);
                    transform: translateY(-5px);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 16px;
                }

                .pres-feature-card h3 {
                    color: #fff;
                    font-size: 1.15rem;
                    margin-bottom: 8px;
                }

                .pres-feature-card p {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin: 0;
                }

                /* Template Gallery */
                .pres-template-gallery {
                    margin-bottom: 4rem;
                }

                .gallery-title {
                    text-align: center;
                    color: #fff;
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .gallery-subtitle {
                    text-align: center;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 2rem;
                }

                .template-categories {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .cat-btn {
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 25px;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .cat-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                }

                .cat-btn.active {
                    background: #ff3333;
                    border-color: #ff3333;
                    color: #fff;
                }

                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }

                .template-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .template-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(255,51,51,0.5);
                    box-shadow: 0 20px 50px rgba(255,51,51,0.2);
                }

                .template-preview {
                    aspect-ratio: 16/9;
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                }

                .template-info {
                    padding: 16px;
                }

                .template-name {
                    color: #fff;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .template-desc {
                    color: rgba(255,255,255,0.5);
                    font-size: 0.85rem;
                }

                /* Bottom CTA */
                .pres-bottom-cta {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, rgba(255,51,51,0.1), rgba(255,51,51,0.05));
                    border-radius: 24px;
                    border: 1px solid rgba(255,51,51,0.2);
                }

                .pres-bottom-cta h2 {
                    color: #fff;
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .pres-bottom-cta p {
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 2rem;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .pres-demo-wrapper {
                        grid-template-columns: 1fr;
                    }

                    .pres-demo-chat {
                        border-right: none;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                    }

                    .pres-features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .pres-hero-title {
                        font-size: 2.2rem;
                    }

                    .pres-hero-subtitle {
                        font-size: 1rem;
                    }

                    .pres-features-grid {
                        grid-template-columns: 1fr;
                    }

                    .pres-hero-ctas {
                        flex-direction: column;
                        align-items: center;
                    }

                    .pres-cta-primary, .pres-cta-secondary {
                        width: 100%;
                        max-width: 300px;
                        justify-content: center;
                    }
                }
            </style>
        `;
    }

    renderSlide(slide) {
        switch(slide.type) {
            case 'title':
                return `
                    <div class="slide-content title-slide">
                        <h1>${slide.title}</h1>
                        <p>${slide.subtitle}</p>
                    </div>
                `;
            case 'kpi':
                return `
                    <div class="slide-content kpi-slide">
                        <h2 style="color:#333;margin-bottom:20px;">${slide.title}</h2>
                        <div class="kpi-card">
                            <div class="kpi-value">${slide.value}</div>
                            <div class="kpi-change">${slide.change}</div>
                            <div class="kpi-label">${slide.subtitle}</div>
                        </div>
                    </div>
                `;
            case 'donut':
                return `
                    <div class="slide-content donut-slide">
                        <h2>${slide.title}</h2>
                        <div class="donut-chart-container">
                            <svg width="180" height="180" viewBox="0 0 180 180">
                                ${this.renderDonutChart(slide.data)}
                            </svg>
                            <div class="donut-legend">
                                ${slide.data.map(d => `
                                    <div class="legend-item">
                                        <div class="legend-color" style="background:${d.color}"></div>
                                        <span class="legend-label">${d.label}</span>
                                        <span class="legend-value">${d.value}%</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            case 'chart':
                return `
                    <div class="slide-content" style="background:#f8f9fa;">
                        <h2 style="color:#333;margin-bottom:20px;">${slide.title}</h2>
                        <div style="flex:1;display:flex;align-items:flex-end;gap:20px;padding:20px;">
                            ${[40, 55, 45, 65, 75, 60, 85, 90, 80, 95, 100, 110].map((h, i) => `
                                <div style="flex:1;background:linear-gradient(180deg, #0066CC, #004999);height:${h}%;border-radius:8px 8px 0 0;"></div>
                            `).join('')}
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:0 20px;color:#666;font-size:0.8rem;">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>
                `;
            case 'bullets':
                return `
                    <div class="slide-content" style="background:#f8f9fa;">
                        <h2 style="color:#333;margin-bottom:30px;">${slide.title}</h2>
                        <div style="display:flex;flex-direction:column;gap:20px;">
                            ${slide.bullets.map((b, i) => `
                                <div style="display:flex;align-items:center;gap:16px;">
                                    <div style="width:40px;height:40px;background:#0066CC;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;">${i+1}</div>
                                    <span style="color:#333;font-size:1.1rem;">${b}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            default:
                return `<div class="slide-content title-slide"><h1>${slide.title}</h1></div>`;
        }
    }

    renderDonutChart(data) {
        let currentAngle = 0;
        const centerX = 90;
        const centerY = 90;
        const outerRadius = 80;
        const innerRadius = 50;

        return data.map(segment => {
            const angle = (segment.value / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startOuter = this.polarToCartesian(centerX, centerY, outerRadius, startAngle);
            const endOuter = this.polarToCartesian(centerX, centerY, outerRadius, endAngle);
            const startInner = this.polarToCartesian(centerX, centerY, innerRadius, endAngle);
            const endInner = this.polarToCartesian(centerX, centerY, innerRadius, startAngle);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const path = [
                `M ${startOuter.x} ${startOuter.y}`,
                `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                `L ${startInner.x} ${startInner.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
                'Z'
            ].join(' ');

            return `<path d="${path}" fill="${segment.color}" />`;
        }).join('');
    }

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    renderTemplateCards() {
        const templates = [
            { name: 'Investor Pitch Deck', desc: 'Series A/B fundraising', icon: '🚀', cat: 'investor' },
            { name: 'Financial Report', desc: 'Quarterly P&L, KPIs', icon: '📊', cat: 'finance' },
            { name: 'McKinsey Strategy', desc: 'Consulting framework', icon: '📋', cat: 'consulting' },
            { name: 'Sales Pipeline', desc: 'Revenue & forecasts', icon: '💰', cat: 'sales' },
            { name: 'Board Presentation', desc: 'Executive summary', icon: '👔', cat: 'finance' },
            { name: 'Market Analysis', desc: 'TAM/SAM/SOM breakdown', icon: '🌍', cat: 'investor' },
            { name: 'BCG Matrix', desc: 'Portfolio analysis', icon: '📈', cat: 'consulting' },
            { name: 'Deal Review', desc: 'M&A presentation', icon: '🤝', cat: 'finance' }
        ];

        return templates.map(t => `
            <div class="template-card" data-cat="${t.cat}" onclick="openAIPresentationChat()">
                <div class="template-preview">${t.icon}</div>
                <div class="template-info">
                    <div class="template-name">${t.name}</div>
                    <div class="template-desc">${t.desc}</div>
                </div>
            </div>
        `).join('');
    }

    attachEvents() {
        // Category filtering
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.cat;
                document.querySelectorAll('.template-card').forEach(card => {
                    if (cat === 'all' || card.dataset.cat === cat) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.demoSlides.length);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.demoSlides.length) % this.demoSlides.length);
    }

    goToSlide(index) {
        this.currentSlide = index;
        const container = document.getElementById('demo-slide-container');
        if (container) {
            container.innerHTML = this.renderSlide(this.demoSlides[index]);
        }
        document.querySelectorAll('.slide-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    changeTheme(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        // Theme change logic - update slide colors
        console.log('Theme changed to:', theme);
    }

    startAutoRotate() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Initialize when DOM ready
let presShowcase;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        presShowcase = new PresentationShowcase();
    }, 500);
});

window.presShowcase = presShowcase;

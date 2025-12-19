// =====================================================
// LIGHTNING LEDGERZ - INVESTOR DECK PRO
// Professional VC/PE-ready pitch deck generator
// Sequoia/YC/a16z quality presentation templates
// =====================================================

class InvestorDeckPro {
    constructor() {
        this.deckTemplates = this.getTemplates();
        this.currentDeck = null;
        this.slides = [];
    }

    getTemplates() {
        return {
            seedPitch: {
                name: 'Seed Round Pitch',
                icon: '🌱',
                description: 'Perfect for pre-seed and seed stage startups',
                slides: [
                    { type: 'title', title: 'Company Name', subtitle: 'One-line description of what you do' },
                    { type: 'problem', title: 'The Problem', content: 'What pain point are you solving?' },
                    { type: 'solution', title: 'Our Solution', content: 'How you solve the problem' },
                    { type: 'market', title: 'Market Opportunity', content: 'TAM/SAM/SOM analysis' },
                    { type: 'product', title: 'Product', content: 'Demo or screenshots' },
                    { type: 'traction', title: 'Traction', content: 'Key metrics and milestones' },
                    { type: 'business-model', title: 'Business Model', content: 'How you make money' },
                    { type: 'team', title: 'Team', content: 'Founders and key hires' },
                    { type: 'ask', title: 'The Ask', content: 'Funding amount and use of funds' }
                ]
            },
            seriesA: {
                name: 'Series A Deck',
                icon: '🚀',
                description: 'For growth-stage startups with proven traction',
                slides: [
                    { type: 'title', title: 'Company Name', subtitle: 'Series A Funding Round' },
                    { type: 'vision', title: 'Vision', content: 'The future you are building' },
                    { type: 'problem', title: 'Problem', content: 'Market pain point' },
                    { type: 'solution', title: 'Solution', content: 'Your unique approach' },
                    { type: 'market', title: 'Market Size', content: '$XB total addressable market' },
                    { type: 'product', title: 'Product Deep Dive', content: 'Core features and technology' },
                    { type: 'traction', title: 'Traction & Metrics', content: 'Revenue, users, growth' },
                    { type: 'unit-economics', title: 'Unit Economics', content: 'LTV, CAC, payback period' },
                    { type: 'go-to-market', title: 'Go-to-Market', content: 'Distribution strategy' },
                    { type: 'competition', title: 'Competitive Landscape', content: 'Differentiation' },
                    { type: 'roadmap', title: 'Product Roadmap', content: 'Next 18 months' },
                    { type: 'team', title: 'Leadership Team', content: 'Experienced founders' },
                    { type: 'financials', title: 'Financial Projections', content: '3-year forecast' },
                    { type: 'ask', title: 'Investment Terms', content: 'Round size and valuation' }
                ]
            },
            boardMeeting: {
                name: 'Board Meeting Deck',
                icon: '🎯',
                description: 'Quarterly board meeting presentation',
                slides: [
                    { type: 'title', title: 'Q[X] Board Meeting', subtitle: 'Company Name | Date' },
                    { type: 'agenda', title: 'Agenda', content: 'Meeting topics' },
                    { type: 'highlights', title: 'Quarter Highlights', content: 'Key wins' },
                    { type: 'kpis', title: 'KPI Dashboard', content: 'Core metrics' },
                    { type: 'financials', title: 'Financial Performance', content: 'Revenue, burn, runway' },
                    { type: 'product', title: 'Product Update', content: 'Launches and roadmap' },
                    { type: 'sales', title: 'Sales & Pipeline', content: 'Deals and forecast' },
                    { type: 'team', title: 'Team & Hiring', content: 'Headcount and org changes' },
                    { type: 'challenges', title: 'Challenges', content: 'Issues and mitigation' },
                    { type: 'priorities', title: 'Next Quarter Priorities', content: 'Focus areas' },
                    { type: 'discussion', title: 'Discussion Items', content: 'Board input needed' }
                ]
            },
            dataDeck: {
                name: 'Data Room Deck',
                icon: '📊',
                description: 'Comprehensive due diligence materials',
                slides: [
                    { type: 'title', title: 'Investor Data Room', subtitle: 'Confidential Materials' },
                    { type: 'overview', title: 'Company Overview', content: 'Executive summary' },
                    { type: 'financials', title: 'Historical Financials', content: '3 years of data' },
                    { type: 'projections', title: 'Financial Projections', content: '5-year model' },
                    { type: 'metrics', title: 'Operating Metrics', content: 'Detailed KPIs' },
                    { type: 'cohorts', title: 'Cohort Analysis', content: 'Customer retention' },
                    { type: 'unit-economics', title: 'Unit Economics', content: 'CAC, LTV, payback' },
                    { type: 'customers', title: 'Customer Analysis', content: 'Top accounts' },
                    { type: 'market', title: 'Market Research', content: 'TAM analysis' },
                    { type: 'competition', title: 'Competitive Analysis', content: 'Landscape' },
                    { type: 'team', title: 'Team Bios', content: 'Leadership profiles' },
                    { type: 'cap-table', title: 'Cap Table', content: 'Ownership structure' },
                    { type: 'legal', title: 'Legal Overview', content: 'IP, contracts, compliance' }
                ]
            }
        };
    }

    // =====================================================
    // SLIDE CONTENT GENERATORS
    // =====================================================

    generateSlideContent(slideType, companyData = {}) {
        const generators = {
            title: () => this.generateTitleSlide(companyData),
            problem: () => this.generateProblemSlide(companyData),
            solution: () => this.generateSolutionSlide(companyData),
            market: () => this.generateMarketSlide(companyData),
            traction: () => this.generateTractionSlide(companyData),
            'unit-economics': () => this.generateUnitEconomicsSlide(companyData),
            financials: () => this.generateFinancialsSlide(companyData),
            team: () => this.generateTeamSlide(companyData),
            ask: () => this.generateAskSlide(companyData),
            kpis: () => this.generateKPISlide(companyData),
            competition: () => this.generateCompetitionSlide(companyData)
        };

        return generators[slideType] ? generators[slideType]() : this.generateGenericSlide(slideType, companyData);
    }

    generateTitleSlide(data) {
        return {
            layout: 'center',
            elements: [
                { type: 'logo', content: data.logo || '⚡' },
                { type: 'title', content: data.companyName || 'Lightning Ledgerz', style: 'font-size:48px;font-weight:700;' },
                { type: 'subtitle', content: data.tagline || 'AI-Powered Financial Intelligence Platform', style: 'font-size:24px;color:#888;' },
                { type: 'badge', content: data.roundType || 'Series A Financing', style: 'margin-top:40px;' }
            ]
        };
    }

    generateProblemSlide(data) {
        return {
            layout: 'two-column',
            elements: [
                { type: 'section-title', content: 'The Problem', style: 'color:#e63757;' },
                {
                    type: 'problem-points',
                    content: data.problems || [
                        { icon: '😤', text: 'CFOs spend 40+ hours/month on manual reporting' },
                        { icon: '📊', text: 'Financial data is scattered across 5+ tools' },
                        { icon: '💸', text: '$50B+ spent annually on outdated financial software' },
                        { icon: '⏰', text: 'Board reports take 2+ weeks to prepare' }
                    ]
                },
                {
                    type: 'statistic',
                    content: { value: '73%', label: 'of CFOs say manual processes hurt decision-making' }
                }
            ]
        };
    }

    generateSolutionSlide(data) {
        return {
            layout: 'feature-showcase',
            elements: [
                { type: 'section-title', content: 'Our Solution', style: 'color:#00d97e;' },
                { type: 'product-image', content: data.productImage || 'dashboard-preview' },
                {
                    type: 'features',
                    content: data.features || [
                        { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Automated insights from your data' },
                        { icon: '📈', title: 'Real-Time Dashboards', desc: 'Live financial visibility' },
                        { icon: '🎨', title: 'One-Click Reports', desc: 'Board-ready in minutes' },
                        { icon: '🔗', title: 'Seamless Integrations', desc: 'Connect your existing tools' }
                    ]
                }
            ]
        };
    }

    generateMarketSlide(data) {
        const marketData = data.market || {
            tam: 85000000000,
            sam: 12000000000,
            som: 1200000000
        };

        return {
            layout: 'market-size',
            elements: [
                { type: 'section-title', content: 'Market Opportunity' },
                {
                    type: 'tam-sam-som',
                    content: {
                        tam: { value: marketData.tam, label: 'Total Addressable Market', desc: 'Global financial software market' },
                        sam: { value: marketData.sam, label: 'Serviceable Addressable Market', desc: 'SMB financial reporting tools' },
                        som: { value: marketData.som, label: 'Serviceable Obtainable Market', desc: 'Year 5 target market share' }
                    }
                },
                {
                    type: 'market-trends',
                    content: [
                        { trend: 'Cloud Migration', growth: '+23% CAGR' },
                        { trend: 'AI Adoption', growth: '+35% CAGR' },
                        { trend: 'CFO Tech Stack', growth: '+18% CAGR' }
                    ]
                }
            ]
        };
    }

    generateTractionSlide(data) {
        const metrics = data.traction || {
            arr: 2400000,
            arrGrowth: 185,
            customers: 450,
            nrr: 125,
            logoRetention: 95
        };

        return {
            layout: 'metrics-grid',
            elements: [
                { type: 'section-title', content: 'Traction', style: 'color:#f39c12;' },
                {
                    type: 'metric-cards',
                    content: [
                        { value: '$' + (metrics.arr / 1000000).toFixed(1) + 'M', label: 'ARR', change: '+' + metrics.arrGrowth + '% YoY' },
                        { value: metrics.customers.toString(), label: 'Customers', change: '+142 this quarter' },
                        { value: metrics.nrr + '%', label: 'Net Revenue Retention', change: 'Top quartile' },
                        { value: metrics.logoRetention + '%', label: 'Logo Retention', change: 'Industry-leading' }
                    ]
                },
                {
                    type: 'growth-chart',
                    content: {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'],
                        data: [400, 650, 980, 1400, 1850, 2400]
                    }
                },
                {
                    type: 'customer-logos',
                    content: ['Fortune 500 Company', 'Series C Startup', 'PE-Backed Firm', 'Public Company']
                }
            ]
        };
    }

    generateUnitEconomicsSlide(data) {
        const economics = data.unitEconomics || {
            ltv: 48000,
            cac: 8500,
            payback: 8,
            grossMargin: 82
        };

        return {
            layout: 'unit-economics',
            elements: [
                { type: 'section-title', content: 'Unit Economics' },
                {
                    type: 'ltv-cac',
                    content: {
                        ltv: economics.ltv,
                        cac: economics.cac,
                        ratio: (economics.ltv / economics.cac).toFixed(1)
                    }
                },
                {
                    type: 'payback-visual',
                    content: {
                        months: economics.payback,
                        benchmark: 12
                    }
                },
                {
                    type: 'margin-breakdown',
                    content: {
                        gross: economics.grossMargin,
                        target: 80
                    }
                }
            ]
        };
    }

    generateFinancialsSlide(data) {
        const financials = data.financials || {
            years: ['2023A', '2024E', '2025E', '2026E', '2027E'],
            revenue: [2400000, 5800000, 12500000, 24000000, 42000000],
            grossProfit: [1920000, 4640000, 10000000, 19200000, 33600000],
            opex: [3200000, 5100000, 8500000, 14400000, 23100000],
            netIncome: [-1280000, -460000, 1500000, 4800000, 10500000]
        };

        return {
            layout: 'financials',
            elements: [
                { type: 'section-title', content: 'Financial Projections' },
                {
                    type: 'revenue-chart',
                    content: {
                        labels: financials.years,
                        datasets: [
                            { label: 'Revenue', data: financials.revenue },
                            { label: 'Gross Profit', data: financials.grossProfit }
                        ]
                    }
                },
                {
                    type: 'financial-table',
                    content: {
                        headers: financials.years,
                        rows: [
                            { label: 'Revenue', values: financials.revenue.map(v => '$' + (v / 1000000).toFixed(1) + 'M') },
                            { label: 'Gross Margin', values: financials.grossProfit.map((v, i) => Math.round(v / financials.revenue[i] * 100) + '%') },
                            { label: 'Net Income', values: financials.netIncome.map(v => '$' + (v / 1000000).toFixed(1) + 'M') }
                        ]
                    }
                },
                {
                    type: 'path-to-profitability',
                    content: {
                        breakeven: '2025',
                        cashflowPositive: 'Q2 2025'
                    }
                }
            ]
        };
    }

    generateTeamSlide(data) {
        const team = data.team || [
            { name: 'Jane Smith', role: 'CEO', bio: 'Ex-Stripe, Stanford MBA', image: null },
            { name: 'John Doe', role: 'CTO', bio: 'Ex-Google, MIT CS', image: null },
            { name: 'Sarah Johnson', role: 'CFO', bio: 'Ex-Goldman, CPA', image: null },
            { name: 'Mike Chen', role: 'VP Sales', bio: 'Ex-Salesforce, 10x quota', image: null }
        ];

        return {
            layout: 'team',
            elements: [
                { type: 'section-title', content: 'Leadership Team' },
                {
                    type: 'team-grid',
                    content: team
                },
                {
                    type: 'team-highlights',
                    content: [
                        '3x founders with successful exits',
                        'Team from Google, Stripe, Goldman',
                        '45 employees, adding 20 this year'
                    ]
                },
                {
                    type: 'advisors',
                    content: [
                        { name: 'Tom Jones', role: 'Former CFO, Netflix' },
                        { name: 'Lisa Wang', role: 'Partner, a16z' }
                    ]
                }
            ]
        };
    }

    generateAskSlide(data) {
        const ask = data.ask || {
            amount: 15000000,
            valuation: 75000000,
            runway: 24,
            useOfFunds: [
                { category: 'Engineering', percent: 45 },
                { category: 'Sales & Marketing', percent: 35 },
                { category: 'G&A', percent: 20 }
            ]
        };

        return {
            layout: 'the-ask',
            elements: [
                { type: 'section-title', content: 'The Ask' },
                {
                    type: 'funding-terms',
                    content: {
                        amount: ask.amount,
                        valuation: ask.valuation,
                        runway: ask.runway
                    }
                },
                {
                    type: 'use-of-funds',
                    content: ask.useOfFunds
                },
                {
                    type: 'milestones',
                    content: [
                        { milestone: '$10M ARR', timeline: '12 months' },
                        { milestone: 'Cash flow positive', timeline: '18 months' },
                        { milestone: 'Series B ready', timeline: '24 months' }
                    ]
                },
                {
                    type: 'investors',
                    content: data.existingInvestors || ['Seed Investor 1', 'Angel Syndicate']
                }
            ]
        };
    }

    generateKPISlide(data) {
        return {
            layout: 'kpi-dashboard',
            elements: [
                { type: 'section-title', content: 'Key Performance Indicators' },
                {
                    type: 'kpi-grid',
                    content: [
                        { name: 'MRR', value: '$200K', change: '+15%', status: 'on-track' },
                        { name: 'Customer Count', value: '450', change: '+23', status: 'ahead' },
                        { name: 'NRR', value: '125%', change: '+5pp', status: 'on-track' },
                        { name: 'Churn', value: '1.2%', change: '-0.3pp', status: 'on-track' },
                        { name: 'CAC Payback', value: '8 mo', change: '-2 mo', status: 'ahead' },
                        { name: 'Runway', value: '24 mo', change: 'Stable', status: 'on-track' }
                    ]
                },
                {
                    type: 'traffic-light',
                    content: {
                        green: ['Revenue', 'Retention', 'Unit Economics'],
                        yellow: ['Hiring'],
                        red: []
                    }
                }
            ]
        };
    }

    generateCompetitionSlide(data) {
        return {
            layout: 'competitive',
            elements: [
                { type: 'section-title', content: 'Competitive Landscape' },
                {
                    type: 'competitive-matrix',
                    content: {
                        xAxis: 'Ease of Use',
                        yAxis: 'Functionality',
                        competitors: [
                            { name: 'Us', x: 0.9, y: 0.85, size: 'large' },
                            { name: 'Legacy Player 1', x: 0.3, y: 0.7, size: 'medium' },
                            { name: 'Startup Competitor', x: 0.7, y: 0.5, size: 'small' },
                            { name: 'Enterprise Solution', x: 0.4, y: 0.9, size: 'large' }
                        ]
                    }
                },
                {
                    type: 'differentiation',
                    content: [
                        { factor: 'AI-Native', us: true, others: false },
                        { factor: 'Real-Time Data', us: true, others: false },
                        { factor: 'One-Click Reports', us: true, others: false },
                        { factor: 'Enterprise Scale', us: true, others: true }
                    ]
                },
                {
                    type: 'moat',
                    content: 'Proprietary AI models trained on 10M+ financial documents'
                }
            ]
        };
    }

    generateGenericSlide(type, data) {
        return {
            layout: 'standard',
            elements: [
                { type: 'section-title', content: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') },
                { type: 'content', content: 'Add your content here' }
            ]
        };
    }

    // =====================================================
    // DECK GENERATION
    // =====================================================

    generateDeck(templateId, companyData = {}) {
        const template = this.deckTemplates[templateId];
        if (!template) {
            throw new Error('Template not found');
        }

        this.currentDeck = {
            id: Date.now(),
            template: templateId,
            name: template.name,
            createdAt: new Date().toISOString(),
            slides: template.slides.map((slide, index) => ({
                ...slide,
                index,
                content: this.generateSlideContent(slide.type, companyData)
            }))
        };

        return this.currentDeck;
    }

    // =====================================================
    // UI RENDERING
    // =====================================================

    renderUI() {
        const container = document.createElement('div');
        container.id = 'investor-deck-modal';
        container.className = 'modal-enhanced';

        container.innerHTML = `
            <div class="modal-backdrop" onclick="window.investorDeckPro.closeUI()"></div>
            <div class="modal-content" style="max-width:900px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2 style="color:#f39c12;margin:0;">🎯 Investor Deck Pro</h2>
                    <button onclick="window.investorDeckPro.closeUI()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                </div>

                <p style="color:#888;margin-bottom:24px;">Create professional investor presentations in minutes. Choose a template to get started.</p>

                <div class="grid-responsive grid-2" style="gap:20px;">
                    ${Object.entries(this.deckTemplates).map(([id, template]) => `
                        <div class="glass-card" style="padding:24px;cursor:pointer;transition:all 0.3s;" onclick="window.investorDeckPro.startDeck('${id}')"
                             onmouseover="this.style.borderColor='#f39c12';this.style.transform='translateY(-4px)';"
                             onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.transform='translateY(0)';">
                            <div style="font-size:48px;margin-bottom:16px;">${template.icon}</div>
                            <h3 style="color:#fff;margin:0 0 8px 0;">${template.name}</h3>
                            <p style="color:#888;margin:0 0 16px 0;font-size:14px;">${template.description}</p>
                            <div style="color:#f39c12;font-size:13px;">${template.slides.length} slides</div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);">
                    <h3 style="color:#888;margin:0 0 16px 0;">Recent Decks</h3>
                    <div id="recent-decks" style="color:#666;">No recent decks. Create your first one above!</div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        setTimeout(() => container.classList.add('active'), 10);
    }

    startDeck(templateId) {
        const template = this.deckTemplates[templateId];

        // Update UI to show deck builder
        const content = document.querySelector('#investor-deck-modal .modal-content');
        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                <div>
                    <button onclick="window.investorDeckPro.renderUI()" style="background:none;border:none;color:#888;cursor:pointer;margin-right:12px;">← Back</button>
                    <span style="color:#f39c12;font-size:20px;font-weight:600;">${template.icon} ${template.name}</span>
                </div>
                <div style="display:flex;gap:12px;">
                    <button class="btn-fire" style="padding:10px 20px;" onclick="window.investorDeckPro.exportDeck()">
                        📥 Export to PowerPoint
                    </button>
                    <button onclick="window.investorDeckPro.closeUI()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:250px 1fr;gap:24px;">
                <!-- Slide Navigator -->
                <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;max-height:600px;overflow-y:auto;">
                    <div style="color:#888;font-size:12px;text-transform:uppercase;margin-bottom:12px;">Slides</div>
                    ${template.slides.map((slide, i) => `
                        <div class="slide-nav-item" data-index="${i}" onclick="window.investorDeckPro.selectSlide(${i})"
                             style="padding:12px;border-radius:8px;margin-bottom:8px;cursor:pointer;background:${i === 0 ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.02)'};border:1px solid ${i === 0 ? '#f39c12' : 'transparent'};">
                            <div style="font-size:11px;color:#666;">Slide ${i + 1}</div>
                            <div style="font-size:14px;color:#fff;">${slide.title}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Slide Preview -->
                <div id="slide-preview" style="background:#1a1a2e;border-radius:12px;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;padding:40px;">
                    ${this.renderSlidePreview(template.slides[0], 0)}
                </div>
            </div>

            <!-- Slide Editor -->
            <div id="slide-editor" style="margin-top:24px;background:rgba(255,255,255,0.03);border-radius:12px;padding:24px;">
                <h4 style="color:#f39c12;margin:0 0 16px 0;">Edit Slide Content</h4>
                <div class="grid-responsive grid-2" style="gap:16px;">
                    <div>
                        <label style="color:#888;font-size:13px;display:block;margin-bottom:8px;">Title</label>
                        <input type="text" id="slide-title-input" value="${template.slides[0].title}"
                               style="width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:16px;"
                               onchange="window.investorDeckPro.updateSlideTitle(this.value)">
                    </div>
                    <div>
                        <label style="color:#888;font-size:13px;display:block;margin-bottom:8px;">Subtitle</label>
                        <input type="text" id="slide-subtitle-input" value="${template.slides[0].subtitle || ''}"
                               style="width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:16px;"
                               onchange="window.investorDeckPro.updateSlideSubtitle(this.value)">
                    </div>
                </div>
            </div>
        `;

        this.currentDeck = this.generateDeck(templateId);
        this.selectedSlideIndex = 0;
    }

    renderSlidePreview(slide, index) {
        return `
            <div style="text-align:center;width:100%;">
                <div style="font-size:11px;color:#f39c12;margin-bottom:8px;">SLIDE ${index + 1}</div>
                <div style="font-size:32px;font-weight:700;color:#fff;margin-bottom:16px;">${slide.title}</div>
                ${slide.subtitle ? `<div style="font-size:18px;color:#888;">${slide.subtitle}</div>` : ''}
                ${slide.content ? `<div style="font-size:14px;color:#666;margin-top:24px;">${slide.content}</div>` : ''}
            </div>
        `;
    }

    selectSlide(index) {
        this.selectedSlideIndex = index;
        const slide = this.currentDeck.slides[index];

        // Update navigation
        document.querySelectorAll('.slide-nav-item').forEach((item, i) => {
            item.style.background = i === index ? 'rgba(243,156,18,0.2)' : 'rgba(255,255,255,0.02)';
            item.style.borderColor = i === index ? '#f39c12' : 'transparent';
        });

        // Update preview
        const preview = document.getElementById('slide-preview');
        if (preview) {
            preview.innerHTML = this.renderSlidePreview(slide, index);
        }

        // Update editor
        const titleInput = document.getElementById('slide-title-input');
        const subtitleInput = document.getElementById('slide-subtitle-input');
        if (titleInput) titleInput.value = slide.title;
        if (subtitleInput) subtitleInput.value = slide.subtitle || '';
    }

    updateSlideTitle(value) {
        if (this.currentDeck && this.selectedSlideIndex !== undefined) {
            this.currentDeck.slides[this.selectedSlideIndex].title = value;
            this.selectSlide(this.selectedSlideIndex);

            // Update nav item
            const navItem = document.querySelector(`.slide-nav-item[data-index="${this.selectedSlideIndex}"] div:last-child`);
            if (navItem) navItem.textContent = value;
        }
    }

    updateSlideSubtitle(value) {
        if (this.currentDeck && this.selectedSlideIndex !== undefined) {
            this.currentDeck.slides[this.selectedSlideIndex].subtitle = value;
            this.selectSlide(this.selectedSlideIndex);
        }
    }

    exportDeck() {
        if (!this.currentDeck) return;

        if (window.toast) {
            window.toast.success('Exporting Deck', 'Generating PowerPoint file...');
        }

        // Use PPTXGen if available
        if (typeof PptxGenJS !== 'undefined') {
            const pptx = new PptxGenJS();
            pptx.title = this.currentDeck.name;
            pptx.author = 'Lightning Ledgerz';

            this.currentDeck.slides.forEach((slide, i) => {
                const pptSlide = pptx.addSlide();
                pptSlide.background = { color: '0a0a15' };

                pptSlide.addText(slide.title, {
                    x: 0.5,
                    y: 2,
                    w: '90%',
                    h: 1,
                    fontSize: 36,
                    bold: true,
                    color: 'FFFFFF',
                    align: 'center'
                });

                if (slide.subtitle) {
                    pptSlide.addText(slide.subtitle, {
                        x: 0.5,
                        y: 3,
                        w: '90%',
                        h: 0.5,
                        fontSize: 18,
                        color: '888888',
                        align: 'center'
                    });
                }
            });

            pptx.writeFile({ fileName: `${this.currentDeck.name.replace(/\s+/g, '_')}.pptx` });

            if (window.toast) {
                window.toast.success('Download Complete', 'Your PowerPoint has been downloaded!');
            }
        } else {
            if (window.toast) {
                window.toast.error('Export Failed', 'PowerPoint generation library not loaded');
            }
        }
    }

    closeUI() {
        const modal = document.getElementById('investor-deck-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Initialize globally
window.investorDeckPro = new InvestorDeckPro();

// Add to command palette
document.addEventListener('DOMContentLoaded', () => {
    if (window.commandPalette) {
        window.commandPalette.commands.push({
            icon: '🎯',
            title: 'Investor Deck Pro',
            desc: 'Create professional investor presentations',
            action: () => window.investorDeckPro.renderUI()
        });
    }
});

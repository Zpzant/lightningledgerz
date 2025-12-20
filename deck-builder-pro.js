// =====================================================
// LIGHTNING LEDGERZ - PROFESSIONAL DECK BUILDER
// =====================================================
// Creates boardroom-ready presentations with professional templates

class ProDeckBuilder {
    constructor() {
        this.slides = [];
        this.currentSlideIndex = 0;
        this.companyName = '';
        this.companyLogo = null;
        this.theme = 'professional-blue'; // professional-blue, dark-mode, minimal-white
        this.isOpen = false;

        this.themes = {
            'professional-blue': {
                primary: '#0066CC',
                secondary: '#003366',
                accent: '#00A3E0',
                background: '#FFFFFF',
                text: '#1A1A1A',
                lightBg: '#F5F7FA',
                chartColors: ['#0066CC', '#00A3E0', '#7AB8E0', '#003366', '#4DA6FF', '#99CCFF']
            },
            'dark-mode': {
                primary: '#FF3333',
                secondary: '#1A1A1A',
                accent: '#FF6666',
                background: '#121212',
                text: '#FFFFFF',
                lightBg: '#2A2A2A',
                chartColors: ['#FF3333', '#FF6666', '#FF9999', '#CC0000', '#FF4444', '#FFCCCC']
            },
            'minimal-white': {
                primary: '#333333',
                secondary: '#666666',
                accent: '#0066CC',
                background: '#FFFFFF',
                text: '#1A1A1A',
                lightBg: '#F8F8F8',
                chartColors: ['#333333', '#666666', '#999999', '#CCCCCC', '#0066CC', '#4DA6FF']
            }
        };

        this.slideTemplates = [
            { id: 'title', name: 'Title Slide', icon: '📄', category: 'intro' },
            { id: 'agenda', name: 'Agenda', icon: '📋', category: 'intro' },
            { id: 'executive-summary', name: 'Executive Summary', icon: '📊', category: 'summary' },
            { id: 'kpi-dashboard', name: 'KPI Dashboard', icon: '📈', category: 'data' },
            { id: 'financial-summary', name: 'Financial Summary', icon: '💰', category: 'data' },
            { id: 'bar-chart', name: 'Bar Chart', icon: '📊', category: 'charts' },
            { id: 'line-chart', name: 'Line/Trend Chart', icon: '📈', category: 'charts' },
            { id: 'pie-chart', name: 'Pie/Donut Chart', icon: '🥧', category: 'charts' },
            { id: 'comparison', name: 'Side-by-Side Compare', icon: '⚖️', category: 'analysis' },
            { id: 'waterfall', name: 'Waterfall Chart', icon: '🌊', category: 'charts' },
            { id: 'global-map', name: 'World Map', icon: '🗺️', category: 'maps' },
            { id: 'us-map', name: 'US Map', icon: '🇺🇸', category: 'maps' },
            { id: 'process-flow', name: 'Process Flow', icon: '➡️', category: 'process' },
            { id: 'timeline', name: 'Timeline/Roadmap', icon: '🗓️', category: 'process' },
            { id: 'table-data', name: 'Data Table', icon: '📋', category: 'data' },
            { id: 'three-column', name: '3-Column Layout', icon: '▦', category: 'layout' },
            { id: 'two-column', name: '2-Column Layout', icon: '▤', category: 'layout' },
            { id: 'bullet-points', name: 'Key Points', icon: '•', category: 'content' },
            { id: 'quote', name: 'Quote/Highlight', icon: '❝', category: 'content' },
            { id: 'section-divider', name: 'Section Divider', icon: '➖', category: 'intro' },
            { id: 'thank-you', name: 'Thank You/Contact', icon: '🙏', category: 'closing' }
        ];
    }

    // Open the deck builder
    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.loadSavedDeck();
        this.render();
    }

    // Close the deck builder
    close() {
        const modal = document.getElementById('deck-builder-modal');
        if (modal) {
            modal.remove();
        }
        this.isOpen = false;
    }

    // Load saved deck from storage
    loadSavedDeck() {
        const saved = localStorage.getItem('proDeckData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.slides = data.slides || [];
                this.companyName = data.companyName || '';
                this.theme = data.theme || 'professional-blue';
            } catch (e) {
                this.initializeDefaultDeck();
            }
        } else {
            this.initializeDefaultDeck();
        }
    }

    // Initialize with default slides
    initializeDefaultDeck() {
        this.companyName = window.currentUserProfile?.company_name || 'Company Name';
        this.slides = [
            this.createSlide('title', {
                title: `${this.companyName} Financial Report`,
                subtitle: 'Q4 2024 Performance Review',
                date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }),
            this.createSlide('agenda', {
                title: 'Agenda',
                items: ['Financial Performance Overview', 'Revenue Analysis', 'Expense Breakdown', 'Key Metrics & KPIs', 'Outlook & Recommendations']
            }),
            this.createSlide('executive-summary', {
                title: 'Executive Summary',
                metrics: [
                    { label: 'Revenue', value: '$1.2M', change: '+15%', positive: true },
                    { label: 'Net Income', value: '$180K', change: '+22%', positive: true },
                    { label: 'Gross Margin', value: '42%', change: '+3%', positive: true },
                    { label: 'Operating Costs', value: '$850K', change: '-5%', positive: true }
                ],
                summary: 'Strong quarter with revenue exceeding targets by 15%. Cost optimization initiatives delivered $50K in savings.'
            }),
            this.createSlide('kpi-dashboard', {
                title: 'Key Performance Indicators',
                kpis: [
                    { label: 'Monthly Recurring Revenue', value: '$98K', target: '$95K', progress: 103 },
                    { label: 'Customer Acquisition Cost', value: '$245', target: '$300', progress: 122 },
                    { label: 'Customer Lifetime Value', value: '$2,450', target: '$2,000', progress: 123 },
                    { label: 'Churn Rate', value: '2.1%', target: '3%', progress: 143 },
                    { label: 'Net Promoter Score', value: '72', target: '65', progress: 111 },
                    { label: 'Employee Satisfaction', value: '4.2/5', target: '4.0', progress: 105 }
                ]
            }),
            this.createSlide('bar-chart', {
                title: 'Revenue by Quarter',
                chartData: {
                    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
                    datasets: [
                        { label: 'Revenue', values: [850000, 920000, 1050000, 1200000] },
                        { label: 'Target', values: [800000, 900000, 1000000, 1100000] }
                    ]
                },
                insight: 'Revenue grew 41% YoY, exceeding quarterly targets consistently'
            }),
            this.createSlide('pie-chart', {
                title: 'Revenue Breakdown by Segment',
                chartData: {
                    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Consumer'],
                    values: [45, 30, 18, 7]
                },
                insight: 'Enterprise segment continues to drive majority of revenue at 45%'
            }),
            this.createSlide('comparison', {
                title: 'Year-over-Year Comparison',
                leftColumn: {
                    header: '2023',
                    metrics: [
                        { label: 'Total Revenue', value: '$3.2M' },
                        { label: 'Gross Profit', value: '$1.28M' },
                        { label: 'Operating Expenses', value: '$980K' },
                        { label: 'Net Income', value: '$300K' }
                    ]
                },
                rightColumn: {
                    header: '2024',
                    metrics: [
                        { label: 'Total Revenue', value: '$4.5M', change: '+41%' },
                        { label: 'Gross Profit', value: '$1.89M', change: '+48%' },
                        { label: 'Operating Expenses', value: '$1.1M', change: '+12%' },
                        { label: 'Net Income', value: '$580K', change: '+93%' }
                    ]
                }
            }),
            this.createSlide('waterfall', {
                title: 'Bridge to Net Income',
                chartData: {
                    items: [
                        { label: 'Revenue', value: 1200000, type: 'start' },
                        { label: 'COGS', value: -480000, type: 'negative' },
                        { label: 'Gross Profit', value: 720000, type: 'subtotal' },
                        { label: 'Salaries', value: -320000, type: 'negative' },
                        { label: 'Marketing', value: -85000, type: 'negative' },
                        { label: 'Operations', value: -95000, type: 'negative' },
                        { label: 'Other', value: -40000, type: 'negative' },
                        { label: 'Net Income', value: 180000, type: 'total' }
                    ]
                }
            }),
            this.createSlide('timeline', {
                title: '2025 Strategic Roadmap',
                milestones: [
                    { quarter: 'Q1', title: 'Platform Expansion', description: 'Launch mobile app and API integrations' },
                    { quarter: 'Q2', title: 'Market Growth', description: 'Expand to 3 new geographic markets' },
                    { quarter: 'Q3', title: 'Product Innovation', description: 'Release AI-powered analytics suite' },
                    { quarter: 'Q4', title: 'Scale Operations', description: 'Achieve $2M MRR milestone' }
                ]
            }),
            this.createSlide('thank-you', {
                title: 'Thank You',
                subtitle: 'Questions?',
                contactEmail: window.currentUser?.email || 'contact@company.com',
                contactPhone: '(555) 123-4567'
            })
        ];
    }

    // Create a new slide
    createSlide(templateId, data = {}) {
        return {
            id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            template: templateId,
            data: data
        };
    }

    // Save deck to storage
    save() {
        const data = {
            slides: this.slides,
            companyName: this.companyName,
            theme: this.theme
        };
        localStorage.setItem('proDeckData', JSON.stringify(data));
        if (window.toast) {
            window.toast.success('Deck Saved', 'Your presentation has been saved');
        }
    }

    // Get current theme colors
    getTheme() {
        return this.themes[this.theme] || this.themes['professional-blue'];
    }

    // Render the deck builder UI
    render() {
        const existingModal = document.getElementById('deck-builder-modal');
        if (existingModal) existingModal.remove();

        const theme = this.getTheme();

        const modal = document.createElement('div');
        modal.id = 'deck-builder-modal';
        modal.innerHTML = `
            <style>
                #deck-builder-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.95);
                    z-index: 100000;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                .deck-header {
                    background: #1a1a1a;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #333;
                }
                .deck-header-left {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .deck-logo {
                    color: #ff3333;
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                .deck-title-input {
                    background: transparent;
                    border: 1px solid transparent;
                    color: #fff;
                    font-size: 1rem;
                    padding: 8px 12px;
                    border-radius: 4px;
                    width: 300px;
                }
                .deck-title-input:hover {
                    border-color: #444;
                }
                .deck-title-input:focus {
                    border-color: #ff3333;
                    outline: none;
                    background: #2a2a2a;
                }
                .deck-actions {
                    display: flex;
                    gap: 10px;
                }
                .deck-btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                .deck-btn-primary {
                    background: #ff3333;
                    color: white;
                }
                .deck-btn-primary:hover {
                    background: #cc0000;
                }
                .deck-btn-secondary {
                    background: #333;
                    color: #fff;
                    border: 1px solid #555;
                }
                .deck-btn-secondary:hover {
                    background: #444;
                }
                .deck-btn-close {
                    background: transparent;
                    color: #888;
                    font-size: 1.5rem;
                    padding: 4px 12px;
                }
                .deck-btn-close:hover {
                    color: #ff3333;
                }
                .deck-main {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }
                .deck-sidebar {
                    width: 220px;
                    background: #1a1a1a;
                    border-right: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-section {
                    padding: 12px;
                    border-bottom: 1px solid #333;
                }
                .sidebar-title {
                    color: #888;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                }
                .slide-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                }
                .slide-thumb {
                    background: #2a2a2a;
                    border: 2px solid transparent;
                    border-radius: 6px;
                    padding: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .slide-thumb:hover {
                    background: #333;
                }
                .slide-thumb.active {
                    border-color: #ff3333;
                    background: rgba(255,51,51,0.1);
                }
                .slide-thumb-num {
                    color: #666;
                    font-size: 0.75rem;
                    min-width: 20px;
                }
                .slide-thumb-preview {
                    width: 60px;
                    height: 34px;
                    background: #fff;
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.6rem;
                    color: #333;
                    overflow: hidden;
                }
                .slide-thumb-name {
                    flex: 1;
                    color: #ccc;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .slide-thumb-delete {
                    color: #666;
                    cursor: pointer;
                    padding: 2px 6px;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .slide-thumb:hover .slide-thumb-delete {
                    opacity: 1;
                }
                .slide-thumb-delete:hover {
                    color: #ff3333;
                }
                .deck-canvas {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #0a0a0a;
                    overflow: hidden;
                }
                .canvas-toolbar {
                    background: #1a1a1a;
                    padding: 8px 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #333;
                }
                .toolbar-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .toolbar-label {
                    color: #888;
                    font-size: 0.75rem;
                }
                .toolbar-select {
                    background: #2a2a2a;
                    border: 1px solid #444;
                    color: #fff;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }
                .canvas-preview {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                    overflow: auto;
                }
                .slide-preview-container {
                    width: 100%;
                    max-width: 960px;
                    aspect-ratio: 16/9;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    overflow: hidden;
                    position: relative;
                }
                .deck-templates-panel {
                    width: 280px;
                    background: #1a1a1a;
                    border-left: 1px solid #333;
                    overflow-y: auto;
                    padding: 15px;
                }
                .template-category {
                    margin-bottom: 20px;
                }
                .template-category-title {
                    color: #ff3333;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #333;
                }
                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                .template-item {
                    background: #2a2a2a;
                    border: 1px solid #444;
                    border-radius: 6px;
                    padding: 10px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                }
                .template-item:hover {
                    border-color: #ff3333;
                    background: rgba(255,51,51,0.1);
                }
                .template-icon {
                    font-size: 1.5rem;
                    margin-bottom: 5px;
                }
                .template-name {
                    color: #ccc;
                    font-size: 0.7rem;
                }
                .add-slide-btn {
                    width: 100%;
                    padding: 10px;
                    background: rgba(255,51,51,0.1);
                    border: 1px dashed #ff3333;
                    color: #ff3333;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    margin-top: 10px;
                    transition: all 0.2s;
                }
                .add-slide-btn:hover {
                    background: rgba(255,51,51,0.2);
                }

                /* Slide Content Styles */
                .slide-content {
                    width: 100%;
                    height: 100%;
                    padding: 40px;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                .slide-title-main {
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .slide-subtitle {
                    font-size: 1.2rem;
                    color: #666;
                }
            </style>

            <div class="deck-header">
                <div class="deck-header-left">
                    <span class="deck-logo">⚡ Pro Decks</span>
                    <input type="text" class="deck-title-input" value="${this.companyName} - Financial Report" placeholder="Presentation Title">
                </div>
                <div class="deck-actions">
                    <select class="toolbar-select" id="themeSelect" onchange="window.proDeckBuilder.changeTheme(this.value)">
                        <option value="professional-blue" ${this.theme === 'professional-blue' ? 'selected' : ''}>Professional Blue</option>
                        <option value="dark-mode" ${this.theme === 'dark-mode' ? 'selected' : ''}>Dark Mode</option>
                        <option value="minimal-white" ${this.theme === 'minimal-white' ? 'selected' : ''}>Minimal White</option>
                    </select>
                    <button class="deck-btn deck-btn-secondary" onclick="window.proDeckBuilder.save()">
                        💾 Save
                    </button>
                    <button class="deck-btn deck-btn-secondary" onclick="window.proDeckBuilder.presentMode()">
                        ▶️ Present
                    </button>
                    <button class="deck-btn deck-btn-primary" onclick="window.proDeckBuilder.exportPPTX()">
                        📥 Download PPTX
                    </button>
                    <button class="deck-btn deck-btn-close" onclick="window.proDeckBuilder.close()">×</button>
                </div>
            </div>

            <div class="deck-main">
                <div class="deck-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-title">Slides (${this.slides.length})</div>
                    </div>
                    <div class="slide-list" id="slideList">
                        ${this.renderSlideList()}
                    </div>
                    <div class="sidebar-section">
                        <button class="add-slide-btn" onclick="window.proDeckBuilder.showTemplateSelector()">
                            + Add Slide
                        </button>
                    </div>
                </div>

                <div class="deck-canvas">
                    <div class="canvas-toolbar">
                        <div class="toolbar-group">
                            <span class="toolbar-label">Slide ${this.currentSlideIndex + 1} of ${this.slides.length}</span>
                        </div>
                        <div class="toolbar-group" style="margin-left: auto;">
                            <button class="deck-btn deck-btn-secondary" onclick="window.proDeckBuilder.prevSlide()" ${this.currentSlideIndex === 0 ? 'disabled' : ''}>← Prev</button>
                            <button class="deck-btn deck-btn-secondary" onclick="window.proDeckBuilder.nextSlide()" ${this.currentSlideIndex >= this.slides.length - 1 ? 'disabled' : ''}>Next →</button>
                        </div>
                    </div>
                    <div class="canvas-preview">
                        <div class="slide-preview-container" id="slidePreview">
                            ${this.renderCurrentSlide()}
                        </div>
                    </div>
                </div>

                <div class="deck-templates-panel">
                    <div class="sidebar-title">Add New Slide</div>
                    ${this.renderTemplateCategories()}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Render slide thumbnail list
    renderSlideList() {
        return this.slides.map((slide, index) => {
            const template = this.slideTemplates.find(t => t.id === slide.template);
            const name = slide.data.title || template?.name || 'Untitled';
            return `
                <div class="slide-thumb ${index === this.currentSlideIndex ? 'active' : ''}"
                     onclick="window.proDeckBuilder.goToSlide(${index})">
                    <span class="slide-thumb-num">${index + 1}</span>
                    <div class="slide-thumb-preview">${template?.icon || '📄'}</div>
                    <span class="slide-thumb-name">${name}</span>
                    <span class="slide-thumb-delete" onclick="event.stopPropagation(); window.proDeckBuilder.deleteSlide(${index})">×</span>
                </div>
            `;
        }).join('');
    }

    // Render template categories
    renderTemplateCategories() {
        const categories = {
            intro: 'Opening',
            summary: 'Summary',
            data: 'Data & Metrics',
            charts: 'Charts',
            maps: 'Geographic Maps',
            analysis: 'Analysis',
            process: 'Process',
            layout: 'Layouts',
            content: 'Content',
            closing: 'Closing'
        };

        let html = '';

        // Add "From Your Data" section at top
        html += `
            <div class="template-category">
                <div class="template-category-title" style="color: #4caf50;">📤 From Your Data</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="template-item" onclick="window.openMapDataUpload()" style="display: flex; align-items: center; gap: 10px; padding: 12px;">
                        <div class="template-icon" style="font-size: 1.2rem;">🗺️</div>
                        <div>
                            <div class="template-name" style="font-size: 0.8rem; font-weight: 600;">Upload Geographic Data</div>
                            <div style="font-size: 0.65rem; color: #888;">CSV with locations & values</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        Object.entries(categories).forEach(([catId, catName]) => {
            const templates = this.slideTemplates.filter(t => t.category === catId);
            if (templates.length > 0) {
                html += `
                    <div class="template-category">
                        <div class="template-category-title">${catName}</div>
                        <div class="template-grid">
                            ${templates.map(t => `
                                <div class="template-item" onclick="window.proDeckBuilder.addSlideFromTemplate('${t.id}')">
                                    <div class="template-icon">${t.icon}</div>
                                    <div class="template-name">${t.name}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        return html;
    }

    // Render current slide
    renderCurrentSlide() {
        if (this.slides.length === 0) {
            return '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">No slides yet. Add a slide from the right panel.</div>';
        }

        const slide = this.slides[this.currentSlideIndex];
        const theme = this.getTheme();

        switch (slide.template) {
            case 'title':
                return this.renderTitleSlide(slide.data, theme);
            case 'agenda':
                return this.renderAgendaSlide(slide.data, theme);
            case 'executive-summary':
                return this.renderExecutiveSummarySlide(slide.data, theme);
            case 'kpi-dashboard':
                return this.renderKPIDashboardSlide(slide.data, theme);
            case 'financial-summary':
                return this.renderFinancialSummarySlide(slide.data, theme);
            case 'bar-chart':
                return this.renderBarChartSlide(slide.data, theme);
            case 'line-chart':
                return this.renderLineChartSlide(slide.data, theme);
            case 'pie-chart':
                return this.renderPieChartSlide(slide.data, theme);
            case 'comparison':
                return this.renderComparisonSlide(slide.data, theme);
            case 'waterfall':
                return this.renderWaterfallSlide(slide.data, theme);
            case 'timeline':
                return this.renderTimelineSlide(slide.data, theme);
            case 'section-divider':
                return this.renderSectionDividerSlide(slide.data, theme);
            case 'thank-you':
                return this.renderThankYouSlide(slide.data, theme);
            default:
                return this.renderGenericSlide(slide.data, theme);
        }
    }

    // SLIDE TEMPLATES

    renderTitleSlide(data, theme) {
        return `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; padding: 60px;">
                <div style="font-size: 3rem; font-weight: 700; margin-bottom: 20px; line-height: 1.2;">${data.title || 'Presentation Title'}</div>
                <div style="font-size: 1.5rem; opacity: 0.9; margin-bottom: 30px;">${data.subtitle || 'Subtitle'}</div>
                <div style="font-size: 1rem; opacity: 0.7;">${data.date || new Date().toLocaleDateString()}</div>
            </div>
        `;
    }

    renderAgendaSlide(data, theme) {
        const items = data.items || ['Item 1', 'Item 2', 'Item 3'];
        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 50px 60px;">
                <div style="font-size: 2rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 40px; padding-bottom: 15px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Agenda'}</div>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${items.map((item, i) => `
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div style="width: 50px; height: 50px; background: ${theme.primary}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.2rem;">${i + 1}</div>
                            <div style="font-size: 1.3rem; color: ${theme.text};">${item}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderExecutiveSummarySlide(data, theme) {
        const metrics = data.metrics || [];
        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Executive Summary'}</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
                    ${metrics.map(m => `
                        <div style="background: ${theme.lightBg}; border-radius: 8px; padding: 20px; text-align: center; border-left: 4px solid ${m.positive ? '#4CAF50' : '#f44336'};">
                            <div style="font-size: 0.85rem; color: #666; text-transform: uppercase; margin-bottom: 8px;">${m.label}</div>
                            <div style="font-size: 1.8rem; font-weight: 700; color: ${theme.text};">${m.value}</div>
                            <div style="font-size: 0.9rem; color: ${m.positive ? '#4CAF50' : '#f44336'}; margin-top: 5px;">${m.change}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="background: ${theme.lightBg}; border-radius: 8px; padding: 25px; border-left: 4px solid ${theme.primary};">
                    <div style="font-size: 0.85rem; color: ${theme.primary}; text-transform: uppercase; margin-bottom: 10px; font-weight: 600;">Key Takeaway</div>
                    <div style="font-size: 1.1rem; color: ${theme.text}; line-height: 1.6;">${data.summary || 'Add your executive summary here.'}</div>
                </div>
            </div>
        `;
    }

    renderKPIDashboardSlide(data, theme) {
        const kpis = data.kpis || [];
        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Key Performance Indicators'}</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    ${kpis.map(kpi => `
                        <div style="background: ${theme.lightBg}; border-radius: 8px; padding: 20px;">
                            <div style="font-size: 0.8rem; color: #666; text-transform: uppercase; margin-bottom: 10px;">${kpi.label}</div>
                            <div style="font-size: 1.6rem; font-weight: 700; color: ${theme.text}; margin-bottom: 10px;">${kpi.value}</div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${Math.min(kpi.progress, 100)}%; height: 100%; background: ${kpi.progress >= 100 ? '#4CAF50' : theme.primary}; border-radius: 4px;"></div>
                                </div>
                                <span style="font-size: 0.75rem; color: ${kpi.progress >= 100 ? '#4CAF50' : '#666'};">${kpi.progress}%</span>
                            </div>
                            <div style="font-size: 0.75rem; color: #888; margin-top: 8px;">Target: ${kpi.target}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFinancialSummarySlide(data, theme) {
        return this.renderExecutiveSummarySlide(data, theme);
    }

    renderBarChartSlide(data, theme) {
        const chartData = data.chartData || { labels: [], datasets: [] };
        const maxVal = Math.max(...chartData.datasets.flatMap(d => d.values));

        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Chart'}</div>
                <div style="display: flex; height: calc(100% - 120px); gap: 30px;">
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <div style="flex: 1; display: flex; align-items: flex-end; gap: 15px; padding-bottom: 20px;">
                            ${chartData.labels.map((label, i) => `
                                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                    <div style="display: flex; gap: 4px; align-items: flex-end; height: 200px;">
                                        ${chartData.datasets.map((ds, j) => {
                                            const height = (ds.values[i] / maxVal) * 100;
                                            return `<div style="width: 30px; height: ${height}%; background: ${theme.chartColors[j]}; border-radius: 3px 3px 0 0;"></div>`;
                                        }).join('')}
                                    </div>
                                    <div style="font-size: 0.75rem; color: #666; text-align: center;">${label}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="display: flex; justify-content: center; gap: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                            ${chartData.datasets.map((ds, j) => `
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div style="width: 12px; height: 12px; background: ${theme.chartColors[j]}; border-radius: 2px;"></div>
                                    <span style="font-size: 0.8rem; color: #666;">${ds.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ${data.insight ? `<div style="background: ${theme.lightBg}; padding: 15px 20px; border-radius: 6px; border-left: 4px solid ${theme.primary}; font-size: 0.9rem; color: ${theme.text}; margin-top: 15px;">${data.insight}</div>` : ''}
            </div>
        `;
    }

    renderLineChartSlide(data, theme) {
        return this.renderBarChartSlide(data, theme);
    }

    renderPieChartSlide(data, theme) {
        const chartData = data.chartData || { labels: [], values: [] };
        const total = chartData.values.reduce((a, b) => a + b, 0);
        let currentAngle = 0;

        // Generate conic gradient for pie chart
        let gradientStops = [];
        chartData.values.forEach((val, i) => {
            const angle = (val / total) * 360;
            gradientStops.push(`${theme.chartColors[i % theme.chartColors.length]} ${currentAngle}deg ${currentAngle + angle}deg`);
            currentAngle += angle;
        });

        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Distribution'}</div>
                <div style="display: flex; align-items: center; gap: 50px; height: calc(100% - 100px);">
                    <div style="width: 250px; height: 250px; border-radius: 50%; background: conic-gradient(${gradientStops.join(', ')}); position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; background: ${theme.background}; border-radius: 50%;"></div>
                    </div>
                    <div style="flex: 1;">
                        ${chartData.labels.map((label, i) => `
                            <div style="display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #eee;">
                                <div style="width: 16px; height: 16px; background: ${theme.chartColors[i % theme.chartColors.length]}; border-radius: 3px;"></div>
                                <span style="flex: 1; font-size: 1rem; color: ${theme.text};">${label}</span>
                                <span style="font-size: 1.1rem; font-weight: 600; color: ${theme.text};">${chartData.values[i]}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${data.insight ? `<div style="background: ${theme.lightBg}; padding: 15px 20px; border-radius: 6px; border-left: 4px solid ${theme.primary}; font-size: 0.9rem; color: ${theme.text};">${data.insight}</div>` : ''}
            </div>
        `;
    }

    renderComparisonSlide(data, theme) {
        const left = data.leftColumn || { header: 'Before', metrics: [] };
        const right = data.rightColumn || { header: 'After', metrics: [] };

        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Comparison'}</div>
                <div style="display: grid; grid-template-columns: 1fr 60px 1fr; gap: 0; height: calc(100% - 100px);">
                    <div style="background: ${theme.lightBg}; border-radius: 12px 0 0 12px; padding: 30px;">
                        <div style="font-size: 1.3rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 25px; text-align: center;">${left.header}</div>
                        ${left.metrics.map(m => `
                            <div style="padding: 15px 0; border-bottom: 1px solid #ddd;">
                                <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">${m.label}</div>
                                <div style="font-size: 1.4rem; font-weight: 600; color: ${theme.text};">${m.value}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="background: ${theme.primary}; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 2rem;">→</span>
                    </div>
                    <div style="background: ${theme.lightBg}; border-radius: 0 12px 12px 0; padding: 30px;">
                        <div style="font-size: 1.3rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 25px; text-align: center;">${right.header}</div>
                        ${right.metrics.map(m => `
                            <div style="padding: 15px 0; border-bottom: 1px solid #ddd;">
                                <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">${m.label}</div>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 1.4rem; font-weight: 600; color: ${theme.text};">${m.value}</span>
                                    ${m.change ? `<span style="font-size: 0.9rem; color: #4CAF50; font-weight: 600;">${m.change}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderWaterfallSlide(data, theme) {
        const items = data.chartData?.items || [];
        const maxVal = Math.max(...items.map(i => Math.abs(i.value)));

        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Waterfall Analysis'}</div>
                <div style="display: flex; align-items: flex-end; justify-content: space-around; height: calc(100% - 120px); padding: 20px 0;">
                    ${items.map((item, i) => {
                        const height = (Math.abs(item.value) / maxVal) * 60;
                        const color = item.type === 'negative' ? '#e53935' : item.type === 'subtotal' || item.type === 'total' ? theme.primary : '#4CAF50';
                        return `
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                <div style="font-size: 0.75rem; font-weight: 600; color: ${color};">$${(item.value / 1000).toFixed(0)}K</div>
                                <div style="width: 50px; height: ${height}%; background: ${color}; border-radius: 4px 4px 0 0;"></div>
                                <div style="font-size: 0.7rem; color: #666; text-align: center; max-width: 60px;">${item.label}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderTimelineSlide(data, theme) {
        const milestones = data.milestones || [];
        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 40px 50px;">
                <div style="font-size: 1.8rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 40px; padding-bottom: 10px; border-bottom: 3px solid ${theme.primary};">${data.title || 'Roadmap'}</div>
                <div style="display: flex; align-items: flex-start; gap: 0; position: relative;">
                    <div style="position: absolute; top: 25px; left: 0; right: 0; height: 4px; background: linear-gradient(to right, ${theme.primary}, ${theme.accent});"></div>
                    ${milestones.map((m, i) => `
                        <div style="flex: 1; position: relative; text-align: center; padding: 0 15px;">
                            <div style="width: 50px; height: 50px; background: ${theme.primary}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 15px; position: relative; z-index: 1; font-size: 0.85rem;">${m.quarter}</div>
                            <div style="font-size: 1rem; font-weight: 600; color: ${theme.text}; margin-bottom: 8px;">${m.title}</div>
                            <div style="font-size: 0.85rem; color: #666; line-height: 1.4;">${m.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSectionDividerSlide(data, theme) {
        return `
            <div style="width: 100%; height: 100%; background: ${theme.primary}; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; padding: 60px;">
                <div style="font-size: 4rem; font-weight: 700;">${data.title || 'Section Title'}</div>
                ${data.subtitle ? `<div style="font-size: 1.5rem; opacity: 0.8; margin-top: 20px;">${data.subtitle}</div>` : ''}
            </div>
        `;
    }

    renderThankYouSlide(data, theme) {
        return `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; color: white; padding: 60px;">
                <div style="font-size: 3.5rem; font-weight: 700; margin-bottom: 20px;">${data.title || 'Thank You'}</div>
                <div style="font-size: 1.5rem; opacity: 0.9; margin-bottom: 40px;">${data.subtitle || 'Questions?'}</div>
                <div style="font-size: 1rem; opacity: 0.7;">
                    ${data.contactEmail ? `<div style="margin-bottom: 8px;">${data.contactEmail}</div>` : ''}
                    ${data.contactPhone ? `<div>${data.contactPhone}</div>` : ''}
                </div>
            </div>
        `;
    }

    renderGenericSlide(data, theme) {
        return `
            <div style="width: 100%; height: 100%; background: ${theme.background}; padding: 50px 60px;">
                <div style="font-size: 2rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 30px;">${data.title || 'Slide Title'}</div>
                <div style="color: ${theme.text}; font-size: 1.1rem; line-height: 1.6;">${data.content || 'Add your content here.'}</div>
            </div>
        `;
    }

    // Navigation
    goToSlide(index) {
        this.currentSlideIndex = index;
        this.render();
    }

    nextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.currentSlideIndex++;
            this.render();
        }
    }

    prevSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.render();
        }
    }

    // Add slide from template
    addSlideFromTemplate(templateId) {
        const defaultData = this.getDefaultDataForTemplate(templateId);
        const slide = this.createSlide(templateId, defaultData);
        this.slides.push(slide);
        this.currentSlideIndex = this.slides.length - 1;
        this.save();
        this.render();
    }

    getDefaultDataForTemplate(templateId) {
        switch (templateId) {
            case 'title':
                return { title: 'New Section', subtitle: 'Subtitle', date: new Date().toLocaleDateString() };
            case 'agenda':
                return { title: 'Agenda', items: ['Item 1', 'Item 2', 'Item 3'] };
            case 'executive-summary':
                return { title: 'Executive Summary', metrics: [
                    { label: 'Metric 1', value: '$0', change: '+0%', positive: true },
                    { label: 'Metric 2', value: '$0', change: '+0%', positive: true }
                ], summary: 'Add your summary here.' };
            case 'kpi-dashboard':
                return { title: 'KPIs', kpis: [
                    { label: 'KPI 1', value: '0', target: '100', progress: 0 },
                    { label: 'KPI 2', value: '0', target: '100', progress: 0 }
                ]};
            case 'bar-chart':
                return { title: 'Chart Title', chartData: { labels: ['A', 'B', 'C'], datasets: [{ label: 'Data', values: [10, 20, 30] }] }};
            case 'pie-chart':
                return { title: 'Distribution', chartData: { labels: ['A', 'B', 'C'], values: [40, 35, 25] }};
            case 'comparison':
                return { title: 'Comparison', leftColumn: { header: 'Before', metrics: [] }, rightColumn: { header: 'After', metrics: [] }};
            case 'timeline':
                return { title: 'Timeline', milestones: [{ quarter: 'Q1', title: 'Milestone', description: 'Description' }]};
            case 'section-divider':
                return { title: 'Section Title' };
            case 'thank-you':
                return { title: 'Thank You', subtitle: 'Questions?' };
            default:
                return { title: 'New Slide' };
        }
    }

    // Delete slide
    deleteSlide(index) {
        if (this.slides.length <= 1) {
            window.toast?.error('Cannot Delete', 'You must have at least one slide');
            return;
        }
        this.slides.splice(index, 1);
        if (this.currentSlideIndex >= this.slides.length) {
            this.currentSlideIndex = this.slides.length - 1;
        }
        this.save();
        this.render();
    }

    // Change theme
    changeTheme(themeName) {
        this.theme = themeName;
        this.save();
        this.render();
    }

    // Present mode
    presentMode() {
        const slide = this.slides[this.currentSlideIndex];
        const theme = this.getTheme();

        const presentModal = document.createElement('div');
        presentModal.id = 'present-mode-modal';
        presentModal.innerHTML = `
            <style>
                #present-mode-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #000;
                    z-index: 200000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .present-slide {
                    width: 100vw;
                    height: 100vh;
                }
                .present-controls {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    padding: 10px 20px;
                    border-radius: 30px;
                    display: flex;
                    gap: 15px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                #present-mode-modal:hover .present-controls {
                    opacity: 1;
                }
                .present-btn {
                    background: #ff3333;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                }
            </style>
            <div class="present-slide" id="presentSlide">
                ${this.renderCurrentSlide()}
            </div>
            <div class="present-controls">
                <button class="present-btn" onclick="window.proDeckBuilder.presentPrev()">← Prev</button>
                <span style="color: #fff; padding: 8px;">${this.currentSlideIndex + 1} / ${this.slides.length}</span>
                <button class="present-btn" onclick="window.proDeckBuilder.presentNext()">Next →</button>
                <button class="present-btn" onclick="document.getElementById('present-mode-modal').remove()">✕ Exit</button>
            </div>
        `;
        document.body.appendChild(presentModal);

        // Keyboard navigation
        const handleKey = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') this.presentNext();
            else if (e.key === 'ArrowLeft') this.presentPrev();
            else if (e.key === 'Escape') {
                document.getElementById('present-mode-modal')?.remove();
                document.removeEventListener('keydown', handleKey);
            }
        };
        document.addEventListener('keydown', handleKey);
    }

    presentNext() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.currentSlideIndex++;
            document.getElementById('presentSlide').innerHTML = this.renderCurrentSlide();
        }
    }

    presentPrev() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            document.getElementById('presentSlide').innerHTML = this.renderCurrentSlide();
        }
    }

    // Export to PPTX
    async exportPPTX() {
        if (typeof PptxGenJS === 'undefined') {
            window.toast?.error('Export Error', 'PowerPoint library not loaded');
            return;
        }

        window.toast?.info('Generating...', 'Creating your PowerPoint presentation');

        const pptx = new PptxGenJS();
        const theme = this.getTheme();

        pptx.author = 'Lightning Ledgerz';
        pptx.company = this.companyName;
        pptx.title = this.companyName + ' Presentation';

        this.slides.forEach(slide => {
            const pptSlide = pptx.addSlide();
            this.addSlideToPPTX(pptSlide, slide, theme);
        });

        try {
            await pptx.writeFile({ fileName: `${this.companyName.replace(/\s+/g, '_')}_Presentation_${new Date().toISOString().split('T')[0]}` });
            window.toast?.success('Download Complete', 'Your presentation has been downloaded');
        } catch (error) {
            console.error('PPTX export error:', error);
            window.toast?.error('Export Failed', error.message);
        }
    }

    addSlideToPPTX(pptSlide, slide, theme) {
        const data = slide.data;
        const hexPrimary = theme.primary.replace('#', '');
        const hexSecondary = theme.secondary.replace('#', '');
        const hexText = theme.text.replace('#', '');

        switch (slide.template) {
            case 'title':
                pptSlide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: hexSecondary } });
                pptSlide.addText(data.title || 'Title', { x: 0.5, y: 2, w: 9, h: 1.5, fontSize: 44, bold: true, color: 'FFFFFF', align: 'center' });
                pptSlide.addText(data.subtitle || '', { x: 0.5, y: 3.5, w: 9, h: 0.5, fontSize: 24, color: 'CCCCCC', align: 'center' });
                pptSlide.addText(data.date || '', { x: 0.5, y: 4.2, w: 9, h: 0.4, fontSize: 14, color: '888888', align: 'center' });
                break;

            case 'executive-summary':
            case 'kpi-dashboard':
                pptSlide.addText(data.title || 'Summary', { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 28, bold: true, color: hexPrimary });
                if (data.metrics) {
                    data.metrics.forEach((m, i) => {
                        const x = 0.5 + (i % 4) * 2.3;
                        const y = 1.2 + Math.floor(i / 4) * 1.5;
                        pptSlide.addShape('roundRect', { x, y, w: 2.1, h: 1.3, fill: { color: 'F5F5F5' } });
                        pptSlide.addText(m.label, { x, y: y + 0.1, w: 2.1, h: 0.3, fontSize: 10, color: '666666', align: 'center' });
                        pptSlide.addText(m.value, { x, y: y + 0.4, w: 2.1, h: 0.5, fontSize: 22, bold: true, color: hexText, align: 'center' });
                        pptSlide.addText(m.change || '', { x, y: y + 0.9, w: 2.1, h: 0.3, fontSize: 12, color: m.positive ? '4CAF50' : 'F44336', align: 'center' });
                    });
                }
                break;

            case 'bar-chart':
                pptSlide.addText(data.title || 'Chart', { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 28, bold: true, color: hexPrimary });
                if (data.chartData) {
                    const chartData = data.chartData.datasets.map(ds => ({
                        name: ds.label,
                        labels: data.chartData.labels,
                        values: ds.values
                    }));
                    pptSlide.addChart(pptx.charts.BAR, chartData, {
                        x: 0.5, y: 1.2, w: 9, h: 4,
                        chartColors: theme.chartColors.map(c => c.replace('#', '')),
                        showLegend: true,
                        legendPos: 'b'
                    });
                }
                break;

            case 'pie-chart':
                pptSlide.addText(data.title || 'Chart', { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 28, bold: true, color: hexPrimary });
                if (data.chartData) {
                    pptSlide.addChart(pptx.charts.PIE, [{
                        name: 'Data',
                        labels: data.chartData.labels,
                        values: data.chartData.values
                    }], {
                        x: 1, y: 1.2, w: 5, h: 4,
                        chartColors: theme.chartColors.map(c => c.replace('#', '')),
                        showPercent: true,
                        showLegend: true,
                        legendPos: 'r'
                    });
                }
                break;

            case 'thank-you':
                pptSlide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: hexPrimary } });
                pptSlide.addText(data.title || 'Thank You', { x: 0.5, y: 2, w: 9, h: 1, fontSize: 48, bold: true, color: 'FFFFFF', align: 'center' });
                pptSlide.addText(data.subtitle || 'Questions?', { x: 0.5, y: 3.2, w: 9, h: 0.5, fontSize: 24, color: 'DDDDDD', align: 'center' });
                break;

            default:
                pptSlide.addText(data.title || 'Slide', { x: 0.5, y: 0.3, w: 9, h: 0.7, fontSize: 28, bold: true, color: hexPrimary });
        }
    }

    showTemplateSelector() {
        // Already visible in right panel
        window.toast?.info('Templates', 'Click a template on the right to add a slide');
    }
}

// Initialize
window.proDeckBuilder = new ProDeckBuilder();

// Global function to open
window.openPowerPointBuilder = function() {
    window.proDeckBuilder.open();
};

console.log('✅ Pro Deck Builder loaded');

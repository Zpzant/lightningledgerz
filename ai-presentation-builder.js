// =====================================================
// LIGHTNING LEDGERZ - AI PRESENTATION BUILDER
// PopAI-style presentation generation with AI
// Better than Fathom, better than PopAI
// =====================================================

class AIPresentationBuilder {
    constructor() {
        this.isOpen = false;
        this.selectedTheme = null;
        this.selectedTemplate = null;
        this.generatedSlides = [];
        this.isGenerating = false;
        this.currentView = 'templates'; // templates, editor, preview

        // Theme Categories (like PopAI)
        this.categories = [
            { id: 'all', name: 'ALL', icon: '🎯' },
            { id: 'business', name: 'Business & Finance', icon: '💼' },
            { id: 'investor', name: 'Investor Pitch', icon: '🚀' },
            { id: 'analysis', name: 'Financial Analysis', icon: '📊' },
            { id: 'reporting', name: 'Monthly Reports', icon: '📈' },
            { id: 'strategy', name: 'Strategy & Planning', icon: '🎯' },
            { id: 'minimal', name: 'Minimal', icon: '◻️' },
            { id: 'dark', name: 'Dark Mode', icon: '🌙' }
        ];

        this.activeCategory = 'all';

        // Professional Templates with Preview Images
        this.templates = [
            {
                id: 'executive-blue',
                name: 'Executive Summary',
                category: ['business', 'reporting'],
                description: 'Clean, professional blue theme for board meetings',
                preview: this.generatePreviewSVG('executive', '#0066CC'),
                colors: { primary: '#0066CC', secondary: '#003366', accent: '#00A3E0', bg: '#FFFFFF' },
                slides: ['title', 'agenda', 'exec-summary', 'kpis', 'financials', 'recommendations', 'thank-you'],
                premium: false
            },
            {
                id: 'investor-pitch',
                name: 'Investor Pitch Deck',
                category: ['investor', 'business'],
                description: 'Compelling pitch deck for fundraising',
                preview: this.generatePreviewSVG('pitch', '#6B46C1'),
                colors: { primary: '#6B46C1', secondary: '#553C9A', accent: '#9F7AEA', bg: '#FFFFFF' },
                slides: ['title', 'problem', 'solution', 'market', 'traction', 'financials', 'team', 'ask'],
                premium: false
            },
            {
                id: 'financial-analysis',
                name: 'Financial Deep Dive',
                category: ['analysis', 'reporting'],
                description: 'Detailed financial analysis with charts',
                preview: this.generatePreviewSVG('analysis', '#059669'),
                colors: { primary: '#059669', secondary: '#047857', accent: '#34D399', bg: '#FFFFFF' },
                slides: ['title', 'overview', 'revenue', 'expenses', 'cashflow', 'ratios', 'forecast', 'summary'],
                premium: false
            },
            {
                id: 'monthly-report',
                name: 'Monthly Performance',
                category: ['reporting', 'business'],
                description: 'Monthly business performance report',
                preview: this.generatePreviewSVG('monthly', '#DC2626'),
                colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F87171', bg: '#FFFFFF' },
                slides: ['title', 'highlights', 'revenue', 'expenses', 'kpis', 'variance', 'next-month'],
                premium: false
            },
            {
                id: 'strategy-planning',
                name: 'Strategic Planning',
                category: ['strategy', 'business'],
                description: 'Annual strategy and planning presentation',
                preview: this.generatePreviewSVG('strategy', '#7C3AED'),
                colors: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#A78BFA', bg: '#FFFFFF' },
                slides: ['title', 'vision', 'swot', 'goals', 'initiatives', 'timeline', 'budget', 'conclusion'],
                premium: false
            },
            {
                id: 'dark-professional',
                name: 'Dark Professional',
                category: ['dark', 'business'],
                description: 'Sleek dark theme for modern presentations',
                preview: this.generatePreviewSVG('dark', '#FF3333'),
                colors: { primary: '#FF3333', secondary: '#CC0000', accent: '#FF6666', bg: '#121212' },
                slides: ['title', 'agenda', 'content', 'data', 'charts', 'conclusion'],
                premium: false
            },
            {
                id: 'minimal-white',
                name: 'Minimal Clean',
                category: ['minimal', 'business'],
                description: 'Ultra-clean minimalist design',
                preview: this.generatePreviewSVG('minimal', '#1A1A1A'),
                colors: { primary: '#1A1A1A', secondary: '#333333', accent: '#666666', bg: '#FFFFFF' },
                slides: ['title', 'content', 'data', 'conclusion'],
                premium: false
            },
            {
                id: 'quarterly-review',
                name: 'Quarterly Review',
                category: ['reporting', 'analysis'],
                description: 'Comprehensive quarterly business review',
                preview: this.generatePreviewSVG('quarterly', '#0891B2'),
                colors: { primary: '#0891B2', secondary: '#0E7490', accent: '#22D3EE', bg: '#FFFFFF' },
                slides: ['title', 'highlights', 'revenue', 'profit', 'kpis', 'comparison', 'outlook'],
                premium: false
            },
            {
                id: 'budget-proposal',
                name: 'Budget Proposal',
                category: ['business', 'strategy'],
                description: 'Annual budget proposal presentation',
                preview: this.generatePreviewSVG('budget', '#EA580C'),
                colors: { primary: '#EA580C', secondary: '#C2410C', accent: '#FB923C', bg: '#FFFFFF' },
                slides: ['title', 'overview', 'revenue-plan', 'cost-centers', 'capex', 'timeline', 'approval'],
                premium: false
            },
            {
                id: 'startup-deck',
                name: 'Startup Pitch',
                category: ['investor'],
                description: 'Y-Combinator style startup pitch',
                preview: this.generatePreviewSVG('startup', '#F59E0B'),
                colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24', bg: '#FFFFFF' },
                slides: ['title', 'problem', 'solution', 'demo', 'market', 'business-model', 'traction', 'team', 'ask'],
                premium: true
            },
            {
                id: 'board-meeting',
                name: 'Board Meeting',
                category: ['business', 'reporting'],
                description: 'Formal board meeting presentation',
                preview: this.generatePreviewSVG('board', '#1E40AF'),
                colors: { primary: '#1E40AF', secondary: '#1E3A8A', accent: '#3B82F6', bg: '#FFFFFF' },
                slides: ['title', 'agenda', 'financials', 'operations', 'risks', 'strategy', 'resolutions'],
                premium: true
            },
            {
                id: 'cfo-report',
                name: 'CFO Financial Report',
                category: ['analysis', 'reporting'],
                description: 'Comprehensive CFO-level financial report',
                preview: this.generatePreviewSVG('cfo', '#4F46E5'),
                colors: { primary: '#4F46E5', secondary: '#4338CA', accent: '#818CF8', bg: '#FFFFFF' },
                slides: ['title', 'summary', 'p&l', 'balance', 'cashflow', 'ratios', 'forecast', 'risks', 'recommendations'],
                premium: true
            }
        ];

        // AI Prompt suggestions
        this.promptSuggestions = [
            "Create a Q4 financial report for my e-commerce business",
            "Build an investor pitch deck for a SaaS startup",
            "Generate monthly performance review slides",
            "Create budget vs actual analysis presentation",
            "Build a board meeting presentation with KPIs",
            "Design a strategic planning presentation for 2025"
        ];
    }

    // Generate SVG preview for template card
    generatePreviewSVG(type, color) {
        const svgTemplates = {
            executive: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#f8f9fa"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">Executive Summary</text>
                    <rect x="20" y="55" width="120" height="50" rx="4" fill="${color}" opacity="0.1"/>
                    <rect x="25" y="60" width="40" height="6" fill="${color}"/>
                    <text x="25" y="85" fill="${color}" font-size="18" font-weight="bold">$1.2M</text>
                    <text x="25" y="98" fill="#666" font-size="8">Revenue</text>
                    <rect x="160" y="55" width="140" height="50" rx="4" fill="${color}" opacity="0.05"/>
                    <rect x="170" y="70" width="60" height="8" fill="${color}" opacity="0.3"/>
                    <rect x="170" y="85" width="100" height="8" fill="${color}" opacity="0.2"/>
                    <rect x="20" y="115" width="280" height="50" rx="4" fill="#fff" stroke="${color}" stroke-width="1"/>
                    <rect x="30" y="125" width="30" height="30" fill="${color}" opacity="0.8"/>
                    <rect x="70" y="125" width="30" height="25" fill="${color}" opacity="0.6"/>
                    <rect x="110" y="125" width="30" height="35" fill="${color}" opacity="0.9"/>
                    <rect x="150" y="125" width="30" height="20" fill="${color}" opacity="0.5"/>
                </svg>`,
            pitch: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#faf5ff"/>
                    <rect x="0" y="0" width="320" height="50" fill="${color}"/>
                    <text x="160" y="32" fill="white" font-size="16" font-weight="bold" text-anchor="middle">Investor Pitch</text>
                    <circle cx="80" cy="110" r="35" fill="${color}" opacity="0.2"/>
                    <circle cx="80" cy="110" r="25" fill="${color}" opacity="0.4"/>
                    <circle cx="80" cy="110" r="15" fill="${color}"/>
                    <rect x="140" y="75" width="160" height="12" rx="2" fill="${color}" opacity="0.3"/>
                    <rect x="140" y="95" width="140" height="8" rx="2" fill="${color}" opacity="0.2"/>
                    <rect x="140" y="110" width="120" height="8" rx="2" fill="${color}" opacity="0.15"/>
                    <rect x="140" y="125" width="100" height="8" rx="2" fill="${color}" opacity="0.1"/>
                    <text x="160" y="160" fill="${color}" font-size="10" font-weight="bold">Series A - $5M</text>
                </svg>`,
            analysis: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#f0fdf4"/>
                    <rect x="0" y="0" width="320" height="35" fill="${color}"/>
                    <text x="20" y="23" fill="white" font-size="12" font-weight="bold">Financial Analysis</text>
                    <polyline points="30,140 80,100 130,120 180,80 230,90 280,60" fill="none" stroke="${color}" stroke-width="3"/>
                    <circle cx="30" cy="140" r="4" fill="${color}"/>
                    <circle cx="80" cy="100" r="4" fill="${color}"/>
                    <circle cx="130" cy="120" r="4" fill="${color}"/>
                    <circle cx="180" cy="80" r="4" fill="${color}"/>
                    <circle cx="230" cy="90" r="4" fill="${color}"/>
                    <circle cx="280" cy="60" r="4" fill="${color}"/>
                    <rect x="20" y="150" width="280" height="20" rx="2" fill="${color}" opacity="0.1"/>
                    <rect x="25" y="155" width="50" height="10" fill="${color}" opacity="0.3"/>
                    <rect x="85" y="155" width="40" height="10" fill="${color}" opacity="0.2"/>
                </svg>`,
            monthly: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#fef2f2"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">Monthly Report</text>
                    <rect x="20" y="55" width="85" height="55" rx="4" fill="white" stroke="${color}" stroke-width="1"/>
                    <text x="30" y="75" fill="${color}" font-size="8">Revenue</text>
                    <text x="30" y="95" fill="${color}" font-size="14" font-weight="bold">+15%</text>
                    <rect x="115" y="55" width="85" height="55" rx="4" fill="white" stroke="${color}" stroke-width="1"/>
                    <text x="125" y="75" fill="${color}" font-size="8">Profit</text>
                    <text x="125" y="95" fill="${color}" font-size="14" font-weight="bold">+22%</text>
                    <rect x="210" y="55" width="90" height="55" rx="4" fill="white" stroke="${color}" stroke-width="1"/>
                    <text x="220" y="75" fill="${color}" font-size="8">Growth</text>
                    <text x="220" y="95" fill="${color}" font-size="14" font-weight="bold">+8%</text>
                    <rect x="20" y="120" width="280" height="45" rx="4" fill="${color}" opacity="0.1"/>
                    <rect x="30" y="130" width="40" height="25" fill="${color}"/>
                    <rect x="80" y="140" width="40" height="15" fill="${color}" opacity="0.7"/>
                    <rect x="130" y="125" width="40" height="30" fill="${color}" opacity="0.8"/>
                    <rect x="180" y="135" width="40" height="20" fill="${color}" opacity="0.6"/>
                </svg>`,
            strategy: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#f5f3ff"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="160" y="26" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Strategic Planning</text>
                    <circle cx="80" cy="100" r="30" fill="${color}" opacity="0.2"/>
                    <circle cx="160" cy="100" r="30" fill="${color}" opacity="0.4"/>
                    <circle cx="240" cy="100" r="30" fill="${color}" opacity="0.6"/>
                    <text x="80" y="105" fill="${color}" font-size="10" text-anchor="middle">Vision</text>
                    <text x="160" y="105" fill="${color}" font-size="10" text-anchor="middle">Goals</text>
                    <text x="240" y="105" fill="white" font-size="10" text-anchor="middle">Action</text>
                    <line x1="110" y1="100" x2="130" y2="100" stroke="${color}" stroke-width="2" marker-end="url(#arrow)"/>
                    <line x1="190" y1="100" x2="210" y2="100" stroke="${color}" stroke-width="2"/>
                    <rect x="20" y="145" width="280" height="25" rx="4" fill="${color}" opacity="0.1"/>
                </svg>`,
            dark: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#1a1a1a"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">Dark Professional</text>
                    <rect x="20" y="55" width="140" height="50" rx="4" fill="#2a2a2a"/>
                    <rect x="30" y="65" width="60" height="8" fill="${color}"/>
                    <rect x="30" y="80" width="100" height="6" fill="#444"/>
                    <rect x="30" y="92" width="80" height="6" fill="#333"/>
                    <rect x="180" y="55" width="120" height="50" rx="4" fill="#2a2a2a"/>
                    <circle cx="240" cy="80" r="20" fill="${color}" opacity="0.3"/>
                    <text x="240" y="85" fill="${color}" font-size="12" text-anchor="middle">42%</text>
                    <rect x="20" y="115" width="280" height="50" rx="4" fill="#2a2a2a"/>
                    <rect x="30" y="130" width="30" height="25" fill="${color}"/>
                    <rect x="70" y="140" width="30" height="15" fill="${color}" opacity="0.6"/>
                    <rect x="110" y="125" width="30" height="30" fill="${color}" opacity="0.8"/>
                </svg>`,
            minimal: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#ffffff"/>
                    <line x1="0" y1="40" x2="320" y2="40" stroke="${color}" stroke-width="2"/>
                    <text x="20" y="26" fill="${color}" font-size="14" font-weight="300">Minimal Clean</text>
                    <rect x="20" y="60" width="280" height="1" fill="#eee"/>
                    <rect x="20" y="70" width="200" height="8" fill="${color}" opacity="0.1"/>
                    <rect x="20" y="85" width="160" height="6" fill="${color}" opacity="0.05"/>
                    <rect x="20" y="100" width="280" height="1" fill="#eee"/>
                    <text x="20" y="130" fill="${color}" font-size="24" font-weight="200">$2.4M</text>
                    <rect x="20" y="145" width="100" height="4" fill="${color}" opacity="0.2"/>
                    <rect x="20" y="155" width="80" height="4" fill="${color}" opacity="0.1"/>
                </svg>`,
            quarterly: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#ecfeff"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">Q4 Review</text>
                    <rect x="20" y="55" width="65" height="45" rx="4" fill="white" stroke="${color}"/>
                    <text x="52" y="85" fill="${color}" font-size="14" font-weight="bold" text-anchor="middle">Q1</text>
                    <rect x="95" y="55" width="65" height="45" rx="4" fill="white" stroke="${color}"/>
                    <text x="127" y="85" fill="${color}" font-size="14" font-weight="bold" text-anchor="middle">Q2</text>
                    <rect x="170" y="55" width="65" height="45" rx="4" fill="white" stroke="${color}"/>
                    <text x="202" y="85" fill="${color}" font-size="14" font-weight="bold" text-anchor="middle">Q3</text>
                    <rect x="245" y="55" width="55" height="45" rx="4" fill="${color}"/>
                    <text x="272" y="85" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Q4</text>
                    <rect x="20" y="110" width="280" height="55" rx="4" fill="white" stroke="${color}" stroke-width="1"/>
                    <polyline points="40,150 90,130 140,140 190,120 240,125 280,110" fill="none" stroke="${color}" stroke-width="2"/>
                </svg>`,
            budget: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#fff7ed"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">Budget Proposal</text>
                    <rect x="20" y="55" width="135" height="110" rx="4" fill="white" stroke="${color}"/>
                    <text x="30" y="75" fill="${color}" font-size="10" font-weight="bold">Budget</text>
                    <rect x="30" y="85" width="100" height="12" fill="${color}" opacity="0.3" rx="2"/>
                    <rect x="30" y="103" width="80" height="12" fill="${color}" opacity="0.2" rx="2"/>
                    <rect x="30" y="121" width="110" height="12" fill="${color}" opacity="0.4" rx="2"/>
                    <rect x="30" y="139" width="60" height="12" fill="${color}" opacity="0.15" rx="2"/>
                    <rect x="165" y="55" width="135" height="110" rx="4" fill="white" stroke="${color}"/>
                    <text x="175" y="75" fill="${color}" font-size="10" font-weight="bold">Actual</text>
                    <rect x="175" y="85" width="90" height="12" fill="#22c55e" opacity="0.5" rx="2"/>
                    <rect x="175" y="103" width="95" height="12" fill="#22c55e" opacity="0.4" rx="2"/>
                    <rect x="175" y="121" width="100" height="12" fill="${color}" opacity="0.5" rx="2"/>
                    <rect x="175" y="139" width="70" height="12" fill="#22c55e" opacity="0.3" rx="2"/>
                </svg>`,
            startup: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#fffbeb"/>
                    <rect x="0" y="0" width="320" height="50" fill="${color}"/>
                    <text x="160" y="32" fill="white" font-size="16" font-weight="bold" text-anchor="middle">Startup Pitch</text>
                    <polygon points="160,65 180,100 200,100 170,120 180,155 160,135 140,155 150,120 120,100 140,100" fill="${color}" opacity="0.8"/>
                    <rect x="20" y="100" width="70" height="60" rx="4" fill="white" stroke="${color}"/>
                    <text x="55" y="135" fill="${color}" font-size="8" text-anchor="middle">$10M TAM</text>
                    <rect x="230" y="100" width="70" height="60" rx="4" fill="white" stroke="${color}"/>
                    <text x="265" y="135" fill="${color}" font-size="8" text-anchor="middle">10x Growth</text>
                </svg>`,
            board: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#eff6ff"/>
                    <rect x="0" y="0" width="320" height="45" fill="${color}"/>
                    <text x="160" y="28" fill="white" font-size="14" font-weight="bold" text-anchor="middle">Board Meeting</text>
                    <rect x="20" y="55" width="90" height="55" rx="4" fill="white" stroke="${color}"/>
                    <text x="65" y="90" fill="${color}" font-size="10" text-anchor="middle">Financials</text>
                    <rect x="120" y="55" width="90" height="55" rx="4" fill="white" stroke="${color}"/>
                    <text x="165" y="90" fill="${color}" font-size="10" text-anchor="middle">Operations</text>
                    <rect x="220" y="55" width="80" height="55" rx="4" fill="white" stroke="${color}"/>
                    <text x="260" y="90" fill="${color}" font-size="10" text-anchor="middle">Strategy</text>
                    <rect x="20" y="120" width="280" height="45" rx="4" fill="${color}" opacity="0.1"/>
                    <text x="160" y="148" fill="${color}" font-size="12" text-anchor="middle">Resolutions & Next Steps</text>
                </svg>`,
            cfo: `
                <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
                    <rect width="320" height="180" fill="#eef2ff"/>
                    <rect x="0" y="0" width="320" height="40" fill="${color}"/>
                    <text x="20" y="26" fill="white" font-size="14" font-weight="bold">CFO Report</text>
                    <rect x="20" y="50" width="90" height="35" rx="4" fill="white" stroke="${color}"/>
                    <text x="65" y="72" fill="${color}" font-size="8" text-anchor="middle">P&L</text>
                    <rect x="120" y="50" width="90" height="35" rx="4" fill="white" stroke="${color}"/>
                    <text x="165" y="72" fill="${color}" font-size="8" text-anchor="middle">Balance</text>
                    <rect x="220" y="50" width="80" height="35" rx="4" fill="white" stroke="${color}"/>
                    <text x="260" y="72" fill="${color}" font-size="8" text-anchor="middle">Cash Flow</text>
                    <rect x="20" y="95" width="185" height="70" rx="4" fill="white" stroke="${color}"/>
                    <polyline points="35,150 65,130 95,140 125,115 155,120 185,100" fill="none" stroke="${color}" stroke-width="2"/>
                    <rect x="215" y="95" width="85" height="70" rx="4" fill="white" stroke="${color}"/>
                    <circle cx="257" cy="130" r="25" fill="none" stroke="${color}" stroke-width="8" stroke-dasharray="100 57"/>
                </svg>`
        };

        return svgTemplates[type] || svgTemplates.executive;
    }

    // Initialize the builder
    init() {
        this.createStyles();
        this.createLaunchButton();
    }

    // Create CSS styles
    createStyles() {
        if (document.getElementById('ai-pres-builder-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ai-pres-builder-styles';
        styles.textContent = `
            /* AI Presentation Builder - PopAI Style */
            .ai-pres-builder-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .ai-pres-builder-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .ai-pres-builder-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                width: 95vw;
                max-width: 1400px;
                height: 90vh;
                background: #0a0a0a;
                border-radius: 20px;
                border: 1px solid rgba(255, 51, 51, 0.3);
                box-shadow: 0 25px 100px rgba(255, 51, 51, 0.2);
                z-index: 10001;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                overflow: hidden;
            }

            .ai-pres-builder-container.active {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, -50%) scale(1);
            }

            /* Header */
            .ai-pres-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 30px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: linear-gradient(135deg, rgba(255, 51, 51, 0.1), transparent);
            }

            .ai-pres-header-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .ai-pres-logo {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .ai-pres-title {
                font-size: 1.4rem;
                font-weight: 700;
                color: #fff;
            }

            .ai-pres-title span {
                color: #ff3333;
            }

            .ai-pres-close {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .ai-pres-close:hover {
                background: #ff3333;
                transform: rotate(90deg);
            }

            /* Main Content Area */
            .ai-pres-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                padding: 25px 30px;
            }

            /* AI Prompt Input */
            .ai-prompt-section {
                margin-bottom: 25px;
            }

            .ai-prompt-container {
                position: relative;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 5px;
                transition: all 0.3s;
            }

            .ai-prompt-container:focus-within {
                border-color: #ff3333;
                box-shadow: 0 0 30px rgba(255, 51, 51, 0.2);
            }

            .ai-prompt-input {
                width: 100%;
                background: transparent;
                border: none;
                color: #fff;
                font-size: 1.1rem;
                padding: 15px 120px 15px 20px;
                outline: none;
                resize: none;
                min-height: 60px;
                font-family: inherit;
            }

            .ai-prompt-input::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }

            .ai-prompt-actions {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                gap: 10px;
            }

            .ai-prompt-btn {
                width: 45px;
                height: 45px;
                border-radius: 12px;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.2s;
            }

            .ai-prompt-btn.add-btn {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .ai-prompt-btn.generate-btn {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                color: #fff;
            }

            .ai-prompt-btn:hover {
                transform: scale(1.1);
            }

            .ai-prompt-btn.generate-btn:hover {
                box-shadow: 0 5px 20px rgba(255, 51, 51, 0.4);
            }

            /* Suggestions */
            .ai-suggestions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }

            .ai-suggestion-chip {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.7);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .ai-suggestion-chip:hover {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
                color: #fff;
            }

            /* Category Tabs */
            .ai-category-tabs {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
                flex-wrap: wrap;
            }

            .ai-category-tab {
                padding: 10px 20px;
                border-radius: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.03);
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ai-category-tab:hover {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
            }

            .ai-category-tab.active {
                background: #ff3333;
                border-color: #ff3333;
                color: #fff;
            }

            /* Templates Grid */
            .ai-templates-section {
                flex: 1;
                overflow-y: auto;
            }

            .ai-templates-section h3 {
                color: #fff;
                font-size: 1.1rem;
                margin-bottom: 20px;
                font-weight: 600;
            }

            .ai-templates-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                padding-bottom: 20px;
            }

            /* Template Card */
            .ai-template-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
            }

            .ai-template-card:hover {
                transform: translateY(-5px);
                border-color: rgba(255, 51, 51, 0.5);
                box-shadow: 0 15px 40px rgba(255, 51, 51, 0.15);
            }

            .ai-template-card.selected {
                border-color: #ff3333;
                box-shadow: 0 0 0 2px rgba(255, 51, 51, 0.3);
            }

            .ai-template-preview {
                width: 100%;
                aspect-ratio: 16/9;
                background: #1a1a1a;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .ai-template-preview svg {
                width: 100%;
                height: 100%;
            }

            .ai-template-info {
                padding: 15px;
            }

            .ai-template-name {
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .ai-template-desc {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.85rem;
            }

            .ai-template-premium {
                position: absolute;
                top: 12px;
                right: 12px;
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                color: #000;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.7rem;
                font-weight: 700;
            }

            /* Generate Button */
            .ai-generate-section {
                padding: 20px 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ai-generate-info {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.9rem;
            }

            .ai-generate-btn {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                color: #fff;
                border: none;
                padding: 15px 40px;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .ai-generate-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(255, 51, 51, 0.4);
            }

            .ai-generate-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            /* Loading State */
            .ai-generating-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 100;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }

            .ai-generating-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .ai-generating-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(255, 51, 51, 0.2);
                border-top-color: #ff3333;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .ai-generating-text {
                color: #fff;
                font-size: 1.2rem;
                margin-bottom: 10px;
            }

            .ai-generating-subtext {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.9rem;
            }

            /* Preview Mode */
            .ai-preview-container {
                flex: 1;
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .ai-preview-container.active {
                display: flex;
            }

            .ai-preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 20px;
            }

            .ai-preview-title {
                color: #fff;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .ai-preview-actions {
                display: flex;
                gap: 10px;
            }

            .ai-preview-btn {
                padding: 10px 20px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: transparent;
                color: #fff;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ai-preview-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .ai-preview-btn.primary {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border-color: #ff3333;
            }

            .ai-preview-btn.primary:hover {
                box-shadow: 0 5px 20px rgba(255, 51, 51, 0.3);
            }

            .ai-slides-preview {
                flex: 1;
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 20px;
                overflow: hidden;
            }

            .ai-slides-sidebar {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                padding: 15px;
                overflow-y: auto;
            }

            .ai-slide-thumb {
                aspect-ratio: 16/9;
                background: #1a1a1a;
                border-radius: 8px;
                margin-bottom: 10px;
                cursor: pointer;
                border: 2px solid transparent;
                overflow: hidden;
                transition: all 0.2s;
            }

            .ai-slide-thumb:hover {
                border-color: rgba(255, 51, 51, 0.5);
            }

            .ai-slide-thumb.active {
                border-color: #ff3333;
            }

            .ai-slide-main {
                background: #fff;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            /* Scrollbar */
            .ai-templates-section::-webkit-scrollbar,
            .ai-slides-sidebar::-webkit-scrollbar {
                width: 6px;
            }

            .ai-templates-section::-webkit-scrollbar-track,
            .ai-slides-sidebar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }

            .ai-templates-section::-webkit-scrollbar-thumb,
            .ai-slides-sidebar::-webkit-scrollbar-thumb {
                background: rgba(255, 51, 51, 0.5);
                border-radius: 3px;
            }

            /* Launch Button */
            .ai-pres-launch-btn {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border: none;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(255, 51, 51, 0.5);
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ai-pres-launch-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(255, 51, 51, 0.7);
            }

            .ai-pres-launch-btn .tooltip {
                position: absolute;
                right: 70px;
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 8px 15px;
                border-radius: 8px;
                font-size: 0.85rem;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s;
            }

            .ai-pres-launch-btn:hover .tooltip {
                opacity: 1;
                visibility: visible;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .ai-pres-builder-container {
                    width: 100vw;
                    height: 100vh;
                    border-radius: 0;
                }

                .ai-templates-grid {
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                }

                .ai-category-tabs {
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    padding-bottom: 10px;
                }

                .ai-slides-preview {
                    grid-template-columns: 1fr;
                }

                .ai-slides-sidebar {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Create launch button
    createLaunchButton() {
        if (document.getElementById('ai-pres-launch-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'ai-pres-launch-btn';
        btn.className = 'ai-pres-launch-btn';
        btn.innerHTML = `
            <span class="tooltip">AI Presentation Builder</span>
            📊
        `;
        btn.onclick = () => this.open();
        document.body.appendChild(btn);
    }

    // Open the builder
    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.render();

        setTimeout(() => {
            document.querySelector('.ai-pres-builder-overlay').classList.add('active');
            document.querySelector('.ai-pres-builder-container').classList.add('active');
        }, 10);
    }

    // Close the builder
    close() {
        const overlay = document.querySelector('.ai-pres-builder-overlay');
        const container = document.querySelector('.ai-pres-builder-container');

        if (overlay) overlay.classList.remove('active');
        if (container) container.classList.remove('active');

        setTimeout(() => {
            if (overlay) overlay.remove();
            if (container) container.remove();
            this.isOpen = false;
        }, 300);
    }

    // Render the builder UI
    render() {
        // Remove existing
        const existing = document.querySelector('.ai-pres-builder-overlay');
        if (existing) existing.remove();
        const existingContainer = document.querySelector('.ai-pres-builder-container');
        if (existingContainer) existingContainer.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'ai-pres-builder-overlay';
        overlay.onclick = () => this.close();
        document.body.appendChild(overlay);

        // Create main container
        const container = document.createElement('div');
        container.className = 'ai-pres-builder-container';
        container.onclick = (e) => e.stopPropagation();

        container.innerHTML = `
            <!-- Header -->
            <div class="ai-pres-header">
                <div class="ai-pres-header-left">
                    <div class="ai-pres-logo">⚡</div>
                    <div class="ai-pres-title">AI <span>Presentation</span> Builder</div>
                </div>
                <button class="ai-pres-close" onclick="aiPresentationBuilder.close()">&times;</button>
            </div>

            <!-- Main Content -->
            <div class="ai-pres-main">
                <!-- AI Prompt Section -->
                <div class="ai-prompt-section">
                    <div class="ai-prompt-container">
                        <textarea
                            class="ai-prompt-input"
                            id="ai-prompt-input"
                            placeholder="Describe what you want for your slides, e.g., Create a Q4 financial report for my SaaS business. The AI agent will generate a full presentation for you like a human assistant."
                            rows="1"
                        ></textarea>
                        <div class="ai-prompt-actions">
                            <button class="ai-prompt-btn add-btn" title="Upload data">+</button>
                            <button class="ai-prompt-btn generate-btn" onclick="aiPresentationBuilder.generateFromPrompt()" title="Generate">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 19V5M5 12l7-7 7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="ai-suggestions">
                        ${this.promptSuggestions.map(s => `
                            <div class="ai-suggestion-chip" onclick="aiPresentationBuilder.fillPrompt('${s}')">${s}</div>
                        `).join('')}
                    </div>
                </div>

                <!-- Category Tabs -->
                <div class="ai-category-tabs">
                    ${this.categories.map(cat => `
                        <div class="ai-category-tab ${cat.id === this.activeCategory ? 'active' : ''}"
                             onclick="aiPresentationBuilder.setCategory('${cat.id}')">
                            <span>${cat.icon}</span>
                            <span>${cat.name}</span>
                        </div>
                    `).join('')}
                </div>

                <!-- Templates Grid -->
                <div class="ai-templates-section">
                    <h3>Themes</h3>
                    <div class="ai-templates-grid" id="ai-templates-grid">
                        ${this.renderTemplates()}
                    </div>
                </div>

                <!-- Generate Section -->
                <div class="ai-generate-section">
                    <div class="ai-generate-info">
                        ${this.selectedTemplate ? `Selected: <strong>${this.templates.find(t => t.id === this.selectedTemplate)?.name}</strong>` : 'Select a template or describe your presentation above'}
                    </div>
                    <button class="ai-generate-btn" onclick="aiPresentationBuilder.generate()" ${!this.selectedTemplate ? 'disabled' : ''}>
                        <span>Generate Presentation</span>
                        <span>✨</span>
                    </button>
                </div>

                <!-- Preview Container (hidden initially) -->
                <div class="ai-preview-container" id="ai-preview-container">
                    <!-- Will be populated after generation -->
                </div>
            </div>

            <!-- Generating Overlay -->
            <div class="ai-generating-overlay" id="ai-generating-overlay">
                <div class="ai-generating-spinner"></div>
                <div class="ai-generating-text">Creating your presentation...</div>
                <div class="ai-generating-subtext">AI is designing professional slides based on your input</div>
            </div>
        `;

        document.body.appendChild(container);

        // Auto-resize textarea
        const textarea = container.querySelector('#ai-prompt-input');
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        });
    }

    // Render templates based on active category
    renderTemplates() {
        let filtered = this.templates;

        if (this.activeCategory !== 'all') {
            filtered = this.templates.filter(t => t.category.includes(this.activeCategory));
        }

        return filtered.map(template => `
            <div class="ai-template-card ${this.selectedTemplate === template.id ? 'selected' : ''}"
                 onclick="aiPresentationBuilder.selectTemplate('${template.id}')">
                ${template.premium ? '<div class="ai-template-premium">PREMIUM</div>' : ''}
                <div class="ai-template-preview">
                    ${template.preview}
                </div>
                <div class="ai-template-info">
                    <div class="ai-template-name">${template.name}</div>
                    <div class="ai-template-desc">${template.description}</div>
                </div>
            </div>
        `).join('');
    }

    // Set active category
    setCategory(categoryId) {
        this.activeCategory = categoryId;

        // Update tabs
        document.querySelectorAll('.ai-category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.includes(this.categories.find(c => c.id === categoryId)?.name)) {
                tab.classList.add('active');
            }
        });

        // Update grid
        const grid = document.getElementById('ai-templates-grid');
        if (grid) {
            grid.innerHTML = this.renderTemplates();
        }
    }

    // Select template
    selectTemplate(templateId) {
        this.selectedTemplate = templateId;

        // Update cards
        document.querySelectorAll('.ai-template-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');

        // Update generate button
        const btn = document.querySelector('.ai-generate-btn');
        if (btn) btn.disabled = false;

        // Update info
        const info = document.querySelector('.ai-generate-info');
        if (info) {
            const template = this.templates.find(t => t.id === templateId);
            info.innerHTML = `Selected: <strong>${template?.name}</strong>`;
        }
    }

    // Fill prompt from suggestion
    fillPrompt(text) {
        const input = document.getElementById('ai-prompt-input');
        if (input) {
            input.value = text;
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
            input.focus();
        }
    }

    // Generate from prompt
    async generateFromPrompt() {
        const prompt = document.getElementById('ai-prompt-input')?.value;
        if (!prompt?.trim()) {
            alert('Please enter a description for your presentation');
            return;
        }

        // Show generating overlay
        this.showGenerating();

        // Simulate AI generation
        await this.simulateGeneration(prompt);

        // Hide overlay and show result
        this.hideGenerating();
        this.showPreview();
    }

    // Generate from template
    async generate() {
        if (!this.selectedTemplate) {
            alert('Please select a template');
            return;
        }

        const template = this.templates.find(t => t.id === this.selectedTemplate);

        // Show generating overlay
        this.showGenerating();

        // Simulate AI generation
        await this.simulateGeneration(`Create a ${template.name} presentation`);

        // Hide overlay and show result
        this.hideGenerating();
        this.showPreview();
    }

    // Show generating overlay
    showGenerating() {
        const overlay = document.getElementById('ai-generating-overlay');
        if (overlay) overlay.classList.add('active');
        this.isGenerating = true;
    }

    // Hide generating overlay
    hideGenerating() {
        const overlay = document.getElementById('ai-generating-overlay');
        if (overlay) overlay.classList.remove('active');
        this.isGenerating = false;
    }

    // Simulate AI generation (replace with real AI call)
    async simulateGeneration(prompt) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Generate slides based on prompt/template
        this.generatedSlides = this.createSlidesFromPrompt(prompt);
    }

    // Create slides from prompt
    createSlidesFromPrompt(prompt) {
        const template = this.selectedTemplate ? this.templates.find(t => t.id === this.selectedTemplate) : this.templates[0];
        const colors = template.colors;

        // Generate contextual slides based on prompt keywords
        const slides = [];

        // Title slide
        slides.push({
            type: 'title',
            title: this.extractTitle(prompt),
            subtitle: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            colors
        });

        // Agenda
        slides.push({
            type: 'agenda',
            title: 'Agenda',
            items: this.generateAgendaItems(prompt),
            colors
        });

        // Executive Summary
        slides.push({
            type: 'executive',
            title: 'Executive Summary',
            metrics: [
                { label: 'Revenue', value: '$2.4M', change: '+18%', positive: true },
                { label: 'Profit Margin', value: '32%', change: '+5%', positive: true },
                { label: 'Growth Rate', value: '24%', change: '+8%', positive: true },
                { label: 'Customer Count', value: '1,250', change: '+22%', positive: true }
            ],
            colors
        });

        // KPIs
        slides.push({
            type: 'kpis',
            title: 'Key Performance Indicators',
            kpis: [
                { label: 'MRR', value: '$198K', target: '$180K', progress: 110 },
                { label: 'CAC', value: '$245', target: '$300', progress: 122 },
                { label: 'LTV', value: '$3,200', target: '$2,800', progress: 114 },
                { label: 'Churn', value: '1.8%', target: '2.5%', progress: 139 },
                { label: 'NPS', value: '72', target: '65', progress: 111 },
                { label: 'ARR', value: '$2.4M', target: '$2.2M', progress: 109 }
            ],
            colors
        });

        // Chart slide
        slides.push({
            type: 'chart',
            title: 'Revenue Trend',
            chartType: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                values: [180, 195, 210, 225, 240, 260]
            },
            colors
        });

        // Recommendations
        slides.push({
            type: 'recommendations',
            title: 'Strategic Recommendations',
            items: [
                { title: 'Expand Market Reach', description: 'Target 3 new geographic regions in Q2' },
                { title: 'Optimize Operations', description: 'Implement automation to reduce costs by 15%' },
                { title: 'Invest in R&D', description: 'Launch 2 new product features by Q3' }
            ],
            colors
        });

        // Thank you
        slides.push({
            type: 'thankyou',
            title: 'Thank You',
            subtitle: 'Questions & Discussion',
            contact: {
                email: 'team@company.com',
                website: 'www.company.com'
            },
            colors
        });

        return slides;
    }

    // Extract title from prompt
    extractTitle(prompt) {
        // Simple extraction - in real implementation, use AI
        if (prompt.toLowerCase().includes('q4')) return 'Q4 Financial Report';
        if (prompt.toLowerCase().includes('investor')) return 'Investor Pitch Deck';
        if (prompt.toLowerCase().includes('monthly')) return 'Monthly Performance Report';
        if (prompt.toLowerCase().includes('budget')) return 'Budget Analysis';
        if (prompt.toLowerCase().includes('quarterly')) return 'Quarterly Business Review';
        return 'Financial Presentation';
    }

    // Generate agenda items
    generateAgendaItems(prompt) {
        const baseItems = [
            'Executive Summary',
            'Financial Performance',
            'Key Metrics & KPIs',
            'Growth Analysis',
            'Strategic Recommendations'
        ];

        if (prompt.toLowerCase().includes('investor')) {
            return ['Problem & Solution', 'Market Opportunity', 'Traction', 'Business Model', 'Team & Ask'];
        }

        return baseItems;
    }

    // Show preview
    showPreview() {
        const container = document.getElementById('ai-preview-container');
        if (!container) return;

        container.classList.add('active');
        container.innerHTML = `
            <div class="ai-preview-header">
                <div class="ai-preview-title">Generated Presentation (${this.generatedSlides.length} slides)</div>
                <div class="ai-preview-actions">
                    <button class="ai-preview-btn" onclick="aiPresentationBuilder.editInBuilder()">
                        <span>✏️</span> Edit in Builder
                    </button>
                    <button class="ai-preview-btn" onclick="aiPresentationBuilder.exportPDF()">
                        <span>📄</span> Export PDF
                    </button>
                    <button class="ai-preview-btn primary" onclick="aiPresentationBuilder.exportPPTX()">
                        <span>📊</span> Download PPTX
                    </button>
                </div>
            </div>
            <div class="ai-slides-preview">
                <div class="ai-slides-sidebar">
                    ${this.generatedSlides.map((slide, i) => `
                        <div class="ai-slide-thumb ${i === 0 ? 'active' : ''}" onclick="aiPresentationBuilder.selectSlide(${i})">
                            <div style="padding: 8px; color: #fff; font-size: 10px; text-align: center;">
                                Slide ${i + 1}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="ai-slide-main" id="ai-slide-main">
                    ${this.renderSlidePreview(0)}
                </div>
            </div>
        `;

        // Hide templates section
        document.querySelector('.ai-prompt-section').style.display = 'none';
        document.querySelector('.ai-category-tabs').style.display = 'none';
        document.querySelector('.ai-templates-section').style.display = 'none';
        document.querySelector('.ai-generate-section').style.display = 'none';
    }

    // Render slide preview
    renderSlidePreview(index) {
        const slide = this.generatedSlides[index];
        if (!slide) return '';

        const colors = slide.colors;

        switch (slide.type) {
            case 'title':
                return `
                    <div style="width: 100%; height: 100%; background: ${colors.bg}; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px;">
                        <div style="width: 100%; height: 8px; background: ${colors.primary}; position: absolute; top: 0;"></div>
                        <h1 style="color: ${colors.primary}; font-size: 2.5rem; margin-bottom: 10px; text-align: center;">${slide.title}</h1>
                        <p style="color: ${colors.secondary}; font-size: 1.2rem;">${slide.subtitle}</p>
                    </div>
                `;
            case 'agenda':
                return `
                    <div style="width: 100%; height: 100%; background: ${colors.bg}; padding: 40px;">
                        <h2 style="color: ${colors.primary}; margin-bottom: 30px;">${slide.title}</h2>
                        <ul style="list-style: none; padding: 0;">
                            ${slide.items.map((item, i) => `
                                <li style="padding: 15px 20px; margin-bottom: 10px; background: ${colors.primary}11; border-left: 4px solid ${colors.primary}; color: ${colors.secondary}; font-size: 1.1rem;">
                                    <span style="color: ${colors.primary}; font-weight: bold; margin-right: 10px;">${i + 1}.</span> ${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            case 'executive':
                return `
                    <div style="width: 100%; height: 100%; background: ${colors.bg}; padding: 40px;">
                        <h2 style="color: ${colors.primary}; margin-bottom: 30px;">${slide.title}</h2>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                            ${slide.metrics.map(m => `
                                <div style="background: ${colors.primary}11; padding: 25px; border-radius: 12px; text-align: center;">
                                    <div style="color: ${colors.primary}; font-size: 2rem; font-weight: bold;">${m.value}</div>
                                    <div style="color: ${colors.secondary}; font-size: 0.9rem; margin-top: 5px;">${m.label}</div>
                                    <div style="color: ${m.positive ? '#22c55e' : '#ef4444'}; font-size: 0.85rem; margin-top: 8px;">${m.change}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            default:
                return `
                    <div style="width: 100%; height: 100%; background: ${colors.bg}; display: flex; align-items: center; justify-content: center;">
                        <h2 style="color: ${colors.primary};">${slide.title || 'Slide Preview'}</h2>
                    </div>
                `;
        }
    }

    // Select slide in preview
    selectSlide(index) {
        // Update thumbnails
        document.querySelectorAll('.ai-slide-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Update main preview
        const main = document.getElementById('ai-slide-main');
        if (main) {
            main.innerHTML = this.renderSlidePreview(index);
        }
    }

    // Edit in full builder
    editInBuilder() {
        // Open the full deck builder with generated slides
        if (window.proDeckBuilder) {
            this.close();
            window.proDeckBuilder.open();
            // Transfer slides to the builder
            // This would need integration with the existing deck builder
        }
    }

    // Export to PPTX
    async exportPPTX() {
        if (typeof PptxGenJS === 'undefined') {
            alert('PowerPoint generation library not loaded');
            return;
        }

        const pptx = new PptxGenJS();
        pptx.author = 'Lightning Ledgerz';
        pptx.title = 'AI Generated Presentation';

        this.generatedSlides.forEach(slide => {
            const pptSlide = pptx.addSlide();
            const colors = slide.colors;

            // Add content based on slide type
            switch (slide.type) {
                case 'title':
                    pptSlide.addText(slide.title, {
                        x: 0.5, y: 2.5, w: 9, h: 1,
                        fontSize: 44, bold: true, color: colors.primary.replace('#', ''),
                        align: 'center'
                    });
                    pptSlide.addText(slide.subtitle, {
                        x: 0.5, y: 3.5, w: 9, h: 0.5,
                        fontSize: 20, color: colors.secondary.replace('#', ''),
                        align: 'center'
                    });
                    break;

                case 'agenda':
                    pptSlide.addText(slide.title, {
                        x: 0.5, y: 0.5, w: 9, h: 0.8,
                        fontSize: 32, bold: true, color: colors.primary.replace('#', '')
                    });
                    slide.items.forEach((item, i) => {
                        pptSlide.addText(`${i + 1}. ${item}`, {
                            x: 0.7, y: 1.5 + (i * 0.6), w: 8.5, h: 0.5,
                            fontSize: 18, color: colors.secondary.replace('#', '')
                        });
                    });
                    break;

                default:
                    pptSlide.addText(slide.title || 'Slide', {
                        x: 0.5, y: 0.5, w: 9, h: 0.8,
                        fontSize: 32, bold: true, color: colors.primary.replace('#', '')
                    });
            }
        });

        // Download
        await pptx.writeFile({ fileName: 'AI_Presentation.pptx' });
    }

    // Export to PDF (placeholder)
    exportPDF() {
        alert('PDF export coming soon! For now, use PPTX export and save as PDF from PowerPoint.');
    }
}

// Initialize
const aiPresentationBuilder = new AIPresentationBuilder();
document.addEventListener('DOMContentLoaded', () => {
    aiPresentationBuilder.init();
});

// Also initialize if DOM already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    aiPresentationBuilder.init();
}

// Export for global access
window.aiPresentationBuilder = aiPresentationBuilder;

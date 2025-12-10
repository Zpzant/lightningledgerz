// =====================================================
// LIGHTNING LEDGERZ - PROFESSIONAL POWERPOINT TEMPLATES
// Premium presentation templates with various color themes
// =====================================================

class PowerPointTemplates {
    constructor() {
        this.selectedTemplate = null;
        this.templates = {
            // Corporate Blue Theme
            corporate: {
                id: 'corporate',
                name: 'Corporate Blue',
                description: 'Professional corporate style with deep blue accents',
                icon: '🏢',
                colors: {
                    primary: '#1a365d',
                    secondary: '#2b6cb0',
                    accent: '#4299e1',
                    text: '#ffffff',
                    background: '#0d1b2a',
                    highlight: '#63b3ed',
                    chart: ['#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4', '#bee3f8']
                },
                fonts: {
                    title: 'Arial Black',
                    body: 'Arial',
                    accent: 'Georgia'
                }
            },
            // Executive Gold Theme
            executive: {
                id: 'executive',
                name: 'Executive Gold',
                description: 'Elegant gold and black for investor presentations',
                icon: '👔',
                colors: {
                    primary: '#1a1a1a',
                    secondary: '#333333',
                    accent: '#d4af37',
                    text: '#ffffff',
                    background: '#0a0a0a',
                    highlight: '#ffd700',
                    chart: ['#d4af37', '#b8860b', '#daa520', '#f0c14b', '#ffdf00']
                },
                fonts: {
                    title: 'Georgia',
                    body: 'Times New Roman',
                    accent: 'Palatino'
                }
            },
            // Modern Emerald Theme
            emerald: {
                id: 'emerald',
                name: 'Modern Emerald',
                description: 'Fresh green tones for growth-focused reports',
                icon: '💚',
                colors: {
                    primary: '#064e3b',
                    secondary: '#047857',
                    accent: '#10b981',
                    text: '#ffffff',
                    background: '#022c22',
                    highlight: '#34d399',
                    chart: ['#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
                },
                fonts: {
                    title: 'Helvetica Neue',
                    body: 'Helvetica',
                    accent: 'Verdana'
                }
            },
            // Lightning Red Theme (Brand)
            lightning: {
                id: 'lightning',
                name: 'Lightning Red',
                description: 'Bold red Lightning Ledgerz brand style',
                icon: '⚡',
                colors: {
                    primary: '#7f1d1d',
                    secondary: '#dc2626',
                    accent: '#ff3333',
                    text: '#ffffff',
                    background: '#1a0a0a',
                    highlight: '#ffd700',
                    chart: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca']
                },
                fonts: {
                    title: 'Impact',
                    body: 'Arial',
                    accent: 'Arial Black'
                }
            },
            // Midnight Purple Theme
            midnight: {
                id: 'midnight',
                name: 'Midnight Purple',
                description: 'Sophisticated purple for premium presentations',
                icon: '🌙',
                colors: {
                    primary: '#2d1b4e',
                    secondary: '#5b21b6',
                    accent: '#8b5cf6',
                    text: '#ffffff',
                    background: '#1a0a2e',
                    highlight: '#a78bfa',
                    chart: ['#5b21b6', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']
                },
                fonts: {
                    title: 'Trebuchet MS',
                    body: 'Segoe UI',
                    accent: 'Candara'
                }
            },
            // Ocean Teal Theme
            ocean: {
                id: 'ocean',
                name: 'Ocean Teal',
                description: 'Calm teal for trustworthy financial reports',
                icon: '🌊',
                colors: {
                    primary: '#134e4a',
                    secondary: '#0d9488',
                    accent: '#14b8a6',
                    text: '#ffffff',
                    background: '#042f2e',
                    highlight: '#2dd4bf',
                    chart: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4']
                },
                fonts: {
                    title: 'Calibri',
                    body: 'Calibri Light',
                    accent: 'Cambria'
                }
            },
            // Sunset Orange Theme
            sunset: {
                id: 'sunset',
                name: 'Sunset Orange',
                description: 'Warm orange tones for energetic presentations',
                icon: '🌅',
                colors: {
                    primary: '#7c2d12',
                    secondary: '#ea580c',
                    accent: '#f97316',
                    text: '#ffffff',
                    background: '#1c1917',
                    highlight: '#fb923c',
                    chart: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa']
                },
                fonts: {
                    title: 'Futura',
                    body: 'Open Sans',
                    accent: 'Roboto'
                }
            },
            // Minimalist White Theme
            minimal: {
                id: 'minimal',
                name: 'Minimalist',
                description: 'Clean white design for clarity and focus',
                icon: '⬜',
                colors: {
                    primary: '#ffffff',
                    secondary: '#f3f4f6',
                    accent: '#1f2937',
                    text: '#111827',
                    background: '#ffffff',
                    highlight: '#3b82f6',
                    chart: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af']
                },
                fonts: {
                    title: 'Montserrat',
                    body: 'Lato',
                    accent: 'Roboto Slab'
                }
            }
        };

        this.slideLayouts = {
            title: 'Title Slide',
            twoColumn: 'Two Column',
            threeColumn: 'Three Column',
            bigNumber: 'Big Number Focus',
            chartFull: 'Full-Width Chart',
            chartSplit: 'Chart with Text',
            comparison: 'Side-by-Side Comparison',
            timeline: 'Timeline View',
            bulletPoints: 'Bullet Points',
            quote: 'Quote/Highlight',
            tableView: 'Data Table',
            imageText: 'Image with Text'
        };
    }

    // Generate template selector UI
    createTemplateSelectorUI() {
        const container = document.createElement('div');
        container.id = 'ppt-template-selector';
        container.className = 'ppt-template-selector';

        container.innerHTML = `
            <div class="ppt-selector-overlay" onclick="pptTemplates.closeSelector()"></div>
            <div class="ppt-selector-panel">
                <div class="ppt-selector-header">
                    <h2>Choose Your Presentation Style</h2>
                    <button class="ppt-selector-close" onclick="pptTemplates.closeSelector()">&times;</button>
                </div>

                <div class="ppt-selector-tabs">
                    <button class="ppt-tab active" onclick="pptTemplates.switchTab('templates')">Templates</button>
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('layouts')">Slide Layouts</button>
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('preview')">Preview</button>
                </div>

                <div class="ppt-tab-content" id="ppt-templates-tab">
                    <div class="ppt-template-grid">
                        ${Object.values(this.templates).map(t => this.renderTemplateCard(t)).join('')}
                    </div>
                </div>

                <div class="ppt-tab-content hidden" id="ppt-layouts-tab">
                    <div class="ppt-layouts-grid">
                        ${Object.entries(this.slideLayouts).map(([key, name]) => `
                            <div class="ppt-layout-card" data-layout="${key}" onclick="pptTemplates.selectLayout('${key}')">
                                <div class="ppt-layout-preview">${this.getLayoutPreviewSVG(key)}</div>
                                <span>${name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ppt-tab-content hidden" id="ppt-preview-tab">
                    <div class="ppt-live-preview" id="ppt-live-preview">
                        <p style="text-align: center; color: #888;">Select a template to see preview</p>
                    </div>
                </div>

                <div class="ppt-selector-footer">
                    <div class="ppt-selected-info">
                        <span id="ppt-selected-name">No template selected</span>
                    </div>
                    <button class="btn btn-primary" onclick="pptTemplates.generatePresentation()" id="ppt-generate-btn" disabled>
                        Generate Presentation
                    </button>
                </div>
            </div>
        `;

        // Add styles
        this.addSelectorStyles();
        document.body.appendChild(container);
        return container;
    }

    renderTemplateCard(template) {
        return `
            <div class="ppt-template-card"
                 data-template="${template.id}"
                 onclick="pptTemplates.selectTemplate('${template.id}')"
                 style="--template-primary: ${template.colors.primary}; --template-accent: ${template.colors.accent}; --template-bg: ${template.colors.background};">
                <div class="ppt-template-preview" style="background: ${template.colors.background};">
                    <div class="ppt-template-mini-slide">
                        <div class="mini-header" style="background: ${template.colors.primary};"></div>
                        <div class="mini-title" style="color: ${template.colors.accent};">Title</div>
                        <div class="mini-chart">
                            ${template.colors.chart.slice(0, 3).map((c, i) =>
                                `<div class="mini-bar" style="background: ${c}; height: ${30 + i * 15}px;"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="ppt-template-info">
                    <span class="ppt-template-icon">${template.icon}</span>
                    <span class="ppt-template-name">${template.name}</span>
                </div>
                <p class="ppt-template-desc">${template.description}</p>
                <div class="ppt-template-colors">
                    ${template.colors.chart.slice(0, 5).map(c =>
                        `<span class="color-dot" style="background: ${c};"></span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    getLayoutPreviewSVG(layout) {
        const layouts = {
            title: `<svg viewBox="0 0 100 60"><rect x="20" y="20" width="60" height="8" fill="#666"/><rect x="30" y="35" width="40" height="4" fill="#888"/></svg>`,
            twoColumn: `<svg viewBox="0 0 100 60"><rect x="5" y="5" width="42" height="50" fill="#666" rx="2"/><rect x="53" y="5" width="42" height="50" fill="#888" rx="2"/></svg>`,
            threeColumn: `<svg viewBox="0 0 100 60"><rect x="3" y="5" width="28" height="50" fill="#666" rx="2"/><rect x="36" y="5" width="28" height="50" fill="#777" rx="2"/><rect x="69" y="5" width="28" height="50" fill="#888" rx="2"/></svg>`,
            bigNumber: `<svg viewBox="0 0 100 60"><text x="50" y="35" text-anchor="middle" font-size="24" fill="#666">$1.2M</text><rect x="30" y="45" width="40" height="4" fill="#888"/></svg>`,
            chartFull: `<svg viewBox="0 0 100 60"><rect x="10" y="40" width="15" height="15" fill="#666"/><rect x="30" y="30" width="15" height="25" fill="#777"/><rect x="50" y="20" width="15" height="35" fill="#888"/><rect x="70" y="10" width="15" height="45" fill="#999"/></svg>`,
            chartSplit: `<svg viewBox="0 0 100 60"><rect x="5" y="5" width="45" height="50" fill="#666" rx="2"/><rect x="55" y="10" width="8" height="35" fill="#888"/><rect x="67" y="20" width="8" height="25" fill="#888"/><rect x="79" y="15" width="8" height="30" fill="#888"/></svg>`,
            comparison: `<svg viewBox="0 0 100 60"><rect x="5" y="15" width="40" height="30" fill="#666" rx="2"/><text x="50" y="35" text-anchor="middle" font-size="12" fill="#888">VS</text><rect x="55" y="15" width="40" height="30" fill="#888" rx="2"/></svg>`,
            timeline: `<svg viewBox="0 0 100 60"><line x1="10" y1="30" x2="90" y2="30" stroke="#666" stroke-width="2"/><circle cx="20" cy="30" r="5" fill="#888"/><circle cx="50" cy="30" r="5" fill="#888"/><circle cx="80" cy="30" r="5" fill="#888"/></svg>`,
            bulletPoints: `<svg viewBox="0 0 100 60"><circle cx="15" cy="15" r="3" fill="#888"/><rect x="25" y="12" width="60" height="4" fill="#666"/><circle cx="15" cy="30" r="3" fill="#888"/><rect x="25" y="27" width="50" height="4" fill="#666"/><circle cx="15" cy="45" r="3" fill="#888"/><rect x="25" y="42" width="55" height="4" fill="#666"/></svg>`,
            quote: `<svg viewBox="0 0 100 60"><text x="10" y="25" font-size="20" fill="#666">"</text><rect x="25" y="20" width="50" height="3" fill="#888"/><rect x="25" y="28" width="40" height="3" fill="#888"/><text x="85" y="40" font-size="20" fill="#666">"</text></svg>`,
            tableView: `<svg viewBox="0 0 100 60"><rect x="10" y="10" width="80" height="8" fill="#666"/><rect x="10" y="22" width="80" height="6" fill="#888" opacity="0.5"/><rect x="10" y="32" width="80" height="6" fill="#888" opacity="0.3"/><rect x="10" y="42" width="80" height="6" fill="#888" opacity="0.5"/></svg>`,
            imageText: `<svg viewBox="0 0 100 60"><rect x="5" y="5" width="45" height="50" fill="#666" rx="2"/><rect x="55" y="10" width="35" height="4" fill="#888"/><rect x="55" y="20" width="40" height="3" fill="#888" opacity="0.7"/><rect x="55" y="28" width="35" height="3" fill="#888" opacity="0.7"/><rect x="55" y="36" width="38" height="3" fill="#888" opacity="0.7"/></svg>`
        };
        return layouts[layout] || layouts.title;
    }

    addSelectorStyles() {
        if (document.getElementById('ppt-selector-styles')) return;

        const style = document.createElement('style');
        style.id = 'ppt-selector-styles';
        style.textContent = `
            .ppt-template-selector {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
            }

            .ppt-template-selector.active {
                display: block;
            }

            .ppt-selector-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(5px);
            }

            .ppt-selector-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 1200px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #ff3333;
                border-radius: 20px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .ppt-selector-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
            }

            .ppt-selector-header h2 {
                color: #ff3333;
                margin: 0;
                font-size: 1.5rem;
            }

            .ppt-selector-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }

            .ppt-selector-close:hover {
                color: #ff3333;
            }

            .ppt-selector-tabs {
                display: flex;
                gap: 0;
                padding: 0 2rem;
                background: rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ppt-tab {
                background: none;
                border: none;
                color: #888;
                padding: 1rem 2rem;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 3px solid transparent;
            }

            .ppt-tab:hover {
                color: #fff;
            }

            .ppt-tab.active {
                color: #ff3333;
                border-bottom-color: #ff3333;
            }

            .ppt-tab-content {
                padding: 2rem;
                overflow-y: auto;
                flex: 1;
            }

            .ppt-tab-content.hidden {
                display: none;
            }

            .ppt-template-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }

            .ppt-template-card {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .ppt-template-card:hover {
                border-color: var(--template-accent);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .ppt-template-card.selected {
                border-color: #ff3333;
                box-shadow: 0 0 20px rgba(255, 51, 51, 0.4);
            }

            .ppt-template-preview {
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1rem;
                min-height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ppt-template-mini-slide {
                width: 100%;
                aspect-ratio: 16/9;
                border-radius: 5px;
                overflow: hidden;
                position: relative;
            }

            .mini-header {
                height: 15%;
                width: 100%;
            }

            .mini-title {
                font-weight: bold;
                font-size: 0.9rem;
                padding: 8px;
            }

            .mini-chart {
                display: flex;
                gap: 5px;
                align-items: flex-end;
                padding: 0 10px 10px;
                height: 50%;
            }

            .mini-bar {
                flex: 1;
                border-radius: 3px 3px 0 0;
            }

            .ppt-template-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .ppt-template-icon {
                font-size: 1.5rem;
            }

            .ppt-template-name {
                font-weight: bold;
                color: #fff;
                font-size: 1.1rem;
            }

            .ppt-template-desc {
                color: #888;
                font-size: 0.85rem;
                margin: 0 0 0.75rem 0;
            }

            .ppt-template-colors {
                display: flex;
                gap: 5px;
            }

            .color-dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.2);
            }

            .ppt-layouts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }

            .ppt-layout-card {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .ppt-layout-card:hover {
                border-color: #ff3333;
            }

            .ppt-layout-card.selected {
                border-color: #ffd700;
                background: rgba(255, 215, 0, 0.1);
            }

            .ppt-layout-preview {
                background: #2a2a3e;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 0.5rem;
            }

            .ppt-layout-preview svg {
                width: 100%;
                height: 60px;
            }

            .ppt-layout-card span {
                color: #ccc;
                font-size: 0.85rem;
            }

            .ppt-live-preview {
                background: #000;
                border-radius: 10px;
                padding: 2rem;
                min-height: 400px;
                display: flex;
                flex-direction: column;
            }

            .ppt-selector-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .ppt-selected-info {
                color: #888;
            }

            #ppt-selected-name {
                color: #ffd700;
                font-weight: bold;
            }

            #ppt-generate-btn {
                padding: 1rem 2.5rem;
                font-size: 1.1rem;
            }

            #ppt-generate-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .ppt-selector-panel {
                    width: 100%;
                    height: 100%;
                    max-height: 100%;
                    border-radius: 0;
                }

                .ppt-template-grid {
                    grid-template-columns: 1fr;
                }

                .ppt-selector-footer {
                    flex-direction: column;
                    gap: 1rem;
                }

                #ppt-generate-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    selectTemplate(templateId) {
        this.selectedTemplate = this.templates[templateId];

        // Update UI
        document.querySelectorAll('.ppt-template-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-template="${templateId}"]`).classList.add('selected');

        // Update footer
        document.getElementById('ppt-selected-name').textContent = this.selectedTemplate.name;
        document.getElementById('ppt-generate-btn').disabled = false;

        // Update preview
        this.updatePreview();
    }

    selectLayout(layoutId) {
        document.querySelectorAll('.ppt-layout-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-layout="${layoutId}"]`).classList.add('selected');
    }

    switchTab(tabName) {
        document.querySelectorAll('.ppt-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.ppt-tab-content').forEach(content => content.classList.add('hidden'));

        event.target.classList.add('active');
        document.getElementById(`ppt-${tabName}-tab`).classList.remove('hidden');
    }

    updatePreview() {
        if (!this.selectedTemplate) return;

        const preview = document.getElementById('ppt-live-preview');
        const t = this.selectedTemplate;

        preview.innerHTML = `
            <div style="background: ${t.colors.background}; border-radius: 10px; padding: 2rem; flex: 1;">
                <div style="background: ${t.colors.primary}; height: 40px; border-radius: 5px 5px 0 0; margin: -2rem -2rem 1.5rem; padding: 0 1.5rem; display: flex; align-items: center;">
                    <span style="color: ${t.colors.text}; font-family: ${t.fonts.title};">Lightning Ledgerz</span>
                </div>

                <h2 style="color: ${t.colors.accent}; font-family: ${t.fonts.title}; margin-bottom: 1rem;">
                    Financial Executive Summary
                </h2>
                <p style="color: ${t.colors.text}; opacity: 0.8; font-family: ${t.fonts.body}; margin-bottom: 2rem;">
                    Q4 2024 Performance Report
                </p>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
                    ${['Revenue', 'Expenses', 'Net Income', 'Cash Flow'].map((metric, i) => `
                        <div style="background: ${t.colors.secondary}; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="color: ${t.colors.text}; opacity: 0.7; font-size: 0.8rem;">${metric}</div>
                            <div style="color: ${t.colors.highlight}; font-size: 1.5rem; font-weight: bold;">$${(Math.random() * 500 + 100).toFixed(0)}K</div>
                            <div style="color: ${i % 2 === 0 ? '#4caf50' : '#f44336'}; font-size: 0.8rem;">
                                ${i % 2 === 0 ? '+' : '-'}${(Math.random() * 20 + 5).toFixed(1)}%
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 5px; height: 100px; align-items: flex-end;">
                    ${t.colors.chart.map((color, i) => `
                        <div style="flex: 1; background: ${color}; height: ${30 + Math.random() * 70}%; border-radius: 5px 5px 0 0;"></div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    openSelector() {
        let selector = document.getElementById('ppt-template-selector');
        if (!selector) {
            selector = this.createTemplateSelectorUI();
        }
        selector.classList.add('active');
    }

    closeSelector() {
        const selector = document.getElementById('ppt-template-selector');
        if (selector) {
            selector.classList.remove('active');
        }
    }

    async generatePresentation() {
        if (!this.selectedTemplate) {
            alert('Please select a template first');
            return;
        }

        const t = this.selectedTemplate;

        // Check if pptxgen is available
        if (typeof PptxGenJS === 'undefined') {
            alert('PowerPoint generator not loaded. Please refresh the page.');
            return;
        }

        // Show loading
        const btn = document.getElementById('ppt-generate-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Generating...';
        btn.disabled = true;

        try {
            const pptx = new PptxGenJS();

            // Set presentation properties
            pptx.author = 'Lightning Ledgerz';
            pptx.title = 'Financial Report';
            pptx.subject = 'Generated Financial Presentation';
            pptx.company = 'Lightning Ledgerz';

            // Define master slide with theme colors
            pptx.defineSlideMaster({
                title: 'LIGHTNING_MASTER',
                background: { color: t.colors.background.replace('#', '') },
                objects: [
                    { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: t.colors.primary.replace('#', '') } } },
                    { text: { text: 'Lightning Ledgerz', options: { x: 0.5, y: 0.1, w: 3, h: 0.3, fontSize: 12, color: t.colors.text.replace('#', '') } } }
                ]
            });

            // Title Slide
            let slide = pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });
            slide.addText('Financial Executive Summary', {
                x: 1, y: 2, w: 8, h: 1,
                fontSize: 36, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true
            });
            slide.addText('Generated by Lightning Ledgerz AI', {
                x: 1, y: 3.2, w: 8, h: 0.5,
                fontSize: 18, color: t.colors.text.replace('#', ''),
                fontFace: t.fonts.body
            });
            slide.addText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
                x: 1, y: 3.8, w: 8, h: 0.3,
                fontSize: 14, color: '888888',
                fontFace: t.fonts.body
            });

            // Financial Summary Slide
            slide = pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });
            slide.addText('Key Financial Metrics', {
                x: 0.5, y: 0.7, w: 9, h: 0.5,
                fontSize: 28, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true
            });

            const metrics = [
                { label: 'Total Revenue', value: '$1,245,000', change: '+12.5%' },
                { label: 'Operating Expenses', value: '$892,000', change: '+8.2%' },
                { label: 'Net Income', value: '$353,000', change: '+18.7%' },
                { label: 'Cash Flow', value: '$428,000', change: '+15.3%' }
            ];

            metrics.forEach((metric, i) => {
                const x = 0.5 + (i % 2) * 4.5;
                const y = 1.5 + Math.floor(i / 2) * 2;

                slide.addShape('rect', {
                    x: x, y: y, w: 4, h: 1.5,
                    fill: { color: t.colors.secondary.replace('#', '') },
                    line: { color: t.colors.accent.replace('#', ''), pt: 1 }
                });

                slide.addText(metric.label, {
                    x: x + 0.2, y: y + 0.2, w: 3.6, h: 0.3,
                    fontSize: 12, color: '888888'
                });

                slide.addText(metric.value, {
                    x: x + 0.2, y: y + 0.5, w: 3.6, h: 0.5,
                    fontSize: 24, color: t.colors.highlight.replace('#', ''), bold: true
                });

                slide.addText(metric.change, {
                    x: x + 0.2, y: y + 1, w: 3.6, h: 0.3,
                    fontSize: 14, color: metric.change.startsWith('+') ? '4caf50' : 'f44336'
                });
            });

            // Chart Slide
            slide = pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });
            slide.addText('Revenue Trend Analysis', {
                x: 0.5, y: 0.7, w: 9, h: 0.5,
                fontSize: 28, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true
            });

            slide.addChart('bar', [
                {
                    name: 'Revenue',
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    values: [95000, 102000, 98000, 115000, 125000, 138000]
                }
            ], {
                x: 0.5, y: 1.5, w: 9, h: 4,
                chartColors: t.colors.chart.map(c => c.replace('#', '')),
                showTitle: false,
                showLegend: false,
                valAxisTitle: 'Revenue ($)',
                catAxisTitle: 'Month'
            });

            // Strategic Recommendations Slide
            slide = pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });
            slide.addText('Strategic Recommendations', {
                x: 0.5, y: 0.7, w: 9, h: 0.5,
                fontSize: 28, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true
            });

            const recommendations = [
                '• Focus on high-margin product lines to improve profitability',
                '• Implement cost reduction initiatives in Q1',
                '• Expand market presence in emerging sectors',
                '• Invest in technology to improve operational efficiency',
                '• Strengthen customer retention programs'
            ];

            recommendations.forEach((rec, i) => {
                slide.addText(rec, {
                    x: 0.5, y: 1.5 + (i * 0.6), w: 9, h: 0.5,
                    fontSize: 16, color: t.colors.text.replace('#', ''),
                    fontFace: t.fonts.body
                });
            });

            // Closing Slide
            slide = pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });
            slide.addText('Thank You', {
                x: 1, y: 2, w: 8, h: 1,
                fontSize: 44, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true, align: 'center'
            });
            slide.addText('Generated with Lightning Ledgerz AI', {
                x: 1, y: 3.5, w: 8, h: 0.5,
                fontSize: 18, color: '888888',
                fontFace: t.fonts.body, align: 'center'
            });
            slide.addText('www.lightningledgerz.com', {
                x: 1, y: 4.2, w: 8, h: 0.3,
                fontSize: 14, color: t.colors.highlight.replace('#', ''),
                fontFace: t.fonts.body, align: 'center'
            });

            // Save the presentation
            await pptx.writeFile({ fileName: `LightningLedgerz_Report_${t.name.replace(/\s+/g, '_')}.pptx` });

            // Show success
            this.closeSelector();

            // Trigger avatar celebration if available
            if (window.avatarSelector) {
                const currentAvatar = window.avatarSelector.getCurrentAvatar();
                if (currentAvatar === 'alaina' && window.alainaAvatar) {
                    window.alainaAvatar.showSpeech('Your presentation is ready! Looking fabulous!', 'Download Complete');
                } else if (window.zacAvatar) {
                    window.zacAvatar.showSpeech('Boom! Your professional deck is downloaded. Go close those deals!', 'Presentation Ready');
                }
            }

        } catch (error) {
            console.error('Error generating presentation:', error);
            alert('Error generating presentation. Please try again.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}

// Initialize PowerPoint Templates
const pptTemplates = new PowerPointTemplates();

// Global function to open template selector
window.openPowerPointTemplates = function() {
    pptTemplates.openSelector();
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerPointTemplates;
}

// =====================================================
// LIGHTNING LEDGERZ - PROFESSIONAL POWERPOINT TEMPLATES
// Premium presentation templates with various color themes
// =====================================================

class PowerPointTemplates {
    constructor() {
        this.selectedTemplate = null;
        this.selectedLayout = 'title';

        // Content generation settings
        this.settings = {
            detailLevel: 50, // 0-100: 0=bullet points only, 100=full paragraphs
            pageCount: 'auto', // 'auto' or number 1-20
            contentDensity: 'balanced', // 'minimal', 'balanced', 'detailed'
            includeCharts: true,
            includeImages: true,
            imageStyle: 'professional' // 'professional', 'creative', 'minimal'
        };

        // Pitch deck questionnaire data
        this.pitchDeckData = null;

        // High-quality stock image library (Unsplash-style categories)
        this.imageLibrary = {
            skylines: [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920',
                'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920',
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920',
                'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920',
                'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=1920'
            ],
            business: [
                'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1920',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920',
                'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920',
                'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920'
            ],
            finance: [
                'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920',
                'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920',
                'https://images.unsplash.com/photo-1565514020179-026b92b2d5b2?w=1920',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920'
            ],
            technology: [
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920',
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920',
                'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920',
                'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920',
                'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1920'
            ],
            landscapes: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920',
                'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920'
            ],
            abstract: [
                'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
                'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1920',
                'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920',
                'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920',
                'https://images.unsplash.com/photo-1557682260-96773eb01377?w=1920'
            ]
        };

        // Content templates based on detail level
        this.contentTemplates = {
            minimal: {
                intro: ['Key Highlights', 'Summary', 'Overview'],
                sections: 2,
                bulletPointsPerSection: 3,
                wordsPerBullet: 8
            },
            balanced: {
                intro: ['Executive Summary', 'Comprehensive Overview', 'Strategic Analysis'],
                sections: 4,
                bulletPointsPerSection: 5,
                wordsPerBullet: 15
            },
            detailed: {
                intro: ['In-Depth Analysis & Strategic Recommendations', 'Comprehensive Financial Review'],
                sections: 6,
                bulletPointsPerSection: 7,
                wordsPerBullet: 25
            }
        };

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
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('settings')">Settings</button>
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('pitchdeck')">Pitch Deck</button>
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('images')">Images</button>
                    <button class="ppt-tab" onclick="pptTemplates.switchTab('preview')">Preview</button>
                </div>

                <div class="ppt-tab-content" id="ppt-templates-tab">
                    <div class="ppt-template-grid">
                        ${Object.values(this.templates).map(t => this.renderTemplateCard(t)).join('')}
                    </div>
                </div>

                <!-- Settings Tab - Detail Slider & Page Count -->
                <div class="ppt-tab-content hidden" id="ppt-settings-tab">
                    <div class="ppt-settings-container">
                        <div class="ppt-setting-section">
                            <h3>📊 Content Detail Level</h3>
                            <p class="setting-desc">Drag the slider to control how detailed your presentation content will be</p>
                            <div class="detail-slider-container">
                                <div class="detail-labels">
                                    <span>Bullet Points</span>
                                    <span>Balanced</span>
                                    <span>Full Paragraphs</span>
                                </div>
                                <input type="range" id="detail-slider" min="0" max="100" value="50"
                                    oninput="pptTemplates.updateDetailLevel(this.value)">
                                <div class="detail-preview" id="detail-preview">
                                    <strong>Current:</strong> Balanced mix of bullet points and explanatory text
                                </div>
                            </div>
                        </div>

                        <div class="ppt-setting-section">
                            <h3>📄 Number of Slides</h3>
                            <p class="setting-desc">Choose slide count or let AI determine the optimal number</p>
                            <div class="page-count-options">
                                <button class="page-btn selected" data-count="auto" onclick="pptTemplates.setPageCount('auto')">
                                    🤖 AI Recommended
                                </button>
                                <button class="page-btn" data-count="5" onclick="pptTemplates.setPageCount(5)">5 slides</button>
                                <button class="page-btn" data-count="8" onclick="pptTemplates.setPageCount(8)">8 slides</button>
                                <button class="page-btn" data-count="12" onclick="pptTemplates.setPageCount(12)">12 slides</button>
                                <button class="page-btn" data-count="15" onclick="pptTemplates.setPageCount(15)">15 slides</button>
                                <button class="page-btn" data-count="20" onclick="pptTemplates.setPageCount(20)">20 slides</button>
                            </div>
                            <div class="custom-page-count">
                                <label>Or specify exact number:</label>
                                <input type="number" id="custom-page-count" min="1" max="50" placeholder="1-50"
                                    onchange="pptTemplates.setPageCount(parseInt(this.value))">
                            </div>
                        </div>

                        <div class="ppt-setting-section">
                            <h3>🎨 Content Options</h3>
                            <div class="content-toggles">
                                <label class="toggle-option">
                                    <input type="checkbox" checked onchange="pptTemplates.settings.includeCharts = this.checked">
                                    <span>Include Charts & Graphs</span>
                                </label>
                                <label class="toggle-option">
                                    <input type="checkbox" checked onchange="pptTemplates.settings.includeImages = this.checked">
                                    <span>Include High-Quality Images</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pitch Deck Builder Tab -->
                <div class="ppt-tab-content hidden" id="ppt-pitchdeck-tab">
                    <div class="pitch-deck-builder">
                        <div class="pitch-intro">
                            <h3>🚀 Company Pitch Deck Builder</h3>
                            <p>Answer these questions to generate a professional pitch deck for your company</p>
                        </div>

                        <form id="pitch-deck-form" class="pitch-form">
                            <div class="pitch-section">
                                <h4>Company Information</h4>
                                <div class="form-row">
                                    <label>Company Name *</label>
                                    <input type="text" id="pitch-company-name" required placeholder="Lightning Ledgerz Inc.">
                                </div>
                                <div class="form-row">
                                    <label>Tagline / One-liner</label>
                                    <input type="text" id="pitch-tagline" placeholder="AI-Powered Financial Intelligence">
                                </div>
                                <div class="form-row two-col">
                                    <div>
                                        <label>Year Founded</label>
                                        <input type="number" id="pitch-year-founded" placeholder="2024" min="1900" max="2025">
                                    </div>
                                    <div>
                                        <label>Number of Employees</label>
                                        <input type="number" id="pitch-employees" placeholder="25">
                                    </div>
                                </div>
                            </div>

                            <div class="pitch-section">
                                <h4>Leadership & Team</h4>
                                <div class="form-row">
                                    <label>Founder / CEO Name</label>
                                    <input type="text" id="pitch-founder-name" placeholder="John Smith">
                                </div>
                                <div class="form-row">
                                    <label>Founder Photo</label>
                                    <div class="image-upload-area" onclick="document.getElementById('founder-photo-input').click()">
                                        <span id="founder-photo-preview">📷 Click to upload founder photo</span>
                                        <input type="file" id="founder-photo-input" accept="image/*" hidden
                                            onchange="pptTemplates.handleImageUpload(this, 'founder-photo-preview')">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <label>Team Photo (optional)</label>
                                    <div class="image-upload-area" onclick="document.getElementById('team-photo-input').click()">
                                        <span id="team-photo-preview">👥 Click to upload team photo</span>
                                        <input type="file" id="team-photo-input" accept="image/*" hidden
                                            onchange="pptTemplates.handleImageUpload(this, 'team-photo-preview')">
                                    </div>
                                </div>
                            </div>

                            <div class="pitch-section">
                                <h4>Company Logo</h4>
                                <div class="form-row">
                                    <label>Upload Logo (we'll remove the background automatically)</label>
                                    <div class="logo-upload-area" onclick="document.getElementById('logo-input').click()">
                                        <span id="logo-preview">🖼️ Click to upload company logo</span>
                                        <input type="file" id="logo-input" accept="image/*" hidden
                                            onchange="pptTemplates.handleLogoUpload(this)">
                                    </div>
                                    <label class="toggle-option">
                                        <input type="checkbox" id="remove-bg-checkbox" checked>
                                        <span>Auto-remove background</span>
                                    </label>
                                </div>
                            </div>

                            <div class="pitch-section">
                                <h4>Business Details</h4>
                                <div class="form-row">
                                    <label>Industry / Sector</label>
                                    <select id="pitch-industry">
                                        <option value="">Select industry...</option>
                                        <option value="fintech">FinTech</option>
                                        <option value="saas">SaaS</option>
                                        <option value="realestate">Real Estate</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="ecommerce">E-Commerce</option>
                                        <option value="ai">AI / Machine Learning</option>
                                        <option value="cleantech">CleanTech / Sustainability</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-row">
                                    <label>Services / Products (one per line)</label>
                                    <textarea id="pitch-services" rows="4" placeholder="Financial Analysis Platform&#10;AI Report Generation&#10;QuickBooks Integration&#10;Investment Dashboard"></textarea>
                                </div>
                                <div class="form-row">
                                    <label>Problem You Solve</label>
                                    <textarea id="pitch-problem" rows="3" placeholder="Small businesses struggle with complex financial reporting and lack the resources for expensive analysts..."></textarea>
                                </div>
                                <div class="form-row">
                                    <label>Your Solution</label>
                                    <textarea id="pitch-solution" rows="3" placeholder="AI-powered platform that transforms raw financial data into McKinsey-quality reports in seconds..."></textarea>
                                </div>
                            </div>

                            <div class="pitch-section">
                                <h4>Key Metrics (optional)</h4>
                                <div class="form-row three-col">
                                    <div>
                                        <label>Revenue</label>
                                        <input type="text" id="pitch-revenue" placeholder="$500K ARR">
                                    </div>
                                    <div>
                                        <label>Customers</label>
                                        <input type="text" id="pitch-customers" placeholder="150+">
                                    </div>
                                    <div>
                                        <label>Growth Rate</label>
                                        <input type="text" id="pitch-growth" placeholder="25% MoM">
                                    </div>
                                </div>
                            </div>

                            <div class="pitch-section">
                                <h4>Contact & Links</h4>
                                <div class="form-row two-col">
                                    <div>
                                        <label>Website</label>
                                        <input type="url" id="pitch-website" placeholder="https://lightningledgerz.com">
                                    </div>
                                    <div>
                                        <label>Contact Email</label>
                                        <input type="email" id="pitch-email" placeholder="hello@company.com">
                                    </div>
                                </div>
                            </div>

                            <button type="button" class="btn btn-primary pitch-generate-btn" onclick="pptTemplates.generatePitchDeck()">
                                🚀 Generate Pitch Deck
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Image Library Tab -->
                <div class="ppt-tab-content hidden" id="ppt-images-tab">
                    <div class="image-library">
                        <div class="image-library-header">
                            <h3>📸 High-Quality Image Library</h3>
                            <p>Select images to include in your presentation (4K quality)</p>
                        </div>

                        <div class="image-categories">
                            ${Object.keys(this.imageLibrary).map(cat => `
                                <button class="image-cat-btn ${cat === 'skylines' ? 'active' : ''}"
                                    onclick="pptTemplates.showImageCategory('${cat}')">
                                    ${this.getCategoryIcon(cat)} ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            `).join('')}
                        </div>

                        <div class="image-grid" id="image-grid">
                            ${this.imageLibrary.skylines.map((url, i) => `
                                <div class="image-card" onclick="pptTemplates.selectImage('${url}')">
                                    <img src="${url}&h=200" alt="Skyline ${i+1}" loading="lazy">
                                    <div class="image-overlay">
                                        <span>Click to select</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="selected-images">
                            <h4>Selected Images (<span id="selected-count">0</span>)</h4>
                            <div class="selected-images-list" id="selected-images-list">
                                <p class="no-selection">No images selected yet</p>
                            </div>
                        </div>
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

            /* Settings Tab Styles */
            .ppt-settings-container {
                max-width: 800px;
                margin: 0 auto;
            }

            .ppt-setting-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .ppt-setting-section h3 {
                color: #ff3333;
                margin-bottom: 0.5rem;
            }

            .setting-desc {
                color: #888;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .detail-slider-container {
                padding: 1rem 0;
            }

            .detail-labels {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                color: #aaa;
                font-size: 0.85rem;
            }

            #detail-slider {
                width: 100%;
                height: 8px;
                -webkit-appearance: none;
                background: linear-gradient(to right, #333 0%, #ff3333 50%, #ffd700 100%);
                border-radius: 5px;
                outline: none;
                cursor: pointer;
            }

            #detail-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 24px;
                height: 24px;
                background: #ff3333;
                border-radius: 50%;
                border: 3px solid #fff;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(255, 51, 51, 0.5);
            }

            .detail-preview {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(255, 51, 51, 0.1);
                border-radius: 10px;
                color: #ddd;
                font-size: 0.9rem;
            }

            .page-count-options {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .page-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: #ccc;
                padding: 0.75rem 1.25rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .page-btn:hover {
                border-color: #ff3333;
                color: #fff;
            }

            .page-btn.selected {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
                color: #ff3333;
            }

            .custom-page-count {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: #888;
            }

            .custom-page-count input {
                width: 100px;
                padding: 0.5rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
                font-size: 1rem;
            }

            .content-toggles {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .toggle-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #ccc;
                cursor: pointer;
            }

            .toggle-option input[type="checkbox"] {
                width: 20px;
                height: 20px;
                accent-color: #ff3333;
            }

            /* Pitch Deck Builder Styles */
            .pitch-deck-builder {
                max-width: 900px;
                margin: 0 auto;
            }

            .pitch-intro {
                text-align: center;
                margin-bottom: 2rem;
            }

            .pitch-intro h3 {
                color: #ff3333;
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
            }

            .pitch-intro p {
                color: #888;
            }

            .pitch-form {
                display: flex;
                flex-direction: column;
                gap: 0;
            }

            .pitch-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            }

            .pitch-section h4 {
                color: #ffd700;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .form-row {
                margin-bottom: 1rem;
            }

            .form-row label {
                display: block;
                color: #aaa;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .form-row input[type="text"],
            .form-row input[type="number"],
            .form-row input[type="url"],
            .form-row input[type="email"],
            .form-row select,
            .form-row textarea {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: #fff;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-row input:focus,
            .form-row select:focus,
            .form-row textarea:focus {
                outline: none;
                border-color: #ff3333;
            }

            .form-row.two-col {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .form-row.three-col {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 1rem;
            }

            .image-upload-area,
            .logo-upload-area {
                background: rgba(0, 0, 0, 0.4);
                border: 2px dashed rgba(255, 51, 51, 0.4);
                border-radius: 10px;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #888;
            }

            .image-upload-area:hover,
            .logo-upload-area:hover {
                border-color: #ff3333;
                background: rgba(255, 51, 51, 0.1);
            }

            .pitch-generate-btn {
                width: 100%;
                padding: 1.25rem 2rem !important;
                font-size: 1.2rem !important;
                margin-top: 1rem;
            }

            /* Image Library Styles */
            .image-library-header {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .image-library-header h3 {
                color: #ff3333;
                margin-bottom: 0.5rem;
            }

            .image-library-header p {
                color: #888;
            }

            .image-categories {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 1.5rem;
            }

            .image-cat-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ccc;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .image-cat-btn:hover,
            .image-cat-btn.active {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
                color: #ff3333;
            }

            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .image-card {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .image-card img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                display: block;
            }

            .image-card:hover {
                border-color: #ff3333;
                transform: scale(1.02);
            }

            .image-card.selected {
                border-color: #4caf50;
            }

            .image-card.selected::after {
                content: '✓';
                position: absolute;
                top: 10px;
                right: 10px;
                background: #4caf50;
                color: #fff;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .image-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                padding: 1rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-card:hover .image-overlay {
                opacity: 1;
            }

            .image-overlay span {
                color: #fff;
                font-size: 0.85rem;
            }

            .selected-images {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 1rem;
            }

            .selected-images h4 {
                color: #ffd700;
                margin-bottom: 1rem;
            }

            .selected-images-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .no-selection {
                color: #666;
                font-style: italic;
            }

            .selected-image-thumb {
                position: relative;
                display: inline-block;
            }

            .selected-image-thumb img {
                width: 80px;
                height: 50px;
                object-fit: cover;
                border-radius: 5px;
            }

            .selected-image-thumb button {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff3333;
                color: #fff;
                border: none;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
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

                .form-row.two-col,
                .form-row.three-col {
                    grid-template-columns: 1fr;
                }

                .page-count-options {
                    justify-content: center;
                }

                .image-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .ppt-selector-tabs {
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .ppt-tab {
                    padding: 0.75rem 1rem;
                    font-size: 0.9rem;
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
        this.selectedLayout = layoutId;
    }

    // Detail level slider update
    updateDetailLevel(value) {
        this.settings.detailLevel = parseInt(value);
        const preview = document.getElementById('detail-preview');

        if (value < 33) {
            this.settings.contentDensity = 'minimal';
            preview.innerHTML = '<strong>Current:</strong> Concise bullet points with key facts only';
        } else if (value < 66) {
            this.settings.contentDensity = 'balanced';
            preview.innerHTML = '<strong>Current:</strong> Balanced mix of bullet points and explanatory text';
        } else {
            this.settings.contentDensity = 'detailed';
            preview.innerHTML = '<strong>Current:</strong> Full paragraphs with detailed analysis and context';
        }
    }

    // Page count selection
    setPageCount(count) {
        this.settings.pageCount = count;

        // Update UI
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        if (count === 'auto' || typeof count === 'string') {
            document.querySelector('[data-count="auto"]').classList.add('selected');
        } else {
            const btn = document.querySelector(`[data-count="${count}"]`);
            if (btn) btn.classList.add('selected');
        }
    }

    // Get category icon for images
    getCategoryIcon(category) {
        const icons = {
            skylines: '🌆',
            business: '💼',
            finance: '📊',
            technology: '💻',
            landscapes: '🏔️',
            abstract: '🎨'
        };
        return icons[category] || '📷';
    }

    // Show image category
    showImageCategory(category) {
        // Update buttons
        document.querySelectorAll('.image-cat-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Update grid
        const grid = document.getElementById('image-grid');
        grid.innerHTML = this.imageLibrary[category].map((url, i) => `
            <div class="image-card ${this.selectedImages?.includes(url) ? 'selected' : ''}"
                 onclick="pptTemplates.selectImage('${url}')">
                <img src="${url}&h=200" alt="${category} ${i+1}" loading="lazy">
                <div class="image-overlay">
                    <span>Click to select</span>
                </div>
            </div>
        `).join('');
    }

    // Select/deselect images
    selectedImages = [];
    selectImage(url) {
        const index = this.selectedImages.indexOf(url);
        if (index > -1) {
            this.selectedImages.splice(index, 1);
        } else {
            this.selectedImages.push(url);
        }

        // Update UI
        document.querySelectorAll('.image-card').forEach(card => {
            const img = card.querySelector('img');
            if (img && img.src.includes(url.split('?')[0])) {
                card.classList.toggle('selected', this.selectedImages.includes(url));
            }
        });

        // Update selected count
        document.getElementById('selected-count').textContent = this.selectedImages.length;

        // Update selected images list
        const list = document.getElementById('selected-images-list');
        if (this.selectedImages.length === 0) {
            list.innerHTML = '<p class="no-selection">No images selected yet</p>';
        } else {
            list.innerHTML = this.selectedImages.map(url => `
                <div class="selected-image-thumb">
                    <img src="${url}&h=60" alt="Selected">
                    <button onclick="pptTemplates.selectImage('${url}')" title="Remove">×</button>
                </div>
            `).join('');
        }
    }

    // Handle image upload for pitch deck
    handleImageUpload(input, previewId) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById(previewId);
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height: 100px; border-radius: 5px;">`;
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle logo upload with background removal option
    handleLogoUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const preview = document.getElementById('logo-preview');
                const removeBg = document.getElementById('remove-bg-checkbox').checked;

                preview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview" style="max-height: 100px; border-radius: 5px;">`;

                if (removeBg) {
                    preview.innerHTML += '<span style="color: #4caf50; margin-left: 10px;">✓ Background will be removed</span>';
                    // Store for processing
                    this.uploadedLogo = { dataUrl: e.target.result, removeBg: true };
                } else {
                    this.uploadedLogo = { dataUrl: e.target.result, removeBg: false };
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Remove background from image (using canvas technique)
    async removeBackground(imageDataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Simple white/light background removal
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // If pixel is close to white, make it transparent
                    if (r > 240 && g > 240 && b > 240) {
                        data[i + 3] = 0; // Set alpha to 0
                    }
                    // Also handle light gray backgrounds
                    else if (r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
                        data[i + 3] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = imageDataUrl;
        });
    }

    // Collect pitch deck form data
    collectPitchDeckData() {
        return {
            companyName: document.getElementById('pitch-company-name')?.value || '',
            tagline: document.getElementById('pitch-tagline')?.value || '',
            yearFounded: document.getElementById('pitch-year-founded')?.value || '',
            employees: document.getElementById('pitch-employees')?.value || '',
            founderName: document.getElementById('pitch-founder-name')?.value || '',
            industry: document.getElementById('pitch-industry')?.value || '',
            services: document.getElementById('pitch-services')?.value || '',
            problem: document.getElementById('pitch-problem')?.value || '',
            solution: document.getElementById('pitch-solution')?.value || '',
            revenue: document.getElementById('pitch-revenue')?.value || '',
            customers: document.getElementById('pitch-customers')?.value || '',
            growth: document.getElementById('pitch-growth')?.value || '',
            website: document.getElementById('pitch-website')?.value || '',
            email: document.getElementById('pitch-email')?.value || '',
            logo: this.uploadedLogo || null
        };
    }

    // Generate content based on detail level
    generateContent(topic, type = 'bullet') {
        const templates = this.contentTemplates[this.settings.contentDensity];
        const wordCount = templates.wordsPerBullet;

        const contentLibrary = {
            revenue: {
                bullet: 'Strong revenue growth driven by expanding market share',
                balanced: 'Revenue has shown consistent growth, driven by expanding market share and new customer acquisition strategies that have proven highly effective.',
                detailed: 'Our revenue performance demonstrates a clear upward trajectory, supported by strategic market expansion, enhanced customer acquisition methodologies, and diversified revenue streams that provide resilience against market volatility.'
            },
            expenses: {
                bullet: 'Operational efficiency improvements reducing costs',
                balanced: 'We have implemented significant operational efficiency improvements that have systematically reduced overhead costs while maintaining service quality.',
                detailed: 'Through comprehensive operational audits and process optimization initiatives, we have achieved substantial cost reductions across all business units while simultaneously improving service delivery metrics and customer satisfaction scores.'
            },
            growth: {
                bullet: 'Year-over-year growth exceeds industry benchmarks',
                balanced: 'Our year-over-year growth rate consistently exceeds industry benchmarks, positioning us as a market leader in our sector.',
                detailed: 'Sustained year-over-year growth that outperforms industry benchmarks demonstrates our strategic positioning and operational excellence. This growth is attributable to our innovative approach to market challenges and commitment to continuous improvement.'
            },
            strategy: {
                bullet: 'Strategic focus on innovation and market expansion',
                balanced: 'Our strategic focus centers on innovation-driven growth and calculated market expansion into high-potential territories.',
                detailed: 'Our comprehensive strategy emphasizes innovation as a core competitive advantage, combined with methodical market expansion targeting high-growth opportunities while maintaining operational discipline and financial prudence.'
            }
        };

        if (this.settings.contentDensity === 'minimal') {
            return contentLibrary[topic]?.bullet || topic;
        } else if (this.settings.contentDensity === 'detailed') {
            return contentLibrary[topic]?.detailed || topic;
        }
        return contentLibrary[topic]?.balanced || topic;
    }

    // Generate pitch deck from questionnaire
    async generatePitchDeck() {
        const data = this.collectPitchDeckData();

        if (!data.companyName) {
            alert('Please enter your company name');
            return;
        }

        // Use selected template or default to executive
        const template = this.selectedTemplate || this.templates.executive;

        if (typeof PptxGenJS === 'undefined') {
            alert('PowerPoint generator not loaded. Please refresh the page.');
            return;
        }

        // Show loading
        const btn = document.querySelector('.pitch-generate-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Generating Pitch Deck...';
        btn.disabled = true;

        try {
            const pptx = new PptxGenJS();
            const t = template;

            pptx.author = data.companyName;
            pptx.title = `${data.companyName} - Company Pitch Deck`;
            pptx.subject = 'Company Pitch Deck';

            // Process logo if uploaded
            let processedLogo = null;
            if (data.logo) {
                if (data.logo.removeBg) {
                    processedLogo = await this.removeBackground(data.logo.dataUrl);
                } else {
                    processedLogo = data.logo.dataUrl;
                }
            }

            // Define master slide
            pptx.defineSlideMaster({
                title: 'PITCH_MASTER',
                background: { color: t.colors.background.replace('#', '') }
            });

            // SLIDE 1: Title Slide
            let slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
            if (processedLogo) {
                slide.addImage({ data: processedLogo, x: 3.5, y: 0.5, w: 3, h: 1.5, sizing: { type: 'contain' } });
            }
            slide.addText(data.companyName, {
                x: 0.5, y: 2.5, w: 9, h: 1,
                fontSize: 44, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true, align: 'center'
            });
            if (data.tagline) {
                slide.addText(data.tagline, {
                    x: 0.5, y: 3.6, w: 9, h: 0.5,
                    fontSize: 22, color: t.colors.text.replace('#', ''),
                    fontFace: t.fonts.body, align: 'center'
                });
            }
            if (data.yearFounded) {
                slide.addText(`Founded ${data.yearFounded}`, {
                    x: 0.5, y: 4.5, w: 9, h: 0.3,
                    fontSize: 14, color: '888888',
                    fontFace: t.fonts.body, align: 'center'
                });
            }

            // SLIDE 2: The Problem
            if (data.problem) {
                slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
                slide.addText('The Problem', {
                    x: 0.5, y: 0.5, w: 9, h: 0.7,
                    fontSize: 36, color: t.colors.accent.replace('#', ''),
                    fontFace: t.fonts.title, bold: true
                });
                slide.addText(data.problem, {
                    x: 0.5, y: 1.5, w: 9, h: 3,
                    fontSize: 20, color: t.colors.text.replace('#', ''),
                    fontFace: t.fonts.body, valign: 'top'
                });
            }

            // SLIDE 3: Our Solution
            if (data.solution) {
                slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
                slide.addText('Our Solution', {
                    x: 0.5, y: 0.5, w: 9, h: 0.7,
                    fontSize: 36, color: t.colors.accent.replace('#', ''),
                    fontFace: t.fonts.title, bold: true
                });
                slide.addText(data.solution, {
                    x: 0.5, y: 1.5, w: 9, h: 3,
                    fontSize: 20, color: t.colors.text.replace('#', ''),
                    fontFace: t.fonts.body, valign: 'top'
                });
            }

            // SLIDE 4: Products/Services
            if (data.services) {
                slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
                slide.addText('Our Services', {
                    x: 0.5, y: 0.5, w: 9, h: 0.7,
                    fontSize: 36, color: t.colors.accent.replace('#', ''),
                    fontFace: t.fonts.title, bold: true
                });

                const services = data.services.split('\n').filter(s => s.trim());
                services.forEach((service, i) => {
                    slide.addText(`• ${service}`, {
                        x: 0.5, y: 1.5 + (i * 0.6), w: 9, h: 0.5,
                        fontSize: 18, color: t.colors.text.replace('#', ''),
                        fontFace: t.fonts.body
                    });
                });
            }

            // SLIDE 5: Key Metrics (if provided)
            if (data.revenue || data.customers || data.growth) {
                slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
                slide.addText('Key Metrics', {
                    x: 0.5, y: 0.5, w: 9, h: 0.7,
                    fontSize: 36, color: t.colors.accent.replace('#', ''),
                    fontFace: t.fonts.title, bold: true
                });

                const metrics = [
                    { label: 'Revenue', value: data.revenue },
                    { label: 'Customers', value: data.customers },
                    { label: 'Growth', value: data.growth }
                ].filter(m => m.value);

                metrics.forEach((metric, i) => {
                    const x = 0.5 + (i * 3.2);
                    slide.addShape('rect', {
                        x: x, y: 1.5, w: 2.8, h: 2,
                        fill: { color: t.colors.secondary.replace('#', '') },
                        line: { color: t.colors.accent.replace('#', ''), pt: 2 }
                    });
                    slide.addText(metric.label, {
                        x: x + 0.1, y: 1.7, w: 2.6, h: 0.4,
                        fontSize: 14, color: '888888', align: 'center'
                    });
                    slide.addText(metric.value, {
                        x: x + 0.1, y: 2.2, w: 2.6, h: 0.8,
                        fontSize: 28, color: t.colors.highlight.replace('#', ''),
                        bold: true, align: 'center'
                    });
                });
            }

            // SLIDE 6: Team (if founder name provided)
            if (data.founderName) {
                slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
                slide.addText('Leadership', {
                    x: 0.5, y: 0.5, w: 9, h: 0.7,
                    fontSize: 36, color: t.colors.accent.replace('#', ''),
                    fontFace: t.fonts.title, bold: true
                });
                slide.addText(data.founderName, {
                    x: 0.5, y: 2, w: 9, h: 0.5,
                    fontSize: 24, color: t.colors.text.replace('#', ''),
                    fontFace: t.fonts.body, align: 'center', bold: true
                });
                slide.addText('Founder & CEO', {
                    x: 0.5, y: 2.6, w: 9, h: 0.4,
                    fontSize: 16, color: '888888',
                    fontFace: t.fonts.body, align: 'center'
                });
                if (data.employees) {
                    slide.addText(`Team Size: ${data.employees} employees`, {
                        x: 0.5, y: 3.5, w: 9, h: 0.4,
                        fontSize: 14, color: t.colors.accent.replace('#', ''),
                        fontFace: t.fonts.body, align: 'center'
                    });
                }
            }

            // SLIDE 7: Contact/Thank You
            slide = pptx.addSlide({ masterName: 'PITCH_MASTER' });
            slide.addText('Thank You', {
                x: 0.5, y: 1.5, w: 9, h: 1,
                fontSize: 48, color: t.colors.accent.replace('#', ''),
                fontFace: t.fonts.title, bold: true, align: 'center'
            });
            slide.addText("Let's Connect", {
                x: 0.5, y: 2.8, w: 9, h: 0.5,
                fontSize: 24, color: t.colors.text.replace('#', ''),
                fontFace: t.fonts.body, align: 'center'
            });
            if (data.website) {
                slide.addText(data.website, {
                    x: 0.5, y: 3.5, w: 9, h: 0.4,
                    fontSize: 18, color: t.colors.highlight.replace('#', ''),
                    fontFace: t.fonts.body, align: 'center'
                });
            }
            if (data.email) {
                slide.addText(data.email, {
                    x: 0.5, y: 4, w: 9, h: 0.4,
                    fontSize: 16, color: '888888',
                    fontFace: t.fonts.body, align: 'center'
                });
            }

            // Save
            await pptx.writeFile({ fileName: `${data.companyName.replace(/\s+/g, '_')}_Pitch_Deck.pptx` });

            this.closeSelector();

            // Avatar celebration
            if (window.zacAvatar) {
                window.zacAvatar.showSpeech(`Your ${data.companyName} pitch deck is ready! Go crush that investor meeting!`, 'Pitch Deck Complete');
            }

        } catch (error) {
            console.error('Error generating pitch deck:', error);
            alert('Error generating pitch deck. Please try again.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
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

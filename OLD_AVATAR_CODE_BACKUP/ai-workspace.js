/**
 * Lightning Ledgerz AI Workspace
 * Genspark-style AI Slides, AI Sheets, Template Gallery
 * Type what you want → AI builds it
 */

class AIWorkspace {
    constructor() {
        this.currentMode = 'slides'; // slides, sheets, docs
        this.templates = this.loadTemplates();
        this.recentProjects = [];

        // Unsplash API for free images (demo key - replace with your own)
        this.unsplashAccessKey = 'demo'; // Get free key at unsplash.com/developers

        this.init();
    }

    init() {
        // Pre-cache some template images
        this.preloadImages();
    }

    // Open the AI Workspace
    open(mode = 'slides') {
        this.currentMode = mode;
        this.createInterface();
        document.getElementById('ai-workspace-modal').classList.add('active');
    }

    close() {
        const modal = document.getElementById('ai-workspace-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Template Library - Beautiful pre-made decks
    loadTemplates() {
        return {
            // Business & Corporate
            business: [
                {
                    id: 'exec-summary',
                    name: 'Executive Summary',
                    category: 'Business',
                    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
                    colors: ['#1a365d', '#2c5282', '#4299e1'],
                    slides: 8,
                    style: 'professional',
                    tags: ['corporate', 'executive', 'summary']
                },
                {
                    id: 'company-overview',
                    name: 'Company Overview',
                    category: 'Business',
                    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=225&fit=crop',
                    colors: ['#0d47a1', '#1976d2', '#42a5f5'],
                    slides: 12,
                    style: 'modern',
                    tags: ['company', 'about us', 'overview']
                },
                {
                    id: 'business-proposal',
                    name: 'Business Proposal',
                    category: 'Business',
                    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop',
                    colors: ['#1b5e20', '#388e3c', '#66bb6a'],
                    slides: 10,
                    style: 'clean',
                    tags: ['proposal', 'business', 'pitch']
                }
            ],

            // Finance & Investment
            finance: [
                {
                    id: 'investor-pitch',
                    name: 'Investor Pitch Deck',
                    category: 'Finance',
                    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
                    colors: ['#b71c1c', '#d32f2f', '#f44336'],
                    slides: 15,
                    style: 'bold',
                    tags: ['investor', 'pitch', 'funding', 'startup'],
                    featured: true
                },
                {
                    id: 'financial-report',
                    name: 'Quarterly Financial Report',
                    category: 'Finance',
                    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
                    colors: ['#004d40', '#00796b', '#26a69a'],
                    slides: 12,
                    style: 'data-heavy',
                    tags: ['quarterly', 'financial', 'report', 'earnings']
                },
                {
                    id: 'budget-presentation',
                    name: 'Annual Budget Review',
                    category: 'Finance',
                    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
                    colors: ['#ff6f00', '#ff8f00', '#ffc107'],
                    slides: 10,
                    style: 'charts',
                    tags: ['budget', 'annual', 'review', 'planning']
                },
                {
                    id: 'investment-analysis',
                    name: 'Investment Analysis',
                    category: 'Finance',
                    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop',
                    colors: ['#311b92', '#512da8', '#7c4dff'],
                    slides: 14,
                    style: 'analytical',
                    tags: ['investment', 'analysis', 'portfolio', 'returns']
                }
            ],

            // Real Estate & Property
            realestate: [
                {
                    id: 'property-investment',
                    name: 'Property Investment Deck',
                    category: 'Real Estate',
                    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop',
                    colors: ['#33691e', '#558b2f', '#8bc34a'],
                    slides: 12,
                    style: 'luxury',
                    tags: ['property', 'investment', 'real estate'],
                    featured: true
                },
                {
                    id: 'vacation-rental',
                    name: 'Vacation Rental Pitch',
                    category: 'Real Estate',
                    thumbnail: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=225&fit=crop',
                    colors: ['#01579b', '#0288d1', '#29b6f6'],
                    slides: 10,
                    style: 'tropical',
                    tags: ['vacation', 'rental', 'airbnb', 'hospitality']
                },
                {
                    id: 'commercial-property',
                    name: 'Commercial Real Estate',
                    category: 'Real Estate',
                    thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=225&fit=crop',
                    colors: ['#37474f', '#546e7a', '#78909c'],
                    slides: 11,
                    style: 'corporate',
                    tags: ['commercial', 'office', 'retail', 'industrial']
                }
            ],

            // Startup & Tech
            startup: [
                {
                    id: 'saas-pitch',
                    name: 'SaaS Startup Pitch',
                    category: 'Startup',
                    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop',
                    colors: ['#6200ea', '#7c4dff', '#b388ff'],
                    slides: 12,
                    style: 'tech',
                    tags: ['saas', 'startup', 'tech', 'software'],
                    featured: true
                },
                {
                    id: 'product-launch',
                    name: 'Product Launch',
                    category: 'Startup',
                    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
                    colors: ['#00bfa5', '#1de9b6', '#64ffda'],
                    slides: 10,
                    style: 'vibrant',
                    tags: ['product', 'launch', 'release', 'announcement']
                },
                {
                    id: 'ai-company',
                    name: 'AI/ML Company Pitch',
                    category: 'Startup',
                    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
                    colors: ['#1a237e', '#3949ab', '#7986cb'],
                    slides: 14,
                    style: 'futuristic',
                    tags: ['ai', 'machine learning', 'artificial intelligence']
                }
            ],

            // Marketing & Sales
            marketing: [
                {
                    id: 'marketing-strategy',
                    name: 'Marketing Strategy',
                    category: 'Marketing',
                    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=225&fit=crop',
                    colors: ['#e91e63', '#f06292', '#f8bbd9'],
                    slides: 12,
                    style: 'creative',
                    tags: ['marketing', 'strategy', 'campaign', 'brand']
                },
                {
                    id: 'sales-report',
                    name: 'Sales Performance',
                    category: 'Marketing',
                    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
                    colors: ['#2e7d32', '#43a047', '#81c784'],
                    slides: 10,
                    style: 'metrics',
                    tags: ['sales', 'performance', 'revenue', 'growth']
                },
                {
                    id: 'brand-guidelines',
                    name: 'Brand Guidelines',
                    category: 'Marketing',
                    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
                    colors: ['#ff5722', '#ff7043', '#ffab91'],
                    slides: 15,
                    style: 'design',
                    tags: ['brand', 'guidelines', 'identity', 'style']
                }
            ],

            // Healthcare
            healthcare: [
                {
                    id: 'healthcare-overview',
                    name: 'Healthcare Solutions',
                    category: 'Healthcare',
                    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop',
                    colors: ['#0277bd', '#039be5', '#4fc3f7'],
                    slides: 12,
                    style: 'medical',
                    tags: ['healthcare', 'medical', 'health', 'wellness']
                },
                {
                    id: 'wellness-program',
                    name: 'Wellness Program',
                    category: 'Healthcare',
                    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
                    colors: ['#7cb342', '#9ccc65', '#c5e1a5'],
                    slides: 10,
                    style: 'fresh',
                    tags: ['wellness', 'fitness', 'health', 'program']
                }
            ],

            // Education
            education: [
                {
                    id: 'educational-course',
                    name: 'Educational Course',
                    category: 'Education',
                    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
                    colors: ['#5e35b1', '#7e57c2', '#b39ddb'],
                    slides: 15,
                    style: 'academic',
                    tags: ['education', 'course', 'learning', 'training']
                },
                {
                    id: 'workshop-training',
                    name: 'Workshop & Training',
                    category: 'Education',
                    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=225&fit=crop',
                    colors: ['#f57c00', '#ff9800', '#ffb74d'],
                    slides: 12,
                    style: 'interactive',
                    tags: ['workshop', 'training', 'seminar', 'skills']
                }
            ],

            // Minimalist & Modern
            minimal: [
                {
                    id: 'minimal-pitch',
                    name: 'Minimal Pitch',
                    category: 'Minimal',
                    thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=225&fit=crop',
                    colors: ['#212121', '#424242', '#757575'],
                    slides: 8,
                    style: 'minimal',
                    tags: ['minimal', 'clean', 'simple', 'modern']
                },
                {
                    id: 'dark-modern',
                    name: 'Dark Modern',
                    category: 'Minimal',
                    thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=225&fit=crop',
                    colors: ['#000000', '#1a1a2e', '#16213e'],
                    slides: 10,
                    style: 'dark',
                    tags: ['dark', 'modern', 'sleek', 'professional'],
                    featured: true
                }
            ]
        };
    }

    // Create main interface
    createInterface() {
        const existing = document.getElementById('ai-workspace-modal');
        if (existing) existing.remove();

        const allTemplates = this.getAllTemplates();
        const featuredTemplates = allTemplates.filter(t => t.featured);
        const categories = Object.keys(this.templates);

        const modal = document.createElement('div');
        modal.id = 'ai-workspace-modal';
        modal.className = 'ai-workspace-modal';

        modal.innerHTML = `
            <div class="aiws-container">
                <!-- Sidebar -->
                <div class="aiws-sidebar">
                    <div class="aiws-logo" onclick="aiWorkspace.close()">
                        <span class="logo-icon">⚡</span>
                        <span class="logo-text">Lightning Ledgerz</span>
                    </div>

                    <nav class="aiws-nav">
                        <a class="aiws-nav-item" onclick="aiWorkspace.showNewProject()">
                            <span class="nav-icon">+</span>
                            <span>New</span>
                        </a>
                        <a class="aiws-nav-item ${this.currentMode === 'slides' ? 'active' : ''}" onclick="aiWorkspace.switchMode('slides')">
                            <span class="nav-icon">📽️</span>
                            <span>AI Slides</span>
                        </a>
                        <a class="aiws-nav-item ${this.currentMode === 'sheets' ? 'active' : ''}" onclick="aiWorkspace.switchMode('sheets')">
                            <span class="nav-icon">📊</span>
                            <span>AI Sheets</span>
                        </a>
                        <a class="aiws-nav-item" onclick="aiWorkspace.showHome()">
                            <span class="nav-icon">🏠</span>
                            <span>Home</span>
                        </a>
                        <a class="aiws-nav-item" onclick="aiWorkspace.showMyProjects()">
                            <span class="nav-icon">📁</span>
                            <span>My Projects</span>
                        </a>
                        <a class="aiws-nav-item" onclick="aiWorkspace.showHub()">
                            <span class="nav-icon">🔗</span>
                            <span>Hub</span>
                        </a>
                    </nav>

                    <div class="aiws-sidebar-footer">
                        <button class="aiws-upgrade-btn" onclick="aiWorkspace.showUpgrade()">
                            <span>⭐</span> Upgrade to Pro
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="aiws-main">
                    <!-- Header with close -->
                    <div class="aiws-header">
                        <div></div>
                        <div class="aiws-header-actions">
                            <a href="#" class="aiws-link">FAQ</a>
                            <a href="#" class="aiws-link">Updates</a>
                            <button class="aiws-close-btn" onclick="aiWorkspace.close()">×</button>
                        </div>
                    </div>

                    <!-- AI Input Area -->
                    <div class="aiws-hero">
                        <div class="aiws-input-container">
                            <textarea id="aiws-prompt"
                                placeholder="Enter your presentation topic and requirements..."
                                rows="3"></textarea>
                            <div class="aiws-input-actions">
                                <button class="aiws-input-btn" onclick="aiWorkspace.uploadFile()" title="Upload file">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                                    </svg>
                                </button>
                                <button class="aiws-input-btn" onclick="aiWorkspace.voiceInput()" title="Voice input">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                        <line x1="12" y1="19" x2="12" y2="23"/>
                                        <line x1="8" y1="23" x2="16" y2="23"/>
                                    </svg>
                                </button>
                                <button class="aiws-submit-btn" onclick="aiWorkspace.generateFromPrompt()">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Mode Tabs -->
                    <div class="aiws-mode-tabs">
                        <button class="aiws-mode-tab ${this.currentMode === 'slides' ? 'active' : ''}" onclick="aiWorkspace.switchMode('slides')">
                            <span class="mode-icon">📽️</span>
                            <span>AI Slides</span>
                        </button>
                        <button class="aiws-mode-tab ${this.currentMode === 'sheets' ? 'active' : ''}" onclick="aiWorkspace.switchMode('sheets')">
                            <span class="mode-icon">📊</span>
                            <span>AI Sheets</span>
                        </button>
                        <button class="aiws-mode-tab" onclick="aiWorkspace.switchMode('docs')">
                            <span class="mode-icon">📄</span>
                            <span>AI Docs</span>
                        </button>
                        <button class="aiws-mode-tab" onclick="aiWorkspace.switchMode('images')">
                            <span class="mode-icon">🖼️</span>
                            <span>AI Images</span>
                        </button>
                    </div>

                    <!-- Template Gallery -->
                    <div class="aiws-content" id="aiws-content">
                        ${this.currentMode === 'slides' ? this.renderTemplateGallery() : ''}
                        ${this.currentMode === 'sheets' ? this.renderSheetsInterface() : ''}
                    </div>
                </div>
            </div>

            <!-- Hidden file input -->
            <input type="file" id="aiws-file-upload" accept=".xlsx,.xls,.csv,.pdf,.pptx,.docx" style="display:none"
                   onchange="aiWorkspace.handleFileUpload(this.files[0])">
        `;

        document.body.appendChild(modal);
        this.addStyles();
    }

    // Render template gallery
    renderTemplateGallery() {
        const allTemplates = this.getAllTemplates();
        const featuredTemplates = allTemplates.filter(t => t.featured);
        const categories = ['All', ...new Set(allTemplates.map(t => t.category))];

        return `
            <!-- Filters -->
            <div class="aiws-filters">
                <div class="aiws-tabs">
                    <button class="aiws-tab active">Explore</button>
                    <button class="aiws-tab">My Templates</button>
                </div>
                <div class="aiws-filter-row">
                    <select class="aiws-select" onchange="aiWorkspace.filterByCategory(this.value)">
                        <option value="all">All Categories</option>
                        ${Object.keys(this.templates).map(cat =>
                            `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
                        ).join('')}
                    </select>
                    <select class="aiws-select">
                        <option>All Themes</option>
                        <option>Professional</option>
                        <option>Modern</option>
                        <option>Creative</option>
                        <option>Minimal</option>
                    </select>
                    <select class="aiws-select">
                        <option>Sort by: Popularity</option>
                        <option>Sort by: Newest</option>
                        <option>Sort by: Name</option>
                    </select>
                </div>
            </div>

            <!-- Featured Templates -->
            ${featuredTemplates.length > 0 ? `
                <div class="aiws-section">
                    <h3 class="aiws-section-title">⭐ Featured Templates</h3>
                    <div class="aiws-templates-grid featured">
                        ${featuredTemplates.map(t => this.renderTemplateCard(t, true)).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- All Templates -->
            <div class="aiws-section">
                <h3 class="aiws-section-title">📚 All Templates</h3>
                <div class="aiws-templates-grid" id="templates-grid">
                    <!-- Add My Template Card -->
                    <div class="aiws-template-card add-template" onclick="aiWorkspace.createBlankTemplate()">
                        <div class="add-template-content">
                            <span class="add-icon">+</span>
                            <span class="add-text">Add My Template</span>
                        </div>
                        <div class="pptx-badge">PPTX Supported</div>
                    </div>
                    ${allTemplates.map(t => this.renderTemplateCard(t)).join('')}
                </div>
            </div>
        `;
    }

    // Render individual template card
    renderTemplateCard(template, featured = false) {
        return `
            <div class="aiws-template-card ${featured ? 'featured' : ''}" onclick="aiWorkspace.useTemplate('${template.id}')">
                <div class="template-thumbnail" style="background-image: url('${template.thumbnail}')">
                    <div class="template-overlay">
                        <button class="template-preview-btn">Preview</button>
                        <button class="template-use-btn">Use Template</button>
                    </div>
                </div>
                <div class="template-info">
                    <h4 class="template-name">${template.name}</h4>
                    <p class="template-meta">${template.slides} slides • ${template.style}</p>
                </div>
                <div class="template-colors">
                    ${template.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join('')}
                </div>
            </div>
        `;
    }

    // Render AI Sheets interface
    renderSheetsInterface() {
        return `
            <div class="aiws-sheets-container">
                <div class="aiws-sheets-hero">
                    <h2>📊 AI Sheets</h2>
                    <p>Describe what you need, AI builds the spreadsheet</p>
                </div>

                <div class="aiws-sheets-examples">
                    <h3>Quick Start Examples</h3>
                    <div class="sheets-example-grid">
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Create a monthly budget tracker with income, expenses, and savings')">
                            <span class="example-icon">💰</span>
                            <span class="example-text">Monthly Budget Tracker</span>
                        </div>
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Build a sales pipeline with stages, values, and probability')">
                            <span class="example-icon">📈</span>
                            <span class="example-text">Sales Pipeline</span>
                        </div>
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Create a project timeline with tasks, deadlines, and status')">
                            <span class="example-icon">📋</span>
                            <span class="example-text">Project Timeline</span>
                        </div>
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Build an expense report with categories, amounts, and totals')">
                            <span class="example-icon">🧾</span>
                            <span class="example-text">Expense Report</span>
                        </div>
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Create an inventory tracker with SKU, quantity, and reorder alerts')">
                            <span class="example-icon">📦</span>
                            <span class="example-text">Inventory Tracker</span>
                        </div>
                        <div class="sheets-example" onclick="aiWorkspace.aiSheetsPrompt('Build a financial model with revenue projections and growth rates')">
                            <span class="example-icon">🔮</span>
                            <span class="example-text">Financial Model</span>
                        </div>
                    </div>
                </div>

                <div class="aiws-excel-chat" id="excel-chat-container">
                    <div class="excel-chat-header">
                        <h3>💬 AI Excel Assistant</h3>
                        <p>Ask anything about your data - no formulas needed</p>
                    </div>
                    <div class="excel-chat-messages" id="excel-chat-messages">
                        <div class="excel-chat-message ai">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                Hi! I'm your AI Excel assistant. You can ask me things like:
                                <ul>
                                    <li>"Calculate year-over-year growth"</li>
                                    <li>"Create a pivot table of sales by region"</li>
                                    <li>"Find the top 10 customers by revenue"</li>
                                    <li>"Build a chart showing monthly trends"</li>
                                </ul>
                                Upload your data or start typing!
                            </div>
                        </div>
                    </div>
                    <div class="excel-chat-input">
                        <button class="excel-upload-btn" onclick="aiWorkspace.uploadExcelFile()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="12" y1="18" x2="12" y2="12"/>
                                <line x1="9" y1="15" x2="15" y2="15"/>
                            </svg>
                        </button>
                        <input type="text" id="excel-chat-input" placeholder="Ask AI to analyze your data or build something..."
                               onkeypress="if(event.key==='Enter')aiWorkspace.sendExcelChat()">
                        <button class="excel-send-btn" onclick="aiWorkspace.sendExcelChat()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <input type="file" id="excel-file-upload" accept=".xlsx,.xls,.csv" style="display:none"
                   onchange="aiWorkspace.handleExcelUpload(this.files[0])">
        `;
    }

    // Get all templates as flat array
    getAllTemplates() {
        const all = [];
        Object.values(this.templates).forEach(category => {
            all.push(...category);
        });
        return all;
    }

    // Switch mode (slides/sheets/docs)
    switchMode(mode) {
        this.currentMode = mode;
        const content = document.getElementById('aiws-content');

        // Update nav
        document.querySelectorAll('.aiws-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.textContent.toLowerCase().includes(mode)) {
                item.classList.add('active');
            }
        });

        // Update mode tabs
        document.querySelectorAll('.aiws-mode-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase().includes(mode)) {
                tab.classList.add('active');
            }
        });

        // Update content
        if (content) {
            if (mode === 'slides') {
                content.innerHTML = this.renderTemplateGallery();
            } else if (mode === 'sheets') {
                content.innerHTML = this.renderSheetsInterface();
            } else if (mode === 'docs') {
                content.innerHTML = this.renderDocsInterface();
            } else if (mode === 'images') {
                content.innerHTML = this.renderImagesInterface();
            }
        }
    }

    // Use a template
    useTemplate(templateId) {
        const allTemplates = this.getAllTemplates();
        const template = allTemplates.find(t => t.id === templateId);

        if (template) {
            // Close workspace and open presentation builder with this template
            this.close();

            if (typeof openAIPresentationChat === 'function') {
                openAIPresentationChat();
                // Set template in presentation builder
                setTimeout(() => {
                    if (typeof aiPresChat !== 'undefined') {
                        aiPresChat.addMessage(`I'll help you create a "${template.name}" presentation. What's your topic or company name?`, 'ai');
                    }
                }, 500);
            }
        }
    }

    // Generate from prompt
    generateFromPrompt() {
        const prompt = document.getElementById('aiws-prompt')?.value;
        if (!prompt || !prompt.trim()) {
            alert('Please enter a topic or description for your presentation');
            return;
        }

        if (this.currentMode === 'slides') {
            this.close();
            if (typeof openAIPresentationChat === 'function') {
                openAIPresentationChat();
                setTimeout(() => {
                    if (typeof aiPresChat !== 'undefined') {
                        aiPresChat.sendMessageDirect(prompt);
                    }
                }, 500);
            }
        } else if (this.currentMode === 'sheets') {
            this.aiSheetsPrompt(prompt);
        }
    }

    // AI Sheets prompt
    aiSheetsPrompt(prompt) {
        document.getElementById('aiws-prompt').value = prompt;
        this.addExcelChatMessage(prompt, 'user');

        // Simulate AI response
        setTimeout(() => {
            this.addExcelChatMessage(
                `I'll create that for you! Here's what I'm building:\n\n` +
                `📊 **${prompt}**\n\n` +
                `• Setting up columns and headers\n` +
                `• Adding formulas for calculations\n` +
                `• Creating formatting and styling\n\n` +
                `Your spreadsheet is ready! [Open in AI Sheets]`,
                'ai'
            );
        }, 1500);
    }

    // Excel chat functionality
    sendExcelChat() {
        const input = document.getElementById('excel-chat-input');
        const message = input.value.trim();
        if (!message) return;

        this.addExcelChatMessage(message, 'user');
        input.value = '';

        // Process the request
        this.processExcelRequest(message);
    }

    processExcelRequest(message) {
        const lower = message.toLowerCase();
        let response = '';

        // Pattern matching for common requests
        if (lower.includes('year') && lower.includes('year') || lower.includes('yoy')) {
            response = `📈 **Year-over-Year Analysis**\n\n` +
                `I've calculated the YoY growth for your data:\n\n` +
                `| Metric | 2023 | 2024 | YoY Change |\n` +
                `|--------|------|------|------------|\n` +
                `| Revenue | $312K | $358K | +14.7% |\n` +
                `| Expenses | $228K | $265K | +16.2% |\n` +
                `| Profit | $84K | $93K | +10.7% |\n\n` +
                `💡 **Insight:** Revenue growth outpaced expense growth, resulting in improved profitability.`;
        } else if (lower.includes('chart') || lower.includes('graph')) {
            response = `📊 **Chart Created**\n\n` +
                `I've created a chart based on your request. Here's the configuration:\n\n` +
                `• Type: ${lower.includes('pie') ? 'Pie Chart' : lower.includes('line') ? 'Line Chart' : 'Bar Chart'}\n` +
                `• Data Range: Auto-detected from your selection\n` +
                `• Labels: Included\n\n` +
                `[View Chart] [Edit Chart] [Export]`;
        } else if (lower.includes('pivot') || lower.includes('summary')) {
            response = `📋 **Pivot Table Created**\n\n` +
                `I've built a pivot table summarizing your data:\n\n` +
                `| Category | Q1 | Q2 | Q3 | Q4 | Total |\n` +
                `|----------|----|----|----|----|-------|\n` +
                `| Sales | $62K | $71K | $78K | $89K | $300K |\n` +
                `| Services | $18K | $21K | $24K | $27K | $90K |\n` +
                `| Other | $5K | $6K | $7K | $8K | $26K |\n\n` +
                `[Customize Pivot] [Add Fields] [Export]`;
        } else if (lower.includes('top') || lower.includes('rank')) {
            response = `🏆 **Top Items Analysis**\n\n` +
                `Here are the top items based on your criteria:\n\n` +
                `1. **Enterprise Corp** - $125,000 (15.2%)\n` +
                `2. **Tech Solutions** - $98,500 (12.0%)\n` +
                `3. **Global Inc** - $87,200 (10.6%)\n` +
                `4. **Acme Industries** - $76,800 (9.3%)\n` +
                `5. **StartUp LLC** - $65,400 (8.0%)\n\n` +
                `💡 Top 5 accounts represent 55.1% of total revenue.`;
        } else if (lower.includes('formula') || lower.includes('calculate')) {
            response = `🔢 **Formula Generated**\n\n` +
                `I've created the formula you need:\n\n` +
                `\`\`\`\n=SUMIFS(Revenue,Date,">="&StartDate,Date,"<="&EndDate)\`\`\`\n\n` +
                `This formula will calculate the sum based on your date range.\n\n` +
                `[Apply Formula] [Explain Formula] [Modify]`;
        } else {
            response = `🤔 I understand you want to: **${message}**\n\n` +
                `Let me help you with that. Here are some options:\n\n` +
                `• [Create Spreadsheet] - Build a new sheet with this data\n` +
                `• [Analyze Data] - Run analysis on existing data\n` +
                `• [Build Chart] - Visualize this information\n` +
                `• [Generate Report] - Create a formatted report\n\n` +
                `What would you like me to do?`;
        }

        setTimeout(() => {
            this.addExcelChatMessage(response, 'ai');
        }, 1000);
    }

    addExcelChatMessage(content, type) {
        const container = document.getElementById('excel-chat-messages');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `excel-chat-message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${type === 'ai' ? '🤖' : '👤'}</div>
            <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    // File upload handlers
    uploadFile() {
        document.getElementById('aiws-file-upload').click();
    }

    uploadExcelFile() {
        document.getElementById('excel-file-upload').click();
    }

    handleFileUpload(file) {
        if (!file) return;
        // Open avatar-guided upload flow
        this.openAvatarUploadFlow(file);
    }

    handleExcelUpload(file) {
        if (!file) return;
        this.addExcelChatMessage(`📎 Uploaded: **${file.name}**`, 'user');

        setTimeout(() => {
            this.addExcelChatMessage(
                `✅ I've loaded your file! Here's what I found:\n\n` +
                `• **Rows:** 1,247\n` +
                `• **Columns:** 12\n` +
                `• **Data types:** Numbers, Dates, Text\n\n` +
                `What would you like me to do with this data?\n\n` +
                `• "Summarize the data"\n` +
                `• "Create a chart of revenue by month"\n` +
                `• "Calculate totals and averages"\n` +
                `• "Find trends and patterns"`,
                'ai'
            );
        }, 1500);
    }

    // ============================================
    // AVATAR-GUIDED UPLOAD WORKFLOW
    // ============================================

    openAvatarUploadFlow(file = null) {
        // Create the avatar upload modal
        const existing = document.getElementById('avatar-upload-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'avatar-upload-modal';
        modal.className = 'avatar-upload-modal';

        // Get selected avatar or default
        const selectedAvatar = localStorage.getItem('selectedAvatar') || 'zac';
        const avatarImages = {
            zac: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            bolt: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=150&h=150&fit=crop&crop=face',
            zeus: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            alaina: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
        };
        const avatarImg = avatarImages[selectedAvatar] || avatarImages.zac;
        const avatarName = selectedAvatar.charAt(0).toUpperCase() + selectedAvatar.slice(1);

        modal.innerHTML = `
            <div class="aum-container">
                <button class="aum-close" onclick="aiWorkspace.closeAvatarUpload()">×</button>

                <div class="aum-content">
                    <!-- Avatar Section -->
                    <div class="aum-avatar-section">
                        <div class="aum-avatar">
                            <img src="${avatarImg}" alt="${avatarName}">
                            <div class="aum-avatar-glow"></div>
                        </div>
                        <div class="aum-avatar-name">${avatarName}</div>
                    </div>

                    <!-- Chat/Progress Section -->
                    <div class="aum-chat-section">
                        <div class="aum-messages" id="aum-messages">
                            <!-- Messages will be added here -->
                        </div>

                        <!-- Action Buttons (hidden until needed) -->
                        <div class="aum-actions" id="aum-actions" style="display: none;">
                            <!-- Dynamic action buttons -->
                        </div>
                    </div>
                </div>

                <!-- Progress Steps -->
                <div class="aum-progress" id="aum-progress">
                    <div class="aum-step completed" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">Upload</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="aum-step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">Analyze</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="aum-step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">Review</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="aum-step" data-step="4">
                        <div class="step-number">4</div>
                        <div class="step-label">Create</div>
                    </div>
                </div>

                <!-- Hidden file input for additional uploads -->
                <input type="file" id="aum-file-input"
                    accept=".xlsx,.xls,.csv,.pdf,.pptx,.ppt,.docx,.doc,.jpg,.jpeg,.png,.gif,.webp"
                    style="display: none"
                    onchange="aiWorkspace.handleAvatarFileSelect(this.files[0])">
            </div>
        `;

        document.body.appendChild(modal);
        this.addAvatarUploadStyles();

        // Animate in
        setTimeout(() => modal.classList.add('active'), 50);

        // Store state
        this.uploadState = {
            step: 1,
            file: null,
            parsedData: null,
            selectedAction: null
        };

        // Start the flow
        if (file) {
            this.handleAvatarFileSelect(file);
        } else {
            this.showUploadDropzone();
        }
    }

    showUploadDropzone() {
        const messagesContainer = document.getElementById('aum-messages');
        const actionsContainer = document.getElementById('aum-actions');

        messagesContainer.innerHTML = `
            <div class="aum-message avatar">
                <div class="message-bubble">
                    Hey there! 👋 I'm here to help you turn your data into something amazing.
                    <br><br>
                    <strong>Upload any file and I'll handle the rest:</strong>
                </div>
            </div>
        `;

        actionsContainer.style.display = 'block';
        actionsContainer.innerHTML = `
            <div class="aum-dropzone" id="aum-dropzone" onclick="document.getElementById('aum-file-input').click()">
                <div class="dropzone-icon">📁</div>
                <div class="dropzone-text">
                    <strong>Drop your file here</strong>
                    <span>or click to browse</span>
                </div>
                <div class="dropzone-formats">
                    Excel • PDF • Word • PowerPoint • Images • CSV
                </div>
            </div>
        `;

        // Add drag and drop
        const dropzone = document.getElementById('aum-dropzone');
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleAvatarFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    handleAvatarFileSelect(file) {
        if (!file) return;

        this.uploadState.file = file;
        this.uploadState.step = 2;
        this.updateProgressSteps(2);

        const fileType = this.getFileType(file);
        const fileIcon = this.getFileIcon(fileType);

        const messagesContainer = document.getElementById('aum-messages');
        const actionsContainer = document.getElementById('aum-actions');

        // Show file received message
        messagesContainer.innerHTML = `
            <div class="aum-message user">
                <div class="message-bubble file-bubble">
                    <span class="file-icon">${fileIcon}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
            </div>
            <div class="aum-message avatar">
                <div class="message-bubble">
                    Perfect! I received your ${fileType.toUpperCase()} file. Let me analyze it...
                </div>
            </div>
        `;

        actionsContainer.style.display = 'block';
        actionsContainer.innerHTML = `
            <div class="aum-analyzing">
                <div class="analyzing-spinner"></div>
                <div class="analyzing-text">Analyzing your data...</div>
                <div class="analyzing-steps">
                    <div class="analyze-step active" id="as-1">📄 Reading file structure</div>
                    <div class="analyze-step" id="as-2">🔍 Detecting data types</div>
                    <div class="analyze-step" id="as-3">📊 Extracting financial data</div>
                    <div class="analyze-step" id="as-4">✨ Preparing insights</div>
                </div>
            </div>
        `;

        // Simulate analysis steps
        this.simulateAnalysis(file, fileType);
    }

    simulateAnalysis(file, fileType) {
        const steps = ['as-1', 'as-2', 'as-3', 'as-4'];
        let currentStep = 0;

        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                document.getElementById(steps[currentStep - 1])?.classList.add('completed');
            }
            if (currentStep < steps.length) {
                document.getElementById(steps[currentStep])?.classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
                // Show analysis results
                setTimeout(() => this.showAnalysisResults(file, fileType), 500);
            }
        }, 600);
    }

    showAnalysisResults(file, fileType) {
        this.uploadState.step = 3;
        this.updateProgressSteps(3);

        // Generate mock parsed data based on file type
        const parsedData = this.generateMockParsedData(file, fileType);
        this.uploadState.parsedData = parsedData;

        const messagesContainer = document.getElementById('aum-messages');
        const actionsContainer = document.getElementById('aum-actions');

        messagesContainer.innerHTML = `
            <div class="aum-message user">
                <div class="message-bubble file-bubble">
                    <span class="file-icon">${this.getFileIcon(fileType)}</span>
                    <span class="file-name">${file.name}</span>
                </div>
            </div>
            <div class="aum-message avatar">
                <div class="message-bubble">
                    ✅ <strong>Analysis Complete!</strong>
                    <br><br>
                    Here's what I found in your data:
                </div>
            </div>
        `;

        actionsContainer.style.display = 'block';
        actionsContainer.innerHTML = `
            <div class="aum-data-summary">
                <div class="summary-header">
                    <span class="summary-icon">📊</span>
                    <span class="summary-title">Data Summary</span>
                </div>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="item-value">${parsedData.rows}</div>
                        <div class="item-label">Rows</div>
                    </div>
                    <div class="summary-item">
                        <div class="item-value">${parsedData.columns}</div>
                        <div class="item-label">Columns</div>
                    </div>
                    <div class="summary-item">
                        <div class="item-value">${parsedData.revenue}</div>
                        <div class="item-label">Revenue Found</div>
                    </div>
                    <div class="summary-item">
                        <div class="item-value">${parsedData.dateRange}</div>
                        <div class="item-label">Date Range</div>
                    </div>
                </div>
                <div class="summary-insights">
                    <div class="insight-title">🔍 Key Financial Metrics Detected:</div>
                    <ul class="insight-list">
                        ${parsedData.metrics.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="aum-confirmation">
                <button class="confirm-btn" onclick="aiWorkspace.showActionChoice()">
                    ✓ Looks Good - What's Next?
                </button>
                <button class="modify-btn" onclick="aiWorkspace.modifyData()">
                    ✏️ Adjust Data
                </button>
            </div>
        `;
    }

    showActionChoice() {
        this.uploadState.step = 4;
        this.updateProgressSteps(4);

        const messagesContainer = document.getElementById('aum-messages');
        const actionsContainer = document.getElementById('aum-actions');

        // Keep existing messages, add new one
        const currentMessages = messagesContainer.innerHTML;
        messagesContainer.innerHTML = `
            ${currentMessages}
            <div class="aum-message avatar highlight">
                <div class="message-bubble">
                    🎯 <strong>What would you like me to create?</strong>
                </div>
            </div>
        `;

        actionsContainer.innerHTML = `
            <div class="aum-action-choices">
                <div class="action-choice" onclick="aiWorkspace.selectAction('deck')">
                    <div class="choice-icon">📽️</div>
                    <div class="choice-content">
                        <div class="choice-title">Create a Presentation</div>
                        <div class="choice-desc">Beautiful slides with charts and insights</div>
                    </div>
                    <div class="choice-arrow">→</div>
                </div>

                <div class="action-choice" onclick="aiWorkspace.selectAction('model')">
                    <div class="choice-icon">📈</div>
                    <div class="choice-content">
                        <div class="choice-title">Build a Financial Model</div>
                        <div class="choice-desc">Pro forma projections & scenarios</div>
                    </div>
                    <div class="choice-arrow">→</div>
                </div>

                <div class="action-choice" onclick="aiWorkspace.selectAction('report')">
                    <div class="choice-icon">📄</div>
                    <div class="choice-content">
                        <div class="choice-title">Generate a Report</div>
                        <div class="choice-desc">Executive summary with key findings</div>
                    </div>
                    <div class="choice-arrow">→</div>
                </div>

                <div class="action-choice" onclick="aiWorkspace.selectAction('dashboard')">
                    <div class="choice-icon">📊</div>
                    <div class="choice-content">
                        <div class="choice-title">Create a Dashboard</div>
                        <div class="choice-desc">Interactive charts and KPIs</div>
                    </div>
                    <div class="choice-arrow">→</div>
                </div>
            </div>
        `;

        // Scroll to see choices
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    selectAction(action) {
        this.uploadState.selectedAction = action;
        this.closeAvatarUpload();

        // Route to appropriate builder
        switch (action) {
            case 'deck':
                if (typeof openAIPresentationChat === 'function') {
                    openAIPresentationChat();
                    setTimeout(() => {
                        if (typeof aiPresChat !== 'undefined') {
                            aiPresChat.addMessage(`Great! I've loaded your financial data. I'll create a presentation with:
• Revenue & expense analysis
• Growth trends and projections
• Key insights and recommendations

What style would you prefer? (Professional, Modern, or Bold)`, 'ai');
                        }
                    }, 500);
                }
                break;

            case 'model':
                if (typeof openProFormaPlanner === 'function') {
                    openProFormaPlanner();
                } else {
                    alert('Pro Forma Planner coming soon!');
                }
                break;

            case 'report':
                if (typeof openAutoReportGenerator === 'function') {
                    openAutoReportGenerator();
                } else {
                    alert('Report Generator coming soon!');
                }
                break;

            case 'dashboard':
                if (typeof openDashboardBuilder === 'function') {
                    openDashboardBuilder();
                } else {
                    alert('Dashboard Builder coming soon!');
                }
                break;
        }
    }

    modifyData() {
        // Allow user to refine the data interpretation
        const actionsContainer = document.getElementById('aum-actions');
        actionsContainer.innerHTML = `
            <div class="aum-modify-panel">
                <div class="modify-header">Adjust Data Interpretation</div>
                <div class="modify-options">
                    <label class="modify-option">
                        <input type="checkbox" checked> Include revenue data
                    </label>
                    <label class="modify-option">
                        <input type="checkbox" checked> Include expense data
                    </label>
                    <label class="modify-option">
                        <input type="checkbox" checked> Calculate growth rates
                    </label>
                    <label class="modify-option">
                        <input type="checkbox"> Exclude first row (headers)
                    </label>
                </div>
                <div class="modify-actions">
                    <button onclick="aiWorkspace.showAnalysisResults(aiWorkspace.uploadState.file, aiWorkspace.getFileType(aiWorkspace.uploadState.file))">
                        Re-analyze
                    </button>
                </div>
            </div>
        `;
    }

    updateProgressSteps(currentStep) {
        const steps = document.querySelectorAll('.aum-step');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('completed', 'active');
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
    }

    closeAvatarUpload() {
        const modal = document.getElementById('avatar-upload-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Helper functions
    getFileType(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const typeMap = {
            'xlsx': 'excel', 'xls': 'excel', 'csv': 'csv',
            'pdf': 'pdf',
            'pptx': 'powerpoint', 'ppt': 'powerpoint',
            'docx': 'word', 'doc': 'word',
            'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'webp': 'image'
        };
        return typeMap[ext] || 'unknown';
    }

    getFileIcon(fileType) {
        const icons = {
            'excel': '📊',
            'csv': '📋',
            'pdf': '📕',
            'powerpoint': '📽️',
            'word': '📘',
            'image': '🖼️',
            'unknown': '📄'
        };
        return icons[fileType] || '📄';
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    generateMockParsedData(file, fileType) {
        // Generate realistic mock data based on file type
        return {
            rows: Math.floor(Math.random() * 500) + 100,
            columns: Math.floor(Math.random() * 15) + 5,
            revenue: '$' + (Math.floor(Math.random() * 900) + 100) + 'K',
            dateRange: '2023 - 2024',
            metrics: [
                'Revenue: $' + (Math.floor(Math.random() * 500) + 200) + 'K',
                'Expenses: $' + (Math.floor(Math.random() * 300) + 100) + 'K',
                'Net Profit: $' + (Math.floor(Math.random() * 200) + 50) + 'K',
                'Growth Rate: ' + (Math.floor(Math.random() * 30) + 5) + '%'
            ]
        };
    }

    addAvatarUploadStyles() {
        if (document.getElementById('avatar-upload-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'avatar-upload-styles';
        styles.textContent = `
            .avatar-upload-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                z-index: 200000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .avatar-upload-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .aum-container {
                width: 90%;
                max-width: 700px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 24px;
                padding: 32px;
                position: relative;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            }

            .aum-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #888;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .aum-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }

            .aum-content {
                display: flex;
                gap: 32px;
                margin-bottom: 32px;
            }

            /* Avatar Section */
            .aum-avatar-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            }

            .aum-avatar {
                position: relative;
                width: 100px;
                height: 100px;
            }

            .aum-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid #6366f1;
            }

            .aum-avatar-glow {
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                opacity: 0.3;
                animation: pulse 2s infinite;
                z-index: -1;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.1); opacity: 0.5; }
            }

            .aum-avatar-name {
                color: #fff;
                font-weight: 600;
                font-size: 1.1rem;
            }

            /* Chat Section */
            .aum-chat-section {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .aum-messages {
                max-height: 200px;
                overflow-y: auto;
                margin-bottom: 16px;
            }

            .aum-message {
                margin-bottom: 12px;
            }

            .aum-message.avatar .message-bubble {
                background: rgba(99, 102, 241, 0.2);
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .aum-message.user .message-bubble {
                background: rgba(255, 255, 255, 0.1);
                margin-left: auto;
            }

            .aum-message.highlight .message-bubble {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
                border-color: rgba(139, 92, 246, 0.5);
            }

            .message-bubble {
                padding: 14px 18px;
                border-radius: 16px;
                color: #fff;
                line-height: 1.5;
                max-width: 100%;
            }

            .file-bubble {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(16, 185, 129, 0.2) !important;
                border: 1px solid rgba(16, 185, 129, 0.3) !important;
                width: fit-content;
            }

            .file-icon {
                font-size: 1.5rem;
            }

            .file-name {
                font-weight: 500;
            }

            .file-size {
                color: #888;
                font-size: 0.85rem;
            }

            /* Dropzone */
            .aum-dropzone {
                border: 2px dashed rgba(99, 102, 241, 0.5);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                background: rgba(99, 102, 241, 0.05);
            }

            .aum-dropzone:hover, .aum-dropzone.dragover {
                border-color: #6366f1;
                background: rgba(99, 102, 241, 0.15);
            }

            .dropzone-icon {
                font-size: 3rem;
                margin-bottom: 12px;
            }

            .dropzone-text {
                color: #fff;
                margin-bottom: 8px;
            }

            .dropzone-text strong {
                display: block;
                font-size: 1.2rem;
                margin-bottom: 4px;
            }

            .dropzone-text span {
                color: #888;
            }

            .dropzone-formats {
                color: #666;
                font-size: 0.85rem;
            }

            /* Analyzing Animation */
            .aum-analyzing {
                text-align: center;
                padding: 20px;
            }

            .analyzing-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(99, 102, 241, 0.2);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .analyzing-text {
                color: #fff;
                font-weight: 500;
                margin-bottom: 16px;
            }

            .analyzing-steps {
                display: flex;
                flex-direction: column;
                gap: 8px;
                text-align: left;
            }

            .analyze-step {
                padding: 8px 12px;
                border-radius: 8px;
                color: #666;
                font-size: 0.9rem;
                transition: all 0.3s;
            }

            .analyze-step.active {
                background: rgba(99, 102, 241, 0.1);
                color: #818cf8;
            }

            .analyze-step.completed {
                color: #10b981;
            }

            /* Data Summary */
            .aum-data-summary {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 16px;
            }

            .summary-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            .summary-icon {
                font-size: 1.5rem;
            }

            .summary-title {
                color: #fff;
                font-weight: 600;
                font-size: 1.1rem;
            }

            .summary-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
                margin-bottom: 16px;
            }

            .summary-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 12px;
                border-radius: 10px;
                text-align: center;
            }

            .item-value {
                color: #6366f1;
                font-size: 1.3rem;
                font-weight: 700;
            }

            .item-label {
                color: #888;
                font-size: 0.8rem;
                margin-top: 4px;
            }

            .summary-insights {
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.2);
                border-radius: 10px;
                padding: 12px;
            }

            .insight-title {
                color: #10b981;
                font-weight: 500;
                margin-bottom: 8px;
            }

            .insight-list {
                margin: 0;
                padding-left: 20px;
                color: #aaa;
            }

            .insight-list li {
                margin-bottom: 4px;
            }

            /* Confirmation Buttons */
            .aum-confirmation {
                display: flex;
                gap: 12px;
            }

            .confirm-btn {
                flex: 1;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                color: #fff;
                padding: 14px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .confirm-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
            }

            .modify-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                padding: 14px 20px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .modify-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            /* Action Choices */
            .aum-action-choices {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .action-choice {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 18px 20px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .action-choice:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: rgba(99, 102, 241, 0.3);
                transform: translateX(4px);
            }

            .choice-icon {
                font-size: 2rem;
                width: 50px;
                height: 50px;
                background: rgba(99, 102, 241, 0.2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .choice-content {
                flex: 1;
            }

            .choice-title {
                color: #fff;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .choice-desc {
                color: #888;
                font-size: 0.9rem;
            }

            .choice-arrow {
                color: #6366f1;
                font-size: 1.5rem;
            }

            /* Progress Steps */
            .aum-progress {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0;
                padding-top: 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .aum-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .step-number {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                color: #666;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                transition: all 0.3s;
            }

            .step-label {
                color: #666;
                font-size: 0.85rem;
                transition: all 0.3s;
            }

            .aum-step.active .step-number {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            }

            .aum-step.active .step-label {
                color: #fff;
            }

            .aum-step.completed .step-number {
                background: #10b981;
                color: #fff;
            }

            .aum-step.completed .step-label {
                color: #10b981;
            }

            .step-line {
                width: 60px;
                height: 2px;
                background: rgba(255, 255, 255, 0.1);
                margin: 0 8px;
                margin-bottom: 28px;
            }

            /* Modify Panel */
            .aum-modify-panel {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 20px;
            }

            .modify-header {
                color: #fff;
                font-weight: 600;
                margin-bottom: 16px;
            }

            .modify-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 16px;
            }

            .modify-option {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #ddd;
                cursor: pointer;
            }

            .modify-option input {
                width: 18px;
                height: 18px;
            }

            .modify-actions button {
                background: #6366f1;
                border: none;
                color: #fff;
                padding: 12px 24px;
                border-radius: 10px;
                cursor: pointer;
            }
        `;

        document.head.appendChild(styles);
    }

    // Other interfaces
    renderDocsInterface() {
        return `
            <div class="aiws-coming-soon">
                <span class="coming-icon">📄</span>
                <h2>AI Docs</h2>
                <p>AI-powered document creation coming soon!</p>
                <p>Create reports, proposals, and documents with AI assistance.</p>
            </div>
        `;
    }

    renderImagesInterface() {
        return `
            <div class="aiws-images-container">
                <div class="aiws-images-hero">
                    <h2>🖼️ AI Images</h2>
                    <p>Generate or find the perfect images for your presentations</p>
                </div>

                <!-- AI Generation Section -->
                <div class="aiws-ai-gen-section">
                    <div class="ai-gen-header">
                        <span class="ai-gen-badge">✨ AI Generate</span>
                        <span class="ai-gen-subtitle">Describe what you want</span>
                    </div>
                    <div class="aiws-image-prompt">
                        <input type="text" id="image-prompt" placeholder="A modern office with city skyline view, professional, cinematic lighting...">
                        <button onclick="aiWorkspace.generateImage()">
                            <span class="gen-icon">✨</span> Generate
                        </button>
                    </div>
                    <div class="aiws-image-styles">
                        <div class="style-options">
                            <button class="style-btn active" data-style="photorealistic" onclick="aiWorkspace.selectImageStyle(this)">
                                <span class="style-icon">📷</span>
                                Photorealistic
                            </button>
                            <button class="style-btn" data-style="illustration" onclick="aiWorkspace.selectImageStyle(this)">
                                <span class="style-icon">🎨</span>
                                Illustration
                            </button>
                            <button class="style-btn" data-style="3d" onclick="aiWorkspace.selectImageStyle(this)">
                                <span class="style-icon">🎮</span>
                                3D Render
                            </button>
                            <button class="style-btn" data-style="minimal" onclick="aiWorkspace.selectImageStyle(this)">
                                <span class="style-icon">⬜</span>
                                Minimalist
                            </button>
                            <button class="style-btn" data-style="abstract" onclick="aiWorkspace.selectImageStyle(this)">
                                <span class="style-icon">🌀</span>
                                Abstract
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stock Images Section -->
                <div class="aiws-stock-section">
                    <div class="stock-header">
                        <h3>📸 Stock Images</h3>
                        <div class="stock-search">
                            <input type="text" id="stock-search-input" placeholder="Search images..." onkeypress="if(event.key==='Enter')aiWorkspace.searchImages(this.value)">
                            <button onclick="aiWorkspace.searchImages(document.getElementById('stock-search-input').value)">Search</button>
                        </div>
                    </div>
                    <div class="stock-categories">
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('business meeting')">Business</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('technology')">Technology</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('finance money')">Finance</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('data analytics')">Data</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('office workspace')">Office</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('real estate building')">Real Estate</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('startup team')">Startup</span>
                        <span class="cat-tag" onclick="aiWorkspace.searchImages('abstract background')">Abstract</span>
                    </div>
                    <div class="stock-results" id="stock-results">
                        ${this.getDefaultStockImages()}
                    </div>
                </div>
            </div>
        `;
    }

    getDefaultStockImages() {
        // Pre-populated stock images for immediate display
        const defaultImages = [
            { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', title: 'Business Meeting' },
            { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop', title: 'Team Collaboration' },
            { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', title: 'Data Dashboard' },
            { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', title: 'Corporate Building' },
            { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', title: 'Financial Charts' },
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', title: 'Analytics' },
            { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop', title: 'Real Estate' },
            { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', title: 'Professional' }
        ];

        return `
            <div class="stock-grid">
                ${defaultImages.map(img => `
                    <div class="stock-image-card" onclick="aiWorkspace.selectStockImage('${img.url}', '${img.title}')">
                        <img src="${img.url}" alt="${img.title}" loading="lazy">
                        <div class="stock-image-overlay">
                            <span class="use-btn">Use Image</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    selectImageStyle(btn) {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedImageStyle = btn.dataset.style;
    }

    generateImage() {
        const prompt = document.getElementById('image-prompt')?.value;
        if (!prompt) {
            alert('Please enter a description for your image');
            return;
        }

        const style = this.selectedImageStyle || 'photorealistic';
        const resultsContainer = document.getElementById('stock-results');

        // Show loading state
        resultsContainer.innerHTML = `
            <div class="ai-generating">
                <div class="gen-spinner"></div>
                <div class="gen-text">
                    <strong>Generating your image...</strong>
                    <p>Creating "${prompt}" in ${style} style</p>
                </div>
            </div>
        `;

        // Simulate AI generation with placeholder
        setTimeout(() => {
            // Map prompts to related Unsplash images
            const keywords = prompt.toLowerCase();
            let category = 'abstract';
            if (keywords.includes('office') || keywords.includes('business')) category = 'business office';
            if (keywords.includes('tech') || keywords.includes('computer')) category = 'technology';
            if (keywords.includes('city') || keywords.includes('skyline')) category = 'city skyline';
            if (keywords.includes('nature') || keywords.includes('landscape')) category = 'nature landscape';
            if (keywords.includes('team') || keywords.includes('people')) category = 'team collaboration';

            const mockGeneratedImages = [
                `https://source.unsplash.com/800x600/?${encodeURIComponent(category)},1`,
                `https://source.unsplash.com/800x600/?${encodeURIComponent(category)},2`,
                `https://source.unsplash.com/800x600/?${encodeURIComponent(category)},3`,
                `https://source.unsplash.com/800x600/?${encodeURIComponent(category)},4`
            ];

            resultsContainer.innerHTML = `
                <div class="ai-results-header">
                    <span class="results-badge">✨ AI Generated</span>
                    <span class="results-prompt">"${prompt}"</span>
                </div>
                <div class="stock-grid">
                    ${mockGeneratedImages.map((url, i) => `
                        <div class="stock-image-card ai-generated" onclick="aiWorkspace.selectStockImage('${url}', 'AI Generated ${i+1}')">
                            <img src="${url}" alt="AI Generated" loading="lazy">
                            <div class="ai-badge">AI</div>
                            <div class="stock-image-overlay">
                                <span class="use-btn">Use Image</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <p class="ai-note">Note: Full AI generation requires DALL-E or Stable Diffusion API integration</p>
            `;
        }, 2000);
    }

    searchImages(query) {
        if (!query) return;

        const resultsContainer = document.getElementById('stock-results');
        resultsContainer.innerHTML = `
            <div class="ai-generating">
                <div class="gen-spinner"></div>
                <div class="gen-text">Searching for "${query}"...</div>
            </div>
        `;

        // Use Unsplash source for demo (replace with proper API in production)
        setTimeout(() => {
            const searchResults = [];
            for (let i = 1; i <= 12; i++) {
                searchResults.push({
                    url: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)},${i}`,
                    title: `${query} ${i}`
                });
            }

            resultsContainer.innerHTML = `
                <div class="search-results-header">
                    <span>Results for "${query}"</span>
                </div>
                <div class="stock-grid">
                    ${searchResults.map(img => `
                        <div class="stock-image-card" onclick="aiWorkspace.selectStockImage('${img.url}', '${img.title}')">
                            <img src="${img.url}" alt="${img.title}" loading="lazy">
                            <div class="stock-image-overlay">
                                <span class="use-btn">Use Image</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }, 1000);
    }

    selectStockImage(url, title) {
        // Store selected image for use in presentations
        this.selectedImage = { url, title };

        // Show confirmation
        const confirmation = document.createElement('div');
        confirmation.className = 'image-selected-toast';
        confirmation.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✅</span>
                <span class="toast-text">Image selected: ${title}</span>
            </div>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        document.body.appendChild(confirmation);

        // Auto-remove after 3 seconds
        setTimeout(() => confirmation.remove(), 3000);

        // If presentation builder is open, add to it
        if (typeof aiPresChat !== 'undefined' && aiPresChat.addImageToSlide) {
            aiPresChat.addImageToSlide(url, title);
        }
    }

    // Navigation
    showNewProject() {
        // Reset to creation mode
    }

    showHome() {
        this.switchMode('slides');
    }

    showMyProjects() {
        alert('My Projects - Coming soon!');
    }

    showHub() {
        alert('Hub - Coming soon!');
    }

    showUpgrade() {
        alert('Upgrade to Pro for unlimited access!');
    }

    createBlankTemplate() {
        this.close();
        if (typeof openAIPresentationChat === 'function') {
            openAIPresentationChat();
        }
    }

    filterByCategory(category) {
        const grid = document.getElementById('templates-grid');
        if (!grid) return;

        const allTemplates = category === 'all' ?
            this.getAllTemplates() :
            this.templates[category] || [];

        grid.innerHTML = `
            <div class="aiws-template-card add-template" onclick="aiWorkspace.createBlankTemplate()">
                <div class="add-template-content">
                    <span class="add-icon">+</span>
                    <span class="add-text">Add My Template</span>
                </div>
                <div class="pptx-badge">PPTX Supported</div>
            </div>
            ${allTemplates.map(t => this.renderTemplateCard(t)).join('')}
        `;
    }

    voiceInput() {
        alert('Voice input coming soon! Speak your presentation idea.');
    }

    preloadImages() {
        // Preload template thumbnails
    }

    // Add all styles
    addStyles() {
        if (document.getElementById('ai-workspace-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ai-workspace-styles';
        styles.textContent = `
            .ai-workspace-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #0f0f1a;
                z-index: 100000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .ai-workspace-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .aiws-container {
                display: flex;
                height: 100%;
            }

            /* Sidebar */
            .aiws-sidebar {
                width: 220px;
                background: #0a0a12;
                border-right: 1px solid rgba(255,255,255,0.1);
                display: flex;
                flex-direction: column;
                padding: 16px 0;
            }

            .aiws-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                cursor: pointer;
                margin-bottom: 24px;
            }

            .aiws-logo .logo-icon {
                font-size: 1.5rem;
            }

            .aiws-logo .logo-text {
                font-weight: 700;
                color: #fff;
                font-size: 1rem;
            }

            .aiws-nav {
                flex: 1;
            }

            .aiws-nav-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                color: #888;
                cursor: pointer;
                transition: all 0.2s;
                border-left: 3px solid transparent;
            }

            .aiws-nav-item:hover {
                background: rgba(255,255,255,0.05);
                color: #fff;
            }

            .aiws-nav-item.active {
                background: rgba(99,102,241,0.1);
                color: #818cf8;
                border-left-color: #818cf8;
            }

            .aiws-nav-item .nav-icon {
                font-size: 1.2rem;
                width: 24px;
                text-align: center;
            }

            .aiws-sidebar-footer {
                padding: 16px 20px;
            }

            .aiws-upgrade-btn {
                width: 100%;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                color: #fff;
                padding: 12px;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            /* Main Content */
            .aiws-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .aiws-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 32px;
            }

            .aiws-header-actions {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .aiws-link {
                color: #888;
                text-decoration: none;
                font-size: 0.9rem;
            }

            .aiws-link:hover {
                color: #fff;
            }

            .aiws-close-btn {
                background: none;
                border: none;
                color: #888;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 4px 8px;
            }

            .aiws-close-btn:hover {
                color: #fff;
            }

            /* Hero Input */
            .aiws-hero {
                padding: 40px 32px;
                display: flex;
                justify-content: center;
            }

            .aiws-input-container {
                width: 100%;
                max-width: 700px;
                background: #fff;
                border-radius: 16px;
                padding: 16px;
                box-shadow: 0 4px 30px rgba(0,0,0,0.3);
            }

            .aiws-input-container textarea {
                width: 100%;
                border: none;
                outline: none;
                resize: none;
                font-size: 1rem;
                color: #333;
                background: transparent;
            }

            .aiws-input-container textarea::placeholder {
                color: #999;
            }

            .aiws-input-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 8px;
            }

            .aiws-input-btn {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
            }

            .aiws-input-btn:hover {
                background: #f0f0f0;
                color: #333;
            }

            .aiws-submit-btn {
                background: #6366f1;
                border: none;
                color: #fff;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
            }

            .aiws-submit-btn:hover {
                background: #5558e3;
            }

            /* Mode Tabs */
            .aiws-mode-tabs {
                display: flex;
                justify-content: center;
                gap: 8px;
                padding: 0 32px 24px;
            }

            .aiws-mode-tab {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 16px 24px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                color: #888;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 100px;
            }

            .aiws-mode-tab:hover {
                background: rgba(255,255,255,0.08);
                color: #fff;
            }

            .aiws-mode-tab.active {
                background: rgba(99,102,241,0.1);
                border-color: #6366f1;
                color: #fff;
            }

            .aiws-mode-tab .mode-icon {
                font-size: 1.5rem;
            }

            /* Content Area */
            .aiws-content {
                flex: 1;
                overflow-y: auto;
                padding: 0 32px 32px;
            }

            /* Filters */
            .aiws-filters {
                margin-bottom: 24px;
            }

            .aiws-tabs {
                display: flex;
                gap: 24px;
                margin-bottom: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 12px;
            }

            .aiws-tab {
                background: none;
                border: none;
                color: #888;
                font-size: 1rem;
                cursor: pointer;
                padding-bottom: 8px;
                border-bottom: 2px solid transparent;
            }

            .aiws-tab.active {
                color: #fff;
                border-bottom-color: #6366f1;
            }

            .aiws-filter-row {
                display: flex;
                gap: 12px;
            }

            .aiws-select {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #fff;
                padding: 10px 16px;
                border-radius: 8px;
                cursor: pointer;
            }

            /* Template Grid */
            .aiws-section {
                margin-bottom: 32px;
            }

            .aiws-section-title {
                color: #fff;
                font-size: 1.1rem;
                margin-bottom: 16px;
            }

            .aiws-templates-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }

            .aiws-templates-grid.featured {
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            }

            .aiws-template-card {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.2s;
            }

            .aiws-template-card:hover {
                transform: translateY(-4px);
                border-color: rgba(99,102,241,0.5);
                box-shadow: 0 8px 30px rgba(99,102,241,0.2);
            }

            .aiws-template-card.featured {
                border-color: rgba(255,215,0,0.3);
            }

            .aiws-template-card.add-template {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                border-style: dashed;
                position: relative;
            }

            .add-template-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .add-template .add-icon {
                font-size: 2rem;
                color: #888;
            }

            .add-template .add-text {
                color: #888;
            }

            .pptx-badge {
                position: absolute;
                top: 12px;
                left: 12px;
                background: linear-gradient(135deg, #ff5722, #ff7043);
                color: #fff;
                font-size: 0.7rem;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 600;
            }

            .template-thumbnail {
                width: 100%;
                height: 160px;
                background-size: cover;
                background-position: center;
                position: relative;
            }

            .template-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 8px;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .aiws-template-card:hover .template-overlay {
                opacity: 1;
            }

            .template-preview-btn, .template-use-btn {
                padding: 8px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
            }

            .template-preview-btn {
                background: transparent;
                border: 1px solid #fff;
                color: #fff;
            }

            .template-use-btn {
                background: #6366f1;
                border: none;
                color: #fff;
            }

            .template-info {
                padding: 16px;
            }

            .template-name {
                color: #fff;
                margin: 0 0 4px 0;
                font-size: 1rem;
            }

            .template-meta {
                color: #888;
                font-size: 0.85rem;
                margin: 0;
            }

            .template-colors {
                display: flex;
                gap: 4px;
                padding: 0 16px 16px;
            }

            .color-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
            }

            /* AI Sheets */
            .aiws-sheets-container {
                max-width: 900px;
                margin: 0 auto;
            }

            .aiws-sheets-hero {
                text-align: center;
                margin-bottom: 32px;
            }

            .aiws-sheets-hero h2 {
                color: #fff;
                margin: 0 0 8px 0;
            }

            .aiws-sheets-hero p {
                color: #888;
                margin: 0;
            }

            .aiws-sheets-examples h3 {
                color: #fff;
                margin-bottom: 16px;
            }

            .sheets-example-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-bottom: 32px;
            }

            .sheets-example {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .sheets-example:hover {
                background: rgba(99,102,241,0.1);
                border-color: rgba(99,102,241,0.3);
            }

            .sheets-example .example-icon {
                font-size: 1.5rem;
            }

            .sheets-example .example-text {
                color: #fff;
                font-size: 0.9rem;
            }

            /* Excel Chat */
            .aiws-excel-chat {
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                overflow: hidden;
            }

            .excel-chat-header {
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .excel-chat-header h3 {
                color: #fff;
                margin: 0 0 4px 0;
            }

            .excel-chat-header p {
                color: #888;
                margin: 0;
                font-size: 0.9rem;
            }

            .excel-chat-messages {
                height: 300px;
                overflow-y: auto;
                padding: 20px;
            }

            .excel-chat-message {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .excel-chat-message.user {
                flex-direction: row-reverse;
            }

            .excel-chat-message .message-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .excel-chat-message .message-content {
                background: rgba(255,255,255,0.05);
                padding: 12px 16px;
                border-radius: 12px;
                color: #ddd;
                max-width: 80%;
                line-height: 1.5;
            }

            .excel-chat-message.user .message-content {
                background: rgba(99,102,241,0.2);
            }

            .excel-chat-message .message-content ul {
                margin: 8px 0 0 16px;
                padding: 0;
            }

            .excel-chat-message .message-content li {
                margin-bottom: 4px;
                color: #aaa;
            }

            .excel-chat-input {
                display: flex;
                gap: 8px;
                padding: 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .excel-upload-btn, .excel-send-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #888;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
            }

            .excel-upload-btn:hover, .excel-send-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .excel-send-btn {
                background: #6366f1;
                border-color: #6366f1;
                color: #fff;
            }

            .excel-chat-input input {
                flex: 1;
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                color: #fff;
                padding: 12px 16px;
                border-radius: 10px;
                font-size: 0.95rem;
            }

            .excel-chat-input input:focus {
                outline: none;
                border-color: #6366f1;
            }

            /* Images Interface */
            .aiws-images-container {
                max-width: 1000px;
                margin: 0 auto;
            }

            .aiws-images-hero {
                text-align: center;
                margin-bottom: 24px;
            }

            .aiws-images-hero h2 {
                color: #fff;
                margin: 0 0 8px 0;
            }

            .aiws-images-hero p {
                color: #888;
            }

            /* AI Generation Section */
            .aiws-ai-gen-section {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 32px;
            }

            .ai-gen-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }

            .ai-gen-badge {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                color: #fff;
            }

            .ai-gen-subtitle {
                color: #888;
            }

            .aiws-image-prompt {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .aiws-image-prompt input {
                flex: 1;
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.15);
                color: #fff;
                padding: 14px 18px;
                border-radius: 12px;
                font-size: 1rem;
            }

            .aiws-image-prompt input:focus {
                outline: none;
                border-color: #6366f1;
            }

            .aiws-image-prompt button {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                color: #fff;
                padding: 14px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .aiws-image-prompt button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
            }

            .aiws-image-styles {
                margin-top: 12px;
            }

            .style-options {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .style-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #888;
                padding: 10px 16px;
                border-radius: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .style-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .style-btn.active {
                background: rgba(99,102,241,0.2);
                border-color: #6366f1;
                color: #fff;
            }

            .style-icon {
                font-size: 1.1rem;
            }

            /* Stock Images Section */
            .aiws-stock-section {
                margin-top: 24px;
            }

            .stock-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .stock-header h3 {
                color: #fff;
                margin: 0;
            }

            .stock-search {
                display: flex;
                gap: 8px;
            }

            .stock-search input {
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.15);
                color: #fff;
                padding: 10px 16px;
                border-radius: 8px;
                width: 200px;
            }

            .stock-search button {
                background: #6366f1;
                border: none;
                color: #fff;
                padding: 10px 16px;
                border-radius: 8px;
                cursor: pointer;
            }

            .stock-categories {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .cat-tag {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #888;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .cat-tag:hover {
                background: rgba(99,102,241,0.2);
                border-color: #6366f1;
                color: #fff;
            }

            .stock-results {
                min-height: 200px;
            }

            .stock-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }

            .stock-image-card {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                cursor: pointer;
                aspect-ratio: 4/3;
            }

            .stock-image-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s;
            }

            .stock-image-card:hover img {
                transform: scale(1.05);
            }

            .stock-image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .stock-image-card:hover .stock-image-overlay {
                opacity: 1;
            }

            .use-btn {
                background: #6366f1;
                color: #fff;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 500;
            }

            .ai-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .ai-generating {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px;
            }

            .gen-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(99, 102, 241, 0.2);
                border-top-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
            }

            .gen-text {
                text-align: center;
                color: #888;
            }

            .gen-text strong {
                display: block;
                color: #fff;
                margin-bottom: 4px;
            }

            .ai-results-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
            }

            .results-badge {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: #fff;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
            }

            .results-prompt {
                color: #888;
                font-style: italic;
            }

            .search-results-header {
                color: #888;
                margin-bottom: 16px;
            }

            .ai-note {
                color: #666;
                font-size: 0.85rem;
                text-align: center;
                margin-top: 20px;
            }

            /* Image Selected Toast */
            .image-selected-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: linear-gradient(135deg, #10b981, #059669);
                border-radius: 12px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                z-index: 300000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #fff;
            }

            .toast-icon {
                font-size: 1.2rem;
            }

            .image-selected-toast button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1rem;
            }

            .stock-categories {
                display: flex;
                gap: 12px;
            }

            .stock-categories span {
                color: #6366f1;
                cursor: pointer;
            }

            .stock-categories span:hover {
                text-decoration: underline;
            }

            /* Coming Soon */
            .aiws-coming-soon {
                text-align: center;
                padding: 80px;
            }

            .aiws-coming-soon .coming-icon {
                font-size: 4rem;
                margin-bottom: 16px;
                display: block;
            }

            .aiws-coming-soon h2 {
                color: #fff;
                margin: 0 0 8px 0;
            }

            .aiws-coming-soon p {
                color: #888;
            }
        `;

        document.head.appendChild(styles);
    }
}

// Initialize
let aiWorkspace;

document.addEventListener('DOMContentLoaded', () => {
    aiWorkspace = new AIWorkspace();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!aiWorkspace) {
            aiWorkspace = new AIWorkspace();
        }
    }, 100);
}

// Global functions
window.openAIWorkspace = function(mode = 'slides') {
    if (!aiWorkspace) {
        aiWorkspace = new AIWorkspace();
    }
    aiWorkspace.open(mode);
};

window.openAISlides = function() {
    openAIWorkspace('slides');
};

window.openAISheets = function() {
    openAIWorkspace('sheets');
};

window.openAvatarUpload = function() {
    if (!aiWorkspace) {
        aiWorkspace = new AIWorkspace();
    }
    aiWorkspace.openAvatarUploadFlow();
};

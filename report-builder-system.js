// =====================================================
// LIGHTNING LEDGERZ - FATHOM-STYLE REPORT BUILDER
// Drag-drop, resize, and move financial report elements
// McKinsey/Bain/Deloitte quality presentations
// =====================================================

class ReportBuilder {
    constructor() {
        this.canvas = null;
        this.sidebar = null;
        this.selectedElement = null;
        this.elements = [];
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.elementCounter = 0;

        // Professional color palettes (Fortune 500/Bain style)
        this.colorPalettes = {
            mckinsey: {
                primary: '#1e3a5f',
                secondary: '#2e5a8f',
                accent: '#0066cc',
                success: '#28a745',
                warning: '#ffc107',
                danger: '#dc3545',
                neutral: '#6c757d',
                background: '#ffffff',
                text: '#333333'
            },
            bain: {
                primary: '#cc0000',
                secondary: '#990000',
                accent: '#ff3333',
                success: '#28a745',
                warning: '#ffa500',
                danger: '#dc3545',
                neutral: '#666666',
                background: '#ffffff',
                text: '#333333'
            },
            deloitte: {
                primary: '#86bc25',
                secondary: '#0097a9',
                accent: '#62b5e5',
                success: '#86bc25',
                warning: '#ffd100',
                danger: '#da291c',
                neutral: '#75787b',
                background: '#ffffff',
                text: '#333333'
            },
            lightning: {
                primary: '#ff3333',
                secondary: '#cc0000',
                accent: '#ffd700',
                success: '#4caf50',
                warning: '#ff9800',
                danger: '#f44336',
                neutral: '#9e9e9e',
                background: '#1a1a1a',
                text: '#ffffff'
            }
        };

        this.currentPalette = 'lightning';

        // Available element types
        this.elementTypes = [
            { type: 'kpi', name: 'KPI Card', icon: '📊', description: 'Key Performance Indicator' },
            { type: 'bar-chart', name: 'Bar Chart', icon: '📊', description: 'Vertical bar chart' },
            { type: 'line-chart', name: 'Line Chart', icon: '📈', description: 'Trend line chart' },
            { type: 'pie-chart', name: 'Pie Chart', icon: '🥧', description: 'Pie/donut chart' },
            { type: 'area-chart', name: 'Area Chart', icon: '📉', description: 'Filled area chart' },
            { type: 'table', name: 'Data Table', icon: '📋', description: 'Financial data table' },
            { type: 'text', name: 'Text Block', icon: '📝', description: 'Rich text content' },
            { type: 'heading', name: 'Heading', icon: '🔤', description: 'Section heading' },
            { type: 'image', name: 'Image', icon: '🖼️', description: 'Image or logo' },
            { type: 'divider', name: 'Divider', icon: '➖', description: 'Horizontal divider' },
            { type: 'waterfall', name: 'Waterfall', icon: '🌊', description: 'Waterfall chart' },
            { type: 'gauge', name: 'Gauge', icon: '⏱️', description: 'Progress gauge' }
        ];

        this.isInitialized = false;
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================

    init() {
        if (this.isInitialized) return;
        this.createStyles();
        this.createBuilderUI();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('Report Builder initialized');
    }

    createStyles() {
        const style = document.createElement('style');
        style.id = 'report-builder-styles';
        style.textContent = `
            .report-builder-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0d0d0d;
                z-index: 10000;
                display: none;
                flex-direction: row;
            }

            .report-builder-container.active {
                display: flex;
            }

            /* Left Sidebar - Element Picker */
            .rb-sidebar {
                width: 280px;
                background: linear-gradient(180deg, #1a1a1a, #111);
                border-right: 1px solid #333;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .rb-sidebar-header {
                padding: 20px;
                border-bottom: 1px solid #333;
                background: linear-gradient(180deg, #222, #1a1a1a);
            }

            .rb-sidebar-title {
                color: #ff3333;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin: 0;
            }

            .rb-sidebar-subtitle {
                color: #888;
                font-size: 12px;
                margin-top: 5px;
            }

            .rb-element-list {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }

            .rb-element-category {
                margin-bottom: 20px;
            }

            .rb-category-title {
                color: #666;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
                padding-left: 5px;
            }

            .rb-element-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: grab;
                transition: all 0.2s ease;
            }

            .rb-element-item:hover {
                background: rgba(255, 51, 51, 0.1);
                border-color: rgba(255, 51, 51, 0.3);
                transform: translateX(5px);
            }

            .rb-element-item:active {
                cursor: grabbing;
            }

            .rb-element-icon {
                font-size: 20px;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 51, 51, 0.15);
                border-radius: 8px;
            }

            .rb-element-info {
                flex: 1;
            }

            .rb-element-name {
                color: #fff;
                font-size: 13px;
                font-weight: 500;
            }

            .rb-element-desc {
                color: #666;
                font-size: 11px;
                margin-top: 2px;
            }

            /* Main Canvas Area */
            .rb-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .rb-toolbar {
                height: 60px;
                background: linear-gradient(180deg, #1f1f1f, #181818);
                border-bottom: 1px solid #333;
                display: flex;
                align-items: center;
                padding: 0 20px;
                gap: 15px;
            }

            .rb-toolbar-btn {
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .rb-toolbar-btn:hover {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
            }

            .rb-toolbar-btn.primary {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                border-color: #ff3333;
            }

            .rb-toolbar-btn.primary:hover {
                background: linear-gradient(135deg, #ff4444, #dd1111);
            }

            .rb-toolbar-divider {
                width: 1px;
                height: 30px;
                background: #444;
            }

            .rb-toolbar-select {
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
            }

            .rb-toolbar-title {
                flex: 1;
                text-align: center;
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }

            .rb-close-btn {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .rb-close-btn:hover {
                background: #ff3333;
                border-color: #ff3333;
            }

            /* Canvas */
            .rb-canvas-wrapper {
                flex: 1;
                overflow: auto;
                padding: 40px;
                background:
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    #0a0a0a;
                background-size: 20px 20px;
            }

            .rb-canvas {
                min-height: 800px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                position: relative;
                margin: 0 auto;
                max-width: 1200px;
            }

            .rb-canvas.dark {
                background: #1a1a1a;
                border: 1px solid #333;
            }

            .rb-canvas-placeholder {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #999;
            }

            .rb-canvas-placeholder-icon {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }

            .rb-canvas-placeholder-text {
                font-size: 16px;
            }

            .rb-canvas-placeholder-hint {
                font-size: 13px;
                opacity: 0.7;
                margin-top: 8px;
            }

            /* Report Elements */
            .rb-report-element {
                position: absolute;
                background: #fff;
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: move;
                transition: border-color 0.2s, box-shadow 0.2s;
                overflow: hidden;
            }

            .rb-report-element:hover {
                border-color: rgba(255, 51, 51, 0.5);
            }

            .rb-report-element.selected {
                border-color: #ff3333;
                box-shadow: 0 0 0 3px rgba(255, 51, 51, 0.2);
            }

            .rb-report-element.dark {
                background: #222;
                color: #fff;
            }

            /* Resize Handles */
            .rb-resize-handle {
                position: absolute;
                width: 12px;
                height: 12px;
                background: #ff3333;
                border: 2px solid #fff;
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .rb-report-element.selected .rb-resize-handle {
                opacity: 1;
            }

            .rb-resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
            .rb-resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
            .rb-resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
            .rb-resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
            .rb-resize-handle.n { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
            .rb-resize-handle.s { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
            .rb-resize-handle.e { right: -6px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
            .rb-resize-handle.w { left: -6px; top: 50%; transform: translateY(-50%); cursor: w-resize; }

            /* Element Content Styles */
            .rb-kpi-card {
                padding: 20px;
                text-align: center;
            }

            .rb-kpi-value {
                font-size: 36px;
                font-weight: 700;
                color: #ff3333;
            }

            .rb-kpi-label {
                font-size: 14px;
                color: #666;
                margin-top: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .rb-kpi-change {
                font-size: 12px;
                margin-top: 8px;
            }

            .rb-kpi-change.positive { color: #28a745; }
            .rb-kpi-change.negative { color: #dc3545; }

            .rb-chart-container {
                padding: 15px;
                height: 100%;
            }

            .rb-chart-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 10px;
                color: #333;
            }

            .rb-text-block {
                padding: 20px;
                font-size: 14px;
                line-height: 1.6;
                color: #333;
            }

            .rb-heading {
                padding: 15px 20px;
                font-size: 24px;
                font-weight: 700;
                color: #333;
            }

            .rb-table-container {
                padding: 15px;
                overflow: auto;
            }

            .rb-data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            }

            .rb-data-table th {
                background: #f5f5f5;
                padding: 10px;
                text-align: left;
                font-weight: 600;
                border-bottom: 2px solid #ddd;
            }

            .rb-data-table td {
                padding: 10px;
                border-bottom: 1px solid #eee;
            }

            .rb-data-table tr:hover td {
                background: #fafafa;
            }

            /* Right Properties Panel */
            .rb-properties {
                width: 280px;
                background: linear-gradient(180deg, #1a1a1a, #111);
                border-left: 1px solid #333;
                display: none;
                flex-direction: column;
            }

            .rb-properties.active {
                display: flex;
            }

            .rb-properties-header {
                padding: 20px;
                border-bottom: 1px solid #333;
            }

            .rb-properties-title {
                color: #ff3333;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
            }

            .rb-properties-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .rb-property-group {
                margin-bottom: 20px;
            }

            .rb-property-label {
                color: #888;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }

            .rb-property-input {
                width: 100%;
                padding: 10px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: #fff;
                font-size: 13px;
            }

            .rb-property-input:focus {
                outline: none;
                border-color: #ff3333;
            }

            /* Template Picker Modal */
            .rb-template-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10001;
                display: none;
                align-items: center;
                justify-content: center;
            }

            .rb-template-modal.active {
                display: flex;
            }

            .rb-template-content {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 30px;
                max-width: 900px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .rb-template-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-top: 20px;
            }

            .rb-template-card {
                background: #222;
                border: 2px solid #333;
                border-radius: 8px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .rb-template-card:hover {
                border-color: #ff3333;
                transform: translateY(-3px);
            }

            .rb-template-preview {
                height: 120px;
                background: #2a2a2a;
                border-radius: 4px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
            }

            .rb-template-name {
                color: #fff;
                font-size: 14px;
                font-weight: 600;
            }

            .rb-template-desc {
                color: #888;
                font-size: 12px;
                margin-top: 5px;
            }

            /* Drop Zone Highlight */
            .rb-canvas.drag-over {
                background: rgba(255, 51, 51, 0.05);
                border: 2px dashed #ff3333;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .rb-sidebar {
                    position: absolute;
                    left: -280px;
                    z-index: 100;
                    transition: left 0.3s;
                }

                .rb-sidebar.open {
                    left: 0;
                }

                .rb-properties {
                    position: absolute;
                    right: -280px;
                    z-index: 100;
                    transition: right 0.3s;
                }

                .rb-properties.open {
                    right: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createBuilderUI() {
        const container = document.createElement('div');
        container.id = 'report-builder';
        container.className = 'report-builder-container';

        container.innerHTML = `
            <!-- Left Sidebar -->
            <div class="rb-sidebar">
                <div class="rb-sidebar-header">
                    <h3 class="rb-sidebar-title">Elements</h3>
                    <p class="rb-sidebar-subtitle">Drag to canvas</p>
                </div>
                <div class="rb-element-list">
                    <div class="rb-element-category">
                        <div class="rb-category-title">Charts</div>
                        ${this.elementTypes.filter(e => e.type.includes('chart') || e.type === 'waterfall' || e.type === 'gauge')
                            .map(e => this.createElementItem(e)).join('')}
                    </div>
                    <div class="rb-element-category">
                        <div class="rb-category-title">Data</div>
                        ${this.elementTypes.filter(e => e.type === 'kpi' || e.type === 'table')
                            .map(e => this.createElementItem(e)).join('')}
                    </div>
                    <div class="rb-element-category">
                        <div class="rb-category-title">Content</div>
                        ${this.elementTypes.filter(e => e.type === 'text' || e.type === 'heading' || e.type === 'image' || e.type === 'divider')
                            .map(e => this.createElementItem(e)).join('')}
                    </div>
                </div>
            </div>

            <!-- Main Area -->
            <div class="rb-main">
                <div class="rb-toolbar">
                    <div class="rb-logo" onclick="reportBuilder.close()" title="Return to Lightning Ledgerz">
                        <img src="LightningLedgerzLogo.png" alt="Lightning Ledgerz" style="height: 35px; cursor: pointer;">
                    </div>
                    <div class="rb-toolbar-divider"></div>
                    <button class="rb-toolbar-btn" onclick="reportBuilder.showTemplates()">
                        <span>📋</span> Templates
                    </button>
                    <select class="rb-toolbar-select" onchange="reportBuilder.changePalette(this.value)">
                        <option value="lightning">Lightning Theme</option>
                        <option value="mckinsey">Fortune 500 Style</option>
                        <option value="bain">Bain Style</option>
                        <option value="deloitte">Deloitte Style</option>
                    </select>
                    <div class="rb-toolbar-divider"></div>
                    <button class="rb-toolbar-btn" onclick="reportBuilder.undo()">
                        <span>↩️</span> Undo
                    </button>
                    <button class="rb-toolbar-btn" onclick="reportBuilder.redo()">
                        <span>↪️</span> Redo
                    </button>
                    <div class="rb-toolbar-divider"></div>
                    <button class="rb-toolbar-btn" onclick="reportBuilder.deleteSelected()">
                        <span>🗑️</span> Delete
                    </button>
                    <div class="rb-toolbar-title">
                        <input type="text" value="Untitled Report"
                               style="background: transparent; border: none; color: #fff; font-size: 16px; font-weight: 600; text-align: center; width: 200px;"
                               id="rb-report-title">
                    </div>
                    <button class="rb-toolbar-btn" onclick="reportBuilder.preview()">
                        <span>👁️</span> Preview
                    </button>
                    <button class="rb-toolbar-btn primary" onclick="reportBuilder.exportReport()">
                        <span>📤</span> Export
                    </button>
                    <button class="rb-close-btn" onclick="reportBuilder.close()">×</button>
                </div>

                <div class="rb-canvas-wrapper">
                    <div class="rb-canvas" id="rb-canvas">
                        <div class="rb-canvas-placeholder" id="rb-placeholder">
                            <div class="rb-canvas-placeholder-icon">📊</div>
                            <div class="rb-canvas-placeholder-text">Drag elements here to build your report</div>
                            <div class="rb-canvas-placeholder-hint">Or choose a template to get started</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Properties Panel -->
            <div class="rb-properties" id="rb-properties">
                <div class="rb-properties-header">
                    <h3 class="rb-properties-title">Properties</h3>
                </div>
                <div class="rb-properties-content" id="rb-properties-content">
                    <p style="color: #666; font-size: 13px;">Select an element to edit its properties</p>
                </div>
            </div>

            <!-- Template Modal -->
            <div class="rb-template-modal" id="rb-template-modal">
                <div class="rb-template-content">
                    <h2 style="color: #ff3333; margin-bottom: 10px;">Choose a Template</h2>
                    <p style="color: #888; margin-bottom: 20px;">Start with a professional template or create from scratch</p>
                    <div class="rb-template-grid">
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('executive')">
                            <div class="rb-template-preview">📊</div>
                            <div class="rb-template-name">Executive Summary</div>
                            <div class="rb-template-desc">High-level KPIs and key insights</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('financial')">
                            <div class="rb-template-preview">💰</div>
                            <div class="rb-template-name">Financial Report</div>
                            <div class="rb-template-desc">P&L, Balance Sheet, Cash Flow</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('performance')">
                            <div class="rb-template-preview">📈</div>
                            <div class="rb-template-name">Performance Dashboard</div>
                            <div class="rb-template-desc">Metrics and trend analysis</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('quarterly')">
                            <div class="rb-template-preview">📅</div>
                            <div class="rb-template-name">Quarterly Review</div>
                            <div class="rb-template-desc">Period comparison and goals</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('budget')">
                            <div class="rb-template-preview">💵</div>
                            <div class="rb-template-name">Budget Analysis</div>
                            <div class="rb-template-desc">Budget vs Actual comparison</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('blank')">
                            <div class="rb-template-preview">➕</div>
                            <div class="rb-template-name">Blank Canvas</div>
                            <div class="rb-template-desc">Start from scratch</div>
                        </div>
                    </div>
                    <button class="rb-toolbar-btn" style="margin-top: 20px;" onclick="reportBuilder.hideTemplates()">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;
        this.canvas = document.getElementById('rb-canvas');
        this.sidebar = container.querySelector('.rb-sidebar');
    }

    createElementItem(element) {
        return `
            <div class="rb-element-item"
                 draggable="true"
                 data-type="${element.type}"
                 ondragstart="reportBuilder.handleDragStart(event, '${element.type}')">
                <div class="rb-element-icon">${element.icon}</div>
                <div class="rb-element-info">
                    <div class="rb-element-name">${element.name}</div>
                    <div class="rb-element-desc">${element.description}</div>
                </div>
            </div>
        `;
    }

    // =====================================================
    // EVENT HANDLERS
    // =====================================================

    setupEventListeners() {
        // Canvas drop events
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.canvas.classList.add('drag-over');
        });

        this.canvas.addEventListener('dragleave', () => {
            this.canvas.classList.remove('drag-over');
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.canvas.classList.remove('drag-over');
            const type = e.dataTransfer.getData('text/plain');
            if (type) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.addElement(type, x, y);
            }
        });

        // Click outside to deselect
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectAll();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.container.classList.contains('active')) return;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                this.deleteSelected();
            } else if (e.key === 'Escape') {
                this.deselectAll();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        });
    }

    handleDragStart(event, type) {
        event.dataTransfer.setData('text/plain', type);
        event.dataTransfer.effectAllowed = 'copy';
    }

    // =====================================================
    // ELEMENT MANAGEMENT
    // =====================================================

    addElement(type, x, y) {
        // Hide placeholder
        const placeholder = document.getElementById('rb-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        const id = `element-${++this.elementCounter}`;
        const element = {
            id,
            type,
            x: Math.max(20, x - 100),
            y: Math.max(20, y - 50),
            width: this.getDefaultWidth(type),
            height: this.getDefaultHeight(type),
            data: this.getDefaultData(type)
        };

        this.elements.push(element);
        this.renderElement(element);
        this.selectElement(id);
    }

    getDefaultWidth(type) {
        const widths = {
            'kpi': 200,
            'bar-chart': 400,
            'line-chart': 400,
            'pie-chart': 300,
            'area-chart': 400,
            'table': 500,
            'text': 400,
            'heading': 400,
            'image': 300,
            'divider': 600,
            'waterfall': 450,
            'gauge': 200
        };
        return widths[type] || 300;
    }

    getDefaultHeight(type) {
        const heights = {
            'kpi': 150,
            'bar-chart': 280,
            'line-chart': 280,
            'pie-chart': 280,
            'area-chart': 280,
            'table': 300,
            'text': 150,
            'heading': 60,
            'image': 200,
            'divider': 30,
            'waterfall': 300,
            'gauge': 150
        };
        return heights[type] || 200;
    }

    getDefaultData(type) {
        const palette = this.colorPalettes[this.currentPalette];

        switch (type) {
            case 'kpi':
                return {
                    value: '$1.2M',
                    label: 'Revenue',
                    change: '+12.5%',
                    positive: true
                };
            case 'heading':
                return {
                    text: 'Section Heading',
                    align: 'left'
                };
            case 'text':
                return {
                    content: 'Enter your text content here. You can describe financial performance, insights, or recommendations.'
                };
            case 'bar-chart':
            case 'line-chart':
            case 'area-chart':
                return {
                    title: 'Chart Title',
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        { label: 'Revenue', data: [65, 59, 80, 81, 56, 85], color: palette.primary },
                        { label: 'Expenses', data: [28, 48, 40, 19, 36, 27], color: palette.secondary }
                    ]
                };
            case 'pie-chart':
                return {
                    title: 'Distribution',
                    labels: ['Product A', 'Product B', 'Product C', 'Other'],
                    data: [35, 30, 20, 15],
                    colors: [palette.primary, palette.secondary, palette.accent, palette.neutral]
                };
            case 'table':
                return {
                    headers: ['Category', 'Budget', 'Actual', 'Variance'],
                    rows: [
                        ['Revenue', '$500,000', '$520,000', '+$20,000'],
                        ['COGS', '$200,000', '$195,000', '-$5,000'],
                        ['Operating', '$150,000', '$160,000', '+$10,000'],
                        ['Net Income', '$150,000', '$165,000', '+$15,000']
                    ]
                };
            case 'gauge':
                return {
                    value: 75,
                    max: 100,
                    label: 'Goal Progress'
                };
            default:
                return {};
        }
    }

    renderElement(element) {
        const div = document.createElement('div');
        div.id = element.id;
        div.className = 'rb-report-element';
        div.style.cssText = `
            left: ${element.x}px;
            top: ${element.y}px;
            width: ${element.width}px;
            height: ${element.height}px;
        `;

        // Add resize handles
        ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `rb-resize-handle ${pos}`;
            handle.addEventListener('mousedown', (e) => this.startResize(e, element.id, pos));
            div.appendChild(handle);
        });

        // Add content based on type
        div.innerHTML += this.getElementContent(element);

        // Make draggable
        div.addEventListener('mousedown', (e) => {
            if (!e.target.classList.contains('rb-resize-handle')) {
                this.startDrag(e, element.id);
            }
        });

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element.id);
        });

        this.canvas.appendChild(div);
    }

    getElementContent(element) {
        const palette = this.colorPalettes[this.currentPalette];

        switch (element.type) {
            case 'kpi':
                return `
                    <div class="rb-kpi-card">
                        <div class="rb-kpi-value" style="color: ${palette.primary}">${element.data.value}</div>
                        <div class="rb-kpi-label">${element.data.label}</div>
                        <div class="rb-kpi-change ${element.data.positive ? 'positive' : 'negative'}">
                            ${element.data.change}
                        </div>
                    </div>
                `;
            case 'heading':
                return `<div class="rb-heading" style="text-align: ${element.data.align}">${element.data.text}</div>`;
            case 'text':
                return `<div class="rb-text-block">${element.data.content}</div>`;
            case 'bar-chart':
            case 'line-chart':
            case 'area-chart':
            case 'pie-chart':
                return `
                    <div class="rb-chart-container">
                        <div class="rb-chart-title">${element.data.title}</div>
                        <canvas id="chart-${element.id}" style="width: 100%; height: calc(100% - 30px);"></canvas>
                    </div>
                `;
            case 'table':
                return `
                    <div class="rb-table-container">
                        <table class="rb-data-table">
                            <thead>
                                <tr>
                                    ${element.data.headers.map(h => `<th>${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${element.data.rows.map(row => `
                                    <tr>
                                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'gauge':
                return `
                    <div class="rb-kpi-card">
                        <div style="font-size: 32px; color: ${palette.primary}">${element.data.value}%</div>
                        <div class="rb-kpi-label">${element.data.label}</div>
                        <div style="margin-top: 10px; height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${element.data.value}%; height: 100%; background: ${palette.primary};"></div>
                        </div>
                    </div>
                `;
            case 'divider':
                return `<hr style="border: none; border-top: 2px solid ${palette.primary}; margin: 10px 20px;">`;
            case 'image':
                return `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f5f5f5; color: #999;">
                        <span style="font-size: 32px;">🖼️</span>
                    </div>
                `;
            default:
                return `<div style="padding: 20px; color: #999;">Element: ${element.type}</div>`;
        }
    }

    selectElement(id) {
        this.deselectAll();
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('selected');
            this.selectedElement = this.elements.find(e => e.id === id);
            this.showProperties();
        }
    }

    deselectAll() {
        document.querySelectorAll('.rb-report-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
        document.getElementById('rb-properties').classList.remove('active');
    }

    deleteSelected() {
        if (!this.selectedElement) return;

        const el = document.getElementById(this.selectedElement.id);
        if (el) el.remove();

        this.elements = this.elements.filter(e => e.id !== this.selectedElement.id);
        this.selectedElement = null;
        document.getElementById('rb-properties').classList.remove('active');

        // Show placeholder if no elements
        if (this.elements.length === 0) {
            const placeholder = document.getElementById('rb-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
    }

    // =====================================================
    // DRAG AND RESIZE
    // =====================================================

    startDrag(e, id) {
        e.preventDefault();
        this.isDragging = true;
        this.selectedElement = this.elements.find(el => el.id === id);
        this.selectElement(id);

        const el = document.getElementById(id);
        const rect = el.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const moveHandler = (e) => this.handleDrag(e);
        const upHandler = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }

    handleDrag(e) {
        if (!this.isDragging || !this.selectedElement) return;

        const canvasRect = this.canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - this.dragOffset.x;
        const newY = e.clientY - canvasRect.top - this.dragOffset.y;

        // Constrain to canvas
        const x = Math.max(0, Math.min(newX, this.canvas.offsetWidth - this.selectedElement.width));
        const y = Math.max(0, Math.min(newY, this.canvas.offsetHeight - this.selectedElement.height));

        this.selectedElement.x = x;
        this.selectedElement.y = y;

        const el = document.getElementById(this.selectedElement.id);
        if (el) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
    }

    startResize(e, id, handle) {
        e.preventDefault();
        e.stopPropagation();
        this.isResizing = true;
        this.resizeHandle = handle;
        this.selectedElement = this.elements.find(el => el.id === id);
        this.selectElement(id);

        const el = document.getElementById(id);
        this.resizeStart = {
            x: e.clientX,
            y: e.clientY,
            width: el.offsetWidth,
            height: el.offsetHeight,
            left: el.offsetLeft,
            top: el.offsetTop
        };

        const moveHandler = (e) => this.handleResize(e);
        const upHandler = () => {
            this.isResizing = false;
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }

    handleResize(e) {
        if (!this.isResizing || !this.selectedElement) return;

        const dx = e.clientX - this.resizeStart.x;
        const dy = e.clientY - this.resizeStart.y;

        let newWidth = this.resizeStart.width;
        let newHeight = this.resizeStart.height;
        let newX = this.resizeStart.left;
        let newY = this.resizeStart.top;

        if (this.resizeHandle.includes('e')) newWidth += dx;
        if (this.resizeHandle.includes('w')) { newWidth -= dx; newX += dx; }
        if (this.resizeHandle.includes('s')) newHeight += dy;
        if (this.resizeHandle.includes('n')) { newHeight -= dy; newY += dy; }

        // Minimum size
        newWidth = Math.max(100, newWidth);
        newHeight = Math.max(50, newHeight);

        this.selectedElement.width = newWidth;
        this.selectedElement.height = newHeight;
        this.selectedElement.x = newX;
        this.selectedElement.y = newY;

        const el = document.getElementById(this.selectedElement.id);
        if (el) {
            el.style.width = `${newWidth}px`;
            el.style.height = `${newHeight}px`;
            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
        }
    }

    // =====================================================
    // PROPERTIES PANEL
    // =====================================================

    showProperties() {
        if (!this.selectedElement) return;

        const panel = document.getElementById('rb-properties');
        const content = document.getElementById('rb-properties-content');

        panel.classList.add('active');

        content.innerHTML = `
            <div class="rb-property-group">
                <div class="rb-property-label">Position</div>
                <div style="display: flex; gap: 10px;">
                    <input type="number" class="rb-property-input" value="${Math.round(this.selectedElement.x)}"
                           onchange="reportBuilder.updateProperty('x', this.value)" placeholder="X">
                    <input type="number" class="rb-property-input" value="${Math.round(this.selectedElement.y)}"
                           onchange="reportBuilder.updateProperty('y', this.value)" placeholder="Y">
                </div>
            </div>
            <div class="rb-property-group">
                <div class="rb-property-label">Size</div>
                <div style="display: flex; gap: 10px;">
                    <input type="number" class="rb-property-input" value="${Math.round(this.selectedElement.width)}"
                           onchange="reportBuilder.updateProperty('width', this.value)" placeholder="Width">
                    <input type="number" class="rb-property-input" value="${Math.round(this.selectedElement.height)}"
                           onchange="reportBuilder.updateProperty('height', this.value)" placeholder="Height">
                </div>
            </div>
            ${this.getTypeSpecificProperties()}
        `;
    }

    getTypeSpecificProperties() {
        if (!this.selectedElement) return '';

        const data = this.selectedElement.data;

        switch (this.selectedElement.type) {
            case 'kpi':
                return `
                    <div class="rb-property-group">
                        <div class="rb-property-label">Value</div>
                        <input type="text" class="rb-property-input" value="${data.value}"
                               onchange="reportBuilder.updateData('value', this.value)">
                    </div>
                    <div class="rb-property-group">
                        <div class="rb-property-label">Label</div>
                        <input type="text" class="rb-property-input" value="${data.label}"
                               onchange="reportBuilder.updateData('label', this.value)">
                    </div>
                    <div class="rb-property-group">
                        <div class="rb-property-label">Change</div>
                        <input type="text" class="rb-property-input" value="${data.change}"
                               onchange="reportBuilder.updateData('change', this.value)">
                    </div>
                `;
            case 'heading':
                return `
                    <div class="rb-property-group">
                        <div class="rb-property-label">Text</div>
                        <input type="text" class="rb-property-input" value="${data.text}"
                               onchange="reportBuilder.updateData('text', this.value)">
                    </div>
                `;
            case 'text':
                return `
                    <div class="rb-property-group">
                        <div class="rb-property-label">Content</div>
                        <textarea class="rb-property-input" rows="4"
                               onchange="reportBuilder.updateData('content', this.value)">${data.content}</textarea>
                    </div>
                `;
            default:
                return '';
        }
    }

    updateProperty(prop, value) {
        if (!this.selectedElement) return;

        this.selectedElement[prop] = parseInt(value);
        const el = document.getElementById(this.selectedElement.id);
        if (el) {
            el.style[prop === 'x' ? 'left' : prop === 'y' ? 'top' : prop] = `${value}px`;
        }
    }

    updateData(prop, value) {
        if (!this.selectedElement) return;

        this.selectedElement.data[prop] = value;

        // Re-render element content
        const el = document.getElementById(this.selectedElement.id);
        if (el) {
            // Preserve resize handles
            const handles = el.querySelectorAll('.rb-resize-handle');
            el.innerHTML = '';
            handles.forEach(h => el.appendChild(h));
            el.innerHTML += this.getElementContent(this.selectedElement);
        }
    }

    // =====================================================
    // TEMPLATES
    // =====================================================

    showTemplates() {
        document.getElementById('rb-template-modal').classList.add('active');
    }

    hideTemplates() {
        document.getElementById('rb-template-modal').classList.remove('active');
    }

    loadTemplate(templateName) {
        this.hideTemplates();
        this.clearCanvas();

        switch (templateName) {
            case 'executive':
                this.loadExecutiveTemplate();
                break;
            case 'financial':
                this.loadFinancialTemplate();
                break;
            case 'performance':
                this.loadPerformanceTemplate();
                break;
            case 'quarterly':
                this.loadQuarterlyTemplate();
                break;
            case 'budget':
                this.loadBudgetTemplate();
                break;
            case 'blank':
                // Just clear canvas
                break;
        }
    }

    clearCanvas() {
        this.elements = [];
        this.elementCounter = 0;
        const canvas = document.getElementById('rb-canvas');
        canvas.querySelectorAll('.rb-report-element').forEach(el => el.remove());
        document.getElementById('rb-placeholder').style.display = 'block';
    }

    loadExecutiveTemplate() {
        // Add heading
        this.addElement('heading', 40, 40);
        this.elements[this.elements.length - 1].data.text = 'Executive Summary';
        this.elements[this.elements.length - 1].width = 500;

        // Add KPIs
        setTimeout(() => this.addElement('kpi', 40, 120), 50);
        setTimeout(() => {
            this.addElement('kpi', 260, 120);
            this.elements[this.elements.length - 1].data.value = '$450K';
            this.elements[this.elements.length - 1].data.label = 'Net Income';
            this.elements[this.elements.length - 1].data.change = '+8.3%';
        }, 100);
        setTimeout(() => {
            this.addElement('kpi', 480, 120);
            this.elements[this.elements.length - 1].data.value = '23%';
            this.elements[this.elements.length - 1].data.label = 'Profit Margin';
            this.elements[this.elements.length - 1].data.change = '+2.1%';
        }, 150);

        // Add chart
        setTimeout(() => {
            this.addElement('bar-chart', 40, 300);
            this.elements[this.elements.length - 1].data.title = 'Revenue vs Expenses';
        }, 200);

        // Add table
        setTimeout(() => {
            this.addElement('table', 480, 300);
            this.elements[this.elements.length - 1].width = 400;
        }, 250);

        this.deselectAll();
    }

    loadFinancialTemplate() {
        this.addElement('heading', 40, 40);
        this.elements[this.elements.length - 1].data.text = 'Financial Report';

        setTimeout(() => this.addElement('line-chart', 40, 120), 50);
        setTimeout(() => this.addElement('pie-chart', 480, 120), 100);
        setTimeout(() => {
            this.addElement('table', 40, 420);
            this.elements[this.elements.length - 1].width = 700;
        }, 150);

        this.deselectAll();
    }

    loadPerformanceTemplate() {
        this.addElement('heading', 40, 40);
        this.elements[this.elements.length - 1].data.text = 'Performance Dashboard';

        // Row of KPIs
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.addElement('kpi', 40 + (i * 220), 100);
            }, i * 50);
        }

        setTimeout(() => this.addElement('line-chart', 40, 280), 250);
        setTimeout(() => this.addElement('bar-chart', 480, 280), 300);

        this.deselectAll();
    }

    loadQuarterlyTemplate() {
        this.addElement('heading', 40, 40);
        this.elements[this.elements.length - 1].data.text = 'Quarterly Review - Q4 2024';

        setTimeout(() => {
            this.addElement('text', 40, 100);
            this.elements[this.elements.length - 1].data.content = 'This quarter demonstrated strong performance across key metrics, with revenue exceeding targets by 12%.';
            this.elements[this.elements.length - 1].width = 600;
        }, 50);

        setTimeout(() => this.addElement('bar-chart', 40, 280), 100);
        setTimeout(() => this.addElement('gauge', 480, 280), 150);
        setTimeout(() => this.addElement('gauge', 700, 280), 200);

        this.deselectAll();
    }

    loadBudgetTemplate() {
        this.addElement('heading', 40, 40);
        this.elements[this.elements.length - 1].data.text = 'Budget Analysis';

        setTimeout(() => {
            this.addElement('table', 40, 100);
            this.elements[this.elements.length - 1].width = 700;
            this.elements[this.elements.length - 1].height = 350;
        }, 50);

        setTimeout(() => this.addElement('bar-chart', 40, 480), 100);
        setTimeout(() => {
            this.addElement('kpi', 480, 480);
            this.elements[this.elements.length - 1].data.value = '$50K';
            this.elements[this.elements.length - 1].data.label = 'Under Budget';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 150);

        this.deselectAll();
    }

    // =====================================================
    // THEME/PALETTE
    // =====================================================

    changePalette(paletteName) {
        this.currentPalette = paletteName;

        // Update canvas style for dark/light themes
        const canvas = document.getElementById('rb-canvas');
        if (paletteName === 'lightning') {
            canvas.classList.add('dark');
            document.querySelectorAll('.rb-report-element').forEach(el => el.classList.add('dark'));
        } else {
            canvas.classList.remove('dark');
            document.querySelectorAll('.rb-report-element').forEach(el => el.classList.remove('dark'));
        }

        // Re-render all elements with new palette
        this.elements.forEach(element => {
            const el = document.getElementById(element.id);
            if (el) {
                const handles = el.querySelectorAll('.rb-resize-handle');
                el.innerHTML = '';
                handles.forEach(h => el.appendChild(h.cloneNode()));
                el.innerHTML += this.getElementContent(element);
            }
        });
    }

    // =====================================================
    // ACTIONS
    // =====================================================

    undo() {
        // TODO: Implement undo stack
        console.log('Undo');
    }

    redo() {
        // TODO: Implement redo stack
        console.log('Redo');
    }

    preview() {
        alert('Preview mode coming soon! Your report will be shown in a clean presentation view.');
    }

    exportReport() {
        const options = ['PDF', 'PowerPoint', 'Image'];
        const choice = prompt(`Export as:\n1. PDF\n2. PowerPoint\n3. Image\n\nEnter 1, 2, or 3:`);

        if (choice === '1') {
            alert('Exporting to PDF... (Feature in development)');
        } else if (choice === '2') {
            alert('Exporting to PowerPoint... (Feature in development)');
        } else if (choice === '3') {
            alert('Exporting to Image... (Feature in development)');
        }
    }

    // =====================================================
    // OPEN/CLOSE
    // =====================================================

    open() {
        this.init();
        this.container.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.container.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize global instance
const reportBuilder = new ReportBuilder();

// Global functions for HTML onclick handlers
window.reportBuilder = reportBuilder;
window.openReportBuilder = () => reportBuilder.open();

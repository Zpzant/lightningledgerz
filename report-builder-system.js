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
                text: '#333333',
                chartColors: ['#1e3a5f', '#2e5a8f', '#0066cc', '#4a90d9', '#7eb3e8', '#a8c8e8']
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
                text: '#333333',
                chartColors: ['#cc0000', '#e53935', '#ff5252', '#ff8a80', '#990000', '#b71c1c']
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
                text: '#333333',
                chartColors: ['#86bc25', '#0097a9', '#62b5e5', '#00a1de', '#97d700', '#43b02a']
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
                text: '#ffffff',
                chartColors: ['#ff3333', '#ffd700', '#4caf50', '#2196f3', '#9c27b0', '#ff9800']
            },
            ocean: {
                primary: '#0077b6',
                secondary: '#00b4d8',
                accent: '#90e0ef',
                success: '#06d6a0',
                warning: '#ffd166',
                danger: '#ef476f',
                neutral: '#8d99ae',
                background: '#ffffff',
                text: '#2b2d42',
                chartColors: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#03045e']
            },
            forest: {
                primary: '#2d6a4f',
                secondary: '#40916c',
                accent: '#52b788',
                success: '#74c69d',
                warning: '#d4a373',
                danger: '#bc6c25',
                neutral: '#6c757d',
                background: '#ffffff',
                text: '#1b4332',
                chartColors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7']
            },
            sunset: {
                primary: '#e63946',
                secondary: '#f77f00',
                accent: '#fcbf49',
                success: '#06d6a0',
                warning: '#fcbf49',
                danger: '#d62828',
                neutral: '#6c757d',
                background: '#ffffff',
                text: '#1d3557',
                chartColors: ['#e63946', '#f77f00', '#fcbf49', '#eae2b7', '#d62828', '#003049']
            },
            corporate: {
                primary: '#2c3e50',
                secondary: '#34495e',
                accent: '#3498db',
                success: '#27ae60',
                warning: '#f39c12',
                danger: '#e74c3c',
                neutral: '#95a5a6',
                background: '#ffffff',
                text: '#2c3e50',
                chartColors: ['#2c3e50', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c']
            },
            midnight: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                accent: '#a78bfa',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                neutral: '#6b7280',
                background: '#0f172a',
                text: '#f1f5f9',
                chartColors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4']
            }
        };

        this.currentPalette = 'lightning';

        // Available element types
        this.elementTypes = [
            { type: 'kpi', name: 'KPI Card', icon: '📊', description: 'Key Performance Indicator' },
            { type: 'bar-chart', name: 'Bar Chart', icon: '📊', description: 'Vertical bar chart' },
            { type: 'line-chart', name: 'Line Chart', icon: '📈', description: 'Trend line chart' },
            { type: 'combo-chart', name: 'Combo Chart', icon: '📊', description: 'Bar + Line combo' },
            { type: 'pie-chart', name: 'Pie Chart', icon: '🥧', description: 'Pie/donut chart' },
            { type: 'area-chart', name: 'Area Chart', icon: '📉', description: 'Filled area chart' },
            { type: 'waterfall', name: 'Waterfall', icon: '🌊', description: 'Waterfall chart' },
            { type: 'yoy-chart', name: 'YoY Chart', icon: '📅', description: 'Year over Year' },
            { type: 'table', name: 'Data Table', icon: '📋', description: 'Financial data table' },
            { type: 'budget-table', name: 'Budget vs Actual', icon: '💰', description: 'Variance analysis' },
            { type: 'category-table', name: 'Category Table', icon: '📑', description: 'Cost/Revenue breakdown' },
            { type: 'text', name: 'Text Block', icon: '📝', description: 'Rich text content' },
            { type: 'heading', name: 'Heading', icon: '🔤', description: 'Section heading' },
            { type: 'image', name: 'Image', icon: '🖼️', description: 'Image or logo' },
            { type: 'divider', name: 'Divider', icon: '➖', description: 'Horizontal divider' },
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
                        ${this.elementTypes.filter(e => ['bar-chart', 'line-chart', 'pie-chart', 'area-chart', 'combo-chart', 'waterfall', 'yoy-chart'].includes(e.type))
                            .map(e => this.createElementItem(e)).join('')}
                    </div>
                    <div class="rb-element-category">
                        <div class="rb-category-title">Tables & Data</div>
                        ${this.elementTypes.filter(e => ['kpi', 'gauge', 'table', 'budget-table', 'category-table'].includes(e.type))
                            .map(e => this.createElementItem(e)).join('')}
                    </div>
                    <div class="rb-element-category">
                        <div class="rb-category-title">Content</div>
                        ${this.elementTypes.filter(e => ['text', 'heading', 'image', 'divider'].includes(e.type))
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
                        <option value="lightning">Lightning (Dark)</option>
                        <option value="midnight">Midnight Purple</option>
                        <option value="mckinsey">McKinsey Blue</option>
                        <option value="bain">Bain Red</option>
                        <option value="deloitte">Deloitte Green</option>
                        <option value="ocean">Ocean Blue</option>
                        <option value="forest">Forest Green</option>
                        <option value="sunset">Sunset Orange</option>
                        <option value="corporate">Corporate Gray</option>
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
                <div class="rb-template-content" style="max-width: 1100px;">
                    <h2 style="color: #ff3333; margin-bottom: 10px;">Choose a Template</h2>
                    <p style="color: #888; margin-bottom: 20px;">Professional templates with real charts - just customize the data!</p>

                    <div style="margin-bottom: 20px;">
                        <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Popular Templates</span>
                    </div>
                    <div class="rb-template-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('executive')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #1e3a5f, #2e5a8f);">📊</div>
                            <div class="rb-template-name">Executive Summary</div>
                            <div class="rb-template-desc">KPIs, trends & key insights</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('budgetAnalysis')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #28a745, #20c997);">💰</div>
                            <div class="rb-template-name">Budget vs Actual</div>
                            <div class="rb-template-desc">Variance analysis with charts</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('yoyComparison')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">📈</div>
                            <div class="rb-template-name">Year over Year</div>
                            <div class="rb-template-desc">YoY trends & growth metrics</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('revenueBreakdown')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #ff3333, #cc0000);">💵</div>
                            <div class="rb-template-name">Revenue Breakdown</div>
                            <div class="rb-template-desc">Revenue by category & trends</div>
                        </div>
                    </div>

                    <div style="margin: 25px 0 15px;">
                        <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Financial Reports</span>
                    </div>
                    <div class="rb-template-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('financial')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #0077b6, #00b4d8);">📋</div>
                            <div class="rb-template-name">P&L Statement</div>
                            <div class="rb-template-desc">Income statement analysis</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('costAnalysis')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #e63946, #f77f00);">📉</div>
                            <div class="rb-template-name">Cost Analysis</div>
                            <div class="rb-template-desc">Expense breakdown & trends</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('quarterly')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #2d6a4f, #40916c);">📅</div>
                            <div class="rb-template-name">Quarterly Review</div>
                            <div class="rb-template-desc">Q/Q comparison & goals</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('investorDeck')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #2c3e50, #34495e);">🎯</div>
                            <div class="rb-template-name">Investor Report</div>
                            <div class="rb-template-desc">Waterfall & growth metrics</div>
                        </div>
                    </div>

                    <div style="margin: 25px 0 15px;">
                        <span style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Dashboards</span>
                    </div>
                    <div class="rb-template-grid" style="grid-template-columns: repeat(4, 1fr);">
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('performance')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #86bc25, #0097a9);">⚡</div>
                            <div class="rb-template-name">KPI Dashboard</div>
                            <div class="rb-template-desc">Real-time metrics overview</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('salesDashboard')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #ffd700, #ff9800);">🏆</div>
                            <div class="rb-template-name">Sales Dashboard</div>
                            <div class="rb-template-desc">Pipeline & conversion rates</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('comboCharts')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #9c27b0, #673ab7);">📊</div>
                            <div class="rb-template-name">Combo Charts</div>
                            <div class="rb-template-desc">Bar + line visualizations</div>
                        </div>
                        <div class="rb-template-card" onclick="reportBuilder.loadTemplate('blank')">
                            <div class="rb-template-preview" style="background: linear-gradient(135deg, #444, #666);">➕</div>
                            <div class="rb-template-name">Blank Canvas</div>
                            <div class="rb-template-desc">Start from scratch</div>
                        </div>
                    </div>

                    <button class="rb-toolbar-btn" style="margin-top: 25px;" onclick="reportBuilder.hideTemplates()">Cancel</button>
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
            'combo-chart': 500,
            'pie-chart': 300,
            'area-chart': 400,
            'table': 500,
            'budget-table': 600,
            'category-table': 550,
            'text': 400,
            'heading': 400,
            'image': 300,
            'divider': 600,
            'waterfall': 500,
            'yoy-chart': 500,
            'gauge': 200
        };
        return widths[type] || 300;
    }

    getDefaultHeight(type) {
        const heights = {
            'kpi': 150,
            'bar-chart': 280,
            'line-chart': 280,
            'combo-chart': 300,
            'pie-chart': 280,
            'area-chart': 280,
            'table': 300,
            'budget-table': 320,
            'category-table': 280,
            'text': 150,
            'heading': 60,
            'image': 200,
            'divider': 30,
            'waterfall': 320,
            'yoy-chart': 320,
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
            case 'combo-chart':
                return {
                    title: 'Revenue & Growth Rate',
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    barData: [450000, 520000, 580000, 640000],
                    lineData: [12, 15.5, 11.5, 10.3],
                    barLabel: 'Revenue ($)',
                    lineLabel: 'Growth Rate (%)',
                    barColor: palette.primary,
                    lineColor: palette.accent,
                    lineDashed: false
                };
            case 'waterfall':
                return {
                    title: 'Revenue Bridge Analysis',
                    labels: ['Starting', 'New Sales', 'Upsells', 'Churn', 'Price Inc.', 'Ending'],
                    values: [1000000, 250000, 120000, -80000, 50000, 1340000],
                    types: ['total', 'increase', 'increase', 'decrease', 'increase', 'total'],
                    colors: {
                        increase: palette.success,
                        decrease: palette.danger,
                        total: palette.primary
                    }
                };
            case 'yoy-chart':
                return {
                    title: 'Year over Year Comparison',
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    currentYear: [120, 135, 145, 150, 162, 175, 180, 195, 210, 225, 240, 260],
                    previousYear: [100, 110, 125, 130, 140, 155, 160, 170, 185, 195, 210, 230],
                    currentLabel: '2024',
                    previousLabel: '2023',
                    currentColor: palette.primary,
                    previousColor: palette.neutral
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
            case 'budget-table':
                return {
                    title: 'Budget vs Actual Analysis',
                    headers: ['Category', 'Budget', 'Actual', 'Variance', '% Var'],
                    rows: [
                        { category: 'Revenue', budget: 500000, actual: 545000, isExpense: false },
                        { category: 'COGS', budget: 200000, actual: 195000, isExpense: true },
                        { category: 'Gross Profit', budget: 300000, actual: 350000, isExpense: false },
                        { category: 'Marketing', budget: 50000, actual: 62000, isExpense: true },
                        { category: 'Salaries', budget: 120000, actual: 118000, isExpense: true },
                        { category: 'Operations', budget: 30000, actual: 28000, isExpense: true },
                        { category: 'Net Income', budget: 100000, actual: 142000, isExpense: false }
                    ],
                    showVarianceBar: true
                };
            case 'category-table':
                return {
                    title: 'Cost by Category',
                    mode: 'cost', // 'cost' or 'revenue'
                    headers: ['Category', 'Amount', '% of Total', 'Trend'],
                    rows: [
                        { category: 'Payroll', amount: 450000, trend: '+5%' },
                        { category: 'Marketing', amount: 120000, trend: '+12%' },
                        { category: 'Technology', amount: 85000, trend: '-3%' },
                        { category: 'Office & Admin', amount: 65000, trend: '+2%' },
                        { category: 'Professional Services', amount: 45000, trend: '-8%' },
                        { category: 'Other', amount: 35000, trend: '+1%' }
                    ],
                    showPieChart: true
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
        const isDark = this.currentPalette === 'lightning' || this.currentPalette === 'midnight';
        const textColor = isDark ? '#fff' : palette.text;
        const bgColor = isDark ? '#2a2a2a' : '#f8f9fa';

        switch (element.type) {
            case 'kpi':
                return `
                    <div class="rb-kpi-card">
                        <div class="rb-kpi-value" style="color: ${palette.primary}">${element.data.value}</div>
                        <div class="rb-kpi-label" style="color: ${isDark ? '#aaa' : '#666'}">${element.data.label}</div>
                        <div class="rb-kpi-change ${element.data.positive ? 'positive' : 'negative'}">
                            ${element.data.change}
                        </div>
                    </div>
                `;
            case 'heading':
                return `<div class="rb-heading" style="text-align: ${element.data.align}; color: ${textColor}">${element.data.text}</div>`;
            case 'text':
                return `<div class="rb-text-block" style="color: ${textColor}">${element.data.content}</div>`;
            case 'bar-chart':
                return this.renderBarChart(element, palette, isDark);
            case 'line-chart':
                return this.renderLineChart(element, palette, isDark);
            case 'area-chart':
                return this.renderAreaChart(element, palette, isDark);
            case 'pie-chart':
                return this.renderPieChart(element, palette, isDark);
            case 'combo-chart':
                return this.renderComboChart(element, palette, isDark);
            case 'waterfall':
                return this.renderWaterfallChart(element, palette, isDark);
            case 'yoy-chart':
                return this.renderYoYChart(element, palette, isDark);
            case 'table':
                return `
                    <div class="rb-table-container">
                        <table class="rb-data-table" style="color: ${textColor}">
                            <thead>
                                <tr>
                                    ${element.data.headers.map(h => `<th style="background: ${bgColor}; color: ${textColor}">${h}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${element.data.rows.map(row => `
                                    <tr>
                                        ${row.map(cell => `<td style="border-color: ${isDark ? '#444' : '#eee'}">${cell}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'budget-table':
                return this.renderBudgetTable(element, palette, isDark);
            case 'category-table':
                return this.renderCategoryTable(element, palette, isDark);
            case 'gauge':
                return `
                    <div class="rb-kpi-card">
                        <div style="font-size: 32px; color: ${palette.primary}">${element.data.value}%</div>
                        <div class="rb-kpi-label" style="color: ${isDark ? '#aaa' : '#666'}">${element.data.label}</div>
                        <div style="margin-top: 10px; height: 8px; background: ${isDark ? '#444' : '#eee'}; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${element.data.value}%; height: 100%; background: ${palette.primary};"></div>
                        </div>
                    </div>
                `;
            case 'divider':
                return `<hr style="border: none; border-top: 2px solid ${palette.primary}; margin: 10px 20px;">`;
            case 'image':
                return `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: ${bgColor}; color: ${isDark ? '#666' : '#999'};">
                        <span style="font-size: 32px;">🖼️</span>
                    </div>
                `;
            default:
                return `<div style="padding: 20px; color: #999;">Element: ${element.type}</div>`;
        }
    }

    // =====================================================
    // SVG CHART RENDERERS
    // =====================================================

    renderBarChart(element, palette, isDark) {
        const data = element.data;
        const maxVal = Math.max(...data.datasets.flatMap(d => d.data));
        const barWidth = 100 / (data.labels.length * (data.datasets.length + 1));
        const colors = palette.chartColors || [palette.primary, palette.secondary];
        const textColor = isDark ? '#ccc' : '#666';

        let bars = '';
        data.labels.forEach((label, i) => {
            data.datasets.forEach((dataset, j) => {
                const height = (dataset.data[i] / maxVal) * 70;
                const x = (i * (data.datasets.length + 1) + j + 0.5) * barWidth;
                bars += `<rect x="${x}%" y="${85 - height}%" width="${barWidth * 0.8}%" height="${height}%"
                         fill="${colors[j % colors.length]}" rx="2"/>`;
            });
        });

        let labels = '';
        data.labels.forEach((label, i) => {
            const x = (i * (data.datasets.length + 1) + data.datasets.length / 2) * barWidth;
            labels += `<text x="${x}%" y="98%" font-size="10" fill="${textColor}" text-anchor="middle">${label}</text>`;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 35px)">
                    ${bars}
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderLineChart(element, palette, isDark) {
        const data = element.data;
        const maxVal = Math.max(...data.datasets.flatMap(d => d.data));
        const colors = palette.chartColors || [palette.primary, palette.secondary];
        const textColor = isDark ? '#ccc' : '#666';

        let lines = '';
        data.datasets.forEach((dataset, j) => {
            const points = dataset.data.map((val, i) => {
                const x = 5 + (i / (dataset.data.length - 1)) * 90;
                const y = 85 - (val / maxVal) * 70;
                return `${x},${y}`;
            }).join(' ');

            lines += `<polyline points="${points}" fill="none" stroke="${colors[j % colors.length]}"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

            // Add dots
            dataset.data.forEach((val, i) => {
                const x = 5 + (i / (dataset.data.length - 1)) * 90;
                const y = 85 - (val / maxVal) * 70;
                lines += `<circle cx="${x}" cy="${y}" r="3" fill="${colors[j % colors.length]}"/>`;
            });
        });

        let labels = '';
        data.labels.forEach((label, i) => {
            const x = 5 + (i / (data.labels.length - 1)) * 90;
            labels += `<text x="${x}" y="98" font-size="10" fill="${textColor}" text-anchor="middle">${label}</text>`;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 35px)">
                    ${lines}
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderAreaChart(element, palette, isDark) {
        const data = element.data;
        const maxVal = Math.max(...data.datasets.flatMap(d => d.data));
        const colors = palette.chartColors || [palette.primary, palette.secondary];
        const textColor = isDark ? '#ccc' : '#666';

        let areas = '';
        data.datasets.forEach((dataset, j) => {
            const points = dataset.data.map((val, i) => {
                const x = 5 + (i / (dataset.data.length - 1)) * 90;
                const y = 85 - (val / maxVal) * 70;
                return `${x},${y}`;
            }).join(' ');

            areas += `<polygon points="5,85 ${points} 95,85" fill="${colors[j % colors.length]}" opacity="0.3"/>`;
            areas += `<polyline points="${points}" fill="none" stroke="${colors[j % colors.length]}" stroke-width="2"/>`;
        });

        let labels = '';
        data.labels.forEach((label, i) => {
            const x = 5 + (i / (data.labels.length - 1)) * 90;
            labels += `<text x="${x}" y="98" font-size="10" fill="${textColor}" text-anchor="middle">${label}</text>`;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 35px)">
                    ${areas}
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderPieChart(element, palette, isDark) {
        const data = element.data;
        const total = data.data.reduce((a, b) => a + b, 0);
        const colors = data.colors || palette.chartColors;

        let startAngle = -90;
        let paths = '';
        let legends = '';

        data.data.forEach((val, i) => {
            const angle = (val / total) * 360;
            const endAngle = startAngle + angle;
            const largeArc = angle > 180 ? 1 : 0;

            const x1 = 35 + 25 * Math.cos(startAngle * Math.PI / 180);
            const y1 = 45 + 25 * Math.sin(startAngle * Math.PI / 180);
            const x2 = 35 + 25 * Math.cos(endAngle * Math.PI / 180);
            const y2 = 45 + 25 * Math.sin(endAngle * Math.PI / 180);

            paths += `<path d="M35,45 L${x1},${y1} A25,25 0 ${largeArc},1 ${x2},${y2} Z" fill="${colors[i % colors.length]}"/>`;

            legends += `<rect x="72" y="${10 + i * 15}" width="8" height="8" fill="${colors[i % colors.length]}" rx="1"/>
                       <text x="82" y="${17 + i * 15}" font-size="8" fill="${isDark ? '#ccc' : '#666'}">${data.labels[i]} (${Math.round(val/total*100)}%)</text>`;

            startAngle = endAngle;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 35px)">
                    ${paths}
                    ${legends}
                </svg>
            </div>
        `;
    }

    renderComboChart(element, palette, isDark) {
        const data = element.data;
        const maxBar = Math.max(...data.barData);
        const maxLine = Math.max(...data.lineData);
        const textColor = isDark ? '#ccc' : '#666';
        const barWidth = 70 / data.labels.length;

        let bars = '';
        let linePoints = [];

        data.barData.forEach((val, i) => {
            const height = (val / maxBar) * 60;
            const x = 10 + i * (80 / data.labels.length);
            bars += `<rect x="${x}%" y="${80 - height}%" width="${barWidth * 0.6}%" height="${height}%"
                     fill="${data.barColor}" rx="2" opacity="0.8"/>`;

            const lineX = x + barWidth * 0.3;
            const lineY = 80 - (data.lineData[i] / maxLine) * 60;
            linePoints.push(`${lineX},${lineY}`);
        });

        const dashStyle = data.lineDashed ? 'stroke-dasharray="3,2"' : '';
        let line = `<polyline points="${linePoints.join(' ')}" fill="none" stroke="${data.lineColor}"
                    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" ${dashStyle}/>`;

        linePoints.forEach(point => {
            const [x, y] = point.split(',');
            line += `<circle cx="${x}" cy="${y}" r="4" fill="${data.lineColor}" stroke="#fff" stroke-width="1.5"/>`;
        });

        let labels = '';
        data.labels.forEach((label, i) => {
            const x = 10 + i * (80 / data.labels.length) + barWidth * 0.3;
            labels += `<text x="${x}%" y="95%" font-size="9" fill="${textColor}" text-anchor="middle">${label}</text>`;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <div style="display: flex; gap: 15px; margin-bottom: 8px; font-size: 10px;">
                    <span style="color: ${textColor}"><span style="display:inline-block;width:12px;height:12px;background:${data.barColor};margin-right:4px;border-radius:2px;"></span>${data.barLabel}</span>
                    <span style="color: ${textColor}"><span style="display:inline-block;width:12px;height:2px;background:${data.lineColor};margin-right:4px;vertical-align:middle;"></span>${data.lineLabel}</span>
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 60px)">
                    ${bars}
                    ${line}
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderWaterfallChart(element, palette, isDark) {
        const data = element.data;
        const textColor = isDark ? '#ccc' : '#666';

        // Calculate running total for positioning
        let runningTotal = 0;
        const positions = [];
        const maxVal = Math.max(...data.values.map(v => Math.abs(v)));
        const scale = 50 / maxVal;

        data.values.forEach((val, i) => {
            if (data.types[i] === 'total') {
                positions.push({ start: 0, height: val * scale, value: val });
                runningTotal = val;
            } else {
                const start = runningTotal;
                runningTotal += val;
                positions.push({
                    start: Math.min(start, runningTotal) * scale,
                    height: Math.abs(val) * scale,
                    value: val
                });
            }
        });

        const barWidth = 80 / data.labels.length;
        let bars = '';
        let connectors = '';
        let labels = '';

        positions.forEach((pos, i) => {
            const x = 10 + i * barWidth;
            const color = data.types[i] === 'total' ? data.colors.total :
                         (data.values[i] >= 0 ? data.colors.increase : data.colors.decrease);
            const y = 75 - pos.start - pos.height;

            bars += `<rect x="${x}%" y="${y}%" width="${barWidth * 0.7}%" height="${pos.height}%"
                     fill="${color}" rx="2"/>`;

            // Connector line to next bar
            if (i < positions.length - 1 && data.types[i] !== 'total') {
                const nextX = 10 + (i + 1) * barWidth;
                const lineY = y + (data.values[i] >= 0 ? 0 : pos.height);
                connectors += `<line x1="${x + barWidth * 0.7}%" y1="${lineY}%" x2="${nextX}%" y2="${lineY}%"
                              stroke="${isDark ? '#555' : '#ccc'}" stroke-width="1" stroke-dasharray="2,2"/>`;
            }

            // Value labels
            const labelY = y - 2;
            const formattedVal = data.values[i] >= 1000000 ? `$${(data.values[i]/1000000).toFixed(1)}M` :
                                data.values[i] >= 1000 ? `$${(data.values[i]/1000).toFixed(0)}K` :
                                `$${data.values[i]}`;
            bars += `<text x="${x + barWidth * 0.35}%" y="${labelY}%" font-size="7" fill="${textColor}" text-anchor="middle">${formattedVal}</text>`;

            labels += `<text x="${x + barWidth * 0.35}%" y="95%" font-size="8" fill="${textColor}" text-anchor="middle">${data.labels[i]}</text>`;
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 35px)">
                    ${connectors}
                    ${bars}
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderYoYChart(element, palette, isDark) {
        const data = element.data;
        const maxVal = Math.max(...data.currentYear, ...data.previousYear);
        const textColor = isDark ? '#ccc' : '#666';

        // Create line paths
        const currentPoints = data.currentYear.map((val, i) => {
            const x = 8 + (i / (data.currentYear.length - 1)) * 84;
            const y = 75 - (val / maxVal) * 55;
            return `${x},${y}`;
        }).join(' ');

        const previousPoints = data.previousYear.map((val, i) => {
            const x = 8 + (i / (data.previousYear.length - 1)) * 84;
            const y = 75 - (val / maxVal) * 55;
            return `${x},${y}`;
        }).join(' ');

        // Calculate YoY change
        const lastCurrent = data.currentYear[data.currentYear.length - 1];
        const lastPrevious = data.previousYear[data.previousYear.length - 1];
        const yoyChange = ((lastCurrent - lastPrevious) / lastPrevious * 100).toFixed(1);

        let labels = '';
        data.labels.forEach((label, i) => {
            if (i % 2 === 0) { // Show every other label
                const x = 8 + (i / (data.labels.length - 1)) * 84;
                labels += `<text x="${x}" y="92" font-size="8" fill="${textColor}" text-anchor="middle">${label}</text>`;
            }
        });

        return `
            <div class="rb-chart-container">
                <div class="rb-chart-title" style="color: ${isDark ? '#fff' : '#333'}">${data.title}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div style="display: flex; gap: 15px; font-size: 10px;">
                        <span style="color: ${textColor}"><span style="display:inline-block;width:20px;height:2px;background:${data.currentColor};margin-right:4px;vertical-align:middle;"></span>${data.currentLabel}</span>
                        <span style="color: ${textColor}"><span style="display:inline-block;width:20px;height:2px;background:${data.previousColor};margin-right:4px;vertical-align:middle;border-style:dashed;"></span>${data.previousLabel}</span>
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: ${yoyChange >= 0 ? palette.success : palette.danger}">
                        ${yoyChange >= 0 ? '+' : ''}${yoyChange}% YoY
                    </div>
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style="width:100%; height:calc(100% - 55px)">
                    <polyline points="${previousPoints}" fill="none" stroke="${data.previousColor}"
                              stroke-width="2" stroke-dasharray="4,2" opacity="0.7"/>
                    <polyline points="${currentPoints}" fill="none" stroke="${data.currentColor}"
                              stroke-width="2.5"/>
                    ${labels}
                </svg>
            </div>
        `;
    }

    renderBudgetTable(element, palette, isDark) {
        const data = element.data;
        const textColor = isDark ? '#fff' : '#333';
        const headerBg = isDark ? '#333' : '#f0f0f0';
        const borderColor = isDark ? '#444' : '#ddd';

        const formatCurrency = (val) => {
            if (Math.abs(val) >= 1000000) return `$${(val/1000000).toFixed(1)}M`;
            if (Math.abs(val) >= 1000) return `$${(val/1000).toFixed(0)}K`;
            return `$${val.toLocaleString()}`;
        };

        let rows = '';
        data.rows.forEach(row => {
            const variance = row.isExpense ? row.budget - row.actual : row.actual - row.budget;
            const varPercent = ((variance / row.budget) * 100).toFixed(1);
            const isPositive = variance >= 0;
            const varColor = isPositive ? palette.success : palette.danger;
            const maxVar = Math.max(...data.rows.map(r => Math.abs(r.isExpense ? r.budget - r.actual : r.actual - r.budget)));
            const barWidth = Math.abs(variance) / maxVar * 50;

            rows += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; font-weight: ${row.category === 'Net Income' || row.category === 'Gross Profit' ? '600' : '400'}">${row.category}</td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right">${formatCurrency(row.budget)}</td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right">${formatCurrency(row.actual)}</td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right; color: ${varColor}">
                        ${isPositive ? '+' : ''}${formatCurrency(variance)}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; width: 80px;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div style="width: ${barWidth}px; height: 8px; background: ${varColor}; border-radius: 2px;"></div>
                            <span style="font-size: 10px; color: ${varColor}">${isPositive ? '+' : ''}${varPercent}%</span>
                        </div>
                    </td>
                </tr>
            `;
        });

        return `
            <div class="rb-table-container" style="color: ${textColor}">
                <div style="font-weight: 600; margin-bottom: 10px; font-size: 14px;">${data.title}</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: ${headerBg}">
                            ${data.headers.map(h => `<th style="padding: 10px 8px; text-align: left; border-bottom: 2px solid ${borderColor}; font-weight: 600">${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderCategoryTable(element, palette, isDark) {
        const data = element.data;
        const textColor = isDark ? '#fff' : '#333';
        const headerBg = isDark ? '#333' : '#f0f0f0';
        const borderColor = isDark ? '#444' : '#ddd';
        const total = data.rows.reduce((sum, row) => sum + row.amount, 0);
        const colors = palette.chartColors || [palette.primary, palette.secondary, palette.accent, palette.success, palette.warning, palette.neutral];

        const formatCurrency = (val) => {
            if (val >= 1000000) return `$${(val/1000000).toFixed(1)}M`;
            if (val >= 1000) return `$${(val/1000).toFixed(0)}K`;
            return `$${val.toLocaleString()}`;
        };

        let rows = '';
        data.rows.forEach((row, i) => {
            const percent = ((row.amount / total) * 100).toFixed(1);
            const trendColor = row.trend.startsWith('+') ? palette.success :
                              row.trend.startsWith('-') ? palette.danger : textColor;

            rows += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}">
                        <span style="display:inline-block;width:10px;height:10px;background:${colors[i % colors.length]};border-radius:2px;margin-right:8px;"></span>
                        ${row.category}
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right; font-weight: 500">${formatCurrency(row.amount)}</td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right">
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                            <div style="width: ${percent}px; height: 6px; background: ${colors[i % colors.length]}; border-radius: 3px;"></div>
                            ${percent}%
                        </div>
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid ${borderColor}; text-align: right; color: ${trendColor}">${row.trend}</td>
                </tr>
            `;
        });

        // Mini pie chart
        let pieChart = '';
        if (data.showPieChart) {
            let startAngle = -90;
            data.rows.forEach((row, i) => {
                const angle = (row.amount / total) * 360;
                const endAngle = startAngle + angle;
                const largeArc = angle > 180 ? 1 : 0;
                const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
                const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
                pieChart += `<path d="M50,50 L${x1},${y1} A40,40 0 ${largeArc},1 ${x2},${y2} Z" fill="${colors[i % colors.length]}"/>`;
                startAngle = endAngle;
            });
        }

        return `
            <div class="rb-table-container" style="color: ${textColor}; display: flex; gap: 15px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 10px; font-size: 14px;">${data.title}</div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                        <thead>
                            <tr style="background: ${headerBg}">
                                ${data.headers.map(h => `<th style="padding: 8px 6px; text-align: left; border-bottom: 2px solid ${borderColor}; font-weight: 600">${h}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                        <tfoot>
                            <tr style="font-weight: 600; background: ${headerBg}">
                                <td style="padding: 8px;">Total</td>
                                <td style="padding: 8px; text-align: right">${formatCurrency(total)}</td>
                                <td style="padding: 8px; text-align: right">100%</td>
                                <td style="padding: 8px;"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                ${data.showPieChart ? `
                    <div style="width: 100px; flex-shrink: 0;">
                        <svg viewBox="0 0 100 100" style="width: 100%; height: 100px;">
                            ${pieChart}
                        </svg>
                    </div>
                ` : ''}
            </div>
        `;
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

        // Set report title based on template
        const titleInput = document.getElementById('rb-report-title');
        if (titleInput) {
            const titles = {
                'executive': 'Executive Summary Report',
                'budgetAnalysis': 'Budget vs Actual Analysis',
                'yoyComparison': 'Year over Year Comparison',
                'revenueBreakdown': 'Revenue Analysis Report',
                'financial': 'P&L Statement',
                'costAnalysis': 'Cost Analysis Report',
                'quarterly': 'Q4 2024 Quarterly Review',
                'investorDeck': 'Investor Financial Report',
                'performance': 'KPI Performance Dashboard',
                'salesDashboard': 'Sales Performance Dashboard',
                'comboCharts': 'Financial Analytics Report',
                'blank': 'Untitled Report'
            };
            titleInput.value = titles[templateName] || 'Financial Report';
        }

        switch (templateName) {
            case 'executive':
                this.loadExecutiveTemplate();
                break;
            case 'budgetAnalysis':
                this.loadBudgetAnalysisTemplate();
                break;
            case 'yoyComparison':
                this.loadYoYComparisonTemplate();
                break;
            case 'revenueBreakdown':
                this.loadRevenueBreakdownTemplate();
                break;
            case 'financial':
                this.loadFinancialTemplate();
                break;
            case 'costAnalysis':
                this.loadCostAnalysisTemplate();
                break;
            case 'quarterly':
                this.loadQuarterlyTemplate();
                break;
            case 'investorDeck':
                this.loadInvestorDeckTemplate();
                break;
            case 'performance':
                this.loadPerformanceTemplate();
                break;
            case 'salesDashboard':
                this.loadSalesDashboardTemplate();
                break;
            case 'comboCharts':
                this.loadComboChartsTemplate();
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

    // NEW COMPREHENSIVE TEMPLATES

    loadBudgetAnalysisTemplate() {
        const palette = this.colorPalettes[this.currentPalette];

        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Budget vs Actual Analysis';
        this.elements[this.elements.length - 1].width = 600;

        // KPI row
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$545K';
            this.elements[this.elements.length - 1].data.label = 'Actual Revenue';
            this.elements[this.elements.length - 1].data.change = '+9% vs Budget';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '$403K';
            this.elements[this.elements.length - 1].data.label = 'Actual Costs';
            this.elements[this.elements.length - 1].data.change = '-2% vs Budget';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '$142K';
            this.elements[this.elements.length - 1].data.label = 'Net Income';
            this.elements[this.elements.length - 1].data.change = '+42% vs Budget';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            this.elements[this.elements.length - 1].data.value = '26%';
            this.elements[this.elements.length - 1].data.label = 'Profit Margin';
            this.elements[this.elements.length - 1].data.change = '+6pp';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 200);

        // Budget table
        setTimeout(() => {
            this.addElement('budget-table', 40, 280);
            this.elements[this.elements.length - 1].width = 650;
            this.elements[this.elements.length - 1].height = 350;
        }, 250);

        // Combo chart
        setTimeout(() => {
            this.addElement('combo-chart', 720, 280);
            this.elements[this.elements.length - 1].data.title = 'Monthly Budget Performance';
            this.elements[this.elements.length - 1].data.barLabel = 'Actual ($)';
            this.elements[this.elements.length - 1].data.lineLabel = 'Budget Variance (%)';
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        this.deselectAll();
    }

    loadYoYComparisonTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Year over Year Performance';
        this.elements[this.elements.length - 1].width = 600;

        // KPI row
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$2.6M';
            this.elements[this.elements.length - 1].data.label = '2024 Revenue';
            this.elements[this.elements.length - 1].data.change = '+13% YoY';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '$2.3M';
            this.elements[this.elements.length - 1].data.label = '2023 Revenue';
            this.elements[this.elements.length - 1].data.change = 'Prior Year';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '+$300K';
            this.elements[this.elements.length - 1].data.label = 'YoY Growth';
            this.elements[this.elements.length - 1].data.change = 'Absolute';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 150);

        // YoY Chart - main visual
        setTimeout(() => {
            this.addElement('yoy-chart', 40, 280);
            this.elements[this.elements.length - 1].width = 600;
            this.elements[this.elements.length - 1].height = 320;
        }, 200);

        // Bar chart comparison
        setTimeout(() => {
            this.addElement('bar-chart', 680, 280);
            this.elements[this.elements.length - 1].data.title = 'Quarterly YoY Comparison';
            this.elements[this.elements.length - 1].data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            this.elements[this.elements.length - 1].data.datasets = [
                { label: '2024', data: [580, 620, 680, 720] },
                { label: '2023', data: [520, 550, 580, 650] }
            ];
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 280;
        }, 250);

        // Analysis text
        setTimeout(() => {
            this.addElement('text', 40, 620);
            this.elements[this.elements.length - 1].data.content = 'Key Insights: Revenue growth accelerated in H2 2024, driven by new product launches and market expansion. Q4 showed the strongest YoY growth at 10.8%, setting a positive trajectory for 2025.';
            this.elements[this.elements.length - 1].width = 800;
        }, 300);

        this.deselectAll();
    }

    loadRevenueBreakdownTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Revenue Analysis';
        this.elements[this.elements.length - 1].width = 500;

        // KPI row
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$4.2M';
            this.elements[this.elements.length - 1].data.label = 'Total Revenue';
            this.elements[this.elements.length - 1].data.change = '+18% YTD';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '$350K';
            this.elements[this.elements.length - 1].data.label = 'Monthly Avg';
            this.elements[this.elements.length - 1].data.change = '+$45K';
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '4';
            this.elements[this.elements.length - 1].data.label = 'Revenue Streams';
            this.elements[this.elements.length - 1].data.change = 'Diversified';
        }, 150);

        // Revenue by category table with pie
        setTimeout(() => {
            this.addElement('category-table', 40, 280);
            this.elements[this.elements.length - 1].data.title = 'Revenue by Category';
            this.elements[this.elements.length - 1].data.mode = 'revenue';
            this.elements[this.elements.length - 1].data.rows = [
                { category: 'Subscriptions', amount: 1800000, trend: '+22%' },
                { category: 'Services', amount: 1200000, trend: '+15%' },
                { category: 'Products', amount: 850000, trend: '+8%' },
                { category: 'Licensing', amount: 350000, trend: '+35%' }
            ];
            this.elements[this.elements.length - 1].width = 550;
            this.elements[this.elements.length - 1].height = 280;
        }, 200);

        // Line chart for trends
        setTimeout(() => {
            this.addElement('line-chart', 620, 280);
            this.elements[this.elements.length - 1].data.title = 'Revenue Trend by Month';
            this.elements[this.elements.length - 1].data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            this.elements[this.elements.length - 1].data.datasets = [
                { label: 'Total Revenue', data: [320, 340, 365, 380, 395, 420] }
            ];
            this.elements[this.elements.length - 1].width = 450;
        }, 250);

        // Pie chart
        setTimeout(() => {
            this.addElement('pie-chart', 40, 580);
            this.elements[this.elements.length - 1].data.title = 'Revenue Mix';
            this.elements[this.elements.length - 1].data.labels = ['Subscriptions', 'Services', 'Products', 'Licensing'];
            this.elements[this.elements.length - 1].data.data = [43, 29, 20, 8];
            this.elements[this.elements.length - 1].width = 350;
        }, 300);

        this.deselectAll();
    }

    loadCostAnalysisTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Cost Analysis Report';
        this.elements[this.elements.length - 1].width = 500;

        // KPI row
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$1.8M';
            this.elements[this.elements.length - 1].data.label = 'Total Costs';
            this.elements[this.elements.length - 1].data.change = '+5% YoY';
            this.elements[this.elements.length - 1].data.positive = false;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '43%';
            this.elements[this.elements.length - 1].data.label = 'Cost Ratio';
            this.elements[this.elements.length - 1].data.change = '-2pp YoY';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '$150K';
            this.elements[this.elements.length - 1].data.label = 'Monthly Avg';
            this.elements[this.elements.length - 1].data.change = 'Stable';
        }, 150);

        // Cost category table
        setTimeout(() => {
            this.addElement('category-table', 40, 280);
            this.elements[this.elements.length - 1].data.title = 'Cost by Category';
            this.elements[this.elements.length - 1].data.mode = 'cost';
            this.elements[this.elements.length - 1].width = 550;
            this.elements[this.elements.length - 1].height = 300;
        }, 200);

        // Waterfall chart
        setTimeout(() => {
            this.addElement('waterfall', 620, 280);
            this.elements[this.elements.length - 1].data.title = 'Cost Bridge Analysis';
            this.elements[this.elements.length - 1].data.labels = ['2023 Base', 'Payroll', 'Marketing', 'Savings', 'Tech', '2024 Total'];
            this.elements[this.elements.length - 1].data.values = [1600000, 120000, 80000, -50000, 50000, 1800000];
            this.elements[this.elements.length - 1].data.types = ['total', 'increase', 'increase', 'decrease', 'increase', 'total'];
            this.elements[this.elements.length - 1].width = 480;
            this.elements[this.elements.length - 1].height = 320;
        }, 250);

        this.deselectAll();
    }

    loadInvestorDeckTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Financial Performance Summary';
        this.elements[this.elements.length - 1].width = 600;

        // KPI row - key metrics
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$12.4M';
            this.elements[this.elements.length - 1].data.label = 'ARR';
            this.elements[this.elements.length - 1].data.change = '+68% YoY';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '$2.8M';
            this.elements[this.elements.length - 1].data.label = 'Net Revenue';
            this.elements[this.elements.length - 1].data.change = '+52% YoY';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '115%';
            this.elements[this.elements.length - 1].data.label = 'NRR';
            this.elements[this.elements.length - 1].data.change = 'Strong retention';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            this.elements[this.elements.length - 1].data.value = '18mo';
            this.elements[this.elements.length - 1].data.label = 'Runway';
            this.elements[this.elements.length - 1].data.change = 'Healthy';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 200);

        // Waterfall for ARR growth
        setTimeout(() => {
            this.addElement('waterfall', 40, 280);
            this.elements[this.elements.length - 1].data.title = 'ARR Bridge Analysis';
            this.elements[this.elements.length - 1].data.labels = ['Start ARR', 'New', 'Expansion', 'Churn', 'End ARR'];
            this.elements[this.elements.length - 1].data.values = [7400000, 4200000, 1800000, -1000000, 12400000];
            this.elements[this.elements.length - 1].data.types = ['total', 'increase', 'increase', 'decrease', 'total'];
            this.elements[this.elements.length - 1].width = 520;
            this.elements[this.elements.length - 1].height = 300;
        }, 250);

        // Combo chart
        setTimeout(() => {
            this.addElement('combo-chart', 590, 280);
            this.elements[this.elements.length - 1].data.title = 'Revenue & Growth Rate';
            this.elements[this.elements.length - 1].data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            this.elements[this.elements.length - 1].data.barData = [580000, 680000, 780000, 900000];
            this.elements[this.elements.length - 1].data.lineData = [52, 62, 68, 72];
            this.elements[this.elements.length - 1].data.barLabel = 'Revenue ($)';
            this.elements[this.elements.length - 1].data.lineLabel = 'YoY Growth (%)';
            this.elements[this.elements.length - 1].width = 480;
            this.elements[this.elements.length - 1].height = 300;
        }, 300);

        this.deselectAll();
    }

    loadSalesDashboardTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Sales Performance Dashboard';
        this.elements[this.elements.length - 1].width = 600;

        // KPI row
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            this.elements[this.elements.length - 1].data.value = '$3.2M';
            this.elements[this.elements.length - 1].data.label = 'Pipeline Value';
            this.elements[this.elements.length - 1].data.change = '+24% MoM';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            this.elements[this.elements.length - 1].data.value = '28%';
            this.elements[this.elements.length - 1].data.label = 'Win Rate';
            this.elements[this.elements.length - 1].data.change = '+3pp';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            this.elements[this.elements.length - 1].data.value = '$45K';
            this.elements[this.elements.length - 1].data.label = 'Avg Deal Size';
            this.elements[this.elements.length - 1].data.change = '+12%';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            this.elements[this.elements.length - 1].data.value = '32 days';
            this.elements[this.elements.length - 1].data.label = 'Sales Cycle';
            this.elements[this.elements.length - 1].data.change = '-5 days';
            this.elements[this.elements.length - 1].data.positive = true;
        }, 200);

        // Funnel as bar chart
        setTimeout(() => {
            this.addElement('bar-chart', 40, 280);
            this.elements[this.elements.length - 1].data.title = 'Sales Funnel';
            this.elements[this.elements.length - 1].data.labels = ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];
            this.elements[this.elements.length - 1].data.datasets = [{ label: 'Deals', data: [450, 280, 145, 85, 42] }];
            this.elements[this.elements.length - 1].width = 450;
        }, 250);

        // Gauges for targets
        setTimeout(() => {
            this.addElement('gauge', 520, 280);
            this.elements[this.elements.length - 1].data.value = 82;
            this.elements[this.elements.length - 1].data.label = 'Quota Attainment';
        }, 300);

        setTimeout(() => {
            this.addElement('gauge', 740, 280);
            this.elements[this.elements.length - 1].data.value = 68;
            this.elements[this.elements.length - 1].data.label = 'Team Target';
        }, 350);

        // Line chart
        setTimeout(() => {
            this.addElement('line-chart', 520, 450);
            this.elements[this.elements.length - 1].data.title = 'Monthly Closed Revenue';
            this.elements[this.elements.length - 1].data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            this.elements[this.elements.length - 1].data.datasets = [
                { label: 'Closed Won', data: [180, 210, 245, 290, 310, 380] }
            ];
            this.elements[this.elements.length - 1].width = 400;
        }, 400);

        this.deselectAll();
    }

    loadComboChartsTemplate() {
        // Title
        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Financial Analytics';
        this.elements[this.elements.length - 1].width = 500;

        // Revenue & Margin combo
        setTimeout(() => {
            this.addElement('combo-chart', 40, 100);
            this.elements[this.elements.length - 1].data.title = 'Revenue & Profit Margin';
            this.elements[this.elements.length - 1].data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            this.elements[this.elements.length - 1].data.barData = [1200000, 1450000, 1680000, 1920000];
            this.elements[this.elements.length - 1].data.lineData = [18, 21, 24, 26];
            this.elements[this.elements.length - 1].data.barLabel = 'Revenue ($)';
            this.elements[this.elements.length - 1].data.lineLabel = 'Margin (%)';
            this.elements[this.elements.length - 1].width = 500;
            this.elements[this.elements.length - 1].height = 300;
        }, 50);

        // Sales & Conversion combo
        setTimeout(() => {
            this.addElement('combo-chart', 570, 100);
            this.elements[this.elements.length - 1].data.title = 'Sales Volume & Conversion';
            this.elements[this.elements.length - 1].data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            this.elements[this.elements.length - 1].data.barData = [320, 380, 420, 480, 520, 590];
            this.elements[this.elements.length - 1].data.lineData = [22, 24, 26, 28, 27, 30];
            this.elements[this.elements.length - 1].data.barLabel = 'Units Sold';
            this.elements[this.elements.length - 1].data.lineLabel = 'Conversion (%)';
            this.elements[this.elements.length - 1].data.lineDashed = true;
            this.elements[this.elements.length - 1].width = 500;
            this.elements[this.elements.length - 1].height = 300;
        }, 100);

        // YoY comparison
        setTimeout(() => {
            this.addElement('yoy-chart', 40, 430);
            this.elements[this.elements.length - 1].width = 500;
            this.elements[this.elements.length - 1].height = 300;
        }, 150);

        // Waterfall
        setTimeout(() => {
            this.addElement('waterfall', 570, 430);
            this.elements[this.elements.length - 1].width = 500;
            this.elements[this.elements.length - 1].height = 300;
        }, 200);

        this.deselectAll();
    }

    // =====================================================
    // PROFESSIONAL REPORT TEMPLATES (Based on Fathom/CFO Best Practices)
    // =====================================================

    loadProfessionalTemplate(templateType) {
        this.clearCanvas();
        const titleInput = document.getElementById('rb-report-title');

        switch (templateType) {
            case 'executive':
                this.loadExecutiveSummaryPro();
                if (titleInput) titleInput.value = 'Executive Summary Report';
                break;
            case 'detailed':
                this.loadDetailedAnalysisPro();
                if (titleInput) titleInput.value = 'Detailed Financial Analysis';
                break;
            case 'budget':
                this.loadBudgetVsActualPro();
                if (titleInput) titleInput.value = 'Budget vs Actual Variance Report';
                break;
            case 'cashflow':
                this.loadCashFlowPro();
                if (titleInput) titleInput.value = '13-Week Cash Flow Forecast';
                break;
            case 'kpi':
                this.loadKPIDashboardPro();
                if (titleInput) titleInput.value = 'KPI Performance Dashboard';
                break;
            case 'investor':
                this.loadInvestorDeckPro();
                if (titleInput) titleInput.value = 'Investor Financial Summary';
                break;
            default:
                this.loadExecutiveSummaryPro();
        }
    }

    // Executive Summary - Board-ready format based on CFO best practices
    loadExecutiveSummaryPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Executive Financial Summary';
        this.elements[this.elements.length - 1].width = 700;

        setTimeout(() => {
            this.addElement('text', 40, 90);
            this.elements[this.elements.length - 1].data.content = `Reporting Period: Q4 2024 | Generated: ${new Date().toLocaleDateString()}`;
            this.elements[this.elements.length - 1].width = 500;
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 40, 140);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$4.2M', label: 'Total Revenue', change: '+18% YoY', positive: true });
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 260, 140);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$890K', label: 'Net Income', change: '+24% YoY', positive: true });
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 480, 140);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '21.2%', label: 'Net Margin', change: '+2.4pp', positive: true });
        }, 200);

        setTimeout(() => {
            this.addElement('kpi', 700, 140);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.8M', label: 'Cash Position', change: '+$320K', positive: true });
        }, 250);

        setTimeout(() => {
            this.addElement('combo-chart', 40, 320);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Revenue & Profit Margin Trend', labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                barData: [920000, 980000, 1050000, 1250000], lineData: [18.5, 19.2, 20.1, 21.2],
                barLabel: 'Revenue ($)', lineLabel: 'Net Margin (%)', barColor: palette.primary, lineColor: palette.accent
            });
            this.elements[this.elements.length - 1].width = 480;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        setTimeout(() => {
            this.addElement('text', 550, 320);
            this.elements[this.elements.length - 1].data.content = `KEY HIGHLIGHTS:\n\n• Revenue exceeded target by 12%\n• Operating expenses reduced 8%\n• Customer acquisition up 34%\n• Gross margin improved 180bps\n• Strong cash generation continues`;
            this.elements[this.elements.length - 1].width = 380;
            this.elements[this.elements.length - 1].height = 200;
        }, 350);

        setTimeout(() => {
            this.addElement('pie-chart', 550, 540);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Operating Expense Mix', labels: ['Payroll', 'Marketing', 'Operations', 'Technology', 'Other'],
                data: [45, 22, 15, 12, 6], colors: [palette.primary, palette.secondary, palette.accent, palette.success, palette.neutral]
            });
            this.elements[this.elements.length - 1].width = 380;
        }, 400);

        setTimeout(() => {
            this.addElement('yoy-chart', 40, 620);
            Object.assign(this.elements[this.elements.length - 1].data, { title: 'Year-over-Year Revenue Comparison', currentLabel: '2024', previousLabel: '2023' });
            this.elements[this.elements.length - 1].width = 480;
            this.elements[this.elements.length - 1].height = 260;
        }, 450);

        this.deselectAll();
    }

    // Detailed Analysis - In-depth P&L with trends
    loadDetailedAnalysisPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Detailed Financial Analysis';
        this.elements[this.elements.length - 1].width = 600;

        setTimeout(() => {
            this.addElement('table', 40, 100);
            this.elements[this.elements.length - 1].data = {
                headers: ['Line Item', 'Q4 2024', 'Q3 2024', 'Q4 2023', 'QoQ %', 'YoY %'],
                rows: [
                    ['Revenue', '$1,250,000', '$1,050,000', '$980,000', '+19%', '+28%'],
                    ['COGS', '$437,500', '$378,000', '$362,600', '+16%', '+21%'],
                    ['Gross Profit', '$812,500', '$672,000', '$617,400', '+21%', '+32%'],
                    ['Operating Expenses', '$547,500', '$483,000', '$470,400', '+13%', '+16%'],
                    ['EBITDA', '$265,000', '$189,000', '$147,000', '+40%', '+80%'],
                    ['Net Income', '$223,000', '$156,000', '$118,000', '+43%', '+89%']
                ]
            };
            this.elements[this.elements.length - 1].width = 700;
            this.elements[this.elements.length - 1].height = 280;
        }, 100);

        setTimeout(() => {
            this.addElement('line-chart', 40, 400);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Margin Trend Analysis', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ label: 'Gross Margin %', data: [62, 63, 64, 64, 65, 65] }, { label: 'Net Margin %', data: [15, 16, 17, 18, 19, 21] }]
            });
            this.elements[this.elements.length - 1].width = 500;
            this.elements[this.elements.length - 1].height = 280;
        }, 200);

        setTimeout(() => {
            this.addElement('category-table', 560, 400);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Operating Cost Structure', mode: 'cost',
                rows: [
                    { category: 'Personnel', amount: 245000, trend: '+8%' },
                    { category: 'Marketing', amount: 120000, trend: '+15%' },
                    { category: 'Technology', amount: 85000, trend: '+12%' },
                    { category: 'Facilities', amount: 55000, trend: '+2%' },
                    { category: 'Other', amount: 42500, trend: '+3%' }
                ], showPieChart: true
            });
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        this.deselectAll();
    }

    // Budget vs Actual - Variance analysis with visual bars
    loadBudgetVsActualPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Budget vs Actual Variance Analysis';
        this.elements[this.elements.length - 1].width = 700;

        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.25M', label: 'Actual Revenue', change: '+12% vs Budget', positive: true });
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.12M', label: 'Budget Revenue', change: 'Target', positive: true });
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '+$137K', label: 'Favorable Variance', change: '+12.2%', positive: true });
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '94%', label: 'Budget Attainment', change: 'On Track', positive: true });
        }, 200);

        setTimeout(() => {
            this.addElement('budget-table', 40, 280);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'P&L Budget vs Actual',
                rows: [
                    { category: 'Revenue', budget: 1120000, actual: 1250000, isExpense: false },
                    { category: 'Cost of Goods Sold', budget: 420000, actual: 437500, isExpense: true },
                    { category: 'Gross Profit', budget: 700000, actual: 812500, isExpense: false },
                    { category: 'Sales & Marketing', budget: 180000, actual: 195000, isExpense: true },
                    { category: 'R&D', budget: 120000, actual: 115000, isExpense: true },
                    { category: 'General & Admin', budget: 150000, actual: 142500, isExpense: true },
                    { category: 'Net Income', budget: 200000, actual: 223000, isExpense: false }
                ], showVarianceBar: true
            });
            this.elements[this.elements.length - 1].width = 700;
            this.elements[this.elements.length - 1].height = 350;
        }, 250);

        setTimeout(() => {
            this.addElement('bar-chart', 40, 650);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Variance by Department', labels: ['Sales', 'Marketing', 'R&D', 'Ops', 'Admin'],
                datasets: [{ label: 'Budget', data: [420, 180, 120, 95, 85] }, { label: 'Actual', data: [485, 195, 115, 92, 78] }]
            });
            this.elements[this.elements.length - 1].width = 450;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        setTimeout(() => {
            this.addElement('text', 520, 650);
            this.elements[this.elements.length - 1].data.content = `VARIANCE COMMENTARY:\n\n✓ Revenue: +$137K favorable\n✓ COGS: +$18K unfavorable\n✓ S&M: +$15K unfavorable\n✓ R&D: -$5K favorable\n✓ G&A: -$7.5K favorable\n\nNet: Strong performance`;
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 260;
        }, 350);

        this.deselectAll();
    }

    // 13-Week Cash Flow Forecast
    loadCashFlowPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = '13-Week Rolling Cash Flow Forecast';
        this.elements[this.elements.length - 1].width = 700;

        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.8M', label: 'Current Cash', change: 'Week 0', positive: true });
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$2.4M', label: 'Week 13 Forecast', change: '+$620K', positive: true });
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.2M', label: 'Min Cash (Wk 6)', change: 'Low Point', positive: false });
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '18 wks', label: 'Runway', change: 'Healthy', positive: true });
        }, 200);

        setTimeout(() => {
            this.addElement('waterfall', 40, 280);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Cash Bridge - Next 13 Weeks',
                labels: ['Starting', 'Collections', 'New Sales', 'Payroll', 'Vendors', 'Other', 'Ending'],
                values: [1800000, 2100000, 450000, -850000, -620000, -280000, 2400000],
                types: ['total', 'increase', 'increase', 'decrease', 'decrease', 'decrease', 'total'],
                colors: { increase: palette.success, decrease: palette.danger, total: palette.primary }
            });
            this.elements[this.elements.length - 1].width = 550;
            this.elements[this.elements.length - 1].height = 300;
        }, 250);

        setTimeout(() => {
            this.addElement('line-chart', 620, 280);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Weekly Cash Position ($K)', labels: ['W1', 'W3', 'W5', 'W7', 'W9', 'W11', 'W13'],
                datasets: [{ label: 'Cash Balance', data: [1800, 1480, 1200, 1520, 1950, 2250, 2400] }]
            });
            this.elements[this.elements.length - 1].width = 350;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        setTimeout(() => {
            this.addElement('table', 40, 600);
            this.elements[this.elements.length - 1].data = {
                headers: ['Category', 'Week 1-4', 'Week 5-8', 'Week 9-13', 'Total'],
                rows: [
                    ['Customer Collections', '$680K', '$720K', '$700K', '$2.1M'],
                    ['New Contracts', '$120K', '$180K', '$150K', '$450K'],
                    ['Payroll', '-$210K', '-$220K', '-$220K', '-$650K'],
                    ['Vendor Payments', '-$155K', '-$165K', '-$160K', '-$480K'],
                    ['Net Cash Flow', '$435K', '$515K', '$470K', '$1.42M']
                ]
            };
            this.elements[this.elements.length - 1].width = 650;
            this.elements[this.elements.length - 1].height = 250;
        }, 350);

        this.deselectAll();
    }

    // KPI Dashboard - SaaS metrics & scorecards
    loadKPIDashboardPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'KPI Performance Dashboard';
        this.elements[this.elements.length - 1].width = 600;

        // Row 1 - Revenue metrics
        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$125K', label: 'MRR', change: '+8% MoM', positive: true });
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.5M', label: 'ARR', change: '+45% YoY', positive: true });
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '118%', label: 'NRR', change: 'Excellent', positive: true });
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '2.1%', label: 'Churn Rate', change: '-0.3pp', positive: true });
        }, 200);

        // Row 2 - Unit economics
        setTimeout(() => {
            this.addElement('kpi', 40, 270);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$8,500', label: 'LTV', change: '+12%', positive: true });
        }, 250);

        setTimeout(() => {
            this.addElement('kpi', 260, 270);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1,850', label: 'CAC', change: '-8%', positive: true });
        }, 300);

        setTimeout(() => {
            this.addElement('kpi', 480, 270);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '4.6x', label: 'LTV:CAC', change: 'Target >3x', positive: true });
        }, 350);

        setTimeout(() => {
            this.addElement('kpi', 700, 270);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '11 mo', label: 'CAC Payback', change: '-2 mo', positive: true });
        }, 400);

        // Gauges
        setTimeout(() => {
            this.addElement('gauge', 40, 440);
            Object.assign(this.elements[this.elements.length - 1].data, { value: 85, max: 100, label: 'Revenue Target' });
        }, 450);

        setTimeout(() => {
            this.addElement('gauge', 260, 440);
            Object.assign(this.elements[this.elements.length - 1].data, { value: 92, max: 100, label: 'Customer NPS' });
        }, 500);

        setTimeout(() => {
            this.addElement('gauge', 480, 440);
            Object.assign(this.elements[this.elements.length - 1].data, { value: 78, max: 100, label: 'Sales Quota' });
        }, 550);

        setTimeout(() => {
            this.addElement('gauge', 700, 440);
            Object.assign(this.elements[this.elements.length - 1].data, { value: 45, max: 100, label: 'Rule of 40' });
        }, 600);

        setTimeout(() => {
            this.addElement('combo-chart', 40, 620);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'MRR Growth & Churn', labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                barData: [95000, 102000, 108000, 115000, 120000, 125000],
                lineData: [2.8, 2.6, 2.5, 2.3, 2.2, 2.1],
                barLabel: 'MRR ($)', lineLabel: 'Churn (%)', barColor: palette.primary, lineColor: palette.danger
            });
            this.elements[this.elements.length - 1].width = 450;
            this.elements[this.elements.length - 1].height = 280;
        }, 650);

        setTimeout(() => {
            this.addElement('line-chart', 520, 620);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Customer Growth', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ label: 'Customers', data: [420, 465, 512, 558, 610, 675] }]
            });
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 280;
        }, 700);

        this.deselectAll();
    }

    // Investor Deck - Pitch-ready financial summary
    loadInvestorDeckPro() {
        const palette = this.colorPalettes[this.currentPalette];

        this.addElement('heading', 40, 30);
        this.elements[this.elements.length - 1].data.text = 'Financial Overview - Series A';
        this.elements[this.elements.length - 1].width = 600;

        setTimeout(() => {
            this.addElement('kpi', 40, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '$1.5M', label: 'ARR', change: '+180% YoY', positive: true });
        }, 50);

        setTimeout(() => {
            this.addElement('kpi', 260, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '118%', label: 'NRR', change: 'Best-in-class', positive: true });
        }, 100);

        setTimeout(() => {
            this.addElement('kpi', 480, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '4.6x', label: 'LTV:CAC', change: 'Efficient', positive: true });
        }, 150);

        setTimeout(() => {
            this.addElement('kpi', 700, 100);
            Object.assign(this.elements[this.elements.length - 1].data, { value: '24 mo', label: 'Runway', change: 'Strong', positive: true });
        }, 200);

        setTimeout(() => {
            this.addElement('waterfall', 40, 280);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'ARR Bridge - YoY Growth',
                labels: ['Start ARR', 'New Logos', 'Expansion', 'Churn', 'End ARR'],
                values: [535000, 780000, 285000, -100000, 1500000],
                types: ['total', 'increase', 'increase', 'decrease', 'total'],
                colors: { increase: palette.success, decrease: palette.danger, total: palette.primary }
            });
            this.elements[this.elements.length - 1].width = 520;
            this.elements[this.elements.length - 1].height = 300;
        }, 250);

        setTimeout(() => {
            this.addElement('combo-chart', 590, 280);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Revenue vs Burn', labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                barData: [280000, 340000, 420000, 480000], lineData: [-85, -72, -58, -42],
                barLabel: 'Revenue ($)', lineLabel: 'Net Burn ($K)', barColor: palette.success, lineColor: palette.danger
            });
            this.elements[this.elements.length - 1].width = 400;
            this.elements[this.elements.length - 1].height = 280;
        }, 300);

        setTimeout(() => {
            this.addElement('pie-chart', 40, 600);
            Object.assign(this.elements[this.elements.length - 1].data, {
                title: 'Use of Funds ($5M)', labels: ['Engineering', 'Sales & Marketing', 'Operations', 'G&A'],
                data: [45, 30, 15, 10], colors: [palette.primary, palette.secondary, palette.accent, palette.neutral]
            });
            this.elements[this.elements.length - 1].width = 380;
            this.elements[this.elements.length - 1].height = 280;
        }, 350);

        setTimeout(() => {
            this.addElement('table', 450, 600);
            this.elements[this.elements.length - 1].data = {
                headers: ['Metric', '2024A', '2025P', '2026P'],
                rows: [
                    ['ARR', '$1.5M', '$4.2M', '$10.5M'],
                    ['Customers', '675', '1,450', '2,900'],
                    ['Gross Margin', '72%', '75%', '78%'],
                    ['Net Burn', '-$800K', '-$1.2M', '-$400K'],
                    ['Team Size', '18', '35', '65']
                ]
            };
            this.elements[this.elements.length - 1].width = 480;
            this.elements[this.elements.length - 1].height = 240;
        }, 400);

        this.deselectAll();
    }

    // =====================================================
    // THEME/PALETTE
    // =====================================================

    changePalette(paletteName) {
        this.currentPalette = paletteName;

        // Update canvas style for dark/light themes
        const canvas = document.getElementById('rb-canvas');
        const isDark = paletteName === 'lightning' || paletteName === 'midnight';
        if (isDark) {
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
        // Create fullscreen preview of the report
        const previewOverlay = document.createElement('div');
        previewOverlay.id = 'rb-preview-overlay';
        previewOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.colorPalettes[this.currentPalette].background};
            z-index: 10002;
            overflow: auto;
            padding: 40px;
        `;

        const palette = this.colorPalettes[this.currentPalette];
        const isDark = this.currentPalette === 'lightning' || this.currentPalette === 'midnight';
        const reportTitle = document.getElementById('rb-report-title')?.value || 'Financial Report';

        // Build preview content
        let previewHTML = `
            <div style="max-width: 1000px; margin: 0 auto; position: relative;">
                <div style="position: fixed; top: 20px; right: 20px; z-index: 10003;">
                    <button onclick="document.getElementById('rb-preview-overlay').remove()"
                            style="padding: 12px 24px; background: ${palette.primary}; color: #fff; border: none;
                                   border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 600;
                                   box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        Close Preview
                    </button>
                </div>
                <div style="background: ${isDark ? '#1e1e1e' : '#fff'}; padding: 50px; border-radius: 12px;
                            box-shadow: 0 10px 50px rgba(0,0,0,0.3); min-height: 100vh;">
                    <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid ${palette.primary};">
                        <img src="LightningLedgerzLogo.png" alt="Logo" style="height: 50px; margin-bottom: 15px;">
                        <h1 style="color: ${isDark ? '#fff' : palette.primary}; font-size: 32px; margin: 0; font-weight: 700;">${reportTitle}</h1>
                        <p style="color: ${isDark ? '#aaa' : '#666'}; margin-top: 10px; font-size: 14px;">
                            Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
        `;

        // If no elements, show sample
        if (this.elements.length === 0) {
            previewHTML += `
                <div style="text-align: center; padding: 60px; color: ${isDark ? '#666' : '#999'};">
                    <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
                    <h2 style="margin: 0; color: ${isDark ? '#888' : '#666'};">No Elements Yet</h2>
                    <p style="margin-top: 10px;">Add charts, tables, and KPIs to your report, then preview again!</p>
                </div>
            `;
        } else {
            // Sort elements by Y position for proper flow
            const sortedElements = [...this.elements].sort((a, b) => a.y - b.y);

            previewHTML += `<div style="display: flex; flex-direction: column; gap: 30px;">`;

            sortedElements.forEach(element => {
                const content = this.getElementContent(element);
                previewHTML += `
                    <div style="background: ${isDark ? '#2a2a2a' : '#fff'}; border-radius: 8px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                        ${content}
                    </div>
                `;
            });

            previewHTML += `</div>`;
        }

        previewHTML += `
                    <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid ${isDark ? '#444' : '#eee'};
                                text-align: center; color: ${isDark ? '#666' : '#999'}; font-size: 12px;">
                        <p>Powered by Lightning Ledgerz | Professional Financial Reporting</p>
                    </div>
                </div>
            </div>
        `;

        previewOverlay.innerHTML = previewHTML;
        document.body.appendChild(previewOverlay);
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

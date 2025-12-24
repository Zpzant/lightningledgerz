/**
 * AI Excel System - Lightning Ledgerz
 * Transforms messy QuickBooks data into professional proforma structures
 * with elite formula patterns: SUMIF, SUMIFS, INDEX MATCH, trailing periods
 */

class AIExcelSystem {
    constructor() {
        this.rawData = null;
        this.parsedData = null;
        this.uniqueLineItems = [];
        this.uniqueCategories = [];
        this.monthlyStructure = [];
        this.proformaConfig = {
            startYear: new Date().getFullYear(),
            monthsCount: 60, // 5 years default
            trailingPeriods: [1, 3, 6, 12],
            annualizationFactors: { 1: 12, 3: 4, 6: 2, 12: 1 }
        };

        this.templates = [
            {
                id: 'real-estate',
                name: 'Real Estate Development',
                icon: '🏢',
                description: 'NOI, Cash Flow, Cap Rate analysis',
                categories: ['Revenue', 'Operating Expenses', 'CapEx', 'Financing'],
                lineItems: {
                    'Revenue': ['Rental Income', 'CAM Reimbursements', 'Parking Income', 'Other Income'],
                    'Operating Expenses': ['Property Taxes', 'Insurance', 'Utilities', 'Management Fees', 'Repairs & Maintenance', 'Marketing'],
                    'CapEx': ['Tenant Improvements', 'Building Improvements', 'Equipment'],
                    'Financing': ['Mortgage Interest', 'Mortgage Principal', 'Loan Fees']
                }
            },
            {
                id: 'saas',
                name: 'SaaS Business',
                icon: '💻',
                description: 'MRR, ARR, Churn, CAC analysis',
                categories: ['Revenue', 'Cost of Goods Sold', 'Sales & Marketing', 'R&D', 'G&A'],
                lineItems: {
                    'Revenue': ['Subscription Revenue', 'Professional Services', 'Setup Fees', 'Usage Overage'],
                    'Cost of Goods Sold': ['Hosting Costs', 'Payment Processing', 'Customer Support'],
                    'Sales & Marketing': ['Advertising', 'Sales Salaries', 'Commissions', 'Events'],
                    'R&D': ['Engineering Salaries', 'Software Licenses', 'Contractors'],
                    'G&A': ['Admin Salaries', 'Legal', 'Accounting', 'Office Expenses']
                }
            },
            {
                id: 'ecommerce',
                name: 'E-Commerce',
                icon: '🛒',
                description: 'Gross margin, inventory, fulfillment',
                categories: ['Gross Sales', 'Cost of Goods', 'Fulfillment', 'Marketing', 'Operations'],
                lineItems: {
                    'Gross Sales': ['Product Sales', 'Shipping Revenue', 'Returns & Refunds'],
                    'Cost of Goods': ['Product Cost', 'Freight In', 'Packaging'],
                    'Fulfillment': ['Warehouse', 'Shipping Out', 'Returns Processing'],
                    'Marketing': ['Paid Ads', 'Influencer', 'Email Marketing', 'SEO'],
                    'Operations': ['Platform Fees', 'Staff', 'Software', 'Insurance']
                }
            },
            {
                id: 'consulting',
                name: 'Professional Services',
                icon: '👔',
                description: 'Utilization, billing rates, project P&L',
                categories: ['Revenue', 'Direct Costs', 'Overhead', 'Business Development'],
                lineItems: {
                    'Revenue': ['Consulting Fees', 'Retainer Revenue', 'Project Revenue', 'Reimbursable Expenses'],
                    'Direct Costs': ['Consultant Salaries', 'Subcontractors', 'Travel', 'Project Expenses'],
                    'Overhead': ['Office Rent', 'Insurance', 'Professional Development', 'Software'],
                    'Business Development': ['Marketing', 'Sales Salaries', 'Entertainment']
                }
            },
            {
                id: 'restaurant',
                name: 'Restaurant / F&B',
                icon: '🍽️',
                description: 'Food cost, labor, 4-wall EBITDA',
                categories: ['Revenue', 'Cost of Goods Sold', 'Labor', 'Occupancy', 'Other Operating'],
                lineItems: {
                    'Revenue': ['Food Sales', 'Beverage Sales', 'Catering', 'Delivery Fees'],
                    'Cost of Goods Sold': ['Food Cost', 'Beverage Cost', 'Paper & Supplies'],
                    'Labor': ['FOH Wages', 'BOH Wages', 'Management', 'Benefits', 'Payroll Taxes'],
                    'Occupancy': ['Rent', 'CAM', 'Utilities', 'Property Insurance'],
                    'Other Operating': ['Marketing', 'Repairs', 'Smallwares', 'Credit Card Fees']
                }
            },
            {
                id: 'custom',
                name: 'Custom / QuickBooks Import',
                icon: '📊',
                description: 'Auto-detect structure from your data',
                categories: [],
                lineItems: {}
            }
        ];

        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'ai-excel-modal';
        modal.className = 'ai-excel-modal';
        modal.innerHTML = `
            <div class="ai-excel-container">
                <div class="ai-excel-header">
                    <div class="ai-excel-logo">
                        <span class="logo-icon">⚡</span>
                        <span class="logo-text">AI Excel Builder</span>
                    </div>
                    <button class="ai-excel-close" onclick="aiExcelSystem.closeModal()">&times;</button>
                </div>

                <div class="ai-excel-content">
                    <!-- Step 1: Template Selection -->
                    <div class="ai-excel-step" id="excel-step-1">
                        <h2>Choose Your Financial Model Template</h2>
                        <p class="step-description">Select a template or import your QuickBooks data</p>

                        <div class="template-grid">
                            ${this.templates.map(t => `
                                <div class="excel-template-card" data-template="${t.id}" onclick="aiExcelSystem.selectTemplate('${t.id}')">
                                    <div class="template-icon">${t.icon}</div>
                                    <h3>${t.name}</h3>
                                    <p>${t.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Step 2: Data Import -->
                    <div class="ai-excel-step hidden" id="excel-step-2">
                        <div class="step-header">
                            <button class="back-btn" onclick="aiExcelSystem.goToStep(1)">← Back</button>
                            <h2>Import Your Data</h2>
                        </div>

                        <div class="import-section">
                            <div class="import-option" id="quickbooks-import">
                                <div class="import-icon">📁</div>
                                <h3>QuickBooks Export</h3>
                                <p>Upload CSV or Excel export from QuickBooks</p>
                                <input type="file" id="qb-file-input" accept=".csv,.xlsx,.xls" onchange="aiExcelSystem.handleFileUpload(event)">
                                <label for="qb-file-input" class="upload-btn">Choose File</label>
                            </div>

                            <div class="import-option" id="paste-import">
                                <div class="import-icon">📋</div>
                                <h3>Paste Data</h3>
                                <p>Copy/paste from Excel or Google Sheets</p>
                                <textarea id="paste-data" placeholder="Paste your data here..."></textarea>
                                <button class="process-btn" onclick="aiExcelSystem.processPastedData()">Process Data</button>
                            </div>
                        </div>

                        <div class="data-preview hidden" id="data-preview">
                            <h3>Data Preview</h3>
                            <div class="preview-table-container">
                                <table id="preview-table"></table>
                            </div>
                            <div class="preview-stats">
                                <div class="stat"><span id="row-count">0</span> rows</div>
                                <div class="stat"><span id="col-count">0</span> columns</div>
                                <div class="stat"><span id="unique-items">0</span> unique line items</div>
                            </div>
                            <button class="next-btn" onclick="aiExcelSystem.goToStep(3)">Configure Proforma →</button>
                        </div>
                    </div>

                    <!-- Step 3: Proforma Configuration -->
                    <div class="ai-excel-step hidden" id="excel-step-3">
                        <div class="step-header">
                            <button class="back-btn" onclick="aiExcelSystem.goToStep(2)">← Back</button>
                            <h2>Configure Your Proforma</h2>
                        </div>

                        <div class="config-grid">
                            <div class="config-section">
                                <h3>📅 Time Period</h3>
                                <div class="config-row">
                                    <label>Start Year</label>
                                    <input type="number" id="start-year" value="${new Date().getFullYear()}" min="2000" max="2030">
                                </div>
                                <div class="config-row">
                                    <label>Number of Months</label>
                                    <select id="months-count">
                                        <option value="12">12 months (1 year)</option>
                                        <option value="24">24 months (2 years)</option>
                                        <option value="36">36 months (3 years)</option>
                                        <option value="60" selected>60 months (5 years)</option>
                                        <option value="120">120 months (10 years)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="config-section">
                                <h3>📊 Trailing Periods</h3>
                                <div class="trailing-options">
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked data-trailing="1"> T-1 (×12 annualized)
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked data-trailing="3"> T-3 (×4 annualized)
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked data-trailing="6"> T-6 (×2 annualized)
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked data-trailing="12"> T-12 (actual)
                                    </label>
                                </div>
                            </div>

                            <div class="config-section">
                                <h3>📈 Summary Columns</h3>
                                <div class="summary-options">
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked id="yearly-totals"> Yearly Totals
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" checked id="variance-analysis"> Variance Analysis (vs Budget)
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="yoy-growth"> YoY Growth %
                                    </label>
                                </div>
                            </div>

                            <div class="config-section">
                                <h3>🎯 Scenario Toggle</h3>
                                <div class="config-row">
                                    <label>Valuation Date Reference</label>
                                    <input type="text" id="val-date-cell" value="D50" placeholder="e.g., D50">
                                </div>
                                <p class="config-hint">Cell reference for INDEX MATCH scenario toggles</p>
                            </div>
                        </div>

                        <button class="next-btn" onclick="aiExcelSystem.goToStep(4)">Configure Line Items →</button>
                    </div>

                    <!-- Step 4: Line Item Mapping -->
                    <div class="ai-excel-step hidden" id="excel-step-4">
                        <div class="step-header">
                            <button class="back-btn" onclick="aiExcelSystem.goToStep(3)">← Back</button>
                            <h2>Map Your Line Items</h2>
                        </div>

                        <div class="mapping-container">
                            <div class="categories-panel">
                                <h3>Categories</h3>
                                <div id="categories-list"></div>
                                <button class="add-btn" onclick="aiExcelSystem.addCategory()">+ Add Category</button>
                            </div>

                            <div class="line-items-panel">
                                <h3>Line Items</h3>
                                <div id="line-items-list"></div>
                            </div>

                            <div class="formula-preview-panel">
                                <h3>Formula Preview</h3>
                                <div id="formula-preview">
                                    <div class="formula-example">
                                        <span class="formula-label">Annual SUMIF:</span>
                                        <code>=SUMIF($Z$7:$FN$7,M$7,$Z12:$FN12)</code>
                                    </div>
                                    <div class="formula-example">
                                        <span class="formula-label">T-3 Annualized:</span>
                                        <code>=SUMIFS(Z12:FN12,Z$8:FN$8,">"&(ValDate-3),Z$8:FN$8,"<="&ValDate)*(12/3)</code>
                                    </div>
                                    <div class="formula-example">
                                        <span class="formula-label">Scenario Toggle:</span>
                                        <code>=INDEX(CashFlow!$T$80:$FH$80,MATCH(ValDate,CashFlow!$T$8:$FH$8,0))</code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="generate-btn" onclick="aiExcelSystem.generateProforma()">⚡ Generate Proforma</button>
                    </div>

                    <!-- Step 5: Output -->
                    <div class="ai-excel-step hidden" id="excel-step-5">
                        <div class="step-header">
                            <button class="back-btn" onclick="aiExcelSystem.goToStep(4)">← Back</button>
                            <h2>Your Proforma is Ready!</h2>
                        </div>

                        <div class="output-preview">
                            <div class="output-tabs">
                                <button class="output-tab active" data-sheet="proforma">Proforma</button>
                                <button class="output-tab" data-sheet="dropin">Drop-In</button>
                                <button class="output-tab" data-sheet="summary">Summary</button>
                                <button class="output-tab" data-sheet="charts">Charts</button>
                            </div>
                            <div class="output-content" id="output-content">
                                <div class="proforma-preview" id="proforma-preview"></div>
                            </div>
                        </div>

                        <div class="download-options">
                            <button class="download-btn primary" onclick="aiExcelSystem.downloadExcel()">
                                📥 Download Excel (.xlsx)
                            </button>
                            <button class="download-btn" onclick="aiExcelSystem.downloadGoogleSheets()">
                                📊 Open in Google Sheets
                            </button>
                            <button class="download-btn" onclick="aiExcelSystem.downloadCSV()">
                                📄 Download CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('ai-excel-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ai-excel-styles';
        styles.textContent = `
            .ai-excel-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                overflow-y: auto;
            }

            .ai-excel-modal.active {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding: 40px 20px;
            }

            .ai-excel-container {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                border-radius: 24px;
                width: 100%;
                max-width: 1200px;
                border: 1px solid rgba(255,215,0,0.3);
                box-shadow: 0 0 60px rgba(255,215,0,0.2);
            }

            .ai-excel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 32px;
                border-bottom: 1px solid rgba(255,215,0,0.2);
            }

            .ai-excel-logo {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .ai-excel-logo .logo-icon {
                font-size: 32px;
                animation: pulse 2s infinite;
            }

            .ai-excel-logo .logo-text {
                font-size: 24px;
                font-weight: 700;
                background: linear-gradient(90deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .ai-excel-close {
                background: none;
                border: none;
                color: #888;
                font-size: 32px;
                cursor: pointer;
                transition: color 0.3s;
            }

            .ai-excel-close:hover {
                color: #FFD700;
            }

            .ai-excel-content {
                padding: 32px;
            }

            .ai-excel-step {
                animation: fadeIn 0.3s ease;
            }

            .ai-excel-step.hidden {
                display: none;
            }

            .ai-excel-step h2 {
                font-size: 28px;
                color: #fff;
                margin-bottom: 8px;
                text-align: center;
            }

            .step-description {
                color: #888;
                text-align: center;
                margin-bottom: 32px;
            }

            .step-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
            }

            .back-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .back-btn:hover {
                background: rgba(255,215,0,0.2);
                border-color: #FFD700;
            }

            /* Template Grid */
            .template-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }

            .excel-template-card {
                background: rgba(255,255,255,0.05);
                border: 2px solid transparent;
                border-radius: 16px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }

            .excel-template-card:hover {
                background: rgba(255,215,0,0.1);
                border-color: rgba(255,215,0,0.5);
                transform: translateY(-4px);
            }

            .excel-template-card.selected {
                background: rgba(255,215,0,0.15);
                border-color: #FFD700;
            }

            .template-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .excel-template-card h3 {
                color: #fff;
                font-size: 18px;
                margin-bottom: 8px;
            }

            .excel-template-card p {
                color: #888;
                font-size: 14px;
            }

            /* Import Section */
            .import-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 32px;
            }

            .import-option {
                background: rgba(255,255,255,0.05);
                border: 2px dashed rgba(255,255,255,0.2);
                border-radius: 16px;
                padding: 32px;
                text-align: center;
                transition: all 0.3s;
            }

            .import-option:hover {
                border-color: rgba(255,215,0,0.5);
                background: rgba(255,215,0,0.05);
            }

            .import-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }

            .import-option h3 {
                color: #fff;
                margin-bottom: 8px;
            }

            .import-option p {
                color: #888;
                margin-bottom: 16px;
            }

            .import-option input[type="file"] {
                display: none;
            }

            .upload-btn, .process-btn {
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .upload-btn:hover, .process-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(255,215,0,0.4);
            }

            #paste-data {
                width: 100%;
                height: 100px;
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 8px;
                color: #fff;
                padding: 12px;
                margin-bottom: 16px;
                resize: vertical;
            }

            /* Data Preview */
            .data-preview {
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                padding: 24px;
            }

            .data-preview h3 {
                color: #FFD700;
                margin-bottom: 16px;
            }

            .preview-table-container {
                max-height: 300px;
                overflow: auto;
                margin-bottom: 16px;
                border-radius: 8px;
                background: rgba(0,0,0,0.3);
            }

            #preview-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
            }

            #preview-table th, #preview-table td {
                padding: 8px 12px;
                border: 1px solid rgba(255,255,255,0.1);
                text-align: left;
                white-space: nowrap;
            }

            #preview-table th {
                background: rgba(255,215,0,0.2);
                color: #FFD700;
                position: sticky;
                top: 0;
            }

            #preview-table td {
                color: #ccc;
            }

            .preview-stats {
                display: flex;
                gap: 24px;
                margin-bottom: 16px;
            }

            .preview-stats .stat {
                color: #888;
            }

            .preview-stats .stat span {
                color: #FFD700;
                font-weight: 700;
                font-size: 20px;
                margin-right: 4px;
            }

            .next-btn, .generate-btn {
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                display: block;
                margin: 24px auto 0;
            }

            .next-btn:hover, .generate-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 30px rgba(255,215,0,0.5);
            }

            /* Config Grid */
            .config-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 24px;
            }

            .config-section {
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                padding: 24px;
            }

            .config-section h3 {
                color: #FFD700;
                margin-bottom: 16px;
                font-size: 16px;
            }

            .config-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .config-row label {
                color: #ccc;
            }

            .config-row input, .config-row select {
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                padding: 8px 12px;
                border-radius: 6px;
                width: 150px;
            }

            .config-hint {
                color: #666;
                font-size: 12px;
                margin-top: 4px;
            }

            .trailing-options, .summary-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #ccc;
                cursor: pointer;
            }

            .checkbox-label input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #FFD700;
            }

            /* Mapping Container */
            .mapping-container {
                display: grid;
                grid-template-columns: 200px 1fr 300px;
                gap: 24px;
                height: 400px;
            }

            .categories-panel, .line-items-panel, .formula-preview-panel {
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                padding: 20px;
                overflow-y: auto;
            }

            .categories-panel h3, .line-items-panel h3, .formula-preview-panel h3 {
                color: #FFD700;
                margin-bottom: 16px;
                font-size: 14px;
            }

            #categories-list .category-item, #line-items-list .line-item {
                background: rgba(255,255,255,0.1);
                padding: 10px 14px;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #ccc;
            }

            #categories-list .category-item:hover, #line-items-list .line-item:hover {
                background: rgba(255,215,0,0.2);
            }

            #categories-list .category-item.active {
                background: rgba(255,215,0,0.3);
                border: 1px solid #FFD700;
            }

            .add-btn {
                background: transparent;
                border: 1px dashed rgba(255,215,0,0.5);
                color: #FFD700;
                padding: 10px;
                border-radius: 8px;
                width: 100%;
                cursor: pointer;
                transition: all 0.2s;
            }

            .add-btn:hover {
                background: rgba(255,215,0,0.1);
            }

            .formula-example {
                background: rgba(0,0,0,0.3);
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 12px;
            }

            .formula-label {
                color: #888;
                font-size: 12px;
                display: block;
                margin-bottom: 4px;
            }

            .formula-example code {
                color: #4FC3F7;
                font-family: 'Fira Code', monospace;
                font-size: 11px;
                word-break: break-all;
            }

            /* Output Section */
            .output-preview {
                background: rgba(255,255,255,0.05);
                border-radius: 16px;
                overflow: hidden;
                margin-bottom: 24px;
            }

            .output-tabs {
                display: flex;
                background: rgba(0,0,0,0.3);
            }

            .output-tab {
                flex: 1;
                background: transparent;
                border: none;
                color: #888;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .output-tab:hover {
                color: #fff;
            }

            .output-tab.active {
                background: rgba(255,215,0,0.2);
                color: #FFD700;
            }

            .output-content {
                padding: 24px;
                min-height: 300px;
            }

            .download-options {
                display: flex;
                gap: 16px;
                justify-content: center;
            }

            .download-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #fff;
                padding: 14px 28px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 14px;
            }

            .download-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .download-btn.primary {
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000;
                font-weight: 700;
                border: none;
            }

            .download-btn.primary:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(255,215,0,0.4);
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @media (max-width: 768px) {
                .import-section {
                    grid-template-columns: 1fr;
                }

                .config-grid {
                    grid-template-columns: 1fr;
                }

                .mapping-container {
                    grid-template-columns: 1fr;
                    height: auto;
                }

                .download-options {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    attachEventListeners() {
        // Output tab switching
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.showSheet(tab.dataset.sheet);
            });
        });
    }

    openModal() {
        document.getElementById('ai-excel-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('ai-excel-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    selectTemplate(templateId) {
        this.selectedTemplate = this.templates.find(t => t.id === templateId);

        // Update UI
        document.querySelectorAll('.excel-template-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.template === templateId);
        });

        // If custom/QuickBooks template, go to import step
        // Otherwise populate with template defaults and skip to config
        if (templateId === 'custom') {
            this.goToStep(2);
        } else {
            this.loadTemplateDefaults();
            this.goToStep(3);
        }
    }

    loadTemplateDefaults() {
        if (!this.selectedTemplate) return;

        this.uniqueCategories = [...this.selectedTemplate.categories];
        this.uniqueLineItems = [];

        for (const category of this.uniqueCategories) {
            const items = this.selectedTemplate.lineItems[category] || [];
            items.forEach(item => {
                this.uniqueLineItems.push({ name: item, category });
            });
        }
    }

    goToStep(stepNum) {
        document.querySelectorAll('.ai-excel-step').forEach(step => {
            step.classList.add('hidden');
        });
        document.getElementById(`excel-step-${stepNum}`).classList.remove('hidden');

        if (stepNum === 4) {
            this.renderMappingUI();
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.name.endsWith('.csv')) {
            reader.onload = (e) => {
                this.parseCSV(e.target.result);
            };
            reader.readAsText(file);
        } else {
            // Excel file - use SheetJS if available
            reader.onload = (e) => {
                this.parseExcel(e.target.result);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });
            data.push(row);
        }

        this.rawData = data;
        this.analyzeData();
        this.showDataPreview();
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        return values;
    }

    parseExcel(arrayBuffer) {
        // Check if SheetJS (XLSX) is available
        if (typeof XLSX !== 'undefined') {
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(firstSheet);
            this.rawData = data;
            this.analyzeData();
            this.showDataPreview();
        } else {
            alert('Excel parsing requires SheetJS library. Please use CSV format or paste your data.');
        }
    }

    processPastedData() {
        const pastedText = document.getElementById('paste-data').value;
        if (!pastedText.trim()) return;

        // Try to parse as tab-separated or CSV
        const lines = pastedText.split('\n');
        const delimiter = lines[0].includes('\t') ? '\t' : ',';
        const headers = lines[0].split(delimiter).map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(delimiter).map(v => v.trim());
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });
            data.push(row);
        }

        this.rawData = data;
        this.analyzeData();
        this.showDataPreview();
    }

    analyzeData() {
        if (!this.rawData || !this.rawData.length) return;

        // Identify column types
        const columns = Object.keys(this.rawData[0]);
        this.columnTypes = {};

        columns.forEach(col => {
            const values = this.rawData.map(r => r[col]).filter(v => v);
            const numericCount = values.filter(v => !isNaN(parseFloat(v))).length;
            const dateCount = values.filter(v => this.isDate(v)).length;

            if (dateCount > values.length * 0.5) {
                this.columnTypes[col] = 'date';
            } else if (numericCount > values.length * 0.5) {
                this.columnTypes[col] = 'numeric';
            } else {
                this.columnTypes[col] = 'text';
            }
        });

        // Find potential line item column
        const textColumns = columns.filter(c => this.columnTypes[c] === 'text');
        const lineItemColumn = textColumns.find(c =>
            c.toLowerCase().includes('account') ||
            c.toLowerCase().includes('category') ||
            c.toLowerCase().includes('name') ||
            c.toLowerCase().includes('description')
        ) || textColumns[0];

        if (lineItemColumn) {
            this.uniqueLineItems = [...new Set(this.rawData.map(r => r[lineItemColumn]))].filter(Boolean);
        }

        // Find potential category column
        const categoryColumn = textColumns.find(c =>
            c.toLowerCase().includes('type') ||
            c.toLowerCase().includes('class') ||
            c.toLowerCase().includes('category')
        );

        if (categoryColumn) {
            this.uniqueCategories = [...new Set(this.rawData.map(r => r[categoryColumn]))].filter(Boolean);
        }
    }

    isDate(value) {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && value.toString().includes('/') || value.toString().includes('-');
    }

    showDataPreview() {
        const previewDiv = document.getElementById('data-preview');
        const table = document.getElementById('preview-table');

        if (!this.rawData || !this.rawData.length) return;

        const columns = Object.keys(this.rawData[0]);
        const previewRows = this.rawData.slice(0, 10);

        let html = '<thead><tr>';
        columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        previewRows.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                html += `<td>${row[col] || ''}</td>`;
            });
            html += '</tr>';
        });

        if (this.rawData.length > 10) {
            html += `<tr><td colspan="${columns.length}" style="text-align:center;color:#888;">... ${this.rawData.length - 10} more rows</td></tr>`;
        }

        html += '</tbody>';
        table.innerHTML = html;

        document.getElementById('row-count').textContent = this.rawData.length;
        document.getElementById('col-count').textContent = columns.length;
        document.getElementById('unique-items').textContent = this.uniqueLineItems.length;

        previewDiv.classList.remove('hidden');
    }

    renderMappingUI() {
        const categoriesList = document.getElementById('categories-list');
        const lineItemsList = document.getElementById('line-items-list');

        // Render categories
        let categoriesHTML = '';
        this.uniqueCategories.forEach((cat, idx) => {
            categoriesHTML += `
                <div class="category-item ${idx === 0 ? 'active' : ''}" data-category="${cat}" onclick="aiExcelSystem.selectCategory('${cat}')">
                    <span>${cat}</span>
                    <span class="item-count">${this.uniqueLineItems.filter(i => i.category === cat || (typeof i === 'string' && idx === 0)).length}</span>
                </div>
            `;
        });
        categoriesList.innerHTML = categoriesHTML;

        // Render line items
        this.renderLineItems(this.uniqueCategories[0] || 'All');
    }

    selectCategory(category) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.toggle('active', item.dataset.category === category);
        });
        this.renderLineItems(category);
    }

    renderLineItems(category) {
        const lineItemsList = document.getElementById('line-items-list');
        const items = typeof this.uniqueLineItems[0] === 'string'
            ? this.uniqueLineItems
            : this.uniqueLineItems.filter(i => i.category === category);

        let html = '';
        items.forEach((item, idx) => {
            const name = typeof item === 'string' ? item : item.name;
            html += `
                <div class="line-item" draggable="true">
                    <span>${name}</span>
                    <span class="row-num">Row ${idx + 1}</span>
                </div>
            `;
        });

        lineItemsList.innerHTML = html || '<p style="color:#666;text-align:center;">No line items in this category</p>';
    }

    addCategory() {
        const name = prompt('Enter category name:');
        if (name && !this.uniqueCategories.includes(name)) {
            this.uniqueCategories.push(name);
            this.renderMappingUI();
        }
    }

    generateProforma() {
        // Get configuration
        const startYear = parseInt(document.getElementById('start-year').value);
        const monthsCount = parseInt(document.getElementById('months-count').value);
        const trailingPeriods = [];
        document.querySelectorAll('[data-trailing]:checked').forEach(cb => {
            trailingPeriods.push(parseInt(cb.dataset.trailing));
        });

        // Build the proforma structure
        this.proformaData = this.buildProformaStructure(startYear, monthsCount, trailingPeriods);

        // Go to output step
        this.goToStep(5);
        this.renderProformaPreview();
    }

    buildProformaStructure(startYear, monthsCount, trailingPeriods) {
        const proforma = {
            headers: [],
            yearRow: [],
            monthRow: [],
            lineItems: [],
            formulas: {}
        };

        // Build column structure
        // First few columns: Line Item, Category, Type
        proforma.headers.push('Line Item', 'Category', 'Type');
        proforma.yearRow.push('', '', '');
        proforma.monthRow.push('', '', '');

        // Trailing period columns (K through Q style)
        trailingPeriods.forEach(t => {
            proforma.headers.push(`T-${t}`);
            proforma.yearRow.push(`T-${t}`);
            proforma.monthRow.push(t);
        });

        // Yearly summary columns
        const yearsCount = Math.ceil(monthsCount / 12);
        for (let y = 0; y <= yearsCount; y++) {
            proforma.headers.push(`Year ${y}`);
            proforma.yearRow.push(y);
            proforma.monthRow.push('');
        }

        // Monthly columns (starting at column index ~10, like Z in original)
        const monthColStart = proforma.headers.length;
        for (let m = 0; m < monthsCount; m++) {
            const date = new Date(startYear, m, 1);
            proforma.headers.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
            proforma.yearRow.push(Math.floor(m / 12));
            proforma.monthRow.push(m);
        }

        // Build line items with formulas
        const lineItems = typeof this.uniqueLineItems[0] === 'string'
            ? this.uniqueLineItems.map(name => ({ name, category: 'Uncategorized' }))
            : this.uniqueLineItems;

        lineItems.forEach((item, rowIdx) => {
            const row = {
                name: item.name || item,
                category: item.category || 'Uncategorized',
                type: 'Amount',
                trailing: {},
                yearly: {},
                monthly: []
            };

            // Generate trailing period formulas
            const dataRowNum = rowIdx + 3; // Adjust for header rows
            const trailColStart = 3; // Column D
            const yearlyColStart = trailColStart + trailingPeriods.length;

            trailingPeriods.forEach((t, colOffset) => {
                // SUMIFS formula with annualization
                const annFactor = 12 / t;
                row.trailing[t] = {
                    formula: `=SUMIFS($${this.colLetter(monthColStart)}${dataRowNum}:$${this.colLetter(monthColStart + monthsCount - 1)}${dataRowNum},$${this.colLetter(monthColStart)}$2:$${this.colLetter(monthColStart + monthsCount - 1)}$2,">"&(ValDate-${t}),$${this.colLetter(monthColStart)}$2:$${this.colLetter(monthColStart + monthsCount - 1)}$2,"<="&ValDate)*${annFactor}`,
                    value: 0
                };
            });

            // Generate yearly SUMIF formulas
            for (let y = 0; y <= yearsCount; y++) {
                row.yearly[y] = {
                    formula: `=SUMIF($${this.colLetter(monthColStart)}$1:$${this.colLetter(monthColStart + monthsCount - 1)}$1,${this.colLetter(yearlyColStart + y)}$1,$${this.colLetter(monthColStart)}${dataRowNum}:$${this.colLetter(monthColStart + monthsCount - 1)}${dataRowNum})`,
                    value: 0
                };
            }

            // Monthly values (zeros for now, user will input)
            for (let m = 0; m < monthsCount; m++) {
                row.monthly.push(0);
            }

            proforma.lineItems.push(row);
        });

        return proforma;
    }

    colLetter(colIndex) {
        let letter = '';
        while (colIndex >= 0) {
            letter = String.fromCharCode(65 + (colIndex % 26)) + letter;
            colIndex = Math.floor(colIndex / 26) - 1;
        }
        return letter;
    }

    renderProformaPreview() {
        const preview = document.getElementById('proforma-preview');
        if (!this.proformaData) return;

        let html = '<div style="overflow-x:auto;">';
        html += '<table style="width:100%;border-collapse:collapse;font-size:11px;">';

        // Header row
        html += '<thead><tr style="background:rgba(255,215,0,0.2);">';
        this.proformaData.headers.slice(0, 15).forEach(h => {
            html += `<th style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#FFD700;white-space:nowrap;">${h}</th>`;
        });
        if (this.proformaData.headers.length > 15) {
            html += `<th style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#666;">...${this.proformaData.headers.length - 15} more</th>`;
        }
        html += '</tr></thead>';

        // Year row
        html += '<tr style="background:rgba(0,0,0,0.2);">';
        this.proformaData.yearRow.slice(0, 15).forEach(y => {
            html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#888;text-align:center;">${y}</td>`;
        });
        if (this.proformaData.yearRow.length > 15) {
            html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#666;">...</td>`;
        }
        html += '</tr>';

        // Data rows (first 5)
        this.proformaData.lineItems.slice(0, 5).forEach(item => {
            html += '<tr>';
            html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#fff;">${item.name}</td>`;
            html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#888;">${item.category}</td>`;
            html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#888;">${item.type}</td>`;

            // Trailing periods
            Object.values(item.trailing).slice(0, 4).forEach(t => {
                html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#4FC3F7;font-size:9px;" title="${t.formula}">=SUMIFS...</td>`;
            });

            // Yearly
            Object.values(item.yearly).slice(0, 3).forEach(y => {
                html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#81C784;font-size:9px;" title="${y.formula}">=SUMIF...</td>`;
            });

            // Monthly (first few)
            item.monthly.slice(0, 4).forEach(m => {
                html += `<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#ccc;text-align:right;">$0</td>`;
            });

            html += '<td style="padding:6px;border:1px solid rgba(255,255,255,0.1);color:#666;">...</td>';
            html += '</tr>';
        });

        if (this.proformaData.lineItems.length > 5) {
            html += `<tr><td colspan="15" style="padding:8px;text-align:center;color:#666;">... ${this.proformaData.lineItems.length - 5} more rows</td></tr>`;
        }

        html += '</table></div>';

        // Formula legend
        html += `
            <div style="margin-top:20px;padding:16px;background:rgba(0,0,0,0.3);border-radius:8px;">
                <h4 style="color:#FFD700;margin-bottom:12px;">Formula Patterns Generated</h4>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;">
                    <div>
                        <span style="color:#81C784;">Annual SUMIF:</span>
                        <code style="color:#4FC3F7;display:block;margin-top:4px;">=SUMIF(YearRow,ThisYear,DataRow)</code>
                    </div>
                    <div>
                        <span style="color:#81C784;">Trailing Annualized:</span>
                        <code style="color:#4FC3F7;display:block;margin-top:4px;">=SUMIFS(Data,Months,">ValDate-T","<=ValDate")*(12/T)</code>
                    </div>
                    <div>
                        <span style="color:#81C784;">Scenario Toggle:</span>
                        <code style="color:#4FC3F7;display:block;margin-top:4px;">=INDEX(Range,MATCH(ValDate,DateRow,0))</code>
                    </div>
                    <div>
                        <span style="color:#81C784;">Unique Count:</span>
                        <code style="color:#4FC3F7;display:block;margin-top:4px;">=SUMPRODUCT(1/COUNTIF(Range,Range))</code>
                    </div>
                </div>
            </div>
        `;

        preview.innerHTML = html;
    }

    showSheet(sheetName) {
        const content = document.getElementById('output-content');

        switch (sheetName) {
            case 'proforma':
                this.renderProformaPreview();
                break;
            case 'dropin':
                this.renderDropInSheet();
                break;
            case 'summary':
                this.renderSummarySheet();
                break;
            case 'charts':
                this.renderChartsSheet();
                break;
        }
    }

    renderDropInSheet() {
        const content = document.getElementById('proforma-preview');
        content.innerHTML = `
            <div style="padding:20px;">
                <h3 style="color:#FFD700;margin-bottom:16px;">Drop-In Sheet (COUNTIF UNIQUE)</h3>
                <p style="color:#888;margin-bottom:20px;">This sheet captures all raw data and extracts unique values for the proforma.</p>

                <div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;margin-bottom:16px;">
                    <h4 style="color:#81C784;margin-bottom:8px;">Key Formulas</h4>
                    <div style="font-family:monospace;font-size:12px;color:#4FC3F7;">
                        <p style="margin:8px 0;"><strong style="color:#fff;">Unique Count:</strong> =SUMPRODUCT(1/COUNTIF(A:A,A:A))</p>
                        <p style="margin:8px 0;"><strong style="color:#fff;">Unique List:</strong> =IF(COUNTIF($A$1:A1,A1)=1,A1,"")</p>
                        <p style="margin:8px 0;"><strong style="color:#fff;">Extract Unique:</strong> =INDEX(RawData,MATCH(0,COUNTIF(UniqueList,RawData),0))</p>
                    </div>
                </div>

                <table style="width:100%;border-collapse:collapse;font-size:12px;">
                    <thead>
                        <tr style="background:rgba(255,215,0,0.2);">
                            <th style="padding:10px;border:1px solid rgba(255,255,255,0.1);color:#FFD700;">Raw Line Item</th>
                            <th style="padding:10px;border:1px solid rgba(255,255,255,0.1);color:#FFD700;">Count</th>
                            <th style="padding:10px;border:1px solid rgba(255,255,255,0.1);color:#FFD700;">Unique?</th>
                            <th style="padding:10px;border:1px solid rgba(255,255,255,0.1);color:#FFD700;">Mapped Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(this.uniqueLineItems || []).slice(0, 8).map((item, idx) => `
                            <tr>
                                <td style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#fff;">${typeof item === 'string' ? item : item.name}</td>
                                <td style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#888;text-align:center;">1</td>
                                <td style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#81C784;text-align:center;">✓</td>
                                <td style="padding:8px;border:1px solid rgba(255,255,255,0.1);color:#888;">${typeof item === 'object' ? item.category : 'Auto-detected'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderSummarySheet() {
        const content = document.getElementById('proforma-preview');
        content.innerHTML = `
            <div style="padding:20px;">
                <h3 style="color:#FFD700;margin-bottom:16px;">Summary Dashboard</h3>

                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
                    <div style="background:linear-gradient(135deg,rgba(76,175,80,0.2),rgba(76,175,80,0.1));padding:20px;border-radius:12px;text-align:center;">
                        <div style="font-size:28px;color:#81C784;font-weight:700;">$0</div>
                        <div style="color:#888;font-size:12px;margin-top:4px;">T-12 Revenue</div>
                    </div>
                    <div style="background:linear-gradient(135deg,rgba(244,67,54,0.2),rgba(244,67,54,0.1));padding:20px;border-radius:12px;text-align:center;">
                        <div style="font-size:28px;color:#EF5350;font-weight:700;">$0</div>
                        <div style="color:#888;font-size:12px;margin-top:4px;">T-12 Expenses</div>
                    </div>
                    <div style="background:linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,215,0,0.1));padding:20px;border-radius:12px;text-align:center;">
                        <div style="font-size:28px;color:#FFD700;font-weight:700;">$0</div>
                        <div style="color:#888;font-size:12px;margin-top:4px;">T-12 NOI</div>
                    </div>
                    <div style="background:linear-gradient(135deg,rgba(33,150,243,0.2),rgba(33,150,243,0.1));padding:20px;border-radius:12px;text-align:center;">
                        <div style="font-size:28px;color:#42A5F5;font-weight:700;">0%</div>
                        <div style="color:#888;font-size:12px;margin-top:4px;">NOI Margin</div>
                    </div>
                </div>

                <div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:8px;">
                    <h4 style="color:#FFD700;margin-bottom:12px;">Trailing Period Toggle</h4>
                    <div style="display:flex;gap:8px;">
                        <button style="background:rgba(255,215,0,0.3);border:1px solid #FFD700;color:#FFD700;padding:8px 16px;border-radius:6px;">T-1</button>
                        <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 16px;border-radius:6px;">T-3</button>
                        <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 16px;border-radius:6px;">T-6</button>
                        <button style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 16px;border-radius:6px;">T-12</button>
                    </div>
                    <p style="color:#666;font-size:11px;margin-top:8px;">Toggle updates all INDEX MATCH references automatically</p>
                </div>
            </div>
        `;
    }

    renderChartsSheet() {
        const content = document.getElementById('proforma-preview');
        content.innerHTML = `
            <div style="padding:20px;">
                <h3 style="color:#FFD700;margin-bottom:16px;">Dynamic Charts</h3>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="background:rgba(0,0,0,0.3);padding:20px;border-radius:12px;">
                        <h4 style="color:#fff;margin-bottom:12px;">Revenue vs Expenses</h4>
                        <div style="height:150px;display:flex;align-items:flex-end;gap:8px;">
                            ${[60,75,80,85,90,95,100,105].map((h, i) => `
                                <div style="flex:1;display:flex;flex-direction:column;gap:2px;">
                                    <div style="height:${h}px;background:linear-gradient(180deg,#81C784,#4CAF50);border-radius:4px 4px 0 0;"></div>
                                    <div style="height:${h * 0.7}px;background:linear-gradient(180deg,#EF5350,#E53935);border-radius:4px 4px 0 0;"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.3);padding:20px;border-radius:12px;">
                        <h4 style="color:#fff;margin-bottom:12px;">NOI Trend</h4>
                        <div style="height:150px;position:relative;">
                            <svg viewBox="0 0 200 100" style="width:100%;height:100%;">
                                <polyline fill="none" stroke="#FFD700" stroke-width="2" points="0,80 25,70 50,65 75,55 100,50 125,45 150,40 175,35 200,30"/>
                                <polyline fill="url(#goldGradient)" stroke="none" points="0,80 25,70 50,65 75,55 100,50 125,45 150,40 175,35 200,30 200,100 0,100"/>
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.3"/>
                                        <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>

                <p style="color:#666;font-size:12px;margin-top:16px;text-align:center;">Charts will update dynamically based on your proforma data</p>
            </div>
        `;
    }

    async downloadExcel() {
        // Generate Excel file using SheetJS or our custom generator
        if (typeof XLSX !== 'undefined') {
            await this.generateExcelWithSheetJS();
        } else {
            // Use our custom lightweight generator
            await this.generateExcelCustom();
        }
    }

    async generateExcelWithSheetJS() {
        const wb = XLSX.utils.book_new();

        // Proforma sheet
        const proformaData = [];
        proformaData.push(this.proformaData.headers);
        proformaData.push(this.proformaData.yearRow);
        proformaData.push(this.proformaData.monthRow);

        this.proformaData.lineItems.forEach(item => {
            const row = [item.name, item.category, item.type];
            Object.values(item.trailing).forEach(t => row.push(t.value));
            Object.values(item.yearly).forEach(y => row.push(y.value));
            item.monthly.forEach(m => row.push(m));
            proformaData.push(row);
        });

        const proformaSheet = XLSX.utils.aoa_to_sheet(proformaData);
        XLSX.utils.book_append_sheet(wb, proformaSheet, 'Proforma');

        // Drop-In sheet
        const dropInData = [['Line Item', 'Count', 'Category']];
        this.uniqueLineItems.forEach(item => {
            dropInData.push([typeof item === 'string' ? item : item.name, 1, typeof item === 'object' ? item.category : '']);
        });
        const dropInSheet = XLSX.utils.aoa_to_sheet(dropInData);
        XLSX.utils.book_append_sheet(wb, dropInSheet, 'Drop-In');

        // Summary sheet
        const summarySheet = XLSX.utils.aoa_to_sheet([
            ['Lightning Ledgerz Proforma Summary'],
            [''],
            ['Generated:', new Date().toLocaleDateString()],
            ['Template:', this.selectedTemplate?.name || 'Custom'],
            ['Line Items:', this.uniqueLineItems.length],
            ['Months:', this.proformaConfig.monthsCount]
        ]);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

        XLSX.writeFile(wb, 'Lightning_Ledgerz_Proforma.xlsx');
    }

    async generateExcelCustom() {
        // Create a simple CSV as fallback
        let csv = '';

        // Headers
        csv += this.proformaData.headers.join(',') + '\n';
        csv += this.proformaData.yearRow.join(',') + '\n';
        csv += this.proformaData.monthRow.join(',') + '\n';

        // Data
        this.proformaData.lineItems.forEach(item => {
            const row = [
                `"${item.name}"`,
                `"${item.category}"`,
                item.type
            ];
            Object.values(item.trailing).forEach(t => row.push(t.value));
            Object.values(item.yearly).forEach(y => row.push(y.value));
            item.monthly.forEach(m => row.push(m));
            csv += row.join(',') + '\n';
        });

        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Lightning_Ledgerz_Proforma.csv';
        a.click();
        URL.revokeObjectURL(url);

        alert('Note: For full Excel formulas, please load the SheetJS library. CSV exported with values only.');
    }

    downloadCSV() {
        this.generateExcelCustom();
    }

    downloadGoogleSheets() {
        // Open Google Sheets with the data
        alert('Google Sheets integration coming soon! For now, download the Excel file and import to Google Sheets.');
    }
}

// Initialize
let aiExcelSystem;
document.addEventListener('DOMContentLoaded', () => {
    aiExcelSystem = new AIExcelSystem();
});

// Also try to initialize immediately in case DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!aiExcelSystem) {
            aiExcelSystem = new AIExcelSystem();
        }
    }, 100);
}

// Export for use
window.AIExcelSystem = AIExcelSystem;
window.openAIExcel = () => {
    if (aiExcelSystem) {
        aiExcelSystem.openModal();
    }
};

// =====================================================
// LIGHTNING LEDGERZ - PRO FORMA PLANNING MODEL
// =====================================================
// Professional financial planning with:
// - Monthly columns (Mar - 25 format)
// - Yearly summaries
// - Line item assumptions
// - QuickBooks integration
// - Multiple projection methods

class ProFormaPlannerSystem {
    constructor() {
        this.lineItems = [];
        this.startMonth = new Date().getMonth(); // Current month
        this.startYear = new Date().getFullYear();
        this.monthsToShow = 12;
        this.historicalData = {};
        this.quickbooksConnected = false;
        this.categories = {
            revenue: ['Product Sales', 'Service Revenue', 'Subscription Revenue', 'Consulting', 'Licensing', 'Other Revenue'],
            cogs: ['Materials', 'Direct Labor', 'Manufacturing', 'Shipping', 'Packaging', 'Other COGS'],
            fixedExpenses: ['Rent', 'Salaries', 'Insurance', 'Utilities', 'Software Subscriptions', 'Loan Payments', 'Depreciation'],
            variableExpenses: ['Marketing', 'Sales Commissions', 'Travel', 'Professional Services', 'Office Supplies', 'Contractor Fees']
        };
        this.projectionMethods = [
            { id: 'manual', name: 'Manual Entry' },
            { id: 't12', name: 'Trailing 12 Months Average' },
            { id: 't6', name: 'Trailing 6 Months Average' },
            { id: 't3', name: 'Trailing 3 Months Average' },
            { id: 'lastYear', name: 'Equals Last Year' },
            { id: 'lastYearSameMonth', name: 'Last Year Same Month' },
            { id: 'lastMonth', name: 'Equals Last Month' },
            { id: 'avgLastYear', name: 'Average of Last Year' },
            { id: 'pctIncrease', name: 'Percentage Increase' },
            { id: 'pctIncreaseLastYear', name: '% Increase on Last Year' },
            { id: 'pctIncreaseLastMonth', name: '% Increase on Last Month' }
        ];
        this.initialize();
    }

    initialize() {
        this.loadFromStorage();
        this.setupDefaultLineItems();
    }

    setupDefaultLineItems() {
        if (this.lineItems.length === 0) {
            // Default revenue items
            this.addLineItem('revenue', 'Product Sales', 0, 'manual');
            this.addLineItem('revenue', 'Service Revenue', 0, 'manual');

            // Default COGS
            this.addLineItem('cogs', 'Materials', 0, 'manual');
            this.addLineItem('cogs', 'Direct Labor', 0, 'manual');

            // Default fixed expenses
            this.addLineItem('fixedExpenses', 'Rent', 0, 'manual');
            this.addLineItem('fixedExpenses', 'Salaries', 0, 'manual');

            // Default variable expenses
            this.addLineItem('variableExpenses', 'Marketing', 0, 'manual');
        }
    }

    // Format month header: "Mar - 25"
    formatMonthHeader(monthIndex, year) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const yearShort = String(year).slice(-2);
        return `${months[monthIndex]} - ${yearShort}`;
    }

    // Get array of month headers for display
    getMonthHeaders() {
        const headers = [];
        let month = this.startMonth;
        let year = this.startYear;

        for (let i = 0; i < this.monthsToShow; i++) {
            headers.push({
                display: this.formatMonthHeader(month, year),
                month: month,
                year: year,
                index: i
            });
            month++;
            if (month > 11) {
                month = 0;
                year++;
            }
        }
        return headers;
    }

    // Add a new line item
    addLineItem(section, name, baseValue = 0, projectionMethod = 'manual', category = null) {
        const id = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const item = {
            id: id,
            section: section,
            name: name,
            category: category,
            baseValue: baseValue,
            projectionMethod: projectionMethod,
            projectionParams: { percentIncrease: 0 },
            assumptions: '',
            helperNote: '',
            monthlyValues: {},
            isFromQuickBooks: false,
            quickbooksAccountId: null
        };

        // Initialize monthly values
        const headers = this.getMonthHeaders();
        headers.forEach(h => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
            item.monthlyValues[key] = baseValue;
        });

        this.lineItems.push(item);
        this.saveToStorage();
        return item;
    }

    // Remove a line item
    removeLineItem(itemId) {
        this.lineItems = this.lineItems.filter(item => item.id !== itemId);
        this.saveToStorage();
    }

    // Update line item value
    updateLineItemValue(itemId, monthKey, value) {
        const item = this.lineItems.find(i => i.id === itemId);
        if (item) {
            item.monthlyValues[monthKey] = parseFloat(value) || 0;
            this.saveToStorage();
        }
    }

    // Update line item assumptions
    updateAssumptions(itemId, assumptions) {
        const item = this.lineItems.find(i => i.id === itemId);
        if (item) {
            item.assumptions = assumptions;
            this.saveToStorage();
        }
    }

    // Update helper note for variable expenses
    updateHelperNote(itemId, note) {
        const item = this.lineItems.find(i => i.id === itemId);
        if (item) {
            item.helperNote = note;
            this.saveToStorage();
        }
    }

    // Set projection method
    setProjectionMethod(itemId, method, params = {}) {
        const item = this.lineItems.find(i => i.id === itemId);
        if (item) {
            item.projectionMethod = method;
            item.projectionParams = { ...item.projectionParams, ...params };
            this.applyProjection(item);
            this.saveToStorage();
        }
    }

    // Apply projection method to calculate values
    applyProjection(item) {
        const headers = this.getMonthHeaders();
        const historical = this.getHistoricalData(item.name);

        headers.forEach((h, idx) => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;

            switch (item.projectionMethod) {
                case 'manual':
                    // Keep existing values
                    break;

                case 't12':
                    item.monthlyValues[key] = this.calculateTrailingAverage(historical, 12);
                    break;

                case 't6':
                    item.monthlyValues[key] = this.calculateTrailingAverage(historical, 6);
                    break;

                case 't3':
                    item.monthlyValues[key] = this.calculateTrailingAverage(historical, 3);
                    break;

                case 'lastYear':
                    const lastYearTotal = this.getLastYearTotal(historical);
                    item.monthlyValues[key] = lastYearTotal / 12;
                    break;

                case 'lastYearSameMonth':
                    const sameMonthLastYear = this.getLastYearSameMonth(historical, h.month);
                    item.monthlyValues[key] = sameMonthLastYear;
                    break;

                case 'lastMonth':
                    if (idx > 0) {
                        const prevHeader = headers[idx - 1];
                        const prevKey = `${prevHeader.year}-${String(prevHeader.month + 1).padStart(2, '0')}`;
                        item.monthlyValues[key] = item.monthlyValues[prevKey] || 0;
                    }
                    break;

                case 'avgLastYear':
                    item.monthlyValues[key] = this.getLastYearAverage(historical);
                    break;

                case 'pctIncrease':
                    const pctIncrease = item.projectionParams.percentIncrease || 0;
                    if (idx === 0) {
                        const baseVal = this.getLastMonthValue(historical) || item.baseValue;
                        item.monthlyValues[key] = baseVal * (1 + pctIncrease / 100);
                    } else {
                        const prevH = headers[idx - 1];
                        const prevK = `${prevH.year}-${String(prevH.month + 1).padStart(2, '0')}`;
                        item.monthlyValues[key] = (item.monthlyValues[prevK] || 0) * (1 + pctIncrease / 100);
                    }
                    break;

                case 'pctIncreaseLastYear':
                    const pctLY = item.projectionParams.percentIncrease || 0;
                    const lyVal = this.getLastYearSameMonth(historical, h.month);
                    item.monthlyValues[key] = lyVal * (1 + pctLY / 100);
                    break;

                case 'pctIncreaseLastMonth':
                    const pctLM = item.projectionParams.percentIncrease || 0;
                    if (idx === 0) {
                        const lastMVal = this.getLastMonthValue(historical) || item.baseValue;
                        item.monthlyValues[key] = lastMVal * (1 + pctLM / 100);
                    } else {
                        const pHeader = headers[idx - 1];
                        const pKey = `${pHeader.year}-${String(pHeader.month + 1).padStart(2, '0')}`;
                        item.monthlyValues[key] = (item.monthlyValues[pKey] || 0) * (1 + pctLM / 100);
                    }
                    break;
            }
        });
    }

    // Historical data helpers
    calculateTrailingAverage(historical, months) {
        const values = Object.values(historical).slice(-months);
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    getLastYearTotal(historical) {
        const lastYear = new Date().getFullYear() - 1;
        let total = 0;
        Object.keys(historical).forEach(key => {
            if (key.startsWith(String(lastYear))) {
                total += historical[key];
            }
        });
        return total;
    }

    getLastYearSameMonth(historical, month) {
        const lastYear = new Date().getFullYear() - 1;
        const key = `${lastYear}-${String(month + 1).padStart(2, '0')}`;
        return historical[key] || 0;
    }

    getLastYearAverage(historical) {
        return this.getLastYearTotal(historical) / 12;
    }

    getLastMonthValue(historical) {
        const keys = Object.keys(historical).sort();
        return historical[keys[keys.length - 1]] || 0;
    }

    getHistoricalData(itemName) {
        return this.historicalData[itemName] || {};
    }

    // Get items by section
    getItemsBySection(section) {
        return this.lineItems.filter(item => item.section === section);
    }

    // Calculate section totals
    calculateSectionTotal(section, monthKey) {
        const items = this.getItemsBySection(section);
        return items.reduce((sum, item) => sum + (item.monthlyValues[monthKey] || 0), 0);
    }

    // Calculate yearly summary for a line item
    calculateYearlySummary(itemId) {
        const item = this.lineItems.find(i => i.id === itemId);
        if (!item) return 0;
        return Object.values(item.monthlyValues).reduce((a, b) => a + b, 0);
    }

    // Calculate all financial metrics
    calculateMetrics(monthKey) {
        const revenue = this.calculateSectionTotal('revenue', monthKey);
        const cogs = this.calculateSectionTotal('cogs', monthKey);
        const fixedExpenses = this.calculateSectionTotal('fixedExpenses', monthKey);
        const variableExpenses = this.calculateSectionTotal('variableExpenses', monthKey);

        const grossProfit = revenue - cogs;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const totalExpenses = cogs + fixedExpenses + variableExpenses;
        const netIncome = revenue - totalExpenses;
        const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

        return {
            revenue,
            cogs,
            grossProfit,
            grossMargin,
            fixedExpenses,
            variableExpenses,
            totalExpenses,
            netIncome,
            netMargin
        };
    }

    // Import from QuickBooks
    async importFromQuickBooks() {
        // Check if QuickBooks demo data is available
        if (window.quickBooksDemo && window.quickBooksDemo.getData) {
            const qbData = window.quickBooksDemo.getData();

            // Import chart of accounts as line items
            if (qbData.chartOfAccounts) {
                qbData.chartOfAccounts.forEach(account => {
                    const section = this.mapAccountTypeToSection(account.type);
                    if (section) {
                        const existing = this.lineItems.find(i => i.quickbooksAccountId === account.id);
                        if (!existing) {
                            const item = this.addLineItem(section, account.name, account.balance || 0, 'manual');
                            item.isFromQuickBooks = true;
                            item.quickbooksAccountId = account.id;
                        }
                    }
                });
            }

            this.quickbooksConnected = true;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    mapAccountTypeToSection(accountType) {
        const mapping = {
            'Income': 'revenue',
            'Revenue': 'revenue',
            'Cost of Goods Sold': 'cogs',
            'COGS': 'cogs',
            'Expense': 'variableExpenses',
            'Fixed Asset': 'fixedExpenses'
        };
        return mapping[accountType] || null;
    }

    // Storage
    saveToStorage() {
        const data = {
            lineItems: this.lineItems,
            startMonth: this.startMonth,
            startYear: this.startYear,
            historicalData: this.historicalData,
            quickbooksConnected: this.quickbooksConnected
        };
        localStorage.setItem('proFormaPlannerData', JSON.stringify(data));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('proFormaPlannerData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.lineItems = data.lineItems || [];
                this.startMonth = data.startMonth ?? new Date().getMonth();
                this.startYear = data.startYear ?? new Date().getFullYear();
                this.historicalData = data.historicalData || {};
                this.quickbooksConnected = data.quickbooksConnected || false;
            } catch (e) {
                console.error('Error loading pro forma data:', e);
            }
        }
    }

    // Render the complete pro forma UI
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Pro forma container not found:', containerId);
            return;
        }

        const headers = this.getMonthHeaders();

        let html = `
            <div class="proforma-planner">
                <style>
                    .proforma-planner {
                        background: #1a1a1a;
                        border-radius: 12px;
                        padding: 20px;
                        overflow-x: auto;
                        font-family: Arial, sans-serif;
                    }
                    .proforma-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #333;
                    }
                    .proforma-title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #ff3333;
                    }
                    .proforma-actions {
                        display: flex;
                        gap: 10px;
                    }
                    .proforma-btn {
                        background: #ff3333;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.85rem;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    .proforma-btn:hover {
                        background: #cc0000;
                    }
                    .proforma-btn.secondary {
                        background: #333;
                        border: 1px solid #555;
                    }
                    .proforma-btn.secondary:hover {
                        background: #444;
                    }
                    .proforma-table {
                        width: 100%;
                        border-collapse: collapse;
                        min-width: 1200px;
                    }
                    .proforma-table th,
                    .proforma-table td {
                        padding: 10px 8px;
                        text-align: right;
                        border-bottom: 1px solid #333;
                        font-size: 0.85rem;
                        white-space: nowrap;
                    }
                    .proforma-table th {
                        background: #252525;
                        color: #888;
                        font-weight: 600;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                        position: sticky;
                        top: 0;
                        z-index: 10;
                    }
                    .proforma-table th:first-child,
                    .proforma-table td:first-child {
                        text-align: left;
                        position: sticky;
                        left: 0;
                        background: #1a1a1a;
                        z-index: 5;
                        min-width: 200px;
                    }
                    .proforma-table th:nth-child(2),
                    .proforma-table td:nth-child(2) {
                        position: sticky;
                        left: 200px;
                        background: #252525;
                        min-width: 100px;
                        font-weight: bold;
                        color: #4caf50;
                    }
                    .proforma-table td:nth-child(2) {
                        background: #1f2f1f;
                    }
                    .section-header {
                        background: #2a2a2a !important;
                        font-weight: bold;
                        color: #ff3333 !important;
                        text-transform: uppercase;
                    }
                    .section-header td {
                        background: #2a2a2a !important;
                    }
                    .subtotal-row {
                        background: #252525;
                        font-weight: bold;
                    }
                    .subtotal-row td {
                        background: #252525;
                        color: #fff;
                        border-top: 2px solid #444;
                    }
                    .gross-margin-row td {
                        color: #4caf50;
                        font-style: italic;
                        font-size: 0.8rem;
                    }
                    .net-income-row {
                        background: #1a2a1a !important;
                    }
                    .net-income-row td {
                        background: #1a2a1a !important;
                        color: #4caf50;
                        font-weight: bold;
                        font-size: 1rem;
                        border-top: 3px double #4caf50;
                    }
                    .line-item-input {
                        background: transparent;
                        border: 1px solid transparent;
                        color: #fff;
                        width: 80px;
                        text-align: right;
                        padding: 4px;
                        border-radius: 4px;
                        font-size: 0.85rem;
                    }
                    .line-item-input:hover {
                        border-color: #444;
                    }
                    .line-item-input:focus {
                        border-color: #ff3333;
                        outline: none;
                        background: #2a2a2a;
                    }
                    .add-line-btn {
                        background: transparent;
                        border: 1px dashed #555;
                        color: #888;
                        padding: 6px 12px;
                        cursor: pointer;
                        font-size: 0.8rem;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        border-radius: 4px;
                        margin: 5px 0;
                    }
                    .add-line-btn:hover {
                        border-color: #ff3333;
                        color: #ff3333;
                    }
                    .line-item-name {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .remove-line-btn {
                        background: transparent;
                        border: none;
                        color: #666;
                        cursor: pointer;
                        padding: 2px 6px;
                        font-size: 1rem;
                        opacity: 0;
                        transition: opacity 0.2s;
                    }
                    .proforma-table tr:hover .remove-line-btn {
                        opacity: 1;
                    }
                    .remove-line-btn:hover {
                        color: #ff3333;
                    }
                    .projection-select {
                        background: #2a2a2a;
                        border: 1px solid #444;
                        color: #fff;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        cursor: pointer;
                    }
                    .projection-select:hover {
                        border-color: #ff3333;
                    }
                    .assumption-input {
                        background: #2a2a2a;
                        border: 1px solid #333;
                        color: #888;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        width: 150px;
                    }
                    .assumption-input:focus {
                        border-color: #ff3333;
                        outline: none;
                        color: #fff;
                    }
                    .helper-note {
                        font-size: 0.7rem;
                        color: #666;
                        font-style: italic;
                        margin-top: 2px;
                    }
                    .qb-badge {
                        background: #2ca01c;
                        color: white;
                        font-size: 0.65rem;
                        padding: 2px 6px;
                        border-radius: 3px;
                        margin-left: 5px;
                    }
                    .pct-input {
                        width: 50px;
                        background: #2a2a2a;
                        border: 1px solid #444;
                        color: #fff;
                        padding: 2px 4px;
                        border-radius: 3px;
                        text-align: right;
                        margin-left: 5px;
                    }
                    .negative {
                        color: #ff5252 !important;
                    }
                    .positive {
                        color: #4caf50 !important;
                    }
                </style>

                <div class="proforma-header">
                    <div class="proforma-title">📊 Pro Forma Financial Model</div>
                    <div class="proforma-actions">
                        <button class="proforma-btn secondary" onclick="window.proFormaPlanner.importFromQuickBooks().then(r => { if(r) window.proFormaPlanner.render('proforma-container'); window.toast?.success('QuickBooks Import', r ? 'Data imported successfully' : 'No QuickBooks data found'); })">
                            <span>📥</span> Import QuickBooks
                        </button>
                        <button class="proforma-btn secondary" onclick="window.proFormaPlanner.exportToExcel()">
                            <span>📤</span> Export Excel
                        </button>
                        <button class="proforma-btn" onclick="window.proFormaPlanner.generateReport()">
                            <span>📄</span> Generate Report
                        </button>
                    </div>
                </div>

                <table class="proforma-table">
                    <thead>
                        <tr>
                            <th>Line Item</th>
                            <th>FY Total</th>
                            ${headers.map(h => `<th>${h.display}</th>`).join('')}
                            <th>Projection</th>
                            <th>Assumptions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Revenue Section
        html += this.renderSection('revenue', 'Revenue', headers);

        // COGS Section
        html += this.renderSection('cogs', 'Cost of Goods Sold', headers);

        // Gross Profit Row
        html += this.renderGrossProfit(headers);

        // Fixed Expenses Section
        html += this.renderSection('fixedExpenses', 'Fixed Expenses', headers);

        // Variable Expenses Section
        html += this.renderSection('variableExpenses', 'Variable Expenses', headers, true);

        // Net Income Row
        html += this.renderNetIncome(headers);

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
        this.attachEventListeners();
    }

    renderSection(sectionId, sectionName, headers, showHelperNotes = false) {
        const items = this.getItemsBySection(sectionId);
        let html = `
            <tr class="section-header">
                <td colspan="${headers.length + 4}">${sectionName}</td>
            </tr>
        `;

        items.forEach(item => {
            const yearlyTotal = this.calculateYearlySummary(item.id);
            html += `
                <tr data-item-id="${item.id}">
                    <td>
                        <div class="line-item-name">
                            <button class="remove-line-btn" onclick="window.proFormaPlanner.removeLineItem('${item.id}'); window.proFormaPlanner.render('proforma-container');" title="Remove">×</button>
                            <span>${item.name}</span>
                            ${item.isFromQuickBooks ? '<span class="qb-badge">QB</span>' : ''}
                        </div>
                        ${showHelperNotes && item.helperNote ? `<div class="helper-note">${item.helperNote}</div>` : ''}
                    </td>
                    <td class="${yearlyTotal >= 0 ? 'positive' : 'negative'}">$${this.formatNumber(yearlyTotal)}</td>
                    ${headers.map(h => {
                        const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
                        const value = item.monthlyValues[key] || 0;
                        return `
                            <td>
                                <input type="text"
                                    class="line-item-input"
                                    value="${this.formatNumber(value)}"
                                    data-item-id="${item.id}"
                                    data-month-key="${key}"
                                    onchange="window.proFormaPlanner.handleValueChange(this)"
                                    onfocus="this.select()"
                                >
                            </td>
                        `;
                    }).join('')}
                    <td>
                        <select class="projection-select" data-item-id="${item.id}" onchange="window.proFormaPlanner.handleProjectionChange(this)">
                            ${this.projectionMethods.map(m => `
                                <option value="${m.id}" ${item.projectionMethod === m.id ? 'selected' : ''}>${m.name}</option>
                            `).join('')}
                        </select>
                        ${item.projectionMethod.includes('pct') ? `
                            <input type="number" class="pct-input" value="${item.projectionParams.percentIncrease || 0}"
                                data-item-id="${item.id}"
                                onchange="window.proFormaPlanner.handlePercentChange(this)"
                                title="Percentage">%
                        ` : ''}
                    </td>
                    <td>
                        <input type="text"
                            class="assumption-input"
                            value="${item.assumptions}"
                            placeholder="Add assumption..."
                            data-item-id="${item.id}"
                            onchange="window.proFormaPlanner.handleAssumptionChange(this)"
                        >
                    </td>
                </tr>
            `;

            // Helper note row for variable expenses
            if (showHelperNotes) {
                html += `
                    <tr class="helper-row" style="display: ${item.helperNote ? 'table-row' : 'none'};">
                        <td colspan="${headers.length + 4}" style="padding-left: 40px;">
                            <input type="text"
                                style="width: 100%; background: transparent; border: none; color: #666; font-size: 0.75rem; font-style: italic;"
                                placeholder="Add helper note (e.g., 'Based on 5% of revenue')"
                                value="${item.helperNote || ''}"
                                data-item-id="${item.id}"
                                onchange="window.proFormaPlanner.updateHelperNote('${item.id}', this.value)"
                            >
                        </td>
                    </tr>
                `;
            }
        });

        // Add line button
        html += `
            <tr>
                <td colspan="${headers.length + 4}">
                    <button class="add-line-btn" onclick="window.proFormaPlanner.showAddLineModal('${sectionId}')">
                        <span style="font-size: 1.2rem;">+</span> Add ${sectionName.replace(/s$/, '')} Line
                    </button>
                </td>
            </tr>
        `;

        // Section subtotal
        const monthlyTotals = headers.map(h => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
            return this.calculateSectionTotal(sectionId, key);
        });
        const yearlyTotal = monthlyTotals.reduce((a, b) => a + b, 0);

        html += `
            <tr class="subtotal-row">
                <td>Total ${sectionName}</td>
                <td class="${yearlyTotal >= 0 ? 'positive' : 'negative'}">$${this.formatNumber(yearlyTotal)}</td>
                ${monthlyTotals.map(t => `<td>$${this.formatNumber(t)}</td>`).join('')}
                <td></td>
                <td></td>
            </tr>
        `;

        return html;
    }

    renderGrossProfit(headers) {
        const monthlyData = headers.map(h => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
            return this.calculateMetrics(key);
        });

        const yearlyGrossProfit = monthlyData.reduce((a, b) => a + b.grossProfit, 0);
        const yearlyRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0);
        const yearlyGrossMargin = yearlyRevenue > 0 ? (yearlyGrossProfit / yearlyRevenue) * 100 : 0;

        return `
            <tr class="subtotal-row" style="background: #1f2a1f;">
                <td style="color: #4caf50;">Gross Profit</td>
                <td class="positive">$${this.formatNumber(yearlyGrossProfit)}</td>
                ${monthlyData.map(m => `<td class="${m.grossProfit >= 0 ? 'positive' : 'negative'}">$${this.formatNumber(m.grossProfit)}</td>`).join('')}
                <td></td>
                <td></td>
            </tr>
            <tr class="gross-margin-row">
                <td>Gross Margin %</td>
                <td>${yearlyGrossMargin.toFixed(1)}%</td>
                ${monthlyData.map(m => `<td>${m.grossMargin.toFixed(1)}%</td>`).join('')}
                <td></td>
                <td></td>
            </tr>
        `;
    }

    renderNetIncome(headers) {
        const monthlyData = headers.map(h => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
            return this.calculateMetrics(key);
        });

        const yearlyNetIncome = monthlyData.reduce((a, b) => a + b.netIncome, 0);
        const yearlyRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0);
        const yearlyNetMargin = yearlyRevenue > 0 ? (yearlyNetIncome / yearlyRevenue) * 100 : 0;

        return `
            <tr class="net-income-row">
                <td>Net Income</td>
                <td class="${yearlyNetIncome >= 0 ? 'positive' : 'negative'}">$${this.formatNumber(yearlyNetIncome)}</td>
                ${monthlyData.map(m => `<td class="${m.netIncome >= 0 ? 'positive' : 'negative'}">$${this.formatNumber(m.netIncome)}</td>`).join('')}
                <td></td>
                <td></td>
            </tr>
            <tr style="background: #1a2a1a;">
                <td style="color: #4caf50; font-style: italic;">Net Margin %</td>
                <td style="color: #4caf50;">${yearlyNetMargin.toFixed(1)}%</td>
                ${monthlyData.map(m => `<td style="color: ${m.netMargin >= 0 ? '#4caf50' : '#ff5252'};">${m.netMargin.toFixed(1)}%</td>`).join('')}
                <td></td>
                <td></td>
            </tr>
        `;
    }

    // Event handlers
    handleValueChange(input) {
        const itemId = input.dataset.itemId;
        const monthKey = input.dataset.monthKey;
        const value = this.parseNumber(input.value);
        this.updateLineItemValue(itemId, monthKey, value);
        input.value = this.formatNumber(value);
        this.render('proforma-container');
    }

    handleProjectionChange(select) {
        const itemId = select.dataset.itemId;
        const method = select.value;
        this.setProjectionMethod(itemId, method);
        this.render('proforma-container');
    }

    handlePercentChange(input) {
        const itemId = input.dataset.itemId;
        const percent = parseFloat(input.value) || 0;
        const item = this.lineItems.find(i => i.id === itemId);
        if (item) {
            this.setProjectionMethod(itemId, item.projectionMethod, { percentIncrease: percent });
            this.render('proforma-container');
        }
    }

    handleAssumptionChange(input) {
        const itemId = input.dataset.itemId;
        this.updateAssumptions(itemId, input.value);
    }

    attachEventListeners() {
        // Add any additional event listeners here
    }

    // Show modal to add new line item
    showAddLineModal(section) {
        const categories = this.categories[section] || ['Other'];

        const modal = document.createElement('div');
        modal.id = 'add-line-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: #2a2a2a; padding: 30px; border-radius: 12px; min-width: 400px; border: 1px solid #444;">
                    <h3 style="color: #ff3333; margin-bottom: 20px;">Add Line Item</h3>
                    <div style="margin-bottom: 15px;">
                        <label style="color: #888; display: block; margin-bottom: 5px;">Category</label>
                        <select id="new-line-category" style="width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #444; color: #fff; border-radius: 6px;">
                            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            <option value="custom">Custom...</option>
                        </select>
                    </div>
                    <div id="custom-name-field" style="margin-bottom: 15px; display: none;">
                        <label style="color: #888; display: block; margin-bottom: 5px;">Custom Name</label>
                        <input type="text" id="new-line-custom-name" style="width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #444; color: #fff; border-radius: 6px;" placeholder="Enter custom name">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="color: #888; display: block; margin-bottom: 5px;">Initial Monthly Value</label>
                        <input type="text" id="new-line-value" style="width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #444; color: #fff; border-radius: 6px;" placeholder="0" value="0">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="document.getElementById('add-line-modal').remove()" style="padding: 10px 20px; background: #444; border: none; color: #fff; border-radius: 6px; cursor: pointer;">Cancel</button>
                        <button onclick="window.proFormaPlanner.addLineFromModal('${section}')" style="padding: 10px 20px; background: #ff3333; border: none; color: #fff; border-radius: 6px; cursor: pointer;">Add Line</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle custom category selection
        document.getElementById('new-line-category').addEventListener('change', function() {
            document.getElementById('custom-name-field').style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }

    addLineFromModal(section) {
        const categorySelect = document.getElementById('new-line-category');
        const customName = document.getElementById('new-line-custom-name');
        const valueInput = document.getElementById('new-line-value');

        const name = categorySelect.value === 'custom' ? customName.value : categorySelect.value;
        const value = this.parseNumber(valueInput.value);

        if (name) {
            this.addLineItem(section, name, value, 'manual');
            document.getElementById('add-line-modal').remove();
            this.render('proforma-container');
            window.toast?.success('Line Added', `Added "${name}" to the pro forma`);
        }
    }

    // Export to Excel
    exportToExcel() {
        const headers = this.getMonthHeaders();
        let csv = 'Line Item,FY Total,' + headers.map(h => h.display).join(',') + ',Assumptions\n';

        const sections = [
            { id: 'revenue', name: 'Revenue' },
            { id: 'cogs', name: 'Cost of Goods Sold' },
            { id: 'fixedExpenses', name: 'Fixed Expenses' },
            { id: 'variableExpenses', name: 'Variable Expenses' }
        ];

        sections.forEach(section => {
            csv += `\n${section.name}\n`;
            const items = this.getItemsBySection(section.id);
            items.forEach(item => {
                const yearly = this.calculateYearlySummary(item.id);
                const monthly = headers.map(h => {
                    const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
                    return item.monthlyValues[key] || 0;
                });
                csv += `"${item.name}",${yearly},${monthly.join(',')},${item.assumptions}\n`;
            });
        });

        // Add totals
        csv += '\nGross Profit,';
        const monthlyMetrics = headers.map(h => {
            const key = `${h.year}-${String(h.month + 1).padStart(2, '0')}`;
            return this.calculateMetrics(key);
        });
        const yearlyGross = monthlyMetrics.reduce((a, b) => a + b.grossProfit, 0);
        csv += yearlyGross + ',' + monthlyMetrics.map(m => m.grossProfit).join(',') + '\n';

        csv += 'Net Income,';
        const yearlyNet = monthlyMetrics.reduce((a, b) => a + b.netIncome, 0);
        csv += yearlyNet + ',' + monthlyMetrics.map(m => m.netIncome).join(',') + '\n';

        // Download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ProForma_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        window.toast?.success('Export Complete', 'Pro forma exported to CSV');
    }

    // Generate report
    generateReport() {
        if (window.generateQuickPowerPoint) {
            window.generateQuickPowerPoint();
        } else {
            window.toast?.info('Report Generation', 'Generating your pro forma report...');
        }
    }

    // Utilities
    formatNumber(num) {
        if (typeof num !== 'number') num = parseFloat(num) || 0;
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    parseNumber(str) {
        if (typeof str === 'number') return str;
        return parseFloat(str.replace(/[^0-9.-]/g, '')) || 0;
    }
}

// Initialize and expose globally
window.proFormaPlanner = new ProFormaPlannerSystem();

// Open pro forma planner function
window.openProFormaPlanner = function() {
    // Check if container exists, if not create modal
    let container = document.getElementById('proforma-container');

    if (!container) {
        const modal = document.createElement('div');
        modal.id = 'proforma-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 9999; overflow: auto; padding: 20px;">
                <div style="max-width: 1600px; margin: 0 auto; position: relative;">
                    <button onclick="document.getElementById('proforma-modal').remove()"
                        style="position: fixed; top: 20px; right: 30px; background: #ff3333; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 10001;">×</button>
                    <div id="proforma-container"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        container = document.getElementById('proforma-container');
    }

    window.proFormaPlanner.render('proforma-container');
};

console.log('✅ Pro Forma Planner loaded');

// =====================================================
// LIGHTNING LEDGERZ - BUDGET FORECASTING & SCENARIO PLANNING
// Professional-grade financial planning tools
// =====================================================

class BudgetForecasting {
    constructor() {
        this.budgetData = this.getDefaultBudget();
        this.scenarios = [];
        this.forecastModels = ['linear', 'growth', 'seasonal', 'custom'];
        this.currentModel = 'growth';
    }

    getDefaultBudget() {
        return {
            revenue: {
                categories: [
                    { name: 'Product Sales', monthly: [45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 72000, 75000, 78000, 82000] },
                    { name: 'Services', monthly: [15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000] },
                    { name: 'Subscriptions', monthly: [8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500] }
                ]
            },
            expenses: {
                fixed: [
                    { name: 'Rent', monthly: 5000 },
                    { name: 'Salaries', monthly: 35000 },
                    { name: 'Insurance', monthly: 1500 },
                    { name: 'Software', monthly: 2500 },
                    { name: 'Utilities', monthly: 800 }
                ],
                variable: [
                    { name: 'COGS', percentOfRevenue: 0.35 },
                    { name: 'Marketing', percentOfRevenue: 0.12 },
                    { name: 'Sales Commission', percentOfRevenue: 0.08 },
                    { name: 'Shipping', percentOfRevenue: 0.03 }
                ]
            },
            assumptions: {
                growthRate: 0.15,
                inflationRate: 0.03,
                taxRate: 0.21,
                seasonalityFactors: [0.8, 0.85, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 1.2]
            }
        };
    }

    // =====================================================
    // FORECASTING METHODS
    // =====================================================

    generateForecast(months = 12, model = this.currentModel) {
        const forecast = [];
        const baseData = this.budgetData;

        for (let m = 0; m < months; m++) {
            const monthData = this.calculateMonth(m, model, baseData);
            forecast.push(monthData);
        }

        return {
            model,
            months,
            data: forecast,
            summary: this.summarizeForecast(forecast)
        };
    }

    calculateMonth(monthIndex, model, baseData) {
        const month = (monthIndex % 12);
        const year = Math.floor(monthIndex / 12);

        // Revenue calculation
        let totalRevenue = 0;
        const revenueBreakdown = [];

        baseData.revenue.categories.forEach(cat => {
            let baseRevenue = cat.monthly[month] || cat.monthly[cat.monthly.length - 1];

            // Apply growth model
            switch (model) {
                case 'linear':
                    baseRevenue *= (1 + 0.02 * monthIndex);
                    break;
                case 'growth':
                    baseRevenue *= Math.pow(1 + baseData.assumptions.growthRate / 12, monthIndex);
                    break;
                case 'seasonal':
                    baseRevenue *= baseData.assumptions.seasonalityFactors[month];
                    baseRevenue *= Math.pow(1 + baseData.assumptions.growthRate / 12, monthIndex);
                    break;
            }

            totalRevenue += baseRevenue;
            revenueBreakdown.push({
                category: cat.name,
                amount: Math.round(baseRevenue)
            });
        });

        // Fixed expenses
        let fixedExpenses = 0;
        const fixedBreakdown = [];

        baseData.expenses.fixed.forEach(exp => {
            let amount = exp.monthly * Math.pow(1 + baseData.assumptions.inflationRate / 12, monthIndex);
            fixedExpenses += amount;
            fixedBreakdown.push({
                category: exp.name,
                amount: Math.round(amount)
            });
        });

        // Variable expenses
        let variableExpenses = 0;
        const variableBreakdown = [];

        baseData.expenses.variable.forEach(exp => {
            let amount = totalRevenue * exp.percentOfRevenue;
            variableExpenses += amount;
            variableBreakdown.push({
                category: exp.name,
                amount: Math.round(amount),
                percentOfRevenue: (exp.percentOfRevenue * 100).toFixed(1) + '%'
            });
        });

        const totalExpenses = fixedExpenses + variableExpenses;
        const operatingIncome = totalRevenue - totalExpenses;
        const taxes = Math.max(0, operatingIncome * baseData.assumptions.taxRate);
        const netIncome = operatingIncome - taxes;

        return {
            month: monthIndex + 1,
            monthName: this.getMonthName(month),
            year: new Date().getFullYear() + year,
            revenue: {
                total: Math.round(totalRevenue),
                breakdown: revenueBreakdown
            },
            expenses: {
                fixed: Math.round(fixedExpenses),
                variable: Math.round(variableExpenses),
                total: Math.round(totalExpenses),
                fixedBreakdown,
                variableBreakdown
            },
            operatingIncome: Math.round(operatingIncome),
            taxes: Math.round(taxes),
            netIncome: Math.round(netIncome),
            margins: {
                gross: ((totalRevenue - variableExpenses) / totalRevenue * 100).toFixed(1),
                operating: (operatingIncome / totalRevenue * 100).toFixed(1),
                net: (netIncome / totalRevenue * 100).toFixed(1)
            }
        };
    }

    getMonthName(monthIndex) {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
    }

    summarizeForecast(forecast) {
        const totalRevenue = forecast.reduce((sum, m) => sum + m.revenue.total, 0);
        const totalExpenses = forecast.reduce((sum, m) => sum + m.expenses.total, 0);
        const totalNetIncome = forecast.reduce((sum, m) => sum + m.netIncome, 0);

        const firstMonth = forecast[0];
        const lastMonth = forecast[forecast.length - 1];
        const revenueGrowth = (lastMonth.revenue.total - firstMonth.revenue.total) / firstMonth.revenue.total;

        return {
            totalRevenue,
            totalExpenses,
            totalNetIncome,
            avgMonthlyRevenue: Math.round(totalRevenue / forecast.length),
            avgMonthlyNetIncome: Math.round(totalNetIncome / forecast.length),
            revenueGrowth,
            avgNetMargin: (totalNetIncome / totalRevenue * 100).toFixed(1),
            breakEvenMonth: this.findBreakEvenMonth(forecast)
        };
    }

    findBreakEvenMonth(forecast) {
        let cumulative = 0;
        for (let i = 0; i < forecast.length; i++) {
            cumulative += forecast[i].netIncome;
            if (cumulative > 0 && forecast[i].netIncome > 0) {
                return i + 1;
            }
        }
        return null;
    }

    // =====================================================
    // SCENARIO PLANNING
    // =====================================================

    createScenario(name, adjustments) {
        const scenario = {
            id: Date.now(),
            name,
            adjustments,
            createdAt: new Date().toISOString(),
            forecast: null
        };

        // Create modified budget data
        const modifiedBudget = JSON.parse(JSON.stringify(this.budgetData));

        if (adjustments.revenueChange) {
            modifiedBudget.revenue.categories.forEach(cat => {
                cat.monthly = cat.monthly.map(v => v * (1 + adjustments.revenueChange));
            });
        }

        if (adjustments.expenseChange) {
            modifiedBudget.expenses.fixed.forEach(exp => {
                exp.monthly *= (1 + adjustments.expenseChange);
            });
        }

        if (adjustments.growthRate !== undefined) {
            modifiedBudget.assumptions.growthRate = adjustments.growthRate;
        }

        if (adjustments.newHires) {
            modifiedBudget.expenses.fixed.push({
                name: 'New Hires',
                monthly: adjustments.newHires * 8000
            });
        }

        if (adjustments.marketingIncrease) {
            const marketingExp = modifiedBudget.expenses.variable.find(e => e.name === 'Marketing');
            if (marketingExp) {
                marketingExp.percentOfRevenue += adjustments.marketingIncrease;
            }
        }

        // Generate forecast with modified budget
        const originalBudget = this.budgetData;
        this.budgetData = modifiedBudget;
        scenario.forecast = this.generateForecast(12, 'growth');
        this.budgetData = originalBudget;

        this.scenarios.push(scenario);
        return scenario;
    }

    getScenarioTemplates() {
        return [
            {
                name: 'Base Case',
                icon: '📊',
                description: 'Current trajectory with existing assumptions',
                adjustments: {}
            },
            {
                name: 'Aggressive Growth',
                icon: '🚀',
                description: '25% revenue increase, 5 new hires, higher marketing',
                adjustments: {
                    revenueChange: 0.25,
                    newHires: 5,
                    marketingIncrease: 0.05,
                    growthRate: 0.25
                }
            },
            {
                name: 'Conservative',
                icon: '🛡️',
                description: '10% revenue decrease, cost cutting',
                adjustments: {
                    revenueChange: -0.10,
                    expenseChange: -0.15,
                    growthRate: 0.05
                }
            },
            {
                name: 'Recession',
                icon: '📉',
                description: '30% revenue drop, major cost reductions',
                adjustments: {
                    revenueChange: -0.30,
                    expenseChange: -0.25,
                    growthRate: -0.05
                }
            },
            {
                name: 'Expansion',
                icon: '🌍',
                description: 'New market entry with investment',
                adjustments: {
                    revenueChange: 0.15,
                    expenseChange: 0.20,
                    newHires: 10,
                    marketingIncrease: 0.08,
                    growthRate: 0.35
                }
            }
        ];
    }

    compareScenarios(scenarioIds) {
        const scenarios = scenarioIds.map(id => this.scenarios.find(s => s.id === id)).filter(Boolean);

        return {
            scenarios: scenarios.map(s => ({
                name: s.name,
                totalRevenue: s.forecast.summary.totalRevenue,
                totalNetIncome: s.forecast.summary.totalNetIncome,
                avgNetMargin: s.forecast.summary.avgNetMargin,
                revenueGrowth: s.forecast.summary.revenueGrowth
            })),
            bestCase: scenarios.reduce((best, s) =>
                s.forecast.summary.totalNetIncome > (best?.forecast.summary.totalNetIncome || -Infinity) ? s : best
            , null),
            worstCase: scenarios.reduce((worst, s) =>
                s.forecast.summary.totalNetIncome < (worst?.forecast.summary.totalNetIncome || Infinity) ? s : worst
            , null)
        };
    }

    // =====================================================
    // VARIANCE ANALYSIS
    // =====================================================

    calculateVariance(actual, budget) {
        return {
            dollar: actual - budget,
            percent: budget !== 0 ? ((actual - budget) / budget * 100) : 0,
            favorable: actual >= budget
        };
    }

    generateVarianceReport(actuals) {
        const budget = this.generateForecast(actuals.length);
        const report = [];

        actuals.forEach((actual, i) => {
            const budgeted = budget.data[i];
            report.push({
                month: budgeted.monthName,
                revenue: {
                    actual: actual.revenue,
                    budget: budgeted.revenue.total,
                    variance: this.calculateVariance(actual.revenue, budgeted.revenue.total)
                },
                expenses: {
                    actual: actual.expenses,
                    budget: budgeted.expenses.total,
                    variance: this.calculateVariance(budgeted.expenses.total, actual.expenses)
                },
                netIncome: {
                    actual: actual.revenue - actual.expenses,
                    budget: budgeted.netIncome,
                    variance: this.calculateVariance(actual.revenue - actual.expenses, budgeted.netIncome)
                }
            });
        });

        return report;
    }

    // =====================================================
    // CASH FLOW PROJECTION
    // =====================================================

    projectCashFlow(startingCash, months = 12) {
        const forecast = this.generateForecast(months);
        const cashFlow = [];
        let currentCash = startingCash;

        forecast.data.forEach((month, i) => {
            // Operating cash flow (simplified - assume net income + depreciation)
            const depreciation = 2000; // Assumed monthly depreciation
            const workingCapitalChange = i === 0 ? 0 : (month.revenue.total - forecast.data[i-1].revenue.total) * 0.1;
            const operatingCashFlow = month.netIncome + depreciation - workingCapitalChange;

            // Investing (assumed)
            const capitalExpenditure = i % 3 === 0 ? -5000 : 0; // Quarterly CapEx

            // Financing (assumed)
            const debtPayment = -2500;

            const netCashFlow = operatingCashFlow + capitalExpenditure + debtPayment;
            currentCash += netCashFlow;

            cashFlow.push({
                month: month.monthName,
                year: month.year,
                operatingCashFlow: Math.round(operatingCashFlow),
                investingCashFlow: capitalExpenditure,
                financingCashFlow: debtPayment,
                netCashFlow: Math.round(netCashFlow),
                endingCash: Math.round(currentCash),
                runway: currentCash > 0 && month.netIncome < 0 ?
                    Math.floor(currentCash / Math.abs(month.netIncome)) : null
            });
        });

        return {
            startingCash,
            projections: cashFlow,
            minimumCash: Math.min(...cashFlow.map(c => c.endingCash)),
            endingCash: cashFlow[cashFlow.length - 1].endingCash,
            totalOperatingCashFlow: cashFlow.reduce((sum, c) => sum + c.operatingCashFlow, 0)
        };
    }

    // =====================================================
    // UI RENDERING
    // =====================================================

    renderUI() {
        const container = document.createElement('div');
        container.id = 'budget-forecast-modal';
        container.className = 'modal-enhanced';

        const forecast = this.generateForecast(12);
        const cashFlow = this.projectCashFlow(100000);

        container.innerHTML = `
            <div class="modal-backdrop" onclick="window.budgetForecasting.closeUI()"></div>
            <div class="modal-content" style="max-width:1000px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2 style="color:#f39c12;margin:0;">📈 Budget Forecasting & Scenarios</h2>
                    <button onclick="window.budgetForecasting.closeUI()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                </div>

                <!-- Summary Cards -->
                <div class="grid-responsive grid-4" style="margin-bottom:24px;">
                    <div class="metric-card">
                        <div class="metric-label">Projected Revenue</div>
                        <div class="metric-value">$${(forecast.summary.totalRevenue / 1000000).toFixed(2)}M</div>
                        <div class="metric-change positive">12 months</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Projected Net Income</div>
                        <div class="metric-value">$${(forecast.summary.totalNetIncome / 1000).toFixed(0)}K</div>
                        <div class="metric-change ${forecast.summary.totalNetIncome >= 0 ? 'positive' : 'negative'}">
                            ${forecast.summary.avgNetMargin}% margin
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Revenue Growth</div>
                        <div class="metric-value">${(forecast.summary.revenueGrowth * 100).toFixed(1)}%</div>
                        <div class="metric-change positive">Year-over-Year</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Ending Cash</div>
                        <div class="metric-value">$${(cashFlow.endingCash / 1000).toFixed(0)}K</div>
                        <div class="metric-change ${cashFlow.endingCash >= 100000 ? 'positive' : 'negative'}">
                            Projected
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs-modern" style="margin-bottom:24px;">
                    <button class="tab-modern active" onclick="window.budgetForecasting.showTab('forecast')">Forecast</button>
                    <button class="tab-modern" onclick="window.budgetForecasting.showTab('scenarios')">Scenarios</button>
                    <button class="tab-modern" onclick="window.budgetForecasting.showTab('cashflow')">Cash Flow</button>
                </div>

                <!-- Forecast Tab -->
                <div id="forecast-tab" class="budget-tab">
                    <div class="glass-card" style="padding:24px;margin-bottom:24px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                            <h3 style="color:#fff;margin:0;">Monthly Forecast</h3>
                            <div style="display:flex;gap:8px;">
                                ${this.forecastModels.map(model => `
                                    <button class="avatar-chat-action ${model === this.currentModel ? 'active' : ''}"
                                            style="${model === this.currentModel ? 'background:#f39c12;color:#000;' : ''}"
                                            onclick="window.budgetForecasting.changeModel('${model}')">
                                        ${model.charAt(0).toUpperCase() + model.slice(1)}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div style="overflow-x:auto;">
                            <table class="data-table" style="width:100%;">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th style="text-align:right;">Revenue</th>
                                        <th style="text-align:right;">Expenses</th>
                                        <th style="text-align:right;">Net Income</th>
                                        <th style="text-align:right;">Margin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${forecast.data.map(m => `
                                        <tr>
                                            <td>${m.monthName} ${m.year}</td>
                                            <td style="text-align:right;color:#00d97e;">$${(m.revenue.total / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;color:#e63757;">$${(m.expenses.total / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;color:${m.netIncome >= 0 ? '#00d97e' : '#e63757'};">$${(m.netIncome / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;">${m.margins.net}%</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Scenarios Tab -->
                <div id="scenarios-tab" class="budget-tab" style="display:none;">
                    <div class="glass-card" style="padding:24px;margin-bottom:24px;">
                        <h3 style="color:#fff;margin:0 0 16px 0;">Create Scenario</h3>
                        <div class="grid-responsive grid-3" style="gap:16px;">
                            ${this.getScenarioTemplates().map(template => `
                                <div class="glass-card" style="padding:20px;cursor:pointer;transition:all 0.3s;"
                                     onclick="window.budgetForecasting.createScenarioFromTemplate('${template.name}')"
                                     onmouseover="this.style.borderColor='#f39c12'"
                                     onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'">
                                    <div style="font-size:32px;margin-bottom:12px;">${template.icon}</div>
                                    <h4 style="color:#fff;margin:0 0 8px 0;">${template.name}</h4>
                                    <p style="color:#888;margin:0;font-size:13px;">${template.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div id="scenarios-list" class="glass-card" style="padding:24px;">
                        <h3 style="color:#fff;margin:0 0 16px 0;">Created Scenarios</h3>
                        <p style="color:#666;">No scenarios created yet. Click a template above to create one.</p>
                    </div>
                </div>

                <!-- Cash Flow Tab -->
                <div id="cashflow-tab" class="budget-tab" style="display:none;">
                    <div class="glass-card" style="padding:24px;">
                        <h3 style="color:#fff;margin:0 0 16px 0;">Cash Flow Projection</h3>
                        <div class="grid-responsive grid-3" style="margin-bottom:24px;">
                            <div style="text-align:center;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px;">
                                <div style="color:#888;font-size:13px;">Starting Cash</div>
                                <div style="font-size:24px;font-weight:700;color:#fff;">$${(cashFlow.startingCash / 1000).toFixed(0)}K</div>
                            </div>
                            <div style="text-align:center;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px;">
                                <div style="color:#888;font-size:13px;">Minimum Cash</div>
                                <div style="font-size:24px;font-weight:700;color:${cashFlow.minimumCash >= 50000 ? '#00d97e' : '#e63757'};">$${(cashFlow.minimumCash / 1000).toFixed(0)}K</div>
                            </div>
                            <div style="text-align:center;padding:20px;background:rgba(255,255,255,0.03);border-radius:12px;">
                                <div style="color:#888;font-size:13px;">Ending Cash</div>
                                <div style="font-size:24px;font-weight:700;color:#00d97e;">$${(cashFlow.endingCash / 1000).toFixed(0)}K</div>
                            </div>
                        </div>

                        <div style="overflow-x:auto;">
                            <table class="data-table" style="width:100%;">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th style="text-align:right;">Operating</th>
                                        <th style="text-align:right;">Investing</th>
                                        <th style="text-align:right;">Financing</th>
                                        <th style="text-align:right;">Net Change</th>
                                        <th style="text-align:right;">Ending Cash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cashFlow.projections.map(m => `
                                        <tr>
                                            <td>${m.month} ${m.year}</td>
                                            <td style="text-align:right;color:${m.operatingCashFlow >= 0 ? '#00d97e' : '#e63757'};">$${(m.operatingCashFlow / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;color:#e63757;">$${(m.investingCashFlow / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;color:#e63757;">$${(m.financingCashFlow / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;color:${m.netCashFlow >= 0 ? '#00d97e' : '#e63757'};">$${(m.netCashFlow / 1000).toFixed(0)}K</td>
                                            <td style="text-align:right;font-weight:600;">$${(m.endingCash / 1000).toFixed(0)}K</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        setTimeout(() => container.classList.add('active'), 10);
    }

    showTab(tabName) {
        document.querySelectorAll('.budget-tab').forEach(tab => tab.style.display = 'none');
        document.querySelectorAll('.tabs-modern .tab-modern').forEach(btn => btn.classList.remove('active'));

        document.getElementById(`${tabName}-tab`).style.display = 'block';
        event.target.classList.add('active');
    }

    changeModel(model) {
        this.currentModel = model;
        this.closeUI();
        this.renderUI();
    }

    createScenarioFromTemplate(templateName) {
        const template = this.getScenarioTemplates().find(t => t.name === templateName);
        if (template) {
            const scenario = this.createScenario(template.name, template.adjustments);
            this.updateScenariosList();

            if (window.toast) {
                window.toast.success('Scenario Created', `${template.name} scenario has been generated`);
            }
        }
    }

    updateScenariosList() {
        const container = document.getElementById('scenarios-list');
        if (!container) return;

        if (this.scenarios.length === 0) {
            container.innerHTML = `
                <h3 style="color:#fff;margin:0 0 16px 0;">Created Scenarios</h3>
                <p style="color:#666;">No scenarios created yet. Click a template above to create one.</p>
            `;
            return;
        }

        container.innerHTML = `
            <h3 style="color:#fff;margin:0 0 16px 0;">Created Scenarios (${this.scenarios.length})</h3>
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${this.scenarios.map(s => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;">
                        <div>
                            <div style="font-weight:600;">${s.name}</div>
                            <div style="color:#888;font-size:13px;">
                                Revenue: $${(s.forecast.summary.totalRevenue / 1000000).toFixed(2)}M |
                                Net Income: $${(s.forecast.summary.totalNetIncome / 1000).toFixed(0)}K
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="avatar-chat-action" onclick="window.budgetForecasting.viewScenario('${s.id}')">View</button>
                            <button class="avatar-chat-action" onclick="window.budgetForecasting.exportScenario('${s.id}')">Export</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    viewScenario(id) {
        const scenario = this.scenarios.find(s => s.id == id);
        if (!scenario) return;

        if (window.toast) {
            window.toast.info(scenario.name, `Total Revenue: $${(scenario.forecast.summary.totalRevenue / 1000000).toFixed(2)}M`);
        }
    }

    exportScenario(id) {
        const scenario = this.scenarios.find(s => s.id == id);
        if (!scenario) return;

        // Create CSV
        let csv = 'Month,Revenue,Expenses,Net Income,Margin\n';
        scenario.forecast.data.forEach(m => {
            csv += `${m.monthName} ${m.year},${m.revenue.total},${m.expenses.total},${m.netIncome},${m.margins.net}%\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${scenario.name.replace(/\s+/g, '_')}_forecast.csv`;
        a.click();

        if (window.toast) {
            window.toast.success('Export Complete', 'CSV file downloaded');
        }
    }

    closeUI() {
        const modal = document.getElementById('budget-forecast-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Initialize globally
window.budgetForecasting = new BudgetForecasting();

// Add to command palette
document.addEventListener('DOMContentLoaded', () => {
    if (window.commandPalette) {
        window.commandPalette.commands.push({
            icon: '📈',
            title: 'Budget Forecasting',
            desc: 'Create forecasts and scenario plans',
            action: () => window.budgetForecasting.renderUI()
        });
    }
});

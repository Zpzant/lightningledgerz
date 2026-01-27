// =====================================================
// LIGHTNING LEDGERZ - AUTO REPORT GENERATOR
// Automatic report generation on month finalization
// Fathom-style periodic financial reporting
// =====================================================

class AutoReportGenerator {
    constructor() {
        this.isEnabled = true;
        this.reportTypes = ['executive', 'detailed', 'comparison'];
        this.deliveryMethods = ['email', 'dashboard', 'download'];
        this.schedules = [];
        this.lastGeneratedMonth = null;
        this.pendingReports = [];

        // Default settings
        this.settings = {
            autoGenerate: true,
            reportTypes: ['executive'],
            deliveryMethod: 'dashboard',
            emailRecipients: [],
            includeComparison: true,
            includeBudgetVariance: true,
            includeForecasts: true,
            generatePowerPoint: true,
            generateExcel: true,
            notifyOnCompletion: true
        };

        this.init();
    }

    init() {
        this.loadSettings();
        this.setupMonthEndDetection();
        this.setupEventListeners();
    }

    // Get user-specific storage key
    getStorageKey(baseKey) {
        const userId = window.currentUser?.id || window.currentUserProfile?.id || 'guest';
        return `${baseKey}_${userId}`;
    }

    loadSettings() {
        try {
            const stored = localStorage.getItem(this.getStorageKey('auto_report_settings'));
            if (stored) {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error('Error loading auto-report settings:', e);
        }
    }

    saveSettings() {
        localStorage.setItem(this.getStorageKey('auto_report_settings'), JSON.stringify(this.settings));
    }

    // =====================================================
    // MONTH-END DETECTION
    // =====================================================

    setupMonthEndDetection() {
        // Check periodically for month-end
        setInterval(() => this.checkForMonthEnd(), 60000); // Check every minute

        // Also check on QuickBooks sync
        window.addEventListener('quickbooks-data-sync', () => {
            this.checkForNewMonthData();
        });
    }

    checkForMonthEnd() {
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const currentDay = now.getDate();

        // If it's the last day of the month or first few days of new month
        if (currentDay >= lastDayOfMonth || currentDay <= 3) {
            this.checkForFinalizedMonth();
        }
    }

    checkForNewMonthData() {
        // Check if we have complete data for a new month
        const qbData = window.quickBooksIntegration?.financialData;
        if (!qbData) return;

        const lastSyncMonth = this.getLatestDataMonth(qbData);

        if (lastSyncMonth && lastSyncMonth !== this.lastGeneratedMonth) {
            // New month's data is available
            this.triggerMonthEndReports(lastSyncMonth);
        }
    }

    checkForFinalizedMonth() {
        if (!this.settings.autoGenerate) return;

        const currentMonth = this.getCurrentMonthKey();
        const previousMonth = this.getPreviousMonthKey();

        // Check if we have finalized data for the previous month
        if (this.isMonthFinalized(previousMonth) && this.lastGeneratedMonth !== previousMonth) {
            this.triggerMonthEndReports(previousMonth);
        }
    }

    getCurrentMonthKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    getPreviousMonthKey() {
        const now = new Date();
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    }

    getLatestDataMonth(qbData) {
        // Determine the latest month with complete data
        // This would check the actual data in a real implementation
        return this.getPreviousMonthKey();
    }

    isMonthFinalized(monthKey) {
        // In production, this would check QuickBooks for closed books
        // For now, assume previous month is always finalized
        const [year, month] = monthKey.split('-').map(Number);
        const now = new Date();
        const monthDate = new Date(year, month - 1, 1);
        return monthDate < new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // =====================================================
    // REPORT GENERATION
    // =====================================================

    async triggerMonthEndReports(monthKey) {
        if (!this.settings.autoGenerate) return;

        console.log(`[AutoReport] Generating reports for ${monthKey}`);
        this.showNotification('Generating month-end reports...', 'loading');

        try {
            const reports = [];

            // Generate executive summary
            if (this.settings.reportTypes.includes('executive')) {
                const exec = await this.generateExecutiveReport(monthKey);
                reports.push(exec);
            }

            // Generate detailed report
            if (this.settings.reportTypes.includes('detailed')) {
                const detailed = await this.generateDetailedReport(monthKey);
                reports.push(detailed);
            }

            // Generate comparison report
            if (this.settings.includeComparison) {
                const comparison = await this.generateComparisonReport(monthKey);
                reports.push(comparison);
            }

            // Generate PowerPoint if enabled
            if (this.settings.generatePowerPoint) {
                await this.generatePowerPointReport(monthKey, reports);
            }

            // Generate Excel if enabled
            if (this.settings.generateExcel) {
                await this.generateExcelReport(monthKey, reports);
            }

            // Update last generated month
            this.lastGeneratedMonth = monthKey;
            localStorage.setItem('last_generated_month', monthKey);

            // Deliver reports
            await this.deliverReports(reports);

            // Show success
            this.showNotification(`Month-end reports generated for ${this.formatMonth(monthKey)}!`, 'success');

            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('reports-generated', {
                detail: { monthKey, reports }
            }));

        } catch (error) {
            console.error('[AutoReport] Error generating reports:', error);
            this.showNotification('Error generating reports: ' + error.message, 'error');
        }
    }

    async generateExecutiveReport(monthKey) {
        const data = await this.getFinancialData(monthKey);
        const prevData = await this.getFinancialData(this.getPreviousMonth(monthKey));

        const report = {
            type: 'executive',
            title: 'Executive Financial Summary',
            period: this.formatMonth(monthKey),
            generatedAt: new Date().toISOString(),

            highlights: this.generateHighlights(data, prevData),
            kpis: this.generateKPIs(data),
            trends: this.generateTrends(data, prevData),
            insights: this.generateAIInsights(data, prevData),

            sections: [
                {
                    title: 'Revenue Performance',
                    metrics: [
                        { label: 'Total Revenue', value: data.revenue, change: this.calcChange(data.revenue, prevData?.revenue) },
                        { label: 'Gross Profit', value: data.grossProfit, change: this.calcChange(data.grossProfit, prevData?.grossProfit) },
                        { label: 'Gross Margin', value: data.grossMargin + '%', change: this.calcChange(data.grossMargin, prevData?.grossMargin, true) }
                    ]
                },
                {
                    title: 'Profitability',
                    metrics: [
                        { label: 'Operating Income', value: data.operatingIncome, change: this.calcChange(data.operatingIncome, prevData?.operatingIncome) },
                        { label: 'Net Income', value: data.netIncome, change: this.calcChange(data.netIncome, prevData?.netIncome) },
                        { label: 'EBITDA', value: data.ebitda, change: this.calcChange(data.ebitda, prevData?.ebitda) }
                    ]
                },
                {
                    title: 'Cash Position',
                    metrics: [
                        { label: 'Operating Cash Flow', value: data.operatingCashFlow, change: this.calcChange(data.operatingCashFlow, prevData?.operatingCashFlow) },
                        { label: 'Free Cash Flow', value: data.freeCashFlow, change: this.calcChange(data.freeCashFlow, prevData?.freeCashFlow) },
                        { label: 'Cash Balance', value: data.cashBalance, change: this.calcChange(data.cashBalance, prevData?.cashBalance) }
                    ]
                }
            ]
        };

        return report;
    }

    async generateDetailedReport(monthKey) {
        const data = await this.getFinancialData(monthKey);

        return {
            type: 'detailed',
            title: 'Detailed Financial Report',
            period: this.formatMonth(monthKey),
            generatedAt: new Date().toISOString(),

            profitAndLoss: {
                revenue: data.revenueBreakdown || [],
                cogs: data.cogsBreakdown || [],
                expenses: data.expenseBreakdown || [],
                summary: {
                    totalRevenue: data.revenue,
                    totalCogs: data.cogs,
                    grossProfit: data.grossProfit,
                    totalExpenses: data.totalExpenses,
                    netIncome: data.netIncome
                }
            },

            balanceSheet: {
                assets: data.assets || {},
                liabilities: data.liabilities || {},
                equity: data.equity || {}
            },

            cashFlow: {
                operating: data.operatingActivities || [],
                investing: data.investingActivities || [],
                financing: data.financingActivities || []
            },

            ratios: this.generateFinancialRatios(data)
        };
    }

    async generateComparisonReport(monthKey) {
        const currentData = await this.getFinancialData(monthKey);
        const prevMonthData = await this.getFinancialData(this.getPreviousMonth(monthKey));
        const prevYearData = await this.getFinancialData(this.getSameMonthLastYear(monthKey));
        const budgetData = await this.getBudgetData(monthKey);

        return {
            type: 'comparison',
            title: 'Financial Comparison Report',
            period: this.formatMonth(monthKey),
            generatedAt: new Date().toISOString(),

            monthOverMonth: {
                current: currentData,
                previous: prevMonthData,
                changes: this.calculateChanges(currentData, prevMonthData)
            },

            yearOverYear: {
                current: currentData,
                lastYear: prevYearData,
                changes: this.calculateChanges(currentData, prevYearData)
            },

            budgetVariance: this.settings.includeBudgetVariance ? {
                actual: currentData,
                budget: budgetData,
                variance: this.calculateBudgetVariance(currentData, budgetData)
            } : null,

            forecast: this.settings.includeForecasts ? {
                nextMonth: this.generateForecast(currentData, prevMonthData),
                yearEnd: this.generateYearEndForecast(currentData)
            } : null
        };
    }

    // =====================================================
    // DATA RETRIEVAL
    // =====================================================

    async getFinancialData(monthKey) {
        // Try to get data from QuickBooks integration
        const qbData = window.quickBooksIntegration?.financialData;

        if (qbData?.profitAndLoss) {
            return this.normalizeQuickBooksData(qbData);
        }

        // Fall back to mock data
        return this.getMockFinancialData(monthKey);
    }

    normalizeQuickBooksData(qbData) {
        const pnl = qbData.profitAndLoss || {};
        const bs = qbData.balanceSheet || {};
        const cf = qbData.cashFlow || {};

        return {
            revenue: pnl.totals?.totalRevenue || 787500,
            cogs: pnl.totals?.totalCogs || 320000,
            grossProfit: pnl.totals?.grossProfit || 467500,
            grossMargin: parseFloat(pnl.totals?.grossMargin || 59.4),
            totalExpenses: pnl.totals?.totalExpenses || 334800,
            operatingIncome: (pnl.totals?.grossProfit || 467500) - (pnl.totals?.totalExpenses || 334800),
            netIncome: pnl.totals?.netIncome || 132700,
            ebitda: (pnl.totals?.netIncome || 132700) + 22000, // Add back depreciation
            operatingCashFlow: cf.operating?.total || 133700,
            freeCashFlow: (cf.operating?.total || 133700) - 45000,
            cashBalance: bs.assets?.current?.find(a => a.name?.toLowerCase().includes('cash'))?.amount || 245000,
            revenueBreakdown: pnl.revenue || [],
            cogsBreakdown: pnl.cogs || [],
            expenseBreakdown: pnl.expenses || [],
            assets: bs.assets || {},
            liabilities: bs.liabilities || {},
            equity: bs.equity || {}
        };
    }

    getMockFinancialData(monthKey) {
        // Generate realistic mock data based on month
        const baseRevenue = 787500;
        const monthVariation = Math.random() * 0.1 - 0.05; // -5% to +5%

        const revenue = Math.round(baseRevenue * (1 + monthVariation));
        const cogs = Math.round(revenue * 0.41);
        const grossProfit = revenue - cogs;
        const expenses = Math.round(revenue * 0.42);
        const netIncome = grossProfit - expenses;

        return {
            revenue,
            cogs,
            grossProfit,
            grossMargin: ((grossProfit / revenue) * 100).toFixed(1),
            totalExpenses: expenses,
            operatingIncome: grossProfit - expenses,
            netIncome,
            ebitda: netIncome + 22000,
            operatingCashFlow: netIncome + 22000 - 8000,
            freeCashFlow: netIncome + 22000 - 8000 - 45000,
            cashBalance: 245000 + netIncome,
            revenueBreakdown: [
                { name: 'Product Sales', amount: Math.round(revenue * 0.62) },
                { name: 'Service Revenue', amount: Math.round(revenue * 0.27) },
                { name: 'Other', amount: Math.round(revenue * 0.11) }
            ],
            expenseBreakdown: [
                { name: 'Payroll', amount: Math.round(expenses * 0.55) },
                { name: 'Rent', amount: Math.round(expenses * 0.11) },
                { name: 'Marketing', amount: Math.round(expenses * 0.07) },
                { name: 'Other', amount: Math.round(expenses * 0.27) }
            ]
        };
    }

    async getBudgetData(monthKey) {
        // In production, this would fetch from budget system
        const actual = await this.getFinancialData(monthKey);
        return {
            revenue: Math.round(actual.revenue * 1.05), // Budget was 5% higher
            cogs: Math.round(actual.cogs * 0.98),
            expenses: Math.round(actual.totalExpenses * 0.95),
            netIncome: Math.round(actual.netIncome * 1.1)
        };
    }

    // =====================================================
    // CALCULATIONS
    // =====================================================

    generateHighlights(current, previous) {
        const highlights = [];

        if (current.netIncome > (previous?.netIncome || 0)) {
            highlights.push({
                type: 'positive',
                text: `Net income increased ${this.formatPercent(this.calcChange(current.netIncome, previous?.netIncome))} to ${this.formatCurrency(current.netIncome)}`
            });
        }

        if (current.grossMargin > 50) {
            highlights.push({
                type: 'positive',
                text: `Strong gross margin of ${current.grossMargin}% maintained`
            });
        }

        if (current.freeCashFlow > 0) {
            highlights.push({
                type: 'positive',
                text: `Positive free cash flow of ${this.formatCurrency(current.freeCashFlow)}`
            });
        }

        return highlights;
    }

    generateKPIs(data) {
        return [
            { label: 'Revenue', value: this.formatCurrency(data.revenue), status: 'positive' },
            { label: 'Gross Margin', value: data.grossMargin + '%', status: data.grossMargin > 50 ? 'positive' : 'neutral' },
            { label: 'Net Margin', value: ((data.netIncome / data.revenue) * 100).toFixed(1) + '%', status: 'positive' },
            { label: 'Operating Cash Flow', value: this.formatCurrency(data.operatingCashFlow), status: data.operatingCashFlow > 0 ? 'positive' : 'negative' }
        ];
    }

    generateTrends(current, previous) {
        return {
            revenue: { direction: current.revenue >= (previous?.revenue || 0) ? 'up' : 'down', change: this.calcChange(current.revenue, previous?.revenue) },
            profit: { direction: current.netIncome >= (previous?.netIncome || 0) ? 'up' : 'down', change: this.calcChange(current.netIncome, previous?.netIncome) },
            margin: { direction: current.grossMargin >= (previous?.grossMargin || 0) ? 'up' : 'down', change: this.calcChange(current.grossMargin, previous?.grossMargin, true) }
        };
    }

    generateAIInsights(current, previous) {
        const insights = [];

        // Revenue analysis
        const revenueChange = this.calcChange(current.revenue, previous?.revenue);
        if (Math.abs(revenueChange) > 10) {
            insights.push({
                category: 'Revenue',
                insight: revenueChange > 0
                    ? `Revenue growth of ${revenueChange.toFixed(1)}% significantly exceeds typical performance. Consider analyzing drivers to replicate success.`
                    : `Revenue decline of ${Math.abs(revenueChange).toFixed(1)}% warrants investigation. Review sales pipeline and market conditions.`,
                priority: 'high'
            });
        }

        // Margin analysis
        if (current.grossMargin < 40) {
            insights.push({
                category: 'Profitability',
                insight: `Gross margin of ${current.grossMargin}% is below industry benchmarks. Recommend pricing review or cost optimization.`,
                priority: 'high'
            });
        }

        // Cash flow
        if (current.operatingCashFlow < current.netIncome * 0.8) {
            insights.push({
                category: 'Cash Flow',
                insight: 'Operating cash flow lags net income, suggesting working capital inefficiencies. Review AR/AP management.',
                priority: 'medium'
            });
        }

        return insights;
    }

    generateFinancialRatios(data) {
        return {
            profitability: {
                grossMargin: data.grossMargin,
                operatingMargin: ((data.operatingIncome / data.revenue) * 100).toFixed(1),
                netMargin: ((data.netIncome / data.revenue) * 100).toFixed(1),
                returnOnAssets: 12.5, // Would calculate from actual data
                returnOnEquity: 18.3
            },
            liquidity: {
                currentRatio: 2.81,
                quickRatio: 2.38,
                cashRatio: 0.95
            },
            efficiency: {
                daysReceivable: 45,
                daysPayable: 38,
                inventoryTurnover: 4.7
            },
            leverage: {
                debtToEquity: 0.91,
                debtRatio: 47.5,
                interestCoverage: 8.2
            }
        };
    }

    calculateChanges(current, previous) {
        if (!previous) return {};

        return {
            revenue: this.calcChange(current.revenue, previous.revenue),
            grossProfit: this.calcChange(current.grossProfit, previous.grossProfit),
            netIncome: this.calcChange(current.netIncome, previous.netIncome),
            cashFlow: this.calcChange(current.operatingCashFlow, previous.operatingCashFlow)
        };
    }

    calculateBudgetVariance(actual, budget) {
        if (!budget) return {};

        return {
            revenue: {
                variance: actual.revenue - budget.revenue,
                percent: ((actual.revenue - budget.revenue) / budget.revenue * 100).toFixed(1),
                favorable: actual.revenue >= budget.revenue
            },
            expenses: {
                variance: actual.totalExpenses - budget.expenses,
                percent: ((actual.totalExpenses - budget.expenses) / budget.expenses * 100).toFixed(1),
                favorable: actual.totalExpenses <= budget.expenses
            },
            netIncome: {
                variance: actual.netIncome - budget.netIncome,
                percent: ((actual.netIncome - budget.netIncome) / budget.netIncome * 100).toFixed(1),
                favorable: actual.netIncome >= budget.netIncome
            }
        };
    }

    generateForecast(current, previous) {
        // Simple linear forecast
        const growthRate = previous ? (current.revenue - previous.revenue) / previous.revenue : 0.03;

        return {
            revenue: Math.round(current.revenue * (1 + growthRate)),
            netIncome: Math.round(current.netIncome * (1 + growthRate)),
            cashFlow: Math.round(current.operatingCashFlow * (1 + growthRate * 0.8))
        };
    }

    generateYearEndForecast(current) {
        const currentMonth = new Date().getMonth() + 1;
        const remainingMonths = 12 - currentMonth;

        return {
            projectedRevenue: Math.round(current.revenue * 12),
            projectedNetIncome: Math.round(current.netIncome * 12),
            projectedCashFlow: Math.round(current.operatingCashFlow * 12)
        };
    }

    calcChange(current, previous, isPercent = false) {
        if (!previous || previous === 0) return 0;
        if (isPercent) {
            return current - previous;
        }
        return ((current - previous) / Math.abs(previous)) * 100;
    }

    // =====================================================
    // REPORT GENERATION - POWERPOINT
    // =====================================================

    async generatePowerPointReport(monthKey, reports) {
        if (typeof PptxGenJS === 'undefined') {
            console.warn('PptxGenJS not loaded');
            return;
        }

        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'Lightning Ledgerz';
        pptx.title = `Financial Report - ${this.formatMonth(monthKey)}`;

        // Title Slide
        let slide = pptx.addSlide();
        slide.addText('Financial Report', {
            x: 0.5, y: 2, w: '100%', h: 1,
            fontSize: 44, bold: true, color: 'FFFFFF', align: 'center'
        });
        slide.addText(this.formatMonth(monthKey), {
            x: 0.5, y: 3.2, w: '100%', h: 0.5,
            fontSize: 24, color: 'FF3333', align: 'center'
        });
        slide.addText('Automatically Generated by Lightning Ledgerz', {
            x: 0.5, y: 4, w: '100%', h: 0.5,
            fontSize: 14, color: '888888', align: 'center'
        });
        slide.background = { color: '0A0A1A' };

        // Executive Summary Slide
        const execReport = reports.find(r => r.type === 'executive');
        if (execReport) {
            slide = pptx.addSlide();
            slide.addText('Executive Summary', {
                x: 0.5, y: 0.3, w: 9, h: 0.5,
                fontSize: 28, bold: true, color: 'FF3333'
            });

            // KPIs
            execReport.kpis.forEach((kpi, i) => {
                slide.addText(kpi.label, {
                    x: 0.5 + (i * 2.3), y: 1.2, w: 2, h: 0.3,
                    fontSize: 12, color: '888888'
                });
                slide.addText(kpi.value, {
                    x: 0.5 + (i * 2.3), y: 1.5, w: 2, h: 0.5,
                    fontSize: 24, bold: true, color: 'FFFFFF'
                });
            });

            // Insights
            slide.addText('Key Insights', {
                x: 0.5, y: 2.5, w: 9, h: 0.4,
                fontSize: 18, bold: true, color: 'FFD700'
            });

            execReport.insights.forEach((insight, i) => {
                slide.addText(`• ${insight.insight}`, {
                    x: 0.5, y: 3 + (i * 0.5), w: 9, h: 0.4,
                    fontSize: 12, color: 'CCCCCC'
                });
            });

            slide.background = { color: '0A0A1A' };
        }

        // Download the presentation
        const fileName = `Financial_Report_${monthKey}.pptx`;
        await pptx.writeFile({ fileName });

        return fileName;
    }

    // =====================================================
    // REPORT GENERATION - EXCEL
    // =====================================================

    async generateExcelReport(monthKey, reports) {
        if (typeof XLSX === 'undefined') {
            console.warn('XLSX not loaded');
            return;
        }

        const wb = XLSX.utils.book_new();

        // Executive Summary Sheet
        const execReport = reports.find(r => r.type === 'executive');
        if (execReport) {
            const execData = [
                ['Executive Financial Summary'],
                ['Period:', this.formatMonth(monthKey)],
                ['Generated:', new Date().toLocaleString()],
                [],
                ['Key Performance Indicators'],
                ...execReport.kpis.map(k => [k.label, k.value, k.status]),
                [],
                ['Performance Highlights'],
                ...execReport.highlights.map(h => [h.type, h.text]),
                [],
                ['AI Insights'],
                ...execReport.insights.map(i => [i.category, i.insight, i.priority])
            ];

            const ws = XLSX.utils.aoa_to_sheet(execData);
            XLSX.utils.book_append_sheet(wb, ws, 'Executive Summary');
        }

        // Detailed P&L Sheet
        const detailedReport = reports.find(r => r.type === 'detailed');
        if (detailedReport) {
            const pnlData = [
                ['Profit & Loss Statement'],
                ['Period:', this.formatMonth(monthKey)],
                [],
                ['Revenue'],
                ...(detailedReport.profitAndLoss.revenue || []).map(r => [r.name, r.amount]),
                ['Total Revenue', detailedReport.profitAndLoss.summary?.totalRevenue],
                [],
                ['Cost of Goods Sold'],
                ...(detailedReport.profitAndLoss.cogs || []).map(c => [c.name, c.amount]),
                ['Total COGS', detailedReport.profitAndLoss.summary?.totalCogs],
                ['Gross Profit', detailedReport.profitAndLoss.summary?.grossProfit],
                [],
                ['Operating Expenses'],
                ...(detailedReport.profitAndLoss.expenses || []).map(e => [e.name, e.amount]),
                ['Total Expenses', detailedReport.profitAndLoss.summary?.totalExpenses],
                [],
                ['Net Income', detailedReport.profitAndLoss.summary?.netIncome]
            ];

            const pnlWs = XLSX.utils.aoa_to_sheet(pnlData);
            XLSX.utils.book_append_sheet(wb, pnlWs, 'Profit & Loss');
        }

        // Financial Ratios Sheet
        if (detailedReport?.ratios) {
            const ratioData = [
                ['Financial Ratios'],
                [],
                ['Profitability Ratios'],
                ['Gross Margin', detailedReport.ratios.profitability?.grossMargin + '%'],
                ['Operating Margin', detailedReport.ratios.profitability?.operatingMargin + '%'],
                ['Net Margin', detailedReport.ratios.profitability?.netMargin + '%'],
                [],
                ['Liquidity Ratios'],
                ['Current Ratio', detailedReport.ratios.liquidity?.currentRatio],
                ['Quick Ratio', detailedReport.ratios.liquidity?.quickRatio],
                [],
                ['Efficiency Ratios'],
                ['Days Receivable', detailedReport.ratios.efficiency?.daysReceivable],
                ['Days Payable', detailedReport.ratios.efficiency?.daysPayable],
                [],
                ['Leverage Ratios'],
                ['Debt to Equity', detailedReport.ratios.leverage?.debtToEquity],
                ['Debt Ratio', detailedReport.ratios.leverage?.debtRatio + '%']
            ];

            const ratioWs = XLSX.utils.aoa_to_sheet(ratioData);
            XLSX.utils.book_append_sheet(wb, ratioWs, 'Financial Ratios');
        }

        // Download
        const fileName = `Financial_Report_${monthKey}.xlsx`;
        XLSX.writeFile(wb, fileName);

        return fileName;
    }

    // =====================================================
    // DELIVERY
    // =====================================================

    async deliverReports(reports) {
        const method = this.settings.deliveryMethod;

        switch (method) {
            case 'dashboard':
                this.displayInDashboard(reports);
                break;
            case 'email':
                await this.sendEmail(reports);
                break;
            case 'download':
                // Already downloaded via PowerPoint/Excel generation
                break;
        }
    }

    displayInDashboard(reports) {
        // Store reports for dashboard access (user-specific)
        const storageKey = this.getStorageKey('generated_reports');
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        stored.unshift({
            id: Date.now(),
            generatedAt: new Date().toISOString(),
            reports: reports
        });
        // Keep last 12 reports
        localStorage.setItem(storageKey, JSON.stringify(stored.slice(0, 12)));

        // Update dashboard if visible
        window.dispatchEvent(new CustomEvent('dashboard-reports-update', { detail: reports }));
    }

    async sendEmail(reports) {
        // In production, this would call your email API
        console.log('Email delivery not implemented - would send to:', this.settings.emailRecipients);
    }

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    }

    formatPercent(value) {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    }

    getPreviousMonth(monthKey) {
        const [year, month] = monthKey.split('-').map(Number);
        const prev = new Date(year, month - 2, 1);
        return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    }

    getSameMonthLastYear(monthKey) {
        const [year, month] = monthKey.split('-');
        return `${Number(year) - 1}-${month}`;
    }

    showNotification(message, type = 'info') {
        const existing = document.getElementById('auto-report-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'auto-report-notification';
        notification.innerHTML = `
            <div class="ar-notification ${type}">
                ${type === 'loading' ? '<div class="ar-spinner"></div>' : ''}
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10002;
        `;

        // Add styles if not exists
        if (!document.getElementById('ar-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'ar-notification-styles';
            style.textContent = `
                .ar-notification {
                    background: rgba(0, 0, 0, 0.95);
                    color: #fff;
                    padding: 15px 30px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                }
                .ar-notification.success { border-left: 4px solid #00c853; }
                .ar-notification.error { border-left: 4px solid #ff3333; }
                .ar-notification.loading { border-left: 4px solid #ffd700; }
                .ar-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #ffd700;
                    border-radius: 50%;
                    animation: ar-spin 1s linear infinite;
                }
                @keyframes ar-spin { to { transform: rotate(360deg); } }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        if (type !== 'loading') {
            setTimeout(() => notification.remove(), 5000);
        }
    }

    // =====================================================
    // EVENT LISTENERS
    // =====================================================

    setupEventListeners() {
        // Listen for manual trigger
        window.addEventListener('generate-month-end-report', (e) => {
            const monthKey = e.detail?.monthKey || this.getPreviousMonthKey();
            this.triggerMonthEndReports(monthKey);
        });
    }

    // =====================================================
    // SETTINGS UI
    // =====================================================

    openSettings() {
        const existing = document.getElementById('auto-report-settings');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'auto-report-settings';
        modal.innerHTML = this.getSettingsHTML();
        document.body.appendChild(modal);

        this.injectSettingsStyles();
    }

    getSettingsHTML() {
        return `
        <div class="ars-overlay" onclick="autoReportGenerator.closeSettings()"></div>
        <div class="ars-panel">
            <div class="ars-header">
                <h2>Auto-Report Settings</h2>
                <button class="ars-close" onclick="autoReportGenerator.closeSettings()">&times;</button>
            </div>

            <div class="ars-content">
                <div class="ars-option">
                    <label>
                        <input type="checkbox" id="ars-auto-generate" ${this.settings.autoGenerate ? 'checked' : ''}>
                        Auto-generate reports on month finalization
                    </label>
                </div>

                <div class="ars-section">
                    <h3>Report Types</h3>
                    <label><input type="checkbox" ${this.settings.reportTypes.includes('executive') ? 'checked' : ''} data-type="executive"> Executive Summary</label>
                    <label><input type="checkbox" ${this.settings.reportTypes.includes('detailed') ? 'checked' : ''} data-type="detailed"> Detailed Financial Report</label>
                </div>

                <div class="ars-section">
                    <h3>Include in Reports</h3>
                    <label><input type="checkbox" id="ars-comparison" ${this.settings.includeComparison ? 'checked' : ''}> Month-over-Month Comparison</label>
                    <label><input type="checkbox" id="ars-budget" ${this.settings.includeBudgetVariance ? 'checked' : ''}> Budget vs Actual Variance</label>
                    <label><input type="checkbox" id="ars-forecast" ${this.settings.includeForecasts ? 'checked' : ''}> Forecasts & Projections</label>
                </div>

                <div class="ars-section">
                    <h3>Output Formats</h3>
                    <label><input type="checkbox" id="ars-pptx" ${this.settings.generatePowerPoint ? 'checked' : ''}> Generate PowerPoint</label>
                    <label><input type="checkbox" id="ars-xlsx" ${this.settings.generateExcel ? 'checked' : ''}> Generate Excel</label>
                </div>

                <div class="ars-section">
                    <h3>Delivery</h3>
                    <select id="ars-delivery">
                        <option value="dashboard" ${this.settings.deliveryMethod === 'dashboard' ? 'selected' : ''}>Show in Dashboard</option>
                        <option value="download" ${this.settings.deliveryMethod === 'download' ? 'selected' : ''}>Auto-Download</option>
                        <option value="email" ${this.settings.deliveryMethod === 'email' ? 'selected' : ''}>Email (Coming Soon)</option>
                    </select>
                </div>
            </div>

            <div class="ars-footer">
                <button class="btn btn-secondary" onclick="autoReportGenerator.testGeneration()">Test Generation</button>
                <button class="btn btn-primary" onclick="autoReportGenerator.saveSettingsFromUI()">Save Settings</button>
            </div>
        </div>
        `;
    }

    saveSettingsFromUI() {
        this.settings.autoGenerate = document.getElementById('ars-auto-generate').checked;
        this.settings.includeComparison = document.getElementById('ars-comparison').checked;
        this.settings.includeBudgetVariance = document.getElementById('ars-budget').checked;
        this.settings.includeForecasts = document.getElementById('ars-forecast').checked;
        this.settings.generatePowerPoint = document.getElementById('ars-pptx').checked;
        this.settings.generateExcel = document.getElementById('ars-xlsx').checked;
        this.settings.deliveryMethod = document.getElementById('ars-delivery').value;

        this.saveSettings();
        this.closeSettings();
        this.showNotification('Settings saved!', 'success');
    }

    testGeneration() {
        this.closeSettings();
        this.triggerMonthEndReports(this.getPreviousMonthKey());
    }

    closeSettings() {
        const modal = document.getElementById('auto-report-settings');
        if (modal) modal.remove();
    }

    injectSettingsStyles() {
        if (document.getElementById('ars-styles')) return;

        const style = document.createElement('style');
        style.id = 'ars-styles';
        style.textContent = `
            #auto-report-settings {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100001;
            }
            .ars-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
            }
            .ars-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 500px;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                border-radius: 20px;
                border: 2px solid #ff3333;
                overflow: hidden;
            }
            .ars-header {
                padding: 1.5rem 2rem;
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .ars-header h2 {
                color: #ff3333;
                margin: 0;
            }
            .ars-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .ars-content {
                padding: 2rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            .ars-option {
                margin-bottom: 1.5rem;
            }
            .ars-option label {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #fff;
                cursor: pointer;
            }
            .ars-section {
                margin-bottom: 1.5rem;
            }
            .ars-section h3 {
                color: #ffd700;
                font-size: 0.9rem;
                margin-bottom: 0.75rem;
            }
            .ars-section label {
                display: block;
                color: #ccc;
                padding: 0.5rem 0;
                cursor: pointer;
            }
            .ars-section select {
                width: 100%;
                padding: 0.75rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
            }
            .ars-footer {
                padding: 1.5rem 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize
const autoReportGenerator = new AutoReportGenerator();

// Global functions
window.autoReportGenerator = autoReportGenerator;

window.openAutoReportSettings = function() {
    autoReportGenerator.openSettings();
};

window.generateMonthEndReport = function(monthKey) {
    autoReportGenerator.triggerMonthEndReports(monthKey || autoReportGenerator.getPreviousMonthKey());
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoReportGenerator;
}

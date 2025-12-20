// =====================================================
// LIGHTNING LEDGERZ - REAL POWERPOINT GENERATOR
// =====================================================
// Generates actual .pptx files using PptxGenJS
// Available for Gold and Diamond tier members

class RealPowerPointGenerator {
    constructor() {
        this.pptx = null;
        this.companyName = '';
        this.companyLogo = null;
        this.brandColors = {
            primary: '#ff3333',
            secondary: '#1a1a1a',
            accent: '#ffffff',
            success: '#4caf50',
            warning: '#ffb300'
        };
    }

    // Initialize new presentation
    initialize(companyName, logo = null) {
        this.pptx = new PptxGenJS();
        this.companyName = companyName || 'Lightning Ledgerz';
        this.companyLogo = logo;

        // Set presentation properties
        this.pptx.author = 'Lightning Ledgerz';
        this.pptx.company = this.companyName;
        this.pptx.subject = 'Financial Report';
        this.pptx.title = `${this.companyName} - Financial Report`;

        // Define master slide layout
        this.pptx.defineSlideMaster({
            title: 'LIGHTNING_MASTER',
            background: { color: '1a1a1a' },
            objects: [
                { rect: { x: 0, y: '90%', w: '100%', h: '10%', fill: { color: 'ff3333' } } },
                { text: { text: '© ' + new Date().getFullYear() + ' ' + this.companyName, options: { x: 0.5, y: '93%', w: '50%', h: 0.3, color: 'ffffff', fontSize: 8 } } }
            ]
        });

        return this;
    }

    // Create Title Slide
    addTitleSlide(title, subtitle, date = null) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        // Background gradient effect
        slide.addShape('rect', {
            x: 0, y: 0, w: '100%', h: '100%',
            fill: { type: 'solid', color: '1a1a1a' }
        });

        // Red accent bar at top
        slide.addShape('rect', {
            x: 0, y: 0, w: '100%', h: 0.15,
            fill: { color: 'ff3333' }
        });

        // Company logo if available
        if (this.companyLogo) {
            slide.addImage({
                data: this.companyLogo,
                x: 3.5, y: 1.5, w: 3, h: 1.5,
                sizing: { type: 'contain', w: 3, h: 1.5 }
            });
        }

        // Main title
        slide.addText(title, {
            x: 0.5, y: 3, w: 9, h: 1,
            fontSize: 44, bold: true,
            color: 'ffffff', align: 'center'
        });

        // Subtitle
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.5, y: 4, w: 9, h: 0.5,
                fontSize: 20, color: 'cccccc', align: 'center'
            });
        }

        // Date
        slide.addText(date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), {
            x: 0.5, y: 4.7, w: 9, h: 0.3,
            fontSize: 14, color: '888888', align: 'center'
        });

        return slide;
    }

    // Create Financial Summary Slide
    addFinancialSummarySlide(data) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        // Title
        slide.addText('Financial Summary', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        // Metrics grid
        const metrics = [
            { label: 'Total Revenue', value: this.formatCurrency(data.revenue), change: data.revenueChange },
            { label: 'Total Expenses', value: this.formatCurrency(data.expenses), change: data.expensesChange },
            { label: 'Net Income', value: this.formatCurrency(data.netIncome), change: data.netIncomeChange },
            { label: 'Cash Flow', value: this.formatCurrency(data.cashFlow), change: data.cashFlowChange }
        ];

        metrics.forEach((metric, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 0.5 + (col * 4.75);
            const y = 1.2 + (row * 2);

            // Metric box
            slide.addShape('roundRect', {
                x: x, y: y, w: 4.5, h: 1.8,
                fill: { color: '2a2a2a' },
                line: { color: 'ff3333', width: 1.5 },
                rectRadius: 0.1
            });

            // Label
            slide.addText(metric.label.toUpperCase(), {
                x: x + 0.2, y: y + 0.2, w: 4, h: 0.3,
                fontSize: 11, color: '888888', bold: true
            });

            // Value
            slide.addText(metric.value, {
                x: x + 0.2, y: y + 0.6, w: 4, h: 0.5,
                fontSize: 28, color: 'ffffff', bold: true
            });

            // Change indicator
            const isPositive = metric.change >= 0;
            slide.addText((isPositive ? '+' : '') + metric.change + '%', {
                x: x + 0.2, y: y + 1.2, w: 4, h: 0.3,
                fontSize: 14, color: isPositive ? '4caf50' : 'ff5252', bold: true
            });
        });

        return slide;
    }

    // Create Revenue Breakdown Slide with Pie Chart
    addRevenueBreakdownSlide(categories) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Revenue Breakdown', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        // Prepare chart data
        const chartData = [{
            name: 'Revenue',
            labels: categories.map(c => c.name),
            values: categories.map(c => c.value)
        }];

        // Add pie chart
        slide.addChart(this.pptx.charts.PIE, chartData, {
            x: 0.5, y: 1.2, w: 5, h: 4,
            showLegend: true,
            legendPos: 'r',
            showValue: true,
            showPercent: true,
            chartColors: ['ff3333', '2196f3', '4caf50', 'ffb300', '9c27b0', '00bcd4', 'e91e63', '795548']
        });

        // Add category list on the right
        categories.forEach((cat, i) => {
            slide.addText(`${cat.name}: ${this.formatCurrency(cat.value)}`, {
                x: 6, y: 1.5 + (i * 0.4), w: 3.5, h: 0.35,
                fontSize: 12, color: 'ffffff'
            });
        });

        return slide;
    }

    // Create Expense Analysis Slide with Bar Chart
    addExpenseAnalysisSlide(expenses) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Expense Analysis', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        const chartData = [{
            name: 'Expenses',
            labels: expenses.map(e => e.category),
            values: expenses.map(e => e.amount)
        }];

        slide.addChart(this.pptx.charts.BAR, chartData, {
            x: 0.5, y: 1.2, w: 9, h: 4,
            barDir: 'bar',
            showValue: true,
            chartColors: ['ff3333'],
            catAxisLabelColor: 'ffffff',
            catAxisLabelFontSize: 10,
            valAxisLabelColor: 'ffffff',
            gridLineColor: '333333'
        });

        return slide;
    }

    // Create Monthly Trends Slide with Line Chart
    addMonthlyTrendsSlide(monthlyData) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Monthly Trends', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        const chartData = [
            {
                name: 'Revenue',
                labels: monthlyData.map(m => m.month),
                values: monthlyData.map(m => m.revenue)
            },
            {
                name: 'Expenses',
                labels: monthlyData.map(m => m.month),
                values: monthlyData.map(m => m.expenses)
            }
        ];

        slide.addChart(this.pptx.charts.LINE, chartData, {
            x: 0.5, y: 1.2, w: 9, h: 4,
            showLegend: true,
            legendPos: 'b',
            chartColors: ['4caf50', 'ff3333'],
            lineSmooth: true,
            catAxisLabelColor: 'ffffff',
            valAxisLabelColor: 'ffffff',
            gridLineColor: '333333'
        });

        return slide;
    }

    // Create Budget vs Actual Slide
    addBudgetVsActualSlide(budgetData) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Budget vs Actual', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        const chartData = [
            {
                name: 'Budget',
                labels: budgetData.categories,
                values: budgetData.budgeted
            },
            {
                name: 'Actual',
                labels: budgetData.categories,
                values: budgetData.actual
            }
        ];

        slide.addChart(this.pptx.charts.BAR, chartData, {
            x: 0.5, y: 1.2, w: 9, h: 3.5,
            barDir: 'col',
            barGrouping: 'clustered',
            showValue: true,
            chartColors: ['2196f3', 'ff3333'],
            showLegend: true,
            legendPos: 'b',
            catAxisLabelColor: 'ffffff',
            valAxisLabelColor: 'ffffff',
            gridLineColor: '333333'
        });

        // Variance summary
        slide.addText('Variance Analysis', {
            x: 0.5, y: 4.8, w: 9, h: 0.3,
            fontSize: 14, bold: true, color: 'ffffff'
        });

        return slide;
    }

    // Create Cash Flow Forecast Slide
    addCashFlowForecastSlide(forecastData) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Cash Flow Forecast', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        const chartData = [{
            name: 'Projected Cash Flow',
            labels: forecastData.map(f => f.period),
            values: forecastData.map(f => f.cashFlow)
        }];

        slide.addChart(this.pptx.charts.AREA, chartData, {
            x: 0.5, y: 1.2, w: 9, h: 3.5,
            chartColors: ['ff3333'],
            catAxisLabelColor: 'ffffff',
            valAxisLabelColor: 'ffffff',
            gridLineColor: '333333'
        });

        // Key metrics
        const totalProjected = forecastData.reduce((sum, f) => sum + f.cashFlow, 0);
        slide.addText(`Total Projected: ${this.formatCurrency(totalProjected)}`, {
            x: 0.5, y: 4.9, w: 4, h: 0.3,
            fontSize: 14, bold: true, color: '4caf50'
        });

        return slide;
    }

    // Create Key Metrics Dashboard Slide
    addKeyMetricsSlide(metrics) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Key Performance Indicators', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        const kpis = [
            { label: 'Gross Margin', value: metrics.grossMargin + '%', target: '40%' },
            { label: 'Operating Margin', value: metrics.operatingMargin + '%', target: '15%' },
            { label: 'Net Margin', value: metrics.netMargin + '%', target: '10%' },
            { label: 'Current Ratio', value: metrics.currentRatio, target: '2.0' },
            { label: 'Quick Ratio', value: metrics.quickRatio, target: '1.5' },
            { label: 'Debt-to-Equity', value: metrics.debtToEquity, target: '<1.0' }
        ];

        kpis.forEach((kpi, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = 0.5 + (col * 3.2);
            const y = 1.2 + (row * 2.2);

            // KPI box
            slide.addShape('roundRect', {
                x: x, y: y, w: 3, h: 2,
                fill: { color: '2a2a2a' },
                line: { color: 'ff3333', width: 1 },
                rectRadius: 0.1
            });

            slide.addText(kpi.label, {
                x: x + 0.2, y: y + 0.2, w: 2.6, h: 0.3,
                fontSize: 11, color: '888888', bold: true
            });

            slide.addText(kpi.value, {
                x: x + 0.2, y: y + 0.7, w: 2.6, h: 0.5,
                fontSize: 24, color: 'ffffff', bold: true
            });

            slide.addText('Target: ' + kpi.target, {
                x: x + 0.2, y: y + 1.4, w: 2.6, h: 0.3,
                fontSize: 10, color: '888888'
            });
        });

        return slide;
    }

    // Create Year-over-Year Comparison Slide
    addYoYComparisonSlide(currentYear, previousYear) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Year-over-Year Comparison', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        // Table data
        const rows = [
            ['Metric', 'Last Year', 'This Year', 'Change'],
            ['Revenue', this.formatCurrency(previousYear.revenue), this.formatCurrency(currentYear.revenue), this.calcChange(currentYear.revenue, previousYear.revenue)],
            ['Expenses', this.formatCurrency(previousYear.expenses), this.formatCurrency(currentYear.expenses), this.calcChange(currentYear.expenses, previousYear.expenses)],
            ['Net Income', this.formatCurrency(previousYear.netIncome), this.formatCurrency(currentYear.netIncome), this.calcChange(currentYear.netIncome, previousYear.netIncome)],
            ['Cash Flow', this.formatCurrency(previousYear.cashFlow), this.formatCurrency(currentYear.cashFlow), this.calcChange(currentYear.cashFlow, previousYear.cashFlow)]
        ];

        slide.addTable(rows, {
            x: 0.5, y: 1.2, w: 9, h: 3,
            colW: [2.5, 2, 2, 2.5],
            color: 'ffffff',
            fontSize: 12,
            border: { pt: 1, color: '444444' },
            fill: { color: '2a2a2a' },
            fontFace: 'Arial'
        });

        return slide;
    }

    // Create Strategic Insights Slide
    addInsightsSlide(insights) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Strategic Insights', {
            x: 0.5, y: 0.3, w: 9, h: 0.6,
            fontSize: 32, bold: true, color: 'ff3333'
        });

        insights.forEach((insight, i) => {
            // Bullet point
            slide.addShape('ellipse', {
                x: 0.5, y: 1.3 + (i * 0.8), w: 0.15, h: 0.15,
                fill: { color: 'ff3333' }
            });

            slide.addText(insight, {
                x: 0.8, y: 1.2 + (i * 0.8), w: 8.5, h: 0.7,
                fontSize: 14, color: 'ffffff',
                valign: 'top'
            });
        });

        return slide;
    }

    // Create Thank You / Contact Slide
    addClosingSlide(contactInfo = {}) {
        const slide = this.pptx.addSlide({ masterName: 'LIGHTNING_MASTER' });

        slide.addText('Thank You', {
            x: 0.5, y: 2.5, w: 9, h: 0.8,
            fontSize: 48, bold: true, color: 'ff3333', align: 'center'
        });

        slide.addText('Questions or Comments?', {
            x: 0.5, y: 3.4, w: 9, h: 0.5,
            fontSize: 20, color: 'cccccc', align: 'center'
        });

        if (contactInfo.email || contactInfo.phone) {
            let contactText = '';
            if (contactInfo.email) contactText += contactInfo.email;
            if (contactInfo.phone) contactText += ' | ' + contactInfo.phone;

            slide.addText(contactText, {
                x: 0.5, y: 4.2, w: 9, h: 0.4,
                fontSize: 14, color: '888888', align: 'center'
            });
        }

        // Powered by Lightning Ledgerz
        slide.addText('Powered by Lightning Ledgerz', {
            x: 0.5, y: 5, w: 9, h: 0.3,
            fontSize: 10, color: '666666', align: 'center'
        });

        return slide;
    }

    // Generate and download the PowerPoint
    async generate(filename = 'Financial_Report') {
        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const fullFilename = `${filename}_${dateStr}`;

        try {
            await this.pptx.writeFile({ fileName: fullFilename });
            return { success: true, filename: fullFilename + '.pptx' };
        } catch (error) {
            console.error('PowerPoint generation error:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate a complete financial report deck
    async generateFullReport(data) {
        this.initialize(data.companyName, data.companyLogo);

        // Title slide
        this.addTitleSlide(
            `${data.companyName || 'Company'} Financial Report`,
            data.reportPeriod || 'Q4 2024',
            data.reportDate
        );

        // Financial summary
        if (data.financialSummary) {
            this.addFinancialSummarySlide(data.financialSummary);
        }

        // Revenue breakdown
        if (data.revenueCategories && data.revenueCategories.length > 0) {
            this.addRevenueBreakdownSlide(data.revenueCategories);
        }

        // Expense analysis
        if (data.expenses && data.expenses.length > 0) {
            this.addExpenseAnalysisSlide(data.expenses);
        }

        // Monthly trends
        if (data.monthlyData && data.monthlyData.length > 0) {
            this.addMonthlyTrendsSlide(data.monthlyData);
        }

        // Budget vs Actual
        if (data.budgetData) {
            this.addBudgetVsActualSlide(data.budgetData);
        }

        // Cash flow forecast
        if (data.cashFlowForecast && data.cashFlowForecast.length > 0) {
            this.addCashFlowForecastSlide(data.cashFlowForecast);
        }

        // Key metrics
        if (data.keyMetrics) {
            this.addKeyMetricsSlide(data.keyMetrics);
        }

        // Year-over-year comparison
        if (data.currentYear && data.previousYear) {
            this.addYoYComparisonSlide(data.currentYear, data.previousYear);
        }

        // Insights
        if (data.insights && data.insights.length > 0) {
            this.addInsightsSlide(data.insights);
        }

        // Closing slide
        this.addClosingSlide(data.contactInfo);

        // Generate the file
        return await this.generate(data.filename || `${data.companyName}_Report`);
    }

    // Helper: Format currency
    formatCurrency(value) {
        if (typeof value !== 'number') value = parseFloat(value) || 0;
        return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Helper: Calculate percentage change
    calcChange(current, previous) {
        if (!previous || previous === 0) return 'N/A';
        const change = ((current - previous) / Math.abs(previous)) * 100;
        return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    }
}

// Initialize global instance
window.pptxGenerator = new RealPowerPointGenerator();

// Quick generation function for dashboard button
window.generateQuickPowerPoint = async function() {
    const toast = window.toast || { info: console.log, success: console.log, error: console.log };

    toast.info('Generating PowerPoint...', 'Please wait while we create your presentation');

    // Gather data from the current dashboard
    const data = {
        companyName: window.currentUserProfile?.company_name || 'My Company',
        companyLogo: window.companyLogoData || null,
        reportPeriod: 'Financial Report ' + new Date().getFullYear(),
        reportDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        financialSummary: {
            revenue: window.dashboard_data?.revenue || 125000,
            expenses: window.dashboard_data?.expenses || 85000,
            netIncome: (window.dashboard_data?.revenue || 125000) - (window.dashboard_data?.expenses || 85000),
            cashFlow: window.dashboard_data?.cash_flow || 28000,
            revenueChange: 12.5,
            expensesChange: -3.2,
            netIncomeChange: 18.7,
            cashFlowChange: 8.4
        },
        revenueCategories: window.spending_categories?.map(cat => ({
            name: cat.name,
            value: cat.amount
        })) || [
            { name: 'Product Sales', value: 65000 },
            { name: 'Services', value: 35000 },
            { name: 'Subscriptions', value: 25000 }
        ],
        expenses: window.spending_categories?.map(cat => ({
            category: cat.name,
            amount: cat.spent || cat.amount * 0.7
        })) || [
            { category: 'Operations', amount: 35000 },
            { category: 'Marketing', amount: 20000 },
            { category: 'Salaries', amount: 25000 },
            { category: 'Software', amount: 5000 }
        ],
        monthlyData: generateMonthlyData(),
        keyMetrics: {
            grossMargin: 42.5,
            operatingMargin: 18.3,
            netMargin: 12.8,
            currentRatio: '1.85',
            quickRatio: '1.42',
            debtToEquity: '0.65'
        },
        cashFlowForecast: generateCashFlowForecast(),
        insights: [
            'Revenue growth exceeded projections by 8% this quarter, driven primarily by new customer acquisition.',
            'Operating expenses are trending 5% below budget, indicating improved operational efficiency.',
            'Cash flow remains strong with a 45-day runway improvement compared to last quarter.',
            'Customer retention rate increased to 92%, up from 88% in the previous period.',
            'Recommend increasing marketing spend by 15% to capitalize on current market momentum.'
        ],
        contactInfo: {
            email: window.currentUser?.email || 'contact@company.com'
        },
        filename: (window.currentUserProfile?.company_name || 'Financial').replace(/\s+/g, '_') + '_Report'
    };

    try {
        const result = await window.pptxGenerator.generateFullReport(data);

        if (result.success) {
            toast.success('PowerPoint Generated!', `Downloaded: ${result.filename}`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('PowerPoint generation failed:', error);
        toast.error('Generation Failed', error.message);
    }
};

// Helper: Generate sample monthly data
function generateMonthlyData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 0; i <= currentMonth; i++) {
        const baseRevenue = 10000 + (i * 1000);
        const baseExpenses = 7000 + (i * 500);
        data.push({
            month: months[i],
            revenue: baseRevenue + Math.random() * 2000,
            expenses: baseExpenses + Math.random() * 1000
        });
    }

    return data;
}

// Helper: Generate cash flow forecast
function generateCashFlowForecast() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const forecast = [];
    let cumulative = 50000;

    months.forEach((month, i) => {
        const inflow = 12000 + (i * 500) + Math.random() * 3000;
        const outflow = 9000 + (i * 300) + Math.random() * 2000;
        cumulative += (inflow - outflow);
        forecast.push({
            period: month,
            cashFlow: Math.round(cumulative)
        });
    });

    return forecast;
}

console.log('✅ Real PowerPoint Generator loaded');

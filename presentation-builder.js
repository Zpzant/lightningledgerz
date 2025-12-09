// =====================================================
// LIGHTNING LEDGERZ - PRESENTATION BUILDER
// =====================================================
// Creates professional PowerPoint-style presentations
// with financial data, charts, and company branding

class PresentationBuilder {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.companyInfo = {
            name: '',
            logo: null,
            colors: ['#1a1a1a', '#ff3333', '#ffffff']
        };
    }

    // Template types: modern, corporate, minimal, creative
    createSlideFromTemplate(type, data) {
        const templates = {
            title: this.createTitleSlide.bind(this),
            financial_summary: this.createFinancialSummary.bind(this),
            budget_breakdown: this.createBudgetBreakdown.bind(this),
            trends_analysis: this.createTrendsAnalysis.bind(this),
            comparison: this.createComparisonSlide.bind(this),
            forecast: this.createForecastSlide.bind(this),
            custom: this.createCustomSlide.bind(this)
        };

        if (templates[type]) {
            const slide = templates[type](data);
            this.slides.push(slide);
            return slide;
        }
    }

    createTitleSlide(data) {
        return {
            type: 'title',
            title: data.title || 'Financial Report',
            subtitle: data.subtitle || '',
            companyLogo: this.companyInfo.logo,
            backgroundImage: data.backgroundImage || null,
            layout: 'centered'
        };
    }

    createFinancialSummary(data) {
        return {
            type: 'financial_summary',
            title: data.title || 'Financial Summary',
            metrics: [
                {
                    label: 'Total Revenue',
                    value: data.revenue || '$0',
                    change: data.revenueChange || '+0%'
                },
                {
                    label: 'Total Expenses',
                    value: data.expenses || '$0',
                    change: data.expensesChange || '+0%'
                },
                {
                    label: 'Net Income',
                    value: data.netIncome || '$0',
                    change: data.netIncomeChange || '+0%'
                },
                {
                    label: 'Cash Flow',
                    value: data.cashFlow || '$0',
                    change: data.cashFlowChange || '+0%'
                }
            ],
            chartType: 'metric-cards',
            backgroundImage: data.backgroundImage || null
        };
    }

    createBudgetBreakdown(data) {
        return {
            type: 'budget_breakdown',
            title: data.title || 'Budget Allocation',
            chartType: 'pie',
            categories: data.categories || [],
            layout: 'two-column',
            backgroundImage: data.backgroundImage || null
        };
    }

    createTrendsAnalysis(data) {
        return {
            type: 'trends_analysis',
            title: data.title || 'Financial Trends',
            timeline: data.timeline || [],
            insights: data.insights || [],
            synthesisText: data.synthesisText || '',
            chartType: 'line-area',
            backgroundImage: data.backgroundImage || null
        };
    }

    createComparisonSlide(data) {
        return {
            type: 'comparison',
            title: data.title || 'Year-over-Year Comparison',
            leftMetric: data.leftMetric || {},
            rightMetric: data.rightMetric || {},
            layout: 'split-screen',
            backgroundImage: data.backgroundImage || null
        };
    }

    createForecastSlide(data) {
        return {
            type: 'forecast',
            title: data.title || 'Financial Forecast',
            forecastData: data.forecastData || [],
            timeframe: data.timeframe || '12-month',
            chartType: 'bar-line-combo',
            backgroundImage: data.backgroundImage || null
        };
    }

    createCustomSlide(data) {
        return {
            type: 'custom',
            title: data.title,
            content: data.content,
            layout: data.layout || 'full-width',
            backgroundImage: data.backgroundImage || null,
            elements: data.elements || []
        };
    }

    setCompanyInfo(name, logo, colors) {
        this.companyInfo.name = name;
        this.companyInfo.logo = logo;
        if (colors) this.companyInfo.colors = colors;
    }

    generateHTML() {
        let html = `
            <div class="presentation-container">
                <style>
                    .presentation-container {
                        width: 100%;
                        aspect-ratio: 16/9;
                        background: #1a1a1a;
                        position: relative;
                        overflow: hidden;
                        font-family: 'Arial', sans-serif;
                    }
                    
                    .slide {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        opacity: 0;
                        transition: opacity 0.5s ease;
                        padding: 60px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        background-size: cover;
                        background-position: center;
                    }
                    
                    .slide.active {
                        opacity: 1;
                    }
                    
                    .slide-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.4);
                    }
                    
                    .slide-content {
                        position: relative;
                        z-index: 1;
                        color: white;
                    }
                    
                    .slide-title {
                        font-size: 3.5rem;
                        font-weight: bold;
                        margin-bottom: 30px;
                        color: #ff3333;
                    }
                    
                    .slide-subtitle {
                        font-size: 1.5rem;
                        margin-bottom: 40px;
                        color: #ccc;
                    }
                    
                    .metric-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 30px;
                        margin-top: 40px;
                    }
                    
                    .metric-card {
                        background: rgba(255, 51, 51, 0.1);
                        border: 2px solid #ff3333;
                        border-radius: 10px;
                        padding: 25px;
                        text-align: center;
                    }
                    
                    .metric-label {
                        font-size: 0.9rem;
                        color: #999;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .metric-value {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #fff;
                        margin-bottom: 10px;
                    }
                    
                    .metric-change {
                        font-size: 1rem;
                        color: #4caf50;
                    }
                    
                    .metric-change.negative {
                        color: #ff5252;
                    }
                    
                    .company-logo {
                        max-width: 300px;
                        max-height: 150px;
                        margin: 20px 0;
                    }
                    
                    .disclaimer {
                        position: absolute;
                        bottom: 20px;
                        right: 30px;
                        font-size: 0.8rem;
                        color: #666;
                        text-align: right;
                    }
                    
                    .slide-nav {
                        position: absolute;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 15px;
                        z-index: 100;
                    }
                    
                    .nav-btn {
                        background: #ff3333;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                    
                    .nav-btn:hover {
                        background: #cc0000;
                    }
                    
                    .slide-counter {
                        position: absolute;
                        top: 20px;
                        right: 30px;
                        color: #999;
                        font-size: 0.9rem;
                    }
                </style>
                
                <div class="slide-counter">
                    <span id="slide-number">1</span> / <span id="slide-total">${this.slides.length}</span>
                </div>
        `;

        this.slides.forEach((slide, index) => {
            html += this.renderSlide(slide, index === 0);
        });

        html += `
                <div class="slide-nav">
                    <button class="nav-btn" onclick="presentation.prevSlide()">← Previous</button>
                    <button class="nav-btn" onclick="presentation.nextSlide()">Next →</button>
                </div>
            </div>
        `;

        return html;
    }

    renderSlide(slide, isActive) {
        let html = `<div class="slide ${isActive ? 'active' : ''}" id="slide-${this.slides.indexOf(slide)}">`;
        
        if (slide.backgroundImage) {
            html = `<div class="slide ${isActive ? 'active' : ''}" id="slide-${this.slides.indexOf(slide)}" style="background-image: url('${slide.backgroundImage}')">`;
        }

        html += '<div class="slide-overlay"></div><div class="slide-content">';

        switch (slide.type) {
            case 'title':
                html += this.renderTitleSlide(slide);
                break;
            case 'financial_summary':
                html += this.renderFinancialSummary(slide);
                break;
            case 'budget_breakdown':
                html += this.renderBudgetBreakdown(slide);
                break;
            case 'trends_analysis':
                html += this.renderTrendsAnalysis(slide);
                break;
            case 'comparison':
                html += this.renderComparison(slide);
                break;
            case 'forecast':
                html += this.renderForecast(slide);
                break;
            default:
                html += `<h2 class="slide-title">${slide.title}</h2>`;
        }

        html += `</div>`;
        if (this.companyInfo.name) {
            html += `<div class="disclaimer">© ${new Date().getFullYear()} ${this.companyInfo.name}</div>`;
        }
        html += `</div>`;

        return html;
    }

    renderTitleSlide(slide) {
        return `
            <div style="text-align: center;">
                ${slide.companyLogo ? `<img src="${slide.companyLogo}" class="company-logo" alt="Company Logo">` : ''}
                <h1 class="slide-title">${slide.title}</h1>
                <p class="slide-subtitle">${slide.subtitle}</p>
            </div>
        `;
    }

    renderFinancialSummary(slide) {
        let html = `<h2 class="slide-title">${slide.title}</h2><div class="metric-grid">`;
        slide.metrics.forEach(metric => {
            const isPositive = !metric.change.startsWith('-');
            html += `
                <div class="metric-card">
                    <div class="metric-label">${metric.label}</div>
                    <div class="metric-value">${metric.value}</div>
                    <div class="metric-change ${!isPositive ? 'negative' : ''}">${metric.change}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    renderBudgetBreakdown(slide) {
        return `
            <h2 class="slide-title">${slide.title}</h2>
            <canvas id="budget-chart"></canvas>
            <script>
                new Chart(document.getElementById('budget-chart'), {
                    type: 'doughnut',
                    data: {
                        labels: ${JSON.stringify(slide.categories.map(c => c.name))},
                        datasets: [{
                            data: ${JSON.stringify(slide.categories.map(c => c.value))},
                            backgroundColor: ['#ff3333', '#2196f3', '#4caf50', '#ffb300', '#9c27b0']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { labels: { color: '#fff' } }
                        }
                    }
                });
            </script>
        `;
    }

    renderTrendsAnalysis(slide) {
        return `
            <h2 class="slide-title">${slide.title}</h2>
            <p style="color: #ccc; margin: 20px 0; font-style: italic;">${slide.synthesisText}</p>
            <canvas id="trends-chart" style="max-height: 400px;"></canvas>
        `;
    }

    renderComparison(slide) {
        return `
            <h2 class="slide-title">${slide.title}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
                <div style="text-align: center;">
                    <h3 style="color: #ff3333; margin-bottom: 20px;">${slide.leftMetric.label}</h3>
                    <p style="font-size: 2.5rem; font-weight: bold;">${slide.leftMetric.value}</p>
                </div>
                <div style="text-align: center;">
                    <h3 style="color: #ff3333; margin-bottom: 20px;">${slide.rightMetric.label}</h3>
                    <p style="font-size: 2.5rem; font-weight: bold;">${slide.rightMetric.value}</p>
                </div>
            </div>
        `;
    }

    renderForecast(slide) {
        return `
            <h2 class="slide-title">${slide.title}</h2>
            <p style="color: #999; margin-bottom: 20px;">12-Month Forecast</p>
            <canvas id="forecast-chart" style="max-height: 400px;"></canvas>
        `;
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.currentSlide++;
            this.updateSlideDisplay();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideDisplay();
        }
    }

    updateSlideDisplay() {
        document.querySelectorAll('.slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        document.getElementById('slide-number').textContent = this.currentSlide + 1;
    }

    exportToPowerPoint() {
        // Integration with pptxgen library
        // This would export to actual PowerPoint format
        console.log('Exporting to PowerPoint...');
        // Implementation would use: https://github.com/gitbrent/PptxGenJS
    }
}

// Initialize global presentation instance
let presentation = new PresentationBuilder();

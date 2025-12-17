// =====================================================
// LIGHTNING LEDGERZ - AI FINANCIAL SYNTHESIS
// =====================================================
// Generates verbal and visual synthesis of financial trends

class AIFinancialAnalyst {
    constructor() {
        this.openaiApiKey = null; // Set this from environment or settings
        this.voiceEnabled = true;
        this.synthesisCache = {};
    }

    // Initialize speech synthesis
    initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            return window.speechSynthesis;
        }
        console.warn('Speech Synthesis not supported in this browser');
        return null;
    }

    // Generate verbal analysis of financial data
    async synthesizeFinancialTrends(financialData, voiceEnabled = true) {
        try {
            // Create cache key
            const cacheKey = JSON.stringify(financialData);
            if (this.synthesisCache[cacheKey]) {
                return this.synthesisCache[cacheKey];
            }

            // Generate AI insights text
            let synthesis = this.generateInsightText(financialData);
            
            // Use OpenAI for more sophisticated analysis if API key available
            if (this.openaiApiKey) {
                synthesis = await this.getOpenAIAnalysis(financialData, synthesis);
            }

            // Convert to speech if enabled
            if (voiceEnabled) {
                await this.speakSynthesis(synthesis);
            }

            // Cache result
            this.synthesisCache[cacheKey] = synthesis;
            return synthesis;
        } catch (error) {
            console.error('Synthesis error:', error);
            return this.generateInsightText(financialData);
        }
    }

    generateInsightText(financialData) {
        let text = '';
        
        const {
            revenue = 0,
            expenses = 0,
            profit = 0,
            cashFlow = 0,
            trends = [],
            timeframe = 'current month'
        } = financialData;

        // Opening statement
        text += `Financial Analysis for ${timeframe}. `;

        // Revenue insights
        if (revenue > 0) {
            text += `Total revenue stands at ${this.formatCurrency(revenue)}. `;
        }

        // Expense analysis
        if (expenses > 0) {
            const expenseRatio = ((expenses / revenue) * 100).toFixed(1);
            text += `Expenses total ${this.formatCurrency(expenses)}, accounting for ${expenseRatio} percent of revenue. `;
        }

        // Profitability
        if (profit > 0) {
            const margin = ((profit / revenue) * 100).toFixed(1);
            text += `Net profit is ${this.formatCurrency(profit)}, representing a ${margin} percent profit margin. `;
            if (margin > 30) {
                text += `This indicates strong profitability. `;
            } else if (margin > 10) {
                text += `This shows healthy profitability. `;
            } else {
                text += `This margin could be improved. `;
            }
        } else if (profit < 0) {
            text += `Warning: Operations are currently operating at a loss of ${this.formatCurrency(Math.abs(profit))}. `;
        }

        // Cash flow analysis
        if (cashFlow > 0) {
            text += `Cash flow is positive at ${this.formatCurrency(cashFlow)}, indicating good liquidity. `;
        } else if (cashFlow < 0) {
            text += `Negative cash flow of ${this.formatCurrency(Math.abs(cashFlow))} requires attention to operational efficiency. `;
        }

        // Trend analysis
        if (trends && trends.length > 0) {
            text += this.analyzeTrends(trends);
        }

        // Recommendations
        text += this.generateRecommendations(financialData);

        return text;
    }

    analyzeTrends(trends) {
        let text = 'Trend Analysis: ';
        
        trends.forEach((trend, index) => {
            const direction = trend.value > trend.previousValue ? 'increased' : 'decreased';
            const change = Math.abs(trend.value - trend.previousValue);
            const percentChange = ((change / trend.previousValue) * 100).toFixed(1);
            
            text += `${trend.category} has ${direction} by ${percentChange} percent. `;
        });

        return text;
    }

    generateRecommendations(financialData) {
        let text = 'Recommendations: ';
        const recommendations = [];

        const { revenue = 0, expenses = 0, profit = 0 } = financialData;
        const expenseRatio = expenses / revenue;

        if (expenseRatio > 0.7) {
            recommendations.push('Review and reduce operational expenses.');
        }
        if (expenseRatio < 0.3) {
            recommendations.push('Consider investing in growth initiatives.');
        }
        if (profit > revenue * 0.5) {
            recommendations.push('Maintain current operational efficiency.');
        }
        if (revenue < 10000) {
            recommendations.push('Focus on revenue growth strategies.');
        }

        return recommendations.slice(0, 2).join(' ') || 'Continue monitoring financial performance.';
    }

    speakSynthesis(text) {
        return new Promise((resolve) => {
            const synthesis = this.initSpeechSynthesis();
            if (!synthesis) {
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();

            synthesis.speak(utterance);
        });
    }

    async getOpenAIAnalysis(financialData, initialAnalysis) {
        try {
            // This would require OpenAI API integration
            // Placeholder for future implementation with actual API calls
            console.log('OpenAI analysis would enhance the synthesis here');
            return initialAnalysis;
        } catch (error) {
            console.error('OpenAI error:', error);
            return initialAnalysis;
        }
    }

    formatCurrency(value) {
        return `$${(value / 1000).toFixed(1)}K`;
    }

    generateDashboardChart(financialData) {
        // Generate Chart.js configuration for financial visualization
        return {
            type: 'line',
            data: {
                labels: financialData.timeline || [],
                datasets: [
                    {
                        label: 'Revenue',
                        data: financialData.revenueData || [],
                        borderColor: '#4caf50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: financialData.expenseData || [],
                        borderColor: '#ff5252',
                        backgroundColor: 'rgba(255, 82, 82, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Profit',
                        data: financialData.profitData || [],
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff', font: { size: 12 } }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#999' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#999' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        };
    }

    createPredictiveAnalysis(historicalData) {
        // Simple trend prediction using linear regression
        const predictions = [];
        const months = historicalData.values.length;
        
        // Calculate trend
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        historicalData.values.forEach((value, i) => {
            sumX += i;
            sumY += value;
            sumXY += i * value;
            sumX2 += i * i;
        });

        const n = months;
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Generate predictions for next 6 months
        for (let i = 0; i < 6; i++) {
            predictions.push(intercept + slope * (months + i));
        }

        return {
            trend: slope > 0 ? 'upward' : 'downward',
            predictions: predictions,
            confidence: this.calculateConfidence(historicalData),
            nextMonthForecast: intercept + slope * (months + 1)
        };
    }

    calculateConfidence(data) {
        // Calculate R-squared value for confidence metric
        const mean = data.values.reduce((a, b) => a + b) / data.values.length;
        const ssTotal = data.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
        const ssRes = data.values.reduce((sum, val, i) => sum + Math.pow(val - mean, 2), 0);
        const rSquared = 1 - (ssRes / ssTotal);
        return Math.min(Math.round(rSquared * 100), 95);
    }
}

// Initialize global AI analyst
let aiAnalyst = new AIFinancialAnalyst();

// Usage example:
// const data = {
//     revenue: 50000,
//     expenses: 30000,
//     profit: 20000,
//     cashFlow: 15000,
//     trends: [{category: 'Marketing', value: 5000, previousValue: 4500}]
// };
// aiAnalyst.synthesizeFinancialTrends(data, true);

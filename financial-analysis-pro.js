// =====================================================
// LIGHTNING LEDGERZ - ADVANCED FINANCIAL ANALYSIS PRO
// Professional-grade financial modeling and analysis
// Comparable to Wall Street analyst tools
// =====================================================

class FinancialAnalysisPro {
    constructor() {
        this.scenarios = [];
        this.forecasts = [];
        this.benchmarks = this.getIndustryBenchmarks();
        this.financialData = this.getDefaultFinancialData();
    }

    // =====================================================
    // DEFAULT FINANCIAL DATA (Demo Mode)
    // =====================================================

    getDefaultFinancialData() {
        return {
            revenue: {
                current: 2450000,
                previous: 2180000,
                monthly: [180000, 195000, 210000, 205000, 225000, 235000, 240000, 250000, 245000, 255000, 260000, 250000]
            },
            expenses: {
                cogs: 980000,
                opex: 820000,
                depreciation: 125000,
                interest: 45000,
                taxes: 96000
            },
            balance: {
                cash: 485000,
                receivables: 325000,
                inventory: 180000,
                fixedAssets: 1250000,
                totalAssets: 2240000,
                payables: 220000,
                shortTermDebt: 150000,
                longTermDebt: 420000,
                equity: 1450000
            },
            cashFlow: {
                operating: 320000,
                investing: -180000,
                financing: -85000,
                netChange: 55000
            },
            metrics: {
                employees: 45,
                customers: 1250,
                avgOrderValue: 1960,
                customerAcquisitionCost: 285,
                customerLifetimeValue: 8500,
                churnRate: 0.032
            }
        };
    }

    getIndustryBenchmarks() {
        return {
            technology: {
                grossMargin: 0.65,
                operatingMargin: 0.18,
                netMargin: 0.12,
                currentRatio: 1.8,
                debtToEquity: 0.5,
                roic: 0.15,
                revenueGrowth: 0.20
            },
            retail: {
                grossMargin: 0.35,
                operatingMargin: 0.08,
                netMargin: 0.04,
                currentRatio: 1.4,
                debtToEquity: 0.8,
                roic: 0.10,
                revenueGrowth: 0.05
            },
            manufacturing: {
                grossMargin: 0.28,
                operatingMargin: 0.10,
                netMargin: 0.06,
                currentRatio: 1.6,
                debtToEquity: 0.7,
                roic: 0.12,
                revenueGrowth: 0.04
            },
            services: {
                grossMargin: 0.55,
                operatingMargin: 0.15,
                netMargin: 0.10,
                currentRatio: 1.5,
                debtToEquity: 0.4,
                roic: 0.18,
                revenueGrowth: 0.12
            },
            saas: {
                grossMargin: 0.75,
                operatingMargin: 0.05,
                netMargin: 0.02,
                currentRatio: 2.0,
                debtToEquity: 0.3,
                roic: 0.08,
                revenueGrowth: 0.35,
                nrr: 1.10,
                arr: 2500000,
                cac: 500,
                ltv: 15000
            }
        };
    }

    // =====================================================
    // FINANCIAL RATIOS CALCULATOR
    // =====================================================

    calculateRatios(data = this.financialData) {
        const revenue = data.revenue.current;
        const grossProfit = revenue - data.expenses.cogs;
        const operatingIncome = grossProfit - data.expenses.opex - data.expenses.depreciation;
        const ebit = operatingIncome;
        const ebitda = ebit + data.expenses.depreciation;
        const netIncome = operatingIncome - data.expenses.interest - data.expenses.taxes;

        const currentAssets = data.balance.cash + data.balance.receivables + data.balance.inventory;
        const currentLiabilities = data.balance.payables + data.balance.shortTermDebt;
        const totalDebt = data.balance.shortTermDebt + data.balance.longTermDebt;

        return {
            // Profitability Ratios
            profitability: {
                grossMargin: grossProfit / revenue,
                operatingMargin: operatingIncome / revenue,
                netMargin: netIncome / revenue,
                ebitdaMargin: ebitda / revenue,
                roe: netIncome / data.balance.equity,
                roa: netIncome / data.balance.totalAssets,
                roic: ebit * (1 - 0.21) / (data.balance.equity + totalDebt - data.balance.cash)
            },

            // Liquidity Ratios
            liquidity: {
                currentRatio: currentAssets / currentLiabilities,
                quickRatio: (data.balance.cash + data.balance.receivables) / currentLiabilities,
                cashRatio: data.balance.cash / currentLiabilities,
                workingCapital: currentAssets - currentLiabilities
            },

            // Leverage Ratios
            leverage: {
                debtToEquity: totalDebt / data.balance.equity,
                debtToAssets: totalDebt / data.balance.totalAssets,
                debtToEbitda: totalDebt / ebitda,
                interestCoverage: ebit / data.expenses.interest,
                equityMultiplier: data.balance.totalAssets / data.balance.equity
            },

            // Efficiency Ratios
            efficiency: {
                assetTurnover: revenue / data.balance.totalAssets,
                inventoryTurnover: data.expenses.cogs / data.balance.inventory,
                receivablesTurnover: revenue / data.balance.receivables,
                payablesTurnover: data.expenses.cogs / data.balance.payables,
                dso: 365 / (revenue / data.balance.receivables),
                dpo: 365 / (data.expenses.cogs / data.balance.payables),
                dio: 365 / (data.expenses.cogs / data.balance.inventory),
                ccc: null // Will be calculated
            },

            // Growth Metrics
            growth: {
                revenueGrowth: (revenue - data.revenue.previous) / data.revenue.previous,
                revenueCAGR: null
            },

            // Valuation Metrics (assuming enterprise value)
            valuation: {
                evToRevenue: null,
                evToEbitda: null,
                priceToEarnings: null
            },

            // Cash Flow Metrics
            cashFlow: {
                operatingCashFlow: data.cashFlow.operating,
                freeCashFlow: data.cashFlow.operating + data.cashFlow.investing,
                cashConversion: data.cashFlow.operating / netIncome,
                fcfMargin: (data.cashFlow.operating + data.cashFlow.investing) / revenue
            },

            // Absolute Values
            absolute: {
                revenue,
                grossProfit,
                operatingIncome,
                ebit,
                ebitda,
                netIncome
            }
        };
    }

    // =====================================================
    // SCENARIO ANALYSIS
    // =====================================================

    createScenario(name, assumptions) {
        const baseData = JSON.parse(JSON.stringify(this.financialData));

        // Apply assumptions
        if (assumptions.revenueGrowth) {
            baseData.revenue.current *= (1 + assumptions.revenueGrowth);
        }
        if (assumptions.cogsChange) {
            baseData.expenses.cogs *= (1 + assumptions.cogsChange);
        }
        if (assumptions.opexChange) {
            baseData.expenses.opex *= (1 + assumptions.opexChange);
        }

        const scenario = {
            id: Date.now(),
            name,
            assumptions,
            data: baseData,
            ratios: this.calculateRatios(baseData),
            createdAt: new Date().toISOString()
        };

        this.scenarios.push(scenario);
        return scenario;
    }

    compareScenarios(scenarioIds) {
        const scenarios = scenarioIds.map(id => this.scenarios.find(s => s.id === id)).filter(Boolean);
        return scenarios.map(s => ({
            name: s.name,
            revenue: s.ratios.absolute.revenue,
            netIncome: s.ratios.absolute.netIncome,
            netMargin: s.ratios.profitability.netMargin,
            roic: s.ratios.profitability.roic
        }));
    }

    // =====================================================
    // FINANCIAL FORECASTING
    // =====================================================

    forecastRevenue(years = 5, growthRate = 0.15, decayFactor = 0.85) {
        const projections = [];
        let currentRevenue = this.financialData.revenue.current;
        let currentGrowth = growthRate;

        for (let year = 1; year <= years; year++) {
            currentRevenue *= (1 + currentGrowth);
            projections.push({
                year,
                revenue: Math.round(currentRevenue),
                growthRate: currentGrowth
            });
            currentGrowth *= decayFactor; // Growth rate decays over time
        }

        return projections;
    }

    forecast3Statement(years = 5, assumptions = {}) {
        const defaultAssumptions = {
            revenueGrowth: 0.15,
            grossMarginTarget: 0.60,
            opexPercent: 0.35,
            depreciationPercent: 0.05,
            interestRate: 0.06,
            taxRate: 0.21,
            capexPercent: 0.08,
            wcChangePercent: 0.05,
            dividendPayoutRatio: 0.20
        };

        const a = { ...defaultAssumptions, ...assumptions };
        const projections = [];

        let prevRevenue = this.financialData.revenue.current;
        let prevDebt = this.financialData.balance.longTermDebt + this.financialData.balance.shortTermDebt;
        let prevEquity = this.financialData.balance.equity;
        let prevCash = this.financialData.balance.cash;

        for (let year = 1; year <= years; year++) {
            const revenue = prevRevenue * (1 + a.revenueGrowth);
            const grossProfit = revenue * a.grossMarginTarget;
            const cogs = revenue - grossProfit;
            const opex = revenue * a.opexPercent;
            const depreciation = revenue * a.depreciationPercent;
            const operatingIncome = grossProfit - opex - depreciation;
            const interest = prevDebt * a.interestRate;
            const ebt = operatingIncome - interest;
            const taxes = Math.max(0, ebt * a.taxRate);
            const netIncome = ebt - taxes;

            // Cash Flow
            const capex = revenue * a.capexPercent;
            const wcChange = (revenue - prevRevenue) * a.wcChangePercent;
            const operatingCashFlow = netIncome + depreciation - wcChange;
            const investingCashFlow = -capex;
            const dividends = Math.max(0, netIncome * a.dividendPayoutRatio);
            const debtRepayment = prevDebt * 0.1;
            const financingCashFlow = -dividends - debtRepayment;
            const netCashChange = operatingCashFlow + investingCashFlow + financingCashFlow;

            // Balance Sheet
            const cash = prevCash + netCashChange;
            const debt = prevDebt - debtRepayment;
            const retainedEarnings = netIncome - dividends;
            const equity = prevEquity + retainedEarnings;

            projections.push({
                year,
                incomeStatement: {
                    revenue: Math.round(revenue),
                    cogs: Math.round(cogs),
                    grossProfit: Math.round(grossProfit),
                    opex: Math.round(opex),
                    depreciation: Math.round(depreciation),
                    operatingIncome: Math.round(operatingIncome),
                    interest: Math.round(interest),
                    ebt: Math.round(ebt),
                    taxes: Math.round(taxes),
                    netIncome: Math.round(netIncome)
                },
                cashFlow: {
                    operatingCashFlow: Math.round(operatingCashFlow),
                    capex: Math.round(capex),
                    investingCashFlow: Math.round(investingCashFlow),
                    dividends: Math.round(dividends),
                    debtRepayment: Math.round(debtRepayment),
                    financingCashFlow: Math.round(financingCashFlow),
                    netCashChange: Math.round(netCashChange),
                    fcf: Math.round(operatingCashFlow + investingCashFlow)
                },
                balanceSheet: {
                    cash: Math.round(cash),
                    debt: Math.round(debt),
                    equity: Math.round(equity)
                },
                metrics: {
                    grossMargin: grossProfit / revenue,
                    operatingMargin: operatingIncome / revenue,
                    netMargin: netIncome / revenue,
                    fcfMargin: (operatingCashFlow + investingCashFlow) / revenue,
                    revenueGrowth: (revenue - prevRevenue) / prevRevenue,
                    roic: (operatingIncome * (1 - a.taxRate)) / (equity + debt - cash)
                }
            });

            // Update for next iteration
            prevRevenue = revenue;
            prevDebt = debt;
            prevEquity = equity;
            prevCash = cash;
        }

        return projections;
    }

    // =====================================================
    // DCF VALUATION
    // =====================================================

    dcfValuation(fcfProjections, assumptions = {}) {
        const defaultAssumptions = {
            wacc: 0.10,
            terminalGrowthRate: 0.025,
            sharesOutstanding: 1000000
        };

        const a = { ...defaultAssumptions, ...assumptions };

        // Calculate present value of projected FCFs
        let pvFcf = 0;
        const years = fcfProjections.length;

        fcfProjections.forEach((proj, i) => {
            const year = i + 1;
            const discountFactor = Math.pow(1 + a.wacc, year);
            const pv = proj.cashFlow.fcf / discountFactor;
            pvFcf += pv;
        });

        // Terminal value using Gordon Growth Model
        const lastFcf = fcfProjections[years - 1].cashFlow.fcf;
        const terminalValue = (lastFcf * (1 + a.terminalGrowthRate)) / (a.wacc - a.terminalGrowthRate);
        const pvTerminalValue = terminalValue / Math.pow(1 + a.wacc, years);

        const enterpriseValue = pvFcf + pvTerminalValue;
        const netDebt = (this.financialData.balance.shortTermDebt + this.financialData.balance.longTermDebt) - this.financialData.balance.cash;
        const equityValue = enterpriseValue - netDebt;
        const sharePrice = equityValue / a.sharesOutstanding;

        return {
            pvFcf: Math.round(pvFcf),
            terminalValue: Math.round(terminalValue),
            pvTerminalValue: Math.round(pvTerminalValue),
            enterpriseValue: Math.round(enterpriseValue),
            netDebt: Math.round(netDebt),
            equityValue: Math.round(equityValue),
            sharePrice: sharePrice.toFixed(2),
            impliedMultiples: {
                evToRevenue: (enterpriseValue / this.financialData.revenue.current).toFixed(2),
                evToEbitda: (enterpriseValue / (this.calculateRatios().absolute.ebitda)).toFixed(2)
            }
        };
    }

    // =====================================================
    // SENSITIVITY ANALYSIS
    // =====================================================

    sensitivityAnalysis(baseCase, variable1, variable2, range1, range2) {
        const results = [];

        for (const v1 of range1) {
            const row = [];
            for (const v2 of range2) {
                const assumptions = {
                    [variable1]: v1,
                    [variable2]: v2
                };
                const projection = this.forecast3Statement(5, assumptions);
                const valuation = this.dcfValuation(projection);
                row.push(valuation.sharePrice);
            }
            results.push(row);
        }

        return {
            variable1,
            variable2,
            range1,
            range2,
            results
        };
    }

    // =====================================================
    // BREAK-EVEN ANALYSIS
    // =====================================================

    breakEvenAnalysis() {
        const data = this.financialData;
        const revenue = data.revenue.current;
        const variableCosts = data.expenses.cogs;
        const fixedCosts = data.expenses.opex + data.expenses.depreciation + data.expenses.interest;

        const contributionMargin = (revenue - variableCosts) / revenue;
        const breakEvenRevenue = fixedCosts / contributionMargin;
        const breakEvenUnits = breakEvenRevenue / data.metrics.avgOrderValue;
        const marginOfSafety = (revenue - breakEvenRevenue) / revenue;

        return {
            fixedCosts: Math.round(fixedCosts),
            variableCostRatio: variableCosts / revenue,
            contributionMargin,
            breakEvenRevenue: Math.round(breakEvenRevenue),
            breakEvenUnits: Math.round(breakEvenUnits),
            currentRevenue: revenue,
            marginOfSafety,
            operatingLeverage: (revenue - variableCosts) / (revenue - variableCosts - fixedCosts)
        };
    }

    // =====================================================
    // CASH FLOW WATERFALL
    // =====================================================

    cashFlowWaterfall() {
        const data = this.financialData;
        const ratios = this.calculateRatios();

        return [
            { label: 'Net Income', value: ratios.absolute.netIncome, type: 'start' },
            { label: '+ Depreciation', value: data.expenses.depreciation, type: 'add' },
            { label: '- Working Capital', value: -45000, type: 'subtract' },
            { label: 'Operating CF', value: data.cashFlow.operating, type: 'subtotal' },
            { label: '- CapEx', value: data.cashFlow.investing, type: 'subtract' },
            { label: 'Free Cash Flow', value: data.cashFlow.operating + data.cashFlow.investing, type: 'subtotal' },
            { label: '- Debt Repayment', value: -50000, type: 'subtract' },
            { label: '- Dividends', value: -35000, type: 'subtract' },
            { label: 'Net Cash Change', value: data.cashFlow.netChange, type: 'total' }
        ];
    }

    // =====================================================
    // DU PONT ANALYSIS
    // =====================================================

    duPontAnalysis() {
        const ratios = this.calculateRatios();

        // 3-Step DuPont: ROE = Net Margin × Asset Turnover × Equity Multiplier
        const netMargin = ratios.profitability.netMargin;
        const assetTurnover = ratios.efficiency.assetTurnover;
        const equityMultiplier = ratios.leverage.equityMultiplier;
        const calculatedRoe = netMargin * assetTurnover * equityMultiplier;

        // 5-Step DuPont breakdown
        const taxBurden = 1 - (this.financialData.expenses.taxes / (ratios.absolute.ebit - this.financialData.expenses.interest));
        const interestBurden = (ratios.absolute.ebit - this.financialData.expenses.interest) / ratios.absolute.ebit;
        const ebitMargin = ratios.absolute.ebit / this.financialData.revenue.current;

        return {
            threeStep: {
                netMargin,
                assetTurnover,
                equityMultiplier,
                roe: calculatedRoe
            },
            fiveStep: {
                taxBurden,
                interestBurden,
                ebitMargin,
                assetTurnover,
                equityMultiplier
            },
            analysis: {
                primaryDriver: netMargin > assetTurnover ? 'Profitability' : 'Efficiency',
                leverageImpact: equityMultiplier > 2 ? 'High' : 'Moderate',
                recommendation: this.getDuPontRecommendation(netMargin, assetTurnover, equityMultiplier)
            }
        };
    }

    getDuPontRecommendation(netMargin, assetTurnover, equityMultiplier) {
        if (netMargin < 0.05) {
            return 'Focus on improving profit margins through cost reduction or pricing optimization.';
        } else if (assetTurnover < 0.8) {
            return 'Asset utilization is low. Consider optimizing inventory or improving sales efficiency.';
        } else if (equityMultiplier > 3) {
            return 'High financial leverage increases risk. Consider reducing debt levels.';
        }
        return 'Financial metrics are balanced. Continue monitoring for optimization opportunities.';
    }

    // =====================================================
    // SAAS METRICS (for SaaS companies)
    // =====================================================

    calculateSaaSMetrics() {
        const metrics = this.financialData.metrics;
        const revenue = this.financialData.revenue;

        const mrr = revenue.current / 12;
        const arr = mrr * 12;
        const arpu = mrr / metrics.customers;
        const ltv = arpu * 12 / metrics.churnRate;
        const cac = metrics.customerAcquisitionCost;
        const ltvCacRatio = ltv / cac;
        const paybackPeriod = cac / arpu;

        // Magic Number (SaaS efficiency metric)
        const quarterlyRevGrowth = (revenue.current - revenue.previous) / 4;
        const estimatedSalesMarketing = this.financialData.expenses.opex * 0.4;
        const magicNumber = quarterlyRevGrowth / (estimatedSalesMarketing / 4);

        // Rule of 40
        const growthRate = (revenue.current - revenue.previous) / revenue.previous;
        const netMargin = this.calculateRatios().profitability.netMargin;
        const ruleOf40 = (growthRate * 100) + (netMargin * 100);

        return {
            mrr: Math.round(mrr),
            arr: Math.round(arr),
            arpu: Math.round(arpu),
            customers: metrics.customers,
            churnRate: metrics.churnRate,
            ltv: Math.round(ltv),
            cac: cac,
            ltvCacRatio: ltvCacRatio.toFixed(2),
            paybackPeriod: paybackPeriod.toFixed(1),
            magicNumber: magicNumber.toFixed(2),
            ruleOf40: ruleOf40.toFixed(1),
            analysis: {
                ltvCacHealth: ltvCacRatio >= 3 ? 'Healthy' : ltvCacRatio >= 1 ? 'Needs Improvement' : 'Critical',
                paybackHealth: paybackPeriod <= 12 ? 'Healthy' : paybackPeriod <= 18 ? 'Acceptable' : 'Too Long',
                ruleOf40Health: ruleOf40 >= 40 ? 'Excellent' : ruleOf40 >= 25 ? 'Good' : 'Needs Work',
                magicNumberHealth: magicNumber >= 0.75 ? 'Efficient' : magicNumber >= 0.5 ? 'Average' : 'Inefficient'
            }
        };
    }

    // =====================================================
    // BENCHMARKING
    // =====================================================

    benchmarkAnalysis(industry = 'technology') {
        const benchmark = this.benchmarks[industry];
        const ratios = this.calculateRatios();

        const comparisons = {
            grossMargin: {
                company: ratios.profitability.grossMargin,
                industry: benchmark.grossMargin,
                variance: ratios.profitability.grossMargin - benchmark.grossMargin,
                status: ratios.profitability.grossMargin >= benchmark.grossMargin ? 'above' : 'below'
            },
            operatingMargin: {
                company: ratios.profitability.operatingMargin,
                industry: benchmark.operatingMargin,
                variance: ratios.profitability.operatingMargin - benchmark.operatingMargin,
                status: ratios.profitability.operatingMargin >= benchmark.operatingMargin ? 'above' : 'below'
            },
            netMargin: {
                company: ratios.profitability.netMargin,
                industry: benchmark.netMargin,
                variance: ratios.profitability.netMargin - benchmark.netMargin,
                status: ratios.profitability.netMargin >= benchmark.netMargin ? 'above' : 'below'
            },
            currentRatio: {
                company: ratios.liquidity.currentRatio,
                industry: benchmark.currentRatio,
                variance: ratios.liquidity.currentRatio - benchmark.currentRatio,
                status: ratios.liquidity.currentRatio >= benchmark.currentRatio ? 'above' : 'below'
            },
            debtToEquity: {
                company: ratios.leverage.debtToEquity,
                industry: benchmark.debtToEquity,
                variance: benchmark.debtToEquity - ratios.leverage.debtToEquity,
                status: ratios.leverage.debtToEquity <= benchmark.debtToEquity ? 'above' : 'below'
            },
            roic: {
                company: ratios.profitability.roic,
                industry: benchmark.roic,
                variance: ratios.profitability.roic - benchmark.roic,
                status: ratios.profitability.roic >= benchmark.roic ? 'above' : 'below'
            }
        };

        const overallScore = Object.values(comparisons).filter(c => c.status === 'above').length / Object.keys(comparisons).length;

        return {
            industry,
            comparisons,
            overallScore,
            grade: overallScore >= 0.8 ? 'A' : overallScore >= 0.6 ? 'B' : overallScore >= 0.4 ? 'C' : 'D',
            summary: this.generateBenchmarkSummary(comparisons, industry)
        };
    }

    generateBenchmarkSummary(comparisons, industry) {
        const strengths = [];
        const weaknesses = [];

        Object.entries(comparisons).forEach(([metric, data]) => {
            const formattedMetric = metric.replace(/([A-Z])/g, ' $1').toLowerCase();
            if (data.status === 'above') {
                strengths.push(formattedMetric);
            } else {
                weaknesses.push(formattedMetric);
            }
        });

        let summary = `Compared to ${industry} industry benchmarks: `;
        if (strengths.length > 0) {
            summary += `Strong performance in ${strengths.join(', ')}. `;
        }
        if (weaknesses.length > 0) {
            summary += `Areas for improvement: ${weaknesses.join(', ')}.`;
        }

        return summary;
    }

    // =====================================================
    // GENERATE EXECUTIVE SUMMARY
    // =====================================================

    generateExecutiveSummary() {
        const ratios = this.calculateRatios();
        const saas = this.calculateSaaSMetrics();
        const benchmark = this.benchmarkAnalysis('technology');
        const breakeven = this.breakEvenAnalysis();
        const dupont = this.duPontAnalysis();

        return {
            headline: this.generateHeadline(ratios),
            keyMetrics: {
                revenue: this.financialData.revenue.current,
                revenueGrowth: ratios.growth.revenueGrowth,
                netIncome: ratios.absolute.netIncome,
                netMargin: ratios.profitability.netMargin,
                roic: ratios.profitability.roic,
                freeCashFlow: ratios.cashFlow.freeCashFlow
            },
            healthScore: this.calculateHealthScore(ratios, saas),
            insights: this.generateInsights(ratios, saas, benchmark, breakeven),
            recommendations: this.generateRecommendations(ratios, saas, benchmark),
            risks: this.identifyRisks(ratios, saas)
        };
    }

    generateHeadline(ratios) {
        const growth = ratios.growth.revenueGrowth;
        const margin = ratios.profitability.netMargin;

        if (growth > 0.20 && margin > 0.10) {
            return '📈 Strong Growth with Healthy Margins';
        } else if (growth > 0.15) {
            return '🚀 Rapid Growth Phase - Monitor Profitability';
        } else if (margin > 0.15) {
            return '💰 Highly Profitable - Opportunity to Invest in Growth';
        } else if (growth > 0 && margin > 0) {
            return '📊 Stable Performance - Optimization Opportunities Exist';
        } else {
            return '⚠️ Attention Required - Review Strategic Priorities';
        }
    }

    calculateHealthScore(ratios, saas) {
        let score = 50; // Base score

        // Profitability (max +20)
        if (ratios.profitability.netMargin > 0.15) score += 20;
        else if (ratios.profitability.netMargin > 0.08) score += 12;
        else if (ratios.profitability.netMargin > 0) score += 5;

        // Growth (max +15)
        if (ratios.growth.revenueGrowth > 0.25) score += 15;
        else if (ratios.growth.revenueGrowth > 0.10) score += 10;
        else if (ratios.growth.revenueGrowth > 0) score += 5;

        // Liquidity (max +10)
        if (ratios.liquidity.currentRatio > 2) score += 10;
        else if (ratios.liquidity.currentRatio > 1.5) score += 7;
        else if (ratios.liquidity.currentRatio > 1) score += 3;

        // Leverage (max +10)
        if (ratios.leverage.debtToEquity < 0.5) score += 10;
        else if (ratios.leverage.debtToEquity < 1) score += 6;
        else if (ratios.leverage.debtToEquity < 2) score += 2;

        // Cash Flow (max +5)
        if (ratios.cashFlow.freeCashFlow > 0) score += 5;

        return Math.min(100, Math.max(0, score));
    }

    generateInsights(ratios, saas, benchmark, breakeven) {
        const insights = [];

        // Revenue insight
        const growthPercent = (ratios.growth.revenueGrowth * 100).toFixed(1);
        insights.push({
            category: 'Revenue',
            insight: `Revenue grew ${growthPercent}% YoY, ${benchmark.comparisons.operatingMargin.status} industry average.`,
            impact: ratios.growth.revenueGrowth > 0.10 ? 'positive' : 'neutral'
        });

        // Margin insight
        insights.push({
            category: 'Profitability',
            insight: `Net margin of ${(ratios.profitability.netMargin * 100).toFixed(1)}% with ROIC of ${(ratios.profitability.roic * 100).toFixed(1)}%.`,
            impact: ratios.profitability.netMargin > 0.10 ? 'positive' : 'neutral'
        });

        // Cash insight
        insights.push({
            category: 'Cash Position',
            insight: `Operating cash flow of $${(ratios.cashFlow.operatingCashFlow / 1000).toFixed(0)}K with ${(breakeven.marginOfSafety * 100).toFixed(0)}% margin of safety.`,
            impact: breakeven.marginOfSafety > 0.20 ? 'positive' : 'warning'
        });

        // SaaS insight if applicable
        if (saas.ltvCacRatio > 0) {
            insights.push({
                category: 'Unit Economics',
                insight: `LTV/CAC ratio of ${saas.ltvCacRatio}x with ${saas.paybackPeriod} month payback period.`,
                impact: parseFloat(saas.ltvCacRatio) >= 3 ? 'positive' : 'warning'
            });
        }

        return insights;
    }

    generateRecommendations(ratios, saas, benchmark) {
        const recommendations = [];

        if (ratios.profitability.grossMargin < benchmark.comparisons.grossMargin.industry) {
            recommendations.push({
                priority: 'high',
                area: 'Gross Margin',
                action: 'Negotiate better supplier terms or optimize product mix to improve gross margin.',
                potentialImpact: 'Could add $' + Math.round((benchmark.comparisons.grossMargin.industry - ratios.profitability.grossMargin) * this.financialData.revenue.current / 1000) + 'K to bottom line.'
            });
        }

        if (ratios.efficiency.dso > 45) {
            recommendations.push({
                priority: 'medium',
                area: 'Collections',
                action: 'Implement stricter credit policies and follow-up procedures to reduce DSO.',
                potentialImpact: 'Could free up $' + Math.round((ratios.efficiency.dso - 30) * this.financialData.revenue.current / 365 / 1000) + 'K in working capital.'
            });
        }

        if (ratios.leverage.debtToEquity > 1) {
            recommendations.push({
                priority: 'medium',
                area: 'Capital Structure',
                action: 'Consider debt reduction to lower financial risk and interest expense.',
                potentialImpact: 'Could save $' + Math.round(this.financialData.expenses.interest * 0.25 / 1000) + 'K annually in interest.'
            });
        }

        if (parseFloat(saas.ltvCacRatio) < 3) {
            recommendations.push({
                priority: 'high',
                area: 'Customer Economics',
                action: 'Focus on reducing CAC through better targeting or increasing LTV through upselling.',
                potentialImpact: 'Improving LTV/CAC to 3x would significantly boost company valuation.'
            });
        }

        return recommendations;
    }

    identifyRisks(ratios, saas) {
        const risks = [];

        if (ratios.liquidity.currentRatio < 1.2) {
            risks.push({
                severity: 'high',
                area: 'Liquidity',
                description: 'Current ratio is below comfortable levels. May face difficulty meeting short-term obligations.',
                mitigation: 'Build cash reserves or secure credit facility.'
            });
        }

        if (ratios.leverage.interestCoverage < 3) {
            risks.push({
                severity: 'medium',
                area: 'Debt Service',
                description: 'Interest coverage is relatively low, limiting financial flexibility.',
                mitigation: 'Focus on debt reduction or improving operating income.'
            });
        }

        if (saas.churnRate > 0.05) {
            risks.push({
                severity: 'medium',
                area: 'Customer Retention',
                description: 'Monthly churn rate above 5% will limit growth potential.',
                mitigation: 'Invest in customer success and product improvements.'
            });
        }

        if (ratios.growth.revenueGrowth < 0) {
            risks.push({
                severity: 'high',
                area: 'Revenue Decline',
                description: 'Negative revenue growth indicates market share loss or demand issues.',
                mitigation: 'Review product-market fit and competitive positioning.'
            });
        }

        return risks;
    }

    // =====================================================
    // UI RENDERING
    // =====================================================

    renderAnalysisUI() {
        const container = document.createElement('div');
        container.id = 'financial-analysis-modal';
        container.className = 'modal-enhanced';

        const summary = this.generateExecutiveSummary();
        const ratios = this.calculateRatios();

        container.innerHTML = `
            <div class="modal-backdrop" onclick="window.financialAnalysisPro.closeUI()"></div>
            <div class="modal-content" style="max-width:900px;max-height:90vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <h2 style="color:#f39c12;margin:0;">📊 Financial Analysis Pro</h2>
                    <button onclick="window.financialAnalysisPro.closeUI()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                </div>

                <!-- Health Score -->
                <div class="glass-card" style="padding:24px;margin-bottom:24px;text-align:center;">
                    <div style="font-size:48px;font-weight:700;color:${summary.healthScore >= 70 ? '#00d97e' : summary.healthScore >= 50 ? '#f39c12' : '#e63757'};">
                        ${summary.healthScore}
                    </div>
                    <div style="color:#888;margin-bottom:8px;">Financial Health Score</div>
                    <div style="font-size:18px;">${summary.headline}</div>
                </div>

                <!-- Key Metrics Grid -->
                <div class="grid-responsive grid-3" style="margin-bottom:24px;">
                    <div class="metric-card">
                        <div class="metric-label">Revenue</div>
                        <div class="metric-value">$${(summary.keyMetrics.revenue / 1000000).toFixed(2)}M</div>
                        <div class="metric-change ${summary.keyMetrics.revenueGrowth >= 0 ? 'positive' : 'negative'}">
                            ${summary.keyMetrics.revenueGrowth >= 0 ? '▲' : '▼'} ${Math.abs(summary.keyMetrics.revenueGrowth * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Net Income</div>
                        <div class="metric-value">$${(summary.keyMetrics.netIncome / 1000).toFixed(0)}K</div>
                        <div class="metric-change positive">${(summary.keyMetrics.netMargin * 100).toFixed(1)}% margin</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Free Cash Flow</div>
                        <div class="metric-value">$${(summary.keyMetrics.freeCashFlow / 1000).toFixed(0)}K</div>
                        <div class="metric-change positive">${(summary.keyMetrics.roic * 100).toFixed(1)}% ROIC</div>
                    </div>
                </div>

                <!-- Insights -->
                <div class="glass-card" style="padding:24px;margin-bottom:24px;">
                    <h3 style="color:#f39c12;margin:0 0 16px 0;">💡 Key Insights</h3>
                    ${summary.insights.map(insight => `
                        <div class="insight-card" style="margin-bottom:12px;">
                            <h4 style="margin:0 0 8px 0;color:${insight.impact === 'positive' ? '#00d97e' : insight.impact === 'warning' ? '#f39c12' : '#888'};">
                                ${insight.impact === 'positive' ? '✓' : insight.impact === 'warning' ? '⚠' : 'ℹ'} ${insight.category}
                            </h4>
                            <p style="margin:0;color:#bbb;">${insight.insight}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Recommendations -->
                ${summary.recommendations.length > 0 ? `
                    <div class="glass-card" style="padding:24px;margin-bottom:24px;">
                        <h3 style="color:#f39c12;margin:0 0 16px 0;">📈 Recommendations</h3>
                        ${summary.recommendations.map(rec => `
                            <div style="padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;margin-bottom:12px;border-left:4px solid ${rec.priority === 'high' ? '#e63757' : '#f39c12'};">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                    <strong>${rec.area}</strong>
                                    <span style="font-size:12px;padding:4px 8px;border-radius:12px;background:${rec.priority === 'high' ? 'rgba(230,55,87,0.2)' : 'rgba(243,156,18,0.2)'};color:${rec.priority === 'high' ? '#e63757' : '#f39c12'};">
                                        ${rec.priority.toUpperCase()} PRIORITY
                                    </span>
                                </div>
                                <p style="margin:0 0 8px 0;color:#bbb;">${rec.action}</p>
                                <p style="margin:0;color:#00d97e;font-size:13px;">${rec.potentialImpact}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Risks -->
                ${summary.risks.length > 0 ? `
                    <div class="glass-card" style="padding:24px;">
                        <h3 style="color:#e63757;margin:0 0 16px 0;">⚠️ Risk Factors</h3>
                        ${summary.risks.map(risk => `
                            <div style="padding:16px;background:rgba(230,55,87,0.05);border-radius:12px;margin-bottom:12px;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                    <strong style="color:#e63757;">${risk.area}</strong>
                                    <span style="font-size:12px;color:#888;">${risk.severity.toUpperCase()} SEVERITY</span>
                                </div>
                                <p style="margin:0 0 8px 0;color:#bbb;">${risk.description}</p>
                                <p style="margin:0;color:#f39c12;font-size:13px;">Mitigation: ${risk.mitigation}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(container);
        setTimeout(() => container.classList.add('active'), 10);
    }

    closeUI() {
        const modal = document.getElementById('financial-analysis-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Initialize globally
window.financialAnalysisPro = new FinancialAnalysisPro();

// Add to quick actions
document.addEventListener('DOMContentLoaded', () => {
    // Add command to command palette
    if (window.commandPalette) {
        window.commandPalette.commands.push({
            icon: '📊',
            title: 'Financial Analysis Pro',
            desc: 'Advanced financial modeling and analysis',
            action: () => window.financialAnalysisPro.renderAnalysisUI()
        });
    }
});

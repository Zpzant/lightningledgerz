// =====================================================
// LIGHTNING LEDGERZ - PROFESSIONAL FINANCIAL REPORTS
// McKinsey-quality Excel workbooks with charts & formulas
// Restaurant, Hotel, M&A models with DSCR analysis
// Budget vs Actual, Waterfall charts, Pie charts
// =====================================================

class FinancialReports {
    constructor() {
        this.reportData = null;
        this.projectionMethod = 'trailing12'; // trailing12, sameMonthLY, averageLY
        this.trailingMonths = 12;

        // Professional color schemes
        this.colorSchemes = {
            corporate: {
                primary: '1F4E79',
                secondary: '2E75B6',
                accent: 'FFC000',
                positive: '70AD47',
                negative: 'C00000',
                neutral: '7F7F7F',
                background: 'F2F2F2'
            },
            lightning: {
                primary: 'CC0000',
                secondary: 'FF3333',
                accent: 'FFD700',
                positive: '28A745',
                negative: 'DC3545',
                neutral: '6C757D',
                background: 'F8F9FA'
            },
            navy: {
                primary: '1B365D',
                secondary: '4A6FA5',
                accent: 'E8B923',
                positive: '4CAF50',
                negative: 'F44336',
                neutral: '9E9E9E',
                background: 'ECEFF1'
            }
        };

        this.currentScheme = 'corporate';

        // 4K Image Database - Professional photos from Unsplash
        this.imageDatabase = {
            skyscrapers: [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=3840&q=100',
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=3840&q=100',
                'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=3840&q=100',
                'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=3840&q=100',
                'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=3840&q=100',
                'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=3840&q=100',
                'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=3840&q=100',
                'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=3840&q=100'
            ],
            mountains: [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=3840&q=100',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=3840&q=100',
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=3840&q=100',
                'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=3840&q=100',
                'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=3840&q=100',
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=3840&q=100',
                'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=3840&q=100'
            ],
            seascapes: [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=3840&q=100',
                'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=3840&q=100',
                'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=3840&q=100',
                'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=3840&q=100',
                'https://images.unsplash.com/photo-1476673160081-cf065bc4cafe?w=3840&q=100',
                'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=3840&q=100'
            ],
            business: [
                'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=3840&q=100',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=3840&q=100',
                'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=3840&q=100',
                'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=3840&q=100',
                'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=3840&q=100'
            ],
            finance: [
                'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=3840&q=100',
                'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=3840&q=100',
                'https://images.unsplash.com/photo-1565514020179-026b92b2d5b2?w=3840&q=100',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=3840&q=100',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=3840&q=100'
            ],
            realEstate: [
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=3840&q=100',
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=3840&q=100',
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=3840&q=100',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=3840&q=100',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=3840&q=100'
            ],
            houston: [
                'https://images.unsplash.com/photo-1548097227-9d8da47ab7c9?w=3840&q=100',
                'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?w=3840&q=100'
            ]
        };
    }

    // =========================================================
    // RESTAURANT FINANCIAL MODEL
    // =========================================================
    createRestaurantModel(inputs) {
        const {
            restaurantName = 'Restaurant',
            coversPerNight = 100,
            avgPricePerCover = 45,
            daysOpen = 30,
            drinkRevPercent = 25, // % of food revenue
            foodCOGS = 30, // % of food revenue
            drinkCOGS = 20, // % of drink revenue
            laborPercent = 30,
            rentMonthly = 8000,
            utilities = 1500,
            marketing = 1000,
            insurance = 500,
            otherExpenses = 1000,
            seasonality = [1.0, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 1.0, 1.1, 1.4] // Jan-Dec multipliers
        } = inputs;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const model = {
            name: restaurantName,
            monthlyData: [],
            summary: {}
        };

        let totalRevenue = 0, totalCOGS = 0, totalExpenses = 0;

        months.forEach((month, idx) => {
            const seasonMult = seasonality[idx] || 1.0;
            const adjCovers = Math.round(coversPerNight * seasonMult);
            const foodRevenue = adjCovers * avgPricePerCover * daysOpen;
            const drinkRevenue = foodRevenue * (drinkRevPercent / 100);
            const totalRev = foodRevenue + drinkRevenue;

            const foodCost = foodRevenue * (foodCOGS / 100);
            const drinkCost = drinkRevenue * (drinkCOGS / 100);
            const totalCOGSMonth = foodCost + drinkCost;

            const labor = totalRev * (laborPercent / 100);
            const totalOps = rentMonthly + utilities + marketing + insurance + otherExpenses + labor;

            const grossProfit = totalRev - totalCOGSMonth;
            const netIncome = grossProfit - totalOps;

            model.monthlyData.push({
                month,
                covers: adjCovers * daysOpen,
                foodRevenue,
                drinkRevenue,
                totalRevenue: totalRev,
                foodCOGS: foodCost,
                drinkCOGS: drinkCost,
                totalCOGS: totalCOGSMonth,
                grossProfit,
                grossMargin: (grossProfit / totalRev * 100).toFixed(1),
                labor,
                rent: rentMonthly,
                utilities,
                marketing,
                insurance,
                other: otherExpenses,
                totalExpenses: totalOps,
                netIncome,
                netMargin: (netIncome / totalRev * 100).toFixed(1)
            });

            totalRevenue += totalRev;
            totalCOGS += totalCOGSMonth;
            totalExpenses += totalOps;
        });

        model.summary = {
            annualRevenue: totalRevenue,
            annualCOGS: totalCOGS,
            annualGrossProfit: totalRevenue - totalCOGS,
            grossMargin: ((totalRevenue - totalCOGS) / totalRevenue * 100).toFixed(1),
            annualExpenses: totalExpenses,
            annualNetIncome: totalRevenue - totalCOGS - totalExpenses,
            netMargin: ((totalRevenue - totalCOGS - totalExpenses) / totalRevenue * 100).toFixed(1)
        };

        return model;
    }

    // =========================================================
    // HOTEL FINANCIAL MODEL
    // =========================================================
    createHotelModel(inputs) {
        const {
            hotelName = 'Hotel',
            totalRooms = 100,
            avgDailyRate = 150, // ADR
            occupancyRate = 70, // %
            fbRevenuePerOccRoom = 30, // Food & Beverage per occupied room
            otherRevPerOccRoom = 15, // Spa, parking, etc.
            roomCostPercent = 25, // % of room revenue
            fbCostPercent = 35, // % of F&B revenue
            laborPercent = 30,
            utilities = 15000,
            marketing = 5000,
            insurance = 3000,
            maintenance = 4000,
            management = 8000,
            propertyTax = 10000,
            debtService = 50000, // Monthly debt payment
            seasonality = [0.6, 0.65, 0.8, 0.9, 1.0, 1.2, 1.3, 1.25, 1.0, 0.85, 0.7, 0.75]
        } = inputs;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const model = {
            name: hotelName,
            monthlyData: [],
            summary: {},
            dscr: []
        };

        let totalRevenue = 0, totalExpenses = 0, totalNOI = 0;

        months.forEach((month, idx) => {
            const seasonMult = seasonality[idx] || 1.0;
            const adjOccupancy = Math.min(occupancyRate * seasonMult, 100);
            const roomNights = Math.round(totalRooms * (adjOccupancy / 100) * daysInMonth[idx]);

            const roomRevenue = roomNights * avgDailyRate;
            const fbRevenue = roomNights * fbRevenuePerOccRoom;
            const otherRevenue = roomNights * otherRevPerOccRoom;
            const totalRev = roomRevenue + fbRevenue + otherRevenue;

            const roomCost = roomRevenue * (roomCostPercent / 100);
            const fbCost = fbRevenue * (fbCostPercent / 100);
            const labor = totalRev * (laborPercent / 100);
            const totalOps = roomCost + fbCost + labor + utilities + marketing + insurance +
                            maintenance + management + propertyTax / 12;

            const noi = totalRev - totalOps;
            const cashFlow = noi - debtService;
            const dscr = debtService > 0 ? (noi / debtService).toFixed(2) : 'N/A';

            model.monthlyData.push({
                month,
                occupancy: adjOccupancy.toFixed(1),
                roomNights,
                revPAR: (roomRevenue / (totalRooms * daysInMonth[idx])).toFixed(2),
                roomRevenue,
                fbRevenue,
                otherRevenue,
                totalRevenue: totalRev,
                roomCost,
                fbCost,
                labor,
                utilities,
                marketing,
                insurance,
                maintenance,
                management,
                propertyTax: propertyTax / 12,
                totalExpenses: totalOps,
                noi,
                debtService,
                cashFlow,
                dscr
            });

            model.dscr.push({ month, dscr: parseFloat(dscr) || 0 });
            totalRevenue += totalRev;
            totalExpenses += totalOps;
            totalNOI += noi;
        });

        model.summary = {
            totalRooms,
            avgOccupancy: (model.monthlyData.reduce((s, m) => s + parseFloat(m.occupancy), 0) / 12).toFixed(1),
            avgADR: avgDailyRate,
            avgRevPAR: (model.monthlyData.reduce((s, m) => s + parseFloat(m.revPAR), 0) / 12).toFixed(2),
            annualRevenue: totalRevenue,
            annualExpenses: totalExpenses,
            annualNOI: totalNOI,
            annualDebtService: debtService * 12,
            annualCashFlow: totalNOI - (debtService * 12),
            avgDSCR: (totalNOI / (debtService * 12)).toFixed(2)
        };

        return model;
    }

    // =========================================================
    // M&A MODEL
    // =========================================================
    createMAModel(inputs) {
        const {
            targetName = 'Target Company',
            purchasePrice = 10000000,
            revenue = 5000000,
            ebitda = 1000000,
            ebitdaMargin = 20, // %
            revenueGrowth = 10, // % annually
            synergies = 200000, // Annual synergies
            debtFinancing = 7000000, // Amount financed with debt
            interestRate = 6, // %
            equityContribution = 3000000,
            projectionYears = 5
        } = inputs;

        const model = {
            name: targetName,
            dealMetrics: {},
            projections: [],
            returns: {}
        };

        // Deal Metrics
        const evEbitda = purchasePrice / ebitda;
        const evRevenue = purchasePrice / revenue;
        const annualInterest = debtFinancing * (interestRate / 100);

        model.dealMetrics = {
            purchasePrice,
            evEbitda: evEbitda.toFixed(1) + 'x',
            evRevenue: evRevenue.toFixed(2) + 'x',
            debtFinancing,
            equityContribution,
            leverage: (debtFinancing / ebitda).toFixed(1) + 'x',
            interestRate: interestRate + '%'
        };

        // Multi-year Projections
        let cumulativeCashFlow = -equityContribution;
        let remainingDebt = debtFinancing;

        for (let year = 1; year <= projectionYears; year++) {
            const growthMult = Math.pow(1 + revenueGrowth / 100, year - 1);
            const projRevenue = revenue * growthMult;
            const projEbitda = projRevenue * (ebitdaMargin / 100) + (year >= 2 ? synergies : 0);
            const interest = remainingDebt * (interestRate / 100);
            const debtPaydown = Math.min(remainingDebt, projEbitda * 0.3); // 30% of EBITDA to debt
            const freeCashFlow = projEbitda - interest - debtPaydown;

            remainingDebt = Math.max(0, remainingDebt - debtPaydown);
            cumulativeCashFlow += freeCashFlow;

            model.projections.push({
                year,
                revenue: projRevenue,
                ebitda: projEbitda,
                ebitdaMargin: (projEbitda / projRevenue * 100).toFixed(1),
                interest,
                debtPaydown,
                remainingDebt,
                freeCashFlow,
                cumulativeCashFlow
            });
        }

        // Exit Analysis (assuming 6x EBITDA exit multiple)
        const exitYear = projectionYears;
        const exitEbitda = model.projections[exitYear - 1].ebitda;
        const exitValue = exitEbitda * 6;
        const remainingDebtAtExit = model.projections[exitYear - 1].remainingDebt;
        const equityValue = exitValue - remainingDebtAtExit;
        const moic = equityValue / equityContribution;
        const irr = (Math.pow(moic, 1 / projectionYears) - 1) * 100;

        model.returns = {
            exitValue,
            equityValue,
            moic: moic.toFixed(2) + 'x',
            irr: irr.toFixed(1) + '%',
            paybackYear: model.projections.findIndex(p => p.cumulativeCashFlow > 0) + 1 || 'N/A'
        };

        return model;
    }

    // =========================================================
    // BUDGET VS ACTUAL ANALYSIS
    // =========================================================
    createBudgetVsActual(budgetData, actualData) {
        const analysis = {
            categories: [],
            summary: {},
            variances: []
        };

        // Process each category
        const categories = [...new Set([...Object.keys(budgetData), ...Object.keys(actualData)])];

        let totalBudget = 0, totalActual = 0;

        categories.forEach(category => {
            const budget = budgetData[category] || 0;
            const actual = actualData[category] || 0;
            const variance = actual - budget;
            const variancePercent = budget !== 0 ? (variance / budget * 100) : 0;

            analysis.categories.push({
                category,
                budget,
                actual,
                variance,
                variancePercent: variancePercent.toFixed(1),
                favorable: variance >= 0 // For revenue, positive is good; for expenses, negative is good
            });

            totalBudget += budget;
            totalActual += actual;
        });

        analysis.summary = {
            totalBudget,
            totalActual,
            totalVariance: totalActual - totalBudget,
            totalVariancePercent: ((totalActual - totalBudget) / totalBudget * 100).toFixed(1)
        };

        return analysis;
    }

    // =========================================================
    // PROJECTION METHODS
    // =========================================================
    projectFromHistorical(historicalData, method, params = {}) {
        const { growthRate = 0, trailingMonths = 12 } = params;
        const projections = [];

        switch (method) {
            case 'trailing12':
                // Average of trailing 12 months
                const trailing = historicalData.slice(-trailingMonths);
                const avgTrailing = trailing.reduce((s, v) => s + v, 0) / trailing.length;
                for (let i = 0; i < 12; i++) {
                    projections.push(avgTrailing * (1 + growthRate / 100));
                }
                break;

            case 'sameMonthLY':
                // Same month last year * growth rate
                const lastYear = historicalData.slice(-12);
                lastYear.forEach(val => {
                    projections.push(val * (1 + growthRate / 100));
                });
                break;

            case 'averageLY':
                // Last year average, split evenly
                const lyData = historicalData.slice(-12);
                const lyTotal = lyData.reduce((s, v) => s + v, 0);
                const monthlyAvg = lyTotal / 12;
                for (let i = 0; i < 12; i++) {
                    projections.push(monthlyAvg * (1 + growthRate / 100));
                }
                break;

            case 'seasonalLY':
                // Same month last year with seasonal adjustment
                const lyMonths = historicalData.slice(-12);
                const lyAvg = lyMonths.reduce((s, v) => s + v, 0) / 12;
                lyMonths.forEach(val => {
                    const seasonalIndex = lyAvg > 0 ? val / lyAvg : 1;
                    projections.push(lyAvg * seasonalIndex * (1 + growthRate / 100));
                });
                break;

            default:
                // Linear with growth
                const lastVal = historicalData[historicalData.length - 1] || 0;
                for (let i = 0; i < 12; i++) {
                    projections.push(lastVal * Math.pow(1 + growthRate / 100 / 12, i + 1));
                }
        }

        return projections;
    }

    // =========================================================
    // DEBT SERVICE COVERAGE RATIO CALCULATOR
    // =========================================================
    calculateDSCR(noi, debtService) {
        if (debtService <= 0) return { dscr: 'N/A', status: 'No Debt' };

        const dscr = noi / debtService;
        let status = 'Critical';

        if (dscr >= 1.5) status = 'Strong';
        else if (dscr >= 1.25) status = 'Adequate';
        else if (dscr >= 1.0) status = 'Marginal';

        return {
            dscr: dscr.toFixed(2),
            status,
            noi,
            debtService,
            coverage: (dscr * 100).toFixed(0) + '%'
        };
    }

    // =========================================================
    // EXCEL EXPORT - PROFESSIONAL WORKBOOK
    // =========================================================
    generateExcelReport(reportType, data, options = {}) {
        if (typeof XLSX === 'undefined') {
            alert('Excel library not loaded. Please refresh the page.');
            return;
        }

        const wb = XLSX.utils.book_new();
        const scheme = this.colorSchemes[this.currentScheme];

        switch (reportType) {
            case 'restaurant':
                this.buildRestaurantWorkbook(wb, data, scheme);
                break;
            case 'hotel':
                this.buildHotelWorkbook(wb, data, scheme);
                break;
            case 'ma':
                this.buildMAWorkbook(wb, data, scheme);
                break;
            case 'budgetVsActual':
                this.buildBudgetVsActualWorkbook(wb, data, scheme);
                break;
            case 'comprehensive':
                this.buildComprehensiveWorkbook(wb, data, scheme, options);
                break;
            default:
                this.buildGenericWorkbook(wb, data, scheme);
        }

        // Download
        const filename = `${data.name || 'Report'}_LightningLedgerz_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, filename);

        return filename;
    }

    buildRestaurantWorkbook(wb, model, scheme) {
        // Executive Summary Sheet
        const summaryData = [
            [`${model.name} - Financial Model`],
            ['Lightning Ledgerz Professional Report'],
            [''],
            ['EXECUTIVE SUMMARY'],
            [''],
            ['Metric', 'Annual', 'Monthly Avg'],
            ['Total Revenue', model.summary.annualRevenue, model.summary.annualRevenue / 12],
            ['Cost of Goods Sold', model.summary.annualCOGS, model.summary.annualCOGS / 12],
            ['Gross Profit', model.summary.annualGrossProfit, model.summary.annualGrossProfit / 12],
            ['Gross Margin', model.summary.grossMargin + '%', ''],
            ['Operating Expenses', model.summary.annualExpenses, model.summary.annualExpenses / 12],
            ['Net Income', model.summary.annualNetIncome, model.summary.annualNetIncome / 12],
            ['Net Margin', model.summary.netMargin + '%', '']
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        this.applySheetFormatting(summarySheet, summaryData.length, 3, scheme);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

        // Monthly P&L Sheet
        const plHeaders = ['Month', 'Covers', 'Food Revenue', 'Drink Revenue', 'Total Revenue',
            'Food COGS', 'Drink COGS', 'Total COGS', 'Gross Profit', 'Gross Margin %',
            'Labor', 'Rent', 'Utilities', 'Marketing', 'Insurance', 'Other',
            'Total Expenses', 'Net Income', 'Net Margin %'];

        const plData = [plHeaders];
        model.monthlyData.forEach(m => {
            plData.push([
                m.month, m.covers, m.foodRevenue, m.drinkRevenue, m.totalRevenue,
                m.foodCOGS, m.drinkCOGS, m.totalCOGS, m.grossProfit, m.grossMargin + '%',
                m.labor, m.rent, m.utilities, m.marketing, m.insurance, m.other,
                m.totalExpenses, m.netIncome, m.netMargin + '%'
            ]);
        });

        // Add totals row
        plData.push([
            'TOTAL',
            model.monthlyData.reduce((s, m) => s + m.covers, 0),
            model.monthlyData.reduce((s, m) => s + m.foodRevenue, 0),
            model.monthlyData.reduce((s, m) => s + m.drinkRevenue, 0),
            model.summary.annualRevenue,
            model.monthlyData.reduce((s, m) => s + m.foodCOGS, 0),
            model.monthlyData.reduce((s, m) => s + m.drinkCOGS, 0),
            model.summary.annualCOGS,
            model.summary.annualGrossProfit,
            model.summary.grossMargin + '%',
            model.monthlyData.reduce((s, m) => s + m.labor, 0),
            model.monthlyData.reduce((s, m) => s + m.rent, 0),
            model.monthlyData.reduce((s, m) => s + m.utilities, 0),
            model.monthlyData.reduce((s, m) => s + m.marketing, 0),
            model.monthlyData.reduce((s, m) => s + m.insurance, 0),
            model.monthlyData.reduce((s, m) => s + m.other, 0),
            model.summary.annualExpenses,
            model.summary.annualNetIncome,
            model.summary.netMargin + '%'
        ]);

        const plSheet = XLSX.utils.aoa_to_sheet(plData);
        this.applySheetFormatting(plSheet, plData.length, plHeaders.length, scheme);
        XLSX.utils.book_append_sheet(wb, plSheet, 'Monthly P&L');

        // Revenue Analysis Sheet
        const revenueData = [
            ['Revenue Analysis'],
            [''],
            ['Month', 'Food Revenue', 'Drink Revenue', 'Total', 'Food %', 'Drink %']
        ];
        model.monthlyData.forEach(m => {
            const foodPct = (m.foodRevenue / m.totalRevenue * 100).toFixed(1);
            const drinkPct = (m.drinkRevenue / m.totalRevenue * 100).toFixed(1);
            revenueData.push([m.month, m.foodRevenue, m.drinkRevenue, m.totalRevenue, foodPct + '%', drinkPct + '%']);
        });

        const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue Analysis');

        // Expense Breakdown Sheet
        const expenseData = [
            ['Expense Breakdown'],
            [''],
            ['Category', 'Annual Amount', '% of Revenue', 'Monthly Avg']
        ];

        const expenseCategories = [
            { name: 'COGS - Food', value: model.monthlyData.reduce((s, m) => s + m.foodCOGS, 0) },
            { name: 'COGS - Beverage', value: model.monthlyData.reduce((s, m) => s + m.drinkCOGS, 0) },
            { name: 'Labor', value: model.monthlyData.reduce((s, m) => s + m.labor, 0) },
            { name: 'Rent', value: model.monthlyData.reduce((s, m) => s + m.rent, 0) },
            { name: 'Utilities', value: model.monthlyData.reduce((s, m) => s + m.utilities, 0) },
            { name: 'Marketing', value: model.monthlyData.reduce((s, m) => s + m.marketing, 0) },
            { name: 'Insurance', value: model.monthlyData.reduce((s, m) => s + m.insurance, 0) },
            { name: 'Other', value: model.monthlyData.reduce((s, m) => s + m.other, 0) }
        ];

        expenseCategories.forEach(cat => {
            expenseData.push([
                cat.name,
                cat.value,
                (cat.value / model.summary.annualRevenue * 100).toFixed(1) + '%',
                cat.value / 12
            ]);
        });

        const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expense Breakdown');
    }

    buildHotelWorkbook(wb, model, scheme) {
        // Executive Summary
        const summaryData = [
            [`${model.name} - Hotel Financial Model`],
            ['Lightning Ledgerz Professional Report'],
            [''],
            ['KEY PERFORMANCE INDICATORS'],
            [''],
            ['Metric', 'Value'],
            ['Total Rooms', model.summary.totalRooms],
            ['Average Occupancy', model.summary.avgOccupancy + '%'],
            ['Average Daily Rate (ADR)', '$' + model.summary.avgADR],
            ['RevPAR', '$' + model.summary.avgRevPAR],
            [''],
            ['FINANCIAL SUMMARY'],
            ['Annual Revenue', model.summary.annualRevenue],
            ['Annual Expenses', model.summary.annualExpenses],
            ['Net Operating Income (NOI)', model.summary.annualNOI],
            ['Annual Debt Service', model.summary.annualDebtService],
            ['Cash Flow After Debt', model.summary.annualCashFlow],
            ['Average DSCR', model.summary.avgDSCR + 'x']
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

        // Monthly Operations
        const opsHeaders = ['Month', 'Occupancy %', 'Room Nights', 'RevPAR',
            'Room Revenue', 'F&B Revenue', 'Other Revenue', 'Total Revenue',
            'NOI', 'Debt Service', 'Cash Flow', 'DSCR'];

        const opsData = [opsHeaders];
        model.monthlyData.forEach(m => {
            opsData.push([
                m.month, m.occupancy + '%', m.roomNights, '$' + m.revPAR,
                m.roomRevenue, m.fbRevenue, m.otherRevenue, m.totalRevenue,
                m.noi, m.debtService, m.cashFlow, m.dscr + 'x'
            ]);
        });

        const opsSheet = XLSX.utils.aoa_to_sheet(opsData);
        XLSX.utils.book_append_sheet(wb, opsSheet, 'Monthly Operations');

        // DSCR Analysis
        const dscrData = [
            ['Debt Service Coverage Ratio Analysis'],
            [''],
            ['Month', 'NOI', 'Debt Service', 'DSCR', 'Status']
        ];
        model.monthlyData.forEach(m => {
            const status = parseFloat(m.dscr) >= 1.5 ? 'Strong' :
                          parseFloat(m.dscr) >= 1.25 ? 'Adequate' :
                          parseFloat(m.dscr) >= 1.0 ? 'Marginal' : 'Critical';
            dscrData.push([m.month, m.noi, m.debtService, m.dscr + 'x', status]);
        });

        const dscrSheet = XLSX.utils.aoa_to_sheet(dscrData);
        XLSX.utils.book_append_sheet(wb, dscrSheet, 'DSCR Analysis');
    }

    buildMAWorkbook(wb, model, scheme) {
        // Deal Summary
        const dealData = [
            [`${model.name} - M&A Analysis`],
            ['Lightning Ledgerz Professional Report'],
            [''],
            ['DEAL METRICS'],
            [''],
            ['Purchase Price', model.dealMetrics.purchasePrice],
            ['EV/EBITDA Multiple', model.dealMetrics.evEbitda],
            ['EV/Revenue Multiple', model.dealMetrics.evRevenue],
            ['Debt Financing', model.dealMetrics.debtFinancing],
            ['Equity Contribution', model.dealMetrics.equityContribution],
            ['Leverage', model.dealMetrics.leverage],
            ['Interest Rate', model.dealMetrics.interestRate],
            [''],
            ['RETURNS ANALYSIS'],
            ['Exit Value', model.returns.exitValue],
            ['Equity Value at Exit', model.returns.equityValue],
            ['MOIC', model.returns.moic],
            ['IRR', model.returns.irr],
            ['Payback Period (Years)', model.returns.paybackYear]
        ];

        const dealSheet = XLSX.utils.aoa_to_sheet(dealData);
        XLSX.utils.book_append_sheet(wb, dealSheet, 'Deal Summary');

        // Projections
        const projHeaders = ['Year', 'Revenue', 'EBITDA', 'EBITDA Margin',
            'Interest', 'Debt Paydown', 'Remaining Debt', 'Free Cash Flow', 'Cumulative CF'];

        const projData = [projHeaders];
        model.projections.forEach(p => {
            projData.push([
                'Year ' + p.year, p.revenue, p.ebitda, p.ebitdaMargin + '%',
                p.interest, p.debtPaydown, p.remainingDebt, p.freeCashFlow, p.cumulativeCashFlow
            ]);
        });

        const projSheet = XLSX.utils.aoa_to_sheet(projData);
        XLSX.utils.book_append_sheet(wb, projSheet, 'Projections');
    }

    buildBudgetVsActualWorkbook(wb, analysis, scheme) {
        const bvaData = [
            ['Budget vs Actual Analysis'],
            ['Lightning Ledgerz Professional Report'],
            [''],
            ['Category', 'Budget', 'Actual', 'Variance $', 'Variance %', 'Status']
        ];

        analysis.categories.forEach(cat => {
            const status = cat.variance >= 0 ? 'Favorable' : 'Unfavorable';
            bvaData.push([
                cat.category, cat.budget, cat.actual, cat.variance,
                cat.variancePercent + '%', status
            ]);
        });

        bvaData.push([]);
        bvaData.push(['TOTAL', analysis.summary.totalBudget, analysis.summary.totalActual,
            analysis.summary.totalVariance, analysis.summary.totalVariancePercent + '%', '']);

        const bvaSheet = XLSX.utils.aoa_to_sheet(bvaData);
        XLSX.utils.book_append_sheet(wb, bvaSheet, 'Budget vs Actual');
    }

    buildComprehensiveWorkbook(wb, data, scheme, options) {
        // This builds a comprehensive P&L workbook like the PTA slides shown
        const { companyName = 'Company', periods = [], categories = [] } = data;

        // Executive Summary
        const execData = [
            [`${companyName} - Comprehensive Financial Report`],
            ['Lightning Ledgerz Professional Report'],
            ['Generated: ' + new Date().toLocaleDateString()],
            ['']
        ];

        if (data.summary) {
            execData.push(['KEY METRICS']);
            Object.entries(data.summary).forEach(([key, value]) => {
                execData.push([key, value]);
            });
        }

        const execSheet = XLSX.utils.aoa_to_sheet(execData);
        XLSX.utils.book_append_sheet(wb, execSheet, 'Executive Summary');

        // Income Statement
        if (data.incomeStatement) {
            const isHeaders = ['Line Item', ...periods];
            const isData = [isHeaders];

            data.incomeStatement.forEach(item => {
                isData.push([item.name, ...item.values]);
            });

            const isSheet = XLSX.utils.aoa_to_sheet(isData);
            XLSX.utils.book_append_sheet(wb, isSheet, 'Income Statement');
        }

        // Revenue by Category
        if (data.revenueByCategory) {
            const revHeaders = ['Category', ...periods, 'Total', '% of Total'];
            const revData = [revHeaders];

            data.revenueByCategory.forEach(cat => {
                const total = cat.values.reduce((s, v) => s + v, 0);
                const pctTotal = (total / data.totalRevenue * 100).toFixed(1);
                revData.push([cat.name, ...cat.values, total, pctTotal + '%']);
            });

            const revSheet = XLSX.utils.aoa_to_sheet(revData);
            XLSX.utils.book_append_sheet(wb, revSheet, 'Revenue by Category');
        }

        // Expense Analysis
        if (data.expenses) {
            const expHeaders = ['Expense Category', ...periods, 'Total', '% of Revenue'];
            const expData = [expHeaders];

            data.expenses.forEach(exp => {
                const total = exp.values.reduce((s, v) => s + v, 0);
                const pctRev = (total / data.totalRevenue * 100).toFixed(1);
                expData.push([exp.name, ...exp.values, total, pctRev + '%']);
            });

            const expSheet = XLSX.utils.aoa_to_sheet(expData);
            XLSX.utils.book_append_sheet(wb, expSheet, 'Expense Analysis');
        }
    }

    applySheetFormatting(sheet, rows, cols, scheme) {
        // Set column widths
        const colWidths = [];
        for (let i = 0; i < cols; i++) {
            colWidths.push({ wch: 15 });
        }
        sheet['!cols'] = colWidths;

        // Note: Full cell styling requires xlsx-style or similar library
        // SheetJS community version has limited styling support
    }

    // =========================================================
    // CHART DATA GENERATION (for PowerPoint integration)
    // =========================================================
    generateChartData(type, data, options = {}) {
        switch (type) {
            case 'line':
                return this.formatLineChartData(data, options);
            case 'bar':
                return this.formatBarChartData(data, options);
            case 'waterfall':
                return this.formatWaterfallData(data, options);
            case 'pie':
            case 'donut':
                return this.formatPieChartData(data, options);
            default:
                return data;
        }
    }

    formatLineChartData(data, options) {
        const { labels = [], datasets = [] } = data;
        return {
            type: 'line',
            labels,
            datasets: datasets.map((ds, idx) => ({
                name: ds.name || `Series ${idx + 1}`,
                values: ds.values,
                color: ds.color || this.getChartColor(idx)
            }))
        };
    }

    formatBarChartData(data, options) {
        const { labels = [], datasets = [], stacked = false } = data;
        return {
            type: options.horizontal ? 'barH' : 'bar',
            labels,
            stacked,
            datasets: datasets.map((ds, idx) => ({
                name: ds.name || `Series ${idx + 1}`,
                values: ds.values,
                color: ds.color || this.getChartColor(idx)
            }))
        };
    }

    formatWaterfallData(data, options) {
        // Waterfall chart format: start value, increases, decreases, subtotals, end
        const { categories = [], values = [], startLabel = 'Start', endLabel = 'End' } = data;

        const waterfallData = [];
        let runningTotal = values[0] || 0;

        values.forEach((val, idx) => {
            if (idx === 0) {
                waterfallData.push({ category: categories[idx] || startLabel, value: val, type: 'start' });
            } else {
                const change = val;
                waterfallData.push({
                    category: categories[idx],
                    value: Math.abs(change),
                    type: change >= 0 ? 'increase' : 'decrease',
                    runningTotal: runningTotal + change
                });
                runningTotal += change;
            }
        });

        waterfallData.push({ category: endLabel, value: runningTotal, type: 'total' });

        return { type: 'waterfall', data: waterfallData };
    }

    formatPieChartData(data, options) {
        const { labels = [], values = [], colors = [] } = data;
        const total = values.reduce((s, v) => s + v, 0);

        return {
            type: options.donut ? 'donut' : 'pie',
            segments: labels.map((label, idx) => ({
                label,
                value: values[idx],
                percentage: (values[idx] / total * 100).toFixed(1),
                color: colors[idx] || this.getChartColor(idx)
            }))
        };
    }

    getChartColor(index) {
        const colors = [
            '1F4E79', '2E75B6', 'FFC000', '70AD47', 'C00000',
            '7030A0', 'ED7D31', '4472C4', 'A5A5A5', '255E91'
        ];
        return colors[index % colors.length];
    }

    // =========================================================
    // OPEN REPORT BUILDER UI
    // =========================================================
    openReportBuilder() {
        // Remove existing
        const existing = document.getElementById('financial-report-builder');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'financial-report-builder';
        container.innerHTML = this.getReportBuilderHTML();
        document.body.appendChild(container);

        this.injectReportBuilderStyles();
    }

    getReportBuilderHTML() {
        return `
        <div class="frb-overlay" onclick="financialReports.closeReportBuilder()"></div>
        <div class="frb-panel">
            <div class="frb-header">
                <h2>Professional Financial Reports</h2>
                <button class="frb-close" onclick="financialReports.closeReportBuilder()">&times;</button>
            </div>

            <div class="frb-tabs">
                <button class="frb-tab active" onclick="financialReports.switchReportTab('restaurant')">Restaurant</button>
                <button class="frb-tab" onclick="financialReports.switchReportTab('hotel')">Hotel</button>
                <button class="frb-tab" onclick="financialReports.switchReportTab('ma')">M&A Model</button>
                <button class="frb-tab" onclick="financialReports.switchReportTab('budgetVsActual')">Budget vs Actual</button>
                <button class="frb-tab" onclick="financialReports.switchReportTab('images')">Image Library</button>
            </div>

            <div class="frb-content" id="frb-content">
                ${this.getRestaurantFormHTML()}
            </div>

            <div class="frb-footer">
                <button class="btn btn-secondary" onclick="financialReports.closeReportBuilder()">Cancel</button>
                <button class="btn btn-primary" onclick="financialReports.generateCurrentReport()">Generate Report</button>
            </div>
        </div>
        `;
    }

    getRestaurantFormHTML() {
        return `
        <div class="frb-form" id="restaurant-form">
            <h3>Restaurant Financial Model</h3>
            <p class="frb-desc">Build a complete P&L with seasonality, covers, and expense analysis</p>

            <div class="frb-row">
                <label>Restaurant Name</label>
                <input type="text" id="frb-rest-name" placeholder="My Restaurant" value="Downtown Bistro">
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Covers Per Night</label>
                    <input type="number" id="frb-rest-covers" value="100">
                </div>
                <div>
                    <label>Avg Price Per Cover ($)</label>
                    <input type="number" id="frb-rest-price" value="45">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Days Open/Month</label>
                    <input type="number" id="frb-rest-days" value="30">
                </div>
                <div>
                    <label>Drink Rev % of Food</label>
                    <input type="number" id="frb-rest-drinks" value="25">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Food COGS %</label>
                    <input type="number" id="frb-rest-foodcogs" value="30">
                </div>
                <div>
                    <label>Drink COGS %</label>
                    <input type="number" id="frb-rest-drinkcogs" value="20">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Labor %</label>
                    <input type="number" id="frb-rest-labor" value="30">
                </div>
                <div>
                    <label>Monthly Rent ($)</label>
                    <input type="number" id="frb-rest-rent" value="8000">
                </div>
            </div>

            <div class="frb-row three-col">
                <div>
                    <label>Utilities ($)</label>
                    <input type="number" id="frb-rest-utilities" value="1500">
                </div>
                <div>
                    <label>Marketing ($)</label>
                    <input type="number" id="frb-rest-marketing" value="1000">
                </div>
                <div>
                    <label>Insurance ($)</label>
                    <input type="number" id="frb-rest-insurance" value="500">
                </div>
            </div>

            <div class="frb-section">
                <h4>Seasonality (Monthly Multipliers)</h4>
                <p class="frb-hint">1.0 = normal, 1.2 = 20% above, 0.8 = 20% below</p>
                <div class="frb-seasonality">
                    ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => `
                        <div class="frb-season-month">
                            <label>${m}</label>
                            <input type="number" step="0.1" id="frb-rest-season-${i}" value="${[1.0,0.9,1.0,1.1,1.2,1.3,1.2,1.1,1.0,1.0,1.1,1.4][i]}">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    }

    getHotelFormHTML() {
        return `
        <div class="frb-form" id="hotel-form">
            <h3>Hotel Financial Model</h3>
            <p class="frb-desc">Complete hotel P&L with RevPAR, DSCR analysis, and debt service</p>

            <div class="frb-row">
                <label>Hotel Name</label>
                <input type="text" id="frb-hotel-name" placeholder="Hotel Name" value="Grand Hotel">
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Total Rooms</label>
                    <input type="number" id="frb-hotel-rooms" value="100">
                </div>
                <div>
                    <label>Average Daily Rate ($)</label>
                    <input type="number" id="frb-hotel-adr" value="150">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Base Occupancy %</label>
                    <input type="number" id="frb-hotel-occ" value="70">
                </div>
                <div>
                    <label>F&B Rev/Occ Room ($)</label>
                    <input type="number" id="frb-hotel-fb" value="30">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Room Cost %</label>
                    <input type="number" id="frb-hotel-roomcost" value="25">
                </div>
                <div>
                    <label>F&B Cost %</label>
                    <input type="number" id="frb-hotel-fbcost" value="35">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Labor %</label>
                    <input type="number" id="frb-hotel-labor" value="30">
                </div>
                <div>
                    <label>Monthly Debt Service ($)</label>
                    <input type="number" id="frb-hotel-debt" value="50000">
                </div>
            </div>

            <div class="frb-section">
                <h4>Monthly Fixed Expenses</h4>
                <div class="frb-row three-col">
                    <div>
                        <label>Utilities ($)</label>
                        <input type="number" id="frb-hotel-utilities" value="15000">
                    </div>
                    <div>
                        <label>Marketing ($)</label>
                        <input type="number" id="frb-hotel-marketing" value="5000">
                    </div>
                    <div>
                        <label>Insurance ($)</label>
                        <input type="number" id="frb-hotel-insurance" value="3000">
                    </div>
                </div>
            </div>

            <div class="frb-section">
                <h4>Seasonality (Occupancy Multipliers)</h4>
                <div class="frb-seasonality">
                    ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => `
                        <div class="frb-season-month">
                            <label>${m}</label>
                            <input type="number" step="0.05" id="frb-hotel-season-${i}" value="${[0.6,0.65,0.8,0.9,1.0,1.2,1.3,1.25,1.0,0.85,0.7,0.75][i]}">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    }

    getMAFormHTML() {
        return `
        <div class="frb-form" id="ma-form">
            <h3>M&A Financial Model</h3>
            <p class="frb-desc">LBO-style analysis with IRR, MOIC, and debt paydown projections</p>

            <div class="frb-row">
                <label>Target Company Name</label>
                <input type="text" id="frb-ma-name" placeholder="Target Co" value="Acme Industries">
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Purchase Price ($)</label>
                    <input type="number" id="frb-ma-price" value="10000000">
                </div>
                <div>
                    <label>Current Revenue ($)</label>
                    <input type="number" id="frb-ma-revenue" value="5000000">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Current EBITDA ($)</label>
                    <input type="number" id="frb-ma-ebitda" value="1000000">
                </div>
                <div>
                    <label>Revenue Growth % / Year</label>
                    <input type="number" id="frb-ma-growth" value="10">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Debt Financing ($)</label>
                    <input type="number" id="frb-ma-debt" value="7000000">
                </div>
                <div>
                    <label>Interest Rate %</label>
                    <input type="number" id="frb-ma-interest" value="6">
                </div>
            </div>

            <div class="frb-row two-col">
                <div>
                    <label>Annual Synergies ($)</label>
                    <input type="number" id="frb-ma-synergies" value="200000">
                </div>
                <div>
                    <label>Projection Years</label>
                    <input type="number" id="frb-ma-years" value="5" min="3" max="10">
                </div>
            </div>
        </div>
        `;
    }

    getBudgetVsActualFormHTML() {
        return `
        <div class="frb-form" id="bva-form">
            <h3>Budget vs Actual Analysis</h3>
            <p class="frb-desc">Compare your budget to actual performance with variance analysis</p>

            <div class="frb-bva-categories" id="frb-bva-categories">
                <div class="frb-bva-header">
                    <span>Category</span>
                    <span>Budget</span>
                    <span>Actual</span>
                </div>
                ${['Revenue', 'COGS', 'Gross Profit', 'Payroll', 'Rent', 'Utilities', 'Marketing', 'Other Expenses'].map((cat, i) => `
                    <div class="frb-bva-row">
                        <input type="text" value="${cat}" id="frb-bva-cat-${i}">
                        <input type="number" placeholder="Budget" id="frb-bva-budget-${i}" value="${[500000, 150000, 350000, 100000, 24000, 12000, 20000, 30000][i]}">
                        <input type="number" placeholder="Actual" id="frb-bva-actual-${i}" value="${[520000, 160000, 360000, 105000, 24000, 11000, 25000, 28000][i]}">
                    </div>
                `).join('')}
            </div>

            <button class="btn btn-secondary" onclick="financialReports.addBvaRow()">+ Add Category</button>
        </div>
        `;
    }

    getImageLibraryHTML() {
        return `
        <div class="frb-form" id="images-form">
            <h3>4K Professional Image Library</h3>
            <p class="frb-desc">High-quality images for presentations - click to copy URL</p>

            <div class="frb-image-tabs">
                ${Object.keys(this.imageDatabase).map((cat, i) => `
                    <button class="frb-img-tab ${i === 0 ? 'active' : ''}" onclick="financialReports.showImageCategory('${cat}')">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
                `).join('')}
            </div>

            <div class="frb-image-grid" id="frb-image-grid">
                ${this.imageDatabase.skyscrapers.map((url, i) => `
                    <div class="frb-image-card" onclick="financialReports.copyImageUrl('${url}')">
                        <img src="${url.replace('w=3840', 'w=400')}" alt="Image ${i+1}" loading="lazy">
                        <div class="frb-img-overlay">Click to copy URL</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    switchReportTab(tab) {
        document.querySelectorAll('.frb-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('frb-content');
        switch (tab) {
            case 'restaurant':
                content.innerHTML = this.getRestaurantFormHTML();
                break;
            case 'hotel':
                content.innerHTML = this.getHotelFormHTML();
                break;
            case 'ma':
                content.innerHTML = this.getMAFormHTML();
                break;
            case 'budgetVsActual':
                content.innerHTML = this.getBudgetVsActualFormHTML();
                break;
            case 'images':
                content.innerHTML = this.getImageLibraryHTML();
                break;
        }

        this.currentReportType = tab;
    }

    showImageCategory(category) {
        document.querySelectorAll('.frb-img-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const grid = document.getElementById('frb-image-grid');
        grid.innerHTML = this.imageDatabase[category].map((url, i) => `
            <div class="frb-image-card" onclick="financialReports.copyImageUrl('${url}')">
                <img src="${url.replace('w=3840', 'w=400')}" alt="${category} ${i+1}" loading="lazy">
                <div class="frb-img-overlay">Click to copy URL</div>
            </div>
        `).join('');
    }

    copyImageUrl(url) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Image URL copied to clipboard!');
        });
    }

    generateCurrentReport() {
        const activeTab = document.querySelector('.frb-tab.active')?.textContent?.toLowerCase();

        switch (activeTab) {
            case 'restaurant':
                this.generateRestaurantReport();
                break;
            case 'hotel':
                this.generateHotelReport();
                break;
            case 'm&a model':
                this.generateMAReport();
                break;
            case 'budget vs actual':
                this.generateBVAReport();
                break;
        }
    }

    generateRestaurantReport() {
        const seasonality = [];
        for (let i = 0; i < 12; i++) {
            seasonality.push(parseFloat(document.getElementById(`frb-rest-season-${i}`)?.value) || 1.0);
        }

        const inputs = {
            restaurantName: document.getElementById('frb-rest-name')?.value || 'Restaurant',
            coversPerNight: parseInt(document.getElementById('frb-rest-covers')?.value) || 100,
            avgPricePerCover: parseFloat(document.getElementById('frb-rest-price')?.value) || 45,
            daysOpen: parseInt(document.getElementById('frb-rest-days')?.value) || 30,
            drinkRevPercent: parseFloat(document.getElementById('frb-rest-drinks')?.value) || 25,
            foodCOGS: parseFloat(document.getElementById('frb-rest-foodcogs')?.value) || 30,
            drinkCOGS: parseFloat(document.getElementById('frb-rest-drinkcogs')?.value) || 20,
            laborPercent: parseFloat(document.getElementById('frb-rest-labor')?.value) || 30,
            rentMonthly: parseFloat(document.getElementById('frb-rest-rent')?.value) || 8000,
            utilities: parseFloat(document.getElementById('frb-rest-utilities')?.value) || 1500,
            marketing: parseFloat(document.getElementById('frb-rest-marketing')?.value) || 1000,
            insurance: parseFloat(document.getElementById('frb-rest-insurance')?.value) || 500,
            seasonality
        };

        const model = this.createRestaurantModel(inputs);
        this.generateExcelReport('restaurant', model);
        this.closeReportBuilder();

        if (window.zacAvatar) {
            window.zacAvatar.showSpeech(`Your ${inputs.restaurantName} financial model is ready! Annual projected revenue: $${model.summary.annualRevenue.toLocaleString()}`, 'Report Generated');
        }
    }

    generateHotelReport() {
        const seasonality = [];
        for (let i = 0; i < 12; i++) {
            seasonality.push(parseFloat(document.getElementById(`frb-hotel-season-${i}`)?.value) || 1.0);
        }

        const inputs = {
            hotelName: document.getElementById('frb-hotel-name')?.value || 'Hotel',
            totalRooms: parseInt(document.getElementById('frb-hotel-rooms')?.value) || 100,
            avgDailyRate: parseFloat(document.getElementById('frb-hotel-adr')?.value) || 150,
            occupancyRate: parseFloat(document.getElementById('frb-hotel-occ')?.value) || 70,
            fbRevenuePerOccRoom: parseFloat(document.getElementById('frb-hotel-fb')?.value) || 30,
            roomCostPercent: parseFloat(document.getElementById('frb-hotel-roomcost')?.value) || 25,
            fbCostPercent: parseFloat(document.getElementById('frb-hotel-fbcost')?.value) || 35,
            laborPercent: parseFloat(document.getElementById('frb-hotel-labor')?.value) || 30,
            utilities: parseFloat(document.getElementById('frb-hotel-utilities')?.value) || 15000,
            marketing: parseFloat(document.getElementById('frb-hotel-marketing')?.value) || 5000,
            insurance: parseFloat(document.getElementById('frb-hotel-insurance')?.value) || 3000,
            debtService: parseFloat(document.getElementById('frb-hotel-debt')?.value) || 50000,
            seasonality
        };

        const model = this.createHotelModel(inputs);
        this.generateExcelReport('hotel', model);
        this.closeReportBuilder();

        if (window.zacAvatar) {
            window.zacAvatar.showSpeech(`Your ${inputs.hotelName} model is ready! Average DSCR: ${model.summary.avgDSCR}x`, 'Hotel Report Generated');
        }
    }

    generateMAReport() {
        const inputs = {
            targetName: document.getElementById('frb-ma-name')?.value || 'Target',
            purchasePrice: parseFloat(document.getElementById('frb-ma-price')?.value) || 10000000,
            revenue: parseFloat(document.getElementById('frb-ma-revenue')?.value) || 5000000,
            ebitda: parseFloat(document.getElementById('frb-ma-ebitda')?.value) || 1000000,
            revenueGrowth: parseFloat(document.getElementById('frb-ma-growth')?.value) || 10,
            synergies: parseFloat(document.getElementById('frb-ma-synergies')?.value) || 200000,
            debtFinancing: parseFloat(document.getElementById('frb-ma-debt')?.value) || 7000000,
            interestRate: parseFloat(document.getElementById('frb-ma-interest')?.value) || 6,
            projectionYears: parseInt(document.getElementById('frb-ma-years')?.value) || 5
        };

        inputs.equityContribution = inputs.purchasePrice - inputs.debtFinancing;
        inputs.ebitdaMargin = (inputs.ebitda / inputs.revenue) * 100;

        const model = this.createMAModel(inputs);
        this.generateExcelReport('ma', model);
        this.closeReportBuilder();

        if (window.zacAvatar) {
            window.zacAvatar.showSpeech(`M&A model complete! Projected IRR: ${model.returns.irr}, MOIC: ${model.returns.moic}`, 'M&A Analysis Ready');
        }
    }

    generateBVAReport() {
        const budgetData = {};
        const actualData = {};

        for (let i = 0; i < 20; i++) {
            const catEl = document.getElementById(`frb-bva-cat-${i}`);
            const budgetEl = document.getElementById(`frb-bva-budget-${i}`);
            const actualEl = document.getElementById(`frb-bva-actual-${i}`);

            if (catEl && budgetEl && actualEl && catEl.value) {
                budgetData[catEl.value] = parseFloat(budgetEl.value) || 0;
                actualData[catEl.value] = parseFloat(actualEl.value) || 0;
            }
        }

        const analysis = this.createBudgetVsActual(budgetData, actualData);
        analysis.name = 'Budget vs Actual Analysis';
        this.generateExcelReport('budgetVsActual', analysis);
        this.closeReportBuilder();
    }

    addBvaRow() {
        const container = document.getElementById('frb-bva-categories');
        const existingRows = container.querySelectorAll('.frb-bva-row').length;

        const newRow = document.createElement('div');
        newRow.className = 'frb-bva-row';
        newRow.innerHTML = `
            <input type="text" placeholder="Category" id="frb-bva-cat-${existingRows}">
            <input type="number" placeholder="Budget" id="frb-bva-budget-${existingRows}">
            <input type="number" placeholder="Actual" id="frb-bva-actual-${existingRows}">
        `;
        container.appendChild(newRow);
    }

    closeReportBuilder() {
        const builder = document.getElementById('financial-report-builder');
        if (builder) builder.remove();
    }

    injectReportBuilderStyles() {
        if (document.getElementById('frb-styles')) return;

        const style = document.createElement('style');
        style.id = 'frb-styles';
        style.textContent = `
            #financial-report-builder {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100000;
            }

            .frb-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
            }

            .frb-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-radius: 20px;
                border: 2px solid #ff3333;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .frb-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
            }

            .frb-header h2 {
                color: #ff3333;
                margin: 0;
                font-size: 1.5rem;
            }

            .frb-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }

            .frb-close:hover { opacity: 1; }

            .frb-tabs {
                display: flex;
                gap: 0.5rem;
                padding: 1rem 2rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                overflow-x: auto;
            }

            .frb-tab {
                padding: 0.75rem 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 25px;
                color: #ccc;
                cursor: pointer;
                transition: all 0.3s;
                white-space: nowrap;
            }

            .frb-tab:hover { border-color: #ff3333; color: #fff; }
            .frb-tab.active {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
                color: #ff3333;
            }

            .frb-content {
                flex: 1;
                overflow-y: auto;
                padding: 2rem;
            }

            .frb-form h3 {
                color: #ffd700;
                margin-bottom: 0.5rem;
            }

            .frb-desc {
                color: #888;
                margin-bottom: 1.5rem;
            }

            .frb-row {
                margin-bottom: 1rem;
            }

            .frb-row label {
                display: block;
                color: #aaa;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .frb-row input, .frb-row select {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: #fff;
                font-size: 1rem;
            }

            .frb-row input:focus {
                outline: none;
                border-color: #ff3333;
            }

            .frb-row.two-col {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .frb-row.three-col {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 1rem;
            }

            .frb-section {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .frb-section h4 {
                color: #ff3333;
                margin-bottom: 0.5rem;
            }

            .frb-hint {
                color: #666;
                font-size: 0.85rem;
                margin-bottom: 1rem;
            }

            .frb-seasonality {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 0.5rem;
            }

            .frb-season-month {
                text-align: center;
            }

            .frb-season-month label {
                display: block;
                color: #888;
                font-size: 0.8rem;
                margin-bottom: 0.25rem;
            }

            .frb-season-month input {
                width: 100%;
                padding: 0.5rem;
                text-align: center;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                color: #fff;
            }

            .frb-bva-header, .frb-bva-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
                gap: 1rem;
                margin-bottom: 0.5rem;
            }

            .frb-bva-header span {
                color: #ff3333;
                font-weight: bold;
            }

            .frb-bva-row input {
                padding: 0.5rem;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                color: #fff;
            }

            .frb-image-tabs {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .frb-img-tab {
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                color: #ccc;
                cursor: pointer;
                font-size: 0.9rem;
            }

            .frb-img-tab:hover, .frb-img-tab.active {
                border-color: #ff3333;
                color: #ff3333;
            }

            .frb-image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }

            .frb-image-card {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s;
            }

            .frb-image-card:hover {
                transform: scale(1.05);
            }

            .frb-image-card img {
                width: 100%;
                height: 100px;
                object-fit: cover;
            }

            .frb-img-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 0.5rem;
                font-size: 0.75rem;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .frb-image-card:hover .frb-img-overlay {
                opacity: 1;
            }

            .frb-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1.5rem 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 768px) {
                .frb-row.two-col, .frb-row.three-col {
                    grid-template-columns: 1fr;
                }
                .frb-seasonality {
                    grid-template-columns: repeat(4, 1fr);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize
const financialReports = new FinancialReports();

// Global functions
window.openFinancialReports = function() {
    financialReports.openReportBuilder();
};

window.financialReports = financialReports;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialReports;
}

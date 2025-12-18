// =====================================================
// LIGHTNING LEDGERZ - PROFESSIONAL DECK TEMPLATES
// Fortune 500, Bain, Deloitte, and Custom styles
// High-quality presentation templates
// =====================================================

const DeckTemplates = {
    // Professional color schemes from top consulting firms
    colorSchemes: {
        mckinsey: {
            name: 'Fortune 500',
            primary: '#003D79',
            secondary: '#0077B6',
            accent: '#00B4D8',
            success: '#2E8B57',
            warning: '#FF8C00',
            danger: '#DC143C',
            text: '#333333',
            textLight: '#666666',
            background: '#FFFFFF',
            backgroundAlt: '#F5F7FA',
            border: '#E0E6ED'
        },
        bain: {
            name: 'Bain',
            primary: '#CC0000',
            secondary: '#990000',
            accent: '#FF4444',
            success: '#228B22',
            warning: '#FFA500',
            danger: '#8B0000',
            text: '#333333',
            textLight: '#666666',
            background: '#FFFFFF',
            backgroundAlt: '#F8F8F8',
            border: '#E5E5E5'
        },
        deloitte: {
            name: 'Deloitte',
            primary: '#86BC25',
            secondary: '#0097A9',
            accent: '#62B5E5',
            success: '#86BC25',
            warning: '#FFD100',
            danger: '#DA291C',
            text: '#333333',
            textLight: '#75787B',
            background: '#FFFFFF',
            backgroundAlt: '#F5F5F5',
            border: '#D0D0CE'
        },
        bcg: {
            name: 'BCG',
            primary: '#00693E',
            secondary: '#007A4D',
            accent: '#32CD32',
            success: '#228B22',
            warning: '#DAA520',
            danger: '#B22222',
            text: '#333333',
            textLight: '#666666',
            background: '#FFFFFF',
            backgroundAlt: '#F0F8F0',
            border: '#E0E8E0'
        },
        pwc: {
            name: 'PwC',
            primary: '#E85D04',
            secondary: '#DC2F02',
            accent: '#F48C06',
            success: '#38B000',
            warning: '#FFBA08',
            danger: '#D00000',
            text: '#333333',
            textLight: '#666666',
            background: '#FFFFFF',
            backgroundAlt: '#FFF5EB',
            border: '#FFE0C7'
        },
        lightning: {
            name: 'Lightning Ledgerz',
            primary: '#FF3333',
            secondary: '#CC0000',
            accent: '#FFD700',
            success: '#4CAF50',
            warning: '#FF9800',
            danger: '#F44336',
            text: '#FFFFFF',
            textLight: '#CCCCCC',
            background: '#1A1A1A',
            backgroundAlt: '#2D2D2D',
            border: '#444444'
        }
    },

    // Professional background images (URLs to high-quality free images)
    backgroundImages: {
        // Skylines & Architecture
        skyscrapers: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80', // NYC glass buildings
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80', // City skyline blue
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80', // Dubai skyline
            'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80', // Manhattan
            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80'  // Chicago
        ],
        // Mountains
        mountains: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', // Dramatic peaks
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', // Snowy mountain night
            'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80', // Mountain sunrise
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Alpine
            'https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1920&q=80'  // Mountain lake
        ],
        // Seascapes
        seascapes: [
            'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80', // Ocean waves
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', // Beach sunset
            'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=80', // Aerial ocean
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', // Blue ocean
            'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1920&q=80'  // Calm sea
        ],
        // Abstract/Gradient
        abstract: [
            'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80', // Blue gradient
            'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80', // Purple pink
            'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80', // Orange yellow
            'https://images.unsplash.com/photo-1557682260-96773eb01377?w=1920&q=80', // Green blue
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80'  // Geometric
        ],
        // Business/Professional
        business: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80', // Modern office
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80', // Conference room
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80', // Laptop workspace
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&q=80', // Team meeting
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80'  // Brainstorming
        ]
    },

    // Slide templates for different content types
    slideTemplates: {
        // Title Slide
        titleSlide: {
            name: 'Title Slide',
            layout: {
                title: { x: '10%', y: '35%', width: '80%', fontSize: '48px', fontWeight: 'bold', align: 'center' },
                subtitle: { x: '10%', y: '55%', width: '80%', fontSize: '24px', align: 'center' },
                logo: { x: '5%', y: '5%', width: '150px' },
                date: { x: '10%', y: '85%', width: '80%', fontSize: '14px', align: 'center' }
            }
        },

        // Agenda Slide
        agendaSlide: {
            name: 'Agenda',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '32px', fontWeight: 'bold' },
                items: { x: '10%', y: '20%', width: '80%', fontSize: '18px', lineHeight: 2.5 }
            }
        },

        // Executive Summary
        executiveSummary: {
            name: 'Executive Summary',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '28px', fontWeight: 'bold' },
                keyPoints: { x: '5%', y: '18%', width: '45%', fontSize: '14px' },
                kpis: { x: '55%', y: '18%', width: '40%' },
                recommendation: { x: '5%', y: '80%', width: '90%', fontSize: '14px', fontStyle: 'italic' }
            }
        },

        // Two Column
        twoColumn: {
            name: 'Two Column',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '28px', fontWeight: 'bold' },
                leftColumn: { x: '5%', y: '18%', width: '42%' },
                rightColumn: { x: '53%', y: '18%', width: '42%' }
            }
        },

        // Chart Focus
        chartFocus: {
            name: 'Chart Focus',
            layout: {
                title: { x: '5%', y: '5%', width: '60%', fontSize: '28px', fontWeight: 'bold' },
                chart: { x: '5%', y: '15%', width: '90%', height: '70%' },
                insight: { x: '5%', y: '88%', width: '90%', fontSize: '12px' }
            }
        },

        // KPI Dashboard
        kpiDashboard: {
            name: 'KPI Dashboard',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '28px', fontWeight: 'bold' },
                kpi1: { x: '5%', y: '18%', width: '20%', height: '35%' },
                kpi2: { x: '28%', y: '18%', width: '20%', height: '35%' },
                kpi3: { x: '51%', y: '18%', width: '20%', height: '35%' },
                kpi4: { x: '74%', y: '18%', width: '21%', height: '35%' },
                chart: { x: '5%', y: '58%', width: '90%', height: '35%' }
            }
        },

        // Comparison
        comparisonSlide: {
            name: 'Comparison',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '28px', fontWeight: 'bold' },
                vsLabel: { x: '45%', y: '45%', width: '10%', fontSize: '24px', fontWeight: 'bold', align: 'center' },
                leftBox: { x: '5%', y: '18%', width: '40%', height: '75%' },
                rightBox: { x: '55%', y: '18%', width: '40%', height: '75%' }
            }
        },

        // Process/Timeline
        processSlide: {
            name: 'Process Flow',
            layout: {
                title: { x: '5%', y: '5%', width: '90%', fontSize: '28px', fontWeight: 'bold' },
                step1: { x: '5%', y: '30%', width: '18%', height: '40%' },
                arrow1: { x: '24%', y: '45%', width: '4%' },
                step2: { x: '29%', y: '30%', width: '18%', height: '40%' },
                arrow2: { x: '48%', y: '45%', width: '4%' },
                step3: { x: '53%', y: '30%', width: '18%', height: '40%' },
                arrow3: { x: '72%', y: '45%', width: '4%' },
                step4: { x: '77%', y: '30%', width: '18%', height: '40%' }
            }
        },

        // Thank You
        thankYouSlide: {
            name: 'Thank You',
            layout: {
                title: { x: '10%', y: '35%', width: '80%', fontSize: '48px', fontWeight: 'bold', align: 'center' },
                contact: { x: '10%', y: '55%', width: '80%', fontSize: '18px', align: 'center' },
                logo: { x: '40%', y: '70%', width: '20%' }
            }
        }
    },

    // Complete deck templates (pre-configured sets of slides)
    fullDeckTemplates: {
        quarterlyReview: {
            name: 'Quarterly Business Review',
            description: 'Standard QBR deck with KPIs, performance analysis, and outlook',
            slides: [
                { template: 'titleSlide', content: { title: 'Q4 2024 Business Review', subtitle: 'Performance Analysis & Strategic Outlook' } },
                { template: 'agendaSlide', content: { items: ['Executive Summary', 'Financial Performance', 'Operational Metrics', 'Strategic Initiatives', 'Next Quarter Outlook'] } },
                { template: 'executiveSummary', content: {} },
                { template: 'kpiDashboard', content: {} },
                { template: 'chartFocus', content: { title: 'Revenue Trend Analysis' } },
                { template: 'comparisonSlide', content: { title: 'Budget vs Actual' } },
                { template: 'processSlide', content: { title: 'Strategic Roadmap' } },
                { template: 'thankYouSlide', content: { title: 'Thank You', contact: 'Questions & Discussion' } }
            ]
        },

        investorDeck: {
            name: 'Investor Presentation',
            description: 'Professional deck for investor meetings and fundraising',
            slides: [
                { template: 'titleSlide', content: { title: 'Investment Overview', subtitle: 'Growth Opportunity Presentation' } },
                { template: 'executiveSummary', content: {} },
                { template: 'twoColumn', content: { title: 'Market Opportunity' } },
                { template: 'chartFocus', content: { title: 'Financial Projections' } },
                { template: 'kpiDashboard', content: {} },
                { template: 'comparisonSlide', content: { title: 'Competitive Advantage' } },
                { template: 'processSlide', content: { title: 'Use of Funds' } },
                { template: 'thankYouSlide', content: {} }
            ]
        },

        boardMeeting: {
            name: 'Board Meeting',
            description: 'Comprehensive board update with governance focus',
            slides: [
                { template: 'titleSlide', content: { title: 'Board of Directors Update', subtitle: 'Monthly Performance Report' } },
                { template: 'agendaSlide', content: {} },
                { template: 'executiveSummary', content: {} },
                { template: 'kpiDashboard', content: {} },
                { template: 'chartFocus', content: { title: 'P&L Analysis' } },
                { template: 'chartFocus', content: { title: 'Cash Flow Statement' } },
                { template: 'comparisonSlide', content: { title: 'Risk Assessment' } },
                { template: 'processSlide', content: { title: 'Strategic Initiatives Status' } },
                { template: 'thankYouSlide', content: {} }
            ]
        },

        financialAnalysis: {
            name: 'Financial Analysis',
            description: 'Deep dive financial analysis with charts and tables',
            slides: [
                { template: 'titleSlide', content: { title: 'Financial Analysis', subtitle: 'Comprehensive Performance Review' } },
                { template: 'executiveSummary', content: {} },
                { template: 'kpiDashboard', content: {} },
                { template: 'chartFocus', content: { title: 'Revenue Breakdown' } },
                { template: 'chartFocus', content: { title: 'Cost Structure Analysis' } },
                { template: 'twoColumn', content: { title: 'Margin Analysis' } },
                { template: 'chartFocus', content: { title: 'Working Capital Trends' } },
                { template: 'comparisonSlide', content: { title: 'YoY Comparison' } },
                { template: 'thankYouSlide', content: {} }
            ]
        }
    },

    // Font recommendations
    fonts: {
        mckinsey: { heading: 'Georgia, serif', body: 'Arial, sans-serif' },
        bain: { heading: 'Helvetica Neue, sans-serif', body: 'Arial, sans-serif' },
        deloitte: { heading: 'Helvetica Neue, sans-serif', body: 'Open Sans, sans-serif' },
        bcg: { heading: 'Georgia, serif', body: 'Verdana, sans-serif' },
        pwc: { heading: 'Georgia, serif', body: 'Arial, sans-serif' },
        lightning: { heading: 'Montserrat, sans-serif', body: 'Inter, sans-serif' }
    },

    // Helper function to generate CSS for a color scheme
    generateCSS(schemeName) {
        const scheme = this.colorSchemes[schemeName];
        if (!scheme) return '';

        return `
            :root {
                --deck-primary: ${scheme.primary};
                --deck-secondary: ${scheme.secondary};
                --deck-accent: ${scheme.accent};
                --deck-success: ${scheme.success};
                --deck-warning: ${scheme.warning};
                --deck-danger: ${scheme.danger};
                --deck-text: ${scheme.text};
                --deck-text-light: ${scheme.textLight};
                --deck-background: ${scheme.background};
                --deck-background-alt: ${scheme.backgroundAlt};
                --deck-border: ${scheme.border};
            }
        `;
    },

    // Get random background from category
    getRandomBackground(category) {
        const images = this.backgroundImages[category];
        if (!images || images.length === 0) return null;
        return images[Math.floor(Math.random() * images.length)];
    },

    // Generate PowerPoint using pptxgen
    async generatePowerPoint(deckTemplate, colorScheme = 'mckinsey', options = {}) {
        if (typeof PptxGenJS === 'undefined') {
            console.error('PptxGenJS not loaded');
            return null;
        }

        const pptx = new PptxGenJS();
        const scheme = this.colorSchemes[colorScheme];
        const fonts = this.fonts[colorScheme];

        // Set presentation properties
        pptx.author = options.author || 'Lightning Ledgerz';
        pptx.title = options.title || 'Financial Presentation';
        pptx.subject = options.subject || 'Financial Analysis';
        pptx.company = options.company || 'Lightning Ledgerz';

        // Define master slide
        pptx.defineSlideMaster({
            title: 'LIGHTNING_MASTER',
            background: { color: scheme.background },
            objects: [
                // Header line
                { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: scheme.primary } } },
                // Footer
                { rect: { x: 0, y: '95%', w: '100%', h: '5%', fill: { color: scheme.backgroundAlt } } },
                // Page number
                { text: { text: 'Page', options: { x: 9, y: 5.2, w: 1, h: 0.3, fontSize: 10, color: scheme.textLight } } }
            ]
        });

        return pptx;
    }
};

// Export for use in other modules
window.DeckTemplates = DeckTemplates;

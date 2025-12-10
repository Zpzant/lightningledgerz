// =====================================================
// LIGHTNING LEDGERZ - HOMEPAGE GRAPH CAROUSEL
// Clean slideshow with 6-second rotation
// =====================================================

class GraphCarousel {
    constructor() {
        this.container = null;
        this.currentIndex = 0;
        this.graphs = [];
        this.autoplayInterval = null;
        this.autoplayDelay = 6000; // 6 seconds
        this.init();
    }

    init() {
        // Only show on hero section
        this.createCarouselContainer();
        this.createGraphSlides();
        this.createNavigation();
        this.startAutoplay();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    createCarouselContainer() {
        this.container = document.createElement('div');
        this.container.id = 'graph-carousel';
        this.container.style.cssText = `
            width: 90%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 40px 0;
        `;

        // Create a section to hold the carousel after services
        const carouselSection = document.createElement('div');
        carouselSection.id = 'graph-carousel-section';
        carouselSection.style.cssText = `
            background: rgba(0, 0, 0, 0.95);
            padding: 60px 20px;
            margin-top: 0;
        `;

        // Add a heading
        const heading = document.createElement('h2');
        heading.textContent = 'Real-Time Financial Insights';
        heading.style.cssText = `
            color: #ff3333;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
        `;
        carouselSection.appendChild(heading);

        const subheading = document.createElement('p');
        subheading.textContent = 'See how Lightning Ledgerz transforms your data into actionable insights';
        subheading.style.cssText = `
            color: #888;
            text-align: center;
            font-size: 1.1rem;
            margin-bottom: 40px;
        `;
        carouselSection.appendChild(subheading);

        carouselSection.appendChild(this.container);

        // Insert after the services section
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.parentNode.insertBefore(carouselSection, servicesSection.nextSibling);
        }

        // Create inner wrapper
        const wrapper = document.createElement('div');
        wrapper.id = 'carousel-wrapper';
        wrapper.style.cssText = `
            position: relative;
            background: rgba(0, 0, 0, 0.85);
            border: 2px solid rgba(255, 51, 51, 0.5);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 51, 51, 0.15);
            backdrop-filter: blur(20px);
            overflow: hidden;
        `;
        this.container.appendChild(wrapper);

        // Create slides container
        const slidesContainer = document.createElement('div');
        slidesContainer.id = 'carousel-slides';
        slidesContainer.style.cssText = `
            display: flex;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
        `;
        wrapper.appendChild(slidesContainer);

        this.slidesContainer = slidesContainer;
        this.wrapper = wrapper;
    }

    createGraphSlides() {
        const graphData = [
            {
                title: 'Revenue Mix',
                type: 'pie',
                data: [
                    { label: 'Consulting', value: 36.8, color: '#ff3333' },
                    { label: 'Support', value: 28.5, color: '#ff6666' },
                    { label: 'Software', value: 22.2, color: '#cc2222' },
                    { label: 'Other', value: 12.5, color: '#ff9999' }
                ]
            },
            {
                title: 'Revenue Growth by Division',
                type: 'area',
                data: [120, 180, 220, 280, 350, 420, 480, 520, 580, 620, 680, 750],
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                suffix: 'K'
            },
            {
                title: 'Cost of Sales Breakdown',
                type: 'stacked-bar',
                categories: ['Materials', 'Labour', 'Freight'],
                data: [
                    { month: 'Q1', values: [85, 62, 28] },
                    { month: 'Q2', values: [92, 58, 32] },
                    { month: 'Q3', values: [78, 71, 25] },
                    { month: 'Q4', values: [105, 68, 35] }
                ]
            },
            {
                title: 'Key Performance Indicators',
                type: 'kpi-grid',
                kpis: [
                    { label: 'Revenue', value: '$2.4M', change: '+12.5%', positive: true },
                    { label: 'Profit Margin', value: '24.8%', change: '+3.2%', positive: true },
                    { label: 'Operating Costs', value: '$890K', change: '-5.1%', positive: true },
                    { label: 'Cash Flow', value: '$340K', change: '+8.7%', positive: true }
                ]
            },
            {
                title: 'Expense-to-Revenue Ratio',
                type: 'gauge',
                value: 79.1,
                target: 75,
                trend: [82, 81, 80.5, 79.8, 79.1]
            },
            {
                title: 'Top Expenses',
                type: 'horizontal-bar',
                data: [
                    { label: 'Salaries & Wages', value: 93 },
                    { label: 'Income Tax', value: 39 },
                    { label: 'Rent & Utilities', value: 28 },
                    { label: 'Marketing', value: 22 },
                    { label: 'Technology', value: 18 }
                ]
            }
        ];

        graphData.forEach((graph, index) => {
            const slide = this.createSlide(graph, index);
            this.slidesContainer.appendChild(slide);
            this.graphs.push(slide);
        });
    }

    createSlide(graph, index) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.cssText = `
            min-width: 100%;
            padding: 10px;
            box-sizing: border-box;
        `;

        let content = '';

        switch (graph.type) {
            case 'pie':
                content = this.createPieChart(graph);
                break;
            case 'area':
                content = this.createAreaChart(graph);
                break;
            case 'stacked-bar':
                content = this.createStackedBarChart(graph);
                break;
            case 'kpi-grid':
                content = this.createKPIGrid(graph);
                break;
            case 'gauge':
                content = this.createGaugeChart(graph);
                break;
            case 'horizontal-bar':
                content = this.createHorizontalBarChart(graph);
                break;
        }

        slide.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: #fff; font-size: 1.5rem; font-weight: 600; margin: 0;">${graph.title}</h3>
            </div>
            ${content}
        `;

        return slide;
    }

    createPieChart(graph) {
        const size = 200;
        const center = size / 2;
        const radius = 80;
        let startAngle = -90;

        let segments = '';
        let legendItems = '';

        graph.data.forEach((item, i) => {
            const angle = (item.value / 100) * 360;
            const endAngle = startAngle + angle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            segments += `
                <path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z"
                    fill="${item.color}" stroke="#000" stroke-width="2"
                    style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer; transition: transform 0.2s;"
                    onmouseenter="this.style.transform='scale(1.05)'"
                    onmouseleave="this.style.transform='scale(1)'"/>
            `;

            legendItems += `
                <div style="display: flex; align-items: center; gap: 8px; padding: 5px 0;">
                    <div style="width: 12px; height: 12px; background: ${item.color}; border-radius: 3px;"></div>
                    <span style="color: #ccc; font-size: 14px;">${item.label}</span>
                    <span style="color: #fff; font-weight: 600; margin-left: auto;">${item.value}%</span>
                </div>
            `;

            startAngle = endAngle;
        });

        return `
            <div style="display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap;">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <defs>
                        <filter id="pieShadow">
                            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
                        </filter>
                    </defs>
                    <g filter="url(#pieShadow)">${segments}</g>
                </svg>
                <div style="min-width: 180px;">${legendItems}</div>
            </div>
        `;
    }

    createAreaChart(graph) {
        const width = 800;
        const height = 200;
        const padding = { top: 20, right: 30, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxVal = Math.max(...graph.data);
        const minVal = 0;
        const range = maxVal - minVal;

        let pathD = '';
        let areaD = `M ${padding.left} ${height - padding.bottom} `;
        let dots = '';
        let labels = '';

        graph.data.forEach((val, i) => {
            const x = padding.left + (i / (graph.data.length - 1)) * chartWidth;
            const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;

            if (i === 0) {
                pathD += `M ${x} ${y}`;
                areaD += `L ${x} ${y}`;
            } else {
                pathD += ` L ${x} ${y}`;
                areaD += ` L ${x} ${y}`;
            }

            dots += `<circle cx="${x}" cy="${y}" r="4" fill="#ff3333" stroke="#fff" stroke-width="2"/>`;

            if (i % 2 === 0) {
                labels += `<text x="${x}" y="${height - 10}" fill="#888" font-size="11" text-anchor="middle">${graph.labels[i]}</text>`;
            }
        });

        areaD += ` L ${padding.left + chartWidth} ${height - padding.bottom} Z`;

        // Y-axis labels
        const yLabels = [0, maxVal / 2, maxVal].map((val, i) => {
            const y = padding.top + chartHeight - (i * chartHeight / 2);
            return `<text x="${padding.left - 10}" y="${y + 4}" fill="#888" font-size="11" text-anchor="end">$${Math.round(val)}${graph.suffix}</text>`;
        }).join('');

        return `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff3333;stop-opacity:0.4"/>
                        <stop offset="100%" style="stop-color:#ff3333;stop-opacity:0.05"/>
                    </linearGradient>
                </defs>
                <!-- Grid lines -->
                <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#333" stroke-width="1"/>
                <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#333" stroke-width="1"/>
                <!-- Area fill -->
                <path d="${areaD}" fill="url(#areaGradient)"/>
                <!-- Line -->
                <path d="${pathD}" fill="none" stroke="#ff3333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Dots -->
                ${dots}
                <!-- Labels -->
                ${labels}
                ${yLabels}
            </svg>
        `;
    }

    createStackedBarChart(graph) {
        const colors = ['#ff3333', '#ff6666', '#ff9999'];
        const barWidth = 80;
        const maxHeight = 150;
        const maxTotal = Math.max(...graph.data.map(d => d.values.reduce((a, b) => a + b, 0)));

        let bars = '';
        let legend = graph.categories.map((cat, i) => `
            <span style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 12px; height: 12px; background: ${colors[i]}; border-radius: 2px;"></div>
                <span style="color: #ccc; font-size: 12px;">${cat}</span>
            </span>
        `).join('');

        graph.data.forEach((item, i) => {
            const total = item.values.reduce((a, b) => a + b, 0);
            const x = 100 + i * 150;
            let y = maxHeight;

            item.values.forEach((val, j) => {
                const height = (val / maxTotal) * maxHeight;
                y -= height;
                bars += `
                    <rect x="${x}" y="${y}" width="${barWidth}" height="${height}"
                        fill="${colors[j]}" rx="4" ry="4"
                        style="transition: opacity 0.2s;"
                        onmouseenter="this.style.opacity='0.8'"
                        onmouseleave="this.style.opacity='1'"/>
                `;
            });

            bars += `<text x="${x + barWidth/2}" y="${maxHeight + 25}" fill="#888" font-size="12" text-anchor="middle">${item.month}</text>`;
        });

        return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                <svg width="700" height="200" viewBox="0 0 700 200">
                    ${bars}
                </svg>
                <div style="display: flex; gap: 30px; justify-content: center;">${legend}</div>
            </div>
        `;
    }

    createKPIGrid(graph) {
        const kpis = graph.kpis.map(kpi => `
            <div style="
                background: linear-gradient(135deg, rgba(255,51,51,0.1), rgba(0,0,0,0.3));
                border: 1px solid rgba(255,51,51,0.3);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
            " onmouseenter="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(255,51,51,0.2)'"
               onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                <div style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${kpi.label}</div>
                <div style="color: #fff; font-size: 28px; font-weight: 700; margin-bottom: 8px;">${kpi.value}</div>
                <div style="color: ${kpi.positive ? '#4caf50' : '#f44336'}; font-size: 14px; font-weight: 600;">
                    ${kpi.positive ? '▲' : '▼'} ${kpi.change}
                </div>
            </div>
        `).join('');

        return `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 800px; margin: 0 auto;">
                ${kpis}
            </div>
        `;
    }

    createGaugeChart(graph) {
        const size = 200;
        const center = size / 2;
        const radius = 70;
        const strokeWidth = 15;

        const startAngle = 135;
        const endAngle = 405;
        const range = endAngle - startAngle;
        const valueAngle = startAngle + (graph.value / 100) * range;
        const targetAngle = startAngle + (graph.target / 100) * range;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const valueRad = (valueAngle * Math.PI) / 180;

        const arcPath = (start, end) => {
            const x1 = center + radius * Math.cos(start);
            const y1 = center + radius * Math.sin(start);
            const x2 = center + radius * Math.cos(end);
            const y2 = center + radius * Math.sin(end);
            const largeArc = (end - start) > Math.PI ? 1 : 0;
            return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
        };

        // Trend sparkline
        const trendPath = graph.trend.map((v, i) => {
            const x = 10 + i * 20;
            const y = 30 - (v - 78) * 5;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        return `
            <div style="display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap;">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <!-- Background arc -->
                    <path d="${arcPath(startRad, endRad)}" fill="none" stroke="#333" stroke-width="${strokeWidth}" stroke-linecap="round"/>
                    <!-- Value arc -->
                    <path d="${arcPath(startRad, valueRad)}" fill="none" stroke="#ff3333" stroke-width="${strokeWidth}" stroke-linecap="round"
                        style="filter: drop-shadow(0 0 10px rgba(255,51,51,0.5));"/>
                    <!-- Center text -->
                    <text x="${center}" y="${center}" text-anchor="middle" fill="#fff" font-size="32" font-weight="700">${graph.value}%</text>
                    <text x="${center}" y="${center + 25}" text-anchor="middle" fill="#888" font-size="12">of revenue</text>
                </svg>
                <div style="text-align: left;">
                    <div style="color: #888; font-size: 12px; margin-bottom: 5px;">TARGET: ${graph.target}%</div>
                    <div style="color: ${graph.value <= graph.target ? '#4caf50' : '#ff6666'}; font-size: 14px; font-weight: 600; margin-bottom: 15px;">
                        ${graph.value <= graph.target ? '✓ On Target' : '⚠ Above Target'}
                    </div>
                    <div style="color: #888; font-size: 12px; margin-bottom: 5px;">5-MONTH TREND</div>
                    <svg width="100" height="40" viewBox="0 0 100 40">
                        <path d="${trendPath}" fill="none" stroke="#ff3333" stroke-width="2"/>
                    </svg>
                </div>
            </div>
        `;
    }

    createHorizontalBarChart(graph) {
        const maxVal = Math.max(...graph.data.map(d => d.value));

        const bars = graph.data.map((item, i) => `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
                <div style="width: 140px; color: #ccc; font-size: 13px; text-align: right;">${item.label}</div>
                <div style="flex: 1; background: rgba(255,255,255,0.1); height: 24px; border-radius: 4px; overflow: hidden;">
                    <div style="
                        width: ${(item.value / maxVal) * 100}%;
                        height: 100%;
                        background: linear-gradient(90deg, #ff3333, #ff6666);
                        border-radius: 4px;
                        transition: width 0.5s ease;
                    "></div>
                </div>
                <div style="width: 50px; color: #fff; font-weight: 600; font-size: 14px;">$${item.value}K</div>
            </div>
        `).join('');

        return `<div style="max-width: 600px; margin: 0 auto;">${bars}</div>`;
    }

    createNavigation() {
        // Dots navigation
        const dotsContainer = document.createElement('div');
        dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        `;

        this.graphs.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 2px solid #ff3333;
                background: ${index === 0 ? '#ff3333' : 'transparent'};
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
            `;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        this.wrapper.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');

        // Arrow buttons
        const prevBtn = this.createArrowButton('prev');
        const nextBtn = this.createArrowButton('next');

        this.wrapper.appendChild(prevBtn);
        this.wrapper.appendChild(nextBtn);
    }

    createArrowButton(direction) {
        const btn = document.createElement('button');
        btn.style.cssText = `
            position: absolute;
            top: 50%;
            ${direction === 'prev' ? 'left: 10px' : 'right: 10px'};
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(255,51,51,0.5);
            background: rgba(0,0,0,0.8);
            color: #ff3333;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
        `;
        btn.innerHTML = direction === 'prev' ? '‹' : '›';
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#ff3333';
            btn.style.color = '#fff';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(0,0,0,0.8)';
            btn.style.color = '#ff3333';
        });
        btn.addEventListener('click', () => {
            direction === 'prev' ? this.prevSlide() : this.nextSlide();
        });
        return btn;
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        this.updateDots();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.graphs.length;
        this.goToSlide(this.currentIndex);
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.graphs.length) % this.graphs.length;
        this.goToSlide(this.currentIndex);
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.style.background = index === this.currentIndex ? '#ff3333' : 'transparent';
        });
    }

    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GraphCarousel();
});

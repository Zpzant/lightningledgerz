// =====================================================
// LIGHTNING LEDGERZ - HOMEPAGE ANIMATIONS
// Floating financial graphs with red motifs
// =====================================================

class HomepageAnimations {
    constructor() {
        this.container = null;
        this.graphs = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isAnimating = true;
        this.init();
    }

    init() {
        // Create container for floating graphs
        this.container = document.createElement('div');
        this.container.id = 'floating-graphs-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        document.body.insertBefore(this.container, document.body.firstChild);

        // Track mouse for parallax effect
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Create floating graph cards
        this.createFloatingGraphs();

        // Start animation loop
        this.animate();
    }

    createFloatingGraphs() {
        const graphTypes = [
            { type: 'pie', title: 'Revenue Mix', data: this.generatePieData() },
            { type: 'bar', title: 'Cost of Sales', data: this.generateBarData() },
            { type: 'line', title: 'Revenue Growth', data: this.generateLineData() },
            { type: 'donut', title: 'Expense Ratio', data: this.generateDonutData() },
            { type: 'area', title: 'Cash Flow', data: this.generateAreaData() },
            { type: 'kpi', title: '15 KPIs', subtitle: 'on target', icon: '✓' },
            { type: 'metric', title: 'Expense-to-Revenue', value: '79.1%', change: '+0.36%' },
            { type: 'bar', title: 'Monthly Breakdown', data: this.generateBarData() },
            { type: 'line', title: 'Profit Margin', data: this.generateLineData() },
            { type: 'list', title: 'Top 10 Expenses', items: ['Salaries & Wages', 'Income Tax', 'Rent', 'Marketing', 'Utilities'] }
        ];

        graphTypes.forEach((graph, index) => {
            const card = this.createGraphCard(graph, index);
            this.container.appendChild(card);
            this.graphs.push({
                element: card,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                rotation: Math.random() * 10 - 5,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                scale: 0.6 + Math.random() * 0.4,
                parallaxFactor: 0.5 + Math.random() * 0.5,
                delay: index * 0.1
            });
        });
    }

    createGraphCard(graph, index) {
        const card = document.createElement('div');
        card.className = 'floating-graph-card';
        card.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.85);
            border: 2px solid rgba(255, 51, 51, 0.6);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(255, 51, 51, 0.2), 0 0 20px rgba(255, 51, 51, 0.1);
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.5s ease, box-shadow 0.3s ease;
            min-width: 200px;
            max-width: 280px;
        `;

        // Fade in with delay
        setTimeout(() => {
            card.style.opacity = '0.9';
            card.style.transform = 'scale(1)';
        }, index * 200);

        let content = '';

        switch (graph.type) {
            case 'pie':
                content = this.createPieChart(graph);
                break;
            case 'donut':
                content = this.createDonutChart(graph);
                break;
            case 'bar':
                content = this.createBarChart(graph);
                break;
            case 'line':
                content = this.createLineChart(graph);
                break;
            case 'area':
                content = this.createAreaChart(graph);
                break;
            case 'kpi':
                content = this.createKPICard(graph);
                break;
            case 'metric':
                content = this.createMetricCard(graph);
                break;
            case 'list':
                content = this.createListCard(graph);
                break;
        }

        card.innerHTML = content;
        return card;
    }

    createPieChart(graph) {
        const colors = ['#ff3333', '#ff6666', '#cc0000', '#ff9999', '#990000'];
        let segments = '';
        let rotation = 0;

        graph.data.forEach((value, i) => {
            const angle = (value / 100) * 360;
            segments += `<div style="
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: conic-gradient(from ${rotation}deg, ${colors[i % colors.length]} 0deg, ${colors[i % colors.length]} ${angle}deg, transparent ${angle}deg);
            "></div>`;
            rotation += angle;
        });

        return `
            <h4 style="color: #fff; margin-bottom: 15px; font-size: 14px; font-weight: 600;">${graph.title}</h4>
            <div style="position: relative; width: 120px; height: 120px; margin: 0 auto;">
                <div style="
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(
                        #ff3333 0deg 130deg,
                        #ff6666 130deg 200deg,
                        #cc0000 200deg 280deg,
                        #ff9999 280deg 330deg,
                        #990000 330deg 360deg
                    );
                    box-shadow: 0 0 20px rgba(255, 51, 51, 0.4);
                "></div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; justify-content: center;">
                <span style="font-size: 10px; color: #ff3333;">● Consulting</span>
                <span style="font-size: 10px; color: #ff6666;">● Support</span>
                <span style="font-size: 10px; color: #cc0000;">● Software</span>
            </div>
        `;
    }

    createDonutChart(graph) {
        return `
            <h4 style="color: #fff; margin-bottom: 15px; font-size: 14px; font-weight: 600;">${graph.title}</h4>
            <div style="position: relative; width: 100px; height: 100px; margin: 0 auto;">
                <div style="
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: conic-gradient(#ff3333 0deg 252deg, rgba(255,255,255,0.1) 252deg 360deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(255, 51, 51, 0.3);
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #000;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ff3333;
                        font-weight: bold;
                        font-size: 16px;
                    ">70%</div>
                </div>
            </div>
        `;
    }

    createBarChart(graph) {
        const bars = graph.data.map((value, i) => `
            <div style="display: flex; align-items: flex-end; gap: 3px;">
                <div style="
                    width: 20px;
                    height: ${value * 0.8}px;
                    background: linear-gradient(180deg, #ff3333, #cc0000);
                    border-radius: 3px 3px 0 0;
                    box-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
                "></div>
            </div>
        `).join('');

        return `
            <h4 style="color: #fff; margin-bottom: 15px; font-size: 14px; font-weight: 600;">${graph.title}</h4>
            <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 80px; padding: 10px 0;">
                ${bars}
            </div>
            <div style="display: flex; justify-content: space-around; font-size: 9px; color: #888; margin-top: 5px;">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
        `;
    }

    createLineChart(graph) {
        const points = graph.data;
        const width = 180;
        const height = 60;
        const maxVal = Math.max(...points);

        let pathD = 'M ';
        let areaD = `M 0 ${height} `;

        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * width;
            const y = height - (val / maxVal) * height;
            pathD += `${x} ${y} `;
            areaD += `L ${x} ${y} `;
        });
        areaD += `L ${width} ${height} Z`;

        return `
            <h4 style="color: #fff; margin-bottom: 15px; font-size: 14px; font-weight: 600;">${graph.title}</h4>
            <svg width="${width}" height="${height}" style="overflow: visible;">
                <defs>
                    <linearGradient id="lineGradient${Math.random()}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff3333;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:#ff3333;stop-opacity:0" />
                    </linearGradient>
                </defs>
                <path d="${areaD}" fill="url(#lineGradient${Math.random()})" />
                <polyline points="${points.map((val, i) => `${(i / (points.length - 1)) * width},${height - (val / maxVal) * height}`).join(' ')}"
                    fill="none" stroke="#ff3333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="filter: drop-shadow(0 0 5px rgba(255, 51, 51, 0.5));" />
            </svg>
        `;
    }

    createAreaChart(graph) {
        return this.createLineChart({ ...graph, title: graph.title });
    }

    createKPICard(graph) {
        return `
            <div style="text-align: center; padding: 10px;">
                <div style="
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 51, 51, 0.2);
                    border: 2px solid #ff3333;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    font-size: 24px;
                    color: #ff3333;
                ">${graph.icon}</div>
                <div style="font-size: 28px; font-weight: bold; color: #fff;">${graph.title}</div>
                <div style="font-size: 14px; color: #888;">${graph.subtitle}</div>
            </div>
        `;
    }

    createMetricCard(graph) {
        return `
            <div style="padding: 10px;">
                <h4 style="color: #888; margin-bottom: 10px; font-size: 12px; font-weight: 400;">${graph.title}</h4>
                <div style="font-size: 32px; font-weight: bold; color: #fff;">${graph.value}</div>
                <div style="font-size: 12px; color: #ff3333; margin-top: 5px;">▲ ${graph.change} from last month</div>
                <svg width="100%" height="40" style="margin-top: 10px;">
                    <polyline points="0,35 20,30 40,32 60,25 80,28 100,20 120,22 140,15 160,18 180,10"
                        fill="none" stroke="#ff3333" stroke-width="2" opacity="0.6" />
                </svg>
            </div>
        `;
    }

    createListCard(graph) {
        const items = graph.items.map((item, i) => `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span style="color: #fff; font-size: 11px;">${item}</span>
                <span style="color: #ff3333; font-size: 11px;">$${Math.floor(Math.random() * 50 + 20)}K</span>
            </div>
        `).join('');

        return `
            <h4 style="color: #fff; margin-bottom: 15px; font-size: 14px; font-weight: 600;">${graph.title}</h4>
            <div>${items}</div>
        `;
    }

    generatePieData() {
        return [36, 28, 22, 9, 5];
    }

    generateBarData() {
        return Array.from({ length: 6 }, () => Math.random() * 60 + 40);
    }

    generateLineData() {
        let value = 50;
        return Array.from({ length: 8 }, () => {
            value += (Math.random() - 0.3) * 20;
            return Math.max(20, Math.min(100, value));
        });
    }

    generateDonutData() {
        return [70, 30];
    }

    generateAreaData() {
        return this.generateLineData();
    }

    animate() {
        if (!this.isAnimating) return;

        this.graphs.forEach((graph, index) => {
            // Update position
            graph.x += graph.speedX;
            graph.y += graph.speedY;

            // Bounce off edges
            if (graph.x < -100) graph.x = window.innerWidth + 100;
            if (graph.x > window.innerWidth + 100) graph.x = -100;
            if (graph.y < -100) graph.y = window.innerHeight + 100;
            if (graph.y > window.innerHeight + 100) graph.y = -100;

            // Update rotation
            graph.rotation += graph.rotationSpeed;

            // Apply parallax based on mouse position
            const parallaxX = this.mouseX * 30 * graph.parallaxFactor;
            const parallaxY = this.mouseY * 30 * graph.parallaxFactor;

            // Apply transform
            graph.element.style.transform = `
                translate(${graph.x + parallaxX}px, ${graph.y + parallaxY}px)
                rotate(${graph.rotation}deg)
                scale(${graph.scale})
            `;
        });

        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.isAnimating = false;
        if (this.container) {
            this.container.remove();
        }
    }
}

// Initialize when DOM is ready
let homepageAnimations = null;

document.addEventListener('DOMContentLoaded', () => {
    // Only show on homepage/hero section
    homepageAnimations = new HomepageAnimations();
});

// Cleanup on page change (if using SPA navigation)
window.addEventListener('beforeunload', () => {
    if (homepageAnimations) {
        homepageAnimations.destroy();
    }
});

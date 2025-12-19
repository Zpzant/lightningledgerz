// =====================================================
// LIGHTNING LEDGERZ - ONBOARDING TUTORIAL SYSTEM
// Interactive product tour and feature discovery
// =====================================================

class OnboardingTutorial {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.completedTours = this.loadProgress();

        this.tours = {
            welcome: {
                name: 'Welcome Tour',
                icon: '👋',
                steps: [
                    {
                        title: 'Welcome to Lightning Ledgerz! ⚡',
                        content: 'Your AI-powered financial intelligence platform. Let me show you around!',
                        target: null,
                        position: 'center'
                    },
                    {
                        title: 'Quick Access Commands',
                        content: 'Press <kbd>Ctrl+K</kbd> anytime to open the command palette for quick navigation.',
                        target: null,
                        position: 'center',
                        action: 'showCommandPaletteHint'
                    },
                    {
                        title: 'Your Dashboard',
                        content: 'View real-time financial metrics, charts, and AI-powered insights all in one place.',
                        target: '#dashboard-link',
                        position: 'bottom'
                    },
                    {
                        title: 'Report Builder',
                        content: 'Create professional financial reports with drag-and-drop ease. Export to PDF or PowerPoint.',
                        target: '.report-builder-trigger',
                        position: 'bottom'
                    },
                    {
                        title: 'Pro Decks',
                        content: 'Generate investor-ready presentations in minutes. Board meetings will never be the same!',
                        target: '#pptTab',
                        position: 'bottom'
                    },
                    {
                        title: 'Your AI Assistant',
                        content: 'I\'m always here to help! Click me for tips, insights, and guidance.',
                        target: '.avatar-selector-btn',
                        position: 'left'
                    },
                    {
                        title: 'You\'re All Set!',
                        content: 'Start exploring! Upload your first file or create a report. I\'ll be here if you need me.',
                        target: null,
                        position: 'center',
                        celebration: true
                    }
                ]
            },
            reports: {
                name: 'Report Builder',
                icon: '📊',
                steps: [
                    {
                        title: 'Report Builder Basics',
                        content: 'Create professional financial reports with our drag-and-drop builder.',
                        target: null,
                        position: 'center'
                    },
                    {
                        title: 'Element Sidebar',
                        content: 'Drag elements from here onto your canvas. Charts, tables, KPIs, and more!',
                        target: '#rb-sidebar',
                        position: 'right'
                    },
                    {
                        title: 'Canvas Area',
                        content: 'This is your report canvas. Arrange elements by dragging them around.',
                        target: '#rb-canvas',
                        position: 'top'
                    },
                    {
                        title: 'Templates',
                        content: 'Start faster with pre-built templates. Click to load one instantly.',
                        target: '#rb-template-btn',
                        position: 'bottom'
                    },
                    {
                        title: 'Color Themes',
                        content: 'Choose from professional color palettes - McKinsey, Deloitte, and more.',
                        target: '#rb-palette',
                        position: 'bottom'
                    },
                    {
                        title: 'Export Options',
                        content: 'Export your finished report as PDF, image, or PowerPoint.',
                        target: '#rb-export',
                        position: 'bottom'
                    }
                ]
            },
            files: {
                name: 'File Management',
                icon: '📁',
                steps: [
                    {
                        title: 'Your Files',
                        content: 'Upload and manage your financial documents in one secure place.',
                        target: null,
                        position: 'center'
                    },
                    {
                        title: 'Categorized Uploads',
                        content: 'Upload files to specific categories for automatic organization and analysis.',
                        target: '.file-category',
                        position: 'top'
                    },
                    {
                        title: 'Drag & Drop',
                        content: 'Simply drag files onto any category to upload instantly.',
                        target: '.file-manager',
                        position: 'top'
                    },
                    {
                        title: 'Auto Analysis',
                        content: 'Cash flow files are automatically analyzed for imbalances and issues!',
                        target: '[data-category="trailing-cash-flow"]',
                        position: 'top'
                    }
                ]
            },
            analysis: {
                name: 'Financial Analysis',
                icon: '🔍',
                steps: [
                    {
                        title: 'Financial Analysis Pro',
                        content: 'Professional-grade financial analysis at your fingertips.',
                        target: null,
                        position: 'center'
                    },
                    {
                        title: 'Health Score',
                        content: 'Your overall financial health score based on key metrics and ratios.',
                        target: '.health-score',
                        position: 'bottom'
                    },
                    {
                        title: 'Key Insights',
                        content: 'AI-generated insights highlight what\'s working and what needs attention.',
                        target: '.insights-section',
                        position: 'top'
                    },
                    {
                        title: 'Recommendations',
                        content: 'Actionable recommendations to improve your financial performance.',
                        target: '.recommendations',
                        position: 'top'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.addStyles();
        this.createUI();
        this.checkFirstVisit();
    }

    loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('onboardingProgress')) || {};
        } catch {
            return {};
        }
    }

    saveProgress() {
        localStorage.setItem('onboardingProgress', JSON.stringify(this.completedTours));
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .onboarding-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10010;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .onboarding-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .onboarding-highlight {
                position: fixed;
                border: 3px solid #f39c12;
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(243, 156, 18, 0.5);
                z-index: 10011;
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .onboarding-tooltip {
                position: fixed;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #f39c12;
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                z-index: 10012;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: tooltipIn 0.3s ease;
            }

            @keyframes tooltipIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .onboarding-tooltip.center {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .onboarding-tooltip h3 {
                color: #f39c12;
                margin: 0 0 12px 0;
                font-size: 20px;
            }

            .onboarding-tooltip p {
                color: #ccc;
                margin: 0 0 20px 0;
                line-height: 1.6;
            }

            .onboarding-tooltip kbd {
                display: inline-block;
                padding: 4px 8px;
                font-size: 12px;
                font-family: monospace;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: #f39c12;
            }

            .onboarding-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .onboarding-dots {
                display: flex;
                gap: 8px;
            }

            .onboarding-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transition: all 0.2s;
            }

            .onboarding-dot.active {
                background: #f39c12;
                width: 24px;
                border-radius: 4px;
            }

            .onboarding-dot.completed {
                background: #00d97e;
            }

            .onboarding-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }

            .onboarding-btn-skip {
                background: transparent;
                color: #888;
            }

            .onboarding-btn-skip:hover {
                color: #fff;
            }

            .onboarding-btn-next {
                background: linear-gradient(135deg, #f39c12, #e74c3c);
                color: #fff;
            }

            .onboarding-btn-next:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(243, 156, 18, 0.4);
            }

            .onboarding-progress {
                position: absolute;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #f39c12, #e74c3c);
                border-radius: 16px 16px 0 0;
                transition: width 0.3s ease;
            }

            .tour-launcher {
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 9996;
            }

            .tour-launcher-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #9933ff, #6633cc);
                border: 2px solid #fff;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 20px rgba(153, 51, 255, 0.4);
                transition: all 0.3s ease;
            }

            .tour-launcher-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(153, 51, 255, 0.6);
            }

            .tour-menu {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px;
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.2s ease;
            }

            .tour-launcher.active .tour-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .tour-menu-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .tour-menu-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .tour-menu-item-icon {
                font-size: 20px;
            }

            .tour-menu-item-text {
                flex: 1;
            }

            .tour-menu-item-name {
                color: #fff;
                font-weight: 500;
            }

            .tour-menu-item-status {
                font-size: 12px;
                color: #888;
            }

            .tour-menu-item-check {
                color: #00d97e;
            }

            .celebration-confetti {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10020;
            }
        `;
        document.head.appendChild(style);
    }

    createUI() {
        // Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        document.body.appendChild(this.overlay);

        // Highlight box
        this.highlight = document.createElement('div');
        this.highlight.className = 'onboarding-highlight';
        this.highlight.style.display = 'none';
        document.body.appendChild(this.highlight);

        // Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'onboarding-tooltip';
        document.body.appendChild(this.tooltip);

        // Tour launcher button
        this.launcher = document.createElement('div');
        this.launcher.className = 'tour-launcher';
        this.launcher.innerHTML = `
            <button class="tour-launcher-btn">?</button>
            <div class="tour-menu">
                ${Object.entries(this.tours).map(([id, tour]) => `
                    <div class="tour-menu-item" onclick="window.onboardingTutorial.startTour('${id}')">
                        <span class="tour-menu-item-icon">${tour.icon}</span>
                        <div class="tour-menu-item-text">
                            <div class="tour-menu-item-name">${tour.name}</div>
                            <div class="tour-menu-item-status">${this.completedTours[id] ? 'Completed' : tour.steps.length + ' steps'}</div>
                        </div>
                        ${this.completedTours[id] ? '<span class="tour-menu-item-check">✓</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        document.body.appendChild(this.launcher);

        this.launcher.querySelector('.tour-launcher-btn').onclick = () => {
            this.launcher.classList.toggle('active');
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.launcher.contains(e.target)) {
                this.launcher.classList.remove('active');
            }
        });
    }

    checkFirstVisit() {
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        if (!hasVisited && window.currentUser) {
            // First visit - start welcome tour after a delay
            setTimeout(() => {
                this.startTour('welcome');
            }, 2000);
            localStorage.setItem('hasVisitedBefore', 'true');
        }
    }

    startTour(tourId) {
        const tour = this.tours[tourId];
        if (!tour) return;

        this.currentTour = tourId;
        this.currentStep = 0;
        this.isActive = true;
        this.launcher.classList.remove('active');

        this.overlay.classList.add('active');
        this.showStep();
    }

    showStep() {
        const tour = this.tours[this.currentTour];
        const step = tour.steps[this.currentStep];
        const totalSteps = tour.steps.length;
        const progress = ((this.currentStep + 1) / totalSteps) * 100;

        // Build tooltip content
        this.tooltip.innerHTML = `
            <div class="onboarding-progress" style="width: ${progress}%"></div>
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="onboarding-nav">
                <button class="onboarding-btn onboarding-btn-skip" onclick="window.onboardingTutorial.endTour()">
                    Skip Tour
                </button>
                <div class="onboarding-dots">
                    ${tour.steps.map((_, i) => `
                        <div class="onboarding-dot ${i < this.currentStep ? 'completed' : ''} ${i === this.currentStep ? 'active' : ''}"></div>
                    `).join('')}
                </div>
                <button class="onboarding-btn onboarding-btn-next" onclick="window.onboardingTutorial.nextStep()">
                    ${this.currentStep === totalSteps - 1 ? 'Finish' : 'Next'} →
                </button>
            </div>
        `;

        // Position tooltip
        if (step.target && step.position !== 'center') {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                this.positionTooltip(targetEl, step.position);
                this.showHighlight(targetEl);
            } else {
                this.centerTooltip();
                this.highlight.style.display = 'none';
            }
        } else {
            this.centerTooltip();
            this.highlight.style.display = 'none';
        }

        // Execute any step actions
        if (step.action) {
            this.executeAction(step.action);
        }

        // Celebration on last step
        if (step.celebration) {
            this.celebrate();
        }
    }

    positionTooltip(targetEl, position) {
        const rect = targetEl.getBoundingClientRect();
        const tooltipWidth = 400;
        const tooltipHeight = 200;
        const padding = 20;

        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipHeight - padding;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'bottom':
                top = rect.bottom + padding;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.left - tooltipWidth - padding;
                break;
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + padding;
                break;
        }

        // Keep within viewport
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

        this.tooltip.classList.remove('center');
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.transform = 'none';
    }

    centerTooltip() {
        this.tooltip.classList.add('center');
        this.tooltip.style.top = '50%';
        this.tooltip.style.left = '50%';
        this.tooltip.style.transform = 'translate(-50%, -50%)';
    }

    showHighlight(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const padding = 8;

        this.highlight.style.display = 'block';
        this.highlight.style.top = `${rect.top - padding}px`;
        this.highlight.style.left = `${rect.left - padding}px`;
        this.highlight.style.width = `${rect.width + padding * 2}px`;
        this.highlight.style.height = `${rect.height + padding * 2}px`;
    }

    nextStep() {
        const tour = this.tours[this.currentTour];

        if (this.currentStep < tour.steps.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.completeTour();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    }

    completeTour() {
        this.completedTours[this.currentTour] = true;
        this.saveProgress();
        this.endTour();

        if (window.toast) {
            window.toast.success('Tour Complete! 🎉', 'You\'re ready to explore on your own!');
        }

        // Update launcher menu
        this.launcher.querySelector('.tour-menu').innerHTML = Object.entries(this.tours).map(([id, tour]) => `
            <div class="tour-menu-item" onclick="window.onboardingTutorial.startTour('${id}')">
                <span class="tour-menu-item-icon">${tour.icon}</span>
                <div class="tour-menu-item-text">
                    <div class="tour-menu-item-name">${tour.name}</div>
                    <div class="tour-menu-item-status">${this.completedTours[id] ? 'Completed' : tour.steps.length + ' steps'}</div>
                </div>
                ${this.completedTours[id] ? '<span class="tour-menu-item-check">✓</span>' : ''}
            </div>
        `).join('');
    }

    endTour() {
        this.isActive = false;
        this.overlay.classList.remove('active');
        this.highlight.style.display = 'none';
        this.tooltip.innerHTML = '';
    }

    executeAction(action) {
        switch (action) {
            case 'showCommandPaletteHint':
                // Flash the Ctrl+K hint
                break;
        }
    }

    celebrate() {
        if (typeof launchConfetti === 'function') {
            launchConfetti();
        }
    }

    // Manual trigger for specific features
    showFeatureTip(feature) {
        const tips = {
            commandPalette: {
                title: 'Command Palette',
                content: 'Press <kbd>Ctrl+K</kbd> to quickly access any feature!'
            },
            shortcuts: {
                title: 'Keyboard Shortcuts',
                content: 'Use <kbd>Ctrl+R</kbd> for reports, <kbd>Ctrl+P</kbd> for presentations'
            },
            upload: {
                title: 'Quick Upload',
                content: 'Drag and drop files anywhere on the page to upload!'
            }
        };

        const tip = tips[feature];
        if (tip && window.avatarPersonality) {
            window.avatarPersonality.showMessage(`<strong>${tip.title}</strong><br>${tip.content}`, { duration: 8000 });
        }
    }
}

// Initialize
window.onboardingTutorial = new OnboardingTutorial();

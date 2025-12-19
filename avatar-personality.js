// =====================================================
// LIGHTNING LEDGERZ - AVATAR PERSONALITY SYSTEM
// Advanced AI-like conversations and contextual help
// =====================================================

class AvatarPersonality {
    constructor() {
        this.currentMood = 'friendly';
        this.conversationHistory = [];
        this.tips = this.getFinancialTips();
        this.greetings = this.getGreetings();
        this.encouragements = this.getEncouragements();
        this.insights = this.getInsights();
        this.lastInteraction = null;
        this.tipIndex = 0;
        this.init();
    }

    init() {
        this.addStyles();
        this.createChatInterface();
        this.startAmbientMessages();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .avatar-chat-bubble {
                position: fixed;
                bottom: 180px;
                right: 90px;
                max-width: 320px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #f39c12;
                border-radius: 20px 20px 5px 20px;
                padding: 16px 20px;
                color: #fff;
                font-size: 14px;
                line-height: 1.5;
                z-index: 9998;
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 10px 40px rgba(243, 156, 18, 0.2);
                pointer-events: none;
            }

            .avatar-chat-bubble.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: auto;
            }

            .avatar-chat-bubble::after {
                content: '';
                position: absolute;
                bottom: 10px;
                right: -10px;
                width: 0;
                height: 0;
                border-left: 12px solid #f39c12;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }

            .avatar-chat-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .avatar-chat-name {
                font-weight: 600;
                color: #f39c12;
            }

            .avatar-chat-mood {
                font-size: 11px;
                color: #888;
            }

            .avatar-chat-message {
                color: #ddd;
            }

            .avatar-chat-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }

            .avatar-chat-action {
                padding: 6px 12px;
                background: rgba(243, 156, 18, 0.2);
                border: 1px solid rgba(243, 156, 18, 0.3);
                border-radius: 15px;
                color: #f39c12;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .avatar-chat-action:hover {
                background: rgba(243, 156, 18, 0.4);
                border-color: #f39c12;
            }

            .avatar-typing {
                display: flex;
                gap: 4px;
                padding: 10px 0;
            }

            .avatar-typing span {
                width: 8px;
                height: 8px;
                background: #f39c12;
                border-radius: 50%;
                animation: typingBounce 1.4s infinite;
            }

            .avatar-typing span:nth-child(2) { animation-delay: 0.2s; }
            .avatar-typing span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-8px); }
            }

            .avatar-quick-input {
                width: 100%;
                padding: 10px 14px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                color: #fff;
                font-size: 13px;
                margin-top: 12px;
                outline: none;
                transition: border-color 0.2s;
            }

            .avatar-quick-input:focus {
                border-color: #f39c12;
            }

            .avatar-quick-input::placeholder {
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }

    getFinancialTips() {
        return [
            { category: '💰', tip: 'Tip: A healthy current ratio is between 1.5 and 2.0. Below 1 could indicate liquidity issues.' },
            { category: '📊', tip: 'Did you know? The Rule of 40 says growth rate + profit margin should exceed 40% for a healthy SaaS company.' },
            { category: '💡', tip: 'Pro tip: DSO (Days Sales Outstanding) over 45 days? Consider tightening your credit terms.' },
            { category: '📈', tip: 'Insight: Companies with LTV/CAC ratio of 3:1 or higher are typically well-positioned for growth.' },
            { category: '⚡', tip: 'Quick win: Reducing your cash conversion cycle by even 5 days can significantly improve working capital.' },
            { category: '🎯', tip: 'Best practice: Review your burn rate monthly. Runway under 12 months requires immediate attention.' },
            { category: '💎', tip: 'CFO tip: Gross margins above 70% in SaaS indicate strong pricing power and operational efficiency.' },
            { category: '🔥', tip: 'Hot take: Net Revenue Retention above 120% means you can grow without acquiring new customers.' },
            { category: '📉', tip: 'Watch out: Customer churn above 5% monthly compounds quickly. A 5% monthly churn = 46% annual churn!' },
            { category: '🚀', tip: 'Growth hack: Companies hitting 10% month-over-month growth are on track to 3x annually.' }
        ];
    }

    getGreetings() {
        return {
            morning: [
                "Good morning! ☀️ Ready to make some smart financial moves today?",
                "Rise and shine! Let's analyze some numbers together.",
                "Morning! Your dashboard is looking great today. Want a quick summary?",
                "Hey there! Early bird catches the worm - and the best financial insights!"
            ],
            afternoon: [
                "Good afternoon! How's your financial health looking today?",
                "Hey! Perfect time for a mid-day financial check-in.",
                "Afternoon! Need help with any reports or analysis?",
                "Hi there! Ready to crunch some numbers?"
            ],
            evening: [
                "Good evening! Let's wrap up the day with some solid insights.",
                "Evening! Time to review today's financial activity.",
                "Hey! Still grinding? I'm here to help with your analysis.",
                "Good evening! Perfect time to plan for tomorrow."
            ]
        };
    }

    getEncouragements() {
        return [
            "You're doing great! Your financial metrics are improving.",
            "Keep it up! Consistency in tracking leads to better decisions.",
            "Nice work on those reports! They're looking professional.",
            "Your cash flow management is on point today!",
            "I can see you're making smart financial choices. 🌟",
            "That analysis was spot-on! Great financial thinking.",
            "You're getting better at this every day!",
            "Your financial discipline is impressive!"
        ];
    }

    getInsights() {
        return {
            dashboard: [
                "I notice your revenue is trending up! Would you like me to project next quarter?",
                "Your operating expenses seem stable. That's great for margin improvement!",
                "Cash position looks healthy. Have you considered investing excess cash?"
            ],
            reports: [
                "Pro tip: Add a variance analysis to make your report more insightful.",
                "This report would look great with some trend charts. Want me to help?",
                "Consider adding key takeaways at the beginning for executive readers."
            ],
            files: [
                "I can analyze your uploaded files for financial insights. Want me to take a look?",
                "Your cash flow statement looks interesting. Should I check for any imbalances?",
                "I noticed you uploaded a budget. Want me to compare it with your actuals?"
            ]
        };
    }

    createChatInterface() {
        this.bubble = document.createElement('div');
        this.bubble.className = 'avatar-chat-bubble';
        this.bubble.innerHTML = `
            <div class="avatar-chat-header">
                <span class="avatar-chat-name">Assistant</span>
                <span class="avatar-chat-mood">Ready to help</span>
            </div>
            <div class="avatar-chat-message"></div>
            <div class="avatar-chat-actions"></div>
        `;
        document.body.appendChild(this.bubble);

        this.messageEl = this.bubble.querySelector('.avatar-chat-message');
        this.actionsEl = this.bubble.querySelector('.avatar-chat-actions');
        this.nameEl = this.bubble.querySelector('.avatar-chat-name');
        this.moodEl = this.bubble.querySelector('.avatar-chat-mood');
    }

    // Show a message from the avatar
    async showMessage(message, options = {}) {
        const {
            actions = [],
            duration = 8000,
            typing = true,
            avatarName = null
        } = options;

        // Update avatar name if provided
        if (avatarName) {
            this.nameEl.textContent = avatarName;
        }

        // Show typing indicator
        if (typing) {
            this.messageEl.innerHTML = `
                <div class="avatar-typing">
                    <span></span><span></span><span></span>
                </div>
            `;
            this.actionsEl.innerHTML = '';
            this.bubble.classList.add('visible');
            await this.delay(800 + Math.random() * 500);
        }

        // Show message
        this.messageEl.innerHTML = message;

        // Add action buttons
        this.actionsEl.innerHTML = actions.map(action =>
            `<button class="avatar-chat-action" onclick="${action.handler}">${action.label}</button>`
        ).join('');

        this.bubble.classList.add('visible');

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => this.hideMessage(), duration);
        }

        // Track conversation
        this.conversationHistory.push({
            message,
            timestamp: new Date().toISOString()
        });

        this.lastInteraction = Date.now();
    }

    hideMessage() {
        this.bubble.classList.remove('visible');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get appropriate greeting based on time
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        let period;
        if (hour < 12) period = 'morning';
        else if (hour < 17) period = 'afternoon';
        else period = 'evening';

        const greetings = this.greetings[period];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Get random tip
    getRandomTip() {
        const tip = this.tips[this.tipIndex % this.tips.length];
        this.tipIndex++;
        return tip;
    }

    // Get random encouragement
    getRandomEncouragement() {
        return this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
    }

    // Context-aware insights
    getContextualInsight() {
        // Check current page/section
        const profile = document.getElementById('profile');
        const dashboard = document.getElementById('dashboard');

        if (dashboard && !dashboard.classList.contains('hidden')) {
            return this.insights.dashboard[Math.floor(Math.random() * this.insights.dashboard.length)];
        }

        if (profile && !profile.classList.contains('hidden')) {
            const currentTab = document.querySelector('.tab-content.active, .tab-content:not([style*="display: none"])');
            if (currentTab?.id?.includes('document')) {
                return this.insights.files[Math.floor(Math.random() * this.insights.files.length)];
            }
        }

        return this.insights.reports[Math.floor(Math.random() * this.insights.reports.length)];
    }

    // Start ambient message system
    startAmbientMessages() {
        // Initial greeting after page load
        setTimeout(() => {
            const greeting = this.getTimeBasedGreeting();
            this.showMessage(greeting, {
                actions: [
                    { label: '📊 Show Dashboard', handler: 'window.avatarPersonality.triggerDashboard()' },
                    { label: '💡 Give me a tip', handler: 'window.avatarPersonality.showTip()' }
                ],
                duration: 10000
            });
        }, 3000);

        // Periodic tips (every 5-10 minutes)
        setInterval(() => {
            // Only show if user hasn't interacted recently
            if (!this.lastInteraction || Date.now() - this.lastInteraction > 120000) {
                const shouldShow = Math.random() > 0.5;
                if (shouldShow) {
                    this.showTip();
                }
            }
        }, 300000 + Math.random() * 300000);
    }

    // Show a financial tip
    showTip() {
        const { category, tip } = this.getRandomTip();
        this.showMessage(`${category} ${tip}`, {
            actions: [
                { label: '👍 Thanks!', handler: 'window.avatarPersonality.respondThanks()' },
                { label: '🔄 Another tip', handler: 'window.avatarPersonality.showTip()' }
            ],
            duration: 12000
        });
    }

    // Respond to user actions
    respondThanks() {
        const responses = [
            "You're welcome! I'm always here to help. 😊",
            "Happy to help! Let me know if you need anything else.",
            "Anytime! Remember, I've got more tips where that came from.",
            "My pleasure! Your financial success is my goal."
        ];
        this.showMessage(responses[Math.floor(Math.random() * responses.length)], {
            duration: 4000
        });
    }

    // Celebrate achievements
    celebrate(achievement) {
        const celebrations = {
            reportGenerated: [
                "🎉 Nice! Your report is ready. It's looking professional!",
                "✨ Report generated! Your stakeholders will love this.",
                "🚀 Done! That's a board-ready report right there."
            ],
            fileUploaded: [
                "📁 File uploaded successfully! Want me to analyze it?",
                "✅ Got it! Your file is now safe in your account.",
                "📤 Upload complete! I can help you make sense of this data."
            ],
            dashboardViewed: [
                "📊 Here's your dashboard! Everything looks on track.",
                "📈 Great to see you checking in! Your metrics are looking healthy.",
                "👀 Taking a look at the numbers? Smart move!"
            ]
        };

        const messages = celebrations[achievement] || ["Great job! 🌟"];
        this.showMessage(messages[Math.floor(Math.random() * messages.length)], {
            duration: 5000
        });
    }

    // Provide help based on context
    offerHelp(context) {
        const helpMessages = {
            reportBuilder: "Need help with your report? Try dragging elements from the sidebar, or use one of our pre-built templates!",
            fileManager: "Uploading files? Make sure to categorize them correctly - it helps with automatic analysis!",
            proDeck: "Creating a presentation? I recommend starting with a template and customizing from there.",
            quickbooks: "Connecting QuickBooks? Once linked, I can automatically sync your financial data!",
            dashboard: "Your dashboard shows real-time metrics. Click on any card for more details!"
        };

        this.showMessage(helpMessages[context] || "How can I help you today?", {
            actions: [
                { label: '✓ Got it', handler: 'window.avatarPersonality.hideMessage()' },
                { label: '📖 More help', handler: 'window.avatarPersonality.showDetailedHelp("' + context + '")' }
            ],
            duration: 15000
        });
    }

    showDetailedHelp(context) {
        const detailedHelp = {
            reportBuilder: `
                <strong>Report Builder Guide:</strong><br>
                1. Drag elements from sidebar<br>
                2. Click to edit content<br>
                3. Use templates for quick start<br>
                4. Export to PDF when done
            `,
            fileManager: `
                <strong>File Manager Guide:</strong><br>
                1. Upload to specific categories<br>
                2. Cash flow files get auto-analyzed<br>
                3. Files are private to your account<br>
                4. Click any file to preview
            `,
            default: `
                <strong>Need help?</strong><br>
                • Press Ctrl+K for command palette<br>
                • Use the floating action button for quick access<br>
                • Check the settings for preferences
            `
        };

        this.showMessage(detailedHelp[context] || detailedHelp.default, {
            duration: 20000
        });
    }

    triggerDashboard() {
        this.hideMessage();
        if (typeof handleDashboardClick === 'function') {
            handleDashboardClick();
        } else {
            window.location.href = '#dashboard';
        }
        setTimeout(() => this.celebrate('dashboardViewed'), 1000);
    }

    // Warn about potential issues
    warn(issue) {
        const warnings = {
            lowCash: "⚠️ I noticed your cash position might be getting low. Would you like me to run a runway analysis?",
            highBurn: "🔥 Your burn rate seems elevated this month. Let's look at what's driving it.",
            missedTarget: "📉 Looks like you missed a target. Don't worry - let's analyze what happened.",
            overdueInvoices: "💸 Some invoices might be overdue. Want me to check your AR aging?"
        };

        this.showMessage(warnings[issue] || "I noticed something that needs attention.", {
            actions: [
                { label: '🔍 Analyze', handler: 'window.financialAnalysisPro?.renderAnalysisUI()' },
                { label: '✕ Dismiss', handler: 'window.avatarPersonality.hideMessage()' }
            ],
            duration: 15000
        });
    }

    // Update avatar name based on current selection
    updateAvatarName(name) {
        this.nameEl.textContent = name;
    }

    // Motivational messages for specific times
    sendMotivation() {
        const motivation = this.getRandomEncouragement();
        this.showMessage(motivation, { duration: 5000 });
    }
}

// Initialize
window.avatarPersonality = new AvatarPersonality();

// Hook into existing avatar system
document.addEventListener('DOMContentLoaded', () => {
    // Update personality avatar name when selector changes
    const originalSelectAvatar = window.avatarSelector?.selectAvatar;
    if (originalSelectAvatar && window.avatarSelector) {
        window.avatarSelector.selectAvatar = function(id) {
            originalSelectAvatar.call(this, id);
            const avatar = this.avatars[id];
            if (avatar && window.avatarPersonality) {
                window.avatarPersonality.updateAvatarName(avatar.name);
            }
        };
    }

    // Track file uploads
    const originalFileSelect = window.fileManager?.handleFileSelect;
    if (originalFileSelect && window.fileManager) {
        window.fileManager.handleFileSelect = async function(categoryId, file) {
            await originalFileSelect.call(this, categoryId, file);
            window.avatarPersonality?.celebrate('fileUploaded');
        };
    }
});

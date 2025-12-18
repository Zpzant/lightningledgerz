// =====================================================
// LIGHTNING LEDGERZ - CLAUDE AI AVATAR INTEGRATION
// Smart avatar interactions powered by Claude API
// Financial analysis, report building, and guidance
// =====================================================

class ClaudeAvatarAI {
    constructor() {
        // Note: API key should be stored securely, not in client-side code
        // This is a placeholder - actual implementation should use a backend proxy
        this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
        this.model = 'claude-3-haiku-20240307';
        this.isProcessing = false;
        this.conversationHistory = [];
        this.currentAvatar = 'zac';

        // System prompts for different avatars
        this.avatarPersonalities = {
            zac: {
                name: 'Zac',
                systemPrompt: `You are Zac, the Lead Financial Strategist at Lightning Ledgerz. You're a charming, confident professional who combines sharp business acumen with a friendly, approachable demeanor.

Your personality:
- Confident but not arrogant
- Uses clear, jargon-free language when explaining complex financial concepts
- Occasionally makes clever quips or business puns
- Genuinely cares about helping users succeed
- Gets excited about good financial data and insights

Your capabilities in Lightning Ledgerz:
- Help users understand their financial reports
- Guide them through the report builder
- Explain KPIs and metrics
- Suggest improvements to their financial presentations
- Answer questions about budgeting, cash flow, P&L analysis
- Navigate them to the right tools and features

Always be helpful, concise, and actionable. When suggesting actions, be specific about what the user should do in the app.`
            },
            bolt: {
                name: 'Bolt',
                systemPrompt: `You are Bolt, the Lightning Helper at Lightning Ledgerz. You're an energetic, enthusiastic assistant who loves making financial tasks fun and easy!

Your personality:
- Super energetic and positive (use occasional emojis sparingly)
- Makes finance feel approachable and not scary
- Celebrates user wins, no matter how small
- Quick with helpful tips and shortcuts
- Encourages users to explore features

Always keep responses brief and action-oriented. You're the helper that makes everything feel achievable!`
            },
            zeus: {
                name: 'Zeus',
                systemPrompt: `You are Zeus, the Lord of Thunder at Lightning Ledgerz. You're a wise, authoritative financial advisor who provides strategic guidance with gravitas and wisdom.

Your personality:
- Speaks with authority and wisdom
- Uses powerful metaphors (storms, lightning, etc.)
- Provides strategic, big-picture thinking
- Takes a measured, thoughtful approach
- Inspires confidence in users' financial decisions

Focus on strategic insights and high-level guidance. You're the advisor for important decisions.`
            },
            alaina: {
                name: 'Alaina',
                systemPrompt: `You are Alaina, Lady Lightning at Lightning Ledgerz. You're a sharp, stylish financial expert who combines sophistication with genuine warmth.

Your personality:
- Elegant and professional
- Pays attention to details and presentation
- Helps users make their reports look polished
- Offers design and formatting suggestions
- Encouraging and supportive

Focus on helping users create beautiful, professional financial presentations.`
            }
        };

        // Context about Lightning Ledgerz features
        this.appContext = `
Lightning Ledgerz is a financial management platform with these features:
- Report Builder: Drag-and-drop interface for creating financial reports with charts, KPIs, tables
- PowerPoint Generator: Create professional presentations (Gold/Diamond tiers)
- QuickBooks Integration: Connect accounting data (Diamond tier)
- Document Upload: PDF, Excel, CSV file analysis
- Financial Dashboard: Real-time charts and metrics
- Templates: Fortune 500, Bain, Deloitte, BCG, PwC style templates

Tier structure:
- Basic ($29/mo): Dashboard, file uploads, basic analytics
- Gold ($149/mo): + PowerPoint builder, premium templates, advanced analytics
- Diamond ($499/mo): + QuickBooks, AI recommendations, custom reports

Navigation commands you can suggest:
- "Open Report Builder" - openReportBuilder()
- "Upload Files" - showUploadModal()
- "Show Dashboard" - handleDashboardClick()
- "View Profile" - handleMyProfileClick()
- "Open PowerPoint Builder" - openPowerPointBuilder()
- "Connect QuickBooks" - openQuickBooksDashboard()
`;

        this.init();
    }

    init() {
        console.log('Claude Avatar AI initialized');
    }

    // Set the current avatar personality
    setAvatar(avatarName) {
        if (this.avatarPersonalities[avatarName]) {
            this.currentAvatar = avatarName;
            this.conversationHistory = []; // Reset conversation for new avatar
            console.log(`Avatar set to ${avatarName}`);
        }
    }

    // Generate AI response
    async chat(userMessage, context = {}) {
        if (this.isProcessing) {
            return { error: 'Already processing a request' };
        }

        this.isProcessing = true;
        const avatar = this.avatarPersonalities[this.currentAvatar];

        // Build conversation
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Build context message
        let contextMessage = this.appContext;
        if (context.currentPage) {
            contextMessage += `\nUser is currently on: ${context.currentPage}`;
        }
        if (context.userData) {
            contextMessage += `\nUser data: ${JSON.stringify(context.userData)}`;
        }
        if (context.financialData) {
            contextMessage += `\nFinancial context: ${JSON.stringify(context.financialData)}`;
        }

        try {
            // For demo purposes, use a smart local response system
            // In production, this would call the Claude API through a backend
            const response = await this.generateLocalResponse(userMessage, avatar, context);

            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

            this.isProcessing = false;
            return {
                success: true,
                message: response,
                avatar: avatar.name,
                actions: this.extractActions(response)
            };
        } catch (error) {
            this.isProcessing = false;
            console.error('AI chat error:', error);
            return {
                error: 'Failed to generate response',
                fallback: this.getFallbackResponse(userMessage)
            };
        }
    }

    // Smart local response generator (simulates AI without API call)
    async generateLocalResponse(message, avatar, context) {
        const lowerMessage = message.toLowerCase();
        const name = avatar.name;

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        // Intent detection and response generation
        if (lowerMessage.includes('report') && (lowerMessage.includes('create') || lowerMessage.includes('build') || lowerMessage.includes('make'))) {
            return this.formatResponse(name, `I'd love to help you create a report! Let me open the Report Builder for you. You can drag charts, KPIs, and tables onto the canvas. I recommend starting with an Executive Summary template - it's got a great layout for presenting key metrics. Would you like me to open it now?`, 'openReportBuilder');
        }

        if (lowerMessage.includes('upload') || lowerMessage.includes('import') || lowerMessage.includes('file')) {
            return this.formatResponse(name, `Let's get your financial documents into the system! I'll open the upload panel for you. We support PDFs, Excel files (.xlsx, .xls), and CSVs. Just drag and drop your files or click to browse. Once uploaded, I can help you analyze the data and create visualizations.`, 'showUploadModal');
        }

        if (lowerMessage.includes('powerpoint') || lowerMessage.includes('presentation') || lowerMessage.includes('ppt') || lowerMessage.includes('deck')) {
            if (context.userTier && !['gold', 'diamond'].includes(context.userTier)) {
                return this.formatResponse(name, `The Presentation Builder is a Gold and Diamond feature that lets you create boardroom-quality decks in minutes. Upgrade your plan to unlock professional templates, custom branding, and one-click export. Would you like to see our packages?`, 'scrollToPackage');
            }
            return this.formatResponse(name, `Let's create a stunning presentation! I'll take you to the Presentation Builder where you can choose from Fortune 500, Bain, or Deloitte-style templates. You can add your financial data, customize colors, and export to PPTX. Ready to impress your stakeholders?`, 'openPowerPointBuilder');
        }

        if (lowerMessage.includes('quickbooks') || lowerMessage.includes('accounting') || lowerMessage.includes('connect')) {
            if (context.userTier !== 'diamond') {
                return this.formatResponse(name, `QuickBooks integration is our Diamond feature - it syncs your accounting data in real-time for seamless reporting. With Diamond, you get live P&L updates, automatic cash flow tracking, and AI-powered insights. Want to learn more about upgrading?`, 'scrollToPackage');
            }
            return this.formatResponse(name, `Let's connect your QuickBooks account! This will sync your P&L, balance sheet, and cash flow data automatically. I'll guide you through the secure OAuth connection process.`, 'openQuickBooksDashboard');
        }

        if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('visualiz')) {
            return this.formatResponse(name, `Great question about charts! In the Report Builder, you have several options:

• **Bar Chart** - Perfect for comparing categories (revenue by product, expenses by department)
• **Line Chart** - Ideal for trends over time (monthly revenue, growth rates)
• **Pie Chart** - Best for showing composition (market share, cost breakdown)
• **Waterfall Chart** - Shows how values add up (P&L bridge, budget variance)

Want me to open the Report Builder so you can try them out?`, 'openReportBuilder');
        }

        if (lowerMessage.includes('kpi') || lowerMessage.includes('metric') || lowerMessage.includes('key performance')) {
            return this.formatResponse(name, `KPIs (Key Performance Indicators) are the vital signs of your business! Common financial KPIs include:

• **Revenue Growth** - Are you growing?
• **Gross Margin** - How profitable is your core business?
• **Net Profit Margin** - What's your bottom line?
• **Cash Burn Rate** - How long can you operate?
• **Customer Acquisition Cost** - How much to win a customer?

In the Report Builder, you can add KPI cards with automatic calculations and trend indicators. Shall I show you?`, 'openReportBuilder');
        }

        if (lowerMessage.includes('template')) {
            return this.formatResponse(name, `We have professional templates inspired by top consulting firms:

• **Fortune 500 Style** - Clean, data-focused, blue tones
• **Bain Style** - Bold, red accents, impactful
• **Deloitte Style** - Modern, green emphasis, fresh
• **BCG Style** - Classic, green, analytical
• **Lightning Style** - Dark, dramatic, energetic

Each includes title slides, KPI dashboards, chart layouts, and thank you slides. Would you like to browse them in the Report Builder?`, 'openReportBuilder');
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
            return this.formatResponse(name, `I'm here to help you master your financial data! Here's what I can do:

📊 **Create Reports** - Guide you through building stunning financial reports
📈 **Explain Metrics** - Break down any KPI or financial concept
📤 **Upload & Analyze** - Help you import and understand your data
🎨 **Design Advice** - Suggest layouts and visualizations
💡 **Best Practices** - Share tips for effective financial presentations

Just ask me anything - from "How do I create a P&L chart?" to "What's a good gross margin?" I'm your financial co-pilot!`);
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            const greetings = {
                zac: `Hey there! Zac here, ready to help you crush your financial goals. What are we working on today?`,
                bolt: `Zap! Hey! So excited you're here! What financial magic can we create together today?`,
                zeus: `Greetings, seeker of financial wisdom. How may I illuminate your path to prosperity today?`,
                alaina: `Hello! Lovely to see you. I'm here to help make your financial reports absolutely shine. What's on your mind?`
            };
            return greetings[this.currentAvatar] || greetings.zac;
        }

        if (lowerMessage.includes('budget') || lowerMessage.includes('forecast') || lowerMessage.includes('plan')) {
            return this.formatResponse(name, `Budget analysis is crucial for financial health! I can help you:

• **Budget vs Actual** - Compare planned vs real spending
• **Variance Analysis** - Identify where you're over/under
• **Rolling Forecasts** - Project future performance
• **Scenario Planning** - Model best/worst cases

Upload your budget data and I'll help you create a professional variance analysis report. Want to get started?`, 'showUploadModal');
        }

        // Default intelligent response
        return this.formatResponse(name, `That's an interesting question! While I'd need more context to give you a perfect answer, I can definitely help you explore your financial data. Would you like me to:

1. Open the **Report Builder** to create visualizations
2. Help you **upload financial documents** for analysis
3. Explain a specific **financial concept** or metric

What sounds most helpful right now?`);
    }

    formatResponse(name, message, action = null) {
        if (action) {
            return `${message}\n\n[ACTION:${action}]`;
        }
        return message;
    }

    extractActions(response) {
        const actions = [];
        const actionRegex = /\[ACTION:(\w+)\]/g;
        let match;
        while ((match = actionRegex.exec(response)) !== null) {
            actions.push(match[1]);
        }
        return actions;
    }

    getFallbackResponse(message) {
        return `I understand you're asking about "${message}". Let me help you with that! In Lightning Ledgerz, you can create reports, upload financial documents, build presentations, and track KPIs. What would you like to explore?`;
    }

    // Execute suggested action
    executeAction(action) {
        switch (action) {
            case 'openReportBuilder':
                if (typeof openReportBuilder === 'function') openReportBuilder();
                break;
            case 'showUploadModal':
                if (typeof showUploadModal === 'function') showUploadModal();
                break;
            case 'openPowerPointBuilder':
                if (typeof openPowerPointBuilder === 'function') openPowerPointBuilder();
                break;
            case 'openQuickBooksDashboard':
                if (typeof openQuickBooksDashboard === 'function') openQuickBooksDashboard();
                break;
            case 'handleDashboardClick':
                if (typeof handleDashboardClick === 'function') handleDashboardClick();
                break;
            case 'handleMyProfileClick':
                if (typeof handleMyProfileClick === 'function') handleMyProfileClick();
                break;
            case 'scrollToPackage':
                if (typeof scrollToPackage === 'function') scrollToPackage('gold-package');
                break;
        }
    }

    // Clean message by removing action tags
    cleanMessage(message) {
        return message.replace(/\[ACTION:\w+\]/g, '').trim();
    }

    // Get conversation summary
    getConversationSummary() {
        return this.conversationHistory.map(msg => ({
            role: msg.role,
            preview: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '')
        }));
    }

    // Clear conversation
    clearConversation() {
        this.conversationHistory = [];
    }
}

// Singleton instance
const claudeAvatarAI = new ClaudeAvatarAI();

// Global access
window.claudeAvatarAI = claudeAvatarAI;

// Helper function for avatar chat integration
window.askAvatarAI = async function(message, context = {}) {
    const currentAvatar = window.avatarSelector?.getCurrentAvatar() || 'zac';
    claudeAvatarAI.setAvatar(currentAvatar);

    // Add user context
    context.userTier = window.currentUserProfile?.package_tier || 'basic';
    context.currentPage = window.location.hash || 'home';

    const result = await claudeAvatarAI.chat(message, context);

    if (result.success) {
        // Execute any suggested actions after a delay
        if (result.actions && result.actions.length > 0) {
            setTimeout(() => {
                result.actions.forEach(action => {
                    claudeAvatarAI.executeAction(action);
                });
            }, 2000);
        }
        return claudeAvatarAI.cleanMessage(result.message);
    }

    return result.fallback || result.error;
};

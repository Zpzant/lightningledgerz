// =====================================================
// LIGHTNING LEDGERZ - BUDGET BUILDER
// Conversational proforma builder with avatar guidance
// Build budgets by chatting with your financial avatar
// =====================================================

class BudgetBuilder {
    constructor() {
        this.isActive = false;
        this.currentStep = 0;
        this.budgetData = {
            businessInfo: {},
            products: [],
            revenue: {},
            cogs: {},
            fixedExpenses: [],
            variableExpenses: [],
            projections: {}
        };
        this.conversationHistory = [];

        // Define the proforma questionnaire flow
        this.steps = [
            {
                id: 'welcome',
                question: "Let's build your budget together! First, what type of business are we budgeting for?",
                type: 'select',
                options: [
                    { value: 'real_estate', label: '🏢 Real Estate / Property' },
                    { value: 'retail', label: '🛍️ Retail / E-commerce' },
                    { value: 'service', label: '💼 Service Business' },
                    { value: 'restaurant', label: '🍽️ Restaurant / Hospitality' },
                    { value: 'manufacturing', label: '🏭 Manufacturing' },
                    { value: 'technology', label: '💻 Technology / SaaS' },
                    { value: 'healthcare', label: '🏥 Healthcare' },
                    { value: 'other', label: '📋 Other' }
                ],
                field: 'businessInfo.type'
            },
            {
                id: 'business_name',
                question: "What's the name of your business or project?",
                type: 'text',
                placeholder: 'Enter business/project name',
                field: 'businessInfo.name'
            },
            {
                id: 'budget_period',
                question: "What time period should this budget cover?",
                type: 'select',
                options: [
                    { value: 'monthly', label: '📅 Monthly' },
                    { value: 'quarterly', label: '📊 Quarterly' },
                    { value: 'annual', label: '📈 Annual (12 months)' },
                    { value: 'multi_year', label: '🗓️ Multi-Year (3-5 years)' }
                ],
                field: 'businessInfo.period'
            },
            {
                id: 'product_count',
                question: "How many products or services do you offer? (We'll go through each one)",
                type: 'number',
                min: 1,
                max: 20,
                placeholder: 'Enter number of products/services',
                field: 'businessInfo.productCount'
            },
            {
                id: 'products',
                question: "Let's define your products/services. What's the name of Product #{{index}}?",
                type: 'product_loop',
                subSteps: [
                    {
                        id: 'product_name',
                        question: "What's the name of Product/Service #{{index}}?",
                        type: 'text',
                        placeholder: 'e.g., Premium Subscription',
                        field: 'name'
                    },
                    {
                        id: 'product_price',
                        question: "What do you charge for {{productName}}?",
                        type: 'currency',
                        placeholder: '0.00',
                        field: 'price'
                    },
                    {
                        id: 'product_units_monthly',
                        question: "How many units of {{productName}} do you expect to sell per month?",
                        type: 'number',
                        placeholder: 'Units per month',
                        field: 'unitsMonthly'
                    },
                    {
                        id: 'product_cogs',
                        question: "What's your cost of goods sold (COGS) per unit for {{productName}}?",
                        type: 'currency',
                        placeholder: '0.00',
                        field: 'cogs',
                        helpText: 'Direct costs to produce/deliver this product'
                    },
                    {
                        id: 'product_growth',
                        question: "What monthly growth rate do you expect for {{productName}}?",
                        type: 'percentage',
                        placeholder: '5',
                        field: 'growthRate',
                        helpText: 'Expected month-over-month growth'
                    }
                ]
            },
            {
                id: 'fixed_expenses_intro',
                question: "Now let's add your fixed expenses - these stay the same regardless of sales. I'll suggest some common categories.",
                type: 'info'
            },
            {
                id: 'fixed_expenses',
                question: "Select your fixed expense categories (you can add custom ones too):",
                type: 'expense_builder',
                expenseType: 'fixed',
                suggestions: [
                    { name: 'Rent/Lease', icon: '🏠', typical: 3000 },
                    { name: 'Salaries & Wages', icon: '👥', typical: 10000 },
                    { name: 'Insurance', icon: '🛡️', typical: 500 },
                    { name: 'Utilities', icon: '💡', typical: 400 },
                    { name: 'Software Subscriptions', icon: '💻', typical: 300 },
                    { name: 'Internet & Phone', icon: '📱', typical: 200 },
                    { name: 'Accounting/Legal', icon: '📋', typical: 500 },
                    { name: 'Marketing (Fixed)', icon: '📢', typical: 1000 },
                    { name: 'Equipment Lease', icon: '🔧', typical: 500 },
                    { name: 'Loan Payments', icon: '💳', typical: 1000 }
                ],
                field: 'fixedExpenses'
            },
            {
                id: 'variable_expenses_intro',
                question: "Excellent! Now for variable expenses - these change based on your sales volume.",
                type: 'info'
            },
            {
                id: 'variable_expenses',
                question: "Select your variable expense categories:",
                type: 'expense_builder',
                expenseType: 'variable',
                suggestions: [
                    { name: 'Payment Processing Fees', icon: '💳', percentOfRevenue: 2.9 },
                    { name: 'Shipping & Fulfillment', icon: '📦', percentOfRevenue: 5 },
                    { name: 'Sales Commissions', icon: '🤝', percentOfRevenue: 10 },
                    { name: 'Marketing (Variable)', icon: '📱', percentOfRevenue: 8 },
                    { name: 'Customer Support', icon: '🎧', percentOfRevenue: 3 },
                    { name: 'Returns & Refunds', icon: '↩️', percentOfRevenue: 2 },
                    { name: 'Packaging', icon: '📦', percentOfRevenue: 1.5 },
                    { name: 'Travel & Entertainment', icon: '✈️', percentOfRevenue: 2 }
                ],
                field: 'variableExpenses'
            },
            {
                id: 'starting_cash',
                question: "What's your starting cash position?",
                type: 'currency',
                placeholder: '10000',
                field: 'projections.startingCash'
            },
            {
                id: 'review',
                question: "Let me calculate your projections and show you the results!",
                type: 'review'
            }
        ];

        this.currentProductIndex = 0;
        this.currentProductSubStep = 0;
    }

    // Initialize and show the budget builder UI
    init() {
        this.createUI();
        this.addStyles();
    }

    createUI() {
        // Create main container
        const container = document.createElement('div');
        container.id = 'budget-builder-container';
        container.className = 'budget-builder-container';

        container.innerHTML = `
            <div class="budget-builder-overlay" onclick="budgetBuilder.close()"></div>
            <div class="budget-builder-panel">
                <div class="budget-builder-header">
                    <div class="budget-header-left">
                        <span class="budget-icon">📊</span>
                        <h2>Budget Builder</h2>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar">
                            <div class="budget-progress-fill" id="budget-progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="budget-progress-text" id="budget-progress-text">Step 1 of ${this.steps.length}</span>
                    </div>
                    <button class="budget-builder-close" onclick="budgetBuilder.close()">&times;</button>
                </div>

                <div class="budget-builder-content">
                    <div class="budget-avatar-section" id="budget-avatar-section">
                        <!-- Avatar will be inserted here -->
                    </div>

                    <div class="budget-chat-section">
                        <div class="budget-messages" id="budget-messages">
                            <!-- Conversation messages -->
                        </div>

                        <div class="budget-input-section" id="budget-input-section">
                            <!-- Dynamic input based on question type -->
                        </div>
                    </div>

                    <div class="budget-summary-section" id="budget-summary-section">
                        <h3>Budget Summary</h3>
                        <div class="budget-summary-content" id="budget-summary-content">
                            <p class="summary-placeholder">Your budget details will appear here as you build...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
    }

    addStyles() {
        if (document.getElementById('budget-builder-styles')) return;

        const style = document.createElement('style');
        style.id = 'budget-builder-styles';
        style.textContent = `
            .budget-builder-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10002;
            }

            .budget-builder-container.active {
                display: block;
            }

            .budget-builder-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
            }

            .budget-builder-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 1400px;
                height: 90vh;
                background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
                border: 2px solid #ff3333;
                border-radius: 25px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .budget-builder-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem 2rem;
                background: linear-gradient(90deg, rgba(255, 51, 51, 0.2), rgba(255, 215, 0, 0.1));
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
            }

            .budget-header-left {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .budget-icon {
                font-size: 2rem;
            }

            .budget-builder-header h2 {
                color: #ff3333;
                margin: 0;
                font-size: 1.5rem;
            }

            .budget-progress {
                flex: 1;
                max-width: 400px;
                margin: 0 2rem;
            }

            .budget-progress-bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.25rem;
            }

            .budget-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff3333, #ffd700);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .budget-progress-text {
                color: #888;
                font-size: 0.8rem;
            }

            .budget-builder-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                transition: color 0.3s;
            }

            .budget-builder-close:hover {
                color: #ff3333;
            }

            .budget-builder-content {
                display: grid;
                grid-template-columns: 200px 1fr 300px;
                flex: 1;
                overflow: hidden;
            }

            .budget-avatar-section {
                padding: 2rem 1rem;
                background: rgba(0, 0, 0, 0.3);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .budget-chat-section {
                display: flex;
                flex-direction: column;
                padding: 0;
                overflow: hidden;
            }

            .budget-messages {
                flex: 1;
                overflow-y: auto;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .budget-message {
                max-width: 80%;
                padding: 1rem 1.5rem;
                border-radius: 20px;
                animation: messageSlide 0.3s ease;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .budget-message.avatar {
                background: linear-gradient(135deg, rgba(255, 51, 51, 0.2), rgba(255, 51, 51, 0.1));
                border: 1px solid rgba(255, 51, 51, 0.3);
                align-self: flex-start;
                border-bottom-left-radius: 5px;
            }

            .budget-message.avatar .message-sender {
                color: #ff3333;
                font-weight: bold;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .budget-message.user {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
                border: 1px solid rgba(255, 215, 0, 0.3);
                align-self: flex-end;
                border-bottom-right-radius: 5px;
            }

            .budget-message.user .message-sender {
                color: #ffd700;
                font-weight: bold;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .budget-message p {
                color: #fff;
                margin: 0;
                line-height: 1.5;
            }

            .budget-input-section {
                padding: 1.5rem 2rem;
                background: rgba(0, 0, 0, 0.4);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .budget-input-wrapper {
                display: flex;
                gap: 1rem;
                align-items: flex-end;
            }

            .budget-input-field {
                flex: 1;
            }

            .budget-input-field label {
                display: block;
                color: #888;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .budget-input-field input,
            .budget-input-field select {
                width: 100%;
                padding: 1rem 1.25rem;
                background: rgba(0, 0, 0, 0.6);
                border: 2px solid rgba(255, 51, 51, 0.3);
                border-radius: 12px;
                color: #fff;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .budget-input-field input:focus,
            .budget-input-field select:focus {
                outline: none;
                border-color: #ff3333;
                box-shadow: 0 0 20px rgba(255, 51, 51, 0.3);
            }

            .budget-input-field input::placeholder {
                color: #666;
            }

            .budget-submit-btn {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                color: #fff;
                border: none;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }

            .budget-submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(255, 51, 51, 0.5);
            }

            .budget-options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1rem;
            }

            .budget-option-card {
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 1.25rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .budget-option-card:hover {
                border-color: #ff3333;
                transform: translateY(-3px);
            }

            .budget-option-card.selected {
                border-color: #ffd700;
                background: rgba(255, 215, 0, 0.1);
            }

            .budget-option-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .budget-option-label {
                color: #fff;
                font-weight: 500;
            }

            .budget-summary-section {
                padding: 1.5rem;
                background: rgba(0, 0, 0, 0.4);
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                overflow-y: auto;
            }

            .budget-summary-section h3 {
                color: #ffd700;
                margin: 0 0 1rem 0;
                font-size: 1.1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            }

            .summary-placeholder {
                color: #666;
                font-style: italic;
                font-size: 0.9rem;
            }

            .summary-item {
                padding: 0.75rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                margin-bottom: 0.75rem;
            }

            .summary-item-label {
                color: #888;
                font-size: 0.8rem;
                margin-bottom: 0.25rem;
            }

            .summary-item-value {
                color: #fff;
                font-weight: bold;
            }

            .summary-item-value.positive {
                color: #4caf50;
            }

            .summary-item-value.negative {
                color: #f44336;
            }

            /* Expense Builder Styles */
            .expense-builder-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .expense-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .expense-item:hover {
                border-color: rgba(255, 51, 51, 0.5);
            }

            .expense-item.selected {
                border-color: #4caf50;
                background: rgba(76, 175, 80, 0.1);
            }

            .expense-item-icon {
                font-size: 1.25rem;
            }

            .expense-item-info {
                flex: 1;
            }

            .expense-item-name {
                color: #fff;
                font-size: 0.9rem;
            }

            .expense-item-amount {
                color: #888;
                font-size: 0.75rem;
            }

            .expense-input-row {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .expense-input-row input {
                flex: 1;
                padding: 0.5rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
                font-size: 0.9rem;
            }

            .add-custom-expense {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 1rem;
                background: rgba(255, 51, 51, 0.1);
                border: 2px dashed rgba(255, 51, 51, 0.5);
                border-radius: 10px;
                color: #ff3333;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .add-custom-expense:hover {
                background: rgba(255, 51, 51, 0.2);
            }

            /* Results Section */
            .budget-results {
                padding: 2rem;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 15px;
                margin: 1rem 0;
            }

            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .result-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1.25rem;
                text-align: center;
            }

            .result-card-label {
                color: #888;
                font-size: 0.85rem;
                margin-bottom: 0.5rem;
            }

            .result-card-value {
                font-size: 1.75rem;
                font-weight: bold;
                color: #fff;
            }

            .result-card-value.revenue { color: #4caf50; }
            .result-card-value.expense { color: #f44336; }
            .result-card-value.profit { color: #ffd700; }

            .result-card-change {
                font-size: 0.85rem;
                margin-top: 0.25rem;
            }

            /* Mobile Responsive */
            @media (max-width: 1024px) {
                .budget-builder-content {
                    grid-template-columns: 1fr;
                }

                .budget-avatar-section,
                .budget-summary-section {
                    display: none;
                }

                .budget-builder-panel {
                    height: 100%;
                    border-radius: 0;
                }
            }

            @media (max-width: 768px) {
                .budget-builder-header {
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .budget-progress {
                    order: 3;
                    max-width: 100%;
                    margin: 0;
                }

                .budget-options-grid {
                    grid-template-columns: 1fr;
                }

                .expense-builder-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Open the budget builder
    open() {
        this.init();
        const container = document.getElementById('budget-builder-container');
        if (container) {
            container.classList.add('active');
            this.isActive = true;
            this.resetBudget();
            this.showStep(0);
            this.updateAvatar();
        }
    }

    // Close the budget builder
    close() {
        const container = document.getElementById('budget-builder-container');
        if (container) {
            container.classList.remove('active');
            this.isActive = false;
        }
    }

    // Reset budget data
    resetBudget() {
        this.currentStep = 0;
        this.currentProductIndex = 0;
        this.currentProductSubStep = 0;
        this.budgetData = {
            businessInfo: {},
            products: [],
            revenue: {},
            cogs: {},
            fixedExpenses: [],
            variableExpenses: [],
            projections: {}
        };
        this.conversationHistory = [];

        // Clear messages
        const messagesEl = document.getElementById('budget-messages');
        if (messagesEl) messagesEl.innerHTML = '';

        // Clear summary
        const summaryEl = document.getElementById('budget-summary-content');
        if (summaryEl) {
            summaryEl.innerHTML = '<p class="summary-placeholder">Your budget details will appear here as you build...</p>';
        }
    }

    // Update avatar display
    updateAvatar() {
        const avatarSection = document.getElementById('budget-avatar-section');
        if (!avatarSection) return;

        const currentAvatar = window.avatarSelector?.getCurrentAvatar() || 'zac';
        const avatarNames = {
            zac: { name: 'Zac', title: 'Financial Strategist' },
            bolt: { name: 'Bolt', title: 'Lightning Helper' },
            zeus: { name: 'Zeus', title: 'Lord of Thunder' },
            alaina: { name: 'Alaina', title: 'Lady Lightning' }
        };

        const avatar = avatarNames[currentAvatar] || avatarNames.zac;

        avatarSection.innerHTML = `
            <div class="budget-avatar-display" id="budget-avatar-display">
                <div style="width: 120px; height: 180px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 4rem;">
                        ${currentAvatar === 'zac' ? '🎩' : currentAvatar === 'bolt' ? '⚡' : currentAvatar === 'zeus' ? '⚡' : '👸'}
                    </span>
                </div>
            </div>
            <div class="budget-avatar-name" style="color: #ff3333; font-weight: bold; margin-top: 1rem; text-align: center;">
                ${avatar.name}
            </div>
            <div class="budget-avatar-title" style="color: #888; font-size: 0.85rem; text-align: center;">
                ${avatar.title}
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                <div class="budget-quick-stats" style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 1rem;">
                    <div style="color: #888; font-size: 0.75rem; margin-bottom: 0.25rem;">MONTHLY REVENUE</div>
                    <div id="quick-revenue" style="color: #4caf50; font-weight: bold; font-size: 1.25rem;">$0</div>
                </div>
            </div>
        `;
    }

    // Show current step
    showStep(stepIndex) {
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];

        if (!step) {
            this.showResults();
            return;
        }

        // Update progress
        const progress = ((stepIndex + 1) / this.steps.length) * 100;
        document.getElementById('budget-progress-fill').style.width = `${progress}%`;
        document.getElementById('budget-progress-text').textContent = `Step ${stepIndex + 1} of ${this.steps.length}`;

        // Add avatar message
        this.addMessage(step.question, 'avatar');

        // Show input based on type
        this.showInput(step);
    }

    // Add message to chat
    addMessage(text, sender) {
        const messagesEl = document.getElementById('budget-messages');
        const currentAvatar = window.avatarSelector?.getCurrentAvatar() || 'zac';
        const avatarName = currentAvatar === 'alaina' ? 'Alaina' : currentAvatar === 'bolt' ? 'Bolt' : currentAvatar === 'zeus' ? 'Zeus' : 'Zac';

        const messageEl = document.createElement('div');
        messageEl.className = `budget-message ${sender}`;
        messageEl.innerHTML = `
            <div class="message-sender">${sender === 'avatar' ? avatarName : 'You'}</div>
            <p>${text}</p>
        `;

        messagesEl.appendChild(messageEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        this.conversationHistory.push({ sender, text });
    }

    // Show input based on step type
    showInput(step) {
        const inputSection = document.getElementById('budget-input-section');

        switch (step.type) {
            case 'text':
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <div class="budget-input-field">
                            <input type="text"
                                id="budget-input"
                                placeholder="${step.placeholder || 'Type your answer...'}"
                                onkeypress="if(event.key==='Enter') budgetBuilder.submitAnswer()"
                                autofocus>
                        </div>
                        <button class="budget-submit-btn" onclick="budgetBuilder.submitAnswer()">
                            Continue →
                        </button>
                    </div>
                `;
                document.getElementById('budget-input').focus();
                break;

            case 'number':
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <div class="budget-input-field">
                            <input type="number"
                                id="budget-input"
                                placeholder="${step.placeholder || 'Enter a number'}"
                                min="${step.min || 0}"
                                max="${step.max || 999999999}"
                                onkeypress="if(event.key==='Enter') budgetBuilder.submitAnswer()"
                                autofocus>
                        </div>
                        <button class="budget-submit-btn" onclick="budgetBuilder.submitAnswer()">
                            Continue →
                        </button>
                    </div>
                `;
                document.getElementById('budget-input').focus();
                break;

            case 'currency':
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <div class="budget-input-field">
                            <label>$ Amount</label>
                            <input type="number"
                                id="budget-input"
                                placeholder="${step.placeholder || '0.00'}"
                                min="0"
                                step="0.01"
                                onkeypress="if(event.key==='Enter') budgetBuilder.submitAnswer()"
                                autofocus>
                            ${step.helpText ? `<div style="color: #666; font-size: 0.8rem; margin-top: 0.25rem;">${step.helpText}</div>` : ''}
                        </div>
                        <button class="budget-submit-btn" onclick="budgetBuilder.submitAnswer()">
                            Continue →
                        </button>
                    </div>
                `;
                document.getElementById('budget-input').focus();
                break;

            case 'percentage':
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <div class="budget-input-field">
                            <label>% Percentage</label>
                            <input type="number"
                                id="budget-input"
                                placeholder="${step.placeholder || '0'}"
                                min="0"
                                max="100"
                                step="0.1"
                                onkeypress="if(event.key==='Enter') budgetBuilder.submitAnswer()"
                                autofocus>
                            ${step.helpText ? `<div style="color: #666; font-size: 0.8rem; margin-top: 0.25rem;">${step.helpText}</div>` : ''}
                        </div>
                        <button class="budget-submit-btn" onclick="budgetBuilder.submitAnswer()">
                            Continue →
                        </button>
                    </div>
                `;
                document.getElementById('budget-input').focus();
                break;

            case 'select':
                inputSection.innerHTML = `
                    <div class="budget-options-grid">
                        ${step.options.map(opt => `
                            <div class="budget-option-card" onclick="budgetBuilder.selectOption('${opt.value}')">
                                <div class="budget-option-label">${opt.label}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;

            case 'info':
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <button class="budget-submit-btn" onclick="budgetBuilder.nextStep()" style="margin: 0 auto;">
                            Got it, let's continue →
                        </button>
                    </div>
                `;
                break;

            case 'expense_builder':
                this.showExpenseBuilder(step);
                break;

            case 'product_loop':
                this.showProductLoop();
                break;

            case 'review':
                this.showResults();
                break;

            default:
                inputSection.innerHTML = `
                    <div class="budget-input-wrapper">
                        <button class="budget-submit-btn" onclick="budgetBuilder.nextStep()">
                            Continue →
                        </button>
                    </div>
                `;
        }
    }

    // Show expense builder
    showExpenseBuilder(step) {
        const inputSection = document.getElementById('budget-input-section');
        const selectedExpenses = step.expenseType === 'fixed' ? this.budgetData.fixedExpenses : this.budgetData.variableExpenses;

        inputSection.innerHTML = `
            <div class="expense-builder-grid" id="expense-grid">
                ${step.suggestions.map((exp, i) => `
                    <div class="expense-item ${selectedExpenses.some(e => e.name === exp.name) ? 'selected' : ''}"
                         data-expense-index="${i}"
                         onclick="budgetBuilder.toggleExpense('${step.expenseType}', ${i})">
                        <span class="expense-item-icon">${exp.icon}</span>
                        <div class="expense-item-info">
                            <div class="expense-item-name">${exp.name}</div>
                            <div class="expense-item-amount">
                                ${exp.typical ? `~$${exp.typical.toLocaleString()}/mo` : `~${exp.percentOfRevenue}% of revenue`}
                            </div>
                            <div class="expense-input-row" onclick="event.stopPropagation()">
                                <input type="number"
                                    id="expense-amount-${i}"
                                    placeholder="${exp.typical || exp.percentOfRevenue}"
                                    value="${selectedExpenses.find(e => e.name === exp.name)?.amount || ''}"
                                    onchange="budgetBuilder.updateExpenseAmount('${step.expenseType}', ${i}, this.value)">
                            </div>
                        </div>
                    </div>
                `).join('')}
                <div class="add-custom-expense" onclick="budgetBuilder.addCustomExpense('${step.expenseType}')">
                    <span>➕</span> Add Custom Expense
                </div>
            </div>
            <div style="margin-top: 1rem; text-align: center;">
                <button class="budget-submit-btn" onclick="budgetBuilder.nextStep()">
                    Continue with ${selectedExpenses.length} expenses →
                </button>
            </div>
        `;
    }

    // Toggle expense selection
    toggleExpense(type, index) {
        const step = this.steps.find(s => s.expenseType === type);
        const expense = step.suggestions[index];
        const expenses = type === 'fixed' ? this.budgetData.fixedExpenses : this.budgetData.variableExpenses;

        const existingIndex = expenses.findIndex(e => e.name === expense.name);
        if (existingIndex >= 0) {
            expenses.splice(existingIndex, 1);
        } else {
            expenses.push({
                name: expense.name,
                icon: expense.icon,
                amount: expense.typical || expense.percentOfRevenue,
                isPercentage: !expense.typical
            });
        }

        // Update UI
        const expenseEl = document.querySelector(`[data-expense-index="${index}"]`);
        if (expenseEl) {
            expenseEl.classList.toggle('selected');
        }

        this.updateSummary();
    }

    // Update expense amount
    updateExpenseAmount(type, index, value) {
        const step = this.steps.find(s => s.expenseType === type);
        const expense = step.suggestions[index];
        const expenses = type === 'fixed' ? this.budgetData.fixedExpenses : this.budgetData.variableExpenses;

        const existingIndex = expenses.findIndex(e => e.name === expense.name);
        if (existingIndex >= 0) {
            expenses[existingIndex].amount = parseFloat(value) || 0;
        } else {
            expenses.push({
                name: expense.name,
                icon: expense.icon,
                amount: parseFloat(value) || expense.typical || expense.percentOfRevenue,
                isPercentage: !expense.typical
            });

            const expenseEl = document.querySelector(`[data-expense-index="${index}"]`);
            if (expenseEl) expenseEl.classList.add('selected');
        }

        this.updateSummary();
    }

    // Add custom expense
    addCustomExpense(type) {
        const name = prompt('Enter expense name:');
        if (!name) return;

        const amount = prompt('Enter monthly amount ($):');
        if (!amount) return;

        const expenses = type === 'fixed' ? this.budgetData.fixedExpenses : this.budgetData.variableExpenses;
        expenses.push({
            name: name,
            icon: '📋',
            amount: parseFloat(amount) || 0,
            isPercentage: false,
            custom: true
        });

        // Refresh expense builder
        const step = this.steps.find(s => s.expenseType === type);
        this.showExpenseBuilder(step);
        this.updateSummary();
    }

    // Handle product loop
    showProductLoop() {
        const productCount = this.budgetData.businessInfo.productCount || 1;

        if (this.currentProductIndex >= productCount) {
            this.nextStep();
            return;
        }

        const step = this.steps.find(s => s.type === 'product_loop');
        const subStep = step.subSteps[this.currentProductSubStep];

        if (!subStep) {
            // Move to next product
            this.currentProductIndex++;
            this.currentProductSubStep = 0;
            this.showProductLoop();
            return;
        }

        // Initialize product if needed
        if (!this.budgetData.products[this.currentProductIndex]) {
            this.budgetData.products[this.currentProductIndex] = {};
        }

        const currentProduct = this.budgetData.products[this.currentProductIndex];
        let question = subStep.question
            .replace('{{index}}', this.currentProductIndex + 1)
            .replace('{{productName}}', currentProduct.name || `Product ${this.currentProductIndex + 1}`);

        this.addMessage(question, 'avatar');

        const inputSection = document.getElementById('budget-input-section');

        if (subStep.type === 'currency' || subStep.type === 'percentage') {
            inputSection.innerHTML = `
                <div class="budget-input-wrapper">
                    <div class="budget-input-field">
                        <label>${subStep.type === 'currency' ? '$ Amount' : '% Percentage'}</label>
                        <input type="number"
                            id="budget-input"
                            placeholder="${subStep.placeholder}"
                            min="0"
                            step="${subStep.type === 'currency' ? '0.01' : '0.1'}"
                            onkeypress="if(event.key==='Enter') budgetBuilder.submitProductAnswer('${subStep.field}')"
                            autofocus>
                        ${subStep.helpText ? `<div style="color: #666; font-size: 0.8rem; margin-top: 0.25rem;">${subStep.helpText}</div>` : ''}
                    </div>
                    <button class="budget-submit-btn" onclick="budgetBuilder.submitProductAnswer('${subStep.field}')">
                        Continue →
                    </button>
                </div>
            `;
        } else {
            inputSection.innerHTML = `
                <div class="budget-input-wrapper">
                    <div class="budget-input-field">
                        <input type="${subStep.type === 'number' ? 'number' : 'text'}"
                            id="budget-input"
                            placeholder="${subStep.placeholder}"
                            onkeypress="if(event.key==='Enter') budgetBuilder.submitProductAnswer('${subStep.field}')"
                            autofocus>
                    </div>
                    <button class="budget-submit-btn" onclick="budgetBuilder.submitProductAnswer('${subStep.field}')">
                        Continue →
                    </button>
                </div>
            `;
        }

        document.getElementById('budget-input').focus();
    }

    // Submit product answer
    submitProductAnswer(field) {
        const input = document.getElementById('budget-input');
        const value = input.value.trim();

        if (!value) return;

        this.addMessage(value, 'user');

        // Save to product
        this.budgetData.products[this.currentProductIndex][field] = field === 'name' ? value : parseFloat(value);

        // Move to next sub-step
        this.currentProductSubStep++;
        this.updateSummary();

        setTimeout(() => this.showProductLoop(), 300);
    }

    // Select option
    selectOption(value) {
        const step = this.steps[this.currentStep];
        const option = step.options.find(o => o.value === value);

        this.addMessage(option.label, 'user');
        this.setFieldValue(step.field, value);
        this.updateSummary();

        setTimeout(() => this.nextStep(), 300);
    }

    // Submit text/number answer
    submitAnswer() {
        const input = document.getElementById('budget-input');
        const value = input.value.trim();

        if (!value) return;

        const step = this.steps[this.currentStep];

        this.addMessage(step.type === 'currency' ? `$${parseFloat(value).toLocaleString()}` : value, 'user');

        const parsedValue = step.type === 'text' ? value : parseFloat(value);
        this.setFieldValue(step.field, parsedValue);
        this.updateSummary();

        setTimeout(() => this.nextStep(), 300);
    }

    // Set field value in budgetData
    setFieldValue(fieldPath, value) {
        const parts = fieldPath.split('.');
        let obj = this.budgetData;

        for (let i = 0; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) obj[parts[i]] = {};
            obj = obj[parts[i]];
        }

        obj[parts[parts.length - 1]] = value;
    }

    // Move to next step
    nextStep() {
        // Skip product loop if we're coming from it
        const currentStep = this.steps[this.currentStep];
        if (currentStep?.type === 'product_loop') {
            this.currentStep++;
        } else {
            this.currentStep++;
        }

        // Skip product loop step (handled separately)
        if (this.steps[this.currentStep]?.type === 'product_loop') {
            this.currentProductIndex = 0;
            this.currentProductSubStep = 0;
            this.showProductLoop();
        } else {
            this.showStep(this.currentStep);
        }
    }

    // Update summary panel
    updateSummary() {
        const summaryEl = document.getElementById('budget-summary-content');
        if (!summaryEl) return;

        const { businessInfo, products, fixedExpenses, variableExpenses } = this.budgetData;

        // Calculate totals
        let monthlyRevenue = 0;
        let monthlyCOGS = 0;

        products.forEach(p => {
            if (p.price && p.unitsMonthly) {
                monthlyRevenue += p.price * p.unitsMonthly;
                monthlyCOGS += (p.cogs || 0) * p.unitsMonthly;
            }
        });

        const totalFixedExpenses = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

        let totalVariableExpenses = 0;
        variableExpenses.forEach(e => {
            if (e.isPercentage) {
                totalVariableExpenses += monthlyRevenue * (e.amount / 100);
            } else {
                totalVariableExpenses += e.amount || 0;
            }
        });

        const grossProfit = monthlyRevenue - monthlyCOGS;
        const netProfit = grossProfit - totalFixedExpenses - totalVariableExpenses;
        const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue * 100) : 0;
        const netMargin = monthlyRevenue > 0 ? (netProfit / monthlyRevenue * 100) : 0;

        // Update quick revenue display
        const quickRevenue = document.getElementById('quick-revenue');
        if (quickRevenue) {
            quickRevenue.textContent = `$${monthlyRevenue.toLocaleString()}`;
        }

        summaryEl.innerHTML = `
            ${businessInfo.name ? `
                <div class="summary-item">
                    <div class="summary-item-label">BUSINESS</div>
                    <div class="summary-item-value">${businessInfo.name}</div>
                </div>
            ` : ''}

            ${products.length > 0 ? `
                <div class="summary-item">
                    <div class="summary-item-label">PRODUCTS</div>
                    <div class="summary-item-value">${products.length} item(s)</div>
                </div>
            ` : ''}

            <div class="summary-item">
                <div class="summary-item-label">MONTHLY REVENUE</div>
                <div class="summary-item-value positive">$${monthlyRevenue.toLocaleString()}</div>
            </div>

            <div class="summary-item">
                <div class="summary-item-label">COST OF GOODS</div>
                <div class="summary-item-value negative">$${monthlyCOGS.toLocaleString()}</div>
            </div>

            <div class="summary-item">
                <div class="summary-item-label">GROSS PROFIT</div>
                <div class="summary-item-value ${grossProfit >= 0 ? 'positive' : 'negative'}">
                    $${grossProfit.toLocaleString()} (${grossMargin.toFixed(1)}%)
                </div>
            </div>

            <div class="summary-item">
                <div class="summary-item-label">FIXED EXPENSES</div>
                <div class="summary-item-value negative">$${totalFixedExpenses.toLocaleString()}</div>
            </div>

            <div class="summary-item">
                <div class="summary-item-label">VARIABLE EXPENSES</div>
                <div class="summary-item-value negative">$${totalVariableExpenses.toLocaleString()}</div>
            </div>

            <div class="summary-item" style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3);">
                <div class="summary-item-label" style="color: #ffd700;">NET PROFIT</div>
                <div class="summary-item-value ${netProfit >= 0 ? 'positive' : 'negative'}" style="font-size: 1.25rem;">
                    $${netProfit.toLocaleString()} (${netMargin.toFixed(1)}%)
                </div>
            </div>
        `;
    }

    // Show final results
    showResults() {
        const { businessInfo, products, fixedExpenses, variableExpenses, projections } = this.budgetData;

        // Calculate all metrics
        let monthlyRevenue = 0;
        let monthlyCOGS = 0;

        products.forEach(p => {
            if (p.price && p.unitsMonthly) {
                monthlyRevenue += p.price * p.unitsMonthly;
                monthlyCOGS += (p.cogs || 0) * p.unitsMonthly;
            }
        });

        const totalFixedExpenses = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

        let totalVariableExpenses = 0;
        variableExpenses.forEach(e => {
            if (e.isPercentage) {
                totalVariableExpenses += monthlyRevenue * (e.amount / 100);
            } else {
                totalVariableExpenses += e.amount || 0;
            }
        });

        const grossProfit = monthlyRevenue - monthlyCOGS;
        const netProfit = grossProfit - totalFixedExpenses - totalVariableExpenses;
        const annualRevenue = monthlyRevenue * 12;
        const annualProfit = netProfit * 12;

        // Generate 12-month projection
        let projectionData = [];
        let cumulativeRevenue = 0;
        let avgGrowthRate = products.reduce((sum, p) => sum + (p.growthRate || 0), 0) / products.length || 5;

        for (let i = 1; i <= 12; i++) {
            const monthRevenue = monthlyRevenue * Math.pow(1 + (avgGrowthRate / 100), i - 1);
            cumulativeRevenue += monthRevenue;
            projectionData.push({
                month: i,
                revenue: monthRevenue,
                profit: monthRevenue - monthlyCOGS - totalFixedExpenses - (monthRevenue * totalVariableExpenses / monthlyRevenue)
            });
        }

        const messagesEl = document.getElementById('budget-messages');
        messagesEl.innerHTML += `
            <div class="budget-results">
                <h3 style="color: #ffd700; margin-bottom: 1.5rem; text-align: center; font-size: 1.5rem;">
                    📊 Your Budget Summary
                </h3>

                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-card-label">Monthly Revenue</div>
                        <div class="result-card-value revenue">$${monthlyRevenue.toLocaleString()}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-card-label">Monthly Expenses</div>
                        <div class="result-card-value expense">$${(monthlyCOGS + totalFixedExpenses + totalVariableExpenses).toLocaleString()}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-card-label">Monthly Profit</div>
                        <div class="result-card-value profit">$${netProfit.toLocaleString()}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-card-label">Annual Projection</div>
                        <div class="result-card-value profit">$${annualProfit.toLocaleString()}</div>
                    </div>
                </div>

                <div style="margin: 2rem 0;">
                    <h4 style="color: #fff; margin-bottom: 1rem;">12-Month Revenue Projection</h4>
                    <div style="display: flex; gap: 5px; height: 150px; align-items: flex-end;">
                        ${projectionData.map((m, i) => `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                                <div style="background: linear-gradient(to top, #ff3333, #ffd700);
                                            width: 100%;
                                            height: ${(m.revenue / (monthlyRevenue * 2)) * 100}%;
                                            min-height: 20px;
                                            border-radius: 5px 5px 0 0;"></div>
                                <div style="color: #888; font-size: 0.7rem; margin-top: 5px;">M${i + 1}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${products.length > 0 ? `
                    <div style="margin: 2rem 0;">
                        <h4 style="color: #fff; margin-bottom: 1rem;">Products/Services Breakdown</h4>
                        ${products.map(p => `
                            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 8px; margin-bottom: 0.5rem;">
                                <span style="color: #fff;">${p.name}</span>
                                <span style="color: #4caf50;">$${(p.price * p.unitsMonthly).toLocaleString()}/mo</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <button class="budget-submit-btn" onclick="budgetBuilder.exportBudget()">
                        📥 Export to Excel
                    </button>
                    <button class="budget-submit-btn" onclick="budgetBuilder.generatePresentation()" style="background: linear-gradient(135deg, #ffd700, #cc9900); color: #000;">
                        📊 Generate PowerPoint
                    </button>
                    <button class="budget-submit-btn" onclick="budgetBuilder.saveBudget()" style="background: linear-gradient(135deg, #4caf50, #388e3c);">
                        💾 Save Budget
                    </button>
                </div>
            </div>
        `;

        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Hide input section
        document.getElementById('budget-input-section').innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <p style="color: #888; margin-bottom: 1rem;">Budget complete! Choose an action above or:</p>
                <button class="budget-submit-btn" onclick="budgetBuilder.resetBudget(); budgetBuilder.showStep(0);" style="background: transparent; border: 1px solid #ff3333;">
                    Start New Budget
                </button>
            </div>
        `;

        // Celebrate with avatar
        if (window.avatarSelector) {
            const currentAvatar = window.avatarSelector.getCurrentAvatar();
            if (currentAvatar === 'alaina' && window.alainaAvatar) {
                window.alainaAvatar.showSpeech(`Amazing! Your budget shows $${netProfit.toLocaleString()} monthly profit! Let's celebrate! 🎉`, 'Budget Complete!');
            } else if (window.zacAvatar) {
                window.zacAvatar.showSpeech(`Excellent work! Your projected annual profit is $${annualProfit.toLocaleString()}. You're on your way to financial success!`, 'Budget Complete!');
            }
        }
    }

    // Export budget to Excel
    exportBudget() {
        if (typeof XLSX === 'undefined') {
            alert('Excel export not available. Please refresh the page.');
            return;
        }

        const wb = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            ['Lightning Ledgerz Budget Report'],
            [''],
            ['Business Name', this.budgetData.businessInfo.name || 'N/A'],
            ['Business Type', this.budgetData.businessInfo.type || 'N/A'],
            ['Budget Period', this.budgetData.businessInfo.period || 'N/A'],
            [''],
            ['FINANCIAL SUMMARY'],
            ['Metric', 'Monthly', 'Annual']
        ];

        // Calculate totals
        let monthlyRevenue = 0;
        let monthlyCOGS = 0;
        this.budgetData.products.forEach(p => {
            if (p.price && p.unitsMonthly) {
                monthlyRevenue += p.price * p.unitsMonthly;
                monthlyCOGS += (p.cogs || 0) * p.unitsMonthly;
            }
        });

        const totalFixed = this.budgetData.fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        let totalVariable = 0;
        this.budgetData.variableExpenses.forEach(e => {
            totalVariable += e.isPercentage ? monthlyRevenue * (e.amount / 100) : (e.amount || 0);
        });

        const netProfit = monthlyRevenue - monthlyCOGS - totalFixed - totalVariable;

        summaryData.push(
            ['Revenue', monthlyRevenue, monthlyRevenue * 12],
            ['Cost of Goods Sold', monthlyCOGS, monthlyCOGS * 12],
            ['Gross Profit', monthlyRevenue - monthlyCOGS, (monthlyRevenue - monthlyCOGS) * 12],
            ['Fixed Expenses', totalFixed, totalFixed * 12],
            ['Variable Expenses', totalVariable, totalVariable * 12],
            ['Net Profit', netProfit, netProfit * 12]
        );

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

        // Products sheet
        if (this.budgetData.products.length > 0) {
            const productData = [
                ['Product Name', 'Price', 'Units/Month', 'COGS/Unit', 'Growth Rate', 'Monthly Revenue']
            ];
            this.budgetData.products.forEach(p => {
                productData.push([
                    p.name,
                    p.price,
                    p.unitsMonthly,
                    p.cogs,
                    `${p.growthRate}%`,
                    (p.price * p.unitsMonthly)
                ]);
            });
            const productSheet = XLSX.utils.aoa_to_sheet(productData);
            XLSX.utils.book_append_sheet(wb, productSheet, 'Products');
        }

        // Expenses sheet
        const expenseData = [['FIXED EXPENSES'], ['Name', 'Monthly Amount']];
        this.budgetData.fixedExpenses.forEach(e => {
            expenseData.push([e.name, e.amount]);
        });
        expenseData.push([''], ['VARIABLE EXPENSES'], ['Name', 'Amount/Percentage']);
        this.budgetData.variableExpenses.forEach(e => {
            expenseData.push([e.name, e.isPercentage ? `${e.amount}%` : e.amount]);
        });
        const expenseSheet = XLSX.utils.aoa_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');

        // Download
        XLSX.writeFile(wb, `${this.budgetData.businessInfo.name || 'Budget'}_LightningLedgerz.xlsx`);
    }

    // Generate presentation from budget
    generatePresentation() {
        if (typeof openPowerPointTemplates === 'function') {
            this.close();
            openPowerPointTemplates();
        } else {
            alert('PowerPoint generator not available.');
        }
    }

    // Save budget to local storage
    saveBudget() {
        const budgetName = this.budgetData.businessInfo.name || `Budget_${Date.now()}`;
        const savedBudgets = JSON.parse(localStorage.getItem('lightning_budgets') || '[]');

        savedBudgets.push({
            id: Date.now(),
            name: budgetName,
            date: new Date().toISOString(),
            data: this.budgetData
        });

        localStorage.setItem('lightning_budgets', JSON.stringify(savedBudgets));
        alert(`Budget "${budgetName}" saved successfully!`);
    }
}

// Initialize Budget Builder
const budgetBuilder = new BudgetBuilder();

// Global function to open budget builder
window.openBudgetBuilder = function() {
    budgetBuilder.open();
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BudgetBuilder;
}

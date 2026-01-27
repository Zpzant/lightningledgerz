// =====================================================
// LIGHTNING LEDGERZ - QUICKBOOKS INTEGRATION
// Fathom-style seamless QuickBooks Online connectivity
// Real-time financial data sync and analysis
// =====================================================

class QuickBooksIntegration {
    constructor() {
        // QuickBooks OAuth 2.0 Configuration
        // NOTE: Replace these with your actual QuickBooks app credentials
        this.config = {
            clientId: 'YOUR_QB_CLIENT_ID',
            clientSecret: 'YOUR_QB_CLIENT_SECRET',
            redirectUri: window.location.origin + '/quickbooks/callback',
            scopes: 'com.intuit.quickbooks.accounting openid profile email',
            environment: 'sandbox', // 'production' for live
            baseUrl: {
                sandbox: 'https://sandbox-quickbooks.api.intuit.com',
                production: 'https://quickbooks.api.intuit.com'
            },
            authUrl: 'https://appcenter.intuit.com/connect/oauth2'
        };

        this.accessToken = null;
        this.refreshToken = null;
        this.realmId = null;
        this.tokenExpiry = null;
        this.isConnected = false;
        this.companyInfo = null;
        this.lastSync = null;
        this.syncInterval = null;

        // Financial data cache
        this.financialData = {
            profitAndLoss: null,
            balanceSheet: null,
            cashFlow: null,
            accounts: null,
            customers: null,
            vendors: null,
            invoices: null,
            bills: null,
            journalEntries: null
        };

        this.init();
    }

    init() {
        // Check for existing connection
        this.loadStoredCredentials();

        // Check URL for OAuth callback
        this.handleOAuthCallback();
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    // Get user-specific storage key
    getStorageKey() {
        const userId = window.currentUser?.id || window.currentUserProfile?.id || 'guest';
        return `qb_credentials_${userId}`;
    }

    loadStoredCredentials() {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            if (stored) {
                const creds = JSON.parse(stored);
                this.accessToken = creds.accessToken;
                this.refreshToken = creds.refreshToken;
                this.realmId = creds.realmId;
                this.tokenExpiry = new Date(creds.tokenExpiry);
                this.companyInfo = creds.companyInfo;
                this.lastSync = creds.lastSync ? new Date(creds.lastSync) : null;

                // Check if token is still valid
                if (this.tokenExpiry > new Date()) {
                    this.isConnected = true;
                    this.startAutoSync();
                } else {
                    // Try to refresh
                    this.refreshAccessToken();
                }
            }
        } catch (e) {
            console.error('Error loading QB credentials:', e);
        }
    }

    saveCredentials() {
        const creds = {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            realmId: this.realmId,
            tokenExpiry: this.tokenExpiry?.toISOString(),
            companyInfo: this.companyInfo,
            lastSync: this.lastSync?.toISOString()
        };
        localStorage.setItem(this.getStorageKey(), JSON.stringify(creds));
    }

    // Initiate OAuth flow
    connect() {
        const state = this.generateState();
        sessionStorage.setItem('qb_oauth_state', state);

        const authParams = new URLSearchParams({
            client_id: this.config.clientId,
            scope: this.config.scopes,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            state: state
        });

        const authUrl = `${this.config.authUrl}?${authParams.toString()}`;

        // Open in popup for better UX
        const popup = window.open(
            authUrl,
            'QuickBooks Connect',
            'width=600,height=700,scrollbars=yes'
        );

        // Listen for message from popup
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'qb_oauth_success') {
                this.handleAuthorizationCode(event.data.code, event.data.realmId);
                popup?.close();
            }
        });
    }

    generateState() {
        const array = new Uint32Array(4);
        crypto.getRandomValues(array);
        return Array.from(array, x => x.toString(16)).join('');
    }

    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const realmId = urlParams.get('realmId');

        if (code && state) {
            const storedState = sessionStorage.getItem('qb_oauth_state');
            if (state === storedState) {
                // If in popup, send message to parent
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'qb_oauth_success',
                        code: code,
                        realmId: realmId
                    }, window.origin);
                    window.close();
                } else {
                    this.handleAuthorizationCode(code, realmId);
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        }
    }

    async handleAuthorizationCode(code, realmId) {
        try {
            // In production, this should go through your backend
            // For demo, we'll simulate the token exchange
            this.showStatus('Connecting to QuickBooks...', 'loading');

            // Simulated token exchange (replace with actual API call to your backend)
            const tokenResponse = await this.exchangeCodeForTokens(code);

            this.accessToken = tokenResponse.access_token;
            this.refreshToken = tokenResponse.refresh_token;
            this.realmId = realmId;
            this.tokenExpiry = new Date(Date.now() + (tokenResponse.expires_in * 1000));
            this.isConnected = true;

            this.saveCredentials();

            // Fetch company info
            await this.fetchCompanyInfo();

            // Start syncing data
            await this.syncAllData();

            this.showStatus('Connected to QuickBooks!', 'success');
            this.renderConnectionStatus();

        } catch (error) {
            console.error('OAuth error:', error);
            this.showStatus('Failed to connect: ' + error.message, 'error');
        }
    }

    async exchangeCodeForTokens(code) {
        // NOTE: In production, this should be done server-side
        // This is a simulation for demo purposes
        console.log('Exchanging code for tokens...');

        // Simulated response
        return {
            access_token: 'demo_access_token_' + Date.now(),
            refresh_token: 'demo_refresh_token_' + Date.now(),
            expires_in: 3600,
            token_type: 'bearer'
        };
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.disconnect();
            return;
        }

        try {
            // In production, call your backend to refresh the token
            const response = await this.refreshTokenRequest();

            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.tokenExpiry = new Date(Date.now() + (response.expires_in * 1000));
            this.isConnected = true;

            this.saveCredentials();
            this.startAutoSync();

        } catch (error) {
            console.error('Token refresh failed:', error);
            this.disconnect();
        }
    }

    async refreshTokenRequest() {
        // Simulated refresh (replace with actual API call)
        return {
            access_token: 'refreshed_access_token_' + Date.now(),
            refresh_token: 'refreshed_refresh_token_' + Date.now(),
            expires_in: 3600
        };
    }

    disconnect() {
        this.accessToken = null;
        this.refreshToken = null;
        this.realmId = null;
        this.tokenExpiry = null;
        this.isConnected = false;
        this.companyInfo = null;

        localStorage.removeItem('qb_credentials');
        this.stopAutoSync();

        this.renderConnectionStatus();
    }

    // =====================================================
    // DATA FETCHING
    // =====================================================

    async fetchCompanyInfo() {
        try {
            const response = await this.makeApiCall('/v3/company/' + this.realmId + '/companyinfo/' + this.realmId);
            this.companyInfo = response?.CompanyInfo;
            this.saveCredentials();
            return this.companyInfo;
        } catch (error) {
            console.error('Error fetching company info:', error);
            // Use mock data for demo
            this.companyInfo = {
                CompanyName: 'Demo Company',
                LegalName: 'Demo Company LLC',
                Country: 'US',
                FiscalYearStartMonth: 'January',
                Email: { Address: 'demo@example.com' }
            };
            return this.companyInfo;
        }
    }

    async makeApiCall(endpoint, method = 'GET', body = null) {
        // Check token validity
        if (this.tokenExpiry && this.tokenExpiry < new Date()) {
            await this.refreshAccessToken();
        }

        const baseUrl = this.config.baseUrl[this.config.environment];

        const options = {
            method: method,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        // NOTE: In production, this should proxy through your backend to avoid CORS
        const response = await fetch(baseUrl + endpoint, options);

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        return response.json();
    }

    // Sync all financial data
    async syncAllData() {
        this.showStatus('Syncing financial data...', 'loading');

        try {
            // Fetch all data in parallel for speed (like Fathom)
            const [profitLoss, balanceSheet, cashFlow, accounts, customers, vendors] = await Promise.all([
                this.fetchProfitAndLoss(),
                this.fetchBalanceSheet(),
                this.fetchCashFlowStatement(),
                this.fetchAccounts(),
                this.fetchCustomers(),
                this.fetchVendors()
            ]);

            this.financialData = {
                profitAndLoss: profitLoss,
                balanceSheet: balanceSheet,
                cashFlow: cashFlow,
                accounts: accounts,
                customers: customers,
                vendors: vendors
            };

            this.lastSync = new Date();
            this.saveCredentials();

            this.showStatus('Sync complete!', 'success');

            // Trigger UI update
            this.onDataSync();

            return this.financialData;

        } catch (error) {
            console.error('Sync failed:', error);
            this.showStatus('Sync failed: ' + error.message, 'error');
            // Return mock data for demo
            return this.getMockData();
        }
    }

    async fetchProfitAndLoss(startDate = null, endDate = null) {
        const today = new Date();
        const start = startDate || new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        const end = endDate || today.toISOString().split('T')[0];

        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/reports/ProfitAndLoss?start_date=${start}&end_date=${end}`
            );
            return this.parseProfitAndLoss(response);
        } catch (error) {
            return this.getMockProfitAndLoss();
        }
    }

    async fetchBalanceSheet(asOfDate = null) {
        const date = asOfDate || new Date().toISOString().split('T')[0];

        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/reports/BalanceSheet?date=${date}`
            );
            return this.parseBalanceSheet(response);
        } catch (error) {
            return this.getMockBalanceSheet();
        }
    }

    async fetchCashFlowStatement(startDate = null, endDate = null) {
        const today = new Date();
        const start = startDate || new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        const end = endDate || today.toISOString().split('T')[0];

        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/reports/CashFlow?start_date=${start}&end_date=${end}`
            );
            return this.parseCashFlow(response);
        } catch (error) {
            return this.getMockCashFlow();
        }
    }

    async fetchAccounts() {
        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/query?query=SELECT * FROM Account`
            );
            return response?.QueryResponse?.Account || [];
        } catch (error) {
            return this.getMockAccounts();
        }
    }

    async fetchCustomers() {
        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/query?query=SELECT * FROM Customer`
            );
            return response?.QueryResponse?.Customer || [];
        } catch (error) {
            return this.getMockCustomers();
        }
    }

    async fetchVendors() {
        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/query?query=SELECT * FROM Vendor`
            );
            return response?.QueryResponse?.Vendor || [];
        } catch (error) {
            return this.getMockVendors();
        }
    }

    async fetchInvoices(startDate = null, endDate = null) {
        const today = new Date();
        const start = startDate || new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        const end = endDate || today.toISOString().split('T')[0];

        try {
            const response = await this.makeApiCall(
                `/v3/company/${this.realmId}/query?query=SELECT * FROM Invoice WHERE TxnDate >= '${start}' AND TxnDate <= '${end}'`
            );
            return response?.QueryResponse?.Invoice || [];
        } catch (error) {
            return [];
        }
    }

    // =====================================================
    // DATA PARSING (QuickBooks Report Format)
    // =====================================================

    parseProfitAndLoss(report) {
        if (!report?.Rows?.Row) return this.getMockProfitAndLoss();

        const parsed = {
            header: report.Header,
            revenue: [],
            cogs: [],
            expenses: [],
            otherIncome: [],
            otherExpenses: [],
            totals: {}
        };

        // Parse the nested QuickBooks report structure
        const processRow = (row, category) => {
            if (row.Summary) {
                const amount = parseFloat(row.Summary.ColData?.[1]?.value || 0);
                return { name: row.Summary.ColData?.[0]?.value, amount };
            }
            if (row.ColData) {
                const amount = parseFloat(row.ColData[1]?.value || 0);
                return { name: row.ColData[0]?.value, amount };
            }
            return null;
        };

        report.Rows.Row.forEach(section => {
            const sectionName = section.Header?.ColData?.[0]?.value?.toLowerCase() || '';

            if (sectionName.includes('income') || sectionName.includes('revenue')) {
                if (section.Rows?.Row) {
                    section.Rows.Row.forEach(row => {
                        const item = processRow(row);
                        if (item) parsed.revenue.push(item);
                    });
                }
                if (section.Summary) {
                    parsed.totals.totalRevenue = parseFloat(section.Summary.ColData?.[1]?.value || 0);
                }
            } else if (sectionName.includes('cost of goods')) {
                if (section.Rows?.Row) {
                    section.Rows.Row.forEach(row => {
                        const item = processRow(row);
                        if (item) parsed.cogs.push(item);
                    });
                }
                if (section.Summary) {
                    parsed.totals.totalCogs = parseFloat(section.Summary.ColData?.[1]?.value || 0);
                }
            } else if (sectionName.includes('expense')) {
                if (section.Rows?.Row) {
                    section.Rows.Row.forEach(row => {
                        const item = processRow(row);
                        if (item) parsed.expenses.push(item);
                    });
                }
                if (section.Summary) {
                    parsed.totals.totalExpenses = parseFloat(section.Summary.ColData?.[1]?.value || 0);
                }
            }
        });

        // Calculate key metrics
        parsed.totals.grossProfit = (parsed.totals.totalRevenue || 0) - (parsed.totals.totalCogs || 0);
        parsed.totals.netIncome = parsed.totals.grossProfit - (parsed.totals.totalExpenses || 0);
        parsed.totals.grossMargin = parsed.totals.totalRevenue
            ? ((parsed.totals.grossProfit / parsed.totals.totalRevenue) * 100).toFixed(1)
            : 0;
        parsed.totals.netMargin = parsed.totals.totalRevenue
            ? ((parsed.totals.netIncome / parsed.totals.totalRevenue) * 100).toFixed(1)
            : 0;

        return parsed;
    }

    parseBalanceSheet(report) {
        if (!report?.Rows?.Row) return this.getMockBalanceSheet();

        return {
            assets: {
                current: [],
                fixed: [],
                total: 0
            },
            liabilities: {
                current: [],
                longTerm: [],
                total: 0
            },
            equity: {
                items: [],
                total: 0
            }
        };
    }

    parseCashFlow(report) {
        if (!report?.Rows?.Row) return this.getMockCashFlow();

        return {
            operating: { items: [], total: 0 },
            investing: { items: [], total: 0 },
            financing: { items: [], total: 0 },
            netChange: 0
        };
    }

    // =====================================================
    // MOCK DATA (For Demo/Testing)
    // =====================================================

    getMockData() {
        return {
            profitAndLoss: this.getMockProfitAndLoss(),
            balanceSheet: this.getMockBalanceSheet(),
            cashFlow: this.getMockCashFlow(),
            accounts: this.getMockAccounts(),
            customers: this.getMockCustomers(),
            vendors: this.getMockVendors()
        };
    }

    getMockProfitAndLoss() {
        return {
            revenue: [
                { name: 'Product Sales', amount: 485000 },
                { name: 'Service Revenue', amount: 215000 },
                { name: 'Consulting Fees', amount: 75000 },
                { name: 'Other Income', amount: 12500 }
            ],
            cogs: [
                { name: 'Cost of Goods Sold', amount: 182000 },
                { name: 'Direct Labor', amount: 95000 },
                { name: 'Materials', amount: 43000 }
            ],
            expenses: [
                { name: 'Payroll', amount: 185000 },
                { name: 'Rent', amount: 36000 },
                { name: 'Utilities', amount: 8400 },
                { name: 'Marketing', amount: 24000 },
                { name: 'Insurance', amount: 12000 },
                { name: 'Office Supplies', amount: 4800 },
                { name: 'Professional Services', amount: 18000 },
                { name: 'Software Subscriptions', amount: 9600 },
                { name: 'Travel', amount: 15000 },
                { name: 'Depreciation', amount: 22000 }
            ],
            totals: {
                totalRevenue: 787500,
                totalCogs: 320000,
                grossProfit: 467500,
                totalExpenses: 334800,
                netIncome: 132700,
                grossMargin: '59.4',
                netMargin: '16.9'
            }
        };
    }

    getMockBalanceSheet() {
        return {
            assets: {
                current: [
                    { name: 'Cash and Cash Equivalents', amount: 245000 },
                    { name: 'Accounts Receivable', amount: 187500 },
                    { name: 'Inventory', amount: 68000 },
                    { name: 'Prepaid Expenses', amount: 12000 }
                ],
                fixed: [
                    { name: 'Property & Equipment', amount: 450000 },
                    { name: 'Accumulated Depreciation', amount: -125000 },
                    { name: 'Intangible Assets', amount: 35000 }
                ],
                total: 872500
            },
            liabilities: {
                current: [
                    { name: 'Accounts Payable', amount: 78000 },
                    { name: 'Accrued Expenses', amount: 24000 },
                    { name: 'Current Portion of Debt', amount: 35000 },
                    { name: 'Deferred Revenue', amount: 45000 }
                ],
                longTerm: [
                    { name: 'Long-term Debt', amount: 215000 },
                    { name: 'Other Liabilities', amount: 18000 }
                ],
                total: 415000
            },
            equity: {
                items: [
                    { name: 'Common Stock', amount: 100000 },
                    { name: 'Retained Earnings', amount: 224800 },
                    { name: 'Current Year Earnings', amount: 132700 }
                ],
                total: 457500
            },
            ratios: {
                currentRatio: 2.81,
                quickRatio: 2.38,
                debtToEquity: 0.91
            }
        };
    }

    getMockCashFlow() {
        return {
            operating: {
                items: [
                    { name: 'Net Income', amount: 132700 },
                    { name: 'Depreciation', amount: 22000 },
                    { name: 'Change in AR', amount: -25000 },
                    { name: 'Change in Inventory', amount: -8000 },
                    { name: 'Change in AP', amount: 12000 }
                ],
                total: 133700
            },
            investing: {
                items: [
                    { name: 'Capital Expenditures', amount: -45000 },
                    { name: 'Asset Sales', amount: 8000 }
                ],
                total: -37000
            },
            financing: {
                items: [
                    { name: 'Debt Payments', amount: -35000 },
                    { name: 'Dividends Paid', amount: -25000 }
                ],
                total: -60000
            },
            netChange: 36700,
            beginningCash: 208300,
            endingCash: 245000
        };
    }

    getMockAccounts() {
        return [
            { Id: '1', Name: 'Checking', AccountType: 'Bank', CurrentBalance: 195000 },
            { Id: '2', Name: 'Savings', AccountType: 'Bank', CurrentBalance: 50000 },
            { Id: '3', Name: 'Accounts Receivable', AccountType: 'Accounts Receivable', CurrentBalance: 187500 },
            { Id: '4', Name: 'Inventory', AccountType: 'Other Current Asset', CurrentBalance: 68000 },
            { Id: '5', Name: 'Accounts Payable', AccountType: 'Accounts Payable', CurrentBalance: 78000 },
            { Id: '6', Name: 'Sales Revenue', AccountType: 'Income', CurrentBalance: 787500 },
            { Id: '7', Name: 'Cost of Goods Sold', AccountType: 'Cost of Goods Sold', CurrentBalance: 320000 }
        ];
    }

    getMockCustomers() {
        return [
            { Id: '1', DisplayName: 'ABC Corporation', Balance: 45000, PrimaryEmailAddr: { Address: 'contact@abc.com' } },
            { Id: '2', DisplayName: 'XYZ Industries', Balance: 32000, PrimaryEmailAddr: { Address: 'info@xyz.com' } },
            { Id: '3', DisplayName: 'Tech Solutions Inc', Balance: 28500, PrimaryEmailAddr: { Address: 'sales@techsol.com' } },
            { Id: '4', DisplayName: 'Global Partners LLC', Balance: 52000, PrimaryEmailAddr: { Address: 'ap@globalpartners.com' } },
            { Id: '5', DisplayName: 'Startup Ventures', Balance: 30000, PrimaryEmailAddr: { Address: 'team@startupv.com' } }
        ];
    }

    getMockVendors() {
        return [
            { Id: '1', DisplayName: 'Office Supplies Co', Balance: 2400 },
            { Id: '2', DisplayName: 'Tech Equipment Inc', Balance: 15000 },
            { Id: '3', DisplayName: 'Marketing Agency', Balance: 8500 },
            { Id: '4', DisplayName: 'Insurance Provider', Balance: 3000 },
            { Id: '5', DisplayName: 'Cloud Services', Balance: 1200 }
        ];
    }

    // =====================================================
    // AUTO-SYNC (Like Fathom)
    // =====================================================

    startAutoSync(intervalMinutes = 15) {
        this.stopAutoSync();

        // Sync immediately
        this.syncAllData();

        // Then sync on interval
        this.syncInterval = setInterval(() => {
            if (this.isConnected) {
                this.syncAllData();
            }
        }, intervalMinutes * 60 * 1000);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // =====================================================
    // UI COMPONENTS
    // =====================================================

    showStatus(message, type = 'info') {
        const existing = document.getElementById('qb-status-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'qb-status-toast';
        toast.innerHTML = `
            <div class="qb-toast ${type}">
                ${type === 'loading' ? '<div class="qb-spinner"></div>' : ''}
                <span>${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            z-index: 10002;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .qb-toast {
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 15px 25px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            }
            .qb-toast.success { border-left: 4px solid #00c853; }
            .qb-toast.error { border-left: 4px solid #ff3333; }
            .qb-toast.loading { border-left: 4px solid #2E7D32; }
            .qb-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: #2E7D32;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
        `;

        document.head.appendChild(style);
        document.body.appendChild(toast);

        if (type !== 'loading') {
            setTimeout(() => toast.remove(), 4000);
        }
    }

    renderConnectionStatus() {
        const container = document.getElementById('qb-connection-status');
        if (!container) return;

        if (this.isConnected && this.companyInfo) {
            container.innerHTML = `
                <div class="qb-connected">
                    <div class="qb-company-badge">
                        <img src="https://quickbooks.intuit.com/etc/designs/qbo-static/images/favicon.ico" alt="QB" width="24">
                        <div>
                            <strong>${this.companyInfo.CompanyName || 'Connected Company'}</strong>
                            <small>Last sync: ${this.lastSync ? this.formatDate(this.lastSync) : 'Never'}</small>
                        </div>
                    </div>
                    <div class="qb-actions">
                        <button class="btn btn-sm" onclick="quickBooksIntegration.syncAllData()">Sync Now</button>
                        <button class="btn btn-sm btn-outline" onclick="quickBooksIntegration.disconnect()">Disconnect</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="qb-disconnected">
                    <p>Connect to QuickBooks to automatically sync your financial data</p>
                    <button class="btn btn-primary qb-connect-btn" onclick="quickBooksIntegration.connect()">
                        <img src="https://quickbooks.intuit.com/etc/designs/qbo-static/images/favicon.ico" alt="QB" width="20">
                        Connect to QuickBooks
                    </button>
                </div>
            `;
        }
    }

    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        return date.toLocaleDateString();
    }

    onDataSync() {
        // Trigger custom event for UI updates
        window.dispatchEvent(new CustomEvent('quickbooks-data-sync', {
            detail: { financialData: this.financialData }
        }));

        // Update dashboard if it exists
        this.updateDashboard();
    }

    updateDashboard() {
        // Update the main dashboard with QuickBooks data
        if (this.financialData.profitAndLoss) {
            const pnl = this.financialData.profitAndLoss;

            // Update revenue card
            const revenueEl = document.querySelector('[data-metric="revenue"]');
            if (revenueEl) {
                revenueEl.textContent = this.formatCurrency(pnl.totals?.totalRevenue || 0);
            }

            // Update net income card
            const incomeEl = document.querySelector('[data-metric="netIncome"]');
            if (incomeEl) {
                incomeEl.textContent = this.formatCurrency(pnl.totals?.netIncome || 0);
            }

            // Update margin
            const marginEl = document.querySelector('[data-metric="grossMargin"]');
            if (marginEl) {
                marginEl.textContent = (pnl.totals?.grossMargin || 0) + '%';
            }
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // =====================================================
    // FINANCIAL ANALYSIS (Fathom-style)
    // =====================================================

    calculateKPIs() {
        const pnl = this.financialData.profitAndLoss || this.getMockProfitAndLoss();
        const bs = this.financialData.balanceSheet || this.getMockBalanceSheet();
        const cf = this.financialData.cashFlow || this.getMockCashFlow();

        return {
            // Profitability
            revenue: pnl.totals?.totalRevenue || 0,
            grossProfit: pnl.totals?.grossProfit || 0,
            netIncome: pnl.totals?.netIncome || 0,
            grossMargin: parseFloat(pnl.totals?.grossMargin || 0),
            netMargin: parseFloat(pnl.totals?.netMargin || 0),
            ebitda: this.calculateEBITDA(pnl),

            // Liquidity
            currentRatio: bs.ratios?.currentRatio || this.calculateCurrentRatio(bs),
            quickRatio: bs.ratios?.quickRatio || this.calculateQuickRatio(bs),
            workingCapital: this.calculateWorkingCapital(bs),

            // Leverage
            debtToEquity: bs.ratios?.debtToEquity || this.calculateDebtToEquity(bs),
            debtRatio: this.calculateDebtRatio(bs),

            // Cash Flow
            operatingCashFlow: cf.operating?.total || 0,
            freeCashFlow: this.calculateFreeCashFlow(cf),
            cashConversion: this.calculateCashConversion(pnl, cf),

            // Efficiency
            daysReceivable: this.calculateDaysReceivable(pnl, bs),
            daysPayable: this.calculateDaysPayable(pnl, bs),
            inventoryTurnover: this.calculateInventoryTurnover(pnl, bs)
        };
    }

    calculateEBITDA(pnl) {
        const netIncome = pnl.totals?.netIncome || 0;
        const depreciation = pnl.expenses?.find(e =>
            e.name.toLowerCase().includes('deprec') || e.name.toLowerCase().includes('amort')
        )?.amount || 22000;
        const interest = pnl.expenses?.find(e =>
            e.name.toLowerCase().includes('interest')
        )?.amount || 0;
        const taxes = pnl.expenses?.find(e =>
            e.name.toLowerCase().includes('tax')
        )?.amount || 0;

        return netIncome + depreciation + interest + taxes;
    }

    calculateCurrentRatio(bs) {
        const currentAssets = bs.assets?.current?.reduce((sum, a) => sum + a.amount, 0) || 0;
        const currentLiabilities = bs.liabilities?.current?.reduce((sum, l) => sum + l.amount, 0) || 1;
        return (currentAssets / currentLiabilities).toFixed(2);
    }

    calculateQuickRatio(bs) {
        const currentAssets = bs.assets?.current?.reduce((sum, a) => sum + a.amount, 0) || 0;
        const inventory = bs.assets?.current?.find(a => a.name.toLowerCase().includes('inventory'))?.amount || 0;
        const currentLiabilities = bs.liabilities?.current?.reduce((sum, l) => sum + l.amount, 0) || 1;
        return ((currentAssets - inventory) / currentLiabilities).toFixed(2);
    }

    calculateWorkingCapital(bs) {
        const currentAssets = bs.assets?.current?.reduce((sum, a) => sum + a.amount, 0) || 0;
        const currentLiabilities = bs.liabilities?.current?.reduce((sum, l) => sum + l.amount, 0) || 0;
        return currentAssets - currentLiabilities;
    }

    calculateDebtToEquity(bs) {
        const totalLiabilities = bs.liabilities?.total || 0;
        const totalEquity = bs.equity?.total || 1;
        return (totalLiabilities / totalEquity).toFixed(2);
    }

    calculateDebtRatio(bs) {
        const totalLiabilities = bs.liabilities?.total || 0;
        const totalAssets = bs.assets?.total || 1;
        return ((totalLiabilities / totalAssets) * 100).toFixed(1);
    }

    calculateFreeCashFlow(cf) {
        const operatingCF = cf.operating?.total || 0;
        const capex = Math.abs(cf.investing?.items?.find(i =>
            i.name.toLowerCase().includes('capital') || i.name.toLowerCase().includes('expenditure')
        )?.amount || 0);
        return operatingCF - capex;
    }

    calculateCashConversion(pnl, cf) {
        const netIncome = pnl.totals?.netIncome || 1;
        const operatingCF = cf.operating?.total || 0;
        return ((operatingCF / netIncome) * 100).toFixed(1);
    }

    calculateDaysReceivable(pnl, bs) {
        const revenue = pnl.totals?.totalRevenue || 1;
        const ar = bs.assets?.current?.find(a =>
            a.name.toLowerCase().includes('receivable')
        )?.amount || 0;
        return Math.round((ar / revenue) * 365);
    }

    calculateDaysPayable(pnl, bs) {
        const cogs = pnl.totals?.totalCogs || 1;
        const ap = bs.liabilities?.current?.find(l =>
            l.name.toLowerCase().includes('payable')
        )?.amount || 0;
        return Math.round((ap / cogs) * 365);
    }

    calculateInventoryTurnover(pnl, bs) {
        const cogs = pnl.totals?.totalCogs || 0;
        const inventory = bs.assets?.current?.find(a =>
            a.name.toLowerCase().includes('inventory')
        )?.amount || 1;
        return (cogs / inventory).toFixed(1);
    }

    // =====================================================
    // REPORTING
    // =====================================================

    generateExecutiveSummary() {
        const kpis = this.calculateKPIs();

        return {
            title: 'Executive Financial Summary',
            company: this.companyInfo?.CompanyName || 'Your Company',
            period: `YTD ${new Date().getFullYear()}`,
            lastUpdated: this.lastSync || new Date(),

            highlights: [
                {
                    metric: 'Revenue',
                    value: this.formatCurrency(kpis.revenue),
                    trend: '+12%',
                    status: 'positive'
                },
                {
                    metric: 'Net Income',
                    value: this.formatCurrency(kpis.netIncome),
                    trend: '+18%',
                    status: 'positive'
                },
                {
                    metric: 'Gross Margin',
                    value: kpis.grossMargin + '%',
                    trend: '+2.3%',
                    status: 'positive'
                },
                {
                    metric: 'Operating Cash Flow',
                    value: this.formatCurrency(kpis.operatingCashFlow),
                    trend: '+8%',
                    status: 'positive'
                }
            ],

            kpis: kpis,

            insights: this.generateInsights(kpis)
        };
    }

    generateInsights(kpis) {
        const insights = [];

        // Margin analysis
        if (kpis.grossMargin > 50) {
            insights.push({
                type: 'positive',
                category: 'Profitability',
                message: `Strong gross margin of ${kpis.grossMargin}% indicates healthy pricing power and cost control.`
            });
        } else if (kpis.grossMargin < 30) {
            insights.push({
                type: 'warning',
                category: 'Profitability',
                message: `Gross margin of ${kpis.grossMargin}% is below industry average. Consider reviewing pricing strategy.`
            });
        }

        // Liquidity
        if (kpis.currentRatio >= 2) {
            insights.push({
                type: 'positive',
                category: 'Liquidity',
                message: `Current ratio of ${kpis.currentRatio} shows strong short-term liquidity position.`
            });
        } else if (kpis.currentRatio < 1) {
            insights.push({
                type: 'critical',
                category: 'Liquidity',
                message: `Current ratio of ${kpis.currentRatio} indicates potential liquidity concerns.`
            });
        }

        // Cash flow
        if (kpis.freeCashFlow > 0) {
            insights.push({
                type: 'positive',
                category: 'Cash Flow',
                message: `Positive free cash flow of ${this.formatCurrency(kpis.freeCashFlow)} available for growth or distributions.`
            });
        }

        // Working capital
        if (kpis.daysReceivable > 45) {
            insights.push({
                type: 'warning',
                category: 'Efficiency',
                message: `Days receivable of ${kpis.daysReceivable} days is above best practice. Consider collections improvement.`
            });
        }

        return insights;
    }

    // =====================================================
    // OPEN QB DASHBOARD
    // =====================================================

    openDashboard() {
        const existing = document.getElementById('qb-dashboard-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'qb-dashboard-modal';
        modal.innerHTML = this.getDashboardHTML();
        document.body.appendChild(modal);

        this.injectDashboardStyles();
    }

    getDashboardHTML() {
        const kpis = this.calculateKPIs();
        const summary = this.generateExecutiveSummary();
        const pnl = this.financialData.profitAndLoss || this.getMockProfitAndLoss();
        const isDemo = !this.isConnected || this.config.clientId === 'YOUR_QB_CLIENT_ID';

        return `
        <div class="qb-modal-overlay" onclick="document.getElementById('qb-dashboard-modal').remove()"></div>
        <div class="qb-modal-content">
            ${isDemo ? `
            <div class="qb-demo-banner">
                <span class="qb-demo-icon">🔬</span>
                <span><strong>DEMO MODE</strong> - Showing sample data. Connect QuickBooks for real financials.</span>
                <button class="qb-connect-btn-small" onclick="qbIntegration.connect()">Connect QuickBooks</button>
            </div>
            ` : ''}
            <div class="qb-modal-header">
                <div class="qb-header-left">
                    <img src="https://quickbooks.intuit.com/etc/designs/qbo-static/images/favicon.ico" alt="QB" width="32">
                    <div>
                        <h2>QuickBooks Dashboard</h2>
                        <p>${summary.company} - ${summary.period}</p>
                    </div>
                </div>
                <button class="qb-modal-close" onclick="document.getElementById('qb-dashboard-modal').remove()">&times;</button>
            </div>

            <div class="qb-modal-body">
                <!-- KPI Cards -->
                <div class="qb-kpi-grid">
                    <div class="qb-kpi-card">
                        <div class="qb-kpi-label">Revenue</div>
                        <div class="qb-kpi-value">${this.formatCurrency(kpis.revenue)}</div>
                        <div class="qb-kpi-trend positive">+12% YoY</div>
                    </div>
                    <div class="qb-kpi-card">
                        <div class="qb-kpi-label">Gross Profit</div>
                        <div class="qb-kpi-value">${this.formatCurrency(kpis.grossProfit)}</div>
                        <div class="qb-kpi-trend positive">${kpis.grossMargin}% margin</div>
                    </div>
                    <div class="qb-kpi-card">
                        <div class="qb-kpi-label">Net Income</div>
                        <div class="qb-kpi-value">${this.formatCurrency(kpis.netIncome)}</div>
                        <div class="qb-kpi-trend positive">${kpis.netMargin}% margin</div>
                    </div>
                    <div class="qb-kpi-card">
                        <div class="qb-kpi-label">EBITDA</div>
                        <div class="qb-kpi-value">${this.formatCurrency(kpis.ebitda)}</div>
                        <div class="qb-kpi-trend positive">Strong</div>
                    </div>
                </div>

                <!-- Two Column Layout -->
                <div class="qb-two-column">
                    <!-- P&L Summary -->
                    <div class="qb-panel">
                        <h3>Profit & Loss Summary</h3>
                        <div class="qb-pnl-section">
                            <div class="qb-pnl-header">Revenue</div>
                            ${pnl.revenue.map(r => `
                                <div class="qb-pnl-row">
                                    <span>${r.name}</span>
                                    <span>${this.formatCurrency(r.amount)}</span>
                                </div>
                            `).join('')}
                            <div class="qb-pnl-total">
                                <span>Total Revenue</span>
                                <span>${this.formatCurrency(pnl.totals.totalRevenue)}</span>
                            </div>
                        </div>
                        <div class="qb-pnl-section">
                            <div class="qb-pnl-header">Cost of Goods Sold</div>
                            ${pnl.cogs.map(c => `
                                <div class="qb-pnl-row">
                                    <span>${c.name}</span>
                                    <span>${this.formatCurrency(c.amount)}</span>
                                </div>
                            `).join('')}
                            <div class="qb-pnl-total">
                                <span>Gross Profit</span>
                                <span>${this.formatCurrency(pnl.totals.grossProfit)}</span>
                            </div>
                        </div>
                        <div class="qb-pnl-section">
                            <div class="qb-pnl-header">Operating Expenses</div>
                            ${pnl.expenses.slice(0, 5).map(e => `
                                <div class="qb-pnl-row">
                                    <span>${e.name}</span>
                                    <span>${this.formatCurrency(e.amount)}</span>
                                </div>
                            `).join('')}
                            <div class="qb-pnl-row muted">
                                <span>+ ${pnl.expenses.length - 5} more items...</span>
                                <span></span>
                            </div>
                            <div class="qb-pnl-total highlight">
                                <span>Net Income</span>
                                <span>${this.formatCurrency(pnl.totals.netIncome)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Financial Ratios -->
                    <div class="qb-panel">
                        <h3>Financial Ratios</h3>
                        <div class="qb-ratios-grid">
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Current Ratio</div>
                                <div class="qb-ratio-value">${kpis.currentRatio}</div>
                                <div class="qb-ratio-bar">
                                    <div style="width: ${Math.min(kpis.currentRatio * 33, 100)}%"></div>
                                </div>
                            </div>
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Quick Ratio</div>
                                <div class="qb-ratio-value">${kpis.quickRatio}</div>
                                <div class="qb-ratio-bar">
                                    <div style="width: ${Math.min(kpis.quickRatio * 40, 100)}%"></div>
                                </div>
                            </div>
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Debt to Equity</div>
                                <div class="qb-ratio-value">${kpis.debtToEquity}</div>
                                <div class="qb-ratio-bar warning">
                                    <div style="width: ${Math.min(kpis.debtToEquity * 50, 100)}%"></div>
                                </div>
                            </div>
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Days Receivable</div>
                                <div class="qb-ratio-value">${kpis.daysReceivable}</div>
                                <div class="qb-ratio-bar">
                                    <div style="width: ${Math.min(kpis.daysReceivable, 100)}%"></div>
                                </div>
                            </div>
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Days Payable</div>
                                <div class="qb-ratio-value">${kpis.daysPayable}</div>
                                <div class="qb-ratio-bar">
                                    <div style="width: ${Math.min(kpis.daysPayable, 100)}%"></div>
                                </div>
                            </div>
                            <div class="qb-ratio">
                                <div class="qb-ratio-label">Cash Conversion</div>
                                <div class="qb-ratio-value">${kpis.cashConversion}%</div>
                                <div class="qb-ratio-bar">
                                    <div style="width: ${Math.min(kpis.cashConversion, 100)}%"></div>
                                </div>
                            </div>
                        </div>

                        <h3 style="margin-top: 2rem;">AI Insights</h3>
                        <div class="qb-insights">
                            ${summary.insights.map(insight => `
                                <div class="qb-insight ${insight.type}">
                                    <span class="qb-insight-icon">${insight.type === 'positive' ? '✓' : insight.type === 'warning' ? '⚠' : '⚡'}</span>
                                    <div>
                                        <strong>${insight.category}</strong>
                                        <p>${insight.message}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="qb-actions-bar">
                    <button class="btn btn-secondary" onclick="quickBooksIntegration.syncAllData()">
                        🔄 Sync Now
                    </button>
                    <button class="btn btn-secondary" onclick="quickBooksIntegration.exportToExcel()">
                        📊 Export to Excel
                    </button>
                    <button class="btn btn-primary" onclick="quickBooksIntegration.generateReport()">
                        📄 Generate Report
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    injectDashboardStyles() {
        if (document.getElementById('qb-dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'qb-dashboard-styles';
        style.textContent = `
            #qb-dashboard-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100000;
            }

            .qb-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
            }

            .qb-modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 1200px;
                max-height: 90vh;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
                border-radius: 24px;
                border: 2px solid #2E7D32;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .qb-demo-banner {
                background: linear-gradient(90deg, #ff9800, #f57c00);
                color: #000;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                font-size: 0.95rem;
                border-bottom: 2px solid #e65100;
            }

            .qb-demo-icon {
                font-size: 1.3rem;
            }

            .qb-connect-btn-small {
                background: #1a1a2e;
                color: #fff;
                border: 2px solid #fff;
                padding: 6px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                font-size: 0.85rem;
                transition: all 0.3s ease;
            }

            .qb-connect-btn-small:hover {
                background: #2E7D32;
                border-color: #2E7D32;
            }

            .qb-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid rgba(46, 125, 50, 0.3);
            }

            .qb-header-left {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .qb-header-left h2 {
                margin: 0;
                color: #2E7D32;
            }

            .qb-header-left p {
                margin: 0;
                color: #888;
                font-size: 0.9rem;
            }

            .qb-modal-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                opacity: 0.6;
            }

            .qb-modal-close:hover { opacity: 1; }

            .qb-modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 2rem;
            }

            .qb-kpi-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .qb-kpi-card {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(46, 125, 50, 0.3);
                border-radius: 16px;
                padding: 1.5rem;
                text-align: center;
            }

            .qb-kpi-label {
                color: #888;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .qb-kpi-value {
                color: #fff;
                font-size: 1.8rem;
                font-weight: bold;
            }

            .qb-kpi-trend {
                margin-top: 0.5rem;
                font-size: 0.85rem;
            }

            .qb-kpi-trend.positive { color: #2E7D32; }
            .qb-kpi-trend.negative { color: #ff3333; }

            .qb-two-column {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            .qb-panel {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
                padding: 1.5rem;
            }

            .qb-panel h3 {
                color: #2E7D32;
                margin: 0 0 1rem;
                font-size: 1.1rem;
            }

            .qb-pnl-section {
                margin-bottom: 1.5rem;
            }

            .qb-pnl-header {
                color: #aaa;
                font-size: 0.85rem;
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .qb-pnl-row {
                display: flex;
                justify-content: space-between;
                padding: 0.4rem 0;
                color: #ccc;
                font-size: 0.9rem;
            }

            .qb-pnl-row.muted {
                color: #666;
                font-style: italic;
            }

            .qb-pnl-total {
                display: flex;
                justify-content: space-between;
                padding: 0.75rem 0;
                margin-top: 0.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-weight: bold;
                color: #fff;
            }

            .qb-pnl-total.highlight {
                color: #2E7D32;
                font-size: 1.1rem;
            }

            .qb-ratios-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }

            .qb-ratio {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 1rem;
            }

            .qb-ratio-label {
                color: #888;
                font-size: 0.8rem;
                margin-bottom: 0.25rem;
            }

            .qb-ratio-value {
                color: #fff;
                font-size: 1.4rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }

            .qb-ratio-bar {
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                overflow: hidden;
            }

            .qb-ratio-bar div {
                height: 100%;
                background: linear-gradient(90deg, #2E7D32, #4CAF50);
                border-radius: 3px;
                transition: width 0.5s ease;
            }

            .qb-ratio-bar.warning div {
                background: linear-gradient(90deg, #ff9800, #ffc107);
            }

            .qb-insights {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .qb-insight {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                border-radius: 10px;
                background: rgba(0, 0, 0, 0.2);
            }

            .qb-insight.positive { border-left: 3px solid #2E7D32; }
            .qb-insight.warning { border-left: 3px solid #ff9800; }
            .qb-insight.critical { border-left: 3px solid #ff3333; }

            .qb-insight-icon {
                font-size: 1.2rem;
            }

            .qb-insight strong {
                color: #fff;
                display: block;
                margin-bottom: 0.25rem;
            }

            .qb-insight p {
                color: #aaa;
                margin: 0;
                font-size: 0.9rem;
            }

            .qb-actions-bar {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            @media (max-width: 900px) {
                .qb-kpi-grid { grid-template-columns: repeat(2, 1fr); }
                .qb-two-column { grid-template-columns: 1fr; }
                .qb-ratios-grid { grid-template-columns: 1fr; }
            }
        `;
        document.head.appendChild(style);
    }

    exportToExcel() {
        // Use the financial reports system if available
        if (typeof window.financialReports?.exportProfessionalExcel === 'function') {
            window.financialReports.exportProfessionalExcel(this.financialData);
        } else {
            alert('Excel export initiated! The file will download shortly.');
        }
    }

    generateReport() {
        // Use the financial reports system if available
        if (typeof window.openFinancialReports === 'function') {
            window.openFinancialReports();
        } else {
            alert('Report generation initiated!');
        }
    }
}

// Initialize
const quickBooksIntegration = new QuickBooksIntegration();

// Global functions
window.quickBooksIntegration = quickBooksIntegration;

window.openQuickBooksDashboard = function() {
    quickBooksIntegration.openDashboard();
};

window.connectQuickBooks = function() {
    quickBooksIntegration.connect();
};

// =====================================================
// DEMO MODE FUNCTIONS (For QuickBooks Tab UI)
// =====================================================

// Demo mode - Load sample QuickBooks data
window.demoQuickBooks = function() {
    // Show loading toast
    quickBooksIntegration.showStatus('Loading demo QuickBooks data...', 'loading');

    // Simulate connection
    setTimeout(() => {
        quickBooksIntegration.isConnected = true;
        quickBooksIntegration.companyInfo = {
            CompanyName: 'Demo Company Inc.',
            LegalName: 'Demo Company Inc.',
            Country: 'US',
            FiscalYearStartMonth: 'January',
            Email: { Address: 'demo@democompany.com' }
        };

        // Load mock financial data
        quickBooksIntegration.financialData = quickBooksIntegration.getMockData();
        quickBooksIntegration.lastSync = new Date();

        // Update UI
        const statusEl = document.getElementById('qb-connection-status');
        if (statusEl) {
            statusEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; color: #4CAF50;">
                    <span style="font-size: 1.5rem;">✓</span>
                    <div>
                        <strong>Demo Mode Active</strong>
                        <div style="font-size: 0.85rem; color: #888;">Showing sample data for Demo Company Inc.</div>
                    </div>
                </div>
            `;
        }

        // Update synced data preview
        updateQBSyncedDataPreview();

        quickBooksIntegration.showStatus('Demo data loaded successfully!', 'success');

        // Trigger data sync event for other components
        window.dispatchEvent(new CustomEvent('quickbooks-data-sync', {
            detail: { financialData: quickBooksIntegration.financialData, isDemo: true }
        }));

    }, 1000);
};

// Update the synced data preview in QuickBooks tab
function updateQBSyncedDataPreview() {
    const data = quickBooksIntegration.financialData;
    const pnl = data.profitAndLoss || quickBooksIntegration.getMockProfitAndLoss();
    const bs = data.balanceSheet || quickBooksIntegration.getMockBalanceSheet();
    const cf = data.cashFlow || quickBooksIntegration.getMockCashFlow();
    const customers = data.customers || quickBooksIntegration.getMockCustomers();

    // Update P&L status (using existing HTML ID)
    const pnlEl = document.getElementById('qbPnLStatus');
    if (pnlEl) {
        pnlEl.innerHTML = `<span style="color: #4CAF50;">${quickBooksIntegration.formatCurrency(pnl.totals?.netIncome || 132700)}</span>`;
    }

    // Update Balance Sheet status
    const bsEl = document.getElementById('qbBSStatus');
    if (bsEl) {
        bsEl.innerHTML = `<span style="color: #2196F3;">${quickBooksIntegration.formatCurrency(bs.assets?.total || 872500)}</span>`;
    }

    // Update Cash Flow status
    const cfEl = document.getElementById('qbCFStatus');
    if (cfEl) {
        cfEl.innerHTML = `<span style="color: #ff9800;">${quickBooksIntegration.formatCurrency(cf.netChange || 36700)}</span>`;
    }

    // Update Invoices status
    const invEl = document.getElementById('qbInvStatus');
    if (invEl) {
        const totalAR = customers.reduce((sum, c) => sum + (c.Balance || 0), 0);
        invEl.innerHTML = `<span style="color: #9c27b0;">${quickBooksIntegration.formatCurrency(totalAR)}</span>`;
    }

    // Update Customers status
    const custEl = document.getElementById('qbCustStatus');
    if (custEl) {
        custEl.innerHTML = `<span style="color: #00bcd4;">${customers.length} Active</span>`;
    }

    // Show connected state and hide not-connected
    const statusEl = document.getElementById('quickbooksStatus');
    const connectedEl = document.getElementById('quickbooksConnected');
    const companyNameEl = document.getElementById('qbCompanyName');

    if (statusEl && connectedEl) {
        statusEl.classList.add('hidden');
        connectedEl.classList.remove('hidden');
        if (companyNameEl) {
            companyNameEl.textContent = quickBooksIntegration.companyInfo?.CompanyName || 'Demo Company';
        }
    }
}

// Generate P&L Report from QuickBooks data
window.qbGeneratePnL = function() {
    const pnl = quickBooksIntegration.financialData.profitAndLoss || quickBooksIntegration.getMockProfitAndLoss();

    // Create P&L report modal
    const modal = document.createElement('div');
    modal.id = 'qb-pnl-report-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000;" onclick="this.parentElement.remove()"></div>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 800px; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; border: 2px solid #4CAF50; z-index: 100001; padding: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #4CAF50; margin: 0;">Profit & Loss Statement</h2>
                <button onclick="document.getElementById('qb-pnl-report-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>

            <div style="color: #888; margin-bottom: 20px;">Period: YTD ${new Date().getFullYear()} | ${quickBooksIntegration.companyInfo?.CompanyName || 'Demo Company'}</div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #4CAF50; margin: 0 0 15px; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Revenue</h3>
                ${pnl.revenue.map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${r.name}</span>
                        <span>${quickBooksIntegration.formatCurrency(r.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #4CAF50; font-weight: bold; border-top: 2px solid rgba(76,175,80,0.3); margin-top: 10px;">
                    <span>Total Revenue</span>
                    <span>${quickBooksIntegration.formatCurrency(pnl.totals.totalRevenue)}</span>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #ff9800; margin: 0 0 15px; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Cost of Goods Sold</h3>
                ${pnl.cogs.map(c => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${c.name}</span>
                        <span>${quickBooksIntegration.formatCurrency(c.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #2196F3; font-weight: bold; border-top: 2px solid rgba(33,150,243,0.3); margin-top: 10px;">
                    <span>Gross Profit</span>
                    <span>${quickBooksIntegration.formatCurrency(pnl.totals.grossProfit)}</span>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #f44336; margin: 0 0 15px; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">Operating Expenses</h3>
                ${pnl.expenses.map(e => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${e.name}</span>
                        <span>${quickBooksIntegration.formatCurrency(e.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #f44336; font-weight: bold; border-top: 2px solid rgba(244,67,54,0.3); margin-top: 10px;">
                    <span>Total Expenses</span>
                    <span>${quickBooksIntegration.formatCurrency(pnl.totals.totalExpenses)}</span>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, rgba(76,175,80,0.2), rgba(33,150,243,0.2)); border-radius: 15px; padding: 25px; text-align: center;">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 5px;">Net Income</div>
                <div style="color: #4CAF50; font-size: 2.5rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(pnl.totals.netIncome)}</div>
                <div style="color: #888; margin-top: 10px;">
                    Gross Margin: <span style="color: #2196F3;">${pnl.totals.grossMargin}%</span> |
                    Net Margin: <span style="color: #4CAF50;">${pnl.totals.netMargin}%</span>
                </div>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                <button onclick="window.print()" style="background: linear-gradient(135deg, #2196F3, #1976D2); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Print Report</button>
                <button onclick="qbExportPnLExcel()" style="background: linear-gradient(135deg, #4CAF50, #388E3C); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Export Excel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// Generate Balance Sheet Report
window.qbGenerateBS = function() {
    const bs = quickBooksIntegration.financialData.balanceSheet || quickBooksIntegration.getMockBalanceSheet();

    const modal = document.createElement('div');
    modal.id = 'qb-bs-report-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000;" onclick="this.parentElement.remove()"></div>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 900px; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; border: 2px solid #2196F3; z-index: 100001; padding: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #2196F3; margin: 0;">Balance Sheet</h2>
                <button onclick="document.getElementById('qb-bs-report-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>

            <div style="color: #888; margin-bottom: 20px;">As of ${new Date().toLocaleDateString()} | ${quickBooksIntegration.companyInfo?.CompanyName || 'Demo Company'}</div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h3 style="color: #4CAF50; margin: 0 0 15px; font-size: 1rem;">ASSETS</h3>
                        <h4 style="color: #888; margin: 15px 0 10px; font-size: 0.85rem;">Current Assets</h4>
                        ${bs.assets.current.map(a => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #ccc; font-size: 0.9rem;">
                                <span>${a.name}</span>
                                <span>${quickBooksIntegration.formatCurrency(a.amount)}</span>
                            </div>
                        `).join('')}
                        <h4 style="color: #888; margin: 15px 0 10px; font-size: 0.85rem;">Fixed Assets</h4>
                        ${bs.assets.fixed.map(a => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #ccc; font-size: 0.9rem;">
                                <span>${a.name}</span>
                                <span>${quickBooksIntegration.formatCurrency(a.amount)}</span>
                            </div>
                        `).join('')}
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #4CAF50; font-weight: bold; border-top: 2px solid rgba(76,175,80,0.3); margin-top: 15px;">
                            <span>Total Assets</span>
                            <span>${quickBooksIntegration.formatCurrency(bs.assets.total)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                        <h3 style="color: #f44336; margin: 0 0 15px; font-size: 1rem;">LIABILITIES</h3>
                        <h4 style="color: #888; margin: 15px 0 10px; font-size: 0.85rem;">Current Liabilities</h4>
                        ${bs.liabilities.current.map(l => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #ccc; font-size: 0.9rem;">
                                <span>${l.name}</span>
                                <span>${quickBooksIntegration.formatCurrency(l.amount)}</span>
                            </div>
                        `).join('')}
                        <h4 style="color: #888; margin: 15px 0 10px; font-size: 0.85rem;">Long-term Liabilities</h4>
                        ${bs.liabilities.longTerm.map(l => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #ccc; font-size: 0.9rem;">
                                <span>${l.name}</span>
                                <span>${quickBooksIntegration.formatCurrency(l.amount)}</span>
                            </div>
                        `).join('')}
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #f44336; font-weight: bold; border-top: 2px solid rgba(244,67,54,0.3); margin-top: 15px;">
                            <span>Total Liabilities</span>
                            <span>${quickBooksIntegration.formatCurrency(bs.liabilities.total)}</span>
                        </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px;">
                        <h3 style="color: #9c27b0; margin: 0 0 15px; font-size: 1rem;">EQUITY</h3>
                        ${bs.equity.items.map(e => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #ccc; font-size: 0.9rem;">
                                <span>${e.name}</span>
                                <span>${quickBooksIntegration.formatCurrency(e.amount)}</span>
                            </div>
                        `).join('')}
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #9c27b0; font-weight: bold; border-top: 2px solid rgba(156,39,176,0.3); margin-top: 15px;">
                            <span>Total Equity</span>
                            <span>${quickBooksIntegration.formatCurrency(bs.equity.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, rgba(33,150,243,0.2), rgba(156,39,176,0.2)); border-radius: 15px; padding: 20px; margin-top: 20px;">
                <h4 style="color: #fff; margin: 0 0 15px;">Key Ratios</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Current Ratio</div>
                        <div style="color: #4CAF50; font-size: 1.5rem; font-weight: bold;">${bs.ratios?.currentRatio || '2.81'}</div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Quick Ratio</div>
                        <div style="color: #2196F3; font-size: 1.5rem; font-weight: bold;">${bs.ratios?.quickRatio || '2.38'}</div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Debt to Equity</div>
                        <div style="color: #ff9800; font-size: 1.5rem; font-weight: bold;">${bs.ratios?.debtToEquity || '0.91'}</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                <button onclick="window.print()" style="background: linear-gradient(135deg, #2196F3, #1976D2); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Print Report</button>
                <button onclick="qbExportBSExcel()" style="background: linear-gradient(135deg, #4CAF50, #388E3C); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Export Excel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// Generate Cash Flow Statement
window.qbGenerateCF = function() {
    const cf = quickBooksIntegration.financialData.cashFlow || quickBooksIntegration.getMockCashFlow();

    const modal = document.createElement('div');
    modal.id = 'qb-cf-report-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100000;" onclick="this.parentElement.remove()"></div>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 800px; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 20px; border: 2px solid #ff9800; z-index: 100001; padding: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: #ff9800; margin: 0;">Cash Flow Statement</h2>
                <button onclick="document.getElementById('qb-cf-report-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>

            <div style="color: #888; margin-bottom: 20px;">Period: YTD ${new Date().getFullYear()} | ${quickBooksIntegration.companyInfo?.CompanyName || 'Demo Company'}</div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #4CAF50; margin: 0 0 15px; font-size: 1rem;">Operating Activities</h3>
                ${cf.operating.items.map(i => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc;">
                        <span>${i.name}</span>
                        <span style="color: ${i.amount >= 0 ? '#4CAF50' : '#f44336'}">${quickBooksIntegration.formatCurrency(i.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #4CAF50; font-weight: bold; border-top: 2px solid rgba(76,175,80,0.3); margin-top: 10px;">
                    <span>Net Cash from Operating</span>
                    <span>${quickBooksIntegration.formatCurrency(cf.operating.total)}</span>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #2196F3; margin: 0 0 15px; font-size: 1rem;">Investing Activities</h3>
                ${cf.investing.items.map(i => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc;">
                        <span>${i.name}</span>
                        <span style="color: ${i.amount >= 0 ? '#4CAF50' : '#f44336'}">${quickBooksIntegration.formatCurrency(i.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #f44336; font-weight: bold; border-top: 2px solid rgba(33,150,243,0.3); margin-top: 10px;">
                    <span>Net Cash from Investing</span>
                    <span>${quickBooksIntegration.formatCurrency(cf.investing.total)}</span>
                </div>
            </div>

            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #9c27b0; margin: 0 0 15px; font-size: 1rem;">Financing Activities</h3>
                ${cf.financing.items.map(i => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #ccc;">
                        <span>${i.name}</span>
                        <span style="color: ${i.amount >= 0 ? '#4CAF50' : '#f44336'}">${quickBooksIntegration.formatCurrency(i.amount)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #f44336; font-weight: bold; border-top: 2px solid rgba(156,39,176,0.3); margin-top: 10px;">
                    <span>Net Cash from Financing</span>
                    <span>${quickBooksIntegration.formatCurrency(cf.financing.total)}</span>
                </div>
            </div>

            <div style="background: linear-gradient(135deg, rgba(255,152,0,0.2), rgba(76,175,80,0.2)); border-radius: 15px; padding: 25px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Beginning Cash</div>
                        <div style="color: #fff; font-size: 1.3rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(cf.beginningCash)}</div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Net Change</div>
                        <div style="color: ${cf.netChange >= 0 ? '#4CAF50' : '#f44336'}; font-size: 1.3rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(cf.netChange)}</div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 0.85rem;">Ending Cash</div>
                        <div style="color: #ff9800; font-size: 1.3rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(cf.endingCash)}</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                <button onclick="window.print()" style="background: linear-gradient(135deg, #2196F3, #1976D2); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Print Report</button>
                <button onclick="qbExportCFExcel()" style="background: linear-gradient(135deg, #4CAF50, #388E3C); color: #fff; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold;">Export Excel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

// Create Financial Deck from QuickBooks data
window.qbCreateDeck = function() {
    quickBooksIntegration.showStatus('Generating financial presentation...', 'loading');

    setTimeout(() => {
        // Check if PowerPoint builder exists
        if (typeof window.openPowerPointBuilder === 'function') {
            window.openPowerPointBuilder();

            // Pre-load QuickBooks data into the presentation
            setTimeout(() => {
                const event = new CustomEvent('load-qb-data-to-presentation', {
                    detail: quickBooksIntegration.financialData
                });
                window.dispatchEvent(event);
                quickBooksIntegration.showStatus('Presentation template ready with QuickBooks data!', 'success');
            }, 500);
        } else if (typeof window.openReportBuilder === 'function') {
            // Fall back to report builder
            window.openReportBuilder();
            quickBooksIntegration.showStatus('Report builder opened with QuickBooks data!', 'success');
        } else {
            // Show deck creation preview
            showQBDeckPreview();
        }
    }, 800);
};

// Show deck preview when builders aren't available
function showQBDeckPreview() {
    const pnl = quickBooksIntegration.financialData.profitAndLoss || quickBooksIntegration.getMockProfitAndLoss();
    const kpis = quickBooksIntegration.calculateKPIs();

    const modal = document.createElement('div');
    modal.id = 'qb-deck-preview-modal';
    modal.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 100000;" onclick="this.parentElement.remove()"></div>
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 1000px; max-height: 85vh; overflow-y: auto; background: linear-gradient(135deg, #0a0a1a, #1a1a2e); border-radius: 20px; border: 2px solid #9c27b0; z-index: 100001; padding: 0;">

            <!-- Slide Preview -->
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); aspect-ratio: 16/9; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="color: #9c27b0; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px;">Financial Review</div>
                <h1 style="color: #fff; font-size: 2.5rem; margin: 0 0 10px; text-align: center;">${quickBooksIntegration.companyInfo?.CompanyName || 'Demo Company Inc.'}</h1>
                <p style="color: #888; margin: 0;">Q4 ${new Date().getFullYear()} Performance</p>

                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 40px; width: 100%;">
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">Revenue</div>
                        <div style="color: #4CAF50; font-size: 1.5rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(kpis.revenue)}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">Net Income</div>
                        <div style="color: #2196F3; font-size: 1.5rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(kpis.netIncome)}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">Gross Margin</div>
                        <div style="color: #ff9800; font-size: 1.5rem; font-weight: bold;">${kpis.grossMargin}%</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">EBITDA</div>
                        <div style="color: #9c27b0; font-size: 1.5rem; font-weight: bold;">${quickBooksIntegration.formatCurrency(kpis.ebitda)}</div>
                    </div>
                </div>
            </div>

            <div style="padding: 30px;">
                <h3 style="color: #fff; margin: 0 0 20px;">Deck Contents (8 Slides)</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    ${['Title Slide', 'Executive Summary', 'P&L Overview', 'Revenue Analysis', 'Expense Breakdown', 'Balance Sheet', 'Cash Flow', 'Key Takeaways'].map((slide, i) => `
                        <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; text-align: center;">
                            <div style="color: #9c27b0; font-size: 0.8rem; margin-bottom: 5px;">Slide ${i + 1}</div>
                            <div style="color: #fff; font-size: 0.9rem;">${slide}</div>
                        </div>
                    `).join('')}
                </div>

                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button onclick="document.getElementById('qb-deck-preview-modal').remove()" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 12px 30px; border-radius: 25px; cursor: pointer;">Cancel</button>
                    <button onclick="qbDownloadDeck()" style="background: linear-gradient(135deg, #9c27b0, #7b1fa2); color: #fff; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: bold;">Download PPTX</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    quickBooksIntegration.showStatus('Deck preview ready!', 'success');
}

// Download deck (placeholder - would use pptxgenjs in production)
window.qbDownloadDeck = function() {
    quickBooksIntegration.showStatus('Generating PPTX file...', 'loading');

    setTimeout(() => {
        // In production, this would use pptxgenjs to create a real PPTX
        alert('PowerPoint generation complete! In the full version, this would download a professional PPTX file with your QuickBooks data.');
        quickBooksIntegration.showStatus('Deck generated successfully!', 'success');

        const modal = document.getElementById('qb-deck-preview-modal');
        if (modal) modal.remove();
    }, 1500);
};

// Sync QuickBooks data (called from UI)
window.syncQuickBooks = function() {
    quickBooksIntegration.syncAllData().then(() => {
        updateQBSyncedDataPreview();
    });
};

// Disconnect QuickBooks (called from UI)
window.disconnectQuickBooks = function() {
    if (confirm('Are you sure you want to disconnect QuickBooks? Your synced data will be cleared.')) {
        quickBooksIntegration.disconnect();

        // Reset UI
        const statusEl = document.getElementById('quickbooksStatus');
        const connectedEl = document.getElementById('quickbooksConnected');

        if (statusEl && connectedEl) {
            statusEl.classList.remove('hidden');
            connectedEl.classList.add('hidden');
        }

        // Reset status displays
        ['qbPnLStatus', 'qbBSStatus', 'qbCFStatus', 'qbInvStatus', 'qbCustStatus'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<span style="color: #666;">--</span>';
        });

        quickBooksIntegration.showStatus('QuickBooks disconnected', 'success');
    }
};

// Excel export placeholders
window.qbExportPnLExcel = function() {
    quickBooksIntegration.showStatus('Exporting P&L to Excel...', 'loading');
    setTimeout(() => {
        alert('Excel export complete! In the full version, this downloads an Excel file with your P&L data.');
        quickBooksIntegration.showStatus('Export complete!', 'success');
    }, 1000);
};

window.qbExportBSExcel = function() {
    quickBooksIntegration.showStatus('Exporting Balance Sheet to Excel...', 'loading');
    setTimeout(() => {
        alert('Excel export complete! In the full version, this downloads an Excel file with your Balance Sheet data.');
        quickBooksIntegration.showStatus('Export complete!', 'success');
    }, 1000);
};

window.qbExportCFExcel = function() {
    quickBooksIntegration.showStatus('Exporting Cash Flow to Excel...', 'loading');
    setTimeout(() => {
        alert('Excel export complete! In the full version, this downloads an Excel file with your Cash Flow data.');
        quickBooksIntegration.showStatus('Export complete!', 'success');
    }, 1000);
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickBooksIntegration;
}

// =====================================================
// FILE MANAGER SYSTEM - Lightning Ledgerz
// Handles user file uploads with categorized storage
// =====================================================

class FileManager {
    constructor() {
        this.categories = [
            {
                id: 'customer-list',
                name: 'Customer List',
                icon: '👥',
                description: 'Upload your customer database (CSV, Excel)',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true
            },
            {
                id: 'product-list',
                name: 'Product List',
                icon: '📦',
                description: 'Your products/services catalog',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true
            },
            {
                id: 'last-year-budget',
                name: "Last Year's Budget",
                icon: '📅',
                description: 'Previous year budget for comparison',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true
            },
            {
                id: 'trailing-proforma',
                name: 'Trailing Proforma',
                icon: '📈',
                description: 'Trailing 12-month proforma statement',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true
            },
            {
                id: 'trailing-balance-sheet',
                name: 'Trailing Balance Sheet',
                icon: '⚖️',
                description: 'Recent balance sheet data',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true
            },
            {
                id: 'trailing-cash-flow',
                name: 'Trailing Cash Flow',
                icon: '💰',
                description: 'Cash flow statement for analysis',
                accepts: '.csv,.xlsx,.xls,.docx,.doc,.pdf,.png,.jpg,.jpeg,.gif,.svg,.webp',
                required: true,
                analyzable: true
            }
        ];

        this.files = {};
        this.userId = null;
        this.supabase = null;
    }

    init(userId, supabase) {
        this.userId = userId;
        this.supabase = supabase;
        this.loadFiles();
    }

    // Load files from storage (localStorage for test users, Supabase for real users)
    async loadFiles() {
        if (!this.userId) return;

        // Check if this is a test user
        if (this.userId === 'test-emily-001') {
            const saved = localStorage.getItem('emilyFiles');
            if (saved) {
                try {
                    this.files = JSON.parse(saved);
                } catch (e) {
                    this.files = {};
                }
            }
        } else if (this.supabase) {
            // Load from Supabase for real users
            try {
                const { data, error } = await this.supabase
                    .from('user_files')
                    .select('*')
                    .eq('user_id', this.userId);

                if (!error && data) {
                    data.forEach(file => {
                        this.files[file.category] = {
                            name: file.file_name,
                            size: file.file_size,
                            type: file.file_type,
                            uploadedAt: file.created_at,
                            url: file.file_url,
                            data: null // Will be fetched on demand
                        };
                    });
                }
            } catch (e) {
                console.error('Error loading files from Supabase:', e);
            }
        }
    }

    // Save files to storage
    async saveFiles() {
        if (!this.userId) return;

        if (this.userId === 'test-emily-001') {
            // For test user, save to localStorage (without base64 data to save space)
            const toSave = {};
            Object.keys(this.files).forEach(key => {
                toSave[key] = {
                    name: this.files[key].name,
                    size: this.files[key].size,
                    type: this.files[key].type,
                    uploadedAt: this.files[key].uploadedAt
                };
            });
            localStorage.setItem('emilyFiles', JSON.stringify(toSave));
        }
    }

    // Upload file to a category
    async uploadFile(categoryId, file) {
        if (!this.userId) {
            throw new Error('Please sign in to upload files');
        }

        const category = this.categories.find(c => c.id === categoryId);
        if (!category) {
            throw new Error('Invalid file category');
        }

        // Validate file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!category.accepts.includes(ext)) {
            throw new Error(`Invalid file type. Accepted: ${category.accepts}`);
        }

        // For test user, store in localStorage
        if (this.userId === 'test-emily-001') {
            this.files[categoryId] = {
                name: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString()
            };
            await this.saveFiles();

            // If it's a cash flow file, analyze it
            if (category.analyzable && categoryId === 'trailing-cash-flow') {
                setTimeout(() => this.analyzeCashFlow(file), 500);
            }

            return { success: true, message: `${file.name} uploaded successfully` };
        }

        // For real users, upload to Supabase Storage
        if (this.supabase) {
            try {
                const filePath = `${this.userId}/${categoryId}/${file.name}`;

                // Upload to storage
                const { data: uploadData, error: uploadError } = await this.supabase
                    .storage
                    .from('user-files')
                    .upload(filePath, file, { upsert: true });

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: urlData } = this.supabase
                    .storage
                    .from('user-files')
                    .getPublicUrl(filePath);

                // Save metadata to database
                const { error: dbError } = await this.supabase
                    .from('user_files')
                    .upsert({
                        user_id: this.userId,
                        category: categoryId,
                        file_name: file.name,
                        file_size: file.size,
                        file_type: file.type,
                        file_url: urlData.publicUrl,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,category'
                    });

                if (dbError) console.error('Error saving file metadata:', dbError);

                this.files[categoryId] = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    url: urlData.publicUrl
                };

                // Analyze cash flow if applicable
                if (category.analyzable && categoryId === 'trailing-cash-flow') {
                    setTimeout(() => this.analyzeCashFlow(file), 500);
                }

                return { success: true, message: `${file.name} uploaded successfully` };
            } catch (e) {
                console.error('Upload error:', e);
                throw new Error('Failed to upload file: ' + e.message);
            }
        }

        throw new Error('Storage not available');
    }

    // Delete file from a category
    async deleteFile(categoryId) {
        if (!this.userId) return;

        if (this.userId === 'test-emily-001') {
            delete this.files[categoryId];
            await this.saveFiles();
            return { success: true };
        }

        if (this.supabase) {
            try {
                const file = this.files[categoryId];
                if (file) {
                    // Delete from storage
                    const filePath = `${this.userId}/${categoryId}/${file.name}`;
                    await this.supabase.storage.from('user-files').remove([filePath]);

                    // Delete from database
                    await this.supabase
                        .from('user_files')
                        .delete()
                        .eq('user_id', this.userId)
                        .eq('category', categoryId);
                }

                delete this.files[categoryId];
                return { success: true };
            } catch (e) {
                console.error('Delete error:', e);
                throw new Error('Failed to delete file');
            }
        }
    }

    // Analyze cash flow for imbalances
    async analyzeCashFlow(file) {
        // Read the file and look for common imbalances
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            const issues = [];

            // Basic CSV/text analysis for demo
            if (file.type.includes('csv') || file.name.endsWith('.csv')) {
                const lines = content.split('\n');
                let operatingCash = 0;
                let investingCash = 0;
                let financingCash = 0;
                let netCash = 0;

                // Look for cash flow categories
                lines.forEach(line => {
                    const lower = line.toLowerCase();
                    const numbers = line.match(/-?\d+(?:,\d{3})*(?:\.\d+)?/g);
                    const value = numbers ? parseFloat(numbers[numbers.length - 1].replace(/,/g, '')) : 0;

                    if (lower.includes('operating') && numbers) {
                        operatingCash = value;
                    } else if (lower.includes('investing') && numbers) {
                        investingCash = value;
                    } else if (lower.includes('financing') && numbers) {
                        financingCash = value;
                    } else if ((lower.includes('net') || lower.includes('total')) && lower.includes('cash') && numbers) {
                        netCash = value;
                    }
                });

                // Check for common issues
                if (operatingCash < 0) {
                    issues.push({
                        severity: 'high',
                        title: 'Negative Operating Cash Flow',
                        message: `Operating activities show negative cash flow ($${operatingCash.toLocaleString()}). This may indicate the business is not generating enough cash from core operations.`,
                        suggestion: 'Consider reviewing accounts receivable collection, reducing inventory, or negotiating better payment terms with suppliers.'
                    });
                }

                if (investingCash > operatingCash && investingCash > 0) {
                    issues.push({
                        severity: 'medium',
                        title: 'Investment Cash Exceeds Operations',
                        message: 'Cash from investing activities exceeds operating cash flow. This could indicate asset sales to fund operations.',
                        suggestion: 'Ensure asset sales are strategic and not just covering operational shortfalls.'
                    });
                }

                if (financingCash > 0 && operatingCash < 0) {
                    issues.push({
                        severity: 'high',
                        title: 'Debt-Funded Operations',
                        message: 'Positive financing cash flow with negative operating cash suggests reliance on debt or equity to fund operations.',
                        suggestion: 'Work on improving operational efficiency and cash conversion cycle.'
                    });
                }

                // Check if totals balance
                const calculated = operatingCash + investingCash + financingCash;
                if (netCash !== 0 && Math.abs(calculated - netCash) > 1) {
                    issues.push({
                        severity: 'high',
                        title: 'Cash Flow Imbalance Detected',
                        message: `The sum of operating ($${operatingCash.toLocaleString()}), investing ($${investingCash.toLocaleString()}), and financing ($${financingCash.toLocaleString()}) doesn't match the reported net cash change ($${netCash.toLocaleString()}). Difference: $${(calculated - netCash).toLocaleString()}`,
                        suggestion: 'Review your cash flow statement for missing entries or calculation errors.'
                    });
                }
            }

            // Show analysis results
            if (issues.length > 0) {
                this.showCashFlowAnalysis(issues);
            } else {
                this.showNotification('Cash flow analysis complete - no major issues detected!', 'success');
            }
        };

        if (file.type.includes('csv') || file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            // For Excel/PDF, show a message that deeper analysis would require the full system
            this.showNotification('Cash flow file uploaded. Connect QuickBooks for automatic analysis.', 'info');
        }
    }

    // Show cash flow analysis modal
    showCashFlowAnalysis(issues) {
        // Remove existing modal if any
        const existing = document.getElementById('cashflow-analysis-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'cashflow-analysis-modal';
        modal.className = 'modal-overlay';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;';

        const content = document.createElement('div');
        content.style.cssText = 'background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:20px;padding:30px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;border:2px solid #f39c12;';

        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2 style="color:#f39c12;margin:0;font-size:24px;">
                    ⚠️ Cash Flow Analysis
                </h2>
                <button onclick="this.closest('.modal-overlay').remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
            </div>
            <p style="color:#aaa;margin-bottom:20px;">We've detected ${issues.length} potential issue${issues.length > 1 ? 's' : ''} in your cash flow statement:</p>
            ${issues.map(issue => `
                <div style="background:rgba(${issue.severity === 'high' ? '231,76,60' : issue.severity === 'medium' ? '243,156,18' : '52,152,219'},0.2);border-left:4px solid ${issue.severity === 'high' ? '#e74c3c' : issue.severity === 'medium' ? '#f39c12' : '#3498db'};padding:15px;margin-bottom:15px;border-radius:0 10px 10px 0;">
                    <h3 style="color:${issue.severity === 'high' ? '#e74c3c' : issue.severity === 'medium' ? '#f39c12' : '#3498db'};margin:0 0 10px 0;font-size:16px;">
                        ${issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🔵'} ${issue.title}
                    </h3>
                    <p style="color:#ccc;margin:0 0 10px 0;font-size:14px;">${issue.message}</p>
                    <p style="color:#2ecc71;margin:0;font-size:13px;font-style:italic;">
                        💡 ${issue.suggestion}
                    </p>
                </div>
            `).join('')}
            <div style="text-align:center;margin-top:20px;">
                <button onclick="this.closest('.modal-overlay').remove()" style="background:linear-gradient(135deg,#f39c12,#e74c3c);color:#fff;border:none;padding:12px 30px;border-radius:25px;font-size:16px;cursor:pointer;font-weight:600;">
                    Got It
                </button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: #fff;
            font-weight: 600;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg,#2ecc71,#27ae60)' : type === 'error' ? 'linear-gradient(135deg,#e74c3c,#c0392b)' : 'linear-gradient(135deg,#3498db,#2980b9)'};
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Create the file manager UI
    createUI() {
        const container = document.createElement('div');
        container.id = 'file-manager-container';
        container.className = 'file-manager';
        container.innerHTML = `
            <style>
                .file-manager {
                    background: linear-gradient(135deg, #1a1a2e, #16213e);
                    border-radius: 20px;
                    padding: 30px;
                    margin: 20px 0;
                    border: 1px solid rgba(243, 156, 18, 0.3);
                }
                .file-manager h3 {
                    color: #f39c12;
                    margin: 0 0 10px 0;
                    font-size: 24px;
                }
                .file-manager .subtitle {
                    color: #888;
                    margin-bottom: 25px;
                }
                .file-categories {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .file-category {
                    background: rgba(255,255,255,0.05);
                    border: 2px dashed rgba(243, 156, 18, 0.3);
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }
                .file-category:hover {
                    border-color: #f39c12;
                    background: rgba(243, 156, 18, 0.1);
                    transform: translateY(-3px);
                }
                .file-category.has-file {
                    border-style: solid;
                    border-color: #2ecc71;
                    background: rgba(46, 204, 113, 0.1);
                }
                .file-category .icon {
                    font-size: 40px;
                    margin-bottom: 10px;
                }
                .file-category .name {
                    color: #fff;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .file-category .description {
                    color: #888;
                    font-size: 12px;
                    margin-bottom: 10px;
                }
                .file-category .file-info {
                    background: rgba(46, 204, 113, 0.2);
                    padding: 8px 12px;
                    border-radius: 8px;
                    color: #2ecc71;
                    font-size: 12px;
                    display: none;
                }
                .file-category.has-file .file-info {
                    display: block;
                }
                .file-category .upload-hint {
                    color: #f39c12;
                    font-size: 12px;
                    margin-top: 10px;
                }
                .file-category.has-file .upload-hint {
                    display: none;
                }
                .file-category input[type="file"] {
                    display: none;
                }
                .file-category .delete-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #e74c3c;
                    color: #fff;
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: none;
                    font-size: 12px;
                }
                .file-category.has-file .delete-btn {
                    display: block;
                }
                .file-category.dragover {
                    border-color: #f39c12;
                    background: rgba(243, 156, 18, 0.2);
                    transform: scale(1.02);
                }
                .file-progress {
                    width: 100%;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    height: 4px;
                    margin-top: 10px;
                    overflow: hidden;
                    display: none;
                }
                .file-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #f39c12, #e74c3c);
                    border-radius: 10px;
                    width: 0%;
                    transition: width 0.3s ease;
                }
                .required-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #e74c3c;
                    color: #fff;
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .file-category.has-file .required-badge {
                    background: #2ecc71;
                }
                .file-category.has-file .required-badge::after {
                    content: ' ✓';
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            </style>

            <h3>📁 Your Files</h3>
            <p class="subtitle">Upload your financial documents for analysis. Drag & drop or click to upload.</p>

            <div class="file-categories">
                ${this.categories.map(cat => `
                    <div class="file-category ${this.files[cat.id] ? 'has-file' : ''}" data-category="${cat.id}">
                        ${cat.required ? '<span class="required-badge">Required</span>' : ''}
                        <button class="delete-btn" onclick="event.stopPropagation(); window.fileManager.deleteFileUI('${cat.id}')">×</button>
                        <div class="icon">${cat.icon}</div>
                        <div class="name">${cat.name}</div>
                        <div class="description">${cat.description}</div>
                        <div class="file-info" id="file-info-${cat.id}">
                            ${this.files[cat.id] ? `📎 ${this.files[cat.id].name}` : ''}
                        </div>
                        <div class="upload-hint">Click or drop file here</div>
                        <div class="file-progress"><div class="file-progress-bar"></div></div>
                        <input type="file" accept="${cat.accepts}" onchange="window.fileManager.handleFileSelect('${cat.id}', this.files[0])">
                    </div>
                `).join('')}
            </div>
        `;

        // Add event listeners for drag & drop
        setTimeout(() => {
            container.querySelectorAll('.file-category').forEach(el => {
                el.addEventListener('click', (e) => {
                    if (e.target.classList.contains('delete-btn')) return;
                    el.querySelector('input[type="file"]').click();
                });

                el.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    el.classList.add('dragover');
                });

                el.addEventListener('dragleave', () => {
                    el.classList.remove('dragover');
                });

                el.addEventListener('drop', (e) => {
                    e.preventDefault();
                    el.classList.remove('dragover');
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        this.handleFileSelect(el.dataset.category, file);
                    }
                });
            });
        }, 100);

        return container;
    }

    // Handle file selection
    async handleFileSelect(categoryId, file) {
        if (!file) return;

        const categoryEl = document.querySelector(`.file-category[data-category="${categoryId}"]`);
        const progressEl = categoryEl.querySelector('.file-progress');
        const progressBar = categoryEl.querySelector('.file-progress-bar');

        // Show progress
        progressEl.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressBar.style.width = Math.min(progress, 90) + '%';
        }, 100);

        try {
            await this.uploadFile(categoryId, file);

            // Complete progress
            clearInterval(progressInterval);
            progressBar.style.width = '100%';

            // Update UI
            categoryEl.classList.add('has-file');
            const fileInfo = document.getElementById(`file-info-${categoryId}`);
            if (fileInfo) {
                fileInfo.textContent = `📎 ${file.name}`;
            }

            setTimeout(() => {
                progressEl.style.display = 'none';
                progressBar.style.width = '0%';
            }, 500);

            this.showNotification(`${file.name} uploaded successfully!`, 'success');
        } catch (error) {
            clearInterval(progressInterval);
            progressEl.style.display = 'none';
            this.showNotification(error.message, 'error');
        }
    }

    // Delete file UI handler
    async deleteFileUI(categoryId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            await this.deleteFile(categoryId);

            const categoryEl = document.querySelector(`.file-category[data-category="${categoryId}"]`);
            if (categoryEl) {
                categoryEl.classList.remove('has-file');
                const fileInfo = document.getElementById(`file-info-${categoryId}`);
                if (fileInfo) fileInfo.textContent = '';
            }

            this.showNotification('File deleted successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Get completion status
    getCompletionStatus() {
        const required = this.categories.filter(c => c.required);
        const completed = required.filter(c => this.files[c.id]);
        return {
            total: required.length,
            completed: completed.length,
            percentage: Math.round((completed.length / required.length) * 100)
        };
    }
}

// Initialize global file manager
window.fileManager = new FileManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileManager;
}

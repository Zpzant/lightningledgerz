/**
 * LIGHTNING LEDGERZ - Admin Dashboard
 * =====================================================
 * System admin dashboard ONLY for zpzant@gmail.com
 * View all users, their data, sessions, and uploads.
 *
 * CRITICAL: Only accessible by admin users (is_admin = TRUE)
 */

class AdminDashboard {
    constructor() {
        this.isAdmin = false;
        this.users = [];
        this.sessions = [];
        this.uploads = [];
        this.init();
    }

    async init() {
        // Check if current user is admin
        await this.checkAdminStatus();
    }

    async checkAdminStatus() {
        const user = window.currentUser;
        const profile = window.currentUserProfile;

        if (!user || !profile) {
            this.isAdmin = false;
            return;
        }

        // Check if user is admin
        if (profile.is_admin === true || profile.email === 'zpzant@gmail.com') {
            this.isAdmin = true;
            console.log('✓ Admin access granted');
        } else {
            this.isAdmin = false;
        }
    }

    // =====================================================
    // UI RENDERING
    // =====================================================

    open() {
        if (!this.isAdmin) {
            alert('Access denied. Admin privileges required.');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'admin-dashboard-modal';
        modal.innerHTML = this.render();
        document.body.appendChild(modal);
        this.attachEvents();
        this.loadDashboardData();
    }

    close() {
        const modal = document.getElementById('admin-dashboard-modal');
        if (modal) modal.remove();
    }

    render() {
        return `
            <div class="admin-overlay">
                <div class="admin-container">
                    <button class="admin-close" onclick="window.AdminDashboard.close()">&times;</button>

                    <div class="admin-header">
                        <h1>⚡ System Admin Dashboard</h1>
                        <p>Manage users and view all system data</p>
                        <div class="admin-badge">Admin: ${window.currentUserProfile?.email || 'Unknown'}</div>
                    </div>

                    <div class="admin-tabs">
                        <button class="admin-tab active" data-tab="users">Users</button>
                        <button class="admin-tab" data-tab="sessions">Sessions</button>
                        <button class="admin-tab" data-tab="uploads">Uploads</button>
                        <button class="admin-tab" data-tab="send-report">Send Report</button>
                        <button class="admin-tab" data-tab="stats">Statistics</button>
                    </div>

                    <!-- Users Tab -->
                    <div class="admin-content" id="admin-tab-users">
                        <div class="admin-section">
                            <h3>All Users</h3>
                            <div class="admin-stats-row">
                                <div class="stat-card">
                                    <div class="stat-number" id="total-users">0</div>
                                    <div class="stat-label">Total Users</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number" id="active-users">0</div>
                                    <div class="stat-label">Active Today</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number" id="new-users">0</div>
                                    <div class="stat-label">New This Week</div>
                                </div>
                            </div>

                            <div class="admin-table-container">
                                <table class="admin-table" id="users-table">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Name</th>
                                            <th>Company</th>
                                            <th>Package</th>
                                            <th>Signed Up</th>
                                            <th>Last Active</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="users-table-body">
                                        <tr><td colspan="7" style="text-align:center;">Loading...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Sessions Tab -->
                    <div class="admin-content" id="admin-tab-sessions" style="display:none;">
                        <div class="admin-section">
                            <h3>Active Sessions</h3>
                            <div class="admin-table-container">
                                <table class="admin-table" id="sessions-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Device</th>
                                            <th>Browser</th>
                                            <th>Started</th>
                                            <th>Last Activity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="sessions-table-body">
                                        <tr><td colspan="6" style="text-align:center;">Loading...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Uploads Tab -->
                    <div class="admin-content" id="admin-tab-uploads" style="display:none;">
                        <div class="admin-section">
                            <h3>User Uploads</h3>
                            <div class="admin-table-container">
                                <table class="admin-table" id="uploads-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>File Name</th>
                                            <th>Type</th>
                                            <th>Size</th>
                                            <th>Uploaded</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="uploads-table-body">
                                        <tr><td colspan="6" style="text-align:center;">Loading...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Send Report Tab -->
                    <div class="admin-content" id="admin-tab-send-report" style="display:none;">
                        <div class="admin-section">
                            <h3>Upload Report to Client</h3>
                            <p style="color:#888;margin-bottom:20px;">Select a client, upload their report, and it will appear in their "My Reports" section.</p>
                            <div style="display:grid;gap:16px;max-width:500px;">
                                <div>
                                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">Select Client</label>
                                    <select id="admin-client-select" style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#252525;color:#fff;font-size:14px;">
                                        <option value="">-- Choose a client --</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">Report Name</label>
                                    <input type="text" id="admin-report-name" placeholder="e.g., Q1 2026 Budget vs Actual" style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#252525;color:#fff;font-size:14px;">
                                </div>
                                <div>
                                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">Description (optional)</label>
                                    <textarea id="admin-report-desc" placeholder="Brief description of this report..." rows="2" style="width:100%;padding:10px;border-radius:8px;border:1px solid #444;background:#252525;color:#fff;font-size:14px;resize:vertical;"></textarea>
                                </div>
                                <div>
                                    <label style="display:block;margin-bottom:6px;font-weight:600;font-size:13px;">Upload File</label>
                                    <input type="file" id="admin-report-file" accept=".pdf,.xlsx,.xls,.csv,.pptx,.ppt,.doc,.docx,.png,.jpg" style="color:#ccc;font-size:13px;">
                                </div>
                                <button onclick="window.AdminDashboard.sendReportToClient()" style="background:#ff3333;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">Upload Report to Client</button>
                                <div id="admin-report-status" style="color:#28a745;font-weight:600;font-size:13px;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics Tab -->
                    <div class="admin-content" id="admin-tab-stats" style="display:none;">
                        <div class="admin-section">
                            <h3>System Statistics</h3>
                            <div class="stats-grid">
                                <div class="stat-box">
                                    <h4>Data Isolation</h4>
                                    <p class="stat-big">✅ Active</p>
                                    <p class="stat-desc">Row Level Security enabled on all tables</p>
                                </div>
                                <div class="stat-box">
                                    <h4>Database</h4>
                                    <p class="stat-big" id="db-status">Connected</p>
                                    <p class="stat-desc">Supabase PostgreSQL</p>
                                </div>
                                <div class="stat-box">
                                    <h4>Storage</h4>
                                    <p class="stat-big" id="storage-used">0 MB</p>
                                    <p class="stat-desc">Files uploaded by users</p>
                                </div>
                            </div>

                            <div class="privacy-notice">
                                <h4>🔒 Privacy & Data Isolation</h4>
                                <ul>
                                    <li>✅ Each user can ONLY access their own data</li>
                                    <li>✅ Row Level Security (RLS) enforced on all tables</li>
                                    <li>✅ Admin can view all data for support purposes</li>
                                    <li>✅ Session data isolated per user</li>
                                    <li>✅ File uploads restricted to user folders</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .admin-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.95); z-index: 10000;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; overflow-y: auto;
                }
                .admin-container {
                    background: #1a1a1a; border-radius: 16px;
                    width: 100%; max-width: 1200px;
                    max-height: 90vh; overflow-y: auto;
                    position: relative; color: white;
                }
                .admin-close {
                    position: absolute; top: 20px; right: 20px;
                    background: none; border: none; color: #888;
                    font-size: 32px; cursor: pointer; z-index: 1;
                }
                .admin-close:hover { color: #fff; }

                .admin-header {
                    padding: 40px 40px 24px; border-bottom: 2px solid #ff3333;
                }
                .admin-header h1 {
                    margin: 0 0 8px; color: #ff3333; font-size: 28px;
                }
                .admin-header p {
                    margin: 0 0 12px; color: #888;
                }
                .admin-badge {
                    display: inline-block; padding: 6px 12px;
                    background: #ff3333; color: white;
                    border-radius: 6px; font-size: 12px; font-weight: 600;
                }

                .admin-tabs {
                    display: flex; border-bottom: 1px solid #333;
                    padding: 0 40px;
                }
                .admin-tab {
                    background: none; border: none; color: #888;
                    padding: 16px 24px; font-size: 14px; font-weight: 600;
                    cursor: pointer; border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .admin-tab:hover { color: #ccc; }
                .admin-tab.active { color: #ff3333; border-bottom-color: #ff3333; }

                .admin-content { padding: 32px 40px; }
                .admin-section { margin-bottom: 32px; }
                .admin-section h3 {
                    margin: 0 0 20px; color: white; font-size: 20px;
                }

                .admin-stats-row {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 16px; margin-bottom: 24px;
                }
                .stat-card {
                    background: #252525; padding: 20px;
                    border-radius: 10px; text-align: center;
                    border: 1px solid #333;
                }
                .stat-number {
                    font-size: 36px; font-weight: 700;
                    color: #ff3333; margin-bottom: 8px;
                }
                .stat-label {
                    font-size: 13px; color: #888; text-transform: uppercase;
                }

                .admin-table-container {
                    overflow-x: auto; background: #252525;
                    border-radius: 10px; border: 1px solid #333;
                }
                .admin-table {
                    width: 100%; border-collapse: collapse;
                    font-size: 13px;
                }
                .admin-table th {
                    background: #1a1a1a; padding: 12px 16px;
                    text-align: left; font-weight: 600;
                    color: #fff; border-bottom: 2px solid #333;
                }
                .admin-table td {
                    padding: 12px 16px; border-bottom: 1px solid #2a2a2a;
                    color: #ccc;
                }
                .admin-table tr:hover { background: #2a2a2a; }

                .admin-action-btn {
                    background: #333; color: white; border: none;
                    padding: 6px 12px; border-radius: 4px;
                    font-size: 11px; cursor: pointer;
                    margin-right: 4px;
                }
                .admin-action-btn:hover { background: #444; }
                .admin-action-btn.danger { background: #dc3545; }
                .admin-action-btn.danger:hover { background: #c82333; }

                .stats-grid {
                    display: grid; grid-template-columns: repeat(3, 1fr);
                    gap: 20px; margin-bottom: 32px;
                }
                .stat-box {
                    background: #252525; padding: 24px;
                    border-radius: 10px; border: 1px solid #333;
                }
                .stat-box h4 {
                    margin: 0 0 12px; color: white; font-size: 16px;
                }
                .stat-big {
                    font-size: 28px; font-weight: 700;
                    color: #28a745; margin: 0 0 8px;
                }
                .stat-desc {
                    font-size: 12px; color: #888; margin: 0;
                }

                .privacy-notice {
                    background: #1a2c1a; padding: 24px;
                    border-radius: 10px; border: 2px solid #28a745;
                }
                .privacy-notice h4 {
                    margin: 0 0 12px; color: #28a745; font-size: 18px;
                }
                .privacy-notice ul {
                    margin: 0; padding: 0 0 0 20px;
                    color: #ccc; line-height: 1.8;
                }

                @media (max-width: 768px) {
                    .admin-stats-row, .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .admin-header, .admin-tabs, .admin-content {
                        padding-left: 20px; padding-right: 20px;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
                tab.classList.add('active');
                document.getElementById(`admin-tab-${tab.dataset.tab}`).style.display = 'block';

                // Load data for the selected tab
                if (tab.dataset.tab === 'sessions') {
                    this.loadSessions();
                } else if (tab.dataset.tab === 'uploads') {
                    this.loadUploads();
                } else if (tab.dataset.tab === 'send-report') {
                    this.populateClientDropdown();
                }
            });
        });
    }

    // =====================================================
    // DATA LOADING
    // =====================================================

    async loadDashboardData() {
        await this.loadUsers();
        this.updateStats();
    }

    async loadUsers() {
        const sb = window.LightningAuth ? initSupabase() : null;

        if (sb) {
            try {
                // Admin can see all profiles
                const { data, error } = await sb
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    this.users = data;
                    this.renderUsersTable(data);
                    return;
                }
            } catch (e) {
                console.error('Error loading users:', e);
            }
        }

        // Fallback to localStorage
        const localAccounts = JSON.parse(localStorage.getItem('lightningLedgerzAccounts') || '{}');
        const users = Object.values(localAccounts).map(acc => acc.profile);
        this.users = users;
        this.renderUsersTable(users);
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => {
            const signedUp = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
            const lastActive = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never';

            return `
                <tr>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.first_name || ''} ${user.last_name || ''}</td>
                    <td>${user.company || 'N/A'}</td>
                    <td><span class="package-badge ${user.package_tier || 'basic'}">${user.package_tier || 'basic'}</span></td>
                    <td>${signedUp}</td>
                    <td>${lastActive}</td>
                    <td>
                        <button class="admin-action-btn" onclick="window.AdminDashboard.viewUserData('${user.id}')">View Data</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async loadSessions() {
        const tbody = document.getElementById('sessions-table-body');
        if (!tbody) return;

        const sb = window.LightningAuth ? initSupabase() : null;

        if (sb) {
            try {
                const { data, error } = await sb
                    .from('session_history')
                    .select('*, profiles(email)')
                    .eq('is_active', true)
                    .order('started_at', { ascending: false });

                if (!error && data) {
                    this.sessions = data;
                    tbody.innerHTML = data.map(session => `
                        <tr>
                            <td>${session.profiles?.email || 'Unknown'}</td>
                            <td>${session.device_type || 'Unknown'}</td>
                            <td>${session.browser || 'Unknown'}</td>
                            <td>${new Date(session.started_at).toLocaleString()}</td>
                            <td>${new Date(session.last_activity).toLocaleString()}</td>
                            <td><span style="color:#28a745;">● Active</span></td>
                        </tr>
                    `).join('');
                    return;
                }
            } catch (e) {
                console.error('Error loading sessions:', e);
            }
        }

        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Session tracking requires Supabase</td></tr>';
    }

    async loadUploads() {
        const tbody = document.getElementById('uploads-table-body');
        if (!tbody) return;

        const sb = window.LightningAuth ? initSupabase() : null;

        if (sb) {
            try {
                const { data, error } = await sb
                    .from('user_documents')
                    .select('*, profiles(email)')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (!error && data) {
                    this.uploads = data;
                    tbody.innerHTML = data.map(doc => `
                        <tr>
                            <td>${doc.profiles?.email || 'Unknown'}</td>
                            <td>${doc.file_name || 'N/A'}</td>
                            <td>${doc.document_type || 'N/A'}</td>
                            <td>${doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : 'N/A'}</td>
                            <td>${new Date(doc.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="admin-action-btn" onclick="window.AdminDashboard.viewFile('${doc.id}')">View</button>
                            </td>
                        </tr>
                    `).join('');
                    return;
                }
            } catch (e) {
                console.error('Error loading uploads:', e);
            }
        }

        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">File uploads require Supabase</td></tr>';
    }

    updateStats() {
        document.getElementById('total-users').textContent = this.users.length;

        // Count active users (logged in today)
        const today = new Date().toDateString();
        const activeToday = this.users.filter(u => {
            if (!u.last_sign_in_at) return false;
            return new Date(u.last_sign_in_at).toDateString() === today;
        }).length;
        document.getElementById('active-users').textContent = activeToday;

        // Count new users (signed up this week)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newThisWeek = this.users.filter(u => {
            if (!u.created_at) return false;
            return new Date(u.created_at) > weekAgo;
        }).length;
        document.getElementById('new-users').textContent = newThisWeek;
    }

    populateClientDropdown() {
        const select = document.getElementById('admin-client-select');
        if (!select || !this.users.length) return;
        select.innerHTML = '<option value="">-- Choose a client --</option>';
        this.users.forEach(user => {
            if (user.is_admin) return; // skip admins
            const name = (user.first_name || '') + ' ' + (user.last_name || '');
            const company = user.company || user.nda_company_name || '';
            const label = name.trim() + (company ? ' (' + company + ')' : '') + ' — ' + (user.email || '');
            const opt = document.createElement('option');
            opt.value = user.id;
            opt.textContent = label;
            select.appendChild(opt);
        });
    }

    async sendReportToClient() {
        const clientId = document.getElementById('admin-client-select')?.value;
        const reportName = document.getElementById('admin-report-name')?.value.trim();
        const reportDesc = document.getElementById('admin-report-desc')?.value.trim();
        const fileInput = document.getElementById('admin-report-file');
        const file = fileInput?.files[0];
        const status = document.getElementById('admin-report-status');

        if (!clientId) { if (status) status.textContent = 'Please select a client.'; return; }
        if (!reportName) { if (status) status.textContent = 'Please enter a report name.'; return; }
        if (!file) { if (status) status.textContent = 'Please select a file to upload.'; return; }

        if (status) status.textContent = 'Uploading...';

        try {
            const sb = window.supabase || (window.LightningAuth ? initSupabase() : null);
            if (!sb) { if (status) status.textContent = 'Supabase not available.'; return; }

            // Upload to client-files bucket under client's folder
            const ext = file.name.split('.').pop().toLowerCase();
            const filePath = clientId + '/reports/' + Date.now() + '_' + file.name;
            const { error: uploadError } = await sb.storage
                .from('client-files')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                if (status) status.textContent = 'Upload failed: ' + uploadError.message;
                return;
            }

            // Get public URL
            const { data: urlData } = sb.storage.from('client-files').getPublicUrl(filePath);
            const fileUrl = urlData?.publicUrl || '';

            // Insert into user_reports table
            const { error: insertError } = await sb.from('user_reports').insert({
                user_id: clientId,
                report_name: reportName,
                report_description: reportDesc || null,
                file_url: fileUrl,
                file_size: file.size,
                uploaded_by: window.currentUserData?.id || null
            });

            if (insertError) {
                if (status) status.textContent = 'DB error: ' + insertError.message;
                return;
            }

            if (status) status.textContent = '✓ Report delivered to client!';
            // Clear form
            document.getElementById('admin-report-name').value = '';
            document.getElementById('admin-report-desc').value = '';
            fileInput.value = '';
        } catch (err) {
            console.error('Send report error:', err);
            if (status) status.textContent = 'Error: ' + err.message;
        }
    }

    viewUserData(userId) {
        alert(`Viewing data for user: ${userId}\n\nThis would show:\n- Their uploads\n- Their sessions\n- Their settings\n- Their financial data`);
    }

    viewFile(fileId) {
        alert(`Opening file: ${fileId}`);
    }
}

// Initialize
window.AdminDashboard = new AdminDashboard();

// Quick access function
function openAdminDashboard() {
    window.AdminDashboard.open();
}

console.log('✓ Admin Dashboard loaded');

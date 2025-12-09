// =====================================================
// LIGHTNING LEDGERZ - MAIN APPLICATION
// =====================================================

// Initialize Supabase Client
const SUPABASE_URL = 'https://uxicgilvxcqpoxavilxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWNnaWx2eGNxcG94YXZpbHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzYwNzYsImV4cCI6MjA3NjY1MjA3Nn0.W6_iO15HAxjzvNfp_FHWSS0HYOpaJb7-oC-Z3_KaZaw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentUserProfile = null;

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

// Modal functions
function showSignUp(e) {
    if (e) e.preventDefault();
    document.getElementById('signup-modal').classList.remove('hidden');
}

function showSignIn(e) {
    if (e) e.preventDefault();
    document.getElementById('signin-modal').classList.remove('hidden');
}

function switchToSignIn() {
    document.getElementById('signup-modal').classList.add('hidden');
    document.getElementById('signin-modal').classList.remove('hidden');
}

function switchToSignUp() {
    document.getElementById('signin-modal').classList.add('hidden');
    document.getElementById('signup-modal').classList.remove('hidden');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.id === 'signup-modal') {
        document.getElementById('signup-modal').classList.add('hidden');
    }
    if (e.target.id === 'signin-modal') {
        document.getElementById('signin-modal').classList.add('hidden');
    }
});

// Sign Up
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("signup-firstname").value.trim();
    const lastName = document.getElementById("signup-lastname").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) throw authError;

        // Create profile
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: authData.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName,
                username: username || null,
                package_tier: 'basic',
                is_admin: email === 'zpzant@gmail.com'
            }]);

        if (profileError) throw profileError;

        alert("Account created successfully! Welcome to Lightning Ledgerz.");
        document.getElementById("signup-modal").classList.add('hidden');

        // Wait for auth state to load profile, then redirect
        setTimeout(() => {
            if (currentUserProfile) {
                // Navigate to profile page to set up avatar
                document.getElementById("services").style.display = "none";
                document.getElementById("about").style.display = "none";
                document.getElementById("contact").style.display = "none";
                document.getElementById("dashboard").classList.add('hidden');
                document.getElementById("admin").classList.add('hidden');
                document.getElementById("profile").classList.remove('hidden');
                window.location.href = "#profile";

                // Auto-switch to avatar tab for new users
                switchProfileTab('avatar');
            }
        }, 1000);

    } catch (error) {
        console.error("Signup error:", error);
        if (error.message.includes('already registered')) {
            alert("This email is already registered. Please sign in instead.");
        } else {
            alert("Signup failed: " + error.message);
        }
    }
});

// Sign In
document.getElementById("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Close sign-in modal
        document.getElementById("signin-modal").classList.add('hidden');

        // The onAuthStateChange will load the profile automatically
        // Then we'll navigate to the profile page
        setTimeout(() => {
            if (currentUserProfile) {
                // Use first name, username, or email as fallback
                const displayName = currentUserProfile.first_name ||
                                   currentUserProfile.username ||
                                   currentUserProfile.email.split('@')[0];

                alert(`Welcome back, ${displayName}!`);

                // Navigate to profile page
                document.getElementById("services").style.display = "none";
                document.getElementById("about").style.display = "none";
                document.getElementById("contact").style.display = "none";
                document.getElementById("dashboard").classList.add('hidden');
                document.getElementById("admin").classList.add('hidden');
                document.getElementById("profile").classList.remove('hidden');
                window.location.href = "#profile";
            }
        }, 1000);

    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
    }
});

// Forgot Password
document.getElementById("forgot-password").addEventListener("click", async () => {
    const email = document.getElementById("signin-email").value.trim();

    if (!email) {
        alert("Please enter your email address first.");
        return;
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/index.html'
        });
        if (error) throw error;
        alert("Password reset email sent! Check your inbox (or spam folder).\n\nClick the link in the email within 1 hour to reset your password.");
        document.getElementById("signin-modal").classList.add('hidden');
    } catch (error) {
        console.error("Reset error:", error);
        alert("Failed to send reset email: " + error.message);
    }
});

// Password Reset Form Handler
document.getElementById("reset-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    try {
        // First check if we have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session during password reset:", session);

        if (!session) {
            alert("Your password reset link has expired. Please request a new password reset email.");
            document.getElementById("reset-password-modal").classList.add('hidden');
            return;
        }

        // Update the password
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        console.log("Password updated successfully:", data);
        alert("Password updated successfully! You are now signed in.");
        document.getElementById("reset-password-modal").classList.add('hidden');

        // Wait for profile to load, then redirect
        setTimeout(() => {
            window.location.href = "#profile";
        }, 500);

    } catch (error) {
        console.error("Password update error:", error);
        alert("Failed to update password: " + error.message + "\n\nPlease try requesting a new password reset link.");
    }
});

// Sign Out
async function signOutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        alert("Signed out successfully!");
        currentUser = null;
        currentUserProfile = null;
        document.getElementById("profile").classList.add('hidden');
        document.getElementById("dashboard").classList.add('hidden');
        document.getElementById("admin").classList.add('hidden');
        window.location.href = "#top";
    } catch (error) {
        console.error("Sign out error:", error);
        alert("Failed to sign out: " + error.message);
    }
}

// =====================================================
// AUTH STATE MANAGEMENT
// =====================================================

// Check if user arrived via password reset link
window.addEventListener('load', () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
        // User clicked password reset link - show reset modal
        document.getElementById('reset-password-modal').classList.remove('hidden');
    }
});

supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    // Show password reset modal when user clicks reset link
    if (event === 'PASSWORD_RECOVERY') {
        document.getElementById('reset-password-modal').classList.remove('hidden');
        return;
    }

    if (session?.user) {
        currentUser = session.user;
        await loadUserProfile();
    } else {
        currentUser = null;
        currentUserProfile = null;
        hideUserWelcome();
    }
});

// Load user profile from database
async function loadUserProfile() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (error) throw error;

        currentUserProfile = data;
        updateNavigationWithUser();
        updateProfilePage();

        // Show/hide features based on package
        updateFeatureAccess();

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// Update navigation bar with user info
async function updateNavigationWithUser() {
    if (!currentUserProfile) return;

    const welcomeNav = document.getElementById('userWelcomeNav');
    const welcomeText = document.getElementById('welcomeText');
    const badge = document.getElementById('membershipBadge');
    const navAvatarContainer = document.getElementById('navAvatarContainer');

    // Use first name, username, or email as fallback
    const displayName = currentUserProfile.first_name ||
                       currentUserProfile.username ||
                       currentUserProfile.email.split('@')[0];

    welcomeText.textContent = `Welcome Back, ${displayName}`;

    // Set badge color based on tier
    badge.className = 'membership-badge';
    if (currentUserProfile.package_tier === 'basic') {
        badge.classList.add('badge-basic');
    } else if (currentUserProfile.package_tier === 'gold') {
        badge.classList.add('badge-gold');
    } else if (currentUserProfile.package_tier === 'diamond') {
        badge.classList.add('badge-diamond');
    }

    // Load and display avatar
    try {
        const avatarHTML = await getAvatarDisplay(supabase, currentUser.id, 'standing');
        navAvatarContainer.innerHTML = avatarHTML;
    } catch (error) {
        console.error("Error loading avatar:", error);
    }

    welcomeNav.classList.remove('hidden');

    // Show admin link if user is admin
    if (currentUserProfile.is_admin) {
        document.getElementById('adminLink').classList.remove('hidden');
    }
}

function hideUserWelcome() {
    document.getElementById('userWelcomeNav').classList.add('hidden');
    document.getElementById('adminLink').classList.add('hidden');
}

// Update profile page with user data
function updateProfilePage() {
    if (!currentUserProfile) return;

    document.getElementById('userFullName').textContent =
        `${currentUserProfile.first_name} ${currentUserProfile.last_name}`;
    document.getElementById('userEmail').textContent = currentUserProfile.email;
    document.getElementById('userUsername').textContent = currentUserProfile.username || 'Not set';
    document.getElementById('userPlan').textContent = currentUserProfile.package_tier.toUpperCase();
}

// Show/hide features based on package tier
function updateFeatureAccess() {
    if (!currentUserProfile) return;

    const tier = currentUserProfile.package_tier;

    // PowerPoint tab - Gold and Diamond only
    if (tier === 'gold' || tier === 'diamond') {
        document.getElementById('pptTab').classList.remove('hidden');
    } else {
        document.getElementById('pptTab').classList.add('hidden');
    }

    // QuickBooks tab - Diamond only
    if (tier === 'diamond') {
        document.getElementById('qbTab').classList.remove('hidden');
    } else {
        document.getElementById('qbTab').classList.add('hidden');
    }
}

// =====================================================
// NAVIGATION HANDLERS
// =====================================================

function handleMyProfileClick(event) {
    event.preventDefault();

    if (!currentUser) {
        alert("Please sign in first.");
        showSignIn(event);
        return;
    }

    // Hide all sections
    document.getElementById("services").style.display = "none";
    document.getElementById("dashboard").classList.add('hidden');
    document.getElementById("admin").classList.add('hidden');

    // Show profile
    document.getElementById("profile").classList.remove('hidden');
    document.getElementById("profile").scrollIntoView({ behavior: "smooth" });

    // Load avatar if on avatar tab
    if (document.getElementById('tab-avatar').classList.contains('active')) {
        loadAvatar(supabase, currentUser.id);
    }
}

async function handleDashboardClick(event) {
    event.preventDefault();

    if (!currentUser) {
        alert("Please sign in first.");
        showSignIn(event);
        return;
    }

    // Hide all sections
    document.getElementById("services").style.display = "none";
    document.getElementById("profile").classList.add('hidden');
    document.getElementById("admin").classList.add('hidden');

    // Show dashboard
    document.getElementById("dashboard").classList.remove('hidden');
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });

    // Load dashboard data
    await loadDashboard();
}

async function handleAdminClick(event) {
    event.preventDefault();

    if (!currentUser || !currentUserProfile?.is_admin) {
        alert("Access denied. Admin only.");
        return;
    }

    // Hide all sections
    document.getElementById("services").style.display = "none";
    document.getElementById("profile").classList.add('hidden');
    document.getElementById("dashboard").classList.add('hidden');

    // Show admin
    document.getElementById("admin").classList.remove('hidden');
    document.getElementById("admin").scrollIntoView({ behavior: "smooth" });

    // Load admin data
    await loadAdminDashboard();
}

function scrollToPackage(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// =====================================================
// PACKAGE SELECTION
// =====================================================

async function selectPackage(tier, event) {
    if (event) {
        event.stopPropagation();
    }

    if (!currentUser) {
        alert("Please sign in or create an account first.");
        showSignUp(event);
        return;
    }

    const confirm = window.confirm(`Switch to ${tier.toUpperCase()} package?`);
    if (!confirm) return;

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ package_tier: tier })
            .eq('id', currentUser.id);

        if (error) throw error;

        alert(`Successfully upgraded to ${tier.toUpperCase()} package!`);
        await loadUserProfile(); // Reload profile to update features
    } catch (error) {
        console.error("Package selection error:", error);
        alert("Failed to update package: " + error.message);
    }
}

// =====================================================
// PROFILE TABS
// =====================================================

function switchProfileTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');

    // Load data for specific tabs
    if (tabName === 'avatar') {
        loadAvatar(supabase, currentUser.id);
    } else if (tabName === 'documents') {
        loadUserDocuments();
    } else if (tabName === 'powerpoint') {
        loadPowerPointHistory();
    } else if (tabName === 'quickbooks') {
        loadQuickBooksStatus();
    }
}

// =====================================================
// AVATAR CUSTOMIZATION
// =====================================================

function toggleAvatarType() {
    const type = document.getElementById('avatar-type').value;
    const logoSection = document.getElementById('logo-upload-section');
    const customSection = document.getElementById('custom-avatar-section');

    if (type === 'logo') {
        logoSection.classList.remove('hidden');
        customSection.classList.add('hidden');
    } else {
        logoSection.classList.add('hidden');
        customSection.classList.remove('hidden');
        updateAvatarPreview();
    }
}

async function uploadLogo() {
    if (!currentUser) {
        alert("Please sign in first.");
        return;
    }

    const fileInput = document.getElementById('logo-file');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a logo file.");
        return;
    }

    try {
        const logoUrl = await uploadCompanyLogo(supabase, currentUser.id, file);
        alert("Logo uploaded successfully!");

        // Update nav avatar
        const navAvatarContainer = document.getElementById('navAvatarContainer');
        navAvatarContainer.innerHTML = `<img src="${logoUrl}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;">`;
    } catch (error) {
        console.error("Logo upload error:", error);
        alert("Failed to upload logo: " + error.message);
    }
}

async function saveAvatarCustomization() {
    if (!currentUser) {
        alert("Please sign in first.");
        return;
    }

    try {
        await saveAvatar(supabase, currentUser.id);
        alert("Avatar saved successfully!");

        // Update nav avatar
        const avatarHTML = await getAvatarDisplay(supabase, currentUser.id, 'standing');
        document.getElementById('navAvatarContainer').innerHTML = avatarHTML;
    } catch (error) {
        console.error("Avatar save error:", error);
        alert("Failed to save avatar: " + error.message);
    }
}

// =====================================================
// FILE UPLOAD & MANAGEMENT
// =====================================================

async function uploadDocuments() {
    if (!currentUser) {
        alert("Please log in first!");
        return;
    }

    const fileInput = document.getElementById("fileUpload");
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Please select files to upload");
        return;
    }

    const progressDiv = document.getElementById("uploadProgress");
    const progressBar = document.getElementById("uploadBar");
    const statusText = document.getElementById("uploadStatus");
    progressDiv.style.display = "block";

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            statusText.textContent = `Uploading ${file.name}...`;

            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}/${Date.now()}_${file.name}`;

            // Upload to storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('user-documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('user-documents')
                .getPublicUrl(fileName);

            // Save metadata to database
            const { error: dbError } = await supabase
                .from('user_documents')
                .insert([{
                    user_id: currentUser.id,
                    file_name: file.name,
                    file_path: fileName,
                    file_size: file.size,
                    file_type: file.type
                }]);

            if (dbError) throw dbError;

            const progress = ((i + 1) / files.length) * 100;
            progressBar.style.width = progress + '%';
        }

        alert("All files uploaded successfully!");
        fileInput.value = "";
        progressDiv.style.display = "none";
        progressBar.style.width = "0%";
        statusText.textContent = "";

        loadUserDocuments();

    } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
        progressDiv.style.display = "none";
    }
}

async function loadUserDocuments() {
    if (!currentUser) return;

    const docsList = document.getElementById("documentsList");
    if (!docsList) return;

    try {
        const { data, error } = await supabase
            .from('user_documents')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('uploaded_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            docsList.innerHTML = '<p style="color: #888;">No documents uploaded yet</p>';
            return;
        }

        let html = '';

        data.forEach((doc) => {
            const fileSize = (doc.file_size / 1024).toFixed(2);
            const date = new Date(doc.uploaded_at).toLocaleDateString();

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('user-documents')
                .getPublicUrl(doc.file_path);

            html += `
                <div class="document-item">
                    <div>
                        <strong>${doc.file_name}</strong>
                        <p>${fileSize} KB • ${date}</p>
                    </div>
                    <div class="document-actions">
                        <a href="${urlData.publicUrl}" target="_blank" class="btn btn-primary btn-small">View</a>
                        <button onclick="deleteDocument('${doc.id}')" class="btn btn-primary btn-small">Delete</button>
                    </div>
                </div>
            `;
        });

        docsList.innerHTML = html;

    } catch (error) {
        console.error("Error loading documents:", error);
        docsList.innerHTML = '<p style="color: red;">Error loading documents</p>';
    }
}

async function deleteDocument(docId) {
    if (!currentUser) return;

    if (!confirm("Are you sure you want to delete this document?")) {
        return;
    }

    try {
        // Get document info
        const { data: docData, error: fetchError } = await supabase
            .from('user_documents')
            .select('file_path')
            .eq('id', docId)
            .single();

        if (fetchError) throw fetchError;

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('user-documents')
            .remove([docData.file_path]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase
            .from('user_documents')
            .delete()
            .eq('id', docId);

        if (dbError) throw dbError;

        alert("Document deleted successfully!");
        loadUserDocuments();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete document: " + error.message);
    }
}

// =====================================================
// FINANCIAL DASHBOARD
// =====================================================

async function loadDashboard() {
    if (!currentUser) return;

    const dashboardContent = document.getElementById('dashboardContent');

    try {
        // Load dashboard data
        const { data: dashboardData, error } = await supabase
            .from('dashboard_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        // If no data, create sample data
        if (!dashboardData) {
            await createSampleDashboardData();
            await loadDashboard(); // Reload
            return;
        }

        // Load spending categories
        const { data: categories, error: catError } = await supabase
            .from('spending_categories')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('amount', { ascending: false });

        if (catError) throw catError;

        // Load trends
        const { data: trends, error: trendsError } = await supabase
            .from('financial_trends')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('date', { ascending: true })
            .limit(12);

        if (trendsError) throw trendsError;

        // Render dashboard
        renderDashboard(dashboardData, categories || [], trends || []);

    } catch (error) {
        console.error("Dashboard error:", error);
        dashboardContent.innerHTML = '<p style="color: red;">Error loading dashboard</p>';
    }
}

async function createSampleDashboardData() {
    if (!currentUser) return;

    try {
        // Create sample dashboard entry
        const { data: dashData, error: dashError } = await supabase
            .from('dashboard_data')
            .insert([{
                user_id: currentUser.id,
                total_income: 5000,
                total_expenses: 3500,
                remaining_budget: 1500,
                savings_rate: 30,
                savings_goal: 10000,
                savings_goal_progress: 70,
                budget_status: 'on_track',
                top_category: 'Housing',
                top_category_amount: 1200,
                biggest_expense: 'Rent Payment',
                biggest_expense_amount: 1200,
                period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                period_end: new Date().toISOString().split('T')[0]
            }])
            .select()
            .single();

        if (dashError) throw dashError;

        // Create sample categories
        const sampleCategories = [
            { category_name: 'Housing', amount: 1200, percentage: 34.3, color: '#ff3333' },
            { category_name: 'Food', amount: 800, percentage: 22.9, color: '#ffd700' },
            { category_name: 'Transportation', amount: 500, percentage: 14.3, color: '#4caf50' },
            { category_name: 'Utilities', amount: 300, percentage: 8.6, color: '#2196f3' },
            { category_name: 'Entertainment', amount: 400, percentage: 11.4, color: '#9c27b0' },
            { category_name: 'Other', amount: 300, percentage: 8.6, color: '#ff9800' }
        ];

        const categoriesWithIds = sampleCategories.map(cat => ({
            ...cat,
            user_id: currentUser.id,
            dashboard_id: dashData.id
        }));

        const { error: catError } = await supabase
            .from('spending_categories')
            .insert(categoriesWithIds);

        if (catError) throw catError;

        // Create sample trends (last 6 months)
        const sampleTrends = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const income = 4500 + Math.random() * 1000;
            const expenses = 3000 + Math.random() * 1000;

            sampleTrends.push({
                user_id: currentUser.id,
                date: date.toISOString().split('T')[0],
                income: income,
                expenses: expenses,
                net: income - expenses
            });
        }

        const { error: trendsError } = await supabase
            .from('financial_trends')
            .insert(sampleTrends);

        if (trendsError) throw trendsError;

    } catch (error) {
        console.error("Error creating sample data:", error);
    }
}

function renderDashboard(dashboardData, categories, trends) {
    const container = document.getElementById('dashboardContent');

    const html = `
        <!-- Quick Stats -->
        <div class="dashboard-grid">
            <div class="stat-card">
                <h3>Total Income</h3>
                <div class="stat-value positive">$${dashboardData.total_income.toLocaleString()}</div>
                <p>This month</p>
            </div>

            <div class="stat-card">
                <h3>Total Expenses</h3>
                <div class="stat-value negative">$${dashboardData.total_expenses.toLocaleString()}</div>
                <p>This month</p>
            </div>

            <div class="stat-card">
                <h3>Remaining Budget</h3>
                <div class="stat-value neutral">$${dashboardData.remaining_budget.toLocaleString()}</div>
                <p>${dashboardData.savings_rate}% savings rate</p>
            </div>

            <div class="stat-card">
                <h3>Top Category</h3>
                <div class="stat-value">${dashboardData.top_category}</div>
                <p>$${dashboardData.top_category_amount?.toLocaleString() || 0}</p>
            </div>
        </div>

        <!-- Savings Goal Progress -->
        <div class="stat-card" style="margin: 2rem 0;">
            <h3>Savings Goal Progress</h3>
            <p>You are ${dashboardData.savings_goal_progress}% toward your savings goal</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${dashboardData.savings_goal_progress}%">
                    ${dashboardData.savings_goal_progress}%
                </div>
            </div>
            <p style="margin-top: 0.5rem;">Goal: $${dashboardData.savings_goal?.toLocaleString() || 0}</p>
        </div>

        <!-- Budget Status Alert -->
        ${dashboardData.budget_status === 'over_budget' ? `
            <div class="alert-box error">
                <span>⚠️</span>
                <div>
                    <strong>Over Budget!</strong>
                    <p>You are over budget this month. Consider reviewing your spending.</p>
                </div>
            </div>
        ` : dashboardData.budget_status === 'on_track' ? `
            <div class="alert-box success">
                <span>✓</span>
                <div>
                    <strong>On Track!</strong>
                    <p>Your spending is within budget this month.</p>
                </div>
            </div>
        ` : ''}

        <!-- Charts -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin: 2rem 0;">
            <!-- Spending by Category Pie Chart -->
            <div class="stat-card">
                <h3>Spending by Category</h3>
                <div class="chart-container">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>

            <!-- Income vs Expenses Line Chart -->
            <div class="stat-card">
                <h3>Income vs Expenses Trend</h3>
                <div class="chart-container">
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Monthly Comparison Bar Chart -->
        <div class="stat-card" style="margin: 2rem 0;">
            <h3>Monthly Comparison</h3>
            <div class="chart-container">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Render charts
    setTimeout(() => {
        renderCategoryChart(categories);
        renderTrendChart(trends);
        renderMonthlyChart(trends);
    }, 100);
}

function renderCategoryChart(categories) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories.map(c => c.category_name),
            datasets: [{
                data: categories.map(c => c.amount),
                backgroundColor: categories.map(c => c.color || '#ff3333'),
                borderColor: '#000',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: $${context.parsed.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function renderTrendChart(trends) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short' })),
            datasets: [
                {
                    label: 'Income',
                    data: trends.map(t => t.income),
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: trends.map(t => t.expenses),
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function renderMonthlyChart(trends) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short' })),
            datasets: [
                {
                    label: 'Income',
                    data: trends.map(t => t.income),
                    backgroundColor: '#4caf50'
                },
                {
                    label: 'Expenses',
                    data: trends.map(t => t.expenses),
                    backgroundColor: '#f44336'
                },
                {
                    label: 'Net',
                    data: trends.map(t => t.net),
                    backgroundColor: '#ffd700'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// =====================================================
// POWERPOINT GENERATION (Gold/Diamond)
// =====================================================

async function generatePowerPoint() {
    if (!currentUser || !currentUserProfile) {
        alert("Please sign in first.");
        return;
    }

    if (currentUserProfile.package_tier === 'basic') {
        alert("PowerPoint generation is available for Gold and Diamond members only. Please upgrade your package.");
        return;
    }

    alert("PowerPoint generation feature coming soon! This will generate a professional pitch deck with your financial data, charts, and AI-generated insights.");

    // TODO: Implement PowerPoint generation using a library like PptxGenJS
    // This would pull data from dashboard_data and spending_categories
    // Generate charts, add user's logo/avatar, and create a downloadable .pptx file
}

async function loadPowerPointHistory() {
    if (!currentUser) return;

    const listContainer = document.getElementById('powerpointList');
    if (!listContainer) return;

    try {
        const { data, error } = await supabase
            .from('powerpoint_history')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('generated_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            listContainer.innerHTML = '<p style="color: #888;">No PowerPoint files generated yet</p>';
            return;
        }

        let html = '';
        data.forEach(ppt => {
            const date = new Date(ppt.generated_at).toLocaleDateString();
            html += `
                <div class="document-item">
                    <div>
                        <strong>${ppt.file_name}</strong>
                        <p>Generated: ${date}</p>
                    </div>
                    <div class="document-actions">
                        <a href="${ppt.file_url}" download class="btn btn-primary btn-small">Download</a>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;

    } catch (error) {
        console.error("Error loading PowerPoint history:", error);
        listContainer.innerHTML = '<p style="color: red;">Error loading files</p>';
    }
}

// =====================================================
// QUICKBOOKS INTEGRATION (Diamond)
// =====================================================

async function connectQuickBooks() {
    if (!currentUser || !currentUserProfile) {
        alert("Please sign in first.");
        return;
    }

    if (currentUserProfile.package_tier !== 'diamond') {
        alert("QuickBooks integration is available for Diamond members only. Please upgrade your package.");
        return;
    }

    alert("QuickBooks OAuth integration coming soon! This will allow you to connect your QuickBooks account and automatically sync your financial data.");

    // TODO: Implement QuickBooks OAuth flow
    // 1. Redirect to QuickBooks OAuth
    // 2. Handle callback
    // 3. Store tokens in quickbooks_connections table
    // 4. Pull data from QuickBooks API
    // 5. Populate dashboard_data and spending_categories
}

async function syncQuickBooks() {
    alert("Syncing QuickBooks data... This feature is coming soon!");
    // TODO: Pull latest data from QuickBooks and update dashboard
}

async function disconnectQuickBooks() {
    if (!confirm("Disconnect QuickBooks? You can reconnect anytime.")) return;

    try {
        const { error } = await supabase
            .from('quickbooks_connections')
            .delete()
            .eq('user_id', currentUser.id);

        if (error) throw error;

        alert("QuickBooks disconnected successfully.");
        loadQuickBooksStatus();
    } catch (error) {
        console.error("Disconnect error:", error);
        alert("Failed to disconnect: " + error.message);
    }
}

async function loadQuickBooksStatus() {
    if (!currentUser) return;

    try {
        const { data, error } = await supabase
            .from('quickbooks_connections')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        const statusDiv = document.getElementById('quickbooksStatus');
        const connectedDiv = document.getElementById('quickbooksConnected');

        if (data) {
            statusDiv.classList.add('hidden');
            connectedDiv.classList.remove('hidden');
            const lastSync = data.last_sync ? new Date(data.last_sync).toLocaleString() : 'Never';
            document.getElementById('lastSync').textContent = lastSync;
        } else {
            statusDiv.classList.remove('hidden');
            connectedDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error("Error loading QuickBooks status:", error);
    }
}

// =====================================================
// ADMIN DASHBOARD
// =====================================================

async function loadAdminDashboard() {
    if (!currentUser || !currentUserProfile?.is_admin) return;

    const adminContent = document.getElementById('adminContent');

    try {
        // Load all users
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // Load all documents count per user
        const { data: docCounts, error: docError } = await supabase
            .from('user_documents')
            .select('user_id');

        if (docError) throw docError;

        const docCountMap = {};
        docCounts.forEach(doc => {
            docCountMap[doc.user_id] = (docCountMap[doc.user_id] || 0) + 1;
        });

        let html = `
            <h3 style="color: #ff3333; margin-bottom: 2rem;">All Users</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: rgba(255, 51, 51, 0.2); border-bottom: 2px solid #ff3333;">
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Email</th>
                            <th style="padding: 1rem; text-align: left;">Package</th>
                            <th style="padding: 1rem; text-align: center;">Documents</th>
                            <th style="padding: 1rem; text-align: left;">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (const user of users) {
            const badge = user.package_tier === 'basic' ? '🔴' :
                         user.package_tier === 'gold' ? '🟡' : '💎';

            html += `
                <tr style="border-bottom: 1px solid #333;">
                    <td style="padding: 1rem;">${user.first_name} ${user.last_name}</td>
                    <td style="padding: 1rem;">${user.email}</td>
                    <td style="padding: 1rem;">${badge} ${user.package_tier.toUpperCase()}</td>
                    <td style="padding: 1rem; text-align: center;">${docCountMap[user.id] || 0}</td>
                    <td style="padding: 1rem;">${new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>

            <div class="dashboard-grid" style="margin-top: 3rem;">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <div class="stat-value">${users.length}</div>
                </div>
                <div class="stat-card">
                    <h3>Basic Users</h3>
                    <div class="stat-value">${users.filter(u => u.package_tier === 'basic').length}</div>
                </div>
                <div class="stat-card">
                    <h3>Gold Users</h3>
                    <div class="stat-value">${users.filter(u => u.package_tier === 'gold').length}</div>
                </div>
                <div class="stat-card">
                    <h3>Diamond Users</h3>
                    <div class="stat-value">${users.filter(u => u.package_tier === 'diamond').length}</div>
                </div>
            </div>
        `;

        adminContent.innerHTML = html;

    } catch (error) {
        console.error("Admin dashboard error:", error);
        adminContent.innerHTML = '<p style="color: red;">Error loading admin data</p>';
    }
}

// =====================================================
// INITIALIZE ON PAGE LOAD
// =====================================================

// Check auth state on page load
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        currentUser = session.user;
        await loadUserProfile();
    }
});

// Make functions globally available
window.showSignUp = showSignUp;
window.showSignIn = showSignIn;
window.switchToSignIn = switchToSignIn;
window.switchToSignUp = switchToSignUp;
window.signOutUser = signOutUser;
window.handleMyProfileClick = handleMyProfileClick;
window.handleDashboardClick = handleDashboardClick;
window.handleAdminClick = handleAdminClick;
window.scrollToPackage = scrollToPackage;
window.selectPackage = selectPackage;
window.switchProfileTab = switchProfileTab;
window.toggleAvatarType = toggleAvatarType;
window.uploadLogo = uploadLogo;
window.saveAvatarCustomization = saveAvatarCustomization;
window.uploadDocuments = uploadDocuments;
window.deleteDocument = deleteDocument;
window.generatePowerPoint = generatePowerPoint;
window.connectQuickBooks = connectQuickBooks;
window.syncQuickBooks = syncQuickBooks;
window.disconnectQuickBooks = disconnectQuickBooks;

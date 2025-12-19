// =====================================================
// LIGHTNING LEDGERZ - MAIN APPLICATION
// =====================================================

console.log('%c⚡ Lightning Ledgerz App Loading...', 'color: #ff3333; font-size: 14px; font-weight: bold;');

// =====================================================
// MODAL FUNCTIONS - Define first so UI always works
// =====================================================

function showSignUp(e) {
    console.log('showSignUp called');  // Debug log
    if (e) e.preventDefault();
    const modal = document.getElementById('signup-modal');
    console.log('signup-modal element:', modal);
    if (modal) {
        modal.classList.remove('hidden');
        console.log('signup-modal shown, classes now:', modal.className);
    } else {
        console.error('signup-modal not found');
    }
}

function showSignIn(e) {
    console.log('showSignIn called');  // Debug log
    if (e) e.preventDefault();
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log('signin-modal shown');
    } else {
        console.error('signin-modal not found');
    }
}

// Export modal functions immediately so buttons work even if Supabase fails
window.showSignUp = showSignUp;
window.showSignIn = showSignIn;
console.log('✓ showSignUp and showSignIn exported to window');

// Hide modal functions
function hideSignUp() {
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.classList.add('hidden');
        console.log('signup-modal hidden');
    }
}

function hideSignIn() {
    const modal = document.getElementById('signin-modal');
    if (modal) {
        modal.classList.add('hidden');
        console.log('signin-modal hidden');
    }
}

window.hideSignUp = hideSignUp;
window.hideSignIn = hideSignIn;
console.log('✓ hideSignUp and hideSignIn exported to window');

// Upload Modal function (defined later, but exported early for robustness)
function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('active');
    }
    // Setup drag and drop if not already set up
    if (typeof setupDropzone === 'function') {
        setupDropzone();
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

window.showUploadModal = showUploadModal;
window.closeUploadModal = closeUploadModal;

// Navigation functions - defined early so they work even if later code fails
function handleMyProfileClick(event) {
    if (event) event.preventDefault();

    if (!window.currentUser) {
        alert("Please sign in first.");
        showSignIn(event);
        return;
    }

    // Hide all sections
    const services = document.getElementById("services");
    const dashboard = document.getElementById("dashboard");
    const admin = document.getElementById("admin");
    const profile = document.getElementById("profile");

    if (services) services.style.display = "none";
    if (dashboard) dashboard.classList.add('hidden');
    if (admin) admin.classList.add('hidden');
    if (profile) {
        profile.classList.remove('hidden');
        profile.scrollIntoView({ behavior: "smooth" });
    }
}

function previewFeatures(event) {
    if (event) event.preventDefault();

    // Set up demo user and profile for full preview
    window.currentUser = { id: 'demo-user-001', email: 'demo@lightningledgerz.com' };
    window.currentUserProfile = {
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@lightningledgerz.com',
        username: 'demo_user',
        package_tier: 'diamond',
        is_admin: false,
        company_name: 'Demo Company Inc.'
    };

    // Update profile page with demo data
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const userUsername = document.getElementById('userUsername');
    const userPlan = document.getElementById('userPlan');

    if (userFullName) userFullName.textContent = 'Demo User';
    if (userEmail) userEmail.textContent = 'demo@lightningledgerz.com';
    if (userUsername) userUsername.textContent = 'demo_user';
    if (userPlan) userPlan.textContent = 'DIAMOND (Preview)';

    // Show all tabs for preview
    const pptTab = document.getElementById('pptTab');
    const qbTab = document.getElementById('qbTab');
    if (pptTab) pptTab.classList.remove('hidden');
    if (qbTab) qbTab.classList.remove('hidden');

    // Show user welcome in nav
    const welcomeNav = document.getElementById('userWelcomeNav');
    const welcomeText = document.getElementById('welcomeText');
    const navSignUpBtn = document.getElementById('navSignUpBtn');
    if (welcomeNav) welcomeNav.classList.remove('hidden');
    if (welcomeText) welcomeText.textContent = 'Hi, Demo!';
    if (navSignUpBtn) navSignUpBtn.style.display = 'none';

    // Show logout in dropdown
    const dropdownLogout = document.getElementById('dropdownLogout');
    if (dropdownLogout) dropdownLogout.classList.remove('hidden');

    // Hide signup/signin from dropdown since "logged in"
    const dropdownSignUp = document.getElementById('dropdownSignUp');
    const dropdownSignIn = document.getElementById('dropdownSignIn');
    if (dropdownSignUp) dropdownSignUp.classList.add('hidden');
    if (dropdownSignIn) dropdownSignIn.classList.add('hidden');

    // Navigate to profile
    const services = document.getElementById("services");
    const about = document.getElementById("about");
    const contact = document.getElementById("contact");
    const dashboard = document.getElementById("dashboard");
    const admin = document.getElementById("admin");
    const profile = document.getElementById("profile");

    if (services) services.style.display = "none";
    if (about) about.style.display = "none";
    if (contact) contact.style.display = "none";
    if (dashboard) dashboard.classList.add('hidden');
    if (admin) admin.classList.add('hidden');
    if (profile) profile.classList.remove('hidden');

    window.location.href = "#profile";

    // Initialize avatar preview
    if (typeof updateAvatarPreview === 'function') {
        updateAvatarPreview();
    }

    // Show demo documents
    const documentsList = document.getElementById('documentsList');
    if (documentsList) {
        documentsList.innerHTML = `
            <div class="document-item">
                <div>
                    <strong>Q4_Budget_Report.pdf</strong>
                    <p>PDF - 2.4 MB - Uploaded: Dec 15, 2024</p>
                </div>
                <div class="document-actions">
                    <button class="btn btn-small btn-primary" onclick="viewDemoReport('budget')">View</button>
                </div>
            </div>
            <div class="document-item">
                <div>
                    <strong>Annual_Financials_2024.xlsx</strong>
                    <p>Excel - 856 KB - Uploaded: Dec 10, 2024</p>
                </div>
                <div class="document-actions">
                    <button class="btn btn-small btn-primary" onclick="viewDemoReport('financials')">View</button>
                </div>
            </div>
            <div class="document-item">
                <div>
                    <strong>Investor_Deck_Q4.pptx</strong>
                    <p>PowerPoint - 4.2 MB - Uploaded: Dec 8, 2024</p>
                </div>
                <div class="document-actions">
                    <button class="btn btn-small btn-primary" onclick="viewDemoReport('presentation')">View</button>
                </div>
            </div>
        `;
    }

    // Load demo PowerPoint history
    loadDemoPowerPointHistory();

    alert('🎉 Demo Mode Active!\n\nYou now have full Diamond-tier access to explore all features.\n\nTry: Pro Decks, QuickBooks, Reports, and more!\n\nNote: Data won\'t be saved - sign up to keep your work!');
}

// Demo report viewer
function viewDemoReport(type) {
    let title, content;
    switch(type) {
        case 'budget':
            title = 'Q4 Budget Report';
            content = generateDemoBudgetHTML();
            break;
        case 'financials':
            title = 'Annual Financials 2024';
            content = generateDemoFinancialsHTML();
            break;
        case 'presentation':
            title = 'Investor Deck Q4';
            content = generateDemoPresentationHTML();
            break;
        default:
            title = 'Demo Document';
            content = '<p>Document preview not available.</p>';
    }
    showDemoModal(title, content);
}

function showDemoModal(title, content) {
    // Remove existing modal if any
    const existing = document.getElementById('demo-report-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'demo-report-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 10000; display: flex;
        justify-content: center; align-items: center; padding: 20px;
    `;
    modal.innerHTML = `
        <div style="background: #111; border: 2px solid #ff3333; border-radius: 15px;
                    max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #ff3333; margin: 0;">${title}</h2>
                <button onclick="document.getElementById('demo-report-modal').remove()"
                        style="background: none; border: none; color: #ff3333; font-size: 30px; cursor: pointer;">&times;</button>
            </div>
            <div style="color: #fff;">${content}</div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function generateDemoBudgetHTML() {
    return `
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #ffd700; margin-top: 0;">Executive Summary</h3>
            <p>Q4 2024 demonstrates strong fiscal performance with revenue exceeding projections by 12.3%.</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
                <div style="background: rgba(255,51,51,0.2); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; color: #ff3333; font-weight: bold;">$2.4M</div>
                    <div style="color: #888;">Total Revenue</div>
                </div>
                <div style="background: rgba(0,255,136,0.2); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; color: #00ff88; font-weight: bold;">+18.5%</div>
                    <div style="color: #888;">YoY Growth</div>
                </div>
                <div style="background: rgba(255,215,0,0.2); padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; color: #ffd700; font-weight: bold;">$890K</div>
                    <div style="color: #888;">Net Profit</div>
                </div>
            </div>
        </div>
        <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
            <h4 style="color: #fff;">Budget vs Actual Analysis</h4>
            <table style="width: 100%; border-collapse: collapse; color: #fff;">
                <tr style="border-bottom: 1px solid #333;">
                    <th style="text-align: left; padding: 10px;">Category</th>
                    <th style="text-align: right; padding: 10px;">Budget</th>
                    <th style="text-align: right; padding: 10px;">Actual</th>
                    <th style="text-align: right; padding: 10px;">Variance</th>
                </tr>
                <tr><td style="padding: 10px;">Sales Revenue</td><td style="text-align: right;">$2,100,000</td><td style="text-align: right; color: #00ff88;">$2,358,450</td><td style="text-align: right; color: #00ff88;">+12.3%</td></tr>
                <tr><td style="padding: 10px;">Operating Expenses</td><td style="text-align: right;">$980,000</td><td style="text-align: right; color: #00ff88;">$945,200</td><td style="text-align: right; color: #00ff88;">-3.6%</td></tr>
                <tr><td style="padding: 10px;">Marketing</td><td style="text-align: right;">$250,000</td><td style="text-align: right;">$267,800</td><td style="text-align: right; color: #ff6666;">+7.1%</td></tr>
                <tr><td style="padding: 10px;">R&D</td><td style="text-align: right;">$180,000</td><td style="text-align: right; color: #00ff88;">$172,400</td><td style="text-align: right; color: #00ff88;">-4.2%</td></tr>
            </table>
        </div>
    `;
}

function generateDemoFinancialsHTML() {
    return `
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #ffd700; margin-top: 0;">Annual Financial Statement 2024</h3>
            <p style="color: #aaa;">Comprehensive financial overview following GAAP standards</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                <h4 style="color: #ff3333;">Income Statement</h4>
                <div style="color: #fff; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Gross Revenue</span><span>$9,245,000</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Cost of Goods Sold</span><span style="color: #ff6666;">($3,698,000)</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span><strong>Gross Profit</strong></span><span style="color: #00ff88;"><strong>$5,547,000</strong></span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Operating Expenses</span><span style="color: #ff6666;">($2,890,000)</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px;"><span><strong>Net Income</strong></span><span style="color: #ffd700;"><strong>$2,657,000</strong></span></div>
                </div>
            </div>
            <div style="background: #1a1a2e; padding: 20px; border-radius: 10px;">
                <h4 style="color: #ff3333;">Balance Sheet Highlights</h4>
                <div style="color: #fff; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Total Assets</span><span>$15,890,000</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Total Liabilities</span><span>$4,230,000</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span><strong>Shareholders' Equity</strong></span><span style="color: #00ff88;"><strong>$11,660,000</strong></span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333;"><span>Current Ratio</span><span>2.4x</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0;"><span>Debt-to-Equity</span><span>0.36x</span></div>
                </div>
            </div>
        </div>
    `;
}

function generateDemoPresentationHTML() {
    return `
        <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <div style="font-size: 14px; color: #ffd700; margin-bottom: 10px;">INVESTOR PRESENTATION</div>
            <h2 style="color: #fff; font-size: 32px; margin: 0;">Q4 2024 Quarterly Review</h2>
            <p style="color: #888; margin-top: 10px;">Demo Company Inc. | December 2024</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; border-left: 4px solid #ff3333;">
                <h4 style="color: #ff3333; margin-top: 0;">Key Highlights</h4>
                <ul style="color: #fff; padding-left: 20px;">
                    <li>Revenue growth exceeded forecast by 12%</li>
                    <li>Customer acquisition up 34% YoY</li>
                    <li>Operating margin improved to 28.7%</li>
                    <li>New market expansion in EMEA region</li>
                </ul>
            </div>
            <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; border-left: 4px solid #ffd700;">
                <h4 style="color: #ffd700; margin-top: 0;">Strategic Priorities</h4>
                <ul style="color: #fff; padding-left: 20px;">
                    <li>Scale enterprise sales team</li>
                    <li>Launch AI-powered analytics suite</li>
                    <li>Expand partnership ecosystem</li>
                    <li>Achieve SOC 2 Type II certification</li>
                </ul>
            </div>
            <div style="background: #1a1a2e; padding: 20px; border-radius: 10px; border-left: 4px solid #00ff88; grid-column: span 2;">
                <h4 style="color: #00ff88; margin-top: 0;">Financial Outlook 2025</h4>
                <div style="display: flex; justify-content: space-around; text-align: center; margin-top: 15px;">
                    <div><div style="font-size: 24px; color: #fff;">$12.5M</div><div style="color: #888;">Revenue Target</div></div>
                    <div><div style="font-size: 24px; color: #fff;">35%</div><div style="color: #888;">Growth Rate</div></div>
                    <div><div style="font-size: 24px; color: #fff;">32%</div><div style="color: #888;">Target Margin</div></div>
                </div>
            </div>
        </div>
        <p style="text-align: center; color: #666; margin-top: 20px; font-size: 12px;">
            Generated with Lightning Ledgerz Pro Decks | McKinsey-style formatting
        </p>
    `;
}

// Load demo PowerPoint history
function loadDemoPowerPointHistory() {
    const listContainer = document.getElementById('powerpointList');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="ppt-history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,51,51,0.1); border-radius: 8px; margin-bottom: 10px;">
            <div>
                <strong style="color: #fff;">Investor Update Q4 2024</strong>
                <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">Executive Summary • Generated: Dec 15, 2024</p>
            </div>
            <button onclick="viewDemoReport('presentation')" style="background: linear-gradient(45deg, #ff3333, #ff6666); border: none; padding: 8px 16px; border-radius: 5px; color: #fff; cursor: pointer;">View</button>
        </div>
        <div class="ppt-history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 8px; margin-bottom: 10px;">
            <div>
                <strong style="color: #fff;">Board Meeting Deck</strong>
                <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">Detailed Analysis • Generated: Dec 10, 2024</p>
            </div>
            <button onclick="viewDemoReport('presentation')" style="background: linear-gradient(45deg, #ffd700, #ffed4e); border: none; padding: 8px 16px; border-radius: 5px; color: #333; cursor: pointer;">View</button>
        </div>
        <div class="ppt-history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0,255,136,0.1); border-radius: 8px;">
            <div>
                <strong style="color: #fff;">Annual Financial Review</strong>
                <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">KPI Dashboard • Generated: Dec 1, 2024</p>
            </div>
            <button onclick="viewDemoReport('financials')" style="background: linear-gradient(45deg, #00ff88, #00cc6a); border: none; padding: 8px 16px; border-radius: 5px; color: #111; cursor: pointer;">View</button>
        </div>
    `;
}

window.viewDemoReport = viewDemoReport;
window.showDemoModal = showDemoModal;

window.handleMyProfileClick = handleMyProfileClick;
window.previewFeatures = previewFeatures;
console.log('✓ handleMyProfileClick and previewFeatures exported to window');

// =====================================================
// SUPABASE INITIALIZATION (with error handling)
// =====================================================

const SUPABASE_URL = 'https://uxicgilvxcqpoxavilxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWNnaWx2eGNxcG94YXZpbHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzYwNzYsImV4cCI6MjA3NjY1MjA3Nn0.W6_iO15HAxjzvNfp_FHWSS0HYOpaJb7-oC-Z3_KaZaw';

let supabase = null;
let currentUser = null;
let currentUserProfile = null;

// Initialize Supabase with error handling
try {
    if (window.supabase && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
    } else {
        console.error('Supabase library not loaded - authentication features will not work');
    }
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
}

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

function switchToSignIn() {
    document.getElementById('signup-modal').classList.add('hidden');
    document.getElementById('signin-modal').classList.remove('hidden');
}

function switchToSignUp() {
    document.getElementById('signin-modal').classList.add('hidden');
    document.getElementById('signup-modal').classList.remove('hidden');
}

// Google Sign In
async function signInWithGoogle() {
    try {
        // Check if Supabase is initialized
        if (!supabase) {
            alert("Authentication service not available. Please refresh the page and try again.");
            return;
        }

        // Hide any open modals
        hideSignIn();
        hideSignUp();

        // Get the correct redirect URL - use origin without trailing path for better compatibility
        const redirectUrl = window.location.origin + (window.location.pathname.includes('index.html') ? '/index.html' : '/');
        console.log('Google OAuth redirect URL:', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        });

        if (error) {
            console.error("Google OAuth error:", error);
            if (error.message.includes('provider')) {
                alert("Google sign-in is not configured. Please contact support or use email/password sign-in.\n\nFor admins: Enable Google provider in Supabase Dashboard > Authentication > Providers > Google");
            } else {
                throw error;
            }
            return;
        }

        // OAuth will redirect to Google, then back to your site
        console.log('Google OAuth initiated:', data);
    } catch (error) {
        console.error("Google sign in error:", error);
        alert("Google sign in failed: " + error.message + "\n\nPlease try email/password sign-in instead.");
    }
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
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if Supabase is available
    if (!supabase) {
        alert("Connection error. Please refresh the page and try again.");
        return;
    }

    const companyName = document.getElementById("signup-company").value.trim();
    const firstName = document.getElementById("signup-firstname").value.trim();
    const lastName = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    // Validate password
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    // Calculate trial end date (15 days from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 15);

    try {
        console.log("Starting signup for:", email);

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        console.log("Auth result:", authData, authError);

        if (authError) throw authError;

        // Check if email confirmation is required (no session means email needs confirmation)
        if (authData.user && !authData.session) {
            alert("Account created! Please check your email to confirm your account, then sign in.");
            document.getElementById("signup-modal").classList.add('hidden');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Session exists - create profile immediately
        if (authData.user && authData.session) {
            // Create profile with company name and trial
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName,
                    package_tier: 'trial',
                    trial_end_date: trialEndDate.toISOString(),
                    is_admin: email === 'zpzant@gmail.com'
                }]);

            if (profileError) {
                console.error("Profile creation error:", profileError);
            }

            alert(`Welcome to Lightning Ledgerz, ${firstName}! Your 15-day free trial has started.`);
            document.getElementById("signup-modal").classList.add('hidden');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

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
        }

    } catch (error) {
        console.error("Signup error:", error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            alert("This email is already registered. Please sign in instead.");
        } else if (error.message.includes('Invalid email')) {
            alert("Please enter a valid email address.");
        } else {
            alert("Signup failed: " + error.message);
        }
    }
});

// Sign In
document.getElementById("signin-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if Supabase is available
    if (!supabase) {
        alert("Connection error. Please refresh the page and try again.");
        return;
    }

    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    try {
        console.log("Attempting sign in for:", email);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log("Sign in response:", { data, error });

        if (error) {
            // Handle specific error cases
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Invalid email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
                throw new Error('Please check your email and click the confirmation link first.');
            } else {
                throw error;
            }
        }

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

                // Use the selected avatar to welcome the user
                if (window.avatarSelector) {
                    window.avatarSelector.welcomeBack(displayName);
                } else if (window.zacAvatar) {
                    window.zacAvatar.welcomeBack(displayName);
                } else {
                    alert(`Hi, ${displayName}! Welcome back.`);
                }

                // Navigate to profile page
                document.getElementById("services").style.display = "none";
                document.getElementById("about").style.display = "none";
                document.getElementById("contact").style.display = "none";
                document.getElementById("dashboard").classList.add('hidden');
                document.getElementById("admin").classList.add('hidden');
                document.getElementById("profile").classList.remove('hidden');
                window.location.href = "#profile";
            } else {
                // Profile didn't load yet, still show success
                if (window.avatarSelector) {
                    window.avatarSelector.showCurrentAvatar();
                } else if (window.zacAvatar) {
                    window.zacAvatar.show();
                }
            }
        }, 1500);

    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Forgot Password
document.getElementById("forgot-password")?.addEventListener("click", async () => {
    // Check if Supabase is available
    if (!supabase) {
        alert("Connection error. Please refresh the page and try again.");
        return;
    }

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
document.getElementById("reset-password-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if Supabase is available
    if (!supabase) {
        alert("Connection error. Please refresh the page and try again.");
        return;
    }

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

// Only set up auth state listener if Supabase is available
if (supabase) {
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
}

// Load user profile from database
async function loadUserProfile() {
    if (!currentUser || !supabase) return;

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
        updateCompanyLogoSection();

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
    const navElement = document.querySelector('nav');

    // Use first name, username, or email as fallback
    const displayName = currentUserProfile.first_name ||
                       currentUserProfile.username ||
                       currentUserProfile.email.split('@')[0];

    welcomeText.textContent = `Hi, ${displayName}!`;

    // Set badge color and nav theme based on tier
    badge.className = 'membership-badge';
    navElement.classList.remove('tier-basic', 'tier-gold', 'tier-diamond');

    if (currentUserProfile.package_tier === 'basic') {
        badge.classList.add('badge-basic');
        navElement.classList.add('tier-basic');
    } else if (currentUserProfile.package_tier === 'gold') {
        badge.classList.add('badge-gold');
        navElement.classList.add('tier-gold');
    } else if (currentUserProfile.package_tier === 'diamond') {
        badge.classList.add('badge-diamond');
        navElement.classList.add('tier-diamond');
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

    // Update dropdown menu items for logged-in state
    const dropdownSignUp = document.getElementById('dropdownSignUp');
    const dropdownSignIn = document.getElementById('dropdownSignIn');
    const dropdownPreview = document.getElementById('dropdownPreview');
    const dropdownLogout = document.getElementById('dropdownLogout');

    if (dropdownSignUp) dropdownSignUp.classList.add('hidden');
    if (dropdownSignIn) dropdownSignIn.classList.add('hidden');
    if (dropdownPreview) dropdownPreview.classList.add('hidden');
    if (dropdownLogout) dropdownLogout.classList.remove('hidden');

    // Hide nav Sign Up button when logged in
    const navSignUpBtn = document.getElementById('navSignUpBtn');
    if (navSignUpBtn) navSignUpBtn.classList.add('hidden');
}

function hideUserWelcome() {
    document.getElementById('userWelcomeNav').classList.add('hidden');
    document.getElementById('adminLink').classList.add('hidden');
    // Hide company logo section
    const logoSection = document.getElementById('companyLogoSection');
    if (logoSection) {
        logoSection.classList.remove('visible');
    }
    // Remove tier theming from nav
    const navElement = document.querySelector('nav');
    if (navElement) {
        navElement.classList.remove('tier-basic', 'tier-gold', 'tier-diamond');
    }

    // Reset dropdown menu items for logged-out state
    const dropdownSignUp = document.getElementById('dropdownSignUp');
    const dropdownSignIn = document.getElementById('dropdownSignIn');
    const dropdownPreview = document.getElementById('dropdownPreview');
    const dropdownLogout = document.getElementById('dropdownLogout');

    if (dropdownSignUp) dropdownSignUp.classList.remove('hidden');
    if (dropdownSignIn) dropdownSignIn.classList.remove('hidden');
    if (dropdownPreview) dropdownPreview.classList.remove('hidden');
    if (dropdownLogout) dropdownLogout.classList.add('hidden');

    // Show nav Sign Up button when logged out
    const navSignUpBtn = document.getElementById('navSignUpBtn');
    if (navSignUpBtn) navSignUpBtn.classList.remove('hidden');
}

// Update profile page with user data
function updateProfilePage() {
    if (!currentUserProfile) return;

    document.getElementById('userFullName').textContent =
        `${currentUserProfile.first_name} ${currentUserProfile.last_name}`;
    document.getElementById('userEmail').textContent = currentUserProfile.email;
    document.getElementById('userUsername').textContent = currentUserProfile.username || 'Not set';
    document.getElementById('userPlan').textContent = currentUserProfile.package_tier.toUpperCase();

    // Populate edit fields
    const editFirstName = document.getElementById('edit-first-name');
    const editLastName = document.getElementById('edit-last-name');
    const editCompanyName = document.getElementById('edit-company-name');
    const editUsername = document.getElementById('edit-username');
    const editPhone = document.getElementById('edit-phone');

    if (editFirstName) editFirstName.value = currentUserProfile.first_name || '';
    if (editLastName) editLastName.value = currentUserProfile.last_name || '';
    if (editCompanyName) editCompanyName.value = currentUserProfile.company_name || '';
    if (editUsername) editUsername.value = currentUserProfile.username || '';
    if (editPhone) editPhone.value = currentUserProfile.phone || '';
}

// Save profile changes
async function saveProfileChanges() {
    if (!currentUser) {
        alert('Please sign in first.');
        return;
    }

    const firstName = document.getElementById('edit-first-name')?.value.trim();
    const lastName = document.getElementById('edit-last-name')?.value.trim();
    const companyName = document.getElementById('edit-company-name')?.value.trim();
    const username = document.getElementById('edit-username')?.value.trim();
    const phone = document.getElementById('edit-phone')?.value.trim();

    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                username: username,
                phone: phone
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        // Update local profile
        currentUserProfile.first_name = firstName;
        currentUserProfile.last_name = lastName;
        currentUserProfile.company_name = companyName;
        currentUserProfile.username = username;
        currentUserProfile.phone = phone;

        // Update display
        document.getElementById('userFullName').textContent = `${firstName} ${lastName}`;
        document.getElementById('userUsername').textContent = username || 'Not set';
        document.getElementById('welcomeText').textContent = `Hi, ${firstName || username || 'User'}!`;

        if (window.zacAvatar) {
            window.zacAvatar.speak('Profile updated successfully!');
        } else {
            alert('Profile updated successfully!');
        }

    } catch (error) {
        console.error('Profile update error:', error);
        alert('Failed to update profile: ' + error.message);
    }
}

window.saveProfileChanges = saveProfileChanges;

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
// (handleMyProfileClick is defined at top of file)
// =====================================================

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
        // Make sure services section is visible first
        const services = document.getElementById('services');
        const profile = document.getElementById('profile');
        const dashboard = document.getElementById('dashboard');
        const admin = document.getElementById('admin');

        if (services) services.style.display = 'block';
        if (profile) profile.classList.add('hidden');
        if (dashboard) dashboard.classList.add('hidden');
        if (admin) admin.classList.add('hidden');

        // Remove highlighted class from all packages
        document.querySelectorAll('.package-card').forEach(card => {
            card.classList.remove('highlighted');
        });

        // Add highlighted class to target package
        target.classList.add('highlighted');

        // Toggle active state - remove from all, add to clicked one (allows switching)
        const packageType = id.replace('-package', ''); // 'basic', 'gold', or 'diamond'
        document.querySelectorAll('.package-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const clickedBtn = document.querySelector(`.package-btn.${packageType}`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }

        // Scroll to target with a small delay to ensure visibility
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Remove highlight after 5 seconds
        setTimeout(() => {
            target.classList.remove('highlighted');
        }, 5000);
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
    const tabContent = document.getElementById(`tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }

    // Find and activate the correct button
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName.toLowerCase()) ||
            btn.getAttribute('onclick')?.includes(tabName)) {
            btn.classList.add('active');
        }
    });

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

        // Use Zac to celebrate the upload
        if (window.zacAvatar) {
            window.zacAvatar.celebrateUpload();
        } else {
            alert("All files uploaded successfully!");
        }
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
    if (!supabase) {
        console.warn('Supabase not available - skipping session check');
        return;
    }
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            currentUser = session.user;
            await loadUserProfile();
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
});

// Make functions globally available (showSignUp, showSignIn, handleMyProfileClick, previewFeatures are exported at the top)
window.switchToSignIn = switchToSignIn;
window.switchToSignUp = switchToSignUp;
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
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

// =====================================================
// GUEST PREVIEW MODE
// (previewFeatures is defined at top of file)
// =====================================================

// =====================================================
// AI TYPING ANIMATION FOR PPT SHOWCASE
// =====================================================

const aiTypingTexts = {
    exec: "Revenue increased 23% YoY driven by expansion into new markets. Operating margin improved to 18.5% through cost optimization initiatives...",
    financial: "Net profit margin: 12.4% (+2.1pp). EBITDA: $2.4M. Working capital ratio improved from 1.8 to 2.1. Cash conversion cycle reduced by 8 days...",
    market: "Market share grew to 15.3% in Q4. Competitive analysis shows 3 key differentiators. Customer acquisition cost decreased 18% while LTV increased...",
    strategy: "1. Expand digital channels (est. +$500K revenue)\n2. Optimize supply chain (-12% costs)\n3. Launch premium tier (35% margin potential)..."
};

let typingIntervals = {};

function startTypingAnimation(elementId, text) {
    const element = document.querySelector(`#${elementId} .typed-text`);
    if (!element) return;

    let index = 0;
    element.textContent = '';

    // Clear any existing interval
    if (typingIntervals[elementId]) {
        clearInterval(typingIntervals[elementId]);
    }

    typingIntervals[elementId] = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(typingIntervals[elementId]);
            // Restart after a delay
            setTimeout(() => {
                startTypingAnimation(elementId, text);
            }, 3000);
        }
    }, 50);
}

// Start typing animations when PPT showcase is visible
function initPPTShowcaseAnimations() {
    const isMobile = window.innerWidth <= 768;

    // Lower threshold for mobile devices
    const threshold = isMobile ? 0.1 : 0.3;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypingAnimation('typing-exec', aiTypingTexts.exec);
                setTimeout(() => startTypingAnimation('typing-financial', aiTypingTexts.financial), 500);
                setTimeout(() => startTypingAnimation('typing-market', aiTypingTexts.market), 1000);
                setTimeout(() => startTypingAnimation('typing-strategy', aiTypingTexts.strategy), 1500);
            }
        });
    }, { threshold: threshold, rootMargin: '50px' });

    const showcase = document.getElementById('ppt-showcase-section');
    if (showcase) {
        observer.observe(showcase);
    }

    // Fallback for mobile - start animations after scroll delay
    if (isMobile) {
        let typingStarted = false;
        window.addEventListener('scroll', () => {
            if (!typingStarted && showcase) {
                const rect = showcase.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    typingStarted = true;
                    startTypingAnimation('typing-exec', aiTypingTexts.exec);
                    setTimeout(() => startTypingAnimation('typing-financial', aiTypingTexts.financial), 500);
                    setTimeout(() => startTypingAnimation('typing-market', aiTypingTexts.market), 1000);
                    setTimeout(() => startTypingAnimation('typing-strategy', aiTypingTexts.strategy), 1500);
                }
            }
        }, { passive: true });
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initPPTShowcaseAnimations);

// =====================================================
// REPORT TEMPLATE SELECTION
// =====================================================

let selectedReportTemplate = null;

function selectReportTemplate(templateId) {
    // Remove selected class from all
    document.querySelectorAll('.report-template-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked
    const selectedCard = document.getElementById(`template-${templateId}`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedReportTemplate = templateId;
    }
}

function generateSelectedReport() {
    if (!selectedReportTemplate) {
        alert('Please select a report template first!');
        return;
    }

    // Auto-enable demo mode for non-logged-in users
    if (!currentUser) {
        previewFeatures();
    }

    const templateNames = {
        executive: 'Executive Summary',
        detailed: 'Detailed Analysis',
        budget: 'Budget vs Actual',
        cashflow: 'Cash Flow Statement',
        kpi: 'KPI Dashboard',
        investor: 'Investor Deck'
    };

    // Use Zac to announce the report generation
    if (window.zacAvatar) {
        window.zacAvatar.speak(`Opening ${templateNames[selectedReportTemplate]} in the Report Builder...`);
    }

    // Open Report Builder with the selected template
    setTimeout(() => {
        if (typeof openReportBuilder === 'function') {
            openReportBuilder();

            // Wait for Report Builder to initialize, then load template
            setTimeout(() => {
                if (window.reportBuilder) {
                    window.reportBuilder.loadProfessionalTemplate(selectedReportTemplate);
                }
            }, 500);
        }
    }, currentUser ? 0 : 300);
}

window.selectReportTemplate = selectReportTemplate;
window.generateSelectedReport = generateSelectedReport;

// =====================================================
// COMPANY LOGO UPLOAD
// =====================================================

async function handleCompanyLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!currentUser) {
        alert('Please sign in to upload a company logo.');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB.');
        return;
    }

    try {
        const fileName = `company-logos/${currentUser.id}/${Date.now()}_${file.name}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-documents')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('user-documents')
            .getPublicUrl(fileName);

        const logoUrl = urlData.publicUrl;

        // Update profile with logo URL
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ company_logo_url: logoUrl })
            .eq('id', currentUser.id);

        if (updateError) throw updateError;

        // Update the preview
        const preview = document.getElementById('companyLogoPreview');
        preview.innerHTML = `<img src="${logoUrl}" alt="Company Logo">`;

        // Store in profile
        if (currentUserProfile) {
            currentUserProfile.company_logo_url = logoUrl;
        }

        // Use Zac to confirm
        if (window.zacAvatar) {
            window.zacAvatar.speak('Company logo uploaded successfully!');
        } else {
            alert('Company logo uploaded successfully!');
        }

    } catch (error) {
        console.error('Logo upload error:', error);
        alert('Failed to upload logo: ' + error.message);
    }
}

// Show/hide company logo section based on login state
function updateCompanyLogoSection() {
    const logoSection = document.getElementById('companyLogoSection');
    if (!logoSection) return;

    if (currentUser && currentUserProfile) {
        logoSection.classList.add('visible');

        // Load existing logo if available
        if (currentUserProfile.company_logo_url) {
            const preview = document.getElementById('companyLogoPreview');
            preview.innerHTML = `<img src="${currentUserProfile.company_logo_url}" alt="Company Logo">`;
        }
    } else {
        logoSection.classList.remove('visible');
    }
}

window.handleCompanyLogoUpload = handleCompanyLogoUpload;

// =====================================================
// UPLOAD FINANCIALS MODAL - Helper functions
// (showUploadModal and closeUploadModal are defined at top of file)
// =====================================================

function setupDropzone() {
    const dropzone = document.getElementById('uploadDropzone');
    if (!dropzone) return;

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        processUploadedFiles(files);
    });
}

async function handleFileUpload(event) {
    const files = event.target.files;
    processUploadedFiles(files);
}

async function processUploadedFiles(files) {
    if (!currentUser) {
        alert('Please sign in to upload files.');
        closeUploadModal();
        showSignIn();
        return;
    }

    const filesList = document.getElementById('uploadedFilesList');

    for (const file of files) {
        // Show file being processed
        const fileItem = document.createElement('div');
        fileItem.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 0.5rem; background: rgba(255,51,51,0.1); border-radius: 8px; margin-top: 0.5rem;';
        fileItem.innerHTML = `
            <span style="color: #ff3333;">📄</span>
            <span style="color: #fff; flex: 1;">${file.name}</span>
            <span style="color: #4caf50; font-size: 0.8rem;">Uploading...</span>
        `;
        filesList.appendChild(fileItem);

        try {
            const fileName = `financials/${currentUser.id}/${Date.now()}_${file.name}`;

            const { data, error } = await supabase.storage
                .from('user-documents')
                .upload(fileName, file);

            if (error) throw error;

            // Update status
            fileItem.querySelector('span:last-child').textContent = 'Uploaded ✓';
            fileItem.querySelector('span:last-child').style.color = '#4caf50';

            // Notify with Zac
            if (window.zacAvatar) {
                window.zacAvatar.speak(`I'm analyzing ${file.name}... I'll generate insights shortly!`);
            }

        } catch (error) {
            console.error('Upload error:', error);
            fileItem.querySelector('span:last-child').textContent = 'Failed ✗';
            fileItem.querySelector('span:last-child').style.color = '#f44336';
        }
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('uploadModal');
    if (e.target === modal) {
        closeUploadModal();
    }
});

// showUploadModal and closeUploadModal are exported at top of file
window.handleFileUpload = handleFileUpload;

// QuickBooks Dashboard function
function openQuickBooksDashboard(event) {
    if (event) event.preventDefault();

    if (!currentUser) {
        alert("Please sign in first to access QuickBooks integration.");
        showSignIn();
        return;
    }

    // Check if user is Diamond tier
    if (currentUserProfile && currentUserProfile.package_tier !== 'diamond') {
        alert("QuickBooks integration is available for Diamond members only. Please upgrade your package.");
        scrollToPackage('diamond-package');
        return;
    }

    // Navigate to profile page and switch to QuickBooks tab
    document.getElementById("services").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("dashboard").classList.add('hidden');
    document.getElementById("admin").classList.add('hidden');
    document.getElementById("profile").classList.remove('hidden');

    // Switch to QuickBooks tab
    switchProfileTab('quickbooks');

    // Scroll to profile section
    document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
}

window.openQuickBooksDashboard = openQuickBooksDashboard;

// PowerPoint Builder function - Pro Decks (like Gamma but better)
function openPowerPointBuilder(event) {
    if (event) event.preventDefault();

    // For non-logged-in users, auto-enable demo mode
    if (!currentUser) {
        // Automatically enter demo mode
        previewFeatures();
    }

    // Give a moment for demo mode to initialize, then open
    setTimeout(() => {
        // Try multiple ways to open the template selector
        if (typeof window.openPowerPointTemplates === 'function') {
            window.openPowerPointTemplates();
        } else if (typeof pptTemplates !== 'undefined' && pptTemplates.openSelector) {
            pptTemplates.openSelector();
        } else {
            // Create and show the selector manually if needed
            console.log('Pro Decks: Initializing template selector...');
            // Force load the PowerPointTemplates class
            if (typeof PowerPointTemplates !== 'undefined') {
                window.pptTemplates = new PowerPointTemplates();
                window.pptTemplates.openSelector();
            } else {
                alert('Pro Decks is loading... Please try again in a moment.');
            }
        }
    }, currentUser ? 0 : 300);
}

window.openPowerPointBuilder = openPowerPointBuilder;

// =====================================================
// MOBILE HAMBURGER MENU
// =====================================================

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.getElementById('hamburgerBtn');
            const navLinksContainer = document.getElementById('navLinks');
            if (hamburger && navLinksContainer) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    });
});

window.toggleMobileMenu = toggleMobileMenu;

// =====================================================
// MOBILE DROPDOWN TAP-TO-TOGGLE
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle && dropdown) {
        // Handle tap/click on dropdown toggle
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Toggle the active class
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Close dropdown when clicking a menu item
        const dropdownItems = dropdown.querySelectorAll('.dropdown-menu a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        });
    }
});

// =====================================================
// AVATAR CLICK TRACKING - PROMPT SIGN UP
// =====================================================

let avatarClickCount = 0;
const SIGN_UP_PROMPT_CLICKS = 5;

function trackAvatarClick() {
    // Only track if user is not logged in
    if (window.currentUser) return;

    avatarClickCount++;

    if (avatarClickCount >= SIGN_UP_PROMPT_CLICKS) {
        // Show sign up prompt via avatar
        const currentAvatar = window.avatarSelector?.getCurrentAvatar() || 'zac';
        const avatarObj = window[currentAvatar + 'Avatar'];

        if (avatarObj && avatarObj.showSpeech) {
            avatarObj.showSpeech(
                "Hey! You've been exploring - ready to unlock all features? Sign up free!",
                "Join Lightning Ledgerz"
            );
        }

        // Show sign up modal after a short delay
        setTimeout(() => {
            showSignUp();
        }, 3000);

        // Reset counter
        avatarClickCount = 0;
    }
}

// Hook into avatar clicks
document.addEventListener('DOMContentLoaded', () => {
    // Wait for avatars to load
    setTimeout(() => {
        const avatarContainers = document.querySelectorAll('[id$="-avatar-container"], .avatar-container, .zac-container');
        avatarContainers.forEach(container => {
            container.addEventListener('click', trackAvatarClick);
        });

        // Also hook into the avatar selector button
        const avatarBtn = document.getElementById('avatar-selector-btn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', trackAvatarClick);
        }
    }, 2000);
});

window.trackAvatarClick = trackAvatarClick;

// =====================================================
// TEST MODE - Simulate different tier accounts
// =====================================================
// Use these functions in browser console to test different tier theming:
// testTier('basic') - Red theme
// testTier('gold') - Gold theme
// testTier('diamond') - Diamond/white theme

function testTier(tier) {
    // Create mock user profile
    const mockProfile = {
        username: `Test_${tier}_User`,
        first_name: `Test ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
        email: `test_${tier}@lightningledgerz.com`,
        package_tier: tier,
        xp_points: tier === 'diamond' ? 5000 : tier === 'gold' ? 2500 : 500,
        level: tier === 'diamond' ? 10 : tier === 'gold' ? 5 : 2
    };

    // Set global profile
    currentUserProfile = mockProfile;
    currentUser = { id: 'test-user-' + tier };

    // Update nav with the mock profile
    const userWelcomeNav = document.getElementById('userWelcomeNav');
    const welcomeText = document.getElementById('welcomeText');
    const badge = document.getElementById('membershipBadge');
    const navElement = document.querySelector('nav');

    if (userWelcomeNav) userWelcomeNav.classList.remove('hidden');
    if (welcomeText) welcomeText.textContent = `Hi, ${mockProfile.first_name}!`;

    // Hide sign up/sign in options
    const dropdownSignUp = document.getElementById('dropdownSignUp');
    const dropdownSignIn = document.getElementById('dropdownSignIn');
    const dropdownLogout = document.getElementById('dropdownLogout');
    if (dropdownSignUp) dropdownSignUp.classList.add('hidden');
    if (dropdownSignIn) dropdownSignIn.classList.add('hidden');
    if (dropdownLogout) dropdownLogout.classList.remove('hidden');

    // Set badge and nav theme
    if (badge) {
        badge.className = 'membership-badge';
        badge.classList.add(`badge-${tier}`);
    }

    if (navElement) {
        navElement.classList.remove('tier-basic', 'tier-gold', 'tier-diamond');
        navElement.classList.add(`tier-${tier}`);
    }

    console.log(`%c✓ Test mode activated: ${tier.toUpperCase()} tier`,
        `color: ${tier === 'gold' ? '#ffd700' : tier === 'diamond' ? '#fff' : '#ff3333'}; font-size: 16px; font-weight: bold;`);
    console.log('Mock profile:', mockProfile);

    // Show the appropriate avatar
    if (window.avatarSelector) {
        window.avatarSelector.showCurrentAvatar();
    }

    return `Test ${tier} account activated. Look at the nav bar to see the theme change!`;
}

// Quick test functions
window.testBasic = () => testTier('basic');
window.testGold = () => testTier('gold');
window.testDiamond = () => testTier('diamond');
window.testTier = testTier;

console.log('%c⚡ Lightning Ledgerz Test Mode Available', 'color: #ff3333; font-size: 14px; font-weight: bold;');
console.log('Run testBasic(), testGold(), or testDiamond() in console to test different tiers.');

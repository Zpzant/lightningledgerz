// =====================================================
// LIGHTNING LEDGERZ - AUTHENTICATION SYSTEM
// =====================================================

(function() {
    'use strict';

    // Supabase Configuration
    // Your Supabase project URL - get the anon key from your Supabase dashboard
    const SUPABASE_URL = 'https://uxicgilvxcqpoxavilxp.supabase.co';
    // IMPORTANT: Get your anon key from https://supabase.com/dashboard/project/uxicgilvxcqpoxavilxp/settings/api
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aWNnaWx2eGNxcG94YXZpbHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzYwNzYsImV4cCI6MjA3NjY1MjA3Nn0.W6_iO15HAxjzvNfp_FHWSS0HYOpaJb7-oC-Z3_KaZaw';

    // Initialize Supabase client
    let supabase = null;

    // Current user state
    window.currentUser = null;
    window.currentUserProfile = null;
    window.currentSession = null;

    // =====================================================
    // INITIALIZATION
    // =====================================================
    function initSupabase() {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            // Check if already initialized
            if (supabase) return supabase;

            // Only initialize if we have real credentials
            if (SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
                console.log('⚠️ Supabase not configured - using local storage fallback');
                return null;
            }

            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✓ Supabase initialized');
            return supabase;
        }
        return null;
    }

    // =====================================================
    // AUTH STATE MANAGEMENT
    // =====================================================
    async function initAuth() {
        const sb = initSupabase();

        // Check for existing session in localStorage (fallback mode)
        const savedSession = localStorage.getItem('lightningLedgerzUser');
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                // Check if session is less than 7 days old
                if (sessionData.timestamp && (Date.now() - sessionData.timestamp) < 7 * 24 * 60 * 60 * 1000) {
                    window.currentUser = sessionData.user;
                    window.currentUserProfile = sessionData.profile;
                    updateUIForLoggedInUser();
                    loadUserUploads();
                    console.log('✓ Restored session for:', sessionData.profile.first_name);
                    return;
                }
            } catch (e) {
                localStorage.removeItem('lightningLedgerzUser');
            }
        }

        // If Supabase is available, check for auth session
        if (sb) {
            const { data: { session } } = await sb.auth.getSession();
            if (session) {
                window.currentUser = session.user;
                await loadUserProfile(session.user.id);
                updateUIForLoggedInUser();
                loadUserUploads();
            }

            // Listen for auth changes
            sb.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth event:', event);
                if (event === 'SIGNED_IN' && session) {
                    window.currentUser = session.user;
                    await loadUserProfile(session.user.id);
                    updateUIForLoggedInUser();
                    loadUserUploads();
                } else if (event === 'SIGNED_OUT') {
                    window.currentUser = null;
                    window.currentUserProfile = null;
                    localStorage.removeItem('lightningLedgerzUser');
                    updateUIForLoggedOutUser();
                }
            });
        }
    }

    // =====================================================
    // USER PROFILE
    // =====================================================
    async function loadUserProfile(userId) {
        const sb = initSupabase();
        if (!sb) return null;

        const { data, error } = await sb
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
            return null;
        }

        window.currentUserProfile = data;
        return data;
    }

    async function createUserProfile(userId, profileData) {
        const sb = initSupabase();
        if (!sb) {
            // Fallback: store in localStorage
            const profile = {
                id: userId,
                ...profileData,
                package_tier: 'basic',
                created_at: new Date().toISOString()
            };
            window.currentUserProfile = profile;
            saveSessionToLocalStorage();
            return profile;
        }

        const { data, error } = await sb
            .from('profiles')
            .insert([{
                id: userId,
                email: profileData.email,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                username: profileData.email.split('@')[0],
                package_tier: 'basic'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating profile:', error);
            return null;
        }

        window.currentUserProfile = data;
        return data;
    }

    // =====================================================
    // SESSION TRACKING
    // =====================================================
    function detectDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'unknown';
        let browser = 'unknown';
        let os = 'unknown';

        // Detect device type
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
            deviceType = 'tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
            deviceType = 'mobile';
        } else {
            deviceType = 'desktop';
        }

        // Detect browser
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Opera')) browser = 'Opera';

        // Detect OS
        if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';

        return { deviceType, browser, os, userAgent: ua };
    }

    async function createSessionRecord(userId) {
        const sb = initSupabase();
        const deviceInfo = detectDeviceInfo();
        const sessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const sessionData = {
            user_id: userId,
            session_token: sessionToken,
            user_agent: deviceInfo.userAgent,
            device_type: deviceInfo.deviceType,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            started_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            is_active: true,
            last_page: window.location.pathname || 'home',
            session_data: {}
        };

        // Save to localStorage
        localStorage.setItem('currentSessionId', sessionToken);
        localStorage.setItem('sessionData_' + userId, JSON.stringify(sessionData));

        // Save to Supabase if available
        if (sb) {
            try {
                const { data, error } = await sb
                    .from('session_history')
                    .insert([sessionData])
                    .select()
                    .single();

                if (!error && data) {
                    window.currentSession = data;
                    console.log('✓ Session created:', data.id);
                    return data;
                }
            } catch (e) {
                console.log('Session tracking via Supabase not available');
            }
        }

        window.currentSession = sessionData;
        return sessionData;
    }

    async function updateSessionActivity(page, action) {
        if (!window.currentUser) return;

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Update localStorage
        const localSession = JSON.parse(localStorage.getItem('sessionData_' + userId) || '{}');
        localSession.last_activity = new Date().toISOString();
        localSession.last_page = page || localSession.last_page;
        localSession.last_action = action || localSession.last_action;
        localStorage.setItem('sessionData_' + userId, JSON.stringify(localSession));

        // Update Supabase if available
        if (sb && window.currentSession?.id) {
            try {
                await sb
                    .from('session_history')
                    .update({
                        last_activity: new Date().toISOString(),
                        last_page: page,
                        last_action: action
                    })
                    .eq('id', window.currentSession.id);
            } catch (e) {
                // Silently fail - session tracking is non-critical
            }
        }
    }

    async function endSessionRecord() {
        if (!window.currentUser) return;

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Update localStorage
        const localSession = JSON.parse(localStorage.getItem('sessionData_' + userId) || '{}');
        localSession.ended_at = new Date().toISOString();
        localSession.is_active = false;
        localStorage.setItem('sessionData_' + userId, JSON.stringify(localSession));

        // Update Supabase if available
        if (sb && window.currentSession?.id) {
            try {
                await sb
                    .from('session_history')
                    .update({
                        ended_at: new Date().toISOString(),
                        is_active: false
                    })
                    .eq('id', window.currentSession.id);
                console.log('✓ Session ended');
            } catch (e) {
                // Silently fail
            }
        }

        window.currentSession = null;
        localStorage.removeItem('currentSessionId');
    }

    async function loadSessionHistory() {
        if (!window.currentUser) return [];

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Try Supabase first
        if (sb) {
            try {
                const { data, error } = await sb
                    .from('session_history')
                    .select('*')
                    .eq('user_id', userId)
                    .order('started_at', { ascending: false })
                    .limit(10);

                if (!error && data) {
                    console.log('✓ Loaded', data.length, 'previous sessions');
                    return data;
                }
            } catch (e) {
                // Fall through to localStorage
            }
        }

        // Fallback to localStorage
        const localSession = localStorage.getItem('sessionData_' + userId);
        return localSession ? [JSON.parse(localSession)] : [];
    }

    async function saveWorkspaceState(state) {
        if (!window.currentUser) return;

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Save to localStorage
        localStorage.setItem('workspaceState_' + userId, JSON.stringify({
            ...state,
            updated_at: new Date().toISOString()
        }));

        // Save to Supabase if available
        if (sb) {
            try {
                await sb
                    .from('user_workspace')
                    .upsert({
                        user_id: userId,
                        ...state,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                console.log('✓ Workspace state saved');
            } catch (e) {
                // Silently fail
            }
        }
    }

    async function loadWorkspaceState() {
        if (!window.currentUser) return null;

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Try Supabase first
        if (sb) {
            try {
                const { data, error } = await sb
                    .from('user_workspace')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (!error && data) {
                    console.log('✓ Workspace state loaded from Supabase');
                    return data;
                }
            } catch (e) {
                // Fall through to localStorage
            }
        }

        // Fallback to localStorage
        const localState = localStorage.getItem('workspaceState_' + userId);
        return localState ? JSON.parse(localState) : null;
    }

    // =====================================================
    // SIGN UP
    // =====================================================
    async function signUp(email, password, firstName, lastName, company) {
        const sb = initSupabase();

        if (!sb) {
            // Fallback: Local signup
            const userId = 'local-' + Date.now();
            const user = {
                id: userId,
                email: email,
                user_metadata: { first_name: firstName, last_name: lastName }
            };

            window.currentUser = user;
            await createUserProfile(userId, {
                email: email,
                first_name: firstName,
                last_name: lastName,
                company: company
            });

            saveSessionToLocalStorage();
            updateUIForLoggedInUser();
            await createSessionRecord(userId);
            return { success: true, user: user };
        }

        // Supabase signup
        const signUpOptions = {
            data: {
                first_name: firstName,
                last_name: lastName,
                company: company
            }
        };
        // CAPTCHA (Turnstile) — only when the site key is configured on the page
        if (window.LL_CAPTCHA_TOKEN) signUpOptions.captchaToken = window.LL_CAPTCHA_TOKEN;
        const { data, error } = await sb.auth.signUp({
            email: email,
            password: password,
            options: signUpOptions
        });

        if (error) {
            return { success: false, error: error.message };
        }

        // Create profile
        if (data.user) {
            await createUserProfile(data.user.id, {
                email: email,
                first_name: firstName,
                last_name: lastName
            });
        }

        return { success: true, user: data.user };
    }

    // =====================================================
    // SIGN IN
    // =====================================================
    async function signIn(email, password) {
        const sb = initSupabase();

        // Check for saved local accounts
        const localAccounts = JSON.parse(localStorage.getItem('lightningLedgerzAccounts') || '{}');
        const localAccount = localAccounts[email.toLowerCase()];

        if (localAccount && localAccount.password === password) {
            window.currentUser = localAccount.user;
            window.currentUserProfile = localAccount.profile;
            saveSessionToLocalStorage();
            updateUIForLoggedInUser();
            loadUserUploads();
            await createSessionRecord(localAccount.user.id);
            return { success: true, user: localAccount.user };
        }

        if (!sb) {
            return { success: false, error: 'Invalid email or password' };
        }

        // Supabase signin
        const signInPayload = { email: email, password: password };
        if (window.LL_CAPTCHA_TOKEN) signInPayload.options = { captchaToken: window.LL_CAPTCHA_TOKEN };
        const { data, error } = await sb.auth.signInWithPassword(signInPayload);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, user: data.user };
    }

    // =====================================================
    // SIGN OUT
    // =====================================================
    async function signOut() {
        const sb = initSupabase();

        // End the current session record
        await endSessionRecord();

        if (sb) {
            await sb.auth.signOut();
        }

        window.currentUser = null;
        window.currentUserProfile = null;
        window.currentSession = null;
        localStorage.removeItem('lightningLedgerzUser');
        updateUIForLoggedOutUser();
    }

    // =====================================================
    // GOOGLE SIGN IN
    // =====================================================
    async function signInWithGoogle() {
        const sb = initSupabase();

        if (!sb) {
            alert('Google Sign-In requires Supabase configuration. Please use email/password.');
            return { success: false, error: 'Supabase not configured' };
        }

        const { data, error } = await sb.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    }

    // =====================================================
    // SESSION MANAGEMENT
    // =====================================================
    function saveSessionToLocalStorage() {
        if (window.currentUser && window.currentUserProfile) {
            localStorage.setItem('lightningLedgerzUser', JSON.stringify({
                user: window.currentUser,
                profile: window.currentUserProfile,
                timestamp: Date.now()
            }));

            // Also save to accounts list for local login
            const accounts = JSON.parse(localStorage.getItem('lightningLedgerzAccounts') || '{}');
            accounts[window.currentUserProfile.email.toLowerCase()] = {
                user: window.currentUser,
                profile: window.currentUserProfile,
                password: window._tempPassword // Store password for local accounts
            };
            localStorage.setItem('lightningLedgerzAccounts', JSON.stringify(accounts));
            delete window._tempPassword;
        }
    }

    // =====================================================
    // UI UPDATES
    // =====================================================
    function updateUIForLoggedInUser() {
        const profile = window.currentUserProfile;
        if (!profile) return;

        const firstName = profile.first_name || 'User';
        const packageTier = profile.package_tier || 'basic';

        // Update nav welcome section
        const navWelcome = document.getElementById('user-welcome-nav');
        const signinBtn = document.getElementById('nav-signin');
        const signupBtn = document.getElementById('nav-signup');

        // Hide sign in/up buttons
        if (signinBtn) signinBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';

        // Show or create welcome section
        if (navWelcome) {
            navWelcome.style.display = 'flex';
            const nameEl = navWelcome.querySelector('.welcome-name');
            if (nameEl) nameEl.textContent = 'Hi, ' + firstName + '!';

            const badgeEl = navWelcome.querySelector('.package-banner');
            if (badgeEl) {
                badgeEl.className = 'package-banner package-' + packageTier;
                badgeEl.textContent = packageTier.charAt(0).toUpperCase() + packageTier.slice(1);
            }
        } else {
            // Create welcome section if it doesn't exist
            createWelcomeNav(firstName, packageTier);
        }

        // Update logo styling based on package
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.classList.remove('logo-basic', 'logo-gold', 'logo-diamond');
            logo.classList.add('logo-' + packageTier);
        }

        console.log('✓ UI updated for:', firstName, '(' + packageTier + ')');
    }

    function createWelcomeNav(firstName, packageTier) {
        const navLinks = document.getElementById('navLinks');
        if (!navLinks) return;

        // Check if already exists
        if (document.getElementById('user-welcome-nav')) return;

        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'user-welcome-nav';
        welcomeDiv.className = 'user-welcome';
        welcomeDiv.innerHTML = `
            <div class="user-avatar-nav">
                <span style="font-size: 1.2rem;">⚡</span>
            </div>
            <div class="welcome-text-container">
                <span class="welcome-name">Hi, ${firstName}!</span>
                <span class="package-banner package-${packageTier}">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</span>
            </div>
            <button onclick="window.LightningAuth.signOut()" style="background: none; border: none; color: #ff3333; cursor: pointer; font-size: 0.8rem; margin-left: 10px;">Sign Out</button>
        `;

        // Insert before the last items in nav
        navLinks.appendChild(welcomeDiv);
    }

    function updateUIForLoggedOutUser() {
        const navWelcome = document.getElementById('user-welcome-nav');
        const signinBtn = document.getElementById('nav-signin');
        const signupBtn = document.getElementById('nav-signup');

        if (navWelcome) navWelcome.style.display = 'none';
        if (signinBtn) signinBtn.style.display = '';
        if (signupBtn) signupBtn.style.display = '';

        // Remove logo styling
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.classList.remove('logo-basic', 'logo-gold', 'logo-diamond');
        }

        console.log('✓ UI updated for logged out state');
    }

    // =====================================================
    // FILE UPLOADS - SAVE TO USER ACCOUNT
    // =====================================================
    async function saveUserUpload(fileData) {
        if (!window.currentUser) {
            console.log('No user logged in, upload not saved to account');
            return null;
        }

        const userId = window.currentUser.id;
        const sb = initSupabase();

        // Save to localStorage as fallback
        const uploads = JSON.parse(localStorage.getItem('userUploads_' + userId) || '[]');
        const uploadRecord = {
            id: 'upload-' + Date.now(),
            user_id: userId,
            file_name: fileData.name,
            file_type: fileData.type,
            file_size: fileData.size,
            file_data: fileData.content, // Base64 encoded
            uploaded_at: new Date().toISOString()
        };
        uploads.push(uploadRecord);
        localStorage.setItem('userUploads_' + userId, JSON.stringify(uploads));

        // If Supabase is available, also save there
        if (sb) {
            try {
                const { data, error } = await sb
                    .from('user_documents')
                    .insert([{
                        user_id: userId,
                        file_name: fileData.name,
                        file_type: fileData.type,
                        file_size: fileData.size,
                        file_path: 'local/' + uploadRecord.id
                    }]);

                if (error) {
                    console.error('Error saving to Supabase:', error);
                }
            } catch (e) {
                console.error('Supabase save error:', e);
            }
        }

        console.log('✓ Upload saved for user:', fileData.name);
        return uploadRecord;
    }

    async function loadUserUploads() {
        if (!window.currentUser) return [];

        const userId = window.currentUser.id;

        // Load from localStorage
        const uploads = JSON.parse(localStorage.getItem('userUploads_' + userId) || '[]');

        // Update UI with uploads
        if (uploads.length > 0) {
            console.log('✓ Loaded', uploads.length, 'saved uploads');
            displaySavedUploads(uploads);
        }

        return uploads;
    }

    function displaySavedUploads(uploads) {
        // Find or create the saved files section
        let savedFilesSection = document.getElementById('saved-files-section');

        if (!savedFilesSection) {
            // Create if doesn't exist - find a good place to put it
            const profileSection = document.getElementById('profile');
            if (profileSection) {
                savedFilesSection = document.createElement('div');
                savedFilesSection.id = 'saved-files-section';
                savedFilesSection.className = 'saved-files-section';
                savedFilesSection.innerHTML = `
                    <h3 style="color: #ff3333; margin-bottom: 1rem;">📁 Your Saved Files</h3>
                    <div id="saved-files-list" class="saved-files-list"></div>
                `;
                // Insert at a good location
                const fileManagerMount = document.getElementById('file-manager-mount');
                if (fileManagerMount) {
                    fileManagerMount.parentNode.insertBefore(savedFilesSection, fileManagerMount);
                }
            }
        }

        const filesList = document.getElementById('saved-files-list');
        if (!filesList) return;

        filesList.innerHTML = uploads.map(upload => `
            <div class="saved-file-item" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="color: #fff; font-weight: 500;">${upload.file_name}</span>
                    <span style="color: #888; font-size: 0.85rem; margin-left: 1rem;">${formatFileSize(upload.file_size)}</span>
                </div>
                <div>
                    <button onclick="window.LightningAuth.reloadUpload('${upload.id}')" style="background: #ff3333; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; margin-right: 0.5rem;">Load</button>
                    <button onclick="window.LightningAuth.deleteUpload('${upload.id}')" style="background: #333; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    function formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    async function reloadUpload(uploadId) {
        if (!window.currentUser) return;

        const userId = window.currentUser.id;
        const uploads = JSON.parse(localStorage.getItem('userUploads_' + userId) || '[]');
        const upload = uploads.find(u => u.id === uploadId);

        if (upload && upload.file_data) {
            // Trigger re-processing of the file
            console.log('Reloading file:', upload.file_name);
            alert('Loading ' + upload.file_name + '...\nYour data will be restored.');
            // TODO: Connect to the actual file processing system
        }
    }

    async function deleteUpload(uploadId) {
        if (!window.currentUser) return;
        if (!confirm('Delete this file?')) return;

        const userId = window.currentUser.id;
        let uploads = JSON.parse(localStorage.getItem('userUploads_' + userId) || '[]');
        uploads = uploads.filter(u => u.id !== uploadId);
        localStorage.setItem('userUploads_' + userId, JSON.stringify(uploads));

        displaySavedUploads(uploads);
        console.log('✓ Upload deleted');
    }

    // =====================================================
    // FORM HANDLERS
    // =====================================================
    function setupFormHandlers() {
        // Sign Up Form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('signup-email').value.trim();
                const password = document.getElementById('signup-password').value;
                const firstName = document.getElementById('signup-firstname').value.trim();
                const lastName = document.getElementById('signup-lastname').value.trim();
                const company = document.getElementById('signup-company')?.value.trim() || '';

                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Creating account...';
                submitBtn.disabled = true;

                // Store password temporarily for local account
                window._tempPassword = password;

                const result = await signUp(email, password, firstName, lastName, company);

                if (result.success) {
                    hideSignUp();
                    alert('Welcome to Lightning Ledgerz, ' + firstName + '! 🔥');
                } else {
                    alert('Sign up failed: ' + result.error);
                }

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }

        // Sign In Form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('signin-email').value.trim();
                const password = document.getElementById('signin-password').value;

                const submitBtn = signinForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Signing in...';
                submitBtn.disabled = true;

                const result = await signIn(email, password);

                if (result.success) {
                    hideSignIn();
                    const name = window.currentUserProfile?.first_name || 'there';
                    alert('Hi ' + name + '! Welcome back to Lightning Ledgerz. ⚡');
                } else {
                    alert('Sign in failed: ' + result.error);
                }

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }
    }

    // =====================================================
    // INITIALIZE ON DOM READY
    // =====================================================
    function init() {
        console.log('🔐 Lightning Ledgerz Auth initializing...');
        initAuth();
        setupFormHandlers();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // =====================================================
    // EXPORT PUBLIC API
    // =====================================================
    window.LightningAuth = {
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        signInWithGoogle: signInWithGoogle,
        saveUserUpload: saveUserUpload,
        loadUserUploads: loadUserUploads,
        reloadUpload: reloadUpload,
        deleteUpload: deleteUpload,
        getCurrentUser: () => window.currentUser,
        getCurrentProfile: () => window.currentUserProfile,
        getCurrentSession: () => window.currentSession,
        isLoggedIn: () => !!window.currentUser,
        // Session tracking
        updateSessionActivity: updateSessionActivity,
        loadSessionHistory: loadSessionHistory,
        saveWorkspaceState: saveWorkspaceState,
        loadWorkspaceState: loadWorkspaceState
    };

    // Also expose signInWithGoogle globally for the button onclick
    window.signInWithGoogle = signInWithGoogle;

    console.log('✓ Lightning Ledgerz Auth module loaded');

})();

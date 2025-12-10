// =====================================================
// LIGHTNING LEDGERZ - ADVANCED FEATURES & INTEGRATIONS
// =====================================================
// Payment processing, analytics, notifications, and more

class AdvancedFeatures {
    constructor() {
        this.paymentProvider = 'stripe'; // or 'paddle'
        this.analyticsEnabled = true;
        this.notificationsEnabled = true;
        this.darkModeEnabled = true;
    }

    // =====================================================
    // PAYMENT PROCESSING
    // =====================================================

    async initializePaymentProcessing(publicKey) {
        if (this.paymentProvider === 'stripe') {
            window.Stripe = await loadStripeJS(publicKey);
        }
        return true;
    }

    async processMarketplacePayment(userId, itemId, amount) {
        try {
            // Create payment intent
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    item_id: itemId,
                    amount: amount
                })
            });

            const { clientSecret } = await response.json();

            // Confirm payment
            const { paymentIntent } = await window.Stripe.confirmCardPayment(clientSecret);

            if (paymentIntent.status === 'succeeded') {
                // Award item to user
                await this.awardMarketplaceItem(userId, itemId);
                return { success: true, transactionId: paymentIntent.id };
            }

            return { success: false, error: 'Payment failed' };
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }

    async awardMarketplaceItem(userId, itemId) {
        // Add item to user's inventory in Supabase
        const { data, error } = await supabase
            .from('user_avatars')
            .select('inventory')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        const inventory = data.inventory || [];
        inventory.push({
            itemId: itemId,
            acquiredAt: new Date(),
            source: 'purchase'
        });

        const { error: updateError } = await supabase
            .from('user_avatars')
            .update({ inventory: inventory })
            .eq('user_id', userId);

        if (updateError) throw updateError;
        return true;
    }

    // =====================================================
    // EMAIL NOTIFICATIONS
    // =====================================================

    async setupEmailNotifications(userId, preferences) {
        try {
            const { error } = await supabase
                .from('notification_preferences')
                .upsert([{
                    user_id: userId,
                    email_on_level_up: preferences.levelUp || true,
                    email_on_referral: preferences.referral || true,
                    email_on_marketplace: preferences.marketplace || true,
                    email_on_report: preferences.report || true,
                    weekly_digest: preferences.weeklyDigest || true,
                    updated_at: new Date()
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Notification setup error:', error);
            return false;
        }
    }

    async sendNotificationEmail(userId, type, data) {
        try {
            // Call Supabase Edge Function or backend service
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    notification_type: type,
                    data: data
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }

    // =====================================================
    // ANALYTICS & TRACKING
    // =====================================================

    async trackUserAction(userId, action, metadata = {}) {
        if (!this.analyticsEnabled) return;

        try {
            const { error } = await supabase
                .from('user_analytics')
                .insert([{
                    user_id: userId,
                    action: action,
                    metadata: metadata,
                    timestamp: new Date(),
                    user_agent: navigator.userAgent,
                    ip_address: null // Server-side only for privacy
                }]);

            if (error) console.error('Analytics error:', error);
        } catch (error) {
            console.error('Error tracking action:', error);
        }
    }

    async getAnalyticsDashboard(userId) {
        try {
            const { data, error } = await supabase
                .from('user_analytics')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false });

            if (error) throw error;

            return {
                totalActions: data.length,
                actionsThisMonth: data.filter(a => {
                    const date = new Date(a.timestamp);
                    return date.getMonth() === new Date().getMonth();
                }).length,
                actionBreakdown: this.groupBy(data, 'action'),
                lastAction: data[0]?.timestamp
            };
        } catch (error) {
            console.error('Analytics error:', error);
            return null;
        }
    }

    groupBy(array, key) {
        return array.reduce((result, item) => {
            if (!result[item[key]]) result[item[key]] = 0;
            result[item[key]]++;
            return result;
        }, {});
    }

    // =====================================================
    // DARK MODE / THEME MANAGEMENT
    // =====================================================

    initializeTheme() {
        const savedTheme = localStorage.getItem('lightning-theme') || 'dark';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#0f0f0f');
            root.style.setProperty('--bg-secondary', '#1a1a2e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#999999');
            root.style.setProperty('--accent-color', '#ff3333');
            document.body.classList.remove('light-theme');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f5f5f5');
            root.style.setProperty('--text-primary', '#000000');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--accent-color', '#ff3333');
            document.body.classList.add('light-theme');
        }

        localStorage.setItem('lightning-theme', theme);
        this.darkModeEnabled = theme === 'dark';
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('lightning-theme') || 'dark';
        this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    // =====================================================
    // EXPORT FUNCTIONALITY
    // =====================================================

    async exportFinancialData(userId, format = 'csv') {
        try {
            const { data, error } = await supabase
                .from('file_uploads')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            if (format === 'csv') {
                return this.exportToCSV(data);
            } else if (format === 'json') {
                return this.exportToJSON(data);
            } else if (format === 'pdf') {
                return this.exportToPDF(data);
            }
        } catch (error) {
            console.error('Export error:', error);
            return null;
        }
    }

    exportToCSV(data) {
        const headers = Object.keys(data[0] || {});
        let csv = headers.join(',') + '\n';

        data.forEach(row => {
            csv += headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            }).join(',') + '\n';
        });

        this.downloadFile(csv, 'financial_data.csv', 'text/csv');
        return true;
    }

    exportToJSON(data) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'financial_data.json', 'application/json');
        return true;
    }

    exportToPDF(data) {
        // Requires pdfkit or similar library
        console.log('PDF export requires additional library setup');
        return false;
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // =====================================================
    // TEAM COLLABORATION (Future Feature)
    // =====================================================

    async inviteTeamMember(inviterUserId, inviteeEmail, role = 'viewer') {
        try {
            const { error } = await supabase
                .from('team_invitations')
                .insert([{
                    inviter_id: inviterUserId,
                    invitee_email: inviteeEmail,
                    role: role,
                    status: 'pending',
                    created_at: new Date(),
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                }]);

            if (error) throw error;

            // Send invitation email
            await this.sendNotificationEmail(inviterUserId, 'team_invitation', {
                inviteeEmail: inviteeEmail
            });

            return true;
        } catch (error) {
            console.error('Team invitation error:', error);
            return false;
        }
    }

    // =====================================================
    // AI IMAGE GENERATION FOR AVATAR
    // =====================================================

    async generateAvatarFromPhoto(photoFile, userId) {
        try {
            // Upload photo to Supabase storage
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('avatar-photos')
                .upload(`${userId}/${photoFile.name}`, photoFile);

            if (uploadError) throw uploadError;

            // Call backend service to process with AI
            const response = await fetch('/api/generate-avatar-from-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    photo_path: uploadData.path
                })
            });

            const avatarData = await response.json();
            return avatarData;
        } catch (error) {
            console.error('Avatar generation error:', error);
            return null;
        }
    }

    // =====================================================
    // GAMIFICATION
    // =====================================================

    async unlockAchievement(userId, achievementId) {
        try {
            const { error } = await supabase
                .from('user_achievements')
                .insert([{
                    user_id: userId,
                    achievement_id: achievementId,
                    unlocked_at: new Date()
                }]);

            if (error) throw error;

            // Award bonus credits
            const { data: avatar } = await supabase
                .from('user_avatars')
                .select('currency')
                .eq('user_id', userId)
                .single();

            await supabase
                .from('user_avatars')
                .update({ currency: (avatar?.currency || 0) + 50 })
                .eq('user_id', userId);

            return true;
        } catch (error) {
            console.error('Achievement unlock error:', error);
            return false;
        }
    }

    // Predefined achievements
    achievements = {
        first_upload: {
            id: 'first_upload',
            name: 'File Master',
            description: 'Upload your first financial document',
            icon: '📁',
            reward: 50
        },
        first_presentation: {
            id: 'first_presentation',
            name: 'Presenter',
            description: 'Create your first presentation',
            icon: '📊',
            reward: 100
        },
        avatar_level_5: {
            id: 'avatar_level_5',
            name: 'Rising Star',
            description: 'Reach avatar level 5',
            icon: '⭐',
            reward: 150
        },
        first_referral: {
            id: 'first_referral',
            name: 'Influencer',
            description: 'Successfully refer a friend',
            icon: '🎁',
            reward: 200
        },
        five_referrals: {
            id: 'five_referrals',
            name: 'Ambassador',
            description: 'Successfully refer 5 friends',
            icon: '👥',
            reward: 500
        },
        marketplace_spender: {
            id: 'marketplace_spender',
            name: 'Fashionista',
            description: 'Spend 1000 credits in marketplace',
            icon: '💳',
            reward: 200
        }
    };

    // =====================================================
    // PERFORMANCE MONITORING
    // =====================================================

    monitorPerformance() {
        // Use Web Vitals to monitor performance
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Performance Metrics:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
                });
            });
        }
    }

    // =====================================================
    // SECURITY
    // =====================================================

    enableCSP() {
        // Content Security Policy headers should be set server-side
        // This is a placeholder for CSP configuration
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://cdn.jsdelivr.net https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com; frame-src https://accounts.google.com https://*.supabase.co; img-src 'self' data: https: blob:;";
        document.head.appendChild(cspMeta);
    }

    validateUserInput(input, type) {
        switch(type) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
            case 'username':
                return /^[a-zA-Z0-9_-]{3,20}$/.test(input);
            case 'password':
                return input.length >= 8 && /[A-Z]/.test(input) && /[0-9]/.test(input);
            case 'currency':
                return /^\$?[\d,]+(\.\d{2})?$/.test(input);
            default:
                return true;
        }
    }
}

// Initialize global advanced features
let advancedFeatures = new AdvancedFeatures();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    advancedFeatures.initializeTheme();
    advancedFeatures.monitorPerformance();
    advancedFeatures.enableCSP();
});

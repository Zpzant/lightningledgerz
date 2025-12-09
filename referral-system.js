// =====================================================
// LIGHTNING LEDGERZ - REFERRAL & SHARING SYSTEM
// =====================================================
// Referral program with reward tracking and share functionality

class ReferralSystem {
    constructor() {
        this.referralCode = null;
        this.referredUsers = [];
        this.rewardTier = {
            tier1: { reward: 'two-months-free', bonus: 100 }, // For referrer
            tier2: { reward: 'one-month-free', bonus: 50 }    // For referred
        };
    }

    generateReferralCode(userId) {
        // Generate unique referral code
        const code = `LL${userId.substring(0, 4).toUpperCase()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        this.referralCode = code;
        return code;
    }

    async setupReferralLink(userId, username) {
        try {
            const referralCode = this.generateReferralCode(userId);
            const referralUrl = `${window.location.origin}?ref=${referralCode}`;

            // Save to Supabase
            const { data, error } = await supabase
                .from('referrals')
                .insert([{
                    user_id: userId,
                    referral_code: referralCode,
                    referral_url: referralUrl,
                    created_at: new Date()
                }]);

            if (error) throw error;

            return {
                code: referralCode,
                url: referralUrl,
                shareText: this.generateShareMessage(username, referralCode)
            };
        } catch (error) {
            console.error('Error setting up referral:', error);
            throw error;
        }
    }

    generateShareMessage(username, referralCode) {
        return `Hey! 👋 I'm using Lightning Ledgerz to manage my finances and it's amazing! Join me and get 2 FREE months when you sign up with my code: ${referralCode}. Plus, you'll get an interactive avatar to help you manage your budget! 🚀💰 ${window.location.origin}?ref=${referralCode}`;
    }

    async trackReferral(referralCode, newUserId) {
        try {
            // Get referrer info
            const { data: referralData, error: refError } = await supabase
                .from('referrals')
                .select('user_id')
                .eq('referral_code', referralCode)
                .single();

            if (refError) throw refError;

            const referrerId = referralData.user_id;

            // Record the referral
            const { error: insertError } = await supabase
                .from('referral_tracking')
                .insert([{
                    referrer_id: referrerId,
                    referred_id: newUserId,
                    referral_code: referralCode,
                    reward_status: 'pending',
                    created_at: new Date()
                }]);

            if (insertError) throw insertError;

            // Award rewards
            await this.awardReferralRewards(referrerId, newUserId);

            return true;
        } catch (error) {
            console.error('Error tracking referral:', error);
            return false;
        }
    }

    async awardReferralRewards(referrerId, referredId) {
        try {
            const now = new Date();
            const twoMonthsFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
            const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            // Award referrer: 2 months free + 100 credits
            const { error: referrerError } = await supabase
                .from('user_subscriptions')
                .upsert([{
                    user_id: referrerId,
                    premium_expiry: twoMonthsFromNow,
                    bonus_credits: 100,
                    updated_at: new Date()
                }]);

            if (referrerError) throw referrerError;

            // Award referred: 1 month free + 50 credits
            const { error: referredError } = await supabase
                .from('user_subscriptions')
                .upsert([{
                    user_id: referredId,
                    premium_expiry: oneMonthFromNow,
                    bonus_credits: 50,
                    updated_at: new Date()
                }]);

            if (referredError) throw referredError;

            // Update tracking status
            await supabase
                .from('referral_tracking')
                .update({ reward_status: 'completed' })
                .match({ referrer_id: referrerId, referred_id: referredId });

        } catch (error) {
            console.error('Error awarding rewards:', error);
            throw error;
        }
    }

    createShareWidget(referralCode, username) {
        return `
            <div class="referral-widget" style="
                background: linear-gradient(135deg, #ff3333 0%, #cc0000 100%);
                border-radius: 12px;
                padding: 30px;
                color: white;
                text-align: center;
                margin: 20px 0;
            ">
                <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;">Share & Earn! 🎁</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">
                    Share your referral link and get 2 FREE months of premium!
                </p>
                
                <div style="
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    font-family: monospace;
                    word-break: break-all;
                ">
                    <strong>Your Code: ${referralCode}</strong>
                </div>

                <input type="text" readonly value="${window.location.origin}?ref=${referralCode}" 
                    style="
                        width: 100%;
                        padding: 12px;
                        border: none;
                        border-radius: 6px;
                        margin: 10px 0;
                        font-size: 0.9rem;
                    " 
                    id="referral-link"
                />

                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="copyReferralLink()" style="
                        background: white;
                        color: #ff3333;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">📋 Copy Link</button>
                    
                    <button onclick="shareViaEmail('${referralCode}', '${username}')" style="
                        background: rgba(255, 255, 255, 0.3);
                        color: white;
                        border: 2px solid white;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">📧 Email</button>
                    
                    <button onclick="shareViaTwitter('${referralCode}')" style="
                        background: rgba(255, 255, 255, 0.3);
                        color: white;
                        border: 2px solid white;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">𝕏 Tweet</button>
                    
                    <button onclick="shareViaLinkedin('${referralCode}')" style="
                        background: rgba(255, 255, 255, 0.3);
                        color: white;
                        border: 2px solid white;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: bold;
                    ">in Share</button>
                </div>
            </div>
        `;
    }
}

// Utility functions for sharing
function copyReferralLink() {
    const link = document.getElementById('referral-link');
    link.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function shareViaEmail(referralCode, username) {
    const message = referralSystem.generateShareMessage(username, referralCode);
    window.location.href = `mailto:?subject=Join%20Lightning%20Ledgerz!&body=${encodeURIComponent(message)}`;
}

function shareViaTwitter(referralCode) {
    const text = `Just started using Lightning Ledgerz to manage my finances! Join me and get 2 FREE months with my referral code: ${referralCode} 🚀💰`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareViaLinkedin(referralCode) {
    const message = `I'm using Lightning Ledgerz for smarter financial management. Get 2 months free with code: ${referralCode}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function shareViaWhatsApp(referralCode, username) {
    const referralSystem_instance = new ReferralSystem();
    const message = referralSystem_instance.generateShareMessage(username, referralCode);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Check for referral code on page load
function checkReferralCode() {
    const params = new URLSearchParams(window.location.search);
    const referralCode = params.get('ref');
    
    if (referralCode && currentUser) {
        referralSystem.trackReferral(referralCode, currentUser.id);
    }
}

// Initialize global referral system
let referralSystem = new ReferralSystem();

// Setup on page load
window.addEventListener('load', checkReferralCode);

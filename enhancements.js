// =====================================================
// LIGHTNING LEDGERZ - COMPREHENSIVE ENHANCEMENTS
// Premium Features, Advanced Analytics, Modern UI
// =====================================================

(function() {
    'use strict';

    // =====================================================
    // 1. MODERN CSS INJECTION - Glassmorphism & Animations
    // =====================================================

    const enhancedStyles = document.createElement('style');
    enhancedStyles.id = 'lightning-enhancements';
    enhancedStyles.textContent = `
        /* ========== CSS VARIABLES ========== */
        :root {
            --lightning-red: #ff3333;
            --lightning-orange: #f39c12;
            --lightning-gold: #ffd700;
            --lightning-dark: #0a0a0f;
            --lightning-darker: #050508;
            --glass-bg: rgba(20, 20, 35, 0.8);
            --glass-border: rgba(255, 255, 255, 0.1);
            --success-green: #00d97e;
            --warning-yellow: #f6c343;
            --danger-red: #e63757;
            --info-blue: #39afd1;
            --gradient-fire: linear-gradient(135deg, #ff3333 0%, #f39c12 50%, #ffd700 100%);
            --gradient-ocean: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-sunset: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            --gradient-forest: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            --shadow-glow: 0 0 40px rgba(255, 51, 51, 0.3);
            --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        /* ========== GLASSMORPHISM CARDS ========== */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: var(--shadow-soft);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-glow), var(--shadow-soft);
            border-color: rgba(255, 51, 51, 0.3);
        }

        /* ========== ANIMATED GRADIENTS ========== */
        .gradient-animated {
            background: linear-gradient(-45deg, #ff3333, #f39c12, #ffd700, #ff6b35);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* ========== PULSE ANIMATIONS ========== */
        .pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
        }

        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 51, 51, 0.4); }
            50% { box-shadow: 0 0 40px rgba(255, 51, 51, 0.8); }
        }

        /* ========== FLOATING ANIMATION ========== */
        .float-animation {
            animation: floatUpDown 3s ease-in-out infinite;
        }

        @keyframes floatUpDown {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        /* ========== SHIMMER LOADING ========== */
        .shimmer {
            background: linear-gradient(90deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,0.1) 50%,
                rgba(255,255,255,0) 100%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* ========== SKELETON LOADING ========== */
        .skeleton {
            background: linear-gradient(90deg, #1a1a2e 25%, #2a2a4e 50%, #1a1a2e 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 8px;
        }

        @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* ========== ENHANCED BUTTONS ========== */
        .btn-fire {
            background: var(--gradient-fire);
            border: none;
            color: #fff;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 50px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-fire::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }

        .btn-fire:hover::before {
            left: 100%;
        }

        .btn-fire:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(255, 51, 51, 0.4);
        }

        .btn-fire:active {
            transform: scale(0.98);
        }

        /* ========== NOTIFICATION TOAST ========== */
        .toast-container {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 16px 24px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 450px;
            box-shadow: var(--shadow-soft);
            pointer-events: auto;
            animation: toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toast.toast-exit {
            animation: toastSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes toastSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        .toast-icon {
            font-size: 24px;
            flex-shrink: 0;
        }

        .toast-content {
            flex: 1;
        }

        .toast-title {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .toast-message {
            font-size: 14px;
            color: #aaa;
        }

        .toast-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 4px;
            font-size: 18px;
            transition: color 0.2s;
        }

        .toast-close:hover {
            color: #fff;
        }

        .toast-success { border-left: 4px solid var(--success-green); }
        .toast-error { border-left: 4px solid var(--danger-red); }
        .toast-warning { border-left: 4px solid var(--warning-yellow); }
        .toast-info { border-left: 4px solid var(--info-blue); }

        /* ========== PROGRESS RING ========== */
        .progress-ring {
            transform: rotate(-90deg);
        }

        .progress-ring-circle {
            transition: stroke-dashoffset 0.5s ease;
        }

        /* ========== METRIC CARDS ========== */
        .metric-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }

        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-fire);
        }

        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: #fff;
            margin: 12px 0;
        }

        .metric-label {
            color: #888;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .metric-change {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }

        .metric-change.positive {
            background: rgba(0, 217, 126, 0.15);
            color: var(--success-green);
        }

        .metric-change.negative {
            background: rgba(230, 55, 87, 0.15);
            color: var(--danger-red);
        }

        /* ========== SPARKLINE ========== */
        .sparkline {
            height: 40px;
            margin-top: 16px;
        }

        /* ========== DATA TABLE ========== */
        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        .data-table th {
            background: rgba(255, 255, 255, 0.05);
            padding: 14px 16px;
            text-align: left;
            font-weight: 600;
            color: #888;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
            border-bottom: 1px solid var(--glass-border);
        }

        .data-table td {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            transition: background 0.2s;
        }

        .data-table tr:hover td {
            background: rgba(255, 51, 51, 0.05);
        }

        /* ========== TABS ENHANCED ========== */
        .tabs-modern {
            display: flex;
            gap: 8px;
            padding: 8px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            margin-bottom: 24px;
        }

        .tab-modern {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: #888;
            cursor: pointer;
            border-radius: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .tab-modern:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
        }

        .tab-modern.active {
            background: var(--gradient-fire);
            color: #fff;
        }

        /* ========== MODAL ENHANCED ========== */
        .modal-enhanced {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal-enhanced.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-enhanced .modal-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
        }

        .modal-enhanced .modal-content {
            position: relative;
            background: linear-gradient(145deg, #1a1a2e, #0a0a15);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            padding: 32px;
            max-width: 600px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modal-enhanced.active .modal-content {
            transform: scale(1) translateY(0);
        }

        /* ========== CHARTS CONTAINER ========== */
        .chart-container {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            padding: 24px;
            position: relative;
        }

        .chart-container canvas {
            max-height: 300px;
        }

        /* ========== ACTIVITY FEED ========== */
        .activity-feed {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .activity-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            border: 1px solid transparent;
            transition: all 0.3s ease;
        }

        .activity-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--glass-border);
        }

        .activity-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .activity-icon.upload { background: rgba(57, 175, 209, 0.15); }
        .activity-icon.report { background: rgba(243, 156, 18, 0.15); }
        .activity-icon.analysis { background: rgba(0, 217, 126, 0.15); }
        .activity-icon.alert { background: rgba(230, 55, 87, 0.15); }

        .activity-content {
            flex: 1;
        }

        .activity-title {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .activity-time {
            color: #666;
            font-size: 13px;
        }

        /* ========== KEYBOARD SHORTCUT HINTS ========== */
        .kbd {
            display: inline-block;
            padding: 3px 8px;
            font-size: 12px;
            font-family: monospace;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: #888;
        }

        /* ========== COMMAND PALETTE ========== */
        .command-palette {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 600px;
            background: linear-gradient(145deg, #1a1a2e, #0a0a15);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
            z-index: 10002;
            display: none;
        }

        .command-palette.active {
            display: block;
            animation: commandPaletteIn 0.2s ease;
        }

        @keyframes commandPaletteIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .command-input {
            width: 100%;
            padding: 20px 24px;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 18px;
            outline: none;
            border-bottom: 1px solid var(--glass-border);
        }

        .command-input::placeholder {
            color: #666;
        }

        .command-results {
            max-height: 400px;
            overflow-y: auto;
            padding: 8px;
        }

        .command-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 14px 16px;
            cursor: pointer;
            border-radius: 10px;
            transition: all 0.2s;
        }

        .command-item:hover, .command-item.selected {
            background: rgba(255, 51, 51, 0.1);
        }

        .command-item-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .command-item-text {
            flex: 1;
        }

        .command-item-title {
            font-weight: 500;
        }

        .command-item-desc {
            font-size: 13px;
            color: #666;
        }

        /* ========== QUICK ACTIONS FLOATING ========== */
        .quick-actions-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
        }

        .fab-main {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--gradient-fire);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #fff;
            box-shadow: 0 8px 25px rgba(255, 51, 51, 0.4);
            transition: all 0.3s ease;
        }

        .fab-main:hover {
            transform: scale(1.1) rotate(90deg);
        }

        .fab-menu {
            position: absolute;
            bottom: 70px;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }

        .quick-actions-fab.active .fab-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .fab-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 30px;
            cursor: pointer;
            color: #fff;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s;
        }

        .fab-item:hover {
            background: rgba(255, 51, 51, 0.2);
            border-color: var(--lightning-red);
        }

        /* ========== STATUS INDICATORS ========== */
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }

        .status-dot.online { background: var(--success-green); box-shadow: 0 0 10px var(--success-green); }
        .status-dot.offline { background: #666; }
        .status-dot.warning { background: var(--warning-yellow); box-shadow: 0 0 10px var(--warning-yellow); }
        .status-dot.error { background: var(--danger-red); box-shadow: 0 0 10px var(--danger-red); }

        /* ========== ENHANCED SCROLLBAR ========== */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 51, 51, 0.3);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 51, 51, 0.5);
        }

        /* ========== TOOLTIPS ========== */
        [data-tooltip] {
            position: relative;
        }

        [data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 14px;
            background: #1a1a2e;
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            color: #fff;
            font-size: 13px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            pointer-events: none;
            z-index: 1000;
        }

        [data-tooltip]:hover::after {
            opacity: 1;
            visibility: visible;
            bottom: calc(100% + 8px);
        }

        /* ========== CONFETTI ANIMATION ========== */
        .confetti {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10003;
        }

        .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confettiFall 3s linear forwards;
        }

        @keyframes confettiFall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        /* ========== COUNTER ANIMATION ========== */
        .counter-animated {
            display: inline-block;
        }

        /* ========== TYPEWRITER EFFECT ========== */
        .typewriter {
            overflow: hidden;
            border-right: 2px solid var(--lightning-red);
            white-space: nowrap;
            animation: typewriter 3s steps(40) 1s forwards, blink 0.75s step-end infinite;
        }

        @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
        }

        @keyframes blink {
            50% { border-color: transparent; }
        }

        /* ========== RIPPLE EFFECT ========== */
        .ripple {
            position: relative;
            overflow: hidden;
        }

        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }

        /* ========== INSIGHT CARDS ========== */
        .insight-card {
            background: linear-gradient(135deg, rgba(255, 51, 51, 0.1), rgba(243, 156, 18, 0.1));
            border: 1px solid rgba(255, 51, 51, 0.2);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .insight-card h4 {
            color: var(--lightning-orange);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .insight-card p {
            color: #bbb;
            line-height: 1.6;
        }

        /* ========== COMPARISON BARS ========== */
        .comparison-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin: 8px 0;
        }

        .comparison-bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 1s ease;
        }

        .comparison-bar-fill.actual { background: var(--gradient-fire); }
        .comparison-bar-fill.budget { background: var(--info-blue); }

        /* ========== TREND INDICATOR ========== */
        .trend-up { color: var(--success-green); }
        .trend-down { color: var(--danger-red); }
        .trend-flat { color: var(--warning-yellow); }

        /* ========== RESPONSIVE GRID ========== */
        .grid-responsive {
            display: grid;
            gap: 24px;
        }

        .grid-1 { grid-template-columns: 1fr; }
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }

        @media (max-width: 1200px) {
            .grid-4 { grid-template-columns: repeat(2, 1fr); }
            .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
            .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(enhancedStyles);

    // =====================================================
    // 2. TOAST NOTIFICATION SYSTEM
    // =====================================================

    class ToastManager {
        constructor() {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }

        show(options) {
            const { type = 'info', title, message, duration = 5000 } = options;

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type]}</span>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    ${message ? `<div class="toast-message">${message}</div>` : ''}
                </div>
                <button class="toast-close">×</button>
            `;

            toast.querySelector('.toast-close').onclick = () => this.dismiss(toast);
            this.container.appendChild(toast);

            if (duration > 0) {
                setTimeout(() => this.dismiss(toast), duration);
            }

            return toast;
        }

        dismiss(toast) {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }

        success(title, message) { return this.show({ type: 'success', title, message }); }
        error(title, message) { return this.show({ type: 'error', title, message }); }
        warning(title, message) { return this.show({ type: 'warning', title, message }); }
        info(title, message) { return this.show({ type: 'info', title, message }); }
    }

    window.toast = new ToastManager();

    // =====================================================
    // 3. COMMAND PALETTE (Ctrl+K)
    // =====================================================

    class CommandPalette {
        constructor() {
            this.commands = [
                { icon: '📊', title: 'Open Dashboard', desc: 'View your financial dashboard', action: () => this.navigateTo('dashboard') },
                { icon: '📁', title: 'My Files', desc: 'Manage uploaded documents', action: () => this.navigateTo('documents') },
                { icon: '📈', title: 'Create Report', desc: 'Generate financial reports', action: () => this.openReportBuilder() },
                { icon: '🎨', title: 'Pro Decks', desc: 'Create presentations', action: () => this.openProDecks() },
                { icon: '💰', title: 'Budget Analysis', desc: 'Analyze budget vs actual', action: () => this.openBudgetAnalysis() },
                { icon: '📉', title: 'Cash Flow', desc: 'View cash flow analysis', action: () => this.openCashFlow() },
                { icon: '🔗', title: 'QuickBooks', desc: 'Sync with QuickBooks', action: () => this.navigateTo('quickbooks') },
                { icon: '👤', title: 'Profile', desc: 'View your profile', action: () => this.navigateTo('profile') },
                { icon: '⚙️', title: 'Settings', desc: 'App settings', action: () => this.openSettings() },
                { icon: '🚪', title: 'Sign Out', desc: 'Log out of your account', action: () => this.signOut() }
            ];

            this.createUI();
            this.bindShortcuts();
        }

        createUI() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'modal-enhanced';
            this.overlay.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="command-palette">
                    <input type="text" class="command-input" placeholder="Type a command or search...">
                    <div class="command-results"></div>
                </div>
            `;
            document.body.appendChild(this.overlay);

            this.input = this.overlay.querySelector('.command-input');
            this.results = this.overlay.querySelector('.command-results');
            this.palette = this.overlay.querySelector('.command-palette');

            this.overlay.querySelector('.modal-backdrop').onclick = () => this.close();
            this.input.oninput = () => this.filter();
            this.input.onkeydown = (e) => this.handleKeydown(e);

            this.render();
        }

        bindShortcuts() {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggle();
                }
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.isOpen = true;
            this.overlay.classList.add('active');
            this.palette.classList.add('active');
            this.input.value = '';
            this.input.focus();
            this.filter();
        }

        close() {
            this.isOpen = false;
            this.overlay.classList.remove('active');
            this.palette.classList.remove('active');
        }

        filter() {
            const query = this.input.value.toLowerCase();
            const filtered = this.commands.filter(cmd =>
                cmd.title.toLowerCase().includes(query) ||
                cmd.desc.toLowerCase().includes(query)
            );
            this.render(filtered);
        }

        render(commands = this.commands) {
            this.results.innerHTML = commands.map((cmd, i) => `
                <div class="command-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
                    <div class="command-item-icon">${cmd.icon}</div>
                    <div class="command-item-text">
                        <div class="command-item-title">${cmd.title}</div>
                        <div class="command-item-desc">${cmd.desc}</div>
                    </div>
                    <span class="kbd">Enter</span>
                </div>
            `).join('');

            this.results.querySelectorAll('.command-item').forEach((el, i) => {
                el.onclick = () => {
                    commands[i].action();
                    this.close();
                };
            });

            this.filteredCommands = commands;
            this.selectedIndex = 0;
        }

        handleKeydown(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectPrev();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeSelected();
            }
        }

        selectNext() {
            const items = this.results.querySelectorAll('.command-item');
            if (this.selectedIndex < items.length - 1) {
                items[this.selectedIndex].classList.remove('selected');
                this.selectedIndex++;
                items[this.selectedIndex].classList.add('selected');
                items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        }

        selectPrev() {
            const items = this.results.querySelectorAll('.command-item');
            if (this.selectedIndex > 0) {
                items[this.selectedIndex].classList.remove('selected');
                this.selectedIndex--;
                items[this.selectedIndex].classList.add('selected');
                items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        }

        executeSelected() {
            if (this.filteredCommands[this.selectedIndex]) {
                this.filteredCommands[this.selectedIndex].action();
                this.close();
            }
        }

        navigateTo(section) {
            const profile = document.getElementById('profile');
            if (profile && !profile.classList.contains('hidden')) {
                if (typeof switchProfileTab === 'function') {
                    switchProfileTab(section);
                }
            } else {
                window.location.href = `#${section}`;
            }
        }

        openReportBuilder() {
            if (typeof openReportBuilder === 'function') {
                openReportBuilder();
            } else {
                window.toast.info('Report Builder', 'Opening report builder...');
            }
        }

        openProDecks() {
            if (typeof window.openPowerPointBuilder === 'function') {
                window.openPowerPointBuilder();
            } else if (typeof openPowerPointTemplates === 'function') {
                openPowerPointTemplates();
            }
        }

        openBudgetAnalysis() {
            window.toast.info('Budget Analysis', 'Opening budget analysis...');
        }

        openCashFlow() {
            window.toast.info('Cash Flow', 'Opening cash flow analysis...');
        }

        openSettings() {
            window.settingsPanel?.open();
        }

        signOut() {
            if (typeof signOutUser === 'function') {
                signOutUser();
            }
        }
    }

    window.commandPalette = new CommandPalette();

    // =====================================================
    // 4. QUICK ACTIONS FLOATING BUTTON
    // =====================================================

    class QuickActionsButton {
        constructor() {
            this.createUI();
        }

        createUI() {
            this.container = document.createElement('div');
            this.container.className = 'quick-actions-fab';
            this.container.innerHTML = `
                <div class="fab-menu">
                    <div class="fab-item" data-action="report">
                        <span>📊</span> New Report
                    </div>
                    <div class="fab-item" data-action="deck">
                        <span>🎨</span> New Pro Deck
                    </div>
                    <div class="fab-item" data-action="upload">
                        <span>📤</span> Upload File
                    </div>
                    <div class="fab-item" data-action="analysis">
                        <span>🔍</span> Quick Analysis
                    </div>
                </div>
                <button class="fab-main">⚡</button>
            `;
            document.body.appendChild(this.container);

            this.container.querySelector('.fab-main').onclick = () => {
                this.container.classList.toggle('active');
            };

            this.container.querySelectorAll('.fab-item').forEach(item => {
                item.onclick = () => this.handleAction(item.dataset.action);
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.container.contains(e.target)) {
                    this.container.classList.remove('active');
                }
            });
        }

        handleAction(action) {
            this.container.classList.remove('active');

            switch (action) {
                case 'report':
                    if (typeof openReportBuilder === 'function') openReportBuilder();
                    else window.toast.info('Report Builder', 'Feature coming soon!');
                    break;
                case 'deck':
                    if (typeof window.generateQuickPowerPoint === 'function') window.generateQuickPowerPoint();
                    else if (typeof window.openPowerPointBuilder === 'function') window.openPowerPointBuilder();
                    else if (typeof generatePowerPoint === 'function') generatePowerPoint();
                    else window.toast.info('Pro Decks', 'Loading PowerPoint generator...');
                    break;
                case 'upload':
                    this.triggerUpload();
                    break;
                case 'analysis':
                    window.quickAnalysis?.open();
                    break;
            }
        }

        triggerUpload() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx,.xls,.pdf';
            input.multiple = true;
            input.onchange = (e) => {
                if (e.target.files.length > 0) {
                    window.toast.success('Files Selected', `${e.target.files.length} file(s) ready for upload`);
                }
            };
            input.click();
        }
    }

    // Initialize after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new QuickActionsButton());
    } else {
        new QuickActionsButton();
    }

    // =====================================================
    // 5. ANIMATED COUNTER
    // =====================================================

    function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            element.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    window.animateCounter = animateCounter;

    // =====================================================
    // 6. CONFETTI EFFECT
    // =====================================================

    function launchConfetti(duration = 3000) {
        const container = document.createElement('div');
        container.className = 'confetti';
        document.body.appendChild(container);

        const colors = ['#ff3333', '#f39c12', '#ffd700', '#00d97e', '#39afd1', '#764ba2'];

        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), duration + 2000);
    }

    window.launchConfetti = launchConfetti;

    // =====================================================
    // 7. RIPPLE EFFECT FOR BUTTONS
    // =====================================================

    document.addEventListener('click', (e) => {
        const target = e.target.closest('.ripple, .btn, button');
        if (!target || target.classList.contains('no-ripple')) return;

        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        target.style.position = 'relative';
        target.style.overflow = 'hidden';
        target.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });

    // =====================================================
    // 8. SPARKLINE CHART
    // =====================================================

    function createSparkline(container, data, color = '#ff3333') {
        const width = container.clientWidth || 150;
        const height = container.clientHeight || 40;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        container.innerHTML = `
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <defs>
                    <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.3"/>
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0"/>
                    </linearGradient>
                </defs>
                <polygon points="0,${height} ${points} ${width},${height}" fill="url(#sparkGradient)"/>
                <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>
            </svg>
        `;
    }

    window.createSparkline = createSparkline;

    // =====================================================
    // 9. PROGRESS RING
    // =====================================================

    function createProgressRing(container, percent, size = 80, strokeWidth = 8) {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percent / 100) * circumference;

        container.innerHTML = `
            <svg class="progress-ring" width="${size}" height="${size}">
                <circle
                    stroke="rgba(255,255,255,0.1)"
                    stroke-width="${strokeWidth}"
                    fill="transparent"
                    r="${radius}"
                    cx="${size/2}"
                    cy="${size/2}"
                />
                <circle
                    class="progress-ring-circle"
                    stroke="url(#ringGradient)"
                    stroke-width="${strokeWidth}"
                    stroke-linecap="round"
                    fill="transparent"
                    r="${radius}"
                    cx="${size/2}"
                    cy="${size/2}"
                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}"
                />
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#ff3333"/>
                        <stop offset="100%" style="stop-color:#f39c12"/>
                    </linearGradient>
                </defs>
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:16px;font-weight:700;">
                ${Math.round(percent)}%
            </div>
        `;
        container.style.position = 'relative';
        container.style.display = 'inline-block';
    }

    window.createProgressRing = createProgressRing;

    // =====================================================
    // 10. KEYBOARD SHORTCUTS
    // =====================================================

    const shortcuts = {
        'ctrl+k': () => window.commandPalette?.toggle(),
        'ctrl+n': () => window.quickAnalysis?.open(),
        'ctrl+r': () => { if (typeof openReportBuilder === 'function') openReportBuilder(); },
        'ctrl+p': () => { if (typeof window.openPowerPointBuilder === 'function') window.openPowerPointBuilder(); },
        'ctrl+u': () => document.querySelector('.quick-actions-fab .fab-item[data-action="upload"]')?.click(),
        'escape': () => {
            document.querySelectorAll('.modal-enhanced.active').forEach(m => m.classList.remove('active'));
            document.querySelector('.quick-actions-fab')?.classList.remove('active');
        }
    };

    document.addEventListener('keydown', (e) => {
        const key = [];
        if (e.ctrlKey || e.metaKey) key.push('ctrl');
        if (e.shiftKey) key.push('shift');
        if (e.altKey) key.push('alt');
        key.push(e.key.toLowerCase());

        const combo = key.join('+');
        if (shortcuts[combo]) {
            e.preventDefault();
            shortcuts[combo]();
        }
    });

    // =====================================================
    // 11. SETTINGS PANEL
    // =====================================================

    class SettingsPanel {
        constructor() {
            this.settings = this.loadSettings();
            this.createUI();
        }

        loadSettings() {
            try {
                return JSON.parse(localStorage.getItem('llSettings')) || {};
            } catch {
                return {};
            }
        }

        saveSettings() {
            localStorage.setItem('llSettings', JSON.stringify(this.settings));
        }

        createUI() {
            this.modal = document.createElement('div');
            this.modal.className = 'modal-enhanced';
            this.modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content" style="max-width:500px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                        <h2 style="color:#f39c12;margin:0;">⚙️ Settings</h2>
                        <button class="close-btn" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                    </div>

                    <div class="settings-section">
                        <h4 style="color:#888;margin-bottom:16px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Appearance</h4>

                        <div class="setting-item" style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                            <div>
                                <div style="font-weight:500;">Animations</div>
                                <div style="color:#666;font-size:13px;">Enable UI animations</div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="setting-animations" ${this.settings.animations !== false ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="setting-item" style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                            <div>
                                <div style="font-weight:500;">Sound Effects</div>
                                <div style="color:#666;font-size:13px;">Play sounds for actions</div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="setting-sounds" ${this.settings.sounds ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="settings-section" style="margin-top:24px;">
                        <h4 style="color:#888;margin-bottom:16px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Notifications</h4>

                        <div class="setting-item" style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                            <div>
                                <div style="font-weight:500;">Toast Notifications</div>
                                <div style="color:#666;font-size:13px;">Show notification popups</div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="setting-toasts" ${this.settings.toasts !== false ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="settings-section" style="margin-top:24px;">
                        <h4 style="color:#888;margin-bottom:16px;text-transform:uppercase;font-size:12px;letter-spacing:1px;">Keyboard Shortcuts</h4>
                        <div style="display:grid;gap:8px;">
                            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                                <span>Command Palette</span>
                                <span class="kbd">Ctrl+K</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                                <span>New Report</span>
                                <span class="kbd">Ctrl+R</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                                <span>New Pro Deck</span>
                                <span class="kbd">Ctrl+P</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:8px 0;">
                                <span>Upload File</span>
                                <span class="kbd">Ctrl+U</span>
                            </div>
                        </div>
                    </div>

                    <button class="btn-fire" style="width:100%;margin-top:24px;" onclick="window.settingsPanel.save()">
                        Save Settings
                    </button>
                </div>
            `;

            // Add switch styles
            const switchStyles = document.createElement('style');
            switchStyles.textContent = `
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                }
                .switch input { opacity: 0; width: 0; height: 0; }
                .switch .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #333;
                    border-radius: 26px;
                    transition: 0.3s;
                }
                .switch .slider:before {
                    content: "";
                    position: absolute;
                    height: 20px;
                    width: 20px;
                    left: 3px;
                    bottom: 3px;
                    background: #fff;
                    border-radius: 50%;
                    transition: 0.3s;
                }
                .switch input:checked + .slider { background: #ff3333; }
                .switch input:checked + .slider:before { transform: translateX(24px); }
            `;
            document.head.appendChild(switchStyles);

            document.body.appendChild(this.modal);

            this.modal.querySelector('.modal-backdrop').onclick = () => this.close();
            this.modal.querySelector('.close-btn').onclick = () => this.close();
        }

        open() {
            this.modal.classList.add('active');
        }

        close() {
            this.modal.classList.remove('active');
        }

        save() {
            this.settings.animations = document.getElementById('setting-animations').checked;
            this.settings.sounds = document.getElementById('setting-sounds').checked;
            this.settings.toasts = document.getElementById('setting-toasts').checked;
            this.saveSettings();
            window.toast.success('Settings Saved', 'Your preferences have been updated');
            this.close();
        }
    }

    window.settingsPanel = new SettingsPanel();

    // =====================================================
    // 12. QUICK ANALYSIS MODAL
    // =====================================================

    class QuickAnalysis {
        constructor() {
            this.createUI();
        }

        createUI() {
            this.modal = document.createElement('div');
            this.modal.className = 'modal-enhanced';
            this.modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content" style="max-width:700px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                        <h2 style="color:#f39c12;margin:0;">🔍 Quick Analysis</h2>
                        <button class="close-btn" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;">×</button>
                    </div>

                    <div class="tabs-modern">
                        <button class="tab-modern active" data-tab="health">Financial Health</button>
                        <button class="tab-modern" data-tab="trends">Trends</button>
                        <button class="tab-modern" data-tab="ratios">Key Ratios</button>
                    </div>

                    <div id="analysis-content">
                        <div class="analysis-tab active" data-tab="health">
                            <div class="grid-responsive grid-2" style="margin-bottom:24px;">
                                <div class="metric-card">
                                    <div class="metric-label">Overall Score</div>
                                    <div class="metric-value" style="color:#00d97e;">85</div>
                                    <div class="metric-change positive">▲ 5 pts</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-label">Risk Level</div>
                                    <div class="metric-value" style="color:#f39c12;">Low</div>
                                    <div class="metric-change positive">Improved</div>
                                </div>
                            </div>

                            <div class="insight-card">
                                <h4>💡 Key Insight</h4>
                                <p>Your operating cash flow has improved 23% compared to last quarter. Consider reinvesting excess cash into growth initiatives or debt reduction.</p>
                            </div>

                            <div class="insight-card">
                                <h4>⚠️ Watch Out</h4>
                                <p>Accounts receivable turnover has slowed. Average collection period is now 45 days vs. 38 days last quarter. Consider tightening credit terms.</p>
                            </div>
                        </div>

                        <div class="analysis-tab" data-tab="trends" style="display:none;">
                            <div class="chart-container" style="height:250px;margin-bottom:24px;">
                                <canvas id="trendsChart"></canvas>
                            </div>
                            <div class="grid-responsive grid-3">
                                <div style="text-align:center;">
                                    <div style="color:#888;font-size:13px;">Revenue Trend</div>
                                    <div style="font-size:24px;font-weight:700;color:#00d97e;">↑ 12%</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="color:#888;font-size:13px;">Expense Trend</div>
                                    <div style="font-size:24px;font-weight:700;color:#e63757;">↑ 8%</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="color:#888;font-size:13px;">Margin Trend</div>
                                    <div style="font-size:24px;font-weight:700;color:#00d97e;">↑ 4%</div>
                                </div>
                            </div>
                        </div>

                        <div class="analysis-tab" data-tab="ratios" style="display:none;">
                            <div style="display:flex;flex-direction:column;gap:16px;">
                                ${this.renderRatioItem('Current Ratio', 2.1, 'Industry avg: 1.8', 'positive')}
                                ${this.renderRatioItem('Quick Ratio', 1.4, 'Industry avg: 1.2', 'positive')}
                                ${this.renderRatioItem('Debt to Equity', 0.6, 'Industry avg: 0.8', 'positive')}
                                ${this.renderRatioItem('Gross Margin', '42%', 'Industry avg: 38%', 'positive')}
                                ${this.renderRatioItem('Net Margin', '12%', 'Industry avg: 10%', 'positive')}
                                ${this.renderRatioItem('ROE', '18%', 'Industry avg: 15%', 'positive')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.modal);

            this.modal.querySelector('.modal-backdrop').onclick = () => this.close();
            this.modal.querySelector('.close-btn').onclick = () => this.close();

            // Tab switching
            this.modal.querySelectorAll('.tab-modern').forEach(tab => {
                tab.onclick = () => {
                    this.modal.querySelectorAll('.tab-modern').forEach(t => t.classList.remove('active'));
                    this.modal.querySelectorAll('.analysis-tab').forEach(t => t.style.display = 'none');
                    tab.classList.add('active');
                    this.modal.querySelector(`.analysis-tab[data-tab="${tab.dataset.tab}"]`).style.display = 'block';

                    if (tab.dataset.tab === 'trends') {
                        this.renderTrendsChart();
                    }
                };
            });
        }

        renderRatioItem(name, value, benchmark, status) {
            return `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;">
                    <div>
                        <div style="font-weight:500;">${name}</div>
                        <div style="color:#666;font-size:13px;">${benchmark}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:20px;font-weight:700;">${value}</div>
                        <div class="metric-change ${status}">
                            ${status === 'positive' ? '▲ Above avg' : status === 'negative' ? '▼ Below avg' : '— Average'}
                        </div>
                    </div>
                </div>
            `;
        }

        renderTrendsChart() {
            const ctx = this.modal.querySelector('#trendsChart');
            if (!ctx || !window.Chart) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [120, 135, 142, 155, 168, 180],
                            borderColor: '#00d97e',
                            backgroundColor: 'rgba(0, 217, 126, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Expenses',
                            data: [80, 85, 88, 92, 95, 100],
                            borderColor: '#e63757',
                            backgroundColor: 'rgba(230, 55, 87, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#888' }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' }
                        }
                    }
                }
            });
        }

        open() {
            this.modal.classList.add('active');
        }

        close() {
            this.modal.classList.remove('active');
        }
    }

    window.quickAnalysis = new QuickAnalysis();

    // =====================================================
    // 13. ENHANCED PROFILE PAGE
    // =====================================================

    function enhanceProfilePage() {
        const profile = document.getElementById('profile');
        if (!profile) return;

        // Add glass effect to profile cards
        profile.querySelectorAll('.profile-card').forEach(card => {
            card.classList.add('glass-card');
        });

        // Add tab modern styles
        const tabButtons = profile.querySelector('.tab-buttons');
        if (tabButtons) {
            tabButtons.classList.add('tabs-modern');
            tabButtons.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.add('tab-modern');
            });
        }
    }

    // =====================================================
    // 14. LOADING STATES
    // =====================================================

    class LoadingManager {
        constructor() {
            this.overlayId = 'loading-overlay';
        }

        show(message = 'Loading...') {
            let overlay = document.getElementById(this.overlayId);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = this.overlayId;
                overlay.style.cssText = `
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10005;
                `;
                document.body.appendChild(overlay);
            }

            overlay.innerHTML = `
                <div class="loading-spinner" style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(255, 51, 51, 0.2);
                    border-top-color: #ff3333;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="margin-top: 20px; color: #fff; font-size: 16px;">${message}</p>
                <style>
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;
            overlay.style.display = 'flex';
        }

        hide() {
            const overlay = document.getElementById(this.overlayId);
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
    }

    window.loading = new LoadingManager();

    // =====================================================
    // 15. ACTIVITY FEED
    // =====================================================

    class ActivityFeed {
        constructor() {
            this.activities = this.load();
        }

        load() {
            try {
                return JSON.parse(localStorage.getItem('activityFeed')) || [];
            } catch {
                return [];
            }
        }

        save() {
            // Keep only last 50 activities
            this.activities = this.activities.slice(0, 50);
            localStorage.setItem('activityFeed', JSON.stringify(this.activities));
        }

        add(type, title, description = '') {
            this.activities.unshift({
                id: Date.now(),
                type,
                title,
                description,
                timestamp: new Date().toISOString()
            });
            this.save();
        }

        render(container, limit = 5) {
            const items = this.activities.slice(0, limit);
            const icons = {
                upload: '📤',
                report: '📊',
                analysis: '🔍',
                deck: '🎨',
                alert: '⚠️',
                success: '✓',
                login: '👤'
            };

            container.innerHTML = `
                <div class="activity-feed">
                    ${items.length === 0 ? '<p style="color:#666;text-align:center;padding:20px;">No recent activity</p>' : ''}
                    ${items.map(item => `
                        <div class="activity-item">
                            <div class="activity-icon ${item.type}">${icons[item.type] || '📋'}</div>
                            <div class="activity-content">
                                <div class="activity-title">${item.title}</div>
                                ${item.description ? `<div style="color:#888;font-size:13px;">${item.description}</div>` : ''}
                                <div class="activity-time">${this.formatTime(item.timestamp)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = Math.floor((now - date) / 1000);

            if (diff < 60) return 'Just now';
            if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
            return date.toLocaleDateString();
        }
    }

    window.activityFeed = new ActivityFeed();

    // =====================================================
    // 16. ENHANCED DASHBOARD
    // =====================================================

    function createEnhancedDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;

        // Check if already enhanced
        if (dashboard.querySelector('.enhanced-dashboard')) return;

        const container = dashboard.querySelector('.container') || dashboard;

        const enhancedContent = document.createElement('div');
        enhancedContent.className = 'enhanced-dashboard';
        enhancedContent.innerHTML = `
            <style>
                .enhanced-dashboard { margin-top: 20px; }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .time-filter {
                    display: flex;
                    gap: 8px;
                }
                .time-filter button {
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #888;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .time-filter button:hover, .time-filter button.active {
                    background: rgba(255, 51, 51, 0.2);
                    border-color: #ff3333;
                    color: #fff;
                }
            </style>

            <div class="dashboard-header">
                <div>
                    <h3 style="color:#f39c12;margin:0;">Dashboard Overview</h3>
                    <p style="color:#666;margin-top:5px;">Your financial snapshot at a glance</p>
                </div>
                <div class="time-filter">
                    <button class="active">This Month</button>
                    <button>Quarter</button>
                    <button>Year</button>
                </div>
            </div>

            <div class="grid-responsive grid-4" style="margin-bottom:30px;">
                <div class="metric-card">
                    <div class="metric-label">Total Revenue</div>
                    <div class="metric-value" id="dash-revenue">$0</div>
                    <div class="metric-change positive">▲ 12.5%</div>
                    <div class="sparkline" id="spark-revenue"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Net Profit</div>
                    <div class="metric-value" id="dash-profit">$0</div>
                    <div class="metric-change positive">▲ 8.2%</div>
                    <div class="sparkline" id="spark-profit"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Cash Flow</div>
                    <div class="metric-value" id="dash-cashflow">$0</div>
                    <div class="metric-change negative">▼ 3.1%</div>
                    <div class="sparkline" id="spark-cashflow"></div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Burn Rate</div>
                    <div class="metric-value" id="dash-burn">$0</div>
                    <div class="metric-change positive">▲ Improved</div>
                    <div class="sparkline" id="spark-burn"></div>
                </div>
            </div>

            <div class="grid-responsive grid-2" style="margin-bottom:30px;">
                <div class="chart-container">
                    <h4 style="color:#888;margin-bottom:16px;">Revenue vs Expenses</h4>
                    <canvas id="revenueExpenseChart" style="max-height:250px;"></canvas>
                </div>
                <div class="chart-container">
                    <h4 style="color:#888;margin-bottom:16px;">Cash Position</h4>
                    <canvas id="cashPositionChart" style="max-height:250px;"></canvas>
                </div>
            </div>

            <div class="grid-responsive grid-2">
                <div class="glass-card" style="padding:24px;">
                    <h4 style="color:#f39c12;margin-bottom:16px;">💡 AI Insights</h4>
                    <div class="insight-card">
                        <h4>Revenue Acceleration</h4>
                        <p>Your revenue growth has accelerated for 3 consecutive months. Current trajectory suggests 25% YoY growth if maintained.</p>
                    </div>
                    <div class="insight-card">
                        <h4>Cost Optimization</h4>
                        <p>Marketing spend efficiency improved 18%. Consider reallocating saved budget to R&D for product development.</p>
                    </div>
                </div>
                <div class="glass-card" style="padding:24px;">
                    <h4 style="color:#f39c12;margin-bottom:16px;">📋 Recent Activity</h4>
                    <div id="dashboard-activity"></div>
                </div>
            </div>
        `;

        container.appendChild(enhancedContent);

        // Animate counters
        setTimeout(() => {
            animateCounter(document.getElementById('dash-revenue'), 284500, 2000, '$');
            animateCounter(document.getElementById('dash-profit'), 48200, 2000, '$');
            animateCounter(document.getElementById('dash-cashflow'), 125000, 2000, '$');
            animateCounter(document.getElementById('dash-burn'), 32000, 2000, '$');

            // Create sparklines
            createSparkline(document.getElementById('spark-revenue'), [40, 45, 52, 48, 61, 58, 72, 68, 75, 82, 88, 95], '#00d97e');
            createSparkline(document.getElementById('spark-profit'), [20, 22, 25, 23, 28, 26, 32, 30, 35, 38, 42, 48], '#00d97e');
            createSparkline(document.getElementById('spark-cashflow'), [100, 95, 102, 98, 105, 92, 88, 95, 90, 85, 92, 88], '#e63757');
            createSparkline(document.getElementById('spark-burn'), [45, 42, 40, 38, 36, 35, 34, 33, 32, 31, 30, 32], '#00d97e');
        }, 500);

        // Render activity feed
        window.activityFeed.add('login', 'Dashboard Viewed', 'Accessed financial dashboard');
        const activityContainer = document.getElementById('dashboard-activity');
        if (activityContainer) {
            window.activityFeed.render(activityContainer, 4);
        }

        // Create charts if Chart.js is available
        if (window.Chart) {
            createDashboardCharts();
        }
    }

    function createDashboardCharts() {
        // Revenue vs Expenses Chart
        const revExpCtx = document.getElementById('revenueExpenseChart');
        if (revExpCtx) {
            new Chart(revExpCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [42000, 48000, 52000, 55000, 58000, 62000],
                            backgroundColor: 'rgba(0, 217, 126, 0.7)',
                            borderRadius: 6
                        },
                        {
                            label: 'Expenses',
                            data: [28000, 30000, 32000, 31000, 33000, 34000],
                            backgroundColor: 'rgba(230, 55, 87, 0.7)',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#888' } }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888', callback: v => '$' + v.toLocaleString() }
                        }
                    }
                }
            });
        }

        // Cash Position Chart
        const cashCtx = document.getElementById('cashPositionChart');
        if (cashCtx) {
            new Chart(cashCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Cash Balance',
                        data: [100000, 108000, 115000, 110000, 118000, 125000],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#888' } }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.05)' },
                            ticks: { color: '#888', callback: v => '$' + v.toLocaleString() }
                        }
                    }
                }
            });
        }
    }

    // =====================================================
    // 17. INITIALIZE ENHANCEMENTS
    // =====================================================

    function initEnhancements() {
        console.log('⚡ Lightning Ledgerz Enhancements Loading...');

        enhanceProfilePage();

        // Watch for dashboard visibility
        const dashboardObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const dashboard = document.getElementById('dashboard');
                    if (dashboard && !dashboard.classList.contains('hidden')) {
                        createEnhancedDashboard();
                    }
                }
            });
        });

        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboardObserver.observe(dashboard, { attributes: true });
            if (!dashboard.classList.contains('hidden')) {
                createEnhancedDashboard();
            }
        }

        // Show welcome toast for logged in users
        setTimeout(() => {
            if (window.currentUser || localStorage.getItem('testUserSession')) {
                const profile = window.currentUserProfile;
                if (profile) {
                    window.toast.success('Welcome back!', `Good to see you, ${profile.first_name || 'there'}!`);
                }
            }
        }, 1500);

        console.log('✓ Lightning Ledgerz Enhancements Loaded!');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

})();

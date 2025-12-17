// =====================================================
// LIGHTNING LEDGERZ - REAL ESTATE DEAL FORUM
// "Tinder for Real Estate" - Swipe through deals,
// lender bidding, comp maps, property boundaries
// =====================================================

class DealForum {
    constructor() {
        this.deals = [];
        this.currentDealIndex = 0;
        this.savedDeals = [];
        this.bids = {};
        this.filters = {
            propertyType: 'all',
            priceMin: 0,
            priceMax: 50000000,
            capRateMin: 0,
            location: 'all'
        };

        // Sample deals data (would come from API in production)
        this.sampleDeals = [
            {
                id: 'deal-001',
                title: '48-Unit Multifamily Complex',
                address: '1250 Oak Street, Austin, TX 78701',
                propertyType: 'multifamily',
                askingPrice: 8500000,
                units: 48,
                sqft: 52000,
                yearBuilt: 1998,
                capRate: 6.2,
                noi: 527000,
                occupancy: 94,
                description: 'Value-add opportunity in rapidly growing East Austin submarket. Recent renovation of 12 units. Strong rent growth potential.',
                highlights: [
                    'Below market rents with 15% upside',
                    'New roof and HVAC in 2022',
                    'Walking distance to downtown',
                    'Strong employment growth area'
                ],
                images: [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
                ],
                seller: 'Bluestone Capital',
                timeRemaining: 3600 * 72, // 72 hours
                bids: [],
                coordinates: { lat: 30.2672, lng: -97.7431 },
                comps: [
                    { address: '1180 Pine Ave', price: 8200000, capRate: 5.9, distance: 0.3 },
                    { address: '890 Cedar Blvd', price: 9100000, capRate: 6.5, distance: 0.5 },
                    { address: '2100 Maple Dr', price: 7800000, capRate: 6.0, distance: 0.8 }
                ],
                boundaries: [
                    { lat: 30.2680, lng: -97.7440 },
                    { lat: 30.2680, lng: -97.7420 },
                    { lat: 30.2660, lng: -97.7420 },
                    { lat: 30.2660, lng: -97.7440 }
                ]
            },
            {
                id: 'deal-002',
                title: 'Class A Office Building',
                address: '500 Congress Avenue, Austin, TX 78701',
                propertyType: 'office',
                askingPrice: 25000000,
                units: null,
                sqft: 125000,
                yearBuilt: 2015,
                capRate: 5.8,
                noi: 1450000,
                occupancy: 87,
                description: 'Trophy asset in prime downtown location. LEED Gold certified with panoramic city views. Long-term tenant base.',
                highlights: [
                    'LEED Gold certified',
                    '7 year average lease term',
                    'Recently renovated lobby',
                    'Parking garage included'
                ],
                images: [
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
                ],
                seller: 'Greystar Properties',
                timeRemaining: 3600 * 48,
                bids: [],
                coordinates: { lat: 30.2655, lng: -97.7467 },
                comps: [
                    { address: '600 Brazos St', price: 28000000, capRate: 5.5, distance: 0.2 },
                    { address: '301 Colorado St', price: 22000000, capRate: 6.0, distance: 0.4 }
                ],
                boundaries: [
                    { lat: 30.2665, lng: -97.7477 },
                    { lat: 30.2665, lng: -97.7457 },
                    { lat: 30.2645, lng: -97.7457 },
                    { lat: 30.2645, lng: -97.7477 }
                ]
            },
            {
                id: 'deal-003',
                title: 'Retail Strip Center',
                address: '7800 Research Blvd, Austin, TX 78758',
                propertyType: 'retail',
                askingPrice: 4200000,
                units: 8,
                sqft: 24000,
                yearBuilt: 2005,
                capRate: 7.1,
                noi: 298200,
                occupancy: 100,
                description: 'Fully stabilized neighborhood retail center anchored by national tenants. NNN leases with annual escalations.',
                highlights: [
                    '100% occupied with NNN leases',
                    'National credit tenants',
                    '3% annual rent escalations',
                    'High traffic intersection'
                ],
                images: [
                    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
                ],
                seller: 'Marcus & Millichap',
                timeRemaining: 3600 * 96,
                bids: [],
                coordinates: { lat: 30.3542, lng: -97.7387 },
                comps: [
                    { address: '8200 Burnet Rd', price: 3900000, capRate: 7.3, distance: 0.5 },
                    { address: '7500 Research Blvd', price: 4500000, capRate: 6.9, distance: 0.3 }
                ],
                boundaries: [
                    { lat: 30.3552, lng: -97.7397 },
                    { lat: 30.3552, lng: -97.7377 },
                    { lat: 30.3532, lng: -97.7377 },
                    { lat: 30.3532, lng: -97.7397 }
                ]
            },
            {
                id: 'deal-004',
                title: 'Industrial Warehouse Portfolio',
                address: '12500 Logistics Way, Round Rock, TX 78664',
                propertyType: 'industrial',
                askingPrice: 15500000,
                units: 3,
                sqft: 180000,
                yearBuilt: 2018,
                capRate: 5.5,
                noi: 852500,
                occupancy: 100,
                description: 'Three-building industrial portfolio with dock-high loading and ample parking. Strong tenant mix with e-commerce focus.',
                highlights: [
                    'Clear height 32 feet',
                    'Modern ESFR sprinkler system',
                    'Cross-dock capability',
                    'Near I-35 corridor'
                ],
                images: [
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'
                ],
                seller: 'Prologis',
                timeRemaining: 3600 * 120,
                bids: [],
                coordinates: { lat: 30.5083, lng: -97.6789 },
                comps: [
                    { address: '13000 Industrial Blvd', price: 14800000, capRate: 5.7, distance: 0.8 },
                    { address: '11800 Commerce Dr', price: 16200000, capRate: 5.3, distance: 1.2 }
                ],
                boundaries: [
                    { lat: 30.5093, lng: -97.6809 },
                    { lat: 30.5093, lng: -97.6769 },
                    { lat: 30.5073, lng: -97.6769 },
                    { lat: 30.5073, lng: -97.6809 }
                ]
            },
            {
                id: 'deal-005',
                title: 'Boutique Hotel - Downtown',
                address: '315 East 6th Street, Austin, TX 78701',
                propertyType: 'hospitality',
                askingPrice: 18000000,
                units: 85,
                sqft: 62000,
                yearBuilt: 1925,
                capRate: 6.8,
                noi: 1224000,
                occupancy: 78,
                description: 'Historic boutique hotel in the heart of 6th Street entertainment district. Recent $3M renovation. Strong RevPAR.',
                highlights: [
                    'Historic landmark status',
                    'Prime entertainment location',
                    'Rooftop bar with city views',
                    'Strong group and event revenue'
                ],
                images: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
                ],
                seller: 'HVS Hospitality',
                timeRemaining: 3600 * 36,
                bids: [],
                coordinates: { lat: 30.2676, lng: -97.7405 },
                comps: [
                    { address: '401 Brazos St', price: 20000000, capRate: 6.5, distance: 0.2 },
                    { address: '601 Red River St', price: 16500000, capRate: 7.0, distance: 0.3 }
                ],
                boundaries: [
                    { lat: 30.2686, lng: -97.7415 },
                    { lat: 30.2686, lng: -97.7395 },
                    { lat: 30.2666, lng: -97.7395 },
                    { lat: 30.2666, lng: -97.7415 }
                ]
            }
        ];

        this.deals = [...this.sampleDeals];
    }

    // Initialize the Deal Forum UI
    createForumUI() {
        const container = document.createElement('div');
        container.id = 'deal-forum';
        container.className = 'deal-forum';

        container.innerHTML = `
            <div class="deal-forum-header">
                <div class="header-left">
                    <h1>⚡ Deal Forum</h1>
                    <span class="tagline">Swipe right on your next investment</span>
                </div>
                <div class="header-actions">
                    <button class="filter-btn" onclick="dealForum.openFilters()">
                        🔍 Filters
                    </button>
                    <button class="saved-btn" onclick="dealForum.showSavedDeals()">
                        💾 Saved (${this.savedDeals.length})
                    </button>
                    <button class="close-forum-btn" onclick="dealForum.closeForumUI()">×</button>
                </div>
            </div>

            <div class="deal-forum-content">
                <div class="deal-cards-container" id="deal-cards-container">
                    ${this.renderCurrentDeal()}
                </div>

                <div class="deal-navigation">
                    <button class="nav-btn pass-btn" onclick="dealForum.passDeal()">
                        <span class="icon">👎</span>
                        <span>Pass</span>
                    </button>
                    <button class="nav-btn info-btn" onclick="dealForum.showDealDetails()">
                        <span class="icon">ℹ️</span>
                        <span>Details</span>
                    </button>
                    <button class="nav-btn bid-btn" onclick="dealForum.openBidding()">
                        <span class="icon">💰</span>
                        <span>Bid</span>
                    </button>
                    <button class="nav-btn save-btn" onclick="dealForum.saveDeal()">
                        <span class="icon">⭐</span>
                        <span>Save</span>
                    </button>
                </div>

                <div class="deal-progress">
                    <span id="deal-counter">${this.currentDealIndex + 1} of ${this.deals.length}</span>
                    <div class="progress-dots">
                        ${this.deals.map((_, i) => `
                            <span class="dot ${i === this.currentDealIndex ? 'active' : ''}"
                                  onclick="dealForum.goToDeal(${i})"></span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.addForumStyles();
        document.body.appendChild(container);

        // Start countdown timers
        this.startTimers();

        return container;
    }

    renderCurrentDeal() {
        const deal = this.deals[this.currentDealIndex];
        if (!deal) return '<p class="no-deals">No more deals matching your criteria</p>';

        const timeLeft = this.formatTimeRemaining(deal.timeRemaining);
        const isSaved = this.savedDeals.includes(deal.id);

        return `
            <div class="deal-card" id="deal-card-${deal.id}">
                <div class="deal-image" style="background-image: url('${deal.images[0]}');">
                    <div class="deal-badges">
                        <span class="property-type-badge ${deal.propertyType}">${this.formatPropertyType(deal.propertyType)}</span>
                        ${isSaved ? '<span class="saved-badge">⭐ Saved</span>' : ''}
                    </div>
                    <div class="deal-timer ${deal.timeRemaining < 86400 ? 'urgent' : ''}">
                        ⏱️ ${timeLeft}
                    </div>
                </div>

                <div class="deal-info">
                    <h2 class="deal-title">${deal.title}</h2>
                    <p class="deal-address">📍 ${deal.address}</p>

                    <div class="deal-metrics">
                        <div class="metric">
                            <span class="metric-value">$${this.formatNumber(deal.askingPrice)}</span>
                            <span class="metric-label">Asking Price</span>
                        </div>
                        <div class="metric highlight">
                            <span class="metric-value">${deal.capRate}%</span>
                            <span class="metric-label">Cap Rate</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">${deal.occupancy}%</span>
                            <span class="metric-label">Occupancy</span>
                        </div>
                        <div class="metric">
                            <span class="metric-value">$${this.formatNumber(deal.noi)}</span>
                            <span class="metric-label">NOI</span>
                        </div>
                    </div>

                    <div class="deal-highlights">
                        ${deal.highlights.slice(0, 3).map(h => `<span class="highlight-tag">✓ ${h}</span>`).join('')}
                    </div>

                    <div class="deal-bids-preview">
                        <span class="bids-count">${deal.bids.length} bids</span>
                        ${deal.bids.length > 0 ? `
                            <span class="high-bid">High: $${this.formatNumber(Math.max(...deal.bids.map(b => b.amount)))}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Deal detail modal
    showDealDetails() {
        const deal = this.deals[this.currentDealIndex];
        if (!deal) return;

        const modal = document.createElement('div');
        modal.id = 'deal-detail-modal';
        modal.className = 'deal-detail-modal';

        modal.innerHTML = `
            <div class="modal-overlay" onclick="dealForum.closeModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="dealForum.closeModal()">×</button>

                <div class="modal-header">
                    <h2>${deal.title}</h2>
                    <p class="address">📍 ${deal.address}</p>
                </div>

                <div class="modal-tabs">
                    <button class="modal-tab active" onclick="dealForum.switchModalTab('overview')">Overview</button>
                    <button class="modal-tab" onclick="dealForum.switchModalTab('comps')">Comps</button>
                    <button class="modal-tab" onclick="dealForum.switchModalTab('map')">Map</button>
                    <button class="modal-tab" onclick="dealForum.switchModalTab('bids')">Bids</button>
                </div>

                <div class="modal-tab-content" id="modal-overview">
                    <div class="deal-gallery">
                        ${deal.images.map(img => `<img src="${img}" alt="${deal.title}">`).join('')}
                    </div>

                    <div class="detail-section">
                        <h3>Property Overview</h3>
                        <p>${deal.description}</p>
                    </div>

                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Asking Price</label>
                            <span>$${this.formatNumber(deal.askingPrice)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Cap Rate</label>
                            <span>${deal.capRate}%</span>
                        </div>
                        <div class="detail-item">
                            <label>NOI</label>
                            <span>$${this.formatNumber(deal.noi)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Sq Ft</label>
                            <span>${this.formatNumber(deal.sqft)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Year Built</label>
                            <span>${deal.yearBuilt}</span>
                        </div>
                        <div class="detail-item">
                            <label>Occupancy</label>
                            <span>${deal.occupancy}%</span>
                        </div>
                        ${deal.units ? `
                        <div class="detail-item">
                            <label>Units</label>
                            <span>${deal.units}</span>
                        </div>
                        ` : ''}
                        <div class="detail-item">
                            <label>Price/SF</label>
                            <span>$${(deal.askingPrice / deal.sqft).toFixed(0)}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Investment Highlights</h3>
                        <ul class="highlights-list">
                            ${deal.highlights.map(h => `<li>✓ ${h}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section">
                        <h3>Seller Information</h3>
                        <p><strong>Listed by:</strong> ${deal.seller}</p>
                    </div>
                </div>

                <div class="modal-tab-content hidden" id="modal-comps">
                    <h3>Comparable Sales</h3>
                    <div class="comps-table">
                        <div class="comp-header">
                            <span>Address</span>
                            <span>Sale Price</span>
                            <span>Cap Rate</span>
                            <span>Distance</span>
                        </div>
                        ${deal.comps.map(comp => `
                            <div class="comp-row">
                                <span>${comp.address}</span>
                                <span>$${this.formatNumber(comp.price)}</span>
                                <span>${comp.capRate}%</span>
                                <span>${comp.distance} mi</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="comps-summary">
                        <div class="summary-item">
                            <label>Avg Comp Price</label>
                            <span>$${this.formatNumber(deal.comps.reduce((a, b) => a + b.price, 0) / deal.comps.length)}</span>
                        </div>
                        <div class="summary-item">
                            <label>Avg Cap Rate</label>
                            <span>${(deal.comps.reduce((a, b) => a + b.capRate, 0) / deal.comps.length).toFixed(1)}%</span>
                        </div>
                        <div class="summary-item ${deal.askingPrice < deal.comps.reduce((a, b) => a + b.price, 0) / deal.comps.length ? 'positive' : 'negative'}">
                            <label>vs Asking</label>
                            <span>${deal.askingPrice < deal.comps.reduce((a, b) => a + b.price, 0) / deal.comps.length ? 'Below' : 'Above'} Market</span>
                        </div>
                    </div>
                </div>

                <div class="modal-tab-content hidden" id="modal-map">
                    <h3>Property Location & Boundaries</h3>
                    <div class="map-container" id="deal-map">
                        ${this.renderStaticMap(deal)}
                    </div>
                    <div class="map-legend">
                        <span class="legend-item"><span class="color subject"></span> Subject Property</span>
                        <span class="legend-item"><span class="color comp"></span> Comparable Sales</span>
                    </div>
                </div>

                <div class="modal-tab-content hidden" id="modal-bids">
                    <h3>Current Bids</h3>
                    <div class="bid-timer-large">
                        ⏱️ Bidding closes in: <strong id="bid-timer-countdown">${this.formatTimeRemaining(deal.timeRemaining)}</strong>
                    </div>

                    ${deal.bids.length > 0 ? `
                        <div class="bids-list">
                            ${deal.bids.sort((a, b) => b.amount - a.amount).map((bid, i) => `
                                <div class="bid-item ${i === 0 ? 'leading' : ''}">
                                    <span class="bid-rank">#${i + 1}</span>
                                    <span class="bid-bidder">${bid.bidder}</span>
                                    <span class="bid-amount">$${this.formatNumber(bid.amount)}</span>
                                    <span class="bid-terms">${bid.terms}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="no-bids">No bids yet. Be the first to submit an offer!</p>
                    `}

                    <button class="btn btn-primary place-bid-btn" onclick="dealForum.openBidding()">
                        💰 Place Your Bid
                    </button>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="dealForum.saveDeal(); dealForum.closeModal();">
                        ⭐ Save Deal
                    </button>
                    <button class="btn btn-primary" onclick="dealForum.closeModal(); dealForum.openBidding();">
                        💰 Submit Bid
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    // Render static map (would integrate with real map API)
    renderStaticMap(deal) {
        const colors = ['#ff3333', '#ffd700', '#4caf50', '#2196f3'];
        return `
            <div class="static-map">
                <div class="map-placeholder">
                    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background -->
                        <rect width="400" height="300" fill="#1a1a2e"/>

                        <!-- Streets grid -->
                        <g stroke="#333" stroke-width="2">
                            <line x1="0" y1="75" x2="400" y2="75"/>
                            <line x1="0" y1="150" x2="400" y2="150"/>
                            <line x1="0" y1="225" x2="400" y2="225"/>
                            <line x1="100" y1="0" x2="100" y2="300"/>
                            <line x1="200" y1="0" x2="200" y2="300"/>
                            <line x1="300" y1="0" x2="300" y2="300"/>
                        </g>

                        <!-- Subject property boundary -->
                        <polygon points="170,120 230,120 230,180 170,180"
                            fill="rgba(255, 51, 51, 0.3)" stroke="#ff3333" stroke-width="3"/>

                        <!-- Subject property marker -->
                        <circle cx="200" cy="150" r="15" fill="#ff3333"/>
                        <text x="200" y="155" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">$</text>

                        <!-- Comp markers -->
                        ${deal.comps.map((comp, i) => {
                            const x = 80 + (i * 100);
                            const y = 80 + (i % 2 * 140);
                            return `
                                <circle cx="${x}" cy="${y}" r="10" fill="${colors[i + 1]}"/>
                                <text x="${x}" y="${y + 4}" text-anchor="middle" fill="#fff" font-size="10">${i + 1}</text>
                            `;
                        }).join('')}

                        <!-- Labels -->
                        <text x="200" y="200" text-anchor="middle" fill="#ff3333" font-size="11">Subject Property</text>
                    </svg>
                </div>
                <p class="map-note">Interactive map available with Google Maps API integration</p>
            </div>
        `;
    }

    // Open bidding modal
    openBidding() {
        const deal = this.deals[this.currentDealIndex];
        if (!deal) return;

        const modal = document.createElement('div');
        modal.id = 'bid-modal';
        modal.className = 'bid-modal';

        const currentHigh = deal.bids.length > 0 ? Math.max(...deal.bids.map(b => b.amount)) : deal.askingPrice * 0.95;
        const suggestedBid = Math.ceil(currentHigh * 1.02 / 10000) * 10000;

        modal.innerHTML = `
            <div class="modal-overlay" onclick="dealForum.closeBidModal()"></div>
            <div class="bid-modal-content">
                <button class="modal-close" onclick="dealForum.closeBidModal()">×</button>

                <h2>💰 Submit Your Bid</h2>
                <h3>${deal.title}</h3>

                <div class="bid-info">
                    <div class="bid-info-item">
                        <label>Asking Price</label>
                        <span>$${this.formatNumber(deal.askingPrice)}</span>
                    </div>
                    <div class="bid-info-item">
                        <label>Current High Bid</label>
                        <span>$${this.formatNumber(currentHigh)}</span>
                    </div>
                    <div class="bid-info-item urgent">
                        <label>Time Remaining</label>
                        <span>${this.formatTimeRemaining(deal.timeRemaining)}</span>
                    </div>
                </div>

                <form id="bid-form" onsubmit="dealForum.submitBid(event)">
                    <div class="form-group">
                        <label>Your Bid Amount *</label>
                        <div class="bid-input-wrapper">
                            <span class="currency">$</span>
                            <input type="number" id="bid-amount" required
                                min="${currentHigh + 10000}"
                                value="${suggestedBid}"
                                step="10000">
                        </div>
                        <span class="suggested">Suggested minimum: $${this.formatNumber(suggestedBid)}</span>
                    </div>

                    <div class="form-group">
                        <label>Financing Terms</label>
                        <select id="bid-terms">
                            <option value="All Cash">All Cash - Close in 30 days</option>
                            <option value="70% LTV">70% LTV Conventional - 45 days</option>
                            <option value="75% LTV">75% LTV - 60 days</option>
                            <option value="Bridge Loan">Bridge Loan - 30 days</option>
                            <option value="Assumption">Loan Assumption</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Earnest Money Deposit</label>
                        <select id="bid-emd">
                            <option value="1%">1% - Standard</option>
                            <option value="2%">2% - Stronger</option>
                            <option value="3%">3% - Very Strong</option>
                            <option value="5%">5% - Aggressive</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Due Diligence Period</label>
                        <select id="bid-dd">
                            <option value="30 days">30 days - Standard</option>
                            <option value="21 days">21 days</option>
                            <option value="14 days">14 days - Expedited</option>
                            <option value="7 days">7 days - Very Expedited</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Bidder Name / Company *</label>
                        <input type="text" id="bid-bidder" required placeholder="Acme Capital LLC">
                    </div>

                    <div class="form-group">
                        <label>Contact Email *</label>
                        <input type="email" id="bid-email" required placeholder="investor@company.com">
                    </div>

                    <div class="bid-disclaimer">
                        By submitting this bid, you acknowledge this is a non-binding Letter of Intent
                        and agree to our terms of service.
                    </div>

                    <button type="submit" class="btn btn-primary submit-bid-btn">
                        🚀 Submit Bid
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    // Submit bid
    submitBid(event) {
        event.preventDefault();

        const deal = this.deals[this.currentDealIndex];
        const amount = parseInt(document.getElementById('bid-amount').value);
        const terms = document.getElementById('bid-terms').value;
        const bidder = document.getElementById('bid-bidder').value;
        const email = document.getElementById('bid-email').value;
        const emd = document.getElementById('bid-emd').value;
        const dd = document.getElementById('bid-dd').value;

        // Add bid
        deal.bids.push({
            amount,
            terms: `${terms}, ${emd} EMD, ${dd} DD`,
            bidder,
            email,
            timestamp: Date.now()
        });

        // Close modal and show success
        this.closeBidModal();

        // Show success message
        const toast = document.createElement('div');
        toast.className = 'bid-toast success';
        toast.innerHTML = `
            <span class="icon">✓</span>
            <span>Bid submitted successfully!</span>
            <span class="amount">$${this.formatNumber(amount)}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('active'), 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Update UI
        this.updateDealCard();
    }

    // Navigation methods
    passDeal() {
        this.animateCard('left');
        setTimeout(() => this.nextDeal(), 300);
    }

    saveDeal() {
        const deal = this.deals[this.currentDealIndex];
        if (!deal) return;

        if (!this.savedDeals.includes(deal.id)) {
            this.savedDeals.push(deal.id);
            this.showToast('Deal saved!', 'success');
        } else {
            this.showToast('Already saved', 'info');
        }

        this.updateDealCard();
        this.updateSavedCount();
    }

    nextDeal() {
        if (this.currentDealIndex < this.deals.length - 1) {
            this.currentDealIndex++;
            this.updateDealCard();
        } else {
            this.showToast("You've seen all deals!", 'info');
        }
    }

    goToDeal(index) {
        this.currentDealIndex = index;
        this.updateDealCard();
    }

    // Animation
    animateCard(direction) {
        const card = document.querySelector('.deal-card');
        if (card) {
            card.classList.add(`swipe-${direction}`);
        }
    }

    // Update methods
    updateDealCard() {
        const container = document.getElementById('deal-cards-container');
        if (container) {
            container.innerHTML = this.renderCurrentDeal();
        }

        // Update counter and dots
        const counter = document.getElementById('deal-counter');
        if (counter) {
            counter.textContent = `${this.currentDealIndex + 1} of ${this.deals.length}`;
        }

        document.querySelectorAll('.progress-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentDealIndex);
        });
    }

    updateSavedCount() {
        const savedBtn = document.querySelector('.saved-btn');
        if (savedBtn) {
            savedBtn.innerHTML = `💾 Saved (${this.savedDeals.length})`;
        }
    }

    // Tab switching in modal
    switchModalTab(tabName) {
        document.querySelectorAll('.modal-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.add('hidden'));

        event.target.classList.add('active');
        document.getElementById(`modal-${tabName}`).classList.remove('hidden');
    }

    // Timer methods
    startTimers() {
        setInterval(() => {
            this.deals.forEach(deal => {
                if (deal.timeRemaining > 0) {
                    deal.timeRemaining--;
                }
            });
            this.updateDealCard();
        }, 1000);
    }

    formatTimeRemaining(seconds) {
        if (seconds <= 0) return 'Expired';

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }

    // Utility methods
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toLocaleString();
    }

    formatPropertyType(type) {
        const types = {
            multifamily: 'Multifamily',
            office: 'Office',
            retail: 'Retail',
            industrial: 'Industrial',
            hospitality: 'Hotel'
        };
        return types[type] || type;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `bid-toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('active'), 10);
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // Modal controls
    closeModal() {
        const modal = document.getElementById('deal-detail-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    closeBidModal() {
        const modal = document.getElementById('bid-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Open/close forum
    openForumUI() {
        let forum = document.getElementById('deal-forum');
        if (!forum) {
            forum = this.createForumUI();
        }
        forum.classList.add('active');
    }

    closeForumUI() {
        const forum = document.getElementById('deal-forum');
        if (forum) {
            forum.classList.remove('active');
        }
    }

    // Show saved deals
    showSavedDeals() {
        if (this.savedDeals.length === 0) {
            this.showToast('No saved deals yet', 'info');
            return;
        }

        // Filter to saved deals only
        this.deals = this.sampleDeals.filter(d => this.savedDeals.includes(d.id));
        this.currentDealIndex = 0;
        this.updateDealCard();
        this.showToast(`Showing ${this.savedDeals.length} saved deals`, 'success');
    }

    // Filters
    openFilters() {
        const modal = document.createElement('div');
        modal.id = 'filter-modal';
        modal.className = 'filter-modal';

        modal.innerHTML = `
            <div class="modal-overlay" onclick="dealForum.closeFilterModal()"></div>
            <div class="filter-modal-content">
                <button class="modal-close" onclick="dealForum.closeFilterModal()">×</button>
                <h2>🔍 Filter Deals</h2>

                <div class="filter-group">
                    <label>Property Type</label>
                    <div class="filter-chips">
                        <button class="chip ${this.filters.propertyType === 'all' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'all')">All</button>
                        <button class="chip ${this.filters.propertyType === 'multifamily' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'multifamily')">Multifamily</button>
                        <button class="chip ${this.filters.propertyType === 'office' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'office')">Office</button>
                        <button class="chip ${this.filters.propertyType === 'retail' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'retail')">Retail</button>
                        <button class="chip ${this.filters.propertyType === 'industrial' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'industrial')">Industrial</button>
                        <button class="chip ${this.filters.propertyType === 'hospitality' ? 'active' : ''}"
                            onclick="dealForum.setFilter('propertyType', 'hospitality')">Hotel</button>
                    </div>
                </div>

                <div class="filter-group">
                    <label>Price Range</label>
                    <div class="price-range">
                        <input type="number" id="price-min" placeholder="Min" value="${this.filters.priceMin}">
                        <span>to</span>
                        <input type="number" id="price-max" placeholder="Max" value="${this.filters.priceMax}">
                    </div>
                </div>

                <div class="filter-group">
                    <label>Minimum Cap Rate</label>
                    <input type="range" id="cap-rate-filter" min="0" max="10" step="0.5"
                        value="${this.filters.capRateMin}"
                        oninput="document.getElementById('cap-rate-value').textContent = this.value + '%'">
                    <span id="cap-rate-value">${this.filters.capRateMin}%</span>
                </div>

                <div class="filter-actions">
                    <button class="btn btn-outline" onclick="dealForum.resetFilters()">Reset</button>
                    <button class="btn btn-primary" onclick="dealForum.applyFilters()">Apply Filters</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }

    setFilter(key, value) {
        this.filters[key] = value;

        // Update chip UI
        if (key === 'propertyType') {
            document.querySelectorAll('.filter-chips .chip').forEach(chip => {
                chip.classList.toggle('active', chip.textContent.toLowerCase().includes(value) || (value === 'all' && chip.textContent === 'All'));
            });
        }
    }

    applyFilters() {
        this.filters.priceMin = parseInt(document.getElementById('price-min')?.value) || 0;
        this.filters.priceMax = parseInt(document.getElementById('price-max')?.value) || 50000000;
        this.filters.capRateMin = parseFloat(document.getElementById('cap-rate-filter')?.value) || 0;

        // Apply filters
        this.deals = this.sampleDeals.filter(deal => {
            if (this.filters.propertyType !== 'all' && deal.propertyType !== this.filters.propertyType) return false;
            if (deal.askingPrice < this.filters.priceMin || deal.askingPrice > this.filters.priceMax) return false;
            if (deal.capRate < this.filters.capRateMin) return false;
            return true;
        });

        this.currentDealIndex = 0;
        this.closeFilterModal();
        this.updateDealCard();
        this.showToast(`Found ${this.deals.length} matching deals`, 'success');
    }

    resetFilters() {
        this.filters = {
            propertyType: 'all',
            priceMin: 0,
            priceMax: 50000000,
            capRateMin: 0,
            location: 'all'
        };
        this.deals = [...this.sampleDeals];
        this.currentDealIndex = 0;
        this.closeFilterModal();
        this.updateDealCard();
    }

    closeFilterModal() {
        const modal = document.getElementById('filter-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Add styles
    addForumStyles() {
        if (document.getElementById('deal-forum-styles')) return;

        const style = document.createElement('style');
        style.id = 'deal-forum-styles';
        style.textContent = `
            .deal-forum {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%);
                z-index: 10000;
                overflow-y: auto;
            }

            .deal-forum.active {
                display: block;
            }

            .deal-forum-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
            }

            .header-left h1 {
                color: #ff3333;
                margin: 0;
                font-size: 1.8rem;
            }

            .header-left .tagline {
                color: #888;
                font-size: 0.9rem;
            }

            .header-actions {
                display: flex;
                gap: 1rem;
            }

            .filter-btn, .saved-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .filter-btn:hover, .saved-btn:hover {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
            }

            .close-forum-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
            }

            .deal-forum-content {
                max-width: 600px;
                margin: 2rem auto;
                padding: 0 1rem;
            }

            .deal-card {
                background: #1a1a2e;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
            }

            .deal-card.swipe-left {
                transform: translateX(-150%) rotate(-15deg);
                opacity: 0;
            }

            .deal-card.swipe-right {
                transform: translateX(150%) rotate(15deg);
                opacity: 0;
            }

            .deal-image {
                height: 250px;
                background-size: cover;
                background-position: center;
                position: relative;
            }

            .deal-badges {
                position: absolute;
                top: 15px;
                left: 15px;
                display: flex;
                gap: 0.5rem;
            }

            .property-type-badge {
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
            }

            .property-type-badge.multifamily { background: #4caf50; color: #fff; }
            .property-type-badge.office { background: #2196f3; color: #fff; }
            .property-type-badge.retail { background: #ff9800; color: #fff; }
            .property-type-badge.industrial { background: #9c27b0; color: #fff; }
            .property-type-badge.hospitality { background: #e91e63; color: #fff; }

            .saved-badge {
                background: #ffd700;
                color: #000;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
            }

            .deal-timer {
                position: absolute;
                bottom: 15px;
                right: 15px;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
            }

            .deal-timer.urgent {
                background: #ff3333;
                animation: pulse 1s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .deal-info {
                padding: 1.5rem;
            }

            .deal-title {
                color: #fff;
                margin: 0 0 0.5rem 0;
                font-size: 1.4rem;
            }

            .deal-address {
                color: #888;
                margin: 0 0 1rem 0;
                font-size: 0.9rem;
            }

            .deal-metrics {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .metric {
                text-align: center;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .metric.highlight {
                background: rgba(255, 51, 51, 0.2);
                border: 1px solid rgba(255, 51, 51, 0.4);
            }

            .metric-value {
                display: block;
                color: #fff;
                font-weight: bold;
                font-size: 1.1rem;
            }

            .metric-label {
                display: block;
                color: #888;
                font-size: 0.7rem;
                text-transform: uppercase;
            }

            .deal-highlights {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .highlight-tag {
                background: rgba(76, 175, 80, 0.2);
                color: #4caf50;
                padding: 0.3rem 0.6rem;
                border-radius: 5px;
                font-size: 0.75rem;
            }

            .deal-bids-preview {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .bids-count {
                color: #888;
            }

            .high-bid {
                color: #ffd700;
                font-weight: bold;
            }

            /* Navigation */
            .deal-navigation {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin: 2rem 0;
            }

            .nav-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.3rem;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                padding: 1rem 1.5rem;
                border-radius: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .nav-btn .icon {
                font-size: 1.5rem;
            }

            .nav-btn span:last-child {
                font-size: 0.8rem;
            }

            .nav-btn:hover {
                transform: translateY(-3px);
            }

            .nav-btn.pass-btn:hover {
                background: rgba(244, 67, 54, 0.3);
                border-color: #f44336;
            }

            .nav-btn.save-btn:hover {
                background: rgba(255, 215, 0, 0.3);
                border-color: #ffd700;
            }

            .nav-btn.bid-btn:hover {
                background: rgba(76, 175, 80, 0.3);
                border-color: #4caf50;
            }

            .nav-btn.info-btn:hover {
                background: rgba(33, 150, 243, 0.3);
                border-color: #2196f3;
            }

            /* Progress */
            .deal-progress {
                text-align: center;
            }

            #deal-counter {
                color: #888;
                font-size: 0.9rem;
            }

            .progress-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 0.5rem;
            }

            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .dot.active {
                background: #ff3333;
                transform: scale(1.2);
            }

            .dot:hover {
                background: rgba(255, 51, 51, 0.5);
            }

            /* Modals */
            .deal-detail-modal, .bid-modal, .filter-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
            }

            .deal-detail-modal.active, .bid-modal.active, .filter-modal.active {
                display: block;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
            }

            .modal-content, .bid-modal-content, .filter-modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #ff3333;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2rem;
            }

            .bid-modal-content, .filter-modal-content {
                max-width: 500px;
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
            }

            .modal-header h2 {
                color: #ff3333;
                margin: 0 0 0.5rem 0;
            }

            .modal-header .address {
                color: #888;
                margin: 0 0 1rem 0;
            }

            .modal-tabs {
                display: flex;
                gap: 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 1.5rem;
            }

            .modal-tab {
                background: none;
                border: none;
                color: #888;
                padding: 1rem 1.5rem;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .modal-tab:hover {
                color: #fff;
            }

            .modal-tab.active {
                color: #ff3333;
                border-bottom-color: #ff3333;
            }

            .modal-tab-content.hidden {
                display: none;
            }

            .deal-gallery {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                overflow-x: auto;
            }

            .deal-gallery img {
                height: 200px;
                border-radius: 10px;
            }

            .detail-section {
                margin-bottom: 1.5rem;
            }

            .detail-section h3 {
                color: #ffd700;
                margin-bottom: 0.5rem;
            }

            .detail-section p {
                color: #ccc;
            }

            .detail-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .detail-item {
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
            }

            .detail-item label {
                display: block;
                color: #888;
                font-size: 0.8rem;
                margin-bottom: 0.3rem;
            }

            .detail-item span {
                display: block;
                color: #fff;
                font-weight: bold;
                font-size: 1.1rem;
            }

            .highlights-list {
                list-style: none;
                padding: 0;
            }

            .highlights-list li {
                color: #4caf50;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            /* Comps Table */
            .comps-table {
                margin-bottom: 1.5rem;
            }

            .comp-header, .comp-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 1rem;
                padding: 0.75rem;
            }

            .comp-header {
                background: rgba(255, 51, 51, 0.2);
                border-radius: 8px;
                color: #ff3333;
                font-weight: bold;
            }

            .comp-row {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                color: #ccc;
            }

            .comps-summary {
                display: flex;
                gap: 1rem;
            }

            .summary-item {
                flex: 1;
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
            }

            .summary-item.positive span {
                color: #4caf50;
            }

            .summary-item.negative span {
                color: #f44336;
            }

            /* Map */
            .map-container {
                background: #0a0a1a;
                border-radius: 15px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .static-map {
                text-align: center;
            }

            .map-placeholder svg {
                width: 100%;
                max-width: 400px;
                border-radius: 10px;
            }

            .map-note {
                color: #666;
                font-size: 0.8rem;
                margin-top: 0.5rem;
            }

            .map-legend {
                display: flex;
                justify-content: center;
                gap: 2rem;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #888;
                font-size: 0.9rem;
            }

            .legend-item .color {
                width: 16px;
                height: 16px;
                border-radius: 50%;
            }

            .legend-item .color.subject {
                background: #ff3333;
            }

            .legend-item .color.comp {
                background: #ffd700;
            }

            /* Bids */
            .bid-timer-large {
                background: rgba(255, 51, 51, 0.2);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
                margin-bottom: 1.5rem;
                color: #fff;
            }

            .bids-list {
                margin-bottom: 1.5rem;
            }

            .bid-item {
                display: grid;
                grid-template-columns: auto 1fr auto auto;
                gap: 1rem;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 10px;
                margin-bottom: 0.5rem;
                align-items: center;
            }

            .bid-item.leading {
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4caf50;
            }

            .bid-rank {
                background: #ff3333;
                color: #fff;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .bid-bidder {
                color: #fff;
            }

            .bid-amount {
                color: #ffd700;
                font-weight: bold;
            }

            .bid-terms {
                color: #888;
                font-size: 0.85rem;
            }

            .no-bids {
                text-align: center;
                color: #888;
                padding: 2rem;
            }

            .place-bid-btn {
                width: 100%;
            }

            .modal-footer {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Bid Form */
            .bid-info {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .bid-info-item {
                background: rgba(0, 0, 0, 0.3);
                padding: 1rem;
                border-radius: 10px;
                text-align: center;
            }

            .bid-info-item label {
                display: block;
                color: #888;
                font-size: 0.8rem;
            }

            .bid-info-item span {
                display: block;
                color: #fff;
                font-weight: bold;
            }

            .bid-info-item.urgent span {
                color: #ff3333;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                color: #aaa;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .bid-input-wrapper {
                display: flex;
                align-items: center;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                overflow: hidden;
            }

            .bid-input-wrapper .currency {
                padding: 0 1rem;
                color: #ffd700;
                font-size: 1.2rem;
            }

            .bid-input-wrapper input {
                flex: 1;
                background: none;
                border: none;
                padding: 0.75rem;
                color: #fff;
                font-size: 1.2rem;
            }

            .form-group .suggested {
                display: block;
                color: #888;
                font-size: 0.8rem;
                margin-top: 0.3rem;
            }

            .form-group select,
            .form-group input[type="text"],
            .form-group input[type="email"] {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: #fff;
                font-size: 1rem;
            }

            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #ff3333;
            }

            .bid-disclaimer {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                padding: 1rem;
                border-radius: 10px;
                color: #ffc107;
                font-size: 0.85rem;
                margin-bottom: 1rem;
            }

            .submit-bid-btn {
                width: 100%;
                padding: 1rem !important;
                font-size: 1.1rem !important;
            }

            /* Toast */
            .bid-toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #333;
                color: #fff;
                padding: 1rem 2rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: all 0.3s ease;
                z-index: 10002;
            }

            .bid-toast.active {
                transform: translateX(-50%) translateY(0);
            }

            .bid-toast.success {
                background: #4caf50;
            }

            .bid-toast.info {
                background: #2196f3;
            }

            .bid-toast .amount {
                font-weight: bold;
                color: #ffd700;
            }

            /* Filter Modal */
            .filter-group {
                margin-bottom: 1.5rem;
            }

            .filter-group label {
                display: block;
                color: #aaa;
                margin-bottom: 0.5rem;
            }

            .filter-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .chip {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ccc;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .chip:hover, .chip.active {
                background: rgba(255, 51, 51, 0.2);
                border-color: #ff3333;
                color: #ff3333;
            }

            .price-range {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .price-range input {
                flex: 1;
                padding: 0.75rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #fff;
            }

            .price-range span {
                color: #888;
            }

            .filter-group input[type="range"] {
                width: 100%;
                accent-color: #ff3333;
            }

            #cap-rate-value {
                display: inline-block;
                background: rgba(255, 51, 51, 0.2);
                padding: 0.3rem 0.6rem;
                border-radius: 5px;
                color: #ff3333;
                margin-left: 1rem;
            }

            .filter-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .deal-forum-header {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }

                .deal-metrics {
                    grid-template-columns: repeat(2, 1fr);
                }

                .detail-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .bid-info {
                    grid-template-columns: 1fr;
                }

                .modal-content {
                    width: 95%;
                    padding: 1rem;
                }

                .comp-header, .comp-row {
                    grid-template-columns: 1fr 1fr;
                }

                .nav-btn {
                    padding: 0.75rem 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize Deal Forum
const dealForum = new DealForum();

// Global function to open deal forum
window.openDealForum = function() {
    dealForum.openForumUI();
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DealForum;
}

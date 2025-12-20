// =====================================================
// LIGHTNING LEDGERZ - DECK VISUAL ENHANCEMENTS
// =====================================================
// Professional backgrounds, gradients, lines, and shapes

class DeckVisuals {
    constructor() {
        // High-quality stock background images (Unsplash - free to use)
        this.backgroundImages = {
            // City Skylines
            'nyc-night': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=80',
            'nyc-skyline': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80',
            'manhattan': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1920&q=80',
            'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
            'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
            'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80',
            'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80',
            'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1920&q=80',
            'hong-kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1920&q=80',
            'shanghai': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1920&q=80',

            // Office/Business
            'office-modern': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
            'meeting-room': 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1920&q=80',
            'skyscraper': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
            'glass-building': 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=1920&q=80',
            'corporate': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1920&q=80',

            // Abstract/Tech
            'abstract-blue': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
            'abstract-dark': 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1920&q=80',
            'tech-grid': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
            'network': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
            'data-center': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80',

            // Nature/Landscape
            'mountains': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
            'ocean': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
            'forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
            'sunrise': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&q=80',

            // Gradients/Solid
            'gradient-blue': 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #22d3ee 100%)',
            'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            'gradient-green': 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
            'gradient-purple': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
            'gradient-gold': 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
            'gradient-red': 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)'
        };

        // Gradient overlays for images
        this.overlays = {
            'dark': 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)',
            'dark-bottom': 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)',
            'dark-left': 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
            'blue-tint': 'linear-gradient(135deg, rgba(0,51,102,0.85) 0%, rgba(0,102,153,0.7) 50%, rgba(0,153,204,0.5) 100%)',
            'teal-tint': 'linear-gradient(135deg, rgba(0,77,77,0.85) 0%, rgba(0,128,128,0.7) 50%, rgba(0,179,179,0.5) 100%)',
            'green-tint': 'linear-gradient(135deg, rgba(0,51,25,0.85) 0%, rgba(0,102,51,0.7) 100%)',
            'gold-tint': 'linear-gradient(135deg, rgba(102,51,0,0.8) 0%, rgba(153,102,0,0.6) 100%)',
            'purple-tint': 'linear-gradient(135deg, rgba(51,0,102,0.85) 0%, rgba(102,0,153,0.7) 100%)',
            'none': 'none'
        };

        // Accent line styles
        this.lineStyles = {
            'gold': { color: '#c9a227', width: 3 },
            'gold-thin': { color: '#c9a227', width: 1 },
            'teal': { color: '#00a3a3', width: 3 },
            'white': { color: '#ffffff', width: 2 },
            'gradient-gold': { gradient: 'linear-gradient(90deg, transparent, #c9a227, transparent)', width: 2 },
            'gradient-teal': { gradient: 'linear-gradient(90deg, transparent, #00a3a3, transparent)', width: 2 }
        };

        // Pre-built visual themes
        this.visualThemes = {
            'cbre-corporate': {
                background: 'nyc-night',
                overlay: 'teal-tint',
                accentLine: 'gold',
                textColor: '#ffffff',
                accentColor: '#c9a227',
                font: "'Georgia', serif"
            },
            'modern-dark': {
                background: 'gradient-dark',
                overlay: 'none',
                accentLine: 'teal',
                textColor: '#ffffff',
                accentColor: '#00d4ff',
                font: "'Segoe UI', sans-serif"
            },
            'executive-blue': {
                background: 'skyscraper',
                overlay: 'blue-tint',
                accentLine: 'white',
                textColor: '#ffffff',
                accentColor: '#ffffff',
                font: "'Georgia', serif"
            },
            'tech-forward': {
                background: 'abstract-dark',
                overlay: 'dark',
                accentLine: 'gradient-teal',
                textColor: '#ffffff',
                accentColor: '#00ff88',
                font: "'Segoe UI', sans-serif"
            },
            'luxury-gold': {
                background: 'manhattan',
                overlay: 'dark',
                accentLine: 'gold',
                textColor: '#ffffff',
                accentColor: '#d4af37',
                font: "'Playfair Display', Georgia, serif"
            }
        };
    }

    // Get background style (handles both images and gradients)
    getBackgroundStyle(bgKey, overlayKey = 'dark') {
        const bg = this.backgroundImages[bgKey];
        const overlay = this.overlays[overlayKey];

        if (!bg) return 'background: #1a1a1a;';

        if (bg.startsWith('linear-gradient')) {
            // It's a gradient background
            return `background: ${bg};`;
        } else {
            // It's an image URL
            if (overlay && overlay !== 'none') {
                return `background: ${overlay}, url('${bg}'); background-size: cover; background-position: center;`;
            }
            return `background: url('${bg}'); background-size: cover; background-position: center;`;
        }
    }

    // Create decorative accent line SVG
    createAccentLine(style = 'gold', width = '100%', position = 'top') {
        const lineConfig = this.lineStyles[style] || this.lineStyles['gold'];

        if (lineConfig.gradient) {
            return `
                <div style="
                    position: absolute;
                    ${position}: 30px;
                    left: 5%;
                    width: 90%;
                    height: ${lineConfig.width}px;
                    background: ${lineConfig.gradient};
                "></div>
            `;
        }

        return `
            <div style="
                position: absolute;
                ${position}: 30px;
                left: 5%;
                width: 90%;
                height: ${lineConfig.width}px;
                background: ${lineConfig.color};
            "></div>
        `;
    }

    // Create corner accent shapes
    createCornerAccent(position = 'top-left', color = '#c9a227', size = 100) {
        const positions = {
            'top-left': 'top: 0; left: 0;',
            'top-right': 'top: 0; right: 0; transform: scaleX(-1);',
            'bottom-left': 'bottom: 0; left: 0; transform: scaleY(-1);',
            'bottom-right': 'bottom: 0; right: 0; transform: scale(-1);'
        };

        return `
            <svg style="position: absolute; ${positions[position]} width: ${size}px; height: ${size}px; opacity: 0.6;" viewBox="0 0 100 100">
                <path d="M0,0 L100,0 L100,10 L10,10 L10,100 L0,100 Z" fill="${color}"/>
            </svg>
        `;
    }

    // Create geometric decorative shape
    createGeometricShape(type = 'triangle', color = '#c9a227', size = 150, position = 'bottom-right') {
        const shapes = {
            triangle: `<polygon points="0,${size} ${size},${size} ${size},0" fill="${color}" opacity="0.15"/>`,
            circle: `<circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}" opacity="0.1"/>`,
            diamond: `<polygon points="${size/2},0 ${size},${size/2} ${size/2},${size} 0,${size/2}" fill="${color}" opacity="0.1"/>`,
            hexagon: `<polygon points="${size*0.5},0 ${size},${size*0.25} ${size},${size*0.75} ${size*0.5},${size} 0,${size*0.75} 0,${size*0.25}" fill="${color}" opacity="0.1"/>`
        };

        const posStyles = {
            'bottom-right': 'bottom: 0; right: 0;',
            'bottom-left': 'bottom: 0; left: 0;',
            'top-right': 'top: 0; right: 0;',
            'top-left': 'top: 0; left: 0;'
        };

        return `
            <svg style="position: absolute; ${posStyles[position]} width: ${size}px; height: ${size}px; pointer-events: none;" viewBox="0 0 ${size} ${size}">
                ${shapes[type] || shapes.triangle}
            </svg>
        `;
    }

    // Create text with shadow for readability on images
    createStyledText(text, options = {}) {
        const {
            fontSize = '3rem',
            fontWeight = '300',
            color = '#ffffff',
            textShadow = '2px 2px 8px rgba(0,0,0,0.8)',
            fontFamily = "'Georgia', serif",
            letterSpacing = '2px',
            textTransform = 'none',
            maxWidth = '80%'
        } = options;

        return `
            <div style="
                font-size: ${fontSize};
                font-weight: ${fontWeight};
                color: ${color};
                text-shadow: ${textShadow};
                font-family: ${fontFamily};
                letter-spacing: ${letterSpacing};
                text-transform: ${textTransform};
                max-width: ${maxWidth};
                line-height: 1.2;
            ">${text}</div>
        `;
    }

    // Create a professional title slide (CBRE style)
    createCorporateTitleSlide(data = {}) {
        const {
            title = 'Company Name',
            subtitle = 'Presentation Title',
            date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            background = 'nyc-night',
            overlay = 'teal-tint',
            accentColor = '#c9a227'
        } = data;

        return `
            <div style="
                width: 100%;
                height: 100%;
                ${this.getBackgroundStyle(background, overlay)}
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 60px;
                box-sizing: border-box;
            ">
                ${this.createAccentLine('gold-thin', '90%', 'top')}
                ${this.createAccentLine('gold-thin', '90%', 'bottom')}

                <div style="position: relative; z-index: 1;">
                    ${this.createStyledText(title, {
                        fontSize: '2.8rem',
                        fontWeight: '400',
                        letterSpacing: '3px',
                        textTransform: 'uppercase'
                    })}

                    ${this.createStyledText(subtitle, {
                        fontSize: '2.2rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    })}

                    <div style="margin-top: 80px;">
                        ${this.createStyledText(date, {
                            fontSize: '1.2rem',
                            fontWeight: '400',
                            color: accentColor,
                            textShadow: 'none',
                            letterSpacing: '2px'
                        })}
                    </div>
                </div>

                ${this.createGeometricShape('triangle', accentColor, 200, 'bottom-right')}
            </div>
        `;
    }

    // Create a content slide with image box
    createImageBoxSlide(data = {}) {
        const {
            title = 'Slide Title',
            content = [],
            imageUrl = this.backgroundImages['skyscraper'],
            imagePosition = 'right', // 'left', 'right', 'top', 'bottom'
            accentColor = '#0066cc'
        } = data;

        const isHorizontal = imagePosition === 'left' || imagePosition === 'right';
        const imageFirst = imagePosition === 'left' || imagePosition === 'top';

        return `
            <div style="
                width: 100%;
                height: 100%;
                background: #ffffff;
                display: flex;
                flex-direction: ${isHorizontal ? 'row' : 'column'};
                ${imageFirst ? '' : 'flex-direction: ' + (isHorizontal ? 'row-reverse' : 'column-reverse') + ';'}
            ">
                <!-- Image Section -->
                <div style="
                    ${isHorizontal ? 'width: 45%;' : 'height: 40%;'}
                    background: url('${imageUrl}');
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    box-shadow: ${imagePosition === 'right' ? '-10px 0 30px rgba(0,0,0,0.2)' : '10px 0 30px rgba(0,0,0,0.2)'};
                ">
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(0,102,204,0.3) 0%, rgba(0,51,102,0.5) 100%);
                    "></div>
                </div>

                <!-- Content Section -->
                <div style="
                    flex: 1;
                    padding: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                ">
                    <div style="
                        font-size: 2rem;
                        font-weight: 600;
                        color: ${accentColor};
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 3px solid ${accentColor};
                    ">${title}</div>

                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${content.map(item => `
                            <div style="
                                display: flex;
                                align-items: flex-start;
                                gap: 15px;
                                font-size: 1.1rem;
                                color: #333;
                                line-height: 1.5;
                            ">
                                <span style="color: ${accentColor}; font-size: 1.2rem;">●</span>
                                <span>${item}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Create a full-bleed image slide with text overlay
    createFullBleedSlide(data = {}) {
        const {
            title = 'Section Title',
            subtitle = '',
            background = 'manhattan',
            overlay = 'dark-left',
            accentColor = '#c9a227',
            textAlign = 'left'
        } = data;

        return `
            <div style="
                width: 100%;
                height: 100%;
                ${this.getBackgroundStyle(background, overlay)}
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: ${textAlign === 'center' ? 'center' : 'flex-start'};
                padding: 60px;
                box-sizing: border-box;
            ">
                ${this.createAccentLine('gold-thin', '90%', 'top')}

                <div style="
                    max-width: ${textAlign === 'center' ? '80%' : '60%'};
                    text-align: ${textAlign};
                ">
                    <div style="
                        width: 80px;
                        height: 4px;
                        background: ${accentColor};
                        margin-bottom: 30px;
                        ${textAlign === 'center' ? 'margin-left: auto; margin-right: auto;' : ''}
                    "></div>

                    ${this.createStyledText(title, {
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        letterSpacing: '2px'
                    })}

                    ${subtitle ? `
                        <div style="margin-top: 20px;">
                            ${this.createStyledText(subtitle, {
                                fontSize: '1.4rem',
                                fontWeight: '300',
                                color: 'rgba(255,255,255,0.8)',
                                textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
                            })}
                        </div>
                    ` : ''}
                </div>

                ${this.createGeometricShape('triangle', accentColor, 180, 'bottom-right')}
                ${this.createAccentLine('gold-thin', '90%', 'bottom')}
            </div>
        `;
    }

    // Create stats/metrics slide with visual flair
    createMetricsSlide(data = {}) {
        const {
            title = 'Key Metrics',
            metrics = [],
            background = 'gradient-dark',
            accentColor = '#00d4ff'
        } = data;

        return `
            <div style="
                width: 100%;
                height: 100%;
                ${this.getBackgroundStyle(background, 'none')}
                position: relative;
                padding: 50px;
                box-sizing: border-box;
            ">
                ${this.createAccentLine('gradient-teal', '90%', 'top')}

                <div style="
                    font-size: 2rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 40px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid ${accentColor};
                    display: inline-block;
                ">${title}</div>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(${Math.min(metrics.length, 4)}, 1fr);
                    gap: 30px;
                    margin-top: 30px;
                ">
                    ${metrics.map((m, i) => `
                        <div style="
                            background: rgba(255,255,255,0.05);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 12px;
                            padding: 30px;
                            text-align: center;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 4px;
                                background: ${accentColor};
                            "></div>

                            <div style="
                                font-size: 0.85rem;
                                color: rgba(255,255,255,0.6);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                margin-bottom: 15px;
                            ">${m.label}</div>

                            <div style="
                                font-size: 2.8rem;
                                font-weight: 700;
                                color: #ffffff;
                                margin-bottom: 10px;
                            ">${m.value}</div>

                            ${m.change ? `
                                <div style="
                                    font-size: 1rem;
                                    color: ${m.positive !== false ? '#4ade80' : '#f87171'};
                                    font-weight: 600;
                                ">${m.change}</div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>

                ${this.createGeometricShape('hexagon', accentColor, 150, 'bottom-right')}
            </div>
        `;
    }

    // Create a thank you slide with style
    createThankYouSlide(data = {}) {
        const {
            title = 'Thank You',
            subtitle = 'Questions?',
            contact = '',
            background = 'nyc-skyline',
            overlay = 'dark',
            accentColor = '#c9a227'
        } = data;

        return `
            <div style="
                width: 100%;
                height: 100%;
                ${this.getBackgroundStyle(background, overlay)}
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 60px;
                box-sizing: border-box;
            ">
                ${this.createAccentLine('gold-thin', '60%', 'top')}

                <div style="
                    width: 100px;
                    height: 4px;
                    background: ${accentColor};
                    margin-bottom: 40px;
                "></div>

                ${this.createStyledText(title, {
                    fontSize: '4rem',
                    fontWeight: '300',
                    letterSpacing: '4px'
                })}

                <div style="margin-top: 20px;">
                    ${this.createStyledText(subtitle, {
                        fontSize: '1.8rem',
                        fontWeight: '300',
                        color: 'rgba(255,255,255,0.8)'
                    })}
                </div>

                ${contact ? `
                    <div style="margin-top: 50px;">
                        ${this.createStyledText(contact, {
                            fontSize: '1rem',
                            fontWeight: '400',
                            color: accentColor,
                            textShadow: 'none'
                        })}
                    </div>
                ` : ''}

                <div style="
                    width: 100px;
                    height: 4px;
                    background: ${accentColor};
                    margin-top: 40px;
                "></div>

                ${this.createAccentLine('gold-thin', '60%', 'bottom')}
            </div>
        `;
    }
}

// Initialize global instance
window.deckVisuals = new DeckVisuals();

// Patch the deck builder to use enhanced visuals
if (window.proDeckBuilder) {
    // Store original render methods
    const originalRenderTitleSlide = window.proDeckBuilder.renderTitleSlide?.bind(window.proDeckBuilder);
    const originalRenderThankYouSlide = window.proDeckBuilder.renderThankYouSlide?.bind(window.proDeckBuilder);
    const originalRenderExecutiveSummarySlide = window.proDeckBuilder.renderExecutiveSummarySlide?.bind(window.proDeckBuilder);

    // Override with enhanced versions
    window.proDeckBuilder.renderTitleSlide = function(data, theme) {
        return window.deckVisuals.createCorporateTitleSlide({
            title: data.title || 'Company Name',
            subtitle: data.subtitle || 'Presentation',
            date: data.date,
            background: data.background || 'nyc-night',
            overlay: data.overlay || 'teal-tint',
            accentColor: data.accentColor || '#c9a227'
        });
    };

    window.proDeckBuilder.renderThankYouSlide = function(data, theme) {
        return window.deckVisuals.createThankYouSlide({
            title: data.title || 'Thank You',
            subtitle: data.subtitle || 'Questions?',
            contact: data.contactEmail || data.contactPhone || '',
            background: data.background || 'nyc-skyline',
            overlay: 'dark',
            accentColor: '#c9a227'
        });
    };

    window.proDeckBuilder.renderSectionDividerSlide = function(data, theme) {
        return window.deckVisuals.createFullBleedSlide({
            title: data.title || 'Section',
            subtitle: data.subtitle || '',
            background: data.background || 'manhattan',
            overlay: 'dark-left',
            accentColor: '#c9a227'
        });
    };

    // Add background selector to slide editing
    window.proDeckBuilder.availableBackgrounds = Object.keys(window.deckVisuals.backgroundImages);
}

console.log('✅ Deck Visuals Enhancement loaded');

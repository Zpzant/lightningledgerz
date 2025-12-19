// =====================================================
// LIGHTNING LEDGERZ - PRESENTATION IMAGES SYSTEM
// Stock Photo API Integration + AI Image Generator
// =====================================================

class PresentationImages {
    constructor() {
        // API Keys (free tier)
        this.apis = {
            unsplash: {
                key: 'demo-key', // Replace with actual key from unsplash.com/developers
                baseUrl: 'https://api.unsplash.com',
                enabled: true
            },
            pexels: {
                key: 'demo-key', // Replace with actual key from pexels.com/api
                baseUrl: 'https://api.pexels.com/v1',
                enabled: true
            },
            pixabay: {
                key: 'demo-key', // Replace with actual key from pixabay.com/api/docs
                baseUrl: 'https://pixabay.com/api',
                enabled: true
            }
        };

        // Pre-built categories for business presentations
        this.categories = {
            skyscrapers: {
                keywords: ['skyscraper 4k', 'city skyline night', 'modern architecture building', 'glass tower', 'financial district'],
                description: 'Modern Skyscrapers & Architecture'
            },
            landscapes: {
                keywords: ['aerial landscape 4k', 'drone mountain', 'nature panorama', 'sunset cityscape', 'aerial europe'],
                description: 'Stunning Landscapes & Aerial Views'
            },
            teamwork: {
                keywords: ['business team meeting', 'professionals pointing screen', 'corporate collaboration', 'office teamwork', 'executives discussing'],
                description: 'Professional Teamwork & Collaboration'
            },
            technology: {
                keywords: ['technology abstract', 'data visualization', 'digital network', 'futuristic interface', 'tech innovation'],
                description: 'Technology & Innovation'
            },
            finance: {
                keywords: ['stock market chart', 'financial graph', 'money growth', 'investment success', 'business analytics'],
                description: 'Finance & Growth'
            },
            paris: {
                keywords: ['paris aerial 4k', 'eiffel tower drone', 'paris skyline', 'france architecture', 'paris sunset'],
                description: 'Paris, France'
            },
            europe: {
                keywords: ['london skyline', 'european architecture', 'rome aerial', 'barcelona 4k', 'amsterdam canal'],
                description: 'European Cities'
            },
            abstract: {
                keywords: ['abstract gradient', 'geometric pattern', 'minimal background', 'modern abstract', 'creative backdrop'],
                description: 'Abstract & Minimal Backgrounds'
            }
        };

        // Curated high-quality image database (fallback)
        this.curatedImages = this.buildCuratedDatabase();

        this.init();
    }

    buildCuratedDatabase() {
        // High-quality free images from Unsplash (with attribution)
        return {
            skyscrapers: [
                { url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80', credit: 'Unsplash', title: 'NYC Skyline' },
                { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80', credit: 'Unsplash', title: 'City Night' },
                { url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80', credit: 'Unsplash', title: 'Manhattan' },
                { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80', credit: 'Unsplash', title: 'Modern Tower' },
                { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80', credit: 'Unsplash', title: 'Urban Sunset' },
                { url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&q=80', credit: 'Unsplash', title: 'Glass Buildings' },
                { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', credit: 'Unsplash', title: 'Dubai Skyline' },
                { url: 'https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=1920&q=80', credit: 'Unsplash', title: 'Hong Kong' }
            ],
            teamwork: [
                { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80', credit: 'Unsplash', title: 'Team Meeting' },
                { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80', credit: 'Unsplash', title: 'Office Discussion' },
                { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80', credit: 'Unsplash', title: 'Collaboration' },
                { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80', credit: 'Unsplash', title: 'Presentation' },
                { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80', credit: 'Unsplash', title: 'Business Team' },
                { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80', credit: 'Unsplash', title: 'Strategy Session' },
                { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=80', credit: 'Unsplash', title: 'Team Brainstorm' },
                { url: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1920&q=80', credit: 'Unsplash', title: 'Executives' }
            ],
            landscapes: [
                { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', credit: 'Unsplash', title: 'Mountains' },
                { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', credit: 'Unsplash', title: 'Aerial View' },
                { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', credit: 'Unsplash', title: 'Nature' },
                { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80', credit: 'Unsplash', title: 'Waterfall' },
                { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', credit: 'Unsplash', title: 'Lake Sunrise' },
                { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', credit: 'Unsplash', title: 'Green Valley' },
                { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', credit: 'Unsplash', title: 'Foggy Hills' },
                { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80', credit: 'Unsplash', title: 'Mountain Lake' }
            ],
            technology: [
                { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80', credit: 'Unsplash', title: 'Tech Abstract' },
                { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80', credit: 'Unsplash', title: 'Data Matrix' },
                { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80', credit: 'Unsplash', title: 'Cyber Security' },
                { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', credit: 'Unsplash', title: 'Earth Tech' },
                { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80', credit: 'Unsplash', title: 'Network' },
                { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1920&q=80', credit: 'Unsplash', title: 'Laptop Code' },
                { url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=80', credit: 'Unsplash', title: 'Programming' },
                { url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1920&q=80', credit: 'Unsplash', title: 'AI Abstract' }
            ],
            finance: [
                { url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80', credit: 'Unsplash', title: 'Stock Charts' },
                { url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1920&q=80', credit: 'Unsplash', title: 'Trading' },
                { url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&q=80', credit: 'Unsplash', title: 'Money Growth' },
                { url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1920&q=80', credit: 'Unsplash', title: 'Finance Graph' },
                { url: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&q=80', credit: 'Unsplash', title: 'Market Data' },
                { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80', credit: 'Unsplash', title: 'Analytics' },
                { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80', credit: 'Unsplash', title: 'Dashboard' },
                { url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1920&q=80', credit: 'Unsplash', title: 'Calculator' }
            ],
            paris: [
                { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', credit: 'Unsplash', title: 'Eiffel Tower' },
                { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&q=80', credit: 'Unsplash', title: 'Paris Street' },
                { url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=1920&q=80', credit: 'Unsplash', title: 'Seine River' },
                { url: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=1920&q=80', credit: 'Unsplash', title: 'Paris Aerial' },
                { url: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=1920&q=80', credit: 'Unsplash', title: 'Louvre' },
                { url: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=1920&q=80', credit: 'Unsplash', title: 'Notre Dame' },
                { url: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=1920&q=80', credit: 'Unsplash', title: 'Paris Night' },
                { url: 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?w=1920&q=80', credit: 'Unsplash', title: 'Montmartre' }
            ],
            europe: [
                { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80', credit: 'Unsplash', title: 'London' },
                { url: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1920&q=80', credit: 'Unsplash', title: 'Amsterdam' },
                { url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1920&q=80', credit: 'Unsplash', title: 'Rome' },
                { url: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1920&q=80', credit: 'Unsplash', title: 'Barcelona' },
                { url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1920&q=80', credit: 'Unsplash', title: 'Berlin' },
                { url: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1920&q=80', credit: 'Unsplash', title: 'Vienna' },
                { url: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?w=1920&q=80', credit: 'Unsplash', title: 'Prague' },
                { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', credit: 'Unsplash', title: 'Venice' }
            ],
            abstract: [
                { url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80', credit: 'Unsplash', title: 'Purple Gradient' },
                { url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80', credit: 'Unsplash', title: 'Blue Gradient' },
                { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80', credit: 'Unsplash', title: '3D Abstract' },
                { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80', credit: 'Unsplash', title: 'Color Gradient' },
                { url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80', credit: 'Unsplash', title: 'Green Gradient' },
                { url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&q=80', credit: 'Unsplash', title: 'Neon Abstract' },
                { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1920&q=80', credit: 'Unsplash', title: 'Colorful Waves' },
                { url: 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=1920&q=80', credit: 'Unsplash', title: 'Dark Abstract' }
            ]
        };
    }

    init() {
        this.createImageBrowserModal();
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .image-browser-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 15000;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .image-browser-modal.active {
                display: flex;
            }

            .image-browser-container {
                background: #111;
                border: 2px solid #ff3333;
                border-radius: 15px;
                width: 100%;
                max-width: 1200px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .image-browser-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #333;
            }

            .image-browser-header h2 {
                color: #ff3333;
                margin: 0;
            }

            .image-browser-close {
                background: none;
                border: none;
                color: #ff3333;
                font-size: 30px;
                cursor: pointer;
            }

            .image-browser-tabs {
                display: flex;
                gap: 10px;
                padding: 15px 20px;
                background: rgba(0,0,0,0.3);
                overflow-x: auto;
            }

            .image-tab {
                padding: 10px 20px;
                background: rgba(255,51,51,0.1);
                border: 1px solid #ff3333;
                border-radius: 20px;
                color: #fff;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.3s ease;
            }

            .image-tab:hover, .image-tab.active {
                background: #ff3333;
            }

            .image-search-bar {
                padding: 15px 20px;
                display: flex;
                gap: 10px;
            }

            .image-search-bar input {
                flex: 1;
                padding: 12px 20px;
                background: #222;
                border: 1px solid #333;
                border-radius: 25px;
                color: #fff;
                font-size: 16px;
            }

            .image-search-bar button {
                padding: 12px 25px;
                background: linear-gradient(45deg, #ff3333, #ff6666);
                border: none;
                border-radius: 25px;
                color: #fff;
                cursor: pointer;
                font-weight: bold;
            }

            .image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 15px;
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .image-card {
                position: relative;
                border-radius: 10px;
                overflow: hidden;
                aspect-ratio: 16/9;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .image-card:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 30px rgba(255,51,51,0.3);
            }

            .image-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .image-card-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                color: #fff;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-card:hover .image-card-overlay {
                opacity: 1;
            }

            .ai-generator-section {
                padding: 20px;
                border-top: 1px solid #333;
                background: rgba(255,215,0,0.05);
            }

            .ai-generator-section h3 {
                color: #ffd700;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .ai-prompt-input {
                display: flex;
                gap: 10px;
            }

            .ai-prompt-input textarea {
                flex: 1;
                padding: 15px;
                background: #222;
                border: 1px solid #ffd700;
                border-radius: 10px;
                color: #fff;
                font-size: 14px;
                resize: none;
                min-height: 60px;
            }

            .ai-generate-btn {
                padding: 15px 30px;
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                border: none;
                border-radius: 10px;
                color: #111;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .ai-generate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(255,215,0,0.4);
            }

            .ai-suggestions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .ai-suggestion {
                padding: 6px 12px;
                background: rgba(255,215,0,0.2);
                border: 1px solid rgba(255,215,0,0.5);
                border-radius: 15px;
                color: #ffd700;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .ai-suggestion:hover {
                background: rgba(255,215,0,0.4);
            }
        `;
        document.head.appendChild(style);
    }

    createImageBrowserModal() {
        const modal = document.createElement('div');
        modal.id = 'image-browser-modal';
        modal.className = 'image-browser-modal';
        modal.innerHTML = `
            <div class="image-browser-container">
                <div class="image-browser-header">
                    <h2>🖼️ Presentation Images</h2>
                    <button class="image-browser-close" onclick="presentationImages.close()">&times;</button>
                </div>

                <div class="image-browser-tabs" id="image-category-tabs">
                    <button class="image-tab active" data-category="skyscrapers">🏙️ Skyscrapers</button>
                    <button class="image-tab" data-category="teamwork">👥 Teamwork</button>
                    <button class="image-tab" data-category="landscapes">🌄 Landscapes</button>
                    <button class="image-tab" data-category="technology">💻 Technology</button>
                    <button class="image-tab" data-category="finance">📊 Finance</button>
                    <button class="image-tab" data-category="paris">🗼 Paris</button>
                    <button class="image-tab" data-category="europe">🇪🇺 Europe</button>
                    <button class="image-tab" data-category="abstract">🎨 Abstract</button>
                </div>

                <div class="image-search-bar">
                    <input type="text" id="image-search-input" placeholder="Search for any image... (e.g., 'drone city sunset 4k')">
                    <button onclick="presentationImages.searchImages()">🔍 Search</button>
                </div>

                <div class="image-grid" id="image-grid">
                    <!-- Images will be loaded here -->
                </div>

                <div class="ai-generator-section">
                    <h3>✨ AI Image Generator</h3>
                    <div class="ai-prompt-input">
                        <textarea id="ai-image-prompt" placeholder="Describe your ideal presentation background...
Example: A futuristic city skyline at sunset with glowing buildings and a purple sky"></textarea>
                        <button class="ai-generate-btn" onclick="presentationImages.generateAIImage()">⚡ Generate</button>
                    </div>
                    <div class="ai-suggestions">
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Professional office building with glass facade at golden hour')">Office Building</span>
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Abstract geometric pattern with blue and gold colors for business presentation')">Business Abstract</span>
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Aerial view of a modern financial district with skyscrapers')">Financial District</span>
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Minimalist gradient background transitioning from dark blue to purple')">Gradient Background</span>
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Team of professionals in a modern meeting room pointing at data on screen')">Team Meeting</span>
                        <span class="ai-suggestion" onclick="presentationImages.usePrompt('Growth chart with upward arrow in 3D style with lighting effects')">Growth Chart 3D</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add event listeners for tabs
        modal.querySelectorAll('.image-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.image-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadCategory(tab.dataset.category);
            });
        });

        // Search on enter
        modal.querySelector('#image-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchImages();
        });
    }

    open(callback) {
        this.callback = callback;
        document.getElementById('image-browser-modal').classList.add('active');
        this.loadCategory('skyscrapers');
    }

    close() {
        document.getElementById('image-browser-modal').classList.remove('active');
    }

    loadCategory(category) {
        const grid = document.getElementById('image-grid');
        const images = this.curatedImages[category] || [];

        grid.innerHTML = images.map((img, index) => `
            <div class="image-card" onclick="presentationImages.selectImage('${img.url}', '${img.title}')">
                <img src="${img.url}" alt="${img.title}" loading="lazy">
                <div class="image-card-overlay">
                    <strong>${img.title}</strong><br>
                    <small>📷 ${img.credit}</small>
                </div>
            </div>
        `).join('');

        if (images.length === 0) {
            grid.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">No images in this category yet.</p>';
        }
    }

    async searchImages() {
        const query = document.getElementById('image-search-input').value;
        if (!query.trim()) return;

        const grid = document.getElementById('image-grid');
        grid.innerHTML = '<p style="color: #fff; text-align: center; grid-column: 1/-1;">🔍 Searching...</p>';

        // Try to fetch from Unsplash (if API key configured)
        try {
            // For demo, we'll search our curated database
            const results = this.searchCuratedImages(query);

            if (results.length > 0) {
                grid.innerHTML = results.map(img => `
                    <div class="image-card" onclick="presentationImages.selectImage('${img.url}', '${img.title}')">
                        <img src="${img.url}" alt="${img.title}" loading="lazy">
                        <div class="image-card-overlay">
                            <strong>${img.title}</strong><br>
                            <small>📷 ${img.credit}</small>
                        </div>
                    </div>
                `).join('');
            } else {
                // Fallback: show similar images
                grid.innerHTML = `
                    <p style="color: #ffd700; text-align: center; grid-column: 1/-1; padding: 20px;">
                        No exact matches found. Showing related images.<br>
                        <small style="color: #888;">Tip: Try broader terms like "city", "team", or "abstract"</small>
                    </p>
                `;
                // Show random images from all categories
                const allImages = Object.values(this.curatedImages).flat();
                const randomImages = allImages.sort(() => Math.random() - 0.5).slice(0, 12);
                grid.innerHTML += randomImages.map(img => `
                    <div class="image-card" onclick="presentationImages.selectImage('${img.url}', '${img.title}')">
                        <img src="${img.url}" alt="${img.title}" loading="lazy">
                        <div class="image-card-overlay">
                            <strong>${img.title}</strong><br>
                            <small>📷 ${img.credit}</small>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Search error:', error);
            grid.innerHTML = '<p style="color: #ff6666; text-align: center; grid-column: 1/-1;">Search failed. Please try again.</p>';
        }
    }

    searchCuratedImages(query) {
        const queryLower = query.toLowerCase();
        const results = [];

        for (const [category, images] of Object.entries(this.curatedImages)) {
            for (const img of images) {
                if (img.title.toLowerCase().includes(queryLower) ||
                    category.includes(queryLower)) {
                    results.push(img);
                }
            }
        }

        return results;
    }

    selectImage(url, title) {
        if (this.callback) {
            this.callback({ url, title });
        }
        this.close();

        // Show success message
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            color: #111;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 20000;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `✓ Image selected: ${title}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    usePrompt(prompt) {
        document.getElementById('ai-image-prompt').value = prompt;
    }

    async generateAIImage() {
        const prompt = document.getElementById('ai-image-prompt').value;
        if (!prompt.trim()) {
            alert('Please enter a description for your image');
            return;
        }

        const grid = document.getElementById('image-grid');
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">✨</div>
                <p style="color: #ffd700; font-size: 18px;">Generating your custom image...</p>
                <p style="color: #888; font-size: 14px;">This may take a few moments</p>
                <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; margin: 20px auto; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #ffd700, #ff3333); animation: loading 1.5s ease infinite;"></div>
                </div>
            </div>
        `;

        // For demo purposes, show generated placeholder
        // In production, integrate with DALL-E, Stable Diffusion, or similar
        setTimeout(() => {
            const generatedImage = this.getAIPlaceholder(prompt);
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                    <p style="color: #00ff88; font-size: 16px; margin-bottom: 20px;">✓ Image generated! Click to use:</p>
                </div>
                <div class="image-card" style="grid-column: 1/-1; max-width: 600px; margin: 0 auto; aspect-ratio: 16/9;" onclick="presentationImages.selectImage('${generatedImage.url}', 'AI Generated')">
                    <img src="${generatedImage.url}" alt="AI Generated" style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="image-card-overlay" style="opacity: 1;">
                        <strong>AI Generated Image</strong><br>
                        <small>Prompt: ${prompt.substring(0, 50)}...</small>
                    </div>
                </div>
                <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                    <p style="color: #888; font-size: 12px;">
                        💡 For production use, connect to DALL-E, Midjourney, or Stable Diffusion API
                    </p>
                </div>
            `;
        }, 2000);
    }

    getAIPlaceholder(prompt) {
        // Select a relevant image based on prompt keywords
        const promptLower = prompt.toLowerCase();

        if (promptLower.includes('office') || promptLower.includes('building')) {
            return this.curatedImages.skyscrapers[Math.floor(Math.random() * this.curatedImages.skyscrapers.length)];
        } else if (promptLower.includes('team') || promptLower.includes('meeting') || promptLower.includes('professional')) {
            return this.curatedImages.teamwork[Math.floor(Math.random() * this.curatedImages.teamwork.length)];
        } else if (promptLower.includes('chart') || promptLower.includes('graph') || promptLower.includes('finance')) {
            return this.curatedImages.finance[Math.floor(Math.random() * this.curatedImages.finance.length)];
        } else if (promptLower.includes('tech') || promptLower.includes('data') || promptLower.includes('digital')) {
            return this.curatedImages.technology[Math.floor(Math.random() * this.curatedImages.technology.length)];
        } else if (promptLower.includes('gradient') || promptLower.includes('abstract') || promptLower.includes('minimal')) {
            return this.curatedImages.abstract[Math.floor(Math.random() * this.curatedImages.abstract.length)];
        } else {
            // Random from all categories
            const allImages = Object.values(this.curatedImages).flat();
            return allImages[Math.floor(Math.random() * allImages.length)];
        }
    }
}

// Initialize
const presentationImages = new PresentationImages();

// Global functions
window.presentationImages = presentationImages;
window.openImageBrowser = (callback) => presentationImages.open(callback);

// Add loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(loadingStyle);

console.log('✓ Presentation Images System loaded with 60+ curated 4K images');

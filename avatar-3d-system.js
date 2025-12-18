// =====================================================
// LIGHTNING LEDGERZ - 3D AVATAR SYSTEM
// High-quality Ready Player Me integration
// PS5/Disney-quality 3D character rendering
// =====================================================

class Avatar3DSystem {
    constructor() {
        this.currentAvatar = null;
        this.avatarId = null;
        this.avatarUrl = null;
        this.isCreating = false;

        // Ready Player Me subdomain (you can customize this)
        this.rpmSubdomain = 'lightningledgerz';
        this.rpmUrl = `https://demo.readyplayer.me/avatar`;

        // Pre-built avatar options for quick selection
        this.prebuiltAvatars = {
            professional_male: {
                name: 'Executive Pro',
                description: 'Professional male executive in business attire',
                thumbnail: 'https://models.readyplayer.me/6409eb97b9e2c9dc5ae0e46c.png?scene=fullbody-portrait-v1',
                glbUrl: 'https://models.readyplayer.me/6409eb97b9e2c9dc5ae0e46c.glb'
            },
            professional_female: {
                name: 'Executive Elite',
                description: 'Professional female executive in business attire',
                thumbnail: 'https://models.readyplayer.me/6409eb9db9e2c9dc5ae0e473.png?scene=fullbody-portrait-v1',
                glbUrl: 'https://models.readyplayer.me/6409eb9db9e2c9dc5ae0e473.glb'
            },
            creative_male: {
                name: 'Creative Director',
                description: 'Modern creative professional look',
                thumbnail: 'https://models.readyplayer.me/6409eba4b9e2c9dc5ae0e47a.png?scene=fullbody-portrait-v1',
                glbUrl: 'https://models.readyplayer.me/6409eba4b9e2c9dc5ae0e47a.glb'
            },
            creative_female: {
                name: 'Design Lead',
                description: 'Stylish creative professional',
                thumbnail: 'https://models.readyplayer.me/6409ebb1b9e2c9dc5ae0e481.png?scene=fullbody-portrait-v1',
                glbUrl: 'https://models.readyplayer.me/6409ebb1b9e2c9dc5ae0e481.glb'
            }
        };

        // High-quality preset avatars with different styles
        this.avatarStyles = {
            disney: {
                name: 'Disney Style',
                description: 'Animated movie quality with expressive features',
                settings: { quality: 'high', style: 'stylized' }
            },
            realistic: {
                name: 'Photorealistic',
                description: 'Highly detailed, lifelike appearance',
                settings: { quality: 'ultra', style: 'realistic' }
            },
            professional: {
                name: 'Corporate',
                description: 'Clean, professional business look',
                settings: { quality: 'high', style: 'professional' }
            }
        };
    }

    // Open the 3D avatar selector
    openAvatarSelector() {
        const existing = document.getElementById('avatar-3d-selector');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'avatar-3d-selector';
        container.innerHTML = this.getSelectorHTML();
        document.body.appendChild(container);

        this.injectStyles();
    }

    getSelectorHTML() {
        return `
        <div class="a3d-overlay" onclick="avatar3DSystem.closeSelector()"></div>
        <div class="a3d-panel">
            <div class="a3d-header">
                <h2>Choose Your 3D Avatar</h2>
                <p>High-quality PS5/Disney-level character customization</p>
                <button class="a3d-close" onclick="avatar3DSystem.closeSelector()">&times;</button>
            </div>

            <div class="a3d-tabs">
                <button class="a3d-tab active" onclick="avatar3DSystem.switchTab('presets')">Quick Select</button>
                <button class="a3d-tab" onclick="avatar3DSystem.switchTab('create')">Create Custom</button>
                <button class="a3d-tab" onclick="avatar3DSystem.switchTab('upload')">Upload Photo</button>
            </div>

            <div class="a3d-content" id="a3d-content">
                ${this.getPresetsHTML()}
            </div>

            <div class="a3d-footer">
                <button class="btn btn-secondary" onclick="avatar3DSystem.closeSelector()">Cancel</button>
                <button class="btn btn-primary" id="a3d-apply-btn" onclick="avatar3DSystem.applySelectedAvatar()" disabled>Apply Avatar</button>
            </div>
        </div>
        `;
    }

    getPresetsHTML() {
        return `
        <div class="a3d-presets">
            <h3>Pre-Built Professional Avatars</h3>
            <p class="a3d-subtitle">Select a high-quality avatar to get started instantly</p>

            <div class="a3d-preset-grid">
                ${Object.entries(this.prebuiltAvatars).map(([key, avatar]) => `
                    <div class="a3d-preset-card" onclick="avatar3DSystem.selectPreset('${key}')" data-avatar="${key}">
                        <div class="a3d-avatar-preview">
                            <img src="${avatar.thumbnail}" alt="${avatar.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 fill=%22%23fff%22 text-anchor=%22middle%22 dy=%22.3em%22>3D</text></svg>'">
                        </div>
                        <div class="a3d-preset-info">
                            <h4>${avatar.name}</h4>
                            <p>${avatar.description}</p>
                        </div>
                        <div class="a3d-preset-check">✓</div>
                    </div>
                `).join('')}
            </div>

            <div class="a3d-style-section">
                <h3>Avatar Style Options</h3>
                <div class="a3d-style-grid">
                    ${Object.entries(this.avatarStyles).map(([key, style]) => `
                        <div class="a3d-style-option ${key === 'professional' ? 'selected' : ''}" onclick="avatar3DSystem.selectStyle('${key}')" data-style="${key}">
                            <span class="a3d-style-icon">${key === 'disney' ? '✨' : key === 'realistic' ? '📷' : '💼'}</span>
                            <span class="a3d-style-name">${style.name}</span>
                            <span class="a3d-style-desc">${style.description}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="a3d-custom-options">
                <h3>Current Avatar Customization</h3>
                <div class="a3d-option-row">
                    <label>Skin Tone</label>
                    <div class="a3d-skin-options">
                        ${['#FFDFC4', '#F0C8A0', '#D2A679', '#A67C52', '#825C3A', '#4A3728'].map((color, i) => `
                            <button class="a3d-skin-btn ${i === 1 ? 'selected' : ''}"
                                style="background: ${color}"
                                onclick="avatar3DSystem.setSkinTone('${color}')"
                                data-color="${color}"></button>
                        `).join('')}
                    </div>
                </div>

                <div class="a3d-option-row">
                    <label>Hair Style</label>
                    <select id="a3d-hair-select" onchange="avatar3DSystem.setHairStyle(this.value)">
                        <option value="short">Short Professional</option>
                        <option value="medium">Medium Length</option>
                        <option value="long">Long Flowing</option>
                        <option value="buzz">Buzz Cut</option>
                        <option value="bald">Bald</option>
                    </select>
                </div>

                <div class="a3d-option-row">
                    <label>Hair Color</label>
                    <div class="a3d-hair-colors">
                        ${['#1a1a1a', '#3d2314', '#8b4513', '#d4a574', '#ffd700', '#c0c0c0', '#ff4444'].map((color, i) => `
                            <button class="a3d-hair-btn ${i === 1 ? 'selected' : ''}"
                                style="background: ${color}"
                                onclick="avatar3DSystem.setHairColor('${color}')"
                                data-color="${color}"></button>
                        `).join('')}
                    </div>
                </div>

                <div class="a3d-option-row">
                    <label>Outfit</label>
                    <select id="a3d-outfit-select" onchange="avatar3DSystem.setOutfit(this.value)">
                        <option value="suit">Professional Suit</option>
                        <option value="casual">Business Casual</option>
                        <option value="creative">Creative/Startup</option>
                        <option value="formal">Formal Attire</option>
                    </select>
                </div>
            </div>
        </div>
        `;
    }

    getCreateHTML() {
        return `
        <div class="a3d-create">
            <h3>Create Custom Avatar</h3>
            <p class="a3d-subtitle">Use Ready Player Me to create a fully customized 3D avatar</p>

            <div class="a3d-rpm-container">
                <div class="a3d-rpm-preview" id="a3d-rpm-preview">
                    <div class="a3d-rpm-placeholder">
                        <span class="a3d-rpm-icon">🎨</span>
                        <p>Click below to open the avatar creator</p>
                    </div>
                </div>

                <button class="btn btn-primary a3d-rpm-btn" onclick="avatar3DSystem.openReadyPlayerMe()">
                    Open Avatar Creator
                </button>

                <p class="a3d-rpm-hint">
                    The avatar creator will open in a new window. After creating your avatar,
                    it will automatically be imported into Lightning Ledgerz.
                </p>
            </div>

            <div class="a3d-rpm-features">
                <h4>Features Available:</h4>
                <ul>
                    <li>✓ Full body customization</li>
                    <li>✓ Hundreds of hairstyles</li>
                    <li>✓ Custom facial features</li>
                    <li>✓ Professional outfit options</li>
                    <li>✓ Accessories and glasses</li>
                    <li>✓ Photo-based avatar generation</li>
                </ul>
            </div>
        </div>
        `;
    }

    getUploadHTML() {
        return `
        <div class="a3d-upload">
            <h3>Create Avatar from Photo</h3>
            <p class="a3d-subtitle">Upload a selfie and we'll generate a 3D avatar that looks like you</p>

            <div class="a3d-upload-area" onclick="document.getElementById('a3d-photo-input').click()">
                <div class="a3d-upload-icon">📷</div>
                <p>Click to upload a photo</p>
                <p class="a3d-upload-hint">Best results with a clear, front-facing headshot</p>
                <input type="file" id="a3d-photo-input" accept="image/*" hidden onchange="avatar3DSystem.handlePhotoUpload(this)">
            </div>

            <div class="a3d-upload-preview" id="a3d-upload-preview" style="display: none;">
                <img id="a3d-uploaded-photo" src="" alt="Uploaded photo">
                <button class="btn btn-primary" onclick="avatar3DSystem.generateFromPhoto()">
                    Generate 3D Avatar
                </button>
            </div>

            <div class="a3d-photo-tips">
                <h4>Tips for best results:</h4>
                <ul>
                    <li>Use a well-lit, clear photo</li>
                    <li>Face the camera directly</li>
                    <li>Neutral expression works best</li>
                    <li>Remove glasses if possible</li>
                    <li>Plain background preferred</li>
                </ul>
            </div>
        </div>
        `;
    }

    switchTab(tab) {
        document.querySelectorAll('.a3d-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        const content = document.getElementById('a3d-content');
        switch (tab) {
            case 'presets':
                content.innerHTML = this.getPresetsHTML();
                break;
            case 'create':
                content.innerHTML = this.getCreateHTML();
                break;
            case 'upload':
                content.innerHTML = this.getUploadHTML();
                break;
        }
    }

    selectPreset(key) {
        document.querySelectorAll('.a3d-preset-card').forEach(card => {
            card.classList.remove('selected');
        });

        const selectedCard = document.querySelector(`[data-avatar="${key}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            this.currentAvatar = this.prebuiltAvatars[key];
            document.getElementById('a3d-apply-btn').disabled = false;
        }
    }

    selectStyle(key) {
        document.querySelectorAll('.a3d-style-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        const selected = document.querySelector(`[data-style="${key}"]`);
        if (selected) {
            selected.classList.add('selected');
            this.currentStyle = this.avatarStyles[key];
        }
    }

    setSkinTone(color) {
        document.querySelectorAll('.a3d-skin-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`[data-color="${color}"]`)?.classList.add('selected');
        this.selectedSkinTone = color;
    }

    setHairColor(color) {
        document.querySelectorAll('.a3d-hair-btn').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
        this.selectedHairColor = color;
    }

    setHairStyle(style) {
        this.selectedHairStyle = style;
    }

    setOutfit(outfit) {
        this.selectedOutfit = outfit;
    }

    openReadyPlayerMe() {
        // Open Ready Player Me in iframe or new window
        const rpmWindow = window.open(this.rpmUrl, 'rpm-avatar', 'width=800,height=600');

        // Listen for message from RPM when avatar is created
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'avatar-exported') {
                const avatarUrl = event.data.avatarUrl;
                this.loadExternalAvatar(avatarUrl);
                rpmWindow?.close();
            }
        });
    }

    handlePhotoUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('a3d-upload-preview');
                const img = document.getElementById('a3d-uploaded-photo');
                img.src = e.target.result;
                preview.style.display = 'block';
                this.uploadedPhoto = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    generateFromPhoto() {
        // In a real implementation, this would call Ready Player Me's photo-based avatar API
        // For now, show a message
        alert('Photo-based avatar generation requires Ready Player Me API integration. The avatar would be generated from your uploaded photo.');

        // Simulate loading
        const btn = event.target;
        btn.textContent = 'Generating...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Generate 3D Avatar';
            btn.disabled = false;
            // Would normally load the generated avatar here
        }, 2000);
    }

    loadExternalAvatar(url) {
        this.avatarUrl = url;
        this.currentAvatar = {
            name: 'Custom Avatar',
            glbUrl: url
        };
        document.getElementById('a3d-apply-btn').disabled = false;
    }

    applySelectedAvatar() {
        if (!this.currentAvatar) return;

        // Save avatar preference
        localStorage.setItem('lightning_3d_avatar', JSON.stringify({
            name: this.currentAvatar.name,
            url: this.currentAvatar.glbUrl || this.currentAvatar.thumbnail,
            style: this.currentStyle?.name || 'Professional',
            skinTone: this.selectedSkinTone,
            hairColor: this.selectedHairColor,
            hairStyle: this.selectedHairStyle,
            outfit: this.selectedOutfit
        }));

        // Update current avatar display
        this.updateAvatarDisplay();

        // Close selector
        this.closeSelector();

        // Show confirmation
        if (window.zacAvatar) {
            window.zacAvatar.showSpeech(`Your new avatar "${this.currentAvatar.name}" has been applied! Looking sharp!`, 'Avatar Updated');
        }
    }

    updateAvatarDisplay() {
        // This would update the avatar display in the app
        // For 3D rendering, you'd typically use Three.js or similar
        console.log('Avatar updated:', this.currentAvatar);
    }

    closeSelector() {
        const selector = document.getElementById('avatar-3d-selector');
        if (selector) selector.remove();
    }

    injectStyles() {
        if (document.getElementById('a3d-styles')) return;

        const style = document.createElement('style');
        style.id = 'a3d-styles';
        style.textContent = `
            #avatar-3d-selector {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100001;
            }

            .a3d-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
            }

            .a3d-panel {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 95%;
                max-width: 1000px;
                max-height: 90vh;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
                border-radius: 24px;
                border: 2px solid #ff3333;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 25px 80px rgba(255, 51, 51, 0.3);
            }

            .a3d-header {
                padding: 2rem;
                text-align: center;
                border-bottom: 1px solid rgba(255, 51, 51, 0.3);
                position: relative;
            }

            .a3d-header h2 {
                color: #ff3333;
                margin: 0 0 0.5rem;
                font-size: 1.8rem;
            }

            .a3d-header p {
                color: #888;
                margin: 0;
            }

            .a3d-close {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                background: none;
                border: none;
                color: #fff;
                font-size: 2rem;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.3s;
            }

            .a3d-close:hover { opacity: 1; }

            .a3d-tabs {
                display: flex;
                gap: 0.5rem;
                padding: 1rem 2rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                justify-content: center;
            }

            .a3d-tab {
                padding: 0.75rem 2rem;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                color: #aaa;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 500;
            }

            .a3d-tab:hover {
                border-color: #ff3333;
                color: #fff;
            }

            .a3d-tab.active {
                background: linear-gradient(135deg, rgba(255, 51, 51, 0.2), rgba(255, 51, 51, 0.1));
                border-color: #ff3333;
                color: #ff3333;
            }

            .a3d-content {
                flex: 1;
                overflow-y: auto;
                padding: 2rem;
            }

            .a3d-subtitle {
                color: #888;
                margin-bottom: 1.5rem;
            }

            /* Presets Grid */
            .a3d-preset-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .a3d-preset-card {
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
            }

            .a3d-preset-card:hover {
                border-color: #ff3333;
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(255, 51, 51, 0.2);
            }

            .a3d-preset-card.selected {
                border-color: #ffd700;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            }

            .a3d-preset-card.selected .a3d-preset-check {
                opacity: 1;
            }

            .a3d-avatar-preview {
                height: 180px;
                background: linear-gradient(135deg, #1a1a2e, #0a0a15);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .a3d-avatar-preview img {
                max-height: 100%;
                max-width: 100%;
                object-fit: contain;
            }

            .a3d-preset-info {
                padding: 1rem;
            }

            .a3d-preset-info h4 {
                color: #fff;
                margin: 0 0 0.25rem;
                font-size: 1.1rem;
            }

            .a3d-preset-info p {
                color: #888;
                margin: 0;
                font-size: 0.85rem;
            }

            .a3d-preset-check {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 30px;
                height: 30px;
                background: #ffd700;
                color: #000;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s;
            }

            /* Style Options */
            .a3d-style-section {
                margin: 2rem 0;
                padding: 1.5rem;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
            }

            .a3d-style-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-top: 1rem;
            }

            .a3d-style-option {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
            }

            .a3d-style-option:hover {
                border-color: #ff3333;
            }

            .a3d-style-option.selected {
                border-color: #ffd700;
                background: rgba(255, 215, 0, 0.1);
            }

            .a3d-style-icon {
                font-size: 2rem;
                display: block;
                margin-bottom: 0.5rem;
            }

            .a3d-style-name {
                color: #fff;
                font-weight: bold;
                display: block;
            }

            .a3d-style-desc {
                color: #888;
                font-size: 0.8rem;
                display: block;
                margin-top: 0.25rem;
            }

            /* Custom Options */
            .a3d-custom-options {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
                padding: 1.5rem;
            }

            .a3d-custom-options h3 {
                color: #ff3333;
                margin-bottom: 1rem;
            }

            .a3d-option-row {
                margin-bottom: 1.5rem;
            }

            .a3d-option-row label {
                display: block;
                color: #aaa;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }

            .a3d-skin-options, .a3d-hair-colors {
                display: flex;
                gap: 0.75rem;
            }

            .a3d-skin-btn, .a3d-hair-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid transparent;
                cursor: pointer;
                transition: all 0.3s;
            }

            .a3d-skin-btn:hover, .a3d-hair-btn:hover {
                transform: scale(1.1);
            }

            .a3d-skin-btn.selected, .a3d-hair-btn.selected {
                border-color: #ffd700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .a3d-option-row select {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                color: #fff;
                font-size: 1rem;
            }

            /* Create Tab */
            .a3d-rpm-container {
                text-align: center;
                padding: 2rem;
            }

            .a3d-rpm-preview {
                width: 300px;
                height: 300px;
                margin: 0 auto 1.5rem;
                background: rgba(0, 0, 0, 0.3);
                border: 2px dashed rgba(255, 51, 51, 0.3);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .a3d-rpm-placeholder {
                text-align: center;
                color: #888;
            }

            .a3d-rpm-icon {
                font-size: 4rem;
                display: block;
                margin-bottom: 1rem;
            }

            .a3d-rpm-btn {
                padding: 1rem 2.5rem !important;
                font-size: 1.1rem !important;
            }

            .a3d-rpm-hint {
                color: #666;
                font-size: 0.9rem;
                margin-top: 1rem;
            }

            .a3d-rpm-features {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                margin-top: 2rem;
                text-align: left;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }

            .a3d-rpm-features h4 {
                color: #ffd700;
                margin-bottom: 1rem;
            }

            .a3d-rpm-features ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .a3d-rpm-features li {
                color: #aaa;
                padding: 0.5rem 0;
            }

            /* Upload Tab */
            .a3d-upload {
                text-align: center;
            }

            .a3d-upload-area {
                width: 300px;
                height: 300px;
                margin: 2rem auto;
                background: rgba(0, 0, 0, 0.3);
                border: 2px dashed rgba(255, 51, 51, 0.4);
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s;
            }

            .a3d-upload-area:hover {
                border-color: #ff3333;
                background: rgba(255, 51, 51, 0.05);
            }

            .a3d-upload-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .a3d-upload-hint {
                color: #666;
                font-size: 0.85rem;
            }

            .a3d-upload-preview {
                margin: 2rem auto;
                text-align: center;
            }

            .a3d-upload-preview img {
                max-width: 200px;
                max-height: 200px;
                border-radius: 12px;
                margin-bottom: 1rem;
            }

            .a3d-photo-tips {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 12px;
                padding: 1.5rem;
                max-width: 400px;
                margin: 2rem auto;
                text-align: left;
            }

            .a3d-photo-tips h4 {
                color: #ffd700;
                margin-bottom: 1rem;
            }

            .a3d-photo-tips ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .a3d-photo-tips li {
                color: #aaa;
                padding: 0.3rem 0;
            }

            .a3d-photo-tips li::before {
                content: "• ";
                color: #ff3333;
            }

            /* Footer */
            .a3d-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1.5rem 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            @media (max-width: 768px) {
                .a3d-preset-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                .a3d-style-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize
const avatar3DSystem = new Avatar3DSystem();

// Global functions
window.openAvatar3DSelector = function() {
    // Require login before showing 3D avatar selector
    if (!window.currentUser) {
        if (window.showSignIn) {
            window.showSignIn();
        }
        return;
    }
    avatar3DSystem.openAvatarSelector();
};

window.avatar3DSystem = avatar3DSystem;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Avatar3DSystem;
}

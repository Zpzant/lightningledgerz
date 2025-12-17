// =====================================================
// LIGHTNING LEDGERZ - ENHANCED AVATAR SYSTEM
// =====================================================
// Interactive avatars with animations, customization, and marketplace

class AvatarSystem {
    constructor() {
        this.currentAvatar = null;
        this.animationFrames = [];
        this.marketplace = {
            outfits: [],
            accessories: [],
            backgrounds: [],
            animations: []
        };
        this.userAvatarData = {
            customizations: {},
            level: 1,
            experience: 0,
            inventory: [],
            currency: 0
        };
    }

    // Enhanced avatar animations
    getAnimations() {
        return {
            standing: {
                idle: [
                    { bodyTilt: 0, armL: 0, armR: 0, legSpread: 40 },
                    { bodyTilt: 1, armL: 2, armR: -2, legSpread: 40 },
                    { bodyTilt: 0, armL: 0, armR: 0, legSpread: 40 }
                ],
                blink: [
                    { eyeOpen: 1 },
                    { eyeOpen: 0 },
                    { eyeOpen: 1 }
                ]
            },
            waving: {
                wave: [
                    { armR: -45, armL: 0 },
                    { armR: -65, armL: 0 },
                    { armR: -45, armL: 0 },
                    { armR: -25, armL: 0 }
                ]
            },
            thumbsUp: {
                thumbUp: [
                    { armR: -90, thumbExtended: 0 },
                    { armR: -90, thumbExtended: 1 },
                    { armR: -90, thumbExtended: 1 }
                ]
            },
            analyzing: {
                thinking: [
                    { headTilt: 0, eyeLook: 'forward', handToFace: 0 },
                    { headTilt: 15, eyeLook: 'up', handToFace: 1 },
                    { headTilt: 0, eyeLook: 'forward', handToFace: 0 }
                ]
            },
            walking: {
                stride: [
                    { legL: -20, legR: 20, armL: 20, armR: -20, bodyMove: 0 },
                    { legL: 0, legR: 0, armL: -10, armR: 10, bodyMove: -5 },
                    { legL: 20, legR: -20, armL: -20, armR: 20, bodyMove: 0 },
                    { legL: 0, legR: 0, armL: 10, armR: -10, bodyMove: 5 }
                ]
            },
            celebrating: {
                cheer: [
                    { armL: -45, armR: -45, bodyTilt: 0 },
                    { armL: -75, armR: -75, bodyTilt: -10 },
                    { armL: -45, armR: -45, bodyTilt: 0 }
                ]
            },
            sad: {
                frown: [
                    { mouthType: 'straight' },
                    { mouthType: 'frown', eyesWet: true },
                    { mouthType: 'frown', eyesWet: true }
                ]
            },
            happy: {
                smile: [
                    { mouthType: 'closed' },
                    { mouthType: 'smile', eyesClosed: true },
                    { mouthType: 'smile', eyesClosed: true }
                ]
            }
        };
    }

    playAnimation(avatarElement, animationType, duration = 1000) {
        const animations = this.getAnimations();
        const animation = animations[animationType];
        
        if (!animation) {
            console.error(`Animation ${animationType} not found`);
            return;
        }

        const frames = Object.values(animation)[0];
        const frameTime = duration / frames.length;
        let currentFrame = 0;

        const animate = () => {
            if (currentFrame < frames.length) {
                this.applyAvatarFrame(avatarElement, frames[currentFrame]);
                currentFrame++;
                setTimeout(animate, frameTime);
            }
        };

        animate();
    }

    applyAvatarFrame(element, frameData) {
        // Apply CSS transforms based on frame data
        const transform = this.buildAvatarTransform(frameData);
        if (element) {
            element.style.transform = transform;
        }
    }

    buildAvatarTransform(frameData) {
        let transforms = [];
        
        if (frameData.armL) transforms.push(`rotateZ(${frameData.armL}deg)`);
        if (frameData.bodyTilt) transforms.push(`skewX(${frameData.bodyTilt}deg)`);
        
        return transforms.join(' ');
    }

    createAvatarElement(avatarData) {
        const {
            gender = 'male',
            skinTone = 'medium',
            eyeColor = 'brown',
            hairStyle = 'short',
            hairColor = 'black',
            outfit = 'business-suit',
            outfitColor = 'navy',
            designTheme = 'lightning',
            size = 'medium'
        } = avatarData;

        const sizeMap = {
            small: 150,
            medium: 250,
            large: 400
        };

        const sizePx = sizeMap[size] || 250;

        const svg = `
            <svg width="${sizePx}" height="${sizePx}" viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
                <!-- Background -->
                <rect width="200" height="280" fill="transparent"/>
                
                <!-- Body -->
                <ellipse cx="100" cy="160" rx="35" ry="50" fill="#${this.colorToHex(skinTone)}"/>
                
                <!-- Head -->
                <circle cx="100" cy="80" r="30" fill="#${this.colorToHex(skinTone)}"/>
                
                <!-- Hair -->
                <path d="M 70 55 Q 70 40 100 35 Q 130 40 130 55" fill="#${this.colorToHex(hairColor)}" class="avatar-hair"/>
                
                <!-- Eyes -->
                <circle cx="90" cy="75" r="4" fill="#${this.colorToHex(eyeColor)}" class="avatar-eye-left"/>
                <circle cx="110" cy="75" r="4" fill="#${this.colorToHex(eyeColor)}" class="avatar-eye-right"/>
                
                <!-- Mouth -->
                <path d="M 92 90 Q 100 95 108 90" stroke="#555" stroke-width="2" fill="none" class="avatar-mouth"/>
                
                <!-- Arms -->
                <line x1="70" y1="130" x2="45" y2="150" stroke="#${this.colorToHex(skinTone)}" stroke-width="6" class="avatar-arm-left"/>
                <line x1="130" y1="130" x2="155" y2="150" stroke="#${this.colorToHex(skinTone)}" stroke-width="6" class="avatar-arm-right"/>
                
                <!-- Outfit -->
                <rect x="70" y="130" width="60" height="60" rx="5" fill="#${this.colorToHex(outfitColor)}" class="avatar-outfit"/>
                
                <!-- Legs -->
                <line x1="90" y1="190" x2="85" y2="240" stroke="#333" stroke-width="5"/>
                <line x1="110" y1="190" x2="115" y2="240" stroke="#333" stroke-width="5"/>
                
                <!-- Design Theme Accent -->
                <circle cx="100" cy="155" r="8" fill="#ff3333" class="avatar-theme-accent"/>
            </svg>
        `;

        return svg;
    }

    colorToHex(colorName) {
        const colorMap = {
            light: 'fce5cd',
            'medium-light': 'e8b98a',
            medium: 'c99a6e',
            'medium-dark': '99684f',
            dark: '5d4037',
            blue: '4285f4',
            brown: '795548',
            green: '4caf50',
            hazel: '8d6e63',
            gray: '9e9e9e',
            amber: 'ff9800',
            black: '212121',
            blonde: 'fdd835',
            red: 'd32f2f',
            white: 'f5f5f5',
            purple: '9c27b0',
            pink: 'e91e63',
            navy: '1a237e',
            beige: 'd7ccc8'
        };
        return colorMap[colorName] || 'c99a6e';
    }

    createMarketplaceItem(type, name, price, preview) {
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: type, // 'outfit', 'accessory', 'background', 'animation'
            name: name,
            price: price, // in Lightning Credits
            preview: preview,
            purchased: false,
            won: false,
            rarity: this.determineRarity(price)
        };
    }

    determineRarity(price) {
        if (price < 100) return 'common';
        if (price < 500) return 'uncommon';
        if (price < 1500) return 'rare';
        if (price < 5000) return 'epic';
        return 'legendary';
    }

    levelUp(experience) {
        this.userAvatarData.experience += experience;
        const expRequired = 100 * this.userAvatarData.level;
        
        if (this.userAvatarData.experience >= expRequired) {
            this.userAvatarData.level++;
            this.userAvatarData.experience -= expRequired;
            this.awardLevelUpReward();
            return true;
        }
        return false;
    }

    awardLevelUpReward() {
        const reward = 500 * this.userAvatarData.level;
        this.userAvatarData.currency += reward;
        console.log(`Level Up! You earned ${reward} Lightning Credits!`);
    }

    async saveAvatarToSupabase(userId, avatarData) {
        try {
            const { data, error } = await supabase
                .from('user_avatars')
                .upsert([{
                    user_id: userId,
                    avatar_data: avatarData,
                    level: this.userAvatarData.level,
                    experience: this.userAvatarData.experience,
                    currency: this.userAvatarData.currency,
                    inventory: this.userAvatarData.inventory,
                    updated_at: new Date()
                }]);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error saving avatar:', error);
            throw error;
        }
    }
}

// Initialize global avatar system
let avatarSystem = new AvatarSystem();

// Display avatar on page with interactive capabilities
function createAvatarElement(containerId, avatarData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const svg = avatarSystem.createAvatarElement(avatarData);
    container.innerHTML = svg;
    
    const avatarSvg = container.querySelector('.avatar-svg');
    
    // Add interactivity
    avatarSvg.addEventListener('click', () => {
        const animations = ['waving', 'thumbsUp', 'celebrating', 'analyzing'];
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        avatarSystem.playAnimation(avatarSvg, randomAnim);
    });

    return avatarSvg;
}

// Walkthrough avatar that appears on page load
function createWalkthroughAvatar(positionX = 'right') {
    const container = document.createElement('div');
    container.id = 'walkthrough-avatar';
    container.style.cssText = `
        position: fixed;
        ${positionX === 'right' ? 'right' : 'left'}: 40px;
        bottom: 40px;
        z-index: 999;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    const avatarData = {
        gender: 'female',
        skinTone: 'medium-light',
        eyeColor: 'blue',
        hairStyle: 'long',
        hairColor: 'black',
        outfit: 'business-suit',
        outfitColor: 'navy',
        size: 'medium'
    };

    container.innerHTML = avatarSystem.createAvatarElement(avatarData);
    document.body.appendChild(container);

    // Make avatar interactive
    const svg = container.querySelector('.avatar-svg');
    svg.addEventListener('click', () => {
        avatarSystem.playAnimation(svg, 'waving');
    });

    // Random blinks and smiles
    setInterval(() => {
        avatarSystem.playAnimation(svg, 'happy', 500);
    }, Math.random() * 8000 + 5000);

    return container;
}

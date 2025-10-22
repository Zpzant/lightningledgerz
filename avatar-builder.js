// =====================================================
// LIGHTNING LEDGERZ - AVATAR BUILDER
// =====================================================

const AVATAR_OPTIONS = {
    gender: ['male', 'female', 'nonbinary'],
    skinTone: ['light', 'medium-light', 'medium', 'medium-dark', 'dark'],
    eyeColor: ['blue', 'brown', 'green', 'hazel', 'gray', 'amber'],
    hairStyle: [
        'short', 'medium', 'long', 'bald', 'buzz-cut', 'pixie',
        'bob', 'ponytail', 'bun', 'braids', 'afro', 'dreadlocks',
        'curly', 'wavy', 'straight', 'mohawk'
    ],
    hairColor: ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'blue', 'purple', 'pink', 'green'],
    bodyType: ['slim', 'athletic', 'average', 'muscular', 'curvy', 'plus-size'],
    outfitType: [
        'business-suit', 'blazer', 'dress-shirt', 't-shirt',
        'dress-professional', 'dress-casual', 'skirt-professional',
        'skirt-casual', 'casual-wear', 'formal-wear'
    ],
    outfitColor: ['black', 'navy', 'gray', 'white', 'red', 'blue', 'green', 'purple', 'pink', 'beige'],
    designTheme: ['lightning', 'fire', 'star', 'crown', 'rocket']
};

// Avatar SVG generator (simplified version - you can enhance this)
function generateAvatarSVG(options, pose = 'standing') {
    const {
        gender,
        skinTone,
        eyeColor,
        hairStyle,
        hairColor,
        bodyType,
        outfitType,
        outfitColor,
        designTheme
    } = options;

    // Skin tone colors
    const skinColors = {
        'light': '#fce5cd',
        'medium-light': '#e8b98a',
        'medium': '#c99a6e',
        'medium-dark': '#99684f',
        'dark': '#5d4037'
    };

    // Eye colors
    const eyeColors = {
        'blue': '#4285f4',
        'brown': '#795548',
        'green': '#4caf50',
        'hazel': '#8d6e63',
        'gray': '#9e9e9e',
        'amber': '#ff9800'
    };

    // Hair colors
    const hairColors = {
        'black': '#212121',
        'brown': '#5d4037',
        'blonde': '#fdd835',
        'red': '#d32f2f',
        'gray': '#9e9e9e',
        'white': '#f5f5f5',
        'blue': '#2196f3',
        'purple': '#9c27b0',
        'pink': '#e91e63',
        'green': '#4caf50'
    };

    // Outfit colors
    const outfitColors = {
        'black': '#212121',
        'navy': '#1a237e',
        'gray': '#616161',
        'white': '#fafafa',
        'red': '#d32f2f',
        'blue': '#1976d2',
        'green': '#388e3c',
        'purple': '#7b1fa2',
        'pink': '#c2185b',
        'beige': '#d7ccc8'
    };

    const skinColor = skinColors[skinTone] || skinColors['medium'];
    const eyeColor = eyeColors[eyeColor] || eyeColors['brown'];
    const hairColorHex = hairColors[hairColor] || hairColors['brown'];
    const outfitColorHex = outfitColors[outfitColor] || outfitColors['navy'];

    // Different poses
    const poses = {
        standing: { armAngle: 0, legSpread: 40 },
        waving: { armAngle: -45, legSpread: 40 },
        analyzing: { armAngle: 90, legSpread: 30 },
        confident: { armAngle: 0, legSpread: 50 },
        thinking: { armAngle: 120, legSpread: 40 }
    };

    const currentPose = poses[pose] || poses.standing;

    // Theme accessories/backgrounds
    let themeElement = '';
    switch (designTheme) {
        case 'lightning':
            themeElement = `
                <path d="M 160 20 L 180 80 L 160 80 L 180 140"
                      stroke="#ffeb3b" stroke-width="3" fill="none" opacity="0.6"/>
            `;
            break;
        case 'fire':
            themeElement = `
                <circle cx="180" cy="40" r="15" fill="#ff5722" opacity="0.4"/>
                <circle cx="175" cy="35" r="10" fill="#ff9800" opacity="0.6"/>
            `;
            break;
        case 'star':
            themeElement = `
                <polygon points="180,20 185,35 200,35 188,45 193,60 180,50 167,60 172,45 160,35 175,35"
                         fill="#ffd700" opacity="0.6"/>
            `;
            break;
        case 'crown':
            themeElement = `
                <polygon points="70,40 75,30 80,40 85,30 90,40 90,50 70,50"
                         fill="#ffd700" stroke="#f9a825" stroke-width="1"/>
            `;
            break;
        case 'rocket':
            themeElement = `
                <rect x="175" y="20" width="10" height="30" fill="#2196f3" opacity="0.6" rx="5"/>
                <polygon points="175,50 180,60 185,50" fill="#ff5722" opacity="0.6"/>
            `;
            break;
    }

    // Simple SVG avatar
    return `
        <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Background circle -->
            <circle cx="100" cy="100" r="80" fill="rgba(255, 51, 51, 0.1)" stroke="#ff3333" stroke-width="2"/>

            ${themeElement}

            <!-- Head -->
            <circle cx="100" cy="80" r="30" fill="${skinColor}" stroke="#000" stroke-width="1"/>

            <!-- Eyes -->
            <circle cx="90" cy="75" r="4" fill="${eyeColor}"/>
            <circle cx="110" cy="75" r="4" fill="${eyeColor}"/>
            <circle cx="91" cy="74" r="1.5" fill="#fff"/>
            <circle cx="111" cy="74" r="1.5" fill="#fff"/>

            <!-- Nose -->
            <line x1="100" y1="80" x2="100" y2="88" stroke="${skinColor}" stroke-width="2"
                  stroke-linecap="round" opacity="0.5"/>

            <!-- Mouth -->
            <path d="M 92 92 Q 100 96 108 92" stroke="#000" stroke-width="1.5" fill="none" stroke-linecap="round"/>

            <!-- Hair -->
            <ellipse cx="100" cy="65" rx="32" ry="20" fill="${hairColorHex}"/>
            ${hairStyle === 'long' || hairStyle === 'ponytail' ?
                `<ellipse cx="100" cy="100" rx="35" ry="25" fill="${hairColorHex}" opacity="0.8"/>` : ''}
            ${hairStyle === 'bun' ?
                `<circle cx="100" cy="55" r="10" fill="${hairColorHex}"/>` : ''}
            ${hairStyle === 'afro' ?
                `<circle cx="100" cy="70" r="35" fill="${hairColorHex}"/>` : ''}

            <!-- Body (outfit) -->
            <rect x="70" y="110" width="60" height="80" fill="${outfitColorHex}" rx="5" stroke="#000" stroke-width="1"/>

            <!-- Arms -->
            <rect x="55" y="120" width="12" height="50" fill="${skinColor}"
                  transform="rotate(${currentPose.armAngle} 61 120)" rx="6"/>
            <rect x="133" y="120" width="12" height="50" fill="${skinColor}"
                  transform="rotate(${-currentPose.armAngle} 139 120)" rx="6"/>

            <!-- Legs -->
            <rect x="75" y="190" width="15" height="60" fill="#333" rx="7"/>
            <rect x="110" y="190" width="15" height="60" fill="#333" rx="7"/>

            <!-- Shoes -->
            <ellipse cx="82" cy="250" rx="10" ry="5" fill="#000"/>
            <ellipse cx="118" cy="250" rx="10" ry="5" fill="#000"/>

            <!-- Collar/Tie for business outfits -->
            ${outfitType.includes('business') || outfitType.includes('professional') ? `
                <polygon points="100,110 95,125 105,125" fill="#8b0000"/>
                <rect x="85" y="110" width="30" height="5" fill="#fff" rx="1"/>
            ` : ''}

            <!-- Skirt variant -->
            ${outfitType.includes('skirt') ? `
                <polygon points="70,150 100,190 130,150" fill="${outfitColorHex}" stroke="#000" stroke-width="1"/>
            ` : ''}
        </svg>
    `;
}

// Generate avatar preview
function updateAvatarPreview() {
    const options = {
        gender: document.getElementById('avatar-gender')?.value || 'nonbinary',
        skinTone: document.getElementById('avatar-skin')?.value || 'medium',
        eyeColor: document.getElementById('avatar-eyes')?.value || 'brown',
        hairStyle: document.getElementById('avatar-hair-style')?.value || 'short',
        hairColor: document.getElementById('avatar-hair-color')?.value || 'brown',
        bodyType: document.getElementById('avatar-body')?.value || 'average',
        outfitType: document.getElementById('avatar-outfit')?.value || 'business-suit',
        outfitColor: document.getElementById('avatar-outfit-color')?.value || 'navy',
        designTheme: document.getElementById('avatar-theme')?.value || 'lightning'
    };

    const previewContainer = document.getElementById('avatar-preview');
    if (previewContainer) {
        previewContainer.innerHTML = generateAvatarSVG(options, 'standing');
    }

    // Update pose previews
    const poses = ['standing', 'waving', 'analyzing'];
    poses.forEach(pose => {
        const poseContainer = document.getElementById(`pose-${pose}`);
        if (poseContainer) {
            poseContainer.innerHTML = generateAvatarSVG(options, pose);
        }
    });
}

// Save avatar to Supabase
async function saveAvatar(supabaseClient, userId) {
    const options = {
        gender: document.getElementById('avatar-gender')?.value,
        skin_tone: document.getElementById('avatar-skin')?.value,
        eye_color: document.getElementById('avatar-eyes')?.value,
        hair_style: document.getElementById('avatar-hair-style')?.value,
        hair_color: document.getElementById('avatar-hair-color')?.value,
        body_type: document.getElementById('avatar-body')?.value,
        outfit_type: document.getElementById('avatar-outfit')?.value,
        outfit_color: document.getElementById('avatar-outfit-color')?.value,
        design_theme: document.getElementById('avatar-theme')?.value,
        avatar_type: 'custom',
        user_id: userId,
        pose_home: 'standing',
        pose_dashboard: 'analyzing',
        pose_profile: 'waving'
    };

    const { data, error } = await supabaseClient
        .from('avatars')
        .upsert(options, { onConflict: 'user_id' });

    if (error) {
        throw error;
    }

    return data;
}

// Load avatar from Supabase
async function loadAvatar(supabaseClient, userId) {
    const { data, error } = await supabaseClient
        .from('avatars')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
    }

    if (data) {
        // Populate form fields
        if (document.getElementById('avatar-gender')) {
            document.getElementById('avatar-gender').value = data.gender || 'nonbinary';
        }
        if (document.getElementById('avatar-skin')) {
            document.getElementById('avatar-skin').value = data.skin_tone || 'medium';
        }
        if (document.getElementById('avatar-eyes')) {
            document.getElementById('avatar-eyes').value = data.eye_color || 'brown';
        }
        if (document.getElementById('avatar-hair-style')) {
            document.getElementById('avatar-hair-style').value = data.hair_style || 'short';
        }
        if (document.getElementById('avatar-hair-color')) {
            document.getElementById('avatar-hair-color').value = data.hair_color || 'brown';
        }
        if (document.getElementById('avatar-body')) {
            document.getElementById('avatar-body').value = data.body_type || 'average';
        }
        if (document.getElementById('avatar-outfit')) {
            document.getElementById('avatar-outfit').value = data.outfit_type || 'business-suit';
        }
        if (document.getElementById('avatar-outfit-color')) {
            document.getElementById('avatar-outfit-color').value = data.outfit_color || 'navy';
        }
        if (document.getElementById('avatar-theme')) {
            document.getElementById('avatar-theme').value = data.design_theme || 'lightning';
        }

        updateAvatarPreview();
    }

    return data;
}

// Upload company logo
async function uploadCompanyLogo(supabaseClient, userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;

    const { data, error } = await supabaseClient.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        throw error;
    }

    const { data: urlData } = supabaseClient.storage
        .from('avatars')
        .getPublicUrl(fileName);

    // Save logo URL to database
    const { error: dbError } = await supabaseClient
        .from('avatars')
        .upsert({
            user_id: userId,
            avatar_type: 'logo',
            logo_url: urlData.publicUrl
        }, { onConflict: 'user_id' });

    if (dbError) {
        throw dbError;
    }

    return urlData.publicUrl;
}

// Get avatar display (either logo or generated SVG)
async function getAvatarDisplay(supabaseClient, userId, pose = 'standing') {
    const { data, error } = await supabaseClient
        .from('avatars')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    if (!data) {
        // Return default avatar
        return generateAvatarSVG({
            gender: 'nonbinary',
            skinTone: 'medium',
            eyeColor: 'brown',
            hairStyle: 'short',
            hairColor: 'brown',
            bodyType: 'average',
            outfitType: 'business-suit',
            outfitColor: 'navy',
            designTheme: 'lightning'
        }, pose);
    }

    if (data.avatar_type === 'logo' && data.logo_url) {
        return `<img src="${data.logo_url}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;">`;
    }

    // Generate custom avatar
    const options = {
        gender: data.gender,
        skinTone: data.skin_tone,
        eyeColor: data.eye_color,
        hairStyle: data.hair_style,
        hairColor: data.hair_color,
        bodyType: data.body_type,
        outfitType: data.outfit_type,
        outfitColor: data.outfit_color,
        designTheme: data.design_theme
    };

    return generateAvatarSVG(options, pose);
}

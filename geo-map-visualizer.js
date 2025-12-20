// =====================================================
// LIGHTNING LEDGERZ - GEOGRAPHIC MAP VISUALIZER
// =====================================================
// Creates data-driven world maps with dot plots
// Upload CSV/data with geography column and values

class GeoMapVisualizer {
    constructor() {
        // World map coordinates database (country centroids and major cities)
        this.geoDatabase = {
            // Countries (ISO codes and names)
            countries: {
                'united states': { lat: 39.8, lng: -98.5, name: 'United States' },
                'usa': { lat: 39.8, lng: -98.5, name: 'United States' },
                'us': { lat: 39.8, lng: -98.5, name: 'United States' },
                'canada': { lat: 56.1, lng: -106.3, name: 'Canada' },
                'ca': { lat: 56.1, lng: -106.3, name: 'Canada' },
                'mexico': { lat: 23.6, lng: -102.5, name: 'Mexico' },
                'brazil': { lat: -14.2, lng: -51.9, name: 'Brazil' },
                'argentina': { lat: -38.4, lng: -63.6, name: 'Argentina' },
                'chile': { lat: -35.7, lng: -71.5, name: 'Chile' },
                'colombia': { lat: 4.6, lng: -74.3, name: 'Colombia' },
                'peru': { lat: -9.2, lng: -75.0, name: 'Peru' },
                'united kingdom': { lat: 55.4, lng: -3.4, name: 'United Kingdom' },
                'uk': { lat: 55.4, lng: -3.4, name: 'United Kingdom' },
                'england': { lat: 52.4, lng: -1.5, name: 'England' },
                'germany': { lat: 51.2, lng: 10.5, name: 'Germany' },
                'de': { lat: 51.2, lng: 10.5, name: 'Germany' },
                'france': { lat: 46.2, lng: 2.2, name: 'France' },
                'fr': { lat: 46.2, lng: 2.2, name: 'France' },
                'spain': { lat: 40.5, lng: -3.7, name: 'Spain' },
                'italy': { lat: 41.9, lng: 12.6, name: 'Italy' },
                'netherlands': { lat: 52.1, lng: 5.3, name: 'Netherlands' },
                'belgium': { lat: 50.5, lng: 4.5, name: 'Belgium' },
                'switzerland': { lat: 46.8, lng: 8.2, name: 'Switzerland' },
                'austria': { lat: 47.5, lng: 14.6, name: 'Austria' },
                'poland': { lat: 51.9, lng: 19.1, name: 'Poland' },
                'sweden': { lat: 60.1, lng: 18.6, name: 'Sweden' },
                'norway': { lat: 60.5, lng: 8.5, name: 'Norway' },
                'denmark': { lat: 56.3, lng: 9.5, name: 'Denmark' },
                'finland': { lat: 61.9, lng: 25.7, name: 'Finland' },
                'russia': { lat: 61.5, lng: 105.3, name: 'Russia' },
                'china': { lat: 35.9, lng: 104.2, name: 'China' },
                'cn': { lat: 35.9, lng: 104.2, name: 'China' },
                'japan': { lat: 36.2, lng: 138.3, name: 'Japan' },
                'jp': { lat: 36.2, lng: 138.3, name: 'Japan' },
                'south korea': { lat: 35.9, lng: 127.8, name: 'South Korea' },
                'korea': { lat: 35.9, lng: 127.8, name: 'South Korea' },
                'india': { lat: 20.6, lng: 79.0, name: 'India' },
                'in': { lat: 20.6, lng: 79.0, name: 'India' },
                'australia': { lat: -25.3, lng: 133.8, name: 'Australia' },
                'au': { lat: -25.3, lng: 133.8, name: 'Australia' },
                'new zealand': { lat: -40.9, lng: 174.9, name: 'New Zealand' },
                'singapore': { lat: 1.4, lng: 103.8, name: 'Singapore' },
                'hong kong': { lat: 22.4, lng: 114.1, name: 'Hong Kong' },
                'taiwan': { lat: 23.7, lng: 121.0, name: 'Taiwan' },
                'indonesia': { lat: -0.8, lng: 113.9, name: 'Indonesia' },
                'malaysia': { lat: 4.2, lng: 101.9, name: 'Malaysia' },
                'thailand': { lat: 15.9, lng: 100.9, name: 'Thailand' },
                'vietnam': { lat: 14.1, lng: 108.3, name: 'Vietnam' },
                'philippines': { lat: 12.9, lng: 121.8, name: 'Philippines' },
                'saudi arabia': { lat: 23.9, lng: 45.1, name: 'Saudi Arabia' },
                'uae': { lat: 23.4, lng: 53.8, name: 'UAE' },
                'united arab emirates': { lat: 23.4, lng: 53.8, name: 'UAE' },
                'israel': { lat: 31.0, lng: 34.9, name: 'Israel' },
                'turkey': { lat: 38.9, lng: 35.2, name: 'Turkey' },
                'south africa': { lat: -30.6, lng: 22.9, name: 'South Africa' },
                'egypt': { lat: 26.8, lng: 30.8, name: 'Egypt' },
                'nigeria': { lat: 9.1, lng: 8.7, name: 'Nigeria' },
                'kenya': { lat: -0.0, lng: 37.9, name: 'Kenya' },
                'morocco': { lat: 31.8, lng: -7.1, name: 'Morocco' },
                'ireland': { lat: 53.1, lng: -8.2, name: 'Ireland' },
                'portugal': { lat: 39.4, lng: -8.2, name: 'Portugal' },
                'greece': { lat: 39.1, lng: 21.8, name: 'Greece' },
                'czech republic': { lat: 49.8, lng: 15.5, name: 'Czech Republic' },
                'czechia': { lat: 49.8, lng: 15.5, name: 'Czech Republic' },
                'hungary': { lat: 47.2, lng: 19.5, name: 'Hungary' },
                'romania': { lat: 45.9, lng: 25.0, name: 'Romania' },
                'ukraine': { lat: 48.4, lng: 31.2, name: 'Ukraine' }
            },
            // Major cities
            cities: {
                'new york': { lat: 40.7, lng: -74.0, name: 'New York', country: 'USA' },
                'nyc': { lat: 40.7, lng: -74.0, name: 'New York', country: 'USA' },
                'los angeles': { lat: 34.1, lng: -118.2, name: 'Los Angeles', country: 'USA' },
                'la': { lat: 34.1, lng: -118.2, name: 'Los Angeles', country: 'USA' },
                'chicago': { lat: 41.9, lng: -87.6, name: 'Chicago', country: 'USA' },
                'houston': { lat: 29.8, lng: -95.4, name: 'Houston', country: 'USA' },
                'phoenix': { lat: 33.4, lng: -112.1, name: 'Phoenix', country: 'USA' },
                'philadelphia': { lat: 40.0, lng: -75.2, name: 'Philadelphia', country: 'USA' },
                'san antonio': { lat: 29.4, lng: -98.5, name: 'San Antonio', country: 'USA' },
                'san diego': { lat: 32.7, lng: -117.2, name: 'San Diego', country: 'USA' },
                'dallas': { lat: 32.8, lng: -96.8, name: 'Dallas', country: 'USA' },
                'san jose': { lat: 37.3, lng: -121.9, name: 'San Jose', country: 'USA' },
                'austin': { lat: 30.3, lng: -97.7, name: 'Austin', country: 'USA' },
                'san francisco': { lat: 37.8, lng: -122.4, name: 'San Francisco', country: 'USA' },
                'sf': { lat: 37.8, lng: -122.4, name: 'San Francisco', country: 'USA' },
                'seattle': { lat: 47.6, lng: -122.3, name: 'Seattle', country: 'USA' },
                'denver': { lat: 39.7, lng: -105.0, name: 'Denver', country: 'USA' },
                'boston': { lat: 42.4, lng: -71.1, name: 'Boston', country: 'USA' },
                'atlanta': { lat: 33.7, lng: -84.4, name: 'Atlanta', country: 'USA' },
                'miami': { lat: 25.8, lng: -80.2, name: 'Miami', country: 'USA' },
                'washington dc': { lat: 38.9, lng: -77.0, name: 'Washington DC', country: 'USA' },
                'dc': { lat: 38.9, lng: -77.0, name: 'Washington DC', country: 'USA' },
                'toronto': { lat: 43.7, lng: -79.4, name: 'Toronto', country: 'Canada' },
                'vancouver': { lat: 49.3, lng: -123.1, name: 'Vancouver', country: 'Canada' },
                'montreal': { lat: 45.5, lng: -73.6, name: 'Montreal', country: 'Canada' },
                'london': { lat: 51.5, lng: -0.1, name: 'London', country: 'UK' },
                'manchester': { lat: 53.5, lng: -2.2, name: 'Manchester', country: 'UK' },
                'birmingham': { lat: 52.5, lng: -1.9, name: 'Birmingham', country: 'UK' },
                'paris': { lat: 48.9, lng: 2.3, name: 'Paris', country: 'France' },
                'berlin': { lat: 52.5, lng: 13.4, name: 'Berlin', country: 'Germany' },
                'munich': { lat: 48.1, lng: 11.6, name: 'Munich', country: 'Germany' },
                'frankfurt': { lat: 50.1, lng: 8.7, name: 'Frankfurt', country: 'Germany' },
                'hamburg': { lat: 53.6, lng: 10.0, name: 'Hamburg', country: 'Germany' },
                'madrid': { lat: 40.4, lng: -3.7, name: 'Madrid', country: 'Spain' },
                'barcelona': { lat: 41.4, lng: 2.2, name: 'Barcelona', country: 'Spain' },
                'rome': { lat: 41.9, lng: 12.5, name: 'Rome', country: 'Italy' },
                'milan': { lat: 45.5, lng: 9.2, name: 'Milan', country: 'Italy' },
                'amsterdam': { lat: 52.4, lng: 4.9, name: 'Amsterdam', country: 'Netherlands' },
                'brussels': { lat: 50.8, lng: 4.4, name: 'Brussels', country: 'Belgium' },
                'zurich': { lat: 47.4, lng: 8.5, name: 'Zurich', country: 'Switzerland' },
                'geneva': { lat: 46.2, lng: 6.1, name: 'Geneva', country: 'Switzerland' },
                'vienna': { lat: 48.2, lng: 16.4, name: 'Vienna', country: 'Austria' },
                'stockholm': { lat: 59.3, lng: 18.1, name: 'Stockholm', country: 'Sweden' },
                'oslo': { lat: 59.9, lng: 10.8, name: 'Oslo', country: 'Norway' },
                'copenhagen': { lat: 55.7, lng: 12.6, name: 'Copenhagen', country: 'Denmark' },
                'helsinki': { lat: 60.2, lng: 24.9, name: 'Helsinki', country: 'Finland' },
                'moscow': { lat: 55.8, lng: 37.6, name: 'Moscow', country: 'Russia' },
                'beijing': { lat: 39.9, lng: 116.4, name: 'Beijing', country: 'China' },
                'shanghai': { lat: 31.2, lng: 121.5, name: 'Shanghai', country: 'China' },
                'shenzhen': { lat: 22.5, lng: 114.1, name: 'Shenzhen', country: 'China' },
                'guangzhou': { lat: 23.1, lng: 113.3, name: 'Guangzhou', country: 'China' },
                'tokyo': { lat: 35.7, lng: 139.7, name: 'Tokyo', country: 'Japan' },
                'osaka': { lat: 34.7, lng: 135.5, name: 'Osaka', country: 'Japan' },
                'seoul': { lat: 37.6, lng: 127.0, name: 'Seoul', country: 'South Korea' },
                'mumbai': { lat: 19.1, lng: 72.9, name: 'Mumbai', country: 'India' },
                'delhi': { lat: 28.7, lng: 77.1, name: 'Delhi', country: 'India' },
                'new delhi': { lat: 28.6, lng: 77.2, name: 'New Delhi', country: 'India' },
                'bangalore': { lat: 13.0, lng: 77.6, name: 'Bangalore', country: 'India' },
                'sydney': { lat: -33.9, lng: 151.2, name: 'Sydney', country: 'Australia' },
                'melbourne': { lat: -37.8, lng: 145.0, name: 'Melbourne', country: 'Australia' },
                'brisbane': { lat: -27.5, lng: 153.0, name: 'Brisbane', country: 'Australia' },
                'dubai': { lat: 25.2, lng: 55.3, name: 'Dubai', country: 'UAE' },
                'abu dhabi': { lat: 24.5, lng: 54.4, name: 'Abu Dhabi', country: 'UAE' },
                'tel aviv': { lat: 32.1, lng: 34.8, name: 'Tel Aviv', country: 'Israel' },
                'istanbul': { lat: 41.0, lng: 29.0, name: 'Istanbul', country: 'Turkey' },
                'sao paulo': { lat: -23.5, lng: -46.6, name: 'São Paulo', country: 'Brazil' },
                'rio de janeiro': { lat: -22.9, lng: -43.2, name: 'Rio de Janeiro', country: 'Brazil' },
                'mexico city': { lat: 19.4, lng: -99.1, name: 'Mexico City', country: 'Mexico' },
                'buenos aires': { lat: -34.6, lng: -58.4, name: 'Buenos Aires', country: 'Argentina' },
                'johannesburg': { lat: -26.2, lng: 28.0, name: 'Johannesburg', country: 'South Africa' },
                'cape town': { lat: -33.9, lng: 18.4, name: 'Cape Town', country: 'South Africa' },
                'cairo': { lat: 30.0, lng: 31.2, name: 'Cairo', country: 'Egypt' },
                'lagos': { lat: 6.5, lng: 3.4, name: 'Lagos', country: 'Nigeria' },
                'nairobi': { lat: -1.3, lng: 36.8, name: 'Nairobi', country: 'Kenya' }
            },
            // US States
            states: {
                'california': { lat: 36.8, lng: -119.4, name: 'California' },
                'ca': { lat: 36.8, lng: -119.4, name: 'California' },
                'texas': { lat: 31.0, lng: -100.0, name: 'Texas' },
                'tx': { lat: 31.0, lng: -100.0, name: 'Texas' },
                'florida': { lat: 27.8, lng: -81.8, name: 'Florida' },
                'fl': { lat: 27.8, lng: -81.8, name: 'Florida' },
                'new york state': { lat: 43.0, lng: -75.5, name: 'New York' },
                'ny': { lat: 43.0, lng: -75.5, name: 'New York' },
                'illinois': { lat: 40.6, lng: -89.4, name: 'Illinois' },
                'il': { lat: 40.6, lng: -89.4, name: 'Illinois' },
                'pennsylvania': { lat: 41.2, lng: -77.2, name: 'Pennsylvania' },
                'pa': { lat: 41.2, lng: -77.2, name: 'Pennsylvania' },
                'ohio': { lat: 40.4, lng: -82.9, name: 'Ohio' },
                'georgia': { lat: 32.2, lng: -83.4, name: 'Georgia' },
                'ga': { lat: 32.2, lng: -83.4, name: 'Georgia' },
                'north carolina': { lat: 35.8, lng: -79.0, name: 'North Carolina' },
                'nc': { lat: 35.8, lng: -79.0, name: 'North Carolina' },
                'michigan': { lat: 44.3, lng: -85.6, name: 'Michigan' },
                'mi': { lat: 44.3, lng: -85.6, name: 'Michigan' },
                'new jersey': { lat: 40.1, lng: -74.4, name: 'New Jersey' },
                'nj': { lat: 40.1, lng: -74.4, name: 'New Jersey' },
                'virginia': { lat: 37.4, lng: -78.7, name: 'Virginia' },
                'va': { lat: 37.4, lng: -78.7, name: 'Virginia' },
                'washington': { lat: 47.4, lng: -120.7, name: 'Washington' },
                'wa': { lat: 47.4, lng: -120.7, name: 'Washington' },
                'arizona': { lat: 34.0, lng: -111.1, name: 'Arizona' },
                'az': { lat: 34.0, lng: -111.1, name: 'Arizona' },
                'massachusetts': { lat: 42.4, lng: -71.4, name: 'Massachusetts' },
                'ma': { lat: 42.4, lng: -71.4, name: 'Massachusetts' },
                'tennessee': { lat: 35.5, lng: -86.6, name: 'Tennessee' },
                'tn': { lat: 35.5, lng: -86.6, name: 'Tennessee' },
                'indiana': { lat: 40.3, lng: -86.1, name: 'Indiana' },
                'colorado': { lat: 39.0, lng: -105.5, name: 'Colorado' },
                'co': { lat: 39.0, lng: -105.5, name: 'Colorado' },
                'maryland': { lat: 39.0, lng: -76.6, name: 'Maryland' },
                'md': { lat: 39.0, lng: -76.6, name: 'Maryland' },
                'minnesota': { lat: 46.7, lng: -94.7, name: 'Minnesota' },
                'mn': { lat: 46.7, lng: -94.7, name: 'Minnesota' },
                'wisconsin': { lat: 43.8, lng: -88.8, name: 'Wisconsin' },
                'wi': { lat: 43.8, lng: -88.8, name: 'Wisconsin' },
                'missouri': { lat: 37.9, lng: -91.8, name: 'Missouri' },
                'mo': { lat: 37.9, lng: -91.8, name: 'Missouri' },
                'connecticut': { lat: 41.6, lng: -73.1, name: 'Connecticut' },
                'ct': { lat: 41.6, lng: -73.1, name: 'Connecticut' },
                'oregon': { lat: 43.8, lng: -120.6, name: 'Oregon' },
                'or': { lat: 43.8, lng: -120.6, name: 'Oregon' },
                'nevada': { lat: 38.8, lng: -116.4, name: 'Nevada' },
                'nv': { lat: 38.8, lng: -116.4, name: 'Nevada' },
                'utah': { lat: 39.3, lng: -111.1, name: 'Utah' },
                'ut': { lat: 39.3, lng: -111.1, name: 'Utah' }
            }
        };
    }

    // Look up coordinates for a location string
    geocode(locationString) {
        if (!locationString) return null;
        const normalized = locationString.toLowerCase().trim();

        // Check cities first (more specific)
        if (this.geoDatabase.cities[normalized]) {
            return this.geoDatabase.cities[normalized];
        }

        // Check US states
        if (this.geoDatabase.states[normalized]) {
            return this.geoDatabase.states[normalized];
        }

        // Check countries
        if (this.geoDatabase.countries[normalized]) {
            return this.geoDatabase.countries[normalized];
        }

        // Fuzzy match - check if any key contains the search string
        for (const [key, value] of Object.entries(this.geoDatabase.cities)) {
            if (key.includes(normalized) || normalized.includes(key)) {
                return value;
            }
        }
        for (const [key, value] of Object.entries(this.geoDatabase.countries)) {
            if (key.includes(normalized) || normalized.includes(key)) {
                return value;
            }
        }

        return null;
    }

    // Parse CSV data
    parseCSV(csvString) {
        const lines = csvString.trim().split('\n');
        if (lines.length < 2) return { headers: [], rows: [] };

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((h, i) => {
                row[h] = values[i] || '';
            });
            return row;
        });

        return { headers, rows };
    }

    // Detect which column contains geographic data
    detectGeoColumn(headers, rows) {
        const geoKeywords = ['location', 'city', 'country', 'state', 'region', 'geography', 'geo', 'place', 'market', 'office', 'branch'];

        // First check header names
        for (const header of headers) {
            const normalized = header.toLowerCase();
            if (geoKeywords.some(kw => normalized.includes(kw))) {
                return header;
            }
        }

        // Then check which column has the most geocodable values
        let bestColumn = null;
        let bestScore = 0;

        for (const header of headers) {
            let score = 0;
            for (const row of rows.slice(0, 10)) { // Check first 10 rows
                if (this.geocode(row[header])) {
                    score++;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestColumn = header;
            }
        }

        return bestColumn;
    }

    // Detect which column contains numeric values
    detectValueColumn(headers, rows) {
        const valueKeywords = ['value', 'amount', 'count', 'total', 'revenue', 'sales', 'offices', 'employees', 'customers', 'units', 'size'];

        // First check header names
        for (const header of headers) {
            const normalized = header.toLowerCase();
            if (valueKeywords.some(kw => normalized.includes(kw))) {
                return header;
            }
        }

        // Find first numeric column (excluding geo column)
        for (const header of headers) {
            let numericCount = 0;
            for (const row of rows.slice(0, 10)) {
                const val = row[header];
                if (val && !isNaN(parseFloat(val.replace(/[$,]/g, '')))) {
                    numericCount++;
                }
            }
            if (numericCount >= 5) {
                return header;
            }
        }

        return null;
    }

    // Process uploaded data and return plot points
    processData(csvString) {
        const { headers, rows } = this.parseCSV(csvString);
        if (rows.length === 0) return [];

        const geoColumn = this.detectGeoColumn(headers, rows);
        const valueColumn = this.detectValueColumn(headers, rows);

        const points = [];
        const maxValue = valueColumn
            ? Math.max(...rows.map(r => parseFloat(r[valueColumn]?.replace(/[$,]/g, '') || 0)))
            : 1;

        rows.forEach(row => {
            const location = row[geoColumn];
            const coords = this.geocode(location);

            if (coords) {
                const rawValue = valueColumn ? parseFloat(row[valueColumn]?.replace(/[$,]/g, '') || 1) : 1;
                const normalizedValue = rawValue / maxValue; // 0-1 scale

                points.push({
                    lat: coords.lat,
                    lng: coords.lng,
                    name: coords.name || location,
                    value: rawValue,
                    normalizedValue: normalizedValue,
                    label: row[geoColumn],
                    allData: row
                });
            }
        });

        return points;
    }

    // Convert lat/lng to SVG coordinates (Mercator-ish projection)
    latLngToXY(lat, lng, width, height) {
        // Simple equirectangular projection
        const x = (lng + 180) * (width / 360);
        const latRad = lat * Math.PI / 180;
        const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        const y = (height / 2) - (width * mercN / (2 * Math.PI));

        return { x, y };
    }

    // Generate world map SVG with dots
    generateMapSVG(points, options = {}) {
        const {
            width = 800,
            height = 450,
            dotColor = '#006644',
            dotMinSize = 6,
            dotMaxSize = 25,
            showLabels = false,
            mapColor = '#d4d4d4',
            backgroundColor = '#ffffff',
            title = ''
        } = options;

        // Scale dot sizes based on values
        const dots = points.map(p => {
            const { x, y } = this.latLngToXY(p.lat, p.lng, width, height);
            const size = dotMinSize + (p.normalizedValue * (dotMaxSize - dotMinSize));
            return { ...p, x, y, size };
        });

        // World map simplified path (continents outline)
        const worldMapPath = this.getWorldMapPath();

        let svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%;">
                <rect width="${width}" height="${height}" fill="${backgroundColor}"/>

                <!-- World Map -->
                <g transform="translate(0,0) scale(1)">
                    ${worldMapPath.map(path => `<path d="${path}" fill="${mapColor}" stroke="#bbb" stroke-width="0.5"/>`).join('')}
                </g>

                <!-- Data Points -->
                ${dots.map(d => `
                    <circle cx="${d.x}" cy="${d.y}" r="${d.size}" fill="${dotColor}" opacity="0.85" stroke="#fff" stroke-width="1">
                        <title>${d.name}: ${d.value.toLocaleString()}</title>
                    </circle>
                `).join('')}

                ${showLabels ? dots.filter(d => d.size > 10).map(d => `
                    <text x="${d.x}" y="${d.y - d.size - 3}" text-anchor="middle" font-size="8" fill="#333">${d.name}</text>
                `).join('') : ''}
            </svg>
        `;

        return svg;
    }

    // Simplified world map paths (SVG path data for continents)
    getWorldMapPath() {
        // Simplified continent outlines - this is a basic representation
        return [
            // North America
            "M 45,85 L 50,70 L 65,65 L 90,60 L 115,55 L 140,60 L 155,75 L 160,100 L 150,130 L 130,155 L 100,170 L 75,160 L 55,140 L 45,115 Z",
            // South America
            "M 100,175 L 115,180 L 125,210 L 130,250 L 120,290 L 100,320 L 85,310 L 80,270 L 85,230 L 90,195 Z",
            // Europe
            "M 350,75 L 370,65 L 400,70 L 420,80 L 410,100 L 390,110 L 365,105 L 350,90 Z",
            // Africa
            "M 350,130 L 380,120 L 420,130 L 440,160 L 435,210 L 420,260 L 390,280 L 360,260 L 345,210 L 340,160 Z",
            // Asia
            "M 420,60 L 500,50 L 580,55 L 640,70 L 680,100 L 700,140 L 680,170 L 620,160 L 560,155 L 500,140 L 450,130 L 430,100 Z",
            // Australia
            "M 600,240 L 650,235 L 690,250 L 695,290 L 670,320 L 620,315 L 595,280 L 590,255 Z",
            // Greenland
            "M 200,35 L 230,30 L 260,40 L 255,65 L 225,75 L 200,60 Z",
            // UK
            "M 340,70 L 350,65 L 355,80 L 345,85 Z",
            // Japan
            "M 680,95 L 695,90 L 700,110 L 690,120 L 680,110 Z",
            // Indonesia
            "M 620,175 L 680,170 L 700,180 L 690,195 L 640,200 L 615,190 Z",
            // New Zealand
            "M 720,300 L 735,295 L 740,320 L 725,330 Z"
        ];
    }

    // Create the full map slide HTML
    createMapSlide(data = {}) {
        const {
            title = 'Global Presence',
            subtitle = '',
            points = [],
            cornerStats = [],
            bottomSections = [],
            dotColor = '#006644',
            backgroundColor = '#ffffff'
        } = data;

        const mapSVG = this.generateMapSVG(points, {
            dotColor,
            backgroundColor,
            width: 800,
            height: 380
        });

        return `
            <div style="width: 100%; height: 100%; background: ${backgroundColor}; padding: 30px 40px; box-sizing: border-box; font-family: 'Georgia', serif;">
                <!-- Title -->
                <h1 style="font-size: 2rem; font-weight: 400; color: #1a1a1a; margin: 0 0 20px 0; font-style: italic;">${title}</h1>

                <!-- Map Container with Stats Overlay -->
                <div style="position: relative; height: 55%;">
                    <!-- Map -->
                    <div style="width: 100%; height: 100%;">
                        ${mapSVG}
                    </div>

                    <!-- Corner Statistics -->
                    ${cornerStats.length >= 1 ? `
                        <div style="position: absolute; top: 10px; left: 20px; text-align: left;">
                            <div style="font-size: 2.2rem; color: #006644; font-weight: 600;">${cornerStats[0].value}</div>
                            <div style="font-size: 0.85rem; color: #666; max-width: 120px;">${cornerStats[0].label}</div>
                        </div>
                    ` : ''}

                    ${cornerStats.length >= 2 ? `
                        <div style="position: absolute; top: 10px; right: 20px; text-align: right;">
                            <div style="font-size: 2.2rem; color: #006644; font-weight: 600;">${cornerStats[1].value}</div>
                            <div style="font-size: 0.85rem; color: #666; max-width: 120px;">${cornerStats[1].label}</div>
                        </div>
                    ` : ''}

                    ${cornerStats.length >= 3 ? `
                        <div style="position: absolute; bottom: 10px; left: 20px; text-align: left;">
                            <div style="font-size: 2.2rem; color: #1a1a1a; font-weight: 600;">${cornerStats[2].value}</div>
                            <div style="font-size: 0.85rem; color: #666;">${cornerStats[2].label}</div>
                        </div>
                    ` : ''}

                    ${cornerStats.length >= 4 ? `
                        <div style="position: absolute; bottom: 10px; right: 20px; text-align: right;">
                            <div style="font-size: 2.2rem; color: #1a1a1a; font-weight: 600;">${cornerStats[3].value}</div>
                            <div style="font-size: 0.85rem; color: #666;">${cornerStats[3].label}</div>
                        </div>
                    ` : ''}
                </div>

                <!-- Bottom Sections (like Market Leadership, etc.) -->
                ${bottomSections.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(${Math.min(bottomSections.length, 3)}, 1fr); gap: 30px; margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd;">
                        ${bottomSections.map(section => `
                            <div>
                                <h3 style="font-size: 0.9rem; font-weight: 600; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">${section.title}</h3>
                                ${section.type === 'pie' ? `
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#3d5a5b 0deg ${section.pieValue * 3.6}deg, #8db9b5 ${section.pieValue * 3.6}deg 360deg);"></div>
                                        <div>
                                            <div style="font-size: 0.75rem; color: #666;">${section.pieLabels?.[0] || 'Primary'}</div>
                                            <div style="font-size: 1.2rem; font-weight: 600;">${section.pieValue}%</div>
                                        </div>
                                    </div>
                                ` : `
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        ${(section.items || []).map(item => `
                                            <li style="font-size: 0.8rem; color: #333; padding: 4px 0; display: flex; align-items: flex-start; gap: 8px;">
                                                <span style="color: #006644; font-weight: bold;">•</span>
                                                <span>${item}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                `}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Initialize global instance
window.geoMapVisualizer = new GeoMapVisualizer();

// Add map template to deck builder
if (window.proDeckBuilder) {
    // Add new template type
    window.proDeckBuilder.slideTemplates.push(
        { id: 'global-map', name: 'Global Map', icon: '🗺️', category: 'data' }
    );

    // Add render method for map slides
    window.proDeckBuilder.renderGlobalMapSlide = function(data, theme) {
        return window.geoMapVisualizer.createMapSlide(data);
    };

    // Patch the render function
    const originalRenderCurrentSlide = window.proDeckBuilder.renderCurrentSlide.bind(window.proDeckBuilder);
    window.proDeckBuilder.renderCurrentSlide = function() {
        const slide = this.slides[this.currentSlideIndex];
        if (slide && slide.template === 'global-map') {
            return this.renderGlobalMapSlide(slide.data, this.getTheme());
        }
        return originalRenderCurrentSlide();
    };

    // Add default data for map template
    const originalGetDefaultData = window.proDeckBuilder.getDefaultDataForTemplate.bind(window.proDeckBuilder);
    window.proDeckBuilder.getDefaultDataForTemplate = function(templateId) {
        if (templateId === 'global-map') {
            return {
                title: 'Global Presence',
                points: [
                    { lat: 40.7, lng: -74.0, name: 'New York', value: 100, normalizedValue: 1.0 },
                    { lat: 51.5, lng: -0.1, name: 'London', value: 80, normalizedValue: 0.8 },
                    { lat: 35.7, lng: 139.7, name: 'Tokyo', value: 60, normalizedValue: 0.6 },
                    { lat: 22.4, lng: 114.1, name: 'Hong Kong', value: 50, normalizedValue: 0.5 },
                    { lat: -33.9, lng: 151.2, name: 'Sydney', value: 40, normalizedValue: 0.4 },
                    { lat: 48.9, lng: 2.3, name: 'Paris', value: 45, normalizedValue: 0.45 },
                    { lat: 52.5, lng: 13.4, name: 'Berlin', value: 35, normalizedValue: 0.35 },
                    { lat: 1.4, lng: 103.8, name: 'Singapore', value: 55, normalizedValue: 0.55 },
                    { lat: 25.2, lng: 55.3, name: 'Dubai', value: 30, normalizedValue: 0.3 },
                    { lat: -23.5, lng: -46.6, name: 'São Paulo', value: 25, normalizedValue: 0.25 }
                ],
                cornerStats: [
                    { value: '+100', label: 'Countries Where Clients are Served' },
                    { value: '~500', label: 'Offices Globally' },
                    { value: '$30.8B', label: '2022 Revenue' },
                    { value: '117 Years', label: 'Continuous Operations' }
                ],
                bottomSections: [
                    {
                        title: 'Market Cap',
                        type: 'pie',
                        pieValue: 54,
                        pieLabels: ['Company', 'Peers']
                    },
                    {
                        title: 'Market Leadership',
                        type: 'list',
                        items: ['#1 Leasing', '#1 Property Sales', '#1 Outsourcing', '#1 Appraisal & Valuation']
                    },
                    {
                        title: 'Recognition',
                        type: 'list',
                        items: ['#1 Corporate Real Estate Brand', 'Most Admired Company', 'Most Ethical Companies']
                    }
                ],
                dotColor: '#006644',
                backgroundColor: '#ffffff'
            };
        }
        return originalGetDefaultData(templateId);
    };
}

// Data upload modal for maps
window.openMapDataUpload = function() {
    const modal = document.createElement('div');
    modal.id = 'map-data-upload-modal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 200000; display: flex; align-items: center; justify-content: center;">
            <div style="background: #1a1a1a; padding: 30px; border-radius: 12px; width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #ff3333; margin: 0;">Upload Geographic Data</h2>
                    <button onclick="document.getElementById('map-data-upload-modal').remove()" style="background: none; border: none; color: #888; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>

                <p style="color: #ccc; margin-bottom: 20px;">Upload a CSV file with a location column (city, country, or state names) and a value column. The system will automatically detect and plot the data on a world map.</p>

                <div style="border: 2px dashed #444; border-radius: 8px; padding: 40px; text-align: center; margin-bottom: 20px; cursor: pointer;" id="dropZone" onclick="document.getElementById('csvFileInput').click()">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📁</div>
                    <div style="color: #888;">Drag & drop CSV file here or click to browse</div>
                    <input type="file" id="csvFileInput" accept=".csv" style="display: none;" onchange="window.handleMapFileUpload(event)">
                </div>

                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: #ff3333; margin: 0 0 10px 0;">Example CSV Format:</h4>
                    <pre style="color: #ccc; font-size: 0.85rem; margin: 0; overflow-x: auto;">Location,Offices,Revenue
New York,15,5000000
London,12,4200000
Tokyo,8,3100000
Singapore,6,2400000</pre>
                </div>

                <div id="uploadPreview" style="display: none;"></div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="document.getElementById('map-data-upload-modal').remove()" style="padding: 10px 20px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer;">Cancel</button>
                    <button id="createMapBtn" onclick="window.createMapFromUpload()" style="padding: 10px 20px; background: #ff3333; border: none; color: #fff; border-radius: 6px; cursor: pointer; display: none;">Create Map Slide</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Setup drag and drop
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ff3333';
        dropZone.style.background = 'rgba(255,51,51,0.1)';
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#444';
        dropZone.style.background = 'transparent';
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#444';
        dropZone.style.background = 'transparent';
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            processMapFile(file);
        }
    });
};

window.handleMapFileUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        processMapFile(file);
    }
};

window._uploadedMapData = null;

function processMapFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        const points = window.geoMapVisualizer.processData(csvText);

        window._uploadedMapData = points;

        const preview = document.getElementById('uploadPreview');
        preview.style.display = 'block';
        preview.innerHTML = `
            <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="color: #4caf50; margin: 0 0 10px 0;">✓ Found ${points.length} locations</h4>
                <div style="max-height: 150px; overflow-y: auto;">
                    ${points.slice(0, 10).map(p => `
                        <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #333; color: #ccc; font-size: 0.85rem;">
                            <span>${p.name}</span>
                            <span>${p.value.toLocaleString()}</span>
                        </div>
                    `).join('')}
                    ${points.length > 10 ? `<div style="color: #888; font-size: 0.8rem; padding-top: 5px;">...and ${points.length - 10} more</div>` : ''}
                </div>
            </div>
        `;

        document.getElementById('createMapBtn').style.display = 'block';
    };
    reader.readAsText(file);
}

window.createMapFromUpload = function() {
    const points = window._uploadedMapData;
    if (!points || points.length === 0) return;

    // Calculate some stats
    const totalValue = points.reduce((sum, p) => sum + p.value, 0);
    const locationCount = points.length;

    // Create the slide
    if (window.proDeckBuilder) {
        const slideData = {
            title: 'Geographic Distribution',
            points: points,
            cornerStats: [
                { value: locationCount.toString(), label: 'Locations' },
                { value: '$' + (totalValue / 1000000).toFixed(1) + 'M', label: 'Total Value' }
            ],
            bottomSections: [],
            dotColor: '#006644',
            backgroundColor: '#ffffff'
        };

        const slide = window.proDeckBuilder.createSlide('global-map', slideData);
        window.proDeckBuilder.slides.push(slide);
        window.proDeckBuilder.currentSlideIndex = window.proDeckBuilder.slides.length - 1;
        window.proDeckBuilder.save();
        window.proDeckBuilder.render();
    }

    document.getElementById('map-data-upload-modal').remove();
    window.toast?.success('Map Created', `Added map with ${points.length} locations`);
};

console.log('✅ Geographic Map Visualizer loaded');

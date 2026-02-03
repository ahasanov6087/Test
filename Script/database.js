// Database simulation using localStorage
class AgeDatabase {
    constructor() {
        this.storageKey = 'ageSelectionStats';
        this.initializeStats();
    }
    
    initializeStats() {
        const defaultStats = {
            '5-7': { count: 0, label: '5-7 yaş' },
            '8-10': { count: 0, label: '8-10 yaş' },
            '11-13': { count: 0, label: '11-13 yaş' },
            '15-17': { count: 0, label: '15-17 yaş' },
            '18+': { count: 0, label: '18+ yaş' }
        };
        
        let currentStats = localStorage.getItem(this.storageKey);
        
        if (!currentStats) {
            localStorage.setItem(this.storageKey, JSON.stringify(defaultStats));
            return defaultStats;
        }
        
        // Parse and ensure all age groups exist
        try {
            const parsedStats = JSON.parse(currentStats);
            
            // Ensure all age groups exist
            for (const [key, value] of Object.entries(defaultStats)) {
                if (!parsedStats[key]) {
                    parsedStats[key] = value;
                }
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(parsedStats));
            return parsedStats;
        } catch (e) {
            console.error('Error parsing stats:', e);
            localStorage.setItem(this.storageKey, JSON.stringify(defaultStats));
            return defaultStats;
        }
    }
    
    addSelection(ageRange) {
        let stats = this.getStats();
        
        // Ensure the ageRange exists in stats
        if (!stats[ageRange]) {
            stats[ageRange] = {
                count: 0,
                label: ageRange + ' yaş'
            };
        }
        
        // Increment count
        stats[ageRange].count++;
        
        // Save back to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(stats));
        return stats;
    }
    
    getStats() {
        try {
            let stats = localStorage.getItem(this.storageKey);
            if (!stats) {
                return this.initializeStats();
            }
            return JSON.parse(stats);
        } catch (e) {
            console.error('Error getting stats:', e);
            return this.initializeStats();
        }
    }
    
    // For admin access - reset password
    isAdmin(password) {
        return password === 'admin123'; // Simple password for demo
    }
    
    // Reset all statistics
    resetStats() {
        const defaultStats = {
            '5-7': { count: 0, label: '5-7 yaş' },
            '8-10': { count: 0, label: '8-10 yaş' },
            '11-13': { count: 0, label: '11-13 yaş' },
            '15-17': { count: 0, label: '15-17 yaş' },
            '18+': { count: 0, label: '18+ yaş' }
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(defaultStats));
        return defaultStats;
    }
}

// Initialize global database instance
const database = new AgeDatabase();
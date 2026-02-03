// DOM Elements
const passwordSection = document.getElementById('passwordSection');
const statsSection = document.getElementById('statsSection');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');
const refreshBtn = document.getElementById('refreshBtn');
const resetBtn = document.getElementById('resetBtn');
const statsTable = document.getElementById('statsTable');
const totalParticipants = document.getElementById('totalParticipants');
const mostPopular = document.getElementById('mostPopular');
let statsChart = null;

// Login handler
loginBtn.addEventListener('click', function() {
    const password = passwordInput.value;
    
    if (database.isAdmin(password)) {
        passwordSection.style.display = 'none';
        statsSection.style.display = 'block';
        loadStats();
        passwordInput.value = '';
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'Yanlış parol. Yenidən cəhd edin.';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Enter key support for password
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});

// Load statistics
function loadStats() {
    console.log('Loading stats...');
    const stats = database.getStats();
    console.log('Current stats:', stats);
    
    let tableHTML = '';
    let total = 0;
    let maxCount = 0;
    let popularAge = '';
    
    // Define the correct order of age groups
    const ageGroups = ['5-7', '8-10', '11-13', '15-17', '18+'];
    
    // Create table rows and calculate totals
    for (const ageKey of ageGroups) {
        if (stats[ageKey]) {
            const data = stats[ageKey];
            const count = data.count || 0;
            const label = data.label || ageKey + ' yaş';
            
            total += count;
            
            if (count > maxCount && count > 0) {
                maxCount = count;
                popularAge = label;
            }
            
            tableHTML += `
                <div class="stats-row">
                    <span class="age-label">${label}</span>
                    <span class="age-count">${count} nəfər</span>
                </div>
            `;
        }
    }
    
    statsTable.innerHTML = tableHTML;
    totalParticipants.textContent = total;
    mostPopular.textContent = popularAge || 'Hələ seçim yoxdur';
    
    // Update chart
    updateChart(stats);
}

// Update chart
function updateChart(stats) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    const ageGroups = ['5-7', '8-10', '11-13', '15-17', '18+'];
    const labels = ageGroups.map(key => stats[key]?.label || key + ' yaş');
    const data = ageGroups.map(key => stats[key]?.count || 0);
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    
    if (statsChart) {
        statsChart.destroy();
    }
    
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Seçim sayı',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Seçim sayı: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    });
}

// Refresh button
refreshBtn.addEventListener('click', loadStats);

// Reset statistics
resetBtn.addEventListener('click', function() {
    if (confirm('Statistikaları sıfırlamaq istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.')) {
        database.resetStats();
        loadStats();
        alert('Statistikalar sıfırlandı!');
    }
});

// Initial focus
passwordInput.focus();

// Load stats on page load (if already logged in from session)
window.addEventListener('DOMContentLoaded', function() {
    // Check if we have a flag in localStorage for admin session
    const isAdminSession = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isAdminSession) {
        passwordSection.style.display = 'none';
        statsSection.style.display = 'block';
        loadStats();
    }
});
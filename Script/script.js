// DOM Elements
const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const continueBtn = document.getElementById('continueBtn');
const selectedAgeDisplay = document.getElementById('selectedAge');
const hiddenAdminBtn = document.getElementById('hiddenAdminBtn');

let selectedAge = '';

// Initialize database
console.log('Initial stats:', database.getStats());

// Toggle dropdown
dropdownToggle.addEventListener('click', function() {
    dropdownMenu.classList.toggle('show');
    dropdownToggle.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('active');
    }
});

// Handle age selection from the 5 choices
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        selectedAge = this.getAttribute('data-age');
        dropdownToggle.textContent = this.textContent;
        selectedAgeDisplay.textContent = `Seçildi: ${this.textContent}`;
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('active');
        
        // Show continue button
        continueBtn.classList.add('show');
    });
});

// Handle continue button click
continueBtn.addEventListener('click', function() {
  if (!selectedAge) return;

  fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ age: selectedAge })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Server response:', data);
    if (data.status === 'success') {
      window.location.href = 'index1.html'; // redirect only if success
    } else {
      alert('Xəta baş verdi: ' + data.message);
    }
  })
  .catch(err => {
    console.error('Fetch error:', err);
    alert('Serverə qoşula bilmədi.');
  });
});






// Hidden admin button functionality
hiddenAdminBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Simple password prompt for extra security
    const password = prompt("Admin panelinə daxil olmaq üçün parolu daxil edin:");
    
    if (password === "admin123") {
        window.location.href = "index2.html";
    } else if (password !== null) {
        alert("Yanlış parol!");
    }
});

// Keyboard navigation for dropdown
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        dropdownMenu.classList.remove('show');
        dropdownToggle.classList.remove('active');
    }
    
    if (event.key === 'ArrowDown' && dropdownMenu.classList.contains('show')) {
        const items = document.querySelectorAll('.dropdown-item');
        if (items.length > 0) {
            items[0].focus();
        }
    }
    
    // Keyboard shortcut for admin access: Ctrl + Shift + A
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        const confirmRedirect = confirm("Admin panelinə yönləndirilsin?");
        if (confirmRedirect) {
            window.location.href = "index2.html";
        }
    }
});
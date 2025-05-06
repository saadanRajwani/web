
// Initialize app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    checkUserLogin();
    
    // Set up event listeners
    setupLoginForm();
    loadParas();
    
    // Load mock data
    loadMockData();
});

// Check if user is logged in
function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem('user') || '{"isLoggedIn": false}');
    
    // If not logged in and on a protected page, redirect to login
    if (!user.isLoggedIn) {
        const path = window.location.pathname;
        if (path.endsWith('read.html') || path === '/') {
            // Don't redirect from login page or index
            if (!path.endsWith('login.html') && !path.endsWith('index.html')) {
                window.location.href = 'login.html';
            }
        }
    } else {
        // Show user info if logged in
        document.querySelectorAll('.auth-only').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.guest-only').forEach(el => el.classList.add('hidden'));
    }
}

// Set up login form
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                document.getElementById('login-error').textContent = 'Please enter both email and password';
                document.getElementById('login-error').classList.remove('hidden');
                return;
            }
            
            // Demo login
            if (email === 'user@example.com' && password === 'password') {
                localStorage.setItem('user', JSON.stringify({
                    name: 'User',
                    email: email,
                    isLoggedIn: true
                }));
                
                window.location.href = 'index.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid email or password';
                document.getElementById('login-error').classList.remove('hidden');
            }
        });
    }
}

// Load para buttons
function loadParas() {
    const paraGrid = document.getElementById('para-grid');
    const paraButtons = document.getElementById('para-buttons');
    
    if (paraGrid || paraButtons) {
        // Generate 30 paras
        for (let i = 1; i <= 30; i++) {
            const isCompleted = [1, 3, 5, 7].includes(i);
            const para = {
                id: i,
                name: `Para ${i}`,
                arabicName: `الجزء ${i}`,
                verses: Math.floor(Math.random() * 300) + 100,
                isCompleted: isCompleted
            };
            
            // Create button
            const button = document.createElement('button');
            button.className = `p-4 rounded-lg border ${
                para.isCompleted 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } transition`;
            button.dataset.paraId = para.id;
            
            button.innerHTML = `
                <div class="text-lg font-semibold">${para.name}</div>
                <div class="text-sm text-gray-600">${para.arabicName}</div>
                <div class="text-xs mt-2">Verses: ${para.verses}</div>
                ${para.isCompleted ? '<div class="text-xs text-green-600 mt-1">✓ Completed</div>' : ''}
            `;
            
            // Add click event
            button.addEventListener('click', function() {
                showParaContent(para);
            });
            
            // Add to grid if on read page
            if (paraGrid) {
                paraGrid.appendChild(button);
            }
            
            // Add to dashboard buttons (but only first 10)
            if (paraButtons && i <= 10) {
                const link = document.createElement('a');
                link.href = 'read.html?para=' + i;
                link.className = 'bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded text-center';
                link.textContent = 'Para ' + i;
                paraButtons.appendChild(link);
            }
        }
        
        // Add "View All" button to dashboard
        if (paraButtons) {
            const viewAllLink = document.createElement('a');
            viewAllLink.href = 'read.html';
            viewAllLink.className = 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded text-center';
            viewAllLink.textContent = 'View All';
            paraButtons.appendChild(viewAllLink);
        }
        
        // Check if there's a para parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const paraId = urlParams.get('para');
        
        if (paraId) {
            const para = {
                id: parseInt(paraId),
                name: `Para ${paraId}`,
                arabicName: `الجزء ${paraId}`,
                verses: Math.floor(Math.random() * 300) + 100,
                isCompleted: [1, 3, 5, 7].includes(parseInt(paraId))
            };
            
            showParaContent(para);
        }
    }
}

// Show para content
function showParaContent(para) {
    const paraContent = document.getElementById('para-content');
    
    if (paraContent) {
        // Show the content
        paraContent.classList.remove('hidden');
        
        // Update para title
        document.getElementById('para-title').textContent = `${para.name} (${para.arabicName})`;
        
        // Set up mark complete button
        const completeBtn = document.getElementById('mark-complete-btn');
        completeBtn.addEventListener('click', function() {
            alert(`Para ${para.id} marked as completed!`);
            
            // In a real app, this would make an API call
            // For now, just simulate it with localStorage
            const completed = JSON.parse(localStorage.getItem('completedParas') || '[]');
            if (!completed.includes(para.id)) {
                completed.push(para.id);
                localStorage.setItem('completedParas', JSON.stringify(completed));
            }
            
            // Update UI
            this.textContent = 'Completed ✓';
            this.disabled = true;
            this.classList.add('bg-gray-500');
            this.classList.remove('bg-green-600', 'hover:bg-green-700');
        });
        
        // Scroll to content
        paraContent.scrollIntoView({ behavior: 'smooth' });
    }
}

// Load mock data for dashboard
function loadMockData() {
    // Define mock data
    const mockData = {
        khatm: { 
            number: 1, 
            type: "Full Quran", 
            participants: 25, 
            progress: 35 
        },
        user: { 
            name: "User", 
            completedSections: 3, 
            percentile: "70th" 
        }
    };
    
    // Update data-mock elements
    document.querySelectorAll('[data-mock]').forEach(el => {
        const key = el.getAttribute('data-mock');
        let value = "";
        
        // Parse the key path (e.g., 'khatm.number' becomes mockData.khatm.number)
        const keyPath = key.split('.');
        let currentObj = mockData;
        
        for (const k of keyPath) {
            if (currentObj && currentObj[k] !== undefined) {
                currentObj = currentObj[k];
            } else {
                currentObj = null;
                break;
            }
        }
        
        if (currentObj !== null) {
            el.textContent = currentObj;
        }
    });
    
    // Update progress bar width
    const progressBar = document.querySelector('.bg-blue-600.h-2\.5');
    if (progressBar) {
        progressBar.style.width = mockData.khatm.progress + '%';
    }
}

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create output directory
const outputDir = path.join(__dirname, 'static-html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Create HTML files
function createHtmlFile(filename, title, content) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Quran Reader</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 class="text-2xl font-bold">Quran Reader</h1>
            <nav>
                <ul class="flex space-x-4">
                    <li><a href="index.html" class="text-blue-600 hover:underline">Home</a></li>
                    <li><a href="read.html" class="text-blue-600 hover:underline">Read Quran</a></li>
                    <li><a href="login.html" class="text-blue-600 hover:underline">Login</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
        ${content}
    </main>
    
    <footer class="bg-white shadow-inner mt-auto">
        <div class="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; 2023 Quran Reader. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="app.js"></script>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(outputDir, filename), htmlContent);
  console.log(`Created ${filename}`);
}

// Create index.html (Dashboard)
createHtmlFile('index.html', 'Dashboard', `
    <h1 class="text-3xl font-bold mb-6">Quran Reader Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Current Khatm</h2>
            <p>Khatm #<span data-mock="khatm.number">1</span></p>
            <p>Type: <span data-mock="khatm.type">Full Quran</span></p>
            <p>Participants: <span data-mock="khatm.participants">15</span></p>
            <div class="mt-4">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: 25%"></div>
                </div>
                <p class="text-sm text-gray-600 mt-1"><span data-mock="khatm.progress">25</span>% Completed</p>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Your Contribution</h2>
            <p>Sections Completed: <span data-mock="user.completedSections">3</span></p>
            <p>Your standing: <span data-mock="user.percentile">80th</span> percentile</p>
            <div class="mt-4">
                <a href="read.html" class="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Continue Reading
                </a>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Recent Completions</h2>
            <ul class="space-y-2">
                <li>Ali completed Para 5</li>
                <li>Fatima completed Para 8</li>
                <li>Ahmed completed Para 12</li>
            </ul>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Start Reading</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="para-buttons">
            <!-- Para buttons will be dynamically added -->
        </div>
    </div>
`);

// Create read.html (Para Selection)
createHtmlFile('read.html', 'Read Quran', `
    <h1 class="text-3xl font-bold mb-6">Select a Para to Read</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="para-grid">
            <!-- Para selection buttons will be added dynamically -->
        </div>
    </div>
    
    <div id="para-content" class="mt-8 bg-white rounded-lg shadow p-6 hidden">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold" id="para-title">Para 1</h2>
            <button
                id="mark-complete-btn"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Mark as Completed
            </button>
        </div>
        <div class="border rounded-lg p-6 bg-gray-50">
            <p class="text-right text-2xl font-arabic leading-loose mb-6">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p class="text-right text-2xl font-arabic leading-loose">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿١﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٢﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٣﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٤﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٥﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٦﴾
            </p>
        </div>
    </div>
`);

// Create login.html
createHtmlFile('login.html', 'Login', `
    <div class="w-full max-w-md mx-auto bg-white rounded-lg shadow p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold">Sign In</h1>
            <p class="text-gray-600 mt-2">Welcome to Quran Reader</p>
        </div>
        
        <div id="login-error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 hidden">
            Invalid email or password
        </div>
        
        <form id="login-form">
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2" for="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                />
            </div>
            
            <div class="mb-6">
                <label class="block text-gray-700 font-medium mb-2" for="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                />
                <p class="text-sm text-gray-600 mt-1">
                    <a href="#" class="text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                </p>
            </div>
            
            <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Sign In
            </button>
        </form>
        
        <div class="mt-6 text-center">
            <p class="text-gray-600">
                Don't have an account?
                <a href="#" class="text-blue-600 hover:underline">
                    Sign Up
                </a>
            </p>
        </div>
    </div>
    
    <div class="mt-8 text-center text-sm text-gray-500">
        <p>For demo, use: user@example.com / password</p>
    </div>
`);

// Create app.js (JavaScript for client-side functionality)
const appJs = `
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
                name: \`Para \${i}\`,
                arabicName: \`الجزء \${i}\`,
                verses: Math.floor(Math.random() * 300) + 100,
                isCompleted: isCompleted
            };
            
            // Create button
            const button = document.createElement('button');
            button.className = \`p-4 rounded-lg border \${
                para.isCompleted 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } transition\`;
            button.dataset.paraId = para.id;
            
            button.innerHTML = \`
                <div class="text-lg font-semibold">\${para.name}</div>
                <div class="text-sm text-gray-600">\${para.arabicName}</div>
                <div class="text-xs mt-2">Verses: \${para.verses}</div>
                \${para.isCompleted ? '<div class="text-xs text-green-600 mt-1">✓ Completed</div>' : ''}
            \`;
            
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
                name: \`Para \${paraId}\`,
                arabicName: \`الجزء \${paraId}\`,
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
        document.getElementById('para-title').textContent = \`\${para.name} (\${para.arabicName})\`;
        
        // Set up mark complete button
        const completeBtn = document.getElementById('mark-complete-btn');
        completeBtn.addEventListener('click', function() {
            alert(\`Para \${para.id} marked as completed!\`);
            
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
    const progressBar = document.querySelector('.bg-blue-600.h-2\\.5');
    if (progressBar) {
        progressBar.style.width = mockData.khatm.progress + '%';
    }
}
`;

fs.writeFileSync(path.join(outputDir, 'app.js'), appJs);
console.log('Created app.js');

// Create .htaccess
const htaccess = `
RewriteEngine On
RewriteBase /

# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Rewrite everything else to index.html
RewriteRule ^ index.html [L]

# Compress text files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
`;

fs.writeFileSync(path.join(outputDir, '.htaccess'), htaccess);
console.log('Created .htaccess');

// Create a simple API data.php file
const apiDir = path.join(outputDir, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
}

const dataPhp = `<?php
header('Content-Type: application/json');

// Mock data for the application
$data = [
  'khatm' => [
    'number' => 1,
    'type' => 'Full Quran',
    'participants' => 25,
    'progress' => 35,
    'sections_completed' => 12
  ],
  'user' => [
    'name' => 'User',
    'completedSections' => 3,
    'percentile' => '75th'
  ],
  'completions' => [
    ['user' => 'Ahmed', 'para' => 5, 'date' => '2023-05-15'],
    ['user' => 'Fatima', 'para' => 8, 'date' => '2023-05-14'],
    ['user' => 'Ali', 'para' => 12, 'date' => '2023-05-13']
  ]
];

echo json_encode($data);
?>`;

fs.writeFileSync(path.join(apiDir, 'data.php'), dataPhp);
console.log('Created api/data.php');

// Create a simple README file
const readme = `# Quran Reader Static HTML

This is a static HTML version of the Quran Reader application. It includes:

1. Dashboard page (index.html)
2. Quran reading page (read.html)
3. Login page (login.html)

## Deployment Instructions

1. Upload all files to your web hosting's public_html directory
2. Ensure the .htaccess file is included
3. No database setup is required for this static version

## Demo Login

Email: user@example.com
Password: password

## Customization

- To modify the mock data, edit the api/data.php file
- To change the UI, edit the HTML files directly
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
console.log('Created README.md');

console.log('\nStatic site generated successfully!');
console.log(`Files are in the '${outputDir}' directory`);
console.log('\nTo deploy:');
console.log('1. Upload all files from the static-html directory to your public_html folder');
console.log('2. Make sure the .htaccess file is included');
console.log('3. Visit your website!'); 
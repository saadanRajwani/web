# Static Site Deployment Instructions

## Building Your Static Site

1. On your local computer, run these commands:
   ```
   npx next build
   ```

2. Once the build completes, you'll have an `out` folder containing:
   - HTML files
   - CSS files
   - JavaScript files
   - Images and other assets

## Uploading to Enhance Hosting

1. **Access File Manager**
   - Log into your Enhance hosting control panel
   - Open the File Manager

2. **Upload Files**
   - Navigate to the `public_html` directory
   - Upload all contents from the `out` folder to this directory
   - Make sure to include:
     - All HTML files
     - All CSS files
     - All JavaScript files
     - All image files
     - The `.htaccess` file

3. **Create .htaccess File**
   - If the `.htaccess` file isn't included in your build:
   - Create a new file named `.htaccess` in the `public_html` directory
   - Add the following content:

   ```
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
     Header set X-XS5-Protection "1; mode=block"
   </IfModule>
   ```

4. **Create a Simple Data API (Optional)**
   - Create an `api` folder in `public_html`
   - Create a file `api/data.php` with this content:

   ```php
   <?php
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
   ?>
   ```

5. **Create Data Fetching JavaScript**
   - Create a file `api-client.js` in `public_html` with:

   ```javascript
   // This file will handle API data fetching
   document.addEventListener('DOMContentLoaded', function() {
     // Fetch data from our PHP API
     fetch('/api/data.php')
       .then(response => response.json())
       .then(data => {
         // Update UI with real data
         document.querySelectorAll('[data-mock]').forEach(el => {
           const key = el.getAttribute('data-mock');
           let value = "";
           
           // Parse the key path (e.g., 'khatm.number' becomes data.khatm.number)
           const keyPath = key.split('.');
           let currentObj = data;
           
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
       })
       .catch(error => {
         console.error('Error fetching data:', error);
       });
   });
   ```

6. **Add Script to HTML**
   - Edit `index.html` to include this script before the closing `</body>` tag:
   ```html
   <script src="/api-client.js"></script>
   ```

## Testing Your Site

1. Visit your domain to ensure everything is working properly
2. Test navigation between pages
3. Verify that mock data appears correctly

## Customizing Your Site

As you become more comfortable with hosting:
1. Modify the PHP files to connect to a real database
2. Add more PHP endpoints for specific functionality
3. Create admin pages for managing content 
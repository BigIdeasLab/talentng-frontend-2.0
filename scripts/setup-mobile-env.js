#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLocalIP } from './get-local-ip.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Update .env file with current local IP for mobile testing
 */
function setupMobileEnv() {
  const localIP = getLocalIP();
  const envPath = path.join(process.cwd(), '.env');
  
  console.log(`🔍 Detected local IP: ${localIP}`);
  
  try {
    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the API URL
    const apiUrl = `http://${localIP}:3000/api/v1`;
    const apiUrlPattern = /^NEXT_PUBLIC_TALENTNG_API_URL=.*/m;
    
    if (apiUrlPattern.test(envContent)) {
      // Update existing line
      envContent = envContent.replace(
        apiUrlPattern,
        `NEXT_PUBLIC_TALENTNG_API_URL="${apiUrl}"`
      );
      console.log(`✅ Updated NEXT_PUBLIC_TALENTNG_API_URL to: ${apiUrl}`);
    } else {
      // Add new line
      envContent += `\nNEXT_PUBLIC_TALENTNG_API_URL="${apiUrl}"\n`;
      console.log(`✅ Added NEXT_PUBLIC_TALENTNG_API_URL: ${apiUrl}`);
    }
    
    // Write back to .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log(`\n📱 Mobile Testing Setup Complete!`);
    console.log(`   Frontend: http://${localIP}:8080`);
    console.log(`   Backend:  http://${localIP}:3000`);
    console.log(`\n⚠️  IMPORTANT: Frontend and Backend must use the same IP!`);
    console.log(`   Current setup avoids CORS issues by using same-origin requests.`);
    console.log(`\n🔧 Next Steps:`);
    console.log(`   1. Backend team: Configure server to listen on ${localIP}:3000`);
    console.log(`   2. Frontend: Restart dev server to use new .env`);
    console.log(`   3. Test on mobile: http://${localIP}:8080`);
    console.log(`\n💡 Make sure both devices are on the same Wi-Fi network`);
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
}

// If called directly, run the setup
if (process.argv[1] === __filename) {
  setupMobileEnv();
}

export { setupMobileEnv };
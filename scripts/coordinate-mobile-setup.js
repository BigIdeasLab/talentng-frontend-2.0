#!/usr/bin/env node

import { fileURLToPath } from "url";
import { getLocalIP } from "./get-local-ip.js";
import { setupMobileEnv } from "./setup-mobile-env.js";

const __filename = fileURLToPath(import.meta.url);

/**
 * Coordinate frontend and backend setup for mobile testing
 */
function coordinateMobileSetup() {
  const localIP = getLocalIP();

  console.log("🚀 Mobile Testing Coordination Setup");
  console.log("===================================\n");

  // Update .env file
  setupMobileEnv();

  console.log("\n📋 COORDINATION CHECKLIST:");
  console.log("==========================");

  console.log("\n✅ FRONTEND (Already Done):");
  console.log(`   - .env updated to: http://${localIP}:3000/api/v1`);
  console.log(`   - Dev script configured for 0.0.0.0 (all interfaces)`);
  console.log(`   - Will be accessible at: http://${localIP}:8080`);

  console.log("\n⏳ BACKEND (Needs Backend Team):");
  console.log(`   - Configure server to listen on: ${localIP}:3000`);
  console.log(`   - OR bind to all interfaces: 0.0.0.0:3000`);
  console.log(`   - Ensure firewall allows port 3000`);

  console.log("\n🔥 FIREWALL (Run as Administrator):");
  console.log(
    '   netsh advfirewall firewall add rule name="Backend Dev" dir=in action=allow protocol=TCP localport=3000',
  );
  console.log(
    '   netsh advfirewall firewall add rule name="Frontend Dev" dir=in action=allow protocol=TCP localport=8080',
  );

  console.log("\n🧪 TESTING:");
  console.log(`   1. Backend team starts server on: ${localIP}:3000`);
  console.log(`   2. Frontend team runs: npm run dev`);
  console.log(`   3. Test on laptop: http://${localIP}:8080`);
  console.log(`   4. Test on mobile: http://${localIP}:8080`);

  console.log("\n💡 TROUBLESHOOTING:");
  console.log("   - Both devices must be on same Wi-Fi network");
  console.log("   - Check Windows Firewall settings");
  console.log("   - Verify backend is listening on correct IP");
  console.log("   - Use browser dev tools to check network requests");

  console.log(`\n🎯 SUCCESS CRITERIA:`);
  console.log(`   - No CORS errors (same origin: ${localIP})`);
  console.log(`   - Mobile can access login page`);
  console.log(`   - API requests work from mobile`);
}

// If called directly, run the coordination
if (process.argv[1] === __filename) {
  coordinateMobileSetup();
}

export { coordinateMobileSetup };

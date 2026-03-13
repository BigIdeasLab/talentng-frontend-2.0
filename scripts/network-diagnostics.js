#!/usr/bin/env node

import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/**
 * Comprehensive network diagnostics for mobile testing
 */
function runNetworkDiagnostics() {
  console.log("🔍 Network Diagnostics for Mobile Testing\n");

  const interfaces = os.networkInterfaces();

  console.log("📡 Available Network Interfaces:");
  console.log("=====================================");

  for (const [name, addresses] of Object.entries(interfaces)) {
    console.log(`\n🔌 ${name}:`);

    if (!addresses) continue;

    for (const addr of addresses) {
      if (addr.family === "IPv4") {
        const status = addr.internal ? "🏠 Internal" : "🌐 External";
        const type = addr.address.startsWith("192.168.")
          ? "📱 Mobile-friendly"
          : addr.address.startsWith("10.")
            ? "🏢 Corporate"
            : addr.address.startsWith("172.")
              ? "🐳 Docker/VM"
              : addr.address.startsWith("127.")
                ? "💻 Localhost"
                : "❓ Other";

        console.log(`   ${status} ${type}: ${addr.address}`);
      }
    }
  }

  console.log("\n🎯 Recommended IPs for Mobile Testing:");
  console.log("=====================================");

  const mobileIPs = [];
  const dockerIPs = [];
  const otherIPs = [];

  for (const addresses of Object.values(interfaces)) {
    if (!addresses) continue;

    for (const addr of addresses) {
      if (addr.family === "IPv4" && !addr.internal) {
        if (addr.address.startsWith("192.168.")) {
          mobileIPs.push(addr.address);
        } else if (
          addr.address.startsWith("172.") ||
          addr.address.startsWith("10.")
        ) {
          dockerIPs.push(addr.address);
        } else {
          otherIPs.push(addr.address);
        }
      }
    }
  }

  if (mobileIPs.length > 0) {
    console.log("✅ Best options (192.168.x.x - works with most phones):");
    mobileIPs.forEach((ip) => console.log(`   📱 http://${ip}:8080`));
  }

  if (dockerIPs.length > 0) {
    console.log("\n⚠️  VM/Docker IPs (may not work on phone):");
    dockerIPs.forEach((ip) => console.log(`   🐳 http://${ip}:8080`));
  }

  if (otherIPs.length > 0) {
    console.log("\n🔄 Other IPs:");
    otherIPs.forEach((ip) => console.log(`   🌐 http://${ip}:8080`));
  }

  console.log("\n🛠️  Troubleshooting Steps:");
  console.log("========================");
  console.log("1. ✅ Ensure phone and laptop are on the same Wi-Fi network");
  console.log("2. 🔥 Check Windows Firewall (run as admin):");
  console.log(
    '   netsh advfirewall firewall add rule name="Node.js Dev" dir=in action=allow protocol=TCP localport=8080',
  );
  console.log("3. 🔌 Try different IP addresses from the list above");
  console.log("4. 📱 Test with phone's browser (not app)");
  console.log("5. 🔄 Restart development server with: npm run dev");

  if (dockerIPs.length > 0 && mobileIPs.length === 0) {
    console.log("\n⚠️  DOCKER/VM DETECTED:");
    console.log("Your IP suggests you're using Docker or a VM.");
    console.log("This often prevents mobile access. Try:");
    console.log("- Connect to your host machine's Wi-Fi directly");
    console.log("- Use ngrok: npm install -g ngrok && ngrok http 8080");
  }
}

// If called directly, run diagnostics
if (process.argv[1] === __filename) {
  runNetworkDiagnostics();
}

export { runNetworkDiagnostics };

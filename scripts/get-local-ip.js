#!/usr/bin/env node

import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/**
 * Get the local IP address for mobile testing
 * @returns {string} The local IP address
 */
export function getLocalIP() {
  const interfaces = os.networkInterfaces();

  // Priority order: Real Wi-Fi first, then others, avoid WSL/virtual networks
  const priorityOrder = ["Wi-Fi", "wlan0", "wlp", "Ethernet", "eth0", "en0"];
  const avoidPatterns = ["WSL", "Hyper-V", "vEthernet", "Docker", "VirtualBox"];

  // First, try to find real Wi-Fi interfaces (avoid virtual networks)
  for (const priority of priorityOrder) {
    for (const [name, addresses] of Object.entries(interfaces)) {
      // Skip virtual/WSL interfaces
      const isVirtual = avoidPatterns.some((pattern) =>
        name.toLowerCase().includes(pattern.toLowerCase()),
      );

      if (
        !isVirtual &&
        (name.toLowerCase().includes(priority.toLowerCase()) ||
          name === priority)
      ) {
        const ipv4 = addresses?.find(
          (addr) => addr.family === "IPv4" && !addr.internal,
        );
        if (ipv4) {
          return ipv4.address;
        }
      }
    }
  }

  // Fallback: find any non-internal IPv4 address, preferring 192.168.x.x but not from virtual interfaces
  for (const [name, addresses] of Object.entries(interfaces)) {
    const isVirtual = avoidPatterns.some((pattern) =>
      name.toLowerCase().includes(pattern.toLowerCase()),
    );

    if (!isVirtual) {
      const ipv4 = addresses?.find(
        (addr) =>
          addr.family === "IPv4" &&
          !addr.internal &&
          addr.address.startsWith("192.168."),
      );
      if (ipv4) {
        return ipv4.address;
      }
    }
  }

  // Last resort: any non-internal IPv4 address (including virtual networks)
  for (const addresses of Object.values(interfaces)) {
    const ipv4 = addresses?.find(
      (addr) => addr.family === "IPv4" && !addr.internal,
    );
    if (ipv4) {
      return ipv4.address;
    }
  }

  return "localhost";
}

// If called directly, print the IP
if (process.argv[1] === __filename) {
  const ip = getLocalIP();
  console.log(ip);
}

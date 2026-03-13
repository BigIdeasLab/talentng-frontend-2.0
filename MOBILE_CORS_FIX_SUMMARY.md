# Mobile CORS Fix Summary

## Issue

Frontend running on WSL IP (`192.168.64.1:8080`) could not connect to backend on Wi-Fi IP (`10.60.171.116:3000`) due to CORS policy blocking cross-origin requests.

**Error**: `Access to fetch at 'http://10.60.171.116:3000/api/v1/auth/login' from origin 'http://192.168.64.1:8080' has been blocked by CORS policy`

## Root Cause

- Frontend was bound to WSL virtual network IP
- Backend was bound to Wi-Fi network IP
- Different origins triggered CORS protection
- Backend CORS configuration didn't allow WSL IP

## Solution Implemented

**Same-Origin Strategy**: Configure both frontend and backend to use the same Wi-Fi IP to eliminate CORS issues entirely.

### Frontend Changes ✅

- Updated `.env`: `NEXT_PUBLIC_TALENTNG_API_URL="http://10.60.171.116:3000/api/v1"`
- Dev script already configured for all interfaces: `next dev -p 8080 -H 0.0.0.0`
- Frontend accessible at: `http://10.60.171.116:8080`

### Backend Changes Required ⏳

Backend team needs to configure server to listen on Wi-Fi IP:

```javascript
// Instead of:
app.listen(3000, "localhost");

// Use:
app.listen(3000, "10.60.171.116");
// OR bind to all interfaces:
app.listen(3000, "0.0.0.0");
```

### Scripts Created

- `scripts/coordinate-mobile-setup.js` - Comprehensive setup coordination
- Enhanced `scripts/setup-mobile-env.js` - Auto-detects Wi-Fi IP and updates .env
- Enhanced `scripts/get-local-ip.js` - Prioritizes real Wi-Fi over virtual networks

### NPM Scripts Added

- `npm run mobile:coordinate` - Full coordination setup with checklist
- `npm run mobile:setup` - Update .env with current IP
- `npm run mobile:ip` - Show current detected IP
- `npm run mobile:diagnose` - Network diagnostics

## Testing Steps

1. **Backend team**: Start server on `10.60.171.116:3000`
2. **Frontend team**: Run `npm run dev`
3. **Laptop test**: Visit `http://10.60.171.116:8080`
4. **Mobile test**: Visit `http://10.60.171.116:8080` on phone

## Success Criteria

- ✅ No CORS errors (same origin)
- ✅ Mobile can access login page
- ✅ API requests work from mobile
- ✅ Both laptop and phone use same URL

## Firewall Configuration

Run as Administrator:

```cmd
netsh advfirewall firewall add rule name="Backend Dev" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Frontend Dev" dir=in action=allow protocol=TCP localport=8080
```

## Files Modified

- `.env` - Updated API URL to Wi-Fi IP
- `package.json` - Added mobile:coordinate script
- `scripts/coordinate-mobile-setup.js` - New coordination script
- `scripts/setup-mobile-env.js` - Enhanced with better messaging
- `BACKEND_CORS_SETUP.md` - Updated with same-origin solution

## Alternative Solutions Considered

1. **CORS Configuration**: Add WSL IP to backend CORS allowlist
   - ❌ More complex, requires backend changes
   - ❌ Still cross-origin, potential for other issues

2. **Proxy Setup**: Use Next.js API routes as proxy
   - ❌ Adds complexity and latency
   - ❌ Doesn't solve mobile testing needs

3. **Same-Origin Setup**: Use same IP for both services ✅
   - ✅ Eliminates CORS entirely
   - ✅ Simpler configuration
   - ✅ Better for mobile testing

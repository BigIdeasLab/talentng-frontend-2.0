# Backend CORS Setup for Mobile Testing

## Current Issue
Frontend on `http://192.168.64.1:8080` (WSL) cannot connect to backend on `http://10.60.171.116:3000` (Wi-Fi) due to CORS policy.

## ✅ RECOMMENDED SOLUTION: Same-Origin Setup
**Best approach**: Configure both frontend and backend to use the same IP address to avoid CORS entirely.

### Current Configuration (after running setup-mobile-env.js):
- Frontend should run on: `http://10.60.171.116:8080`
- Backend should run on: `http://10.60.171.116:3000`
- API URL in .env: `http://10.60.171.116:3000/api/v1`

### Backend Changes Needed:
```javascript
// Instead of:
app.listen(3000, 'localhost');
// or
app.listen(3000, '127.0.0.1');

// Use the Wi-Fi IP:
app.listen(3000, '10.60.171.116');
// or bind to all interfaces:
app.listen(3000, '0.0.0.0');
```

### Frontend Changes:
```bash
# Update package.json dev script to use Wi-Fi IP:
"dev": "next dev -H 10.60.171.116 -p 8080"
# or bind to all interfaces:
"dev": "next dev -H 0.0.0.0 -p 8080"
```

This eliminates CORS issues since both services use the same origin.

## Backend Configuration Needed

### Express.js with cors middleware:
```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://192.168.64.1:8080',    // WSL IP
    'http://10.60.171.116:8080',   // Wi-Fi IP
    // Add other team members' IPs as needed
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Alternative: Dynamic CORS for development
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost and any 192.168.x.x or 10.x.x.x IP
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/
    ];
    
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

### Next.js API Routes:
```javascript
// In your API route handler
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Your API logic here
}
```

### Environment-based CORS:
```javascript
const allowedOrigins = process.env.NODE_ENV === 'development' 
  ? [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://192.168.64.1:8080',
      'http://10.60.171.116:8080',
      // Add more development IPs as needed
    ]
  : [
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};
```

## Quick Fix for Testing
If you need immediate testing, the backend can temporarily use:
```javascript
app.use(cors({
  origin: '*',  // WARNING: Only for development!
  credentials: true
}));
```

## Server Binding
Also ensure the backend server is bound to all interfaces:
```javascript
// Instead of:
app.listen(3000, 'localhost');

// Use:
app.listen(3000, '0.0.0.0');
```

## Testing the Fix
After backend updates, test with:
```bash
# From your laptop
curl -H "Origin: http://192.168.64.1:8080" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://10.60.171.116:3000/api/v1/auth/login
```

Should return CORS headers allowing the origin.
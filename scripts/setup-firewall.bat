@echo off
echo Setting up Windows Firewall for mobile testing...
echo.

echo Adding firewall rule for Node.js development server (port 8080)...
netsh advfirewall firewall add rule name="Node.js Dev Server" dir=in action=allow protocol=TCP localport=8080

echo.
echo Adding firewall rule for backend API server (port 3000)...
netsh advfirewall firewall add rule name="Node.js API Server" dir=in action=allow protocol=TCP localport=3000

echo.
echo ✅ Firewall rules added successfully!
echo.
echo Now try accessing your app from your phone:
echo Frontend: http://10.60.171.116:8080
echo Backend:  http://10.60.171.116:3000
echo.
echo Make sure both devices are on the same Wi-Fi network.
pause
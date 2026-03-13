@echo off
echo Setting up mobile device testing...
echo.

echo Adding Windows Firewall rule for Node.js development server...
netsh advfirewall firewall add rule name="Node.js Development Server" dir=in action=allow protocol=TCP localport=8080

echo.
echo Setup complete!
echo.
echo Your development server will be accessible at:
echo http://192.168.1.137:8080
echo.
echo Make sure your mobile device is connected to the same Wi-Fi network.
echo Then open your mobile browser and navigate to the URL above.
echo.
pause
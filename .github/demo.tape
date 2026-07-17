# VHS Demo — wifi-security-mcp-server
Output .github/demo.gif

Set Shell "bash"
Set FontSize 14
Set Width 1000
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 30ms

# Show help
Type `npx -y wifi-security-mcp-server --help`
Sleep 300ms
Enter
Sleep 6s

# Scan WiFi networks
Type `npx -y wifi-security-mcp-server --tool scan_wifi_networks '{"mode":"check_encryption","encryption":"WPA2","pmf":"disabled"}'`
Sleep 300ms
Enter
Sleep 6s

# Look up a Bluetooth attack
Type `npx -y wifi-security-mcp-server --tool scan_bluetooth '{"mode":"identify_version","lmp_version":9}'`
Sleep 300ms
Enter
Sleep 6s

# Check wireless CVEs
Type `npx -y wifi-security-mcp-server --tool lookup_wireless_cve '{"mode":"search","keyword":"KRACK"}'`
Sleep 300ms
Enter
Sleep 6s

Sleep 2s

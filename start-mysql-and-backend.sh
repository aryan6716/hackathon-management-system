#!/bin/bash
# start-mysql-and-backend.sh
# Run this once to start MySQL and launch the backend server

echo ""
echo "🔧 Starting MySQL server..."
sudo launchctl load -w /Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist 2>/dev/null
echo "   Waiting for MySQL to be ready..."
sleep 4

# Verify MySQL is listening
if lsof -i :3306 | grep -q LISTEN; then
  echo "✅ MySQL is running on port 3306"
else
  echo "❌ MySQL failed to start. Check System Preferences → MySQL."
  exit 1
fi

echo ""
echo "🚀 Starting HackathonHub backend..."
cd "$(dirname "$0")/backend"
npm run dev

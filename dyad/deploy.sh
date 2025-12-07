#!/bin/bash
# Deployment script for DYAD BackBench

echo "🚀 Deploying DYAD BackBench..."

# Navigate to dyad directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create userData directory
echo "📁 Creating userData directory..."
mkdir -p userData

# Run database migrations
echo "🗄️ Running database migrations..."
if [ -f "userData/sqlite.db" ]; then
  echo "Database exists, running migrations..."
else
  echo "Creating new database..."
fi

# Run each migration
for migration in drizzle/*.sql; do
  if [ -f "$migration" ]; then
    echo "Running migration: $migration"
    sqlite3 userData/sqlite.db < "$migration" 2>/dev/null || true
  fi
done

# Verify database
echo "✅ Verifying database schema..."
sqlite3 userData/sqlite.db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Database initialized successfully"
  
  # Show tables
  echo "📊 Database tables:"
  sqlite3 userData/sqlite.db ".tables"
else
  echo "❌ Database initialization failed"
  exit 1
fi

# Start server
echo "🎯 Starting DYAD BackBench server..."
npm run dev:server-only

echo "✅ Deployment complete!"

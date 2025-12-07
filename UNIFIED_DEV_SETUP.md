# Unified Development Environment Setup

## Overview
Both WORKSPACE (Bolt.DIY) and BackBench (DYAD) now run together with a single command!

---

## What Was Added

### 1. **Visit BackBench Button** (Header)
- Located next to the "About" button
- Click to open BackBench dashboard in new tab
- Opens `http://localhost:9999`

### 2. **Unified Dev Command**
- Single command to start both servers
- Uses `concurrently` to run them together
- Color-coded terminal output

---

## Available Commands

### Run Both Servers Together (Recommended)

```bash
cd /Users/mymac/Desktop/DYAD_BOLT

# Install dependencies (first time only)
npm install

# Start both WORKSPACE and BackBench together
npm run dev
```

**Terminal Output:**
```
[WORKSPACE] > bolt.diy dev server starting...
[BACKBENCH] > DYAD server starting on port 9999...
```

### Run Individually

```bash
# Only WORKSPACE (Bolt.DIY)
npm run workspace

# Only BackBench (DYAD)
npm run backbench
```

---

## File Changes

### Modified Files:

1. **`package.json`** (root)
   - Added `concurrently` package
   - Created unified dev scripts
   - Color-coded output

2. **`bolt.diy/app/components/header/Header.tsx`**
   - Added "Visit BackBench" button
   - Opens BackBench in new tab

---

## How It Works

### Command Breakdown:

```json
{
  "scripts": {
    "dev": "concurrently [runs both]",
    "dev:workspace": "cd bolt.diy && npm run dev",
    "dev:backbench": "cd dyad && npm run dev:server-only",
    "workspace": "cd bolt.diy && npm run dev",
    "backbench": "cd dyad && npm run dev:server-only"
  }
}
```

### Concurrently Options:

- `--names "WORKSPACE,BACKBENCH"` - Label each server
- `--prefix-colors "cyan,magenta"` - Color-code output
- Runs both commands in parallel

---

## Usage Guide

### For Development:

```bash
# 1. Navigate to project root
cd /Users/mymac/Desktop/DYAD_BOLT

# 2. Start both servers
npm run dev

# Now you have:
# ✅ WORKSPACE running on http://localhost:5173
# ✅ BackBench running on http://localhost:9999
```

### Workflow:

1. **Start servers**: `npm run dev`
2. **Open browser**: `http://localhost:5173`
3. **Login** to WORKSPACE
4. **Generate code** in Bolt
5. **Click "Visit BackBench"** button → Opens `http://localhost:9999`
6. **Upload files** → Click "BackBench" upload button
7. **View in BackBench** → Auto-redirects or click "Visit BackBench"

---

## Terminal Output Example

```bash
$ npm run dev

[WORKSPACE]  VITE v5.1.4  ready in 234 ms
[WORKSPACE]  ➜  Local:   http://localhost:5173/
[WORKSPACE]  ➜  Network: use --host to expose
[BACKBENCH]  🎉 Dyad Backend Server Started!
[BACKBENCH]  🌐 HTTP API: http://localhost:9999
[BACKBENCH]  🔌 WebSocket: ws://localhost:9999
[BACKBENCH]  ✅ Database initialized successfully!
[BACKBENCH]  💡 Ready to accept connections from bolt.diy
```

---

## Stopping the Servers

Press `Ctrl + C` in the terminal to stop both servers.

```bash
# Terminal output:
^C
[WORKSPACE] Shutting down...
[BACKBENCH] 🛑 Shutting down Dyad backend server...
[WORKSPACE] ✅ Server closed gracefully
[BACKBENCH] ✅ Server closed gracefully
```

---

## Git Commands

```bash
cd /Users/mymac/Desktop/DYAD_BOLT

# Add modified files
git add package.json
git add bolt.diy/app/components/header/Header.tsx

# Commit
git commit -m "Add Visit BackBench button and unified dev command

- Added 'Visit BackBench' button to header
- Created unified dev script to run both servers together
- Uses concurrently for parallel execution
- Color-coded terminal output for clarity"

# Push
git push origin main
```

---

## Troubleshooting

### Issue: "Command not found: concurrently"

**Solution:**
```bash
cd /Users/mymac/Desktop/DYAD_BOLT
npm install
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 5173 or 9999
lsof -ti:5173
lsof -ti:9999

# Kill the process
kill -9 <PID>

# Or restart servers
npm run dev
```

### Issue: One server fails to start

**Solution:**
```bash
# Run individually to debug
npm run workspace  # Test WORKSPACE
npm run backbench  # Test BackBench

# Check logs for specific errors
```

---

## Benefits

### ✅ Single Command
- No need to open multiple terminals
- Start everything with `npm run dev`

### ✅ Color-Coded Output
- **Cyan** = WORKSPACE
- **Magenta** = BackBench
- Easy to distinguish log messages

### ✅ Quick Access
- "Visit BackBench" button in header
- Opens in new tab for easy switching

### ✅ Development Efficiency
- Both servers always running
- No manual coordination needed

---

## Architecture

```
DYAD_BOLT (root)
├── package.json ← Unified dev scripts
├── bolt.diy/ (WORKSPACE)
│   ├── npm run dev → Port 5173
│   └── Header → "Visit BackBench" button
└── dyad/ (BackBench)
    └── npm run dev:server-only → Port 9999

Command: npm run dev
    ↓
Concurrently runs:
    ├── WORKSPACE (bolt.diy)
    └── BackBench (dyad)
```

---

## Next Steps

1. **Install dependencies** (if not done):
   ```bash
   npm install
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   - WORKSPACE: `http://localhost:5173`
   - BackBench: Click "Visit BackBench" button or `http://localhost:9999`

---

## Status: ✅ READY TO USE

**You can now start both servers with one command!**

```bash
npm run dev
```

**🚀 WORKSPACE and BackBench running together!** ✨

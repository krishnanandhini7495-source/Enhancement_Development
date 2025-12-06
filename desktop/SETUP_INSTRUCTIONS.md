# SETUP_INSTRUCTIONS.md

# 🚀 Quick Start Guide - Desktop App Setup

Follow these steps to set up and run the desktop version of Cheap&Best Salon Management System.

## ✅ Step 1: Install Rust (One-time setup)

Tauri requires Rust to build the desktop application.

### Windows:
```powershell
# Download and run the Rust installer
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe

# Follow the on-screen instructions (just press Enter for defaults)
# Restart your terminal after installation
```

Verify installation:
```powershell
rustc --version
cargo --version
```

## ✅ Step 2: Install Node.js Dependencies

```powershell
# Navigate to the desktop folder
cd desktop

# Install all required packages
npm install
```

This installs:
- `@tauri-apps/cli` - Tauri build tools
- `@tauri-apps/api` - Tauri JavaScript/TypeScript APIs
- Vite and React dependencies

## ✅ Step 3: Verify Backend API is Running

Before running the desktop app, ensure your .NET Core API is running:

```powershell
# Open a NEW terminal window
cd backend/SalonSoftware.API
dotnet run
```

The API should be accessible at `http://localhost:5000`

## 🎯 Running the Desktop App

### Development Mode (with hot-reload):

```powershell
cd desktop
npm run dev:tauri
```

What happens:
1. Vite starts on `http://localhost:1420`
2. Tauri opens a native window
3. Your React app loads from `../src`
4. Changes to `/src` files auto-reload

### Production Build:

```powershell
cd desktop
npm run build
```

Output location:
```
desktop/src-tauri/target/release/bundle/msi/
```

## 📁 Project Structure

```
/salon software (root)
│
├── /src                          ← React + TypeScript source (SHARED)
│   ├── /components
│   ├── /pages
│   ├── /services
│   └── main.tsx
│
├── /backend                      ← .NET Core 9 API
│   └── /SalonSoftware.API
│
├── /desktop                      ← Desktop app (NEW)
│   ├── /src-tauri               ← Rust backend
│   │   ├── /src
│   │   │   └── main.rs          ← Tauri entry point
│   │   ├── Cargo.toml           ← Rust dependencies
│   │   └── tauri.conf.json      ← Tauri configuration
│   │
│   ├── vite.config.ts           ← Vite config (points to ../src)
│   ├── tsconfig.json            ← TypeScript config (points to ../src)
│   ├── package.json             ← Desktop dependencies
│   └── index.html               ← Entry HTML
│
├── package.json                  ← Web app package.json (UNCHANGED)
└── vite.config.ts               ← Web app Vite config (UNCHANGED)
```

## 🔍 How Source Code Sharing Works

### Web App:
```typescript
// Uses /src directly
import { Button } from "@/components/ui/button";  // → /src/components/ui/button
```

### Desktop App:
```typescript
// Uses /src via path alias
import { Button } from "@/components/ui/button";  // → ../src/components/ui/button
```

**Result**: Both apps use the exact same React components, pages, and services!

## 🌐 API Communication

Both web and desktop apps communicate with the .NET Core API the same way:

```typescript
// From any component in /src
const response = await fetch('http://localhost:5000/api/customers');
const customers = await response.json();
```

The desktop app includes the API URL in its Content Security Policy:
```json
"csp": "connect-src 'self' http://localhost:5000"
```

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install desktop dependencies |
| `npm run dev` | Start Vite dev server only |
| `npm run dev:tauri` | Start Tauri desktop app (dev mode) |
| `npm run build` | Build production desktop installer |
| `npm run tauri` | Run Tauri CLI commands directly |

## ⚠️ Important Notes

### Do NOT modify from desktop folder:
- `/src` folder (shared with web app)
- Root `package.json` (web app dependencies)
- Root `vite.config.ts` (web app config)

### Desktop-specific files only:
- `desktop/package.json`
- `desktop/vite.config.ts`
- `desktop/tsconfig.json`
- `desktop/src-tauri/**`

## 🐛 Troubleshooting

### Error: "Cannot find module '@/components/...'"
**Fix**: Ensure you're in the `desktop` folder when running commands.

### Error: "Rust compiler not found"
**Fix**: Install Rust (Step 1) and restart your terminal.

### Error: "API calls return CORS errors"
**Fix**: Ensure the .NET Core API is running on `http://localhost:5000`.

### Error: "Failed to resolve '../src/main.tsx'"
**Fix**: The `index.html` references `../src/main.tsx`. Ensure the path is correct relative to `desktop/index.html`.

### Hot reload not working
**Fix**: Vite watches `../src` automatically. Save your files and wait 1-2 seconds.

## 🎨 Customizing the Desktop App

### Change Window Size:
Edit `desktop/src-tauri/tauri.conf.json`:
```json
"windows": [{
  "width": 1400,
  "height": 900
}]
```

### Change App Name:
Edit `desktop/src-tauri/tauri.conf.json`:
```json
"package": {
  "productName": "Your App Name"
}
```

### Add Custom Icons:
1. Place icon files in `desktop/src-tauri/icons/`
2. Update paths in `desktop/src-tauri/tauri.conf.json`

## 📦 Distribution

### Build the Installer:
```powershell
cd desktop
npm run build
```

### Find the Installer:
```
desktop/src-tauri/target/release/bundle/
├── msi/           ← Windows installer (.msi)
└── nsis/          ← Alternative Windows installer (.exe)
```

### Distribute:
- Send the `.msi` or `.exe` file to users
- No additional dependencies required
- The app is fully standalone

## 🚢 Deployment Workflow

### For Web Version:
```powershell
# From root folder
npm run build
# Deploy /dist to web server
```

### For Desktop Version:
```powershell
# From desktop folder
cd desktop
npm run build
# Distribute the installer from desktop/src-tauri/target/release/bundle/
```

Both versions remain independent!

## 📚 Next Steps

1. ✅ Install Rust
2. ✅ Run `npm install` in `desktop/`
3. ✅ Start backend API: `cd backend/SalonSoftware.API && dotnet run`
4. ✅ Start desktop app: `cd desktop && npm run dev:tauri`
5. ✅ Make changes to `/src` and see them reflect in both web and desktop!

---

**Need Help?** Check the detailed README.md in the desktop folder or visit:
- [Tauri Documentation](https://tauri.app/)
- [Vite Documentation](https://vitejs.dev/)

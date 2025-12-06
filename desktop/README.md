# Cheap&Best Salon - Desktop Application

This is the desktop version of the Cheap&Best Salon Management System, built with Tauri.

## 🏗️ Architecture

```
/salon software
├── /src                  ← Shared React + TypeScript source code (used by both web and desktop)
├── /backend              ← .NET Core 9 API (runs separately)
├── /desktop              ← Tauri desktop app (THIS FOLDER)
│   ├── /src-tauri        ← Rust backend for Tauri
│   ├── vite.config.ts    ← Points to ../src for source code
│   ├── tsconfig.json     ← TypeScript config (references ../src)
│   └── package.json      ← Desktop-specific dependencies and scripts
└── package.json          ← Web app package.json (NOT affected)
```

### How it works:
1. **Web App**: Uses `/src` directly with its own Vite config
2. **Desktop App**: Uses `/src` via path aliasing in `vite.config.ts` and `tsconfig.json`
3. **Backend API**: Both web and desktop communicate with the same .NET Core API on `http://localhost:5000`

## 📋 Prerequisites

### 1. Install Rust (Required for Tauri)
```powershell
# Download and install from: https://www.rust-lang.org/tools/install
# Or use this one-liner:
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe; .\rustup-init.exe
```

### 2. Install Node.js Dependencies
```powershell
cd desktop
npm install
```

## 🚀 Development Mode

### Step 1: Start the .NET Core API (in a separate terminal)
```powershell
cd backend/SalonSoftware.API
dotnet run
```
The API will run on `http://localhost:5000`

### Step 2: Start the Desktop App
```powershell
cd desktop
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:1420`
- Load React + TypeScript code from `../src`
- Open the Tauri window with your app
- Enable hot-reload (changes in `/src` will reflect immediately)

## 📦 Production Build

### Build the Desktop Installer
```powershell
cd desktop
npm run build
```

This will:
1. Build the React TypeScript app using Vite → outputs to `desktop/dist/`
2. Compile the Rust backend
3. Package everything into a Windows installer (`.msi` or `.exe`)

The installer will be located at:
```
desktop/src-tauri/target/release/bundle/
```

## 🔧 Configuration Details

### Vite Config (`vite.config.ts`)
```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "../src"),  // Points to parent src folder
  },
}
```

### TypeScript Config (`tsconfig.json`)
```json
"paths": {
  "@/*": ["../src/*"]  // Points to parent src folder
}
```

### Tauri Config (`src-tauri/tauri.conf.json`)
```json
"security": {
  "csp": "connect-src 'self' http://localhost:5000 https://localhost:5001"
}
```
This allows the desktop app to communicate with your .NET Core API.

## 🌐 Communication Flow

```
Desktop App (Tauri WebView)
  ↓ Uses
React + TypeScript (/src)
  ↓ Calls API via fetch/axios
.NET Core 9 API (localhost:5000)
  ↓ Queries
MS SQL Database
```

### Example API Call (works identically in web and desktop):
```typescript
// From any component in /src
const response = await fetch('http://localhost:5000/api/customers');
const data = await response.json();
```

## 📝 TypeScript Support

- All TypeScript types from `/src` are preserved
- Tauri API types are included via `@tauri-apps/api`
- IntelliSense and type checking work for both React and Tauri code

## 🔍 Troubleshooting

### Issue: "Cannot find module '@/...'"
**Solution**: Make sure you're running commands from the `desktop` folder, not the root.

### Issue: "API calls failing"
**Solution**: Ensure the .NET Core API is running on `http://localhost:5000` before starting the desktop app.

### Issue: "Rust compiler not found"
**Solution**: Install Rust from https://www.rust-lang.org/tools/install and restart your terminal.

### Issue: "Changes not reflecting"
**Solution**: Vite watches `../src` automatically. Save your files and the desktop app will hot-reload.

## 🎨 Icons

Default icons are in `src-tauri/icons/`. To customize:
1. Replace the icon files in that folder
2. Rebuild with `npm run build`

## 📚 Additional Resources

- [Tauri Documentation](https://tauri.app/)
- [Vite Documentation](https://vitejs.dev/)
- [React + TypeScript + Tauri Guide](https://tauri.app/v1/guides/getting-started/setup/vite)

## ⚠️ Important Notes

1. **Do NOT modify** the root `/src`, `/package.json`, or web app files from the desktop folder
2. The desktop app shares the same source code as the web app
3. Both versions use the same .NET Core API
4. The desktop version does NOT require a web server in production (it bundles everything)
5. API endpoints must allow CORS or run on the same origin

## 🚢 Deployment

### For Web App:
```powershell
# From root
npm run build
# Deploy /dist to your web server
```

### For Desktop App:
```powershell
# From desktop folder
cd desktop
npm run build
# Distribute the installer from desktop/src-tauri/target/release/bundle/
```

Both versions remain independent and fully functional.

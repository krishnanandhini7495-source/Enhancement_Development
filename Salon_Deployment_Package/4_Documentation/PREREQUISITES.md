# Salon Software - Prerequisites & System Requirements

## 📋 Table of Contents
- [Desktop Application (Windows)](#desktop-application-windows)
- [Web Application (Browser)](#web-application-browser)
- [Development Environment](#development-environment)
- [Installation Steps](#installation-steps)

---

## 🖥️ Desktop Application (Windows)

### Minimum System Requirements
- **Operating System:** Windows 10 (64-bit) or Windows 11
- **Processor:** Intel Core i3 or AMD equivalent (2.0 GHz or higher)
- **RAM:** 4 GB minimum (8 GB recommended)
- **Storage:** 500 MB free disk space
- **Display:** 1280x720 resolution minimum (1920x1080 recommended)
- **Network:** 
  - ✅ **No internet required** if backend API and database are hosted locally
  - ⚠️ Internet required only if connecting to cloud-hosted backend

### Required Software (Automatically Installed)
The desktop installer (`.msi` or `.exe`) automatically includes:
- Microsoft Edge WebView2 Runtime (for rendering UI)
- .NET Runtime dependencies (bundled)

### Additional Requirements
- **Database Backend:** 
  - SQL Server Express 2019 or later (if hosting locally) ✅ **Recommended for offline use**
  - OR connection to cloud-hosted SQL Server (Azure SQL, AWS RDS) - requires internet
  
- **Backend API:**
  - ASP.NET Core 9.0 Runtime (if hosting API locally) ✅ **Recommended for offline use**
  - OR connection to cloud-hosted API endpoint - requires internet

### Deployment Scenarios

#### Scenario 1: Fully Local (No Internet Required) ✅ **Recommended**
- Desktop App: Installed on Windows PC
- Backend API: Running on same PC (`localhost:5000`)
- Database: SQL Server Express on same PC
- **Advantage:** Works completely offline, no internet dependency

#### Scenario 2: Local Network (LAN)
- Desktop App: Installed on multiple PCs
- Backend API: Running on one server PC (e.g., `192.168.1.100:5000`)
- Database: SQL Server on server PC
- **Advantage:** Multiple users, no internet needed, just local network

#### Scenario 3: Cloud-Connected
- Desktop App: Installed on Windows PCs
- Backend API: Hosted in cloud (Azure/AWS)
- Database: Cloud SQL Server
- **Advantage:** Access from anywhere, but requires internet connection

### Installation Steps (Desktop)

#### Complete Local Setup (Offline - No Internet Required)

**Step 1: Install SQL Server Express (Database)**
1. Download SQL Server 2022 Express from another PC with internet
   - URL: https://www.microsoft.com/sql-server/sql-server-downloads
   - File: `SQL2022-SSEI-Expr.exe` (approx 6 MB)
2. Copy to target PC and run installer
3. Choose "Basic" installation type
4. Accept license terms
5. Select installation location (default: `C:\Program Files\Microsoft SQL Server\`)
6. Wait for download and installation (approx 1.5 GB)
7. Note the server name shown at completion: `localhost\SQLEXPRESS` or `COMPUTERNAME\SQLEXPRESS`
8. Click "Install SSMS" (optional but recommended for database management)

**Step 2: Install .NET 9.0 Runtime**

**Which .NET Runtime to Install:**
- **File Name:** `dotnet-hosting-9.0.x-win.exe` 
- **Full Name:** ASP.NET Core 9.0 Runtime - Windows Hosting Bundle
- **Size:** Approx 60 MB
- **Download URL:** https://dotnet.microsoft.com/download/dotnet/9.0
- **What it includes:**
  - .NET Runtime 9.0
  - ASP.NET Core Runtime 9.0
  - .NET Desktop Runtime 9.0 (for Windows apps)

**Installation Steps:**
1. Download on a PC with internet:
   - Go to: https://dotnet.microsoft.com/download/dotnet/9.0
   - Find: "Hosting Bundle" section
   - Download: `dotnet-hosting-9.0.x-win.exe` (x = latest patch version)
2. Copy installer to target PC
3. Run `dotnet-hosting-9.0.x-win.exe` as Administrator
4. Click "Install"
5. Wait for installation to complete (takes 2-3 minutes)
6. Click "Close"
7. **Verify Installation:**
   ```powershell
   dotnet --version
   # Should show: 9.0.x
   
   dotnet --list-runtimes
   # Should show:
   # Microsoft.AspNetCore.App 9.0.x
   # Microsoft.NETCore.App 9.0.x
   # Microsoft.WindowsDesktop.App 9.0.x
   ```

**Alternative: If you only need .NET Runtime (not hosting):**
- Download: `dotnet-runtime-9.0.x-win-x64.exe` (smaller, 25 MB)
- But hosting bundle is recommended as it includes everything

**Step 3: Setup Backend API**

**Option A: Using Pre-built Published Files (Recommended for End Users)**

1. **Get the published backend files:**
   - From developer: Get the `publish` folder (contains compiled .dll files)
   - Or build yourself:
     ```powershell
     cd "backend/SalonSoftware.API"
     dotnet publish -c Release -o "C:\SalonAPI"
     ```

2. **Place files on target PC:**
   - Copy entire `publish` folder to: `C:\SalonAPI\`
   - Folder should contain:
     - `SalonSoftware.API.dll` (main API file)
     - `appsettings.json` (configuration)
     - `web.config`
     - Other .dll files

3. **Configure Database Connection:**
   - Open `C:\SalonAPI\appsettings.json` in Notepad
   - Find the `ConnectionStrings` section:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SalonDB;Integrated Security=true;TrustServerCertificate=true;"
     },
     "Jwt": {
       "Key": "YourSuperSecretKeyHere123456789012",
       "Issuer": "SalonSoftwareAPI",
       "Audience": "SalonSoftwareClient"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information"
       }
     },
     "AllowedHosts": "*"
   }
   ```
   
   **Connection String Breakdown:**
   - `Server=localhost\\SQLEXPRESS` - Your SQL Server instance
     - Change to your server name if different (e.g., `MYPC\\SQLEXPRESS`)
   - `Database=SalonDB` - Database name (will be created)
   - `Integrated Security=true` - Use Windows authentication (no password needed)
   - `TrustServerCertificate=true` - Trust local SQL Server certificate
   
   **Alternative Connection String (with username/password):**
   ```json
   "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SalonDB;User ID=sa;Password=YourPassword;TrustServerCertificate=true;"
   ```

4. **Install Entity Framework Tools (for database migrations):**
   ```powershell
   dotnet tool install --global dotnet-ef
   # Verify
   dotnet ef --version
   # Should show: Entity Framework Core .NET Command-line Tools 9.0.x
   ```

5. **Create Database (Run Migrations):**
   ```powershell
   cd C:\SalonAPI
   dotnet ef database update
   ```
   
   **What this does:**
   - Creates `SalonDB` database in SQL Server
   - Creates all tables (Users, Roles, Staff, Services, Products, Invoices, etc.)
   - Seeds default admin user:
     - Email: admin@salon.com
     - Password: Admin@123

   **Expected Output:**
   ```
   Build started...
   Build succeeded.
   Applying migration '20251129100332_InitialCreate'.
   Applying migration '20251129120346_UpdateSalonSettingsSchema'.
   Done.
   ```

6. **Test Backend API:**
   ```powershell
   cd C:\SalonAPI
   dotnet SalonSoftware.API.dll
   ```
   
   **Expected Output:**
   ```
   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   info: Microsoft.Hosting.Lifetime[0]
         Application started. Press Ctrl+C to shut down.
   ```

7. **Test API in Browser:**
   - Open browser
   - Go to: `http://localhost:5000/api/auth/login`
   - Should see JSON response (or error if no data sent - that's ok!)

**Option B: Running from Source Code (For Developers)**

1. Copy entire `backend/SalonSoftware.API/` folder to target PC
2. Update `appsettings.json` connection string (same as above)
3. Run migrations:
   ```powershell
   cd backend/SalonSoftware.API
   dotnet ef database update
   ```
4. Start API:
   ```powershell
   dotnet run
   ```

**Step 4: Setup Backend API as Windows Service (Optional - Auto-start)**

To make API start automatically with Windows:

1. **Install NSSM (Non-Sucking Service Manager):**
   - Download: https://nssm.cc/download
   - Extract `nssm.exe` to `C:\SalonAPI\`

2. **Create Windows Service:**
   ```powershell
   # Run as Administrator
   cd C:\SalonAPI
   .\nssm.exe install SalonAPI "C:\Program Files\dotnet\dotnet.exe" "C:\SalonAPI\SalonSoftware.API.dll"
   ```

3. **Configure Service:**
   ```powershell
   # Set working directory
   .\nssm.exe set SalonAPI AppDirectory "C:\SalonAPI"
   
   # Set auto-start
   .\nssm.exe set SalonAPI Start SERVICE_AUTO_START
   
   # Start service
   Start-Service SalonAPI
   ```

4. **Verify Service:**
   ```powershell
   Get-Service SalonAPI
   # Status should show: Running
   ```

Now API will start automatically when Windows boots!

**Step 5: Install Desktop App**

#### Option 1: Using MSI Installer (Recommended for Enterprise)
1. Download `Salon_1.0.0_x64_en-US.msi`
2. Double-click the MSI file
3. Follow the installation wizard
4. Choose installation directory (default: `C:\Program Files\Salon\`)
5. Click "Install"
6. Launch from Start Menu: "Salon"

#### Option 2: Using NSIS Installer (Portable)
1. Download `Salon_1.0.0_x64-setup.exe`
2. Run the setup executable
3. Choose installation location
4. Setup will create desktop shortcut automatically
5. Launch from desktop or Start Menu

#### Post-Installation Configuration
1. **Configure API Endpoint** (if using remote server):
   - Default: `http://localhost:5000`
   - To change: Edit `%APPDATA%\Salon\config.json` (future feature)
   
2. **Database Setup** (if hosting locally):
   - Install SQL Server Express 2019+
   - Run database migrations (see Backend Setup)
   - Update connection string in API configuration

---

## 🌐 Web Application (Browser)

### Supported Browsers
- **Google Chrome:** Version 90 or later ✅ (Recommended)
- **Microsoft Edge:** Version 90 or later ✅
- **Mozilla Firefox:** Version 88 or later ✅
- **Safari:** Version 14 or later ✅ (macOS/iOS)
- **Opera:** Version 76 or later ✅

### Minimum System Requirements
- **Operating System:** Windows 10+, macOS 10.14+, Linux (Ubuntu 20.04+)
- **Processor:** Any modern CPU (2.0 GHz or higher)
- **RAM:** 2 GB minimum (4 GB recommended)
- **Internet Connection:** Broadband (1 Mbps or higher)
- **Display:** 1024x768 resolution minimum (1920x1080 recommended)

### Browser Requirements
- **JavaScript:** Must be enabled
- **Cookies:** Must be enabled for authentication
- **LocalStorage:** Required for session management
- **TLS/SSL:** HTTPS connection required for production

### Recommended Browser Settings
```
✅ JavaScript: Enabled
✅ Cookies: Enabled
✅ Pop-ups: Allow for this site (for printing invoices)
✅ LocalStorage: Enabled
⚠️ Ad Blockers: May need to whitelist the site
```

### Accessing the Web Application
1. Open your browser
2. Navigate to: `https://your-salon-app-url.com`
3. Login with credentials:
   - **Admin:** admin@salon.com / Admin@123
   - **Staff:** (created by admin)

---

## 💻 Development Environment

### For Developers: Desktop App Development

#### Required Software
1. **Node.js** (v18.0.0 or later)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **Rust** (stable toolchain)
   - Install via: https://rustup.rs/
   - Toolchain: `stable-x86_64-pc-windows-gnu`
   - Verify: `rustc --version` and `cargo --version`

3. **MSYS2** (for MinGW toolchain)
   - Download: https://www.msys2.org/
   - Install location: `C:\msys64`
   - Required packages: `mingw-w64-x86_64-toolchain`

4. **Visual Studio Code** (recommended IDE)
   - Extensions: Rust Analyzer, Tauri, ESLint, Prettier

#### Environment Setup
```powershell
# Set PATH for development
$env:Path = "C:\msys64\mingw64\bin;$env:USERPROFILE\.cargo\bin;$env:Path"

# Install Node dependencies
npm install

# Install Desktop dependencies
cd desktop
npm install
```

#### Build Desktop App
```powershell
cd desktop
$env:Path = "C:\msys64\mingw64\bin;$env:USERPROFILE\.cargo\bin;$env:Path"
npm run build
```

Output: `desktop/src-tauri/target/release/bundle/`

---

### For Developers: Web Frontend Development

#### Required Software
1. **Node.js** (v18.0.0 or later)
2. **npm** or **yarn** package manager
3. **Git** (for version control)
4. **Visual Studio Code** (recommended)
   - Extensions: ESLint, Prettier, Vite, React

#### Environment Setup
```powershell
# Clone repository
git clone https://github.com/your-repo/salon-software.git

# Install dependencies
npm install

# Run development server
npm run dev
```

Access at: `http://localhost:5173`

---

### For Developers: Backend API Development

#### Required Software
1. **.NET SDK 9.0** or later
   - Download: https://dotnet.microsoft.com/download
   - Verify: `dotnet --version`

2. **SQL Server** (Express/Developer/Standard)
   - SQL Server 2019 or later
   - OR SQL Server Express (free)
   - OR Azure SQL Database

3. **SQL Server Management Studio (SSMS)** (optional but recommended)
   - For database management
   - Download: https://aka.ms/ssmsfullsetup

4. **Visual Studio 2022** or **Visual Studio Code**
   - With C# extension for VS Code

#### Environment Setup
```powershell
# Navigate to backend
cd backend/SalonSoftware.API

# Restore dependencies
dotnet restore

# Update database (run migrations)
dotnet ef database update

# Run API
dotnet run
```

Access at: `http://localhost:5000`

---

## 📦 Database Setup

### SQL Server Installation (Local Development)

#### Windows:
1. Download SQL Server 2022 Express (free)
   - URL: https://www.microsoft.com/sql-server/sql-server-downloads
2. Run installer: `SQL2022-SSEI-Expr.exe`
3. Choose "Basic" installation
4. Note the server name: `localhost\SQLEXPRESS`

#### Connection String:
```
Server=localhost\\SQLEXPRESS;Database=SalonDB;Integrated Security=true;TrustServerCertificate=true;
```

### Database Migration
```powershell
cd backend/SalonSoftware.API
dotnet ef database update
```

This creates:
- Users and Roles tables
- Staff, Services, Products tables
- Invoices and Payments tables
- Settings tables

### Seed Data
Default admin account created automatically:
- **Email:** admin@salon.com
- **Password:** Admin@123

---

## 🔐 Security Requirements

### For Production Deployment:

#### Desktop App:
- Windows Defender or antivirus exclusions (if needed)
- Firewall: Allow outbound HTTPS connections
- Certificate: Code signing certificate (optional but recommended)

#### Web App:
- **HTTPS/TLS:** Required (SSL certificate from Let's Encrypt or paid CA)
- **CORS:** Configure allowed origins in backend
- **JWT Secret:** Strong random key (min 256-bit)
- **Database:** Strong password, restricted access
- **API Keys:** Environment variables, not hardcoded

---

## 🆘 Troubleshooting

### Desktop App Issues

#### "Application won't start"
- Install Microsoft Edge WebView2: https://developer.microsoft.com/microsoft-edge/webview2/
- Check Windows Event Viewer for errors

#### "Cannot connect to server"
- Verify backend API is running (`http://localhost:5000`)
- Check firewall settings
- Verify SQL Server is running

### Web App Issues

#### "White screen" or "Page not loading"
- Clear browser cache and cookies
- Check browser console (F12) for errors
- Verify JavaScript is enabled

#### "Login failed"
- Check backend API is accessible
- Verify database connection
- Check credentials

### Backend API Issues

#### "Database connection failed"
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Test with SSMS

#### "Port 5000 already in use"
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill process
Stop-Process -Id <ProcessID> -Force
```

---

## 📞 Support & Resources

### Documentation:
- Main README: `README.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Project Structure: `PROJECT_STRUCTURE.md`

### Common Commands:
```powershell
# Start web development
npm run dev

# Start desktop development
cd desktop
$env:Path = "C:\msys64\mingw64\bin;$env:USERPROFILE\.cargo\bin;$env:Path"
npm run dev:tauri

# Start backend
cd backend/SalonSoftware.API
dotnet run

# Build for production
npm run build                    # Web
cd desktop && npm run build      # Desktop
cd backend/SalonSoftware.API && dotnet publish -c Release  # Backend
```

### Minimum Versions Summary:
| Component | Version |
|-----------|---------|
| Windows | 10 (64-bit) or 11 |
| Node.js | 18.0.0+ |
| .NET SDK | 9.0+ |
| SQL Server | 2019+ |
| Rust | 1.70+ |
| Chrome/Edge | 90+ |

---

## ✅ Quick Start Checklist

### End Users (Desktop):
- [ ] Windows 10/11 64-bit
- [ ] Download installer (MSI or EXE)
- [ ] Run installer
- [ ] Backend API accessible
- [ ] SQL Server available
- [ ] Launch application

### End Users (Web):
- [ ] Modern browser (Chrome/Edge/Firefox)
- [ ] Internet connection
- [ ] Navigate to web app URL
- [ ] Login with credentials

### Developers:
- [ ] Node.js 18+ installed
- [ ] .NET 9.0 SDK installed
- [ ] SQL Server installed
- [ ] Git installed
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `dotnet restore`
- [ ] Update database: `dotnet ef database update`
- [ ] Start backend: `dotnet run`
- [ ] Start frontend: `npm run dev`

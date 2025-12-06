# Salon Software - Cloud Deployment Guide

## ✅ Desktop App (Completed)

**Installers Created:**
- `Salon_1.0.0_x64_en-US.msi` (5.42 MB) - Windows MSI installer
- `Salon_1.0.0_x64-setup.exe` (3.56 MB) - NSIS setup executable

**Location:** `desktop/src-tauri/target/release/bundle/`

**Note:** Desktop app connects to `http://localhost:5000` by default. For production, update API URL in `src/services/api.ts`.

---

## 🌐 Web App Cloud Deployment

### 1. Frontend (React) - Static Hosting

**Build Output:** `dist/` folder (already built)
**Files:** `index.html`, `assets/` folder with CSS and JS

#### Option A: Vercel (Recommended - Free Tier)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set build command: `npm run build`
5. Set output directory: `dist`

#### Option B: Netlify (Free Tier)
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

#### Option C: Azure Static Web Apps
1. Install Azure CLI
2. Create resource: `az staticwebapp create`
3. Deploy from GitHub or local build

**Environment Variables Needed:**
```
VITE_API_URL=https://your-backend-api.com
```

---

### 2. Backend (ASP.NET Core) - API Hosting

**Project:** `backend/SalonSoftware.API/`

#### Option A: Azure App Service (Recommended)
```powershell
# Build for production
cd backend/SalonSoftware.API
dotnet publish -c Release -o ./publish

# Deploy to Azure (requires Azure CLI)
az webapp up --name salon-software-api --resource-group salon-rg --runtime "DOTNETCORE:9.0"
```

**Configuration:**
- Add connection string in Azure portal: Configuration → Connection strings
- Key: `DefaultConnection`
- Value: Your SQL Server connection string

#### Option B: AWS Elastic Beanstalk
1. Install AWS EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create`
4. Deploy: `eb deploy`

#### Option C: Self-Hosted (IIS/Nginx)
```powershell
dotnet publish -c Release -o C:\inetpub\salon-api
```
Configure IIS or Nginx to serve the published files.

**CORS Configuration:**
Update `backend/SalonSoftware.API/Program.cs` to include your frontend URL:
```csharp
policy.WithOrigins(
    "https://your-frontend-url.com",
    "http://localhost:3000",  // For local dev
    "http://localhost:5173",
    "http://localhost:1420"   // For desktop app
)
```

---

### 3. Database - SQL Server

#### Option A: Azure SQL Database (Recommended)
1. Create Azure SQL Database in portal
2. Configure firewall rules to allow Azure services
3. Get connection string from portal
4. Update backend `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Database=SalonDB;User ID=admin;Password=YourPassword;Encrypt=True;"
  }
}
```

#### Option B: AWS RDS SQL Server
1. Create RDS SQL Server instance
2. Configure security groups
3. Get endpoint and update connection string

#### Option C: Self-Hosted SQL Server
- Install SQL Server Express/Standard
- Configure remote access
- Open port 1433 in firewall
- Use public IP in connection string

**Database Migration:**
```powershell
cd backend/SalonSoftware.API
dotnet ef database update
```

---

## 📋 Deployment Checklist

### Frontend:
- [x] Build completed (`dist/` folder created)
- [ ] Update API URL in `src/services/api.ts` to production backend URL
- [ ] Deploy to Vercel/Netlify/Azure
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS

### Backend:
- [ ] Publish to production (`dotnet publish -c Release`)
- [ ] Deploy to Azure/AWS/Self-hosted
- [ ] Update `appsettings.json` with production database connection
- [ ] Configure CORS with frontend URL
- [ ] Enable HTTPS
- [ ] Set JWT secret in environment variables

### Database:
- [ ] Create production SQL Server database
- [ ] Run migrations (`dotnet ef database update`)
- [ ] Seed initial data (Admin user, roles)
- [ ] Configure backups
- [ ] Set up connection string in backend

### Security:
- [ ] Change JWT secret key in `appsettings.json`
- [ ] Use strong database password
- [ ] Enable HTTPS on all endpoints
- [ ] Configure firewall rules
- [ ] Set up API rate limiting (optional)

---

## 🔧 Quick Start Commands

### Build Everything:
```powershell
# Frontend
npm run build

# Desktop
cd desktop
npm run build

# Backend
cd backend/SalonSoftware.API
dotnet publish -c Release
```

### Local Testing:
```powershell
# Backend
cd backend/SalonSoftware.API
dotnet run

# Frontend (web)
npm run dev

# Frontend (desktop)
cd desktop
$env:Path = "C:\msys64\mingw64\bin;$env:USERPROFILE\.cargo\bin;$env:Path"
npm run dev:tauri
```

---

## 📞 Support

For deployment issues:
1. Check logs in Azure Portal / AWS Console
2. Verify connection strings
3. Ensure CORS is configured correctly
4. Check firewall rules for database access

## 🎯 Next Steps

1. Choose hosting providers
2. Create accounts (Azure/AWS/Vercel)
3. Update API URL in frontend
4. Deploy backend first
5. Deploy frontend
6. Test end-to-end functionality

# Salon Software - Automated Setup Script
# Run this script to set up the entire project

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Salon Software - Automated Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Set the base directory
$BaseDir = "c:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software"
Set-Location $BaseDir

Write-Host "📦 Step 1: Installing Frontend Dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Step 2: Restoring Backend NuGet Packages..." -ForegroundColor Yellow
Set-Location "$BaseDir\backend"
dotnet restore
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend packages restored successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to restore backend packages" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🗄️  Step 3: Setting up Database..." -ForegroundColor Yellow
Set-Location "$BaseDir\backend\SalonSoftware.API"

Write-Host "Creating initial migration..." -ForegroundColor Cyan
dotnet ef migrations add InitialCreate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migration may already exist or failed to create" -ForegroundColor Yellow
}

Write-Host "Applying migrations to database..." -ForegroundColor Cyan
dotnet ef database update
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    Write-Host "Please ensure SQL Server is running and connection string is correct" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🧪 Step 4: Running Backend Tests..." -ForegroundColor Yellow
Set-Location "$BaseDir\backend\SalonSoftware.Tests"
dotnet test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All backend tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some backend tests failed, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend API:" -ForegroundColor Cyan
Write-Host "   cd ""$BaseDir\backend\SalonSoftware.API""" -ForegroundColor White
Write-Host "   dotnet run" -ForegroundColor White
Write-Host "   (API will start at https://localhost:7001)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Frontend (in a new terminal):" -ForegroundColor Cyan
Write-Host "   cd ""$BaseDir""" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   (App will open at http://localhost:5173)" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - README.md - Complete documentation" -ForegroundColor White
Write-Host "   - QUICKSTART.md - Quick start guide" -ForegroundColor White
Write-Host "   - PROJECT_STRUCTURE.md - Technical details" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy salon managing!" -ForegroundColor Magenta
Write-Host ""

# Ask if user wants to start the backend now
$StartNow = Read-Host "Would you like to start the backend API now? (y/n)"
if ($StartNow -eq "y" -or $StartNow -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting Backend API..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    Set-Location "$BaseDir\backend\SalonSoftware.API"
    dotnet run
}

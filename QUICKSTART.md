# Quick Start Guide for Salon Software

## 🚀 Fast Setup (5 Minutes)

### Step 1: Setup Backend
```powershell
# Navigate to backend
cd "c:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software\backend\SalonSoftware.API"

# Restore packages
dotnet restore

# Create and update database
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

**Expected Output:** API running at https://localhost:7001

### Step 2: Setup Frontend (In New Terminal)
```powershell
# Navigate to project root
cd "c:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software"

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:** App running at http://localhost:5173

### Step 3: First Login
1. Open browser: http://localhost:5173
2. Click "Sign Up"
3. Enter details:
   - Email: admin@salon.com
   - Password: Admin@123
   - Full Name: Admin User
4. Start using the app!

## 📋 What's Included

### Backend (Complete)
✅ ASP.NET Core 8.0 Web API
✅ Entity Framework Core with MSSQL
✅ JWT Authentication & Authorization
✅ Role-based access (Admin/Staff)
✅ REST API with Swagger documentation
✅ Unit tests with xUnit
✅ Comprehensive business logic layer

### Frontend (Complete)
✅ React 18 with TypeScript
✅ Tailwind CSS for styling
✅ Axios for API integration
✅ React Router for navigation
✅ Protected routes
✅ Jest & React Testing Library tests
✅ Responsive design

### Features Implemented
✅ User Authentication (Login/Register)
✅ Dashboard with statistics
✅ Staff Management (CRUD)
✅ Services Management (CRUD)
✅ Products Management (CRUD)
✅ Billing System with invoice generation
✅ Invoice history and viewing
✅ Multi-payment modes
✅ Role-based access control
✅ Inventory tracking

## 🗄️ Database

The system uses MSSQL with the following tables:
- AspNetUsers, AspNetRoles (Identity)
- Staff, Services, Products
- Invoices, InvoiceServices, InvoiceProducts
- Payments, SalonSettings

Database name: **SalonSoftwareDB**

## 🔒 API Endpoints Summary

### Authentication (No Auth Required)
- POST /api/Auth/login
- POST /api/Auth/register

### All Other Endpoints (Auth Required)
- /api/Staff - Staff management
- /api/Services - Services management
- /api/Products - Products management
- /api/Invoices - Invoice operations
- /api/Dashboard/stats - Dashboard statistics

**Admin-Only Operations:**
- Create/Update/Delete Staff
- Create/Update/Delete Services
- Create/Update/Delete Products

## 🧪 Testing

### Run Backend Tests
```powershell
cd backend/SalonSoftware.Tests
dotnet test
```

### Run Frontend Tests
```powershell
npm test
```

## 📱 User Roles

### Admin
- Full access to all features
- Can manage staff, services, products
- Can create invoices
- Can view dashboard

### Staff
- Can create invoices
- Can view dashboard
- Cannot manage master data

## 🎨 UI Highlights

- Modern, clean design
- Purple accent color scheme
- Responsive layout
- Toast notifications
- Loading states
- Form validation
- Modal dialogs
- Tables with actions

## 🔧 Configuration

### Backend (appsettings.json)
- Database connection string
- JWT secret key
- CORS origins

### Frontend (src/services/api.ts)
- API base URL (currently: https://localhost:7001/api)

## 📊 Invoice Flow

1. Select client details
2. Add services (with staff assignment and discounts)
3. Add products (with quantity)
4. Add payments (multiple modes supported)
5. Generate invoice
6. View/Print invoice

## 💡 Best Practices Implemented

- **Security**: JWT tokens, role-based auth, password hashing
- **Architecture**: Separation of concerns, service layer pattern
- **Testing**: Unit tests for critical functionality
- **Code Quality**: TypeScript, C# strict mode
- **UI/UX**: Consistent design, loading states, error handling
- **Database**: Proper relationships, constraints, indexes
- **API**: RESTful design, proper HTTP status codes

## 🚨 Common Issues & Solutions

### Issue: Database connection failed
**Solution:** Verify SQL Server is running and update connection string in appsettings.json

### Issue: CORS error in browser
**Solution:** Check frontend URL is in CORS policy in Program.cs (currently allows localhost:3000, 5173, 5174)

### Issue: npm install errors
**Solution:** Delete node_modules and package-lock.json, then run npm install again

### Issue: Migration errors
**Solution:** Delete Migrations folder, drop database, create new migration

## 📞 Next Steps

1. Customize salon settings (name, address, etc.)
2. Add your staff members
3. Define your services with prices
4. Add products to inventory
5. Start creating invoices!

## 🎯 Production Deployment Checklist

- [ ] Update JWT secret key
- [ ] Configure production database
- [ ] Set up HTTPS
- [ ] Configure CORS for production domain
- [ ] Build and test production builds
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

---

**You're all set! Happy salon management! 💇‍♀️✨**

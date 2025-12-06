# Salon Software - Complete Management System

A comprehensive salon management system built with **React.js** (Frontend), **ASP.NET Core** (Backend), and **MSSQL** (Database).

## 🌟 Features

### Core Functionality
- **Authentication & Authorization** - JWT-based auth with Admin/Staff roles
- **Dashboard** - Real-time statistics and overview
- **Billing System** - Complete invoice generation with services and products
- **Staff Management** - Manage salon staff members
- **Services Management** - Define and manage salon services
- **Products Management** - Track inventory and product sales
- **Invoice History** - View and search past invoices
- **Multi-payment Support** - Cash, card, UPI, etc.

### Technical Highlights
- ✅ Role-based access control (Admin/Staff)
- ✅ RESTful API architecture
- ✅ Entity Framework Core with Code-First migrations
- ✅ Responsive UI with Tailwind CSS
- ✅ Comprehensive unit testing (Frontend & Backend)
- ✅ JWT authentication
- ✅ CORS-enabled API
- ✅ TypeScript for type safety

## 🏗️ Architecture

```
salon-software/
├── backend/                      # .NET Core API
│   ├── SalonSoftware.API/
│   │   ├── Controllers/          # API Controllers
│   │   ├── Services/             # Business Logic
│   │   ├── Models/               # Entity Models
│   │   ├── DTOs/                 # Data Transfer Objects
│   │   ├── Data/                 # DbContext
│   │   └── Program.cs            # App Entry Point
│   ├── SalonSoftware.Tests/      # Unit Tests (xUnit)
│   └── DatabaseSchema.sql        # SQL Schema Reference
├── src/                          # React Frontend
│   ├── components/               # React Components
│   ├── pages/                    # Page Components
│   ├── contexts/                 # React Contexts
│   └── services/                 # API Integration
└── __tests__/                    # Frontend Tests (Jest)
```

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm/yarn
- SQL Server (LocalDB, Express, or Full)
- VS Code or Visual Studio 2022

### Backend Setup

#### 1. Navigate to Backend Directory
```powershell
cd "c:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software\backend"
```

#### 2. Restore NuGet Packages
```powershell
dotnet restore
```

#### 3. Update Database Connection String
Edit `SalonSoftware.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SalonSoftwareDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Server Authentication:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SalonSoftwareDB;User Id=your_user;Password=your_password;TrustServerCertificate=True;"
  }
}
```

#### 4. Create Database with Migrations
```powershell
cd SalonSoftware.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### 5. Run the Backend API
```powershell
dotnet run
```

The API will start at `https://localhost:7001` and `http://localhost:5001`

#### 6. Test the Backend
```powershell
cd ../SalonSoftware.Tests
dotnet test
```

### Frontend Setup

#### 1. Navigate to Project Root
```powershell
cd "c:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software"
```

#### 2. Install Dependencies
```powershell
npm install
```

#### 3. Update API URL
Edit `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://localhost:7001/api'; // Update port if different
```

#### 4. Run Development Server
```powershell
npm run dev
```

The app will open at `http://localhost:5173`

#### 5. Run Frontend Tests
```powershell
npm test
```

#### 6. Build for Production
```powershell
npm run build
```

## 📝 Default Credentials

Create your first admin account:

1. Start the backend API
2. Open the frontend
3. Go to `/auth` and register with:
   - Email: `admin@salon.com`
   - Password: `Admin@123`
   - Full Name: `Admin User`
   - Role: Admin (default is Staff)

## 🗄️ Database Schema

### Tables
- **AspNetUsers** - User authentication
- **AspNetRoles** - User roles (Admin/Staff)
- **Staff** - Salon staff members
- **Services** - Available services
- **Products** - Products/inventory
- **Invoices** - Customer invoices
- **InvoiceServices** - Services in invoices
- **InvoiceProducts** - Products in invoices
- **Payments** - Payment records
- **SalonSettings** - Salon configuration

## 🔒 API Endpoints

### Authentication
- `POST /api/Auth/login` - User login
- `POST /api/Auth/register` - User registration

### Staff (Authenticated)
- `GET /api/Staff` - Get all staff
- `GET /api/Staff/{id}` - Get staff by ID
- `POST /api/Staff` - Create staff (Admin only)
- `PUT /api/Staff/{id}` - Update staff (Admin only)
- `DELETE /api/Staff/{id}` - Delete staff (Admin only)

### Services (Authenticated)
- `GET /api/Services` - Get all services
- `GET /api/Services/{id}` - Get service by ID
- `POST /api/Services` - Create service (Admin only)
- `PUT /api/Services/{id}` - Update service (Admin only)
- `DELETE /api/Services/{id}` - Delete service (Admin only)

### Products (Authenticated)
- `GET /api/Products` - Get all products
- `GET /api/Products/{id}` - Get product by ID
- `POST /api/Products` - Create product (Admin only)
- `PUT /api/Products/{id}` - Update product (Admin only)
- `DELETE /api/Products/{id}` - Delete product (Admin only)

### Invoices (Authenticated)
- `GET /api/Invoices` - Get all invoices (with date filters)
- `GET /api/Invoices/{id}` - Get invoice by ID
- `POST /api/Invoices` - Create invoice

### Dashboard (Authenticated)
- `GET /api/Dashboard/stats` - Get dashboard statistics

## 🧪 Testing

### Backend Tests
```powershell
cd backend/SalonSoftware.Tests
dotnet test --logger "console;verbosity=detailed"
dotnet test /p:CollectCoverage=true
```

### Frontend Tests
```powershell
npm test
npm run test:coverage
```

## 🎨 UI Components

The frontend uses:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching

## 📦 Deployment

### Backend Deployment
1. Build the project:
   ```powershell
   dotnet publish -c Release -o ./publish
   ```

2. Deploy to:
   - Azure App Service
   - IIS
   - Docker container
   - Linux server with Nginx

3. Update `appsettings.Production.json` with production database connection

### Frontend Deployment
1. Build the production bundle:
   ```powershell
   npm run build
   ```

2. Deploy `dist` folder to:
   - Vercel
   - Netlify
   - Azure Static Web Apps
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update API_BASE_URL to production API endpoint

## 🔧 Configuration

### Backend Configuration (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your connection string"
  },
  "Jwt": {
    "Key": "Your-Secret-Key-Min-32-Characters",
    "Issuer": "SalonSoftwareAPI",
    "Audience": "SalonSoftwareClient"
  }
}
```

### Environment Variables
- `ASPNETCORE_ENVIRONMENT` - Development/Production
- `ASPNETCORE_URLS` - API binding URLs

## 📚 API Documentation

Once the backend is running, access Swagger documentation at:
- `https://localhost:7001/swagger`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💡 Tips

- Use Chrome/Edge DevTools for debugging frontend
- Check browser console for API errors
- Review API logs in backend console
- Use Swagger UI for API testing
- Enable SQL logging in Development for debugging

## 🐛 Troubleshooting

### Backend Issues
- **Database connection failed**: Verify SQL Server is running and connection string is correct
- **Migrations failed**: Delete existing database and run migrations again
- **401 Unauthorized**: Check if JWT token is valid and not expired

### Frontend Issues
- **API calls failing**: Verify backend is running and CORS is configured
- **Build errors**: Clear node_modules and reinstall: `rm -r node_modules; npm install`
- **Port conflicts**: Change port in `vite.config.ts`

## 📞 Support

For issues and questions:
- Check existing documentation
- Review error logs
- Test API endpoints with Swagger
- Verify database connections

## ✨ Future Enhancements

- [ ] Appointment scheduling
- [ ] SMS/Email notifications
- [ ] Reports and analytics
- [ ] Customer loyalty program
- [ ] Online booking portal
- [ ] Mobile app (React Native)
- [ ] Multi-branch support
- [ ] Advanced reporting and charts

---

**Built with ❤️ for salon management excellence**

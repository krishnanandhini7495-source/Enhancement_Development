# Salon Software - Project Structure

## Overview
This document provides a complete overview of the salon software implementation.

## Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core 8.0
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer Tokens
- **API Documentation**: Swagger/OpenAPI
- **Testing**: xUnit, Moq, FluentAssertions

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Testing**: Jest, React Testing Library

## Project Structure

```
salon-software/
│
├── backend/                              # Backend API
│   ├── SalonSoftware.API/               # Main API Project
│   │   ├── Controllers/                 # API Controllers
│   │   │   ├── AuthController.cs        # Authentication
│   │   │   ├── StaffController.cs       # Staff management
│   │   │   ├── ServicesController.cs    # Services management
│   │   │   ├── ProductsController.cs    # Products management
│   │   │   ├── InvoicesController.cs    # Invoice operations
│   │   │   └── DashboardController.cs   # Dashboard stats
│   │   │
│   │   ├── Services/                    # Business Logic Layer
│   │   │   ├── AuthService.cs           # Auth logic
│   │   │   ├── StaffService.cs          # Staff operations
│   │   │   ├── ServiceService.cs        # Service operations
│   │   │   ├── ProductService.cs        # Product operations
│   │   │   └── InvoiceService.cs        # Invoice operations
│   │   │
│   │   ├── Models/                      # Entity Models
│   │   │   ├── ApplicationUser.cs       # User entity
│   │   │   ├── Staff.cs                 # Staff entity
│   │   │   ├── Service.cs               # Service entity
│   │   │   ├── Product.cs               # Product entity
│   │   │   ├── Invoice.cs               # Invoice entity
│   │   │   ├── InvoiceService.cs        # Invoice-Service relation
│   │   │   ├── InvoiceProduct.cs        # Invoice-Product relation
│   │   │   ├── Payment.cs               # Payment entity
│   │   │   └── SalonSettings.cs         # Settings entity
│   │   │
│   │   ├── DTOs/                        # Data Transfer Objects
│   │   │   └── DTOs.cs                  # All DTOs
│   │   │
│   │   ├── Data/                        # Database Context
│   │   │   └── ApplicationDbContext.cs  # EF Core DbContext
│   │   │
│   │   ├── Program.cs                   # Application entry point
│   │   ├── appsettings.json            # Configuration
│   │   └── SalonSoftware.API.csproj    # Project file
│   │
│   ├── SalonSoftware.Tests/            # Unit Tests
│   │   ├── Services/                    # Service tests
│   │   │   ├── StaffServiceTests.cs
│   │   │   ├── ServiceServiceTests.cs
│   │   │   └── ProductServiceTests.cs
│   │   └── SalonSoftware.Tests.csproj
│   │
│   ├── DatabaseSchema.sql              # SQL schema reference
│   └── SalonSoftware.sln               # Solution file
│
├── src/                                # Frontend Source
│   ├── components/                     # React Components
│   │   ├── Layout.tsx                  # Main layout
│   │   └── ProtectedRoute.tsx          # Auth guard
│   │
│   ├── pages/                          # Page Components
│   │   ├── Auth.tsx                    # Login/Register
│   │   ├── Dashboard.tsx               # Dashboard
│   │   ├── Billing.tsx                 # Billing/Invoicing
│   │   ├── Services.tsx                # Services management
│   │   ├── Products.tsx                # Products management
│   │   └── Staff.tsx                   # Staff management
│   │
│   ├── contexts/                       # React Contexts
│   │   └── AuthContext.tsx             # Authentication context
│   │
│   ├── services/                       # API Integration
│   │   └── api.ts                      # API client & methods
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles
│
├── __tests__/                          # Frontend Tests
│   ├── setup.ts                        # Test setup
│   ├── AuthContext.test.tsx            # Auth tests
│   └── api.test.ts                     # API tests
│
├── package.json                        # Node dependencies
├── tsconfig.json                       # TypeScript config
├── vite.config.ts                      # Vite configuration
├── tailwind.config.js                  # Tailwind config
├── postcss.config.js                   # PostCSS config
├── jest.config.js                      # Jest configuration
├── README.md                           # Main documentation
├── QUICKSTART.md                       # Quick start guide
└── index.html                          # HTML template
```

## Database Schema

### Core Tables

1. **AspNetUsers** (Identity Framework)
   - User authentication and profile data

2. **AspNetRoles** (Identity Framework)
   - Roles: Admin, Staff

3. **Staff**
   - Salon staff members
   - Fields: Id, Name, Phone, Active, CreatedAt

4. **Services**
   - Salon services offered
   - Fields: Id, Name, BasePrice, Active, CreatedAt

5. **Products**
   - Products/inventory
   - Fields: Id, Name, Price, StockQuantity, Active, CreatedAt

6. **Invoices**
   - Customer invoices
   - Fields: Id, InvoiceNumber, ClientName, ClientPhone, InvoiceDate, Subtotal, TotalAmount, CreatedBy, CreatedAt

7. **InvoiceServices**
   - Services in invoices
   - Fields: Id, InvoiceId, ServiceId, StaffId, BasePrice, DiscountPercent, FinalPrice, CreatedAt

8. **InvoiceProducts**
   - Products in invoices
   - Fields: Id, InvoiceId, ProductId, Quantity, UnitPrice, TotalPrice, CreatedAt

9. **Payments**
   - Payment records
   - Fields: Id, InvoiceId, PaymentMode, Amount, CreatedAt

10. **SalonSettings**
    - Salon configuration
    - Fields: Id, SalonName, BranchAddress, Phone, Email, CreatedAt, UpdatedAt

## API Architecture

### Layers
1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic
3. **Data** - Database access (EF Core)
4. **Models** - Domain entities
5. **DTOs** - Data transfer objects

### Authentication Flow
1. User sends credentials to /api/Auth/login
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in Authorization header for subsequent requests
6. Backend validates token for protected endpoints

### Authorization
- **Admin Role**: Full access to all operations
- **Staff Role**: Limited to viewing and creating invoices

## Frontend Architecture

### Component Hierarchy
```
App
├── BrowserRouter
│   └── AuthProvider
│       ├── Auth Page (Public)
│       └── ProtectedRoute
│           └── Layout
│               ├── Dashboard
│               ├── Billing
│               ├── Services (Admin only)
│               ├── Products (Admin only)
│               └── Staff (Admin only)
```

### State Management
- **Local State**: useState for component state
- **Context API**: Authentication state
- **TanStack Query**: Server state caching

### Routing
- `/auth` - Login/Register (public)
- `/` - Dashboard (protected)
- `/billing` - Billing (protected)
- `/services` - Services management (admin only)
- `/products` - Products management (admin only)
- `/staff` - Staff management (admin only)

## Key Features Implemented

### Authentication & Authorization
✅ JWT-based authentication
✅ Role-based authorization (Admin/Staff)
✅ Protected routes
✅ Token refresh handling
✅ Logout functionality

### Dashboard
✅ Today's sales total
✅ Today's invoice count
✅ Total services count
✅ Total products count
✅ Total staff count

### Staff Management
✅ List all staff
✅ Add new staff
✅ Edit staff details
✅ Toggle active status
✅ Delete staff

### Services Management
✅ List all services
✅ Add new service
✅ Edit service details
✅ Set base price
✅ Toggle active status
✅ Delete service

### Products Management
✅ List all products
✅ Add new product
✅ Edit product details
✅ Track stock quantity
✅ Toggle active status
✅ Delete product

### Billing System
✅ Select client details
✅ Add multiple services
✅ Assign staff to services
✅ Apply discounts
✅ Add multiple products
✅ Automatic stock reduction
✅ Multiple payment modes
✅ Auto-generate invoice number
✅ Calculate totals
✅ View invoice history
✅ Search invoices by date

## Testing Strategy

### Backend Tests (xUnit)
- **Unit Tests**: Service layer logic
- **Integration Tests**: Controller endpoints
- **Mock Data**: In-memory database for tests
- **Coverage**: 70%+ target

### Frontend Tests (Jest)
- **Unit Tests**: Utility functions
- **Component Tests**: React components
- **Integration Tests**: User workflows
- **Coverage**: 70%+ target

## Security Features

✅ Password hashing (ASP.NET Identity)
✅ JWT token authentication
✅ Role-based authorization
✅ CORS policy
✅ HTTPS enforced
✅ SQL injection prevention (EF Core)
✅ XSS protection (React)
✅ CSRF protection

## Performance Optimizations

✅ Database indexing
✅ Lazy loading
✅ React Query caching
✅ Code splitting (Vite)
✅ Production builds optimized
✅ Image optimization
✅ Gzip compression

## Deployment Architecture

### Backend
- IIS / Azure App Service / Linux + Nginx
- MSSQL Server database
- HTTPS/SSL certificate
- Environment-based configuration

### Frontend
- Static hosting (Vercel/Netlify/Azure Static Web Apps)
- CDN for assets
- Environment variables for API URL

## Environment Configuration

### Development
- Backend: https://localhost:7001
- Frontend: http://localhost:5173
- Database: Local SQL Server

### Production
- Backend: Your production API domain
- Frontend: Your production web domain
- Database: Production SQL Server

## Maintenance & Monitoring

### Logging
- Backend: ASP.NET Core logging
- Frontend: Console logging in development

### Monitoring
- API response times
- Database performance
- Error tracking
- User activity logs

## Future Enhancements

Potential features for v2.0:
- Appointment scheduling
- Customer database
- SMS/Email notifications
- Advanced reporting
- Multi-branch support
- Mobile app
- Online booking portal
- Loyalty program
- Inventory alerts
- Staff commission tracking

---

**This is a production-ready salon management system with enterprise-grade architecture and best practices!**

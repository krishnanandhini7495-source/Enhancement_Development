# Simple script to seed salon database
$baseUrl = "http://localhost:5000/api"

# Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/Auth/login" -Method Post -Body '{"email":"admin@salon.com","password":"Admin@123"}' -ContentType "application/json"
$token = $loginResponse.token
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "Adding Products..." -ForegroundColor Cyan

# Products
@'
[
  {"name":"Hair Shampoo (300ml)","price":450,"stockQuantity":50},
  {"name":"Hair Conditioner (300ml)","price":500,"stockQuantity":40},
  {"name":"Hair Serum","price":650,"stockQuantity":30},
  {"name":"Hair Oil (200ml)","price":350,"stockQuantity":45},
  {"name":"Hair Gel (150ml)","price":250,"stockQuantity":35},
  {"name":"Hair Wax","price":300,"stockQuantity":40},
  {"name":"Hair Color (Premium)","price":850,"stockQuantity":25},
  {"name":"Hair Color (Regular)","price":550,"stockQuantity":35},
  {"name":"Hair Spray","price":400,"stockQuantity":30},
  {"name":"Face Cream","price":600,"stockQuantity":25},
  {"name":"Face Wash","price":350,"stockQuantity":40},
  {"name":"Face Mask","price":450,"stockQuantity":30},
  {"name":"Facial Kit","price":1200,"stockQuantity":15},
  {"name":"Nail Polish","price":150,"stockQuantity":60},
  {"name":"Nail Polish Remover","price":100,"stockQuantity":50},
  {"name":"Hand Cream","price":300,"stockQuantity":35},
  {"name":"Body Lotion (200ml)","price":450,"stockQuantity":30},
  {"name":"Beard Oil","price":400,"stockQuantity":25},
  {"name":"Aftershave Lotion","price":350,"stockQuantity":30},
  {"name":"Hair Straightening Cream","price":750,"stockQuantity":20}
]
'@ | ConvertFrom-Json | ForEach-Object {
    try {
        $body = $_ | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/Products" -Method Post -Body $body -Headers $headers | Out-Null
        Write-Host "  ✓ $($_.name)" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($_.name)" -ForegroundColor Yellow
    }
}

Write-Host "" -ForegroundColor Cyan
Write-Host "Adding Services..." -ForegroundColor Cyan

# Services
@'
[
  {"name":"Haircut (Men)","basePrice":300},
  {"name":"Haircut (Women)","basePrice":500},
  {"name":"Hair Coloring","basePrice":1500},
  {"name":"Hair Spa","basePrice":1200},
  {"name":"Hair Straightening","basePrice":2500},
  {"name":"Beard Trim","basePrice":150},
  {"name":"Shave","basePrice":200},
  {"name":"Facial (Basic)","basePrice":800},
  {"name":"Facial (Premium)","basePrice":1500},
  {"name":"Manicure","basePrice":400},
  {"name":"Pedicure","basePrice":500},
  {"name":"Waxing (Full Body)","basePrice":1200},
  {"name":"Waxing (Half Arms)","basePrice":250},
  {"name":"Waxing (Half Legs)","basePrice":300},
  {"name":"Threading (Eyebrows)","basePrice":50},
  {"name":"Threading (Upper Lip)","basePrice":30},
  {"name":"Makeup (Bridal)","basePrice":8000},
  {"name":"Makeup (Party)","basePrice":3000},
  {"name":"Hair Wash and Blow Dry","basePrice":400},
  {"name":"Keratin Treatment","basePrice":3500}
]
'@ | ConvertFrom-Json | ForEach-Object {
    try {
        $body = $_ | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/Services" -Method Post -Body $body -Headers $headers | Out-Null
        Write-Host "  ✓ $($_.name)" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($_.name)" -ForegroundColor Yellow
    }
}

Write-Host "" -ForegroundColor Cyan
Write-Host "Adding Staff..." -ForegroundColor Cyan

# Staff
@'
[
  {"name":"Rajesh Kumar","phone":"9876543210"},
  {"name":"Priya Sharma","phone":"9876543211"},
  {"name":"Amit Patel","phone":"9876543212"},
  {"name":"Sneha Reddy","phone":"9876543213"},
  {"name":"Rahul Singh","phone":"9876543214"}
]
'@ | ConvertFrom-Json | ForEach-Object {
    try {
        $body = $_ | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/Staff" -Method Post -Body $body -Headers $headers | Out-Null
        Write-Host "  ✓ $($_.name)" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ $($_.name)" -ForegroundColor Yellow
    }
}

Write-Host "" -ForegroundColor Green
Write-Host "Database seeded successfully!" -ForegroundColor Green

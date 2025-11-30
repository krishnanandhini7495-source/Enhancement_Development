# Seed default salon products
$baseUrl = "http://localhost:5000/api"

# Login to get token
Write-Host "Logging in..." -ForegroundColor Cyan
$loginBody = @{
    email = "admin@salon.com"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/Auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Set headers with token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Default salon products with INR prices
$products = @(
    '{"name":"Hair Shampoo (300ml)","price":450,"stockQuantity":50}',
    '{"name":"Hair Conditioner (300ml)","price":500,"stockQuantity":40}',
    '{"name":"Hair Serum","price":650,"stockQuantity":30}',
    '{"name":"Hair Oil (200ml)","price":350,"stockQuantity":45}',
    '{"name":"Hair Gel (150ml)","price":250,"stockQuantity":35}',
    '{"name":"Hair Wax","price":300,"stockQuantity":40}',
    '{"name":"Hair Color (Premium)","price":850,"stockQuantity":25}',
    '{"name":"Hair Color (Regular)","price":550,"stockQuantity":35}',
    '{"name":"Hair Spray","price":400,"stockQuantity":30}',
    '{"name":"Face Cream","price":600,"stockQuantity":25}',
    '{"name":"Face Wash","price":350,"stockQuantity":40}',
    '{"name":"Face Mask","price":450,"stockQuantity":30}',
    '{"name":"Facial Kit","price":1200,"stockQuantity":15}',
    '{"name":"Nail Polish","price":150,"stockQuantity":60}',
    '{"name":"Nail Polish Remover","price":100,"stockQuantity":50}',
    '{"name":"Hand Cream","price":300,"stockQuantity":35}',
    '{"name":"Body Lotion (200ml)","price":450,"stockQuantity":30}',
    '{"name":"Beard Oil","price":400,"stockQuantity":25}',
    '{"name":"Aftershave Lotion","price":350,"stockQuantity":30}',
    '{"name":"Hair Straightening Cream","price":750,"stockQuantity":20}'
)

# Add default services as well
$services = @(
    '{"name":"Haircut (Men)","basePrice":300}',
    '{"name":"Haircut (Women)","basePrice":500}',
    '{"name":"Hair Coloring","basePrice":1500}',
    '{"name":"Hair Spa","basePrice":1200}',
    '{"name":"Hair Straightening","basePrice":2500}',
    '{"name":"Beard Trim","basePrice":150}',
    '{"name":"Shave","basePrice":200}',
    '{"name":"Facial (Basic)","basePrice":800}',
    '{"name":"Facial (Premium)","basePrice":1500}',
    '{"name":"Manicure","basePrice":400}',
    '{"name":"Pedicure","basePrice":500}',
    '{"name":"Waxing (Full Body)","basePrice":1200}',
    '{"name":"Waxing (Half Arms)","basePrice":250}',
    '{"name":"Waxing (Half Legs)","basePrice":300}',
    '{"name":"Threading (Eyebrows)","basePrice":50}',
    '{"name":"Threading (Upper Lip)","basePrice":30}',
    '{"name":"Makeup (Bridal)","basePrice":8000}',
    '{"name":"Makeup (Party)","basePrice":3000}',
    '{"name":"Hair Wash & Blow Dry","basePrice":400}',
    '{"name":"Keratin Treatment","basePrice":3500}'
)

# Add staff members
$staffMembers = @(
    '{"name":"Rajesh Kumar","phone":"9876543210"}',
    '{"name":"Priya Sharma","phone":"9876543211"}',
    '{"name":"Amit Patel","phone":"9876543212"}',
    '{"name":"Sneha Reddy","phone":"9876543213"}',
    '{"name":"Rahul Singh","phone":"9876543214"}'
)

Write-Host "`nAdding Products..." -ForegroundColor Cyan
$productCount = 0
foreach ($productJson in $products) {
    try {
        $productData = $productJson | ConvertFrom-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/Products" -Method Post -Body $productJson -Headers $headers
        $productCount++
        Write-Host "  ✓ Added: $($productData.name) - ₹$($productData.price)" -ForegroundColor Green
    } catch {
        $productData = $productJson | ConvertFrom-Json
        Write-Host "  ✗ Failed to add $($productData.name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nAdding Services..." -ForegroundColor Cyan
$serviceCount = 0
foreach ($serviceJson in $services) {
    try {
        $serviceData = $serviceJson | ConvertFrom-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/Services" -Method Post -Body $serviceJson -Headers $headers
        $serviceCount++
        Write-Host "  ✓ Added: $($serviceData.name) - ₹$($serviceData.basePrice)" -ForegroundColor Green
    } catch {
        $serviceData = $serviceJson | ConvertFrom-Json
        Write-Host "  ✗ Failed to add $($serviceData.name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nAdding Staff Members..." -ForegroundColor Cyan
$staffCount = 0
foreach ($staffJson in $staffMembers) {
    try {
        $staffData = $staffJson | ConvertFrom-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/Staff" -Method Post -Body $staffJson -Headers $headers
        $staffCount++
        Write-Host "  ✓ Added: $($staffData.name) - $($staffData.phone)" -ForegroundColor Green
    } catch {
        $staffData = $staffJson | ConvertFrom-Json
        Write-Host "  ✗ Failed to add $($staffData.name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "Database seeding completed!" -ForegroundColor Green
Write-Host "  Products added: $productCount / $($products.Count)" -ForegroundColor White
Write-Host "  Services added: $serviceCount / $($services.Count)" -ForegroundColor White
Write-Host "  Staff added: $staffCount / $($staffMembers.Count)" -ForegroundColor White
Write-Host "===========================================" -ForegroundColor Cyan

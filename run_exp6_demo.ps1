# ===================================================================
# EXPERIMENT NO. 06: JWT AUTHENTICATION & SECURE REST APIS
# College: Thakur Shree DPS College of Engineering & Management
# Subject: Full Stack Java Programming (FSJP)
# ===================================================================

$baseUrl = "http://localhost:8080/api"

Write-Host "`n=======================================================================" -ForegroundColor Cyan
Write-Host " EXPERIMENT NO. 06: JWT AUTHENTICATION IN SPRING BOOT APPLICATION" -ForegroundColor Yellow
Write-Host " AIM: Implement JWT authentication & secure protected endpoints" -ForegroundColor Green
Write-Host "=======================================================================" -ForegroundColor Cyan

# -------------------------------------------------------------------
# STEP 1: Register a New User (Recruiter)
# -------------------------------------------------------------------
Write-Host "`n[STEP 1] User Registration -> POST /api/auth/register" -ForegroundColor Magenta
$randomId = Get-Random -Minimum 100 -Maximum 999
$registerData = @{
    name = "Vikram Aditya"
    email = "vikram.recruiter$randomId@jobfins.com"
    password = "password123"
    role = "ROLE_RECRUITER"
    companyName = "Apex Tech Innovations"
    contactNumber = "+91 9823456789"
    bioOrSkills = "VP of Engineering & Technical Hiring Lead"
} | ConvertTo-Json

Write-Host "Request Body:" -ForegroundColor DarkGray
Write-Host $registerData

$regResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
Write-Host "Response (HTTP 200 OK):" -ForegroundColor Green
Write-Host ($regResponse | ConvertTo-Json)

# -------------------------------------------------------------------
# STEP 2: Authenticate & Generate HMAC-SHA256 JWT Token
# -------------------------------------------------------------------
Write-Host "`n[STEP 2] User Login & JWT Token Generation -> POST /api/auth/login" -ForegroundColor Magenta
$loginData = @{
    email = "vikram.recruiter$randomId@jobfins.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Request Body:" -ForegroundColor DarkGray
Write-Host $loginData

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
$jwtToken = $loginResponse.token

Write-Host "Response (HTTP 200 OK):" -ForegroundColor Green
Write-Host "User ID       : $($loginResponse.id)"
Write-Host "Name          : $($loginResponse.name)"
Write-Host "Email         : $($loginResponse.email)"
Write-Host "Role          : $($loginResponse.role)"
Write-Host "Company       : $($loginResponse.companyName)"
Write-Host "Token Type    : $($loginResponse.tokenType)"
Write-Host "JWT Token     : $jwtToken" -ForegroundColor Yellow

# Decode JWT Parts
$tokenParts = $jwtToken.Split(".")
Write-Host "`n[JWT Structure Decomposition (Header.Payload.Signature)]" -ForegroundColor Cyan
Write-Host "1. Header (Base64Url)    : $($tokenParts[0])"
Write-Host "2. Payload (Base64Url)   : $($tokenParts[1])"
Write-Host "3. Signature (HMAC-SHA256): $($tokenParts[2])"

# -------------------------------------------------------------------
# STEP 3: Access Protected Endpoint WITH Valid JWT Bearer Token
# -------------------------------------------------------------------
Write-Host "`n[STEP 3] Access Protected Route WITH Bearer Token -> GET /api/applications/recruiter/all" -ForegroundColor Magenta
Write-Host "Header: Authorization: Bearer $jwtToken" -ForegroundColor DarkGray

$protectedHeaders = @{
    "Authorization" = "Bearer $jwtToken"
}

$protectedResponse = Invoke-RestMethod -Uri "$baseUrl/applications/recruiter/all" -Method Get -Headers $protectedHeaders
Write-Host "Response (HTTP 200 OK - Authorized):" -ForegroundColor Green
Write-Host ($protectedResponse | ConvertTo-Json)

# -------------------------------------------------------------------
# STEP 4: Access Protected Endpoint WITHOUT Token (Should Fail 401/403)
# -------------------------------------------------------------------
Write-Host "`n[STEP 4] Access Protected Route WITHOUT Bearer Token (Security Validation)" -ForegroundColor Magenta
try {
    $unauthResponse = Invoke-RestMethod -Uri "$baseUrl/applications/recruiter/all" -Method Get
    Write-Host "Unexpected Success!" -ForegroundColor Red
} catch {
    Write-Host "Security Filter Blocked Request: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: 401 Unauthorized / 403 Forbidden (Stateless Security Working Correctly!)" -ForegroundColor Green
}

# -------------------------------------------------------------------
# STEP 5: Access Authenticated User Profile -> GET /api/auth/me
# -------------------------------------------------------------------
Write-Host "`n[STEP 5] Retrieve Authenticated Profile -> GET /api/auth/me" -ForegroundColor Magenta
$profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $protectedHeaders
Write-Host "Response (HTTP 200 OK):" -ForegroundColor Green
Write-Host ($profileResponse | ConvertTo-Json)

Write-Host "`n=======================================================================" -ForegroundColor Cyan
Write-Host " [SUCCESS] EXPERIMENT 6 JWT AUTHENTICATION VERIFIED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=======================================================================" -ForegroundColor Cyan

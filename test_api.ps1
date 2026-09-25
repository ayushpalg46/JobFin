Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  JOBFINS REST API TEST SUITE " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

$stats = Invoke-RestMethod -Uri 'http://localhost:8080/api/dashboard/stats' -Method GET
Write-Host "`n>>> 1. /api/dashboard/stats Output:" -ForegroundColor Green
Write-Host ($stats | ConvertTo-Json)

$jobs = Invoke-RestMethod -Uri 'http://localhost:8080/api/jobs' -Method GET
Write-Host "`n>>> 2. /api/jobs Output (Total Listings: $($jobs.Count)):" -ForegroundColor Green
foreach ($job in $jobs) {
    Write-Host "  - [$($job.id)] $($job.title) | $($job.company) | $($job.location) | $($job.salary)"
}

$salaries = Invoke-RestMethod -Uri 'http://localhost:8080/api/salary-guide' -Method GET
Write-Host "`n>>> 3. /api/salary-guide Output (Total Roles: $($salaries.Count)):" -ForegroundColor Green
foreach ($s in $salaries) {
    Write-Host "  - $($s.role) ($($s.domain)): $($s.entryLevel) -> $($s.seniorLevel) [Demand: $($s.marketDemand)]"
}

$companies = Invoke-RestMethod -Uri 'http://localhost:8080/api/companies' -Method GET
Write-Host "`n>>> 4. /api/companies Output (Total Companies: $($companies.Count)):" -ForegroundColor Green
foreach ($c in $companies) {
    Write-Host "  - $($c.name) | $($c.industry) | $($c.location) | $($c.openRoles) Open Roles | Rating: $($c.rating)"
}


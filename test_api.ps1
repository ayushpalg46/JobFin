$stats = Invoke-RestMethod -Uri 'http://localhost:8080/api/dashboard/stats' -Method GET
Write-Host ">>> 1. /api/dashboard/stats Output:"
Write-Host ($stats | ConvertTo-Json)

$jobs = Invoke-RestMethod -Uri 'http://localhost:8080/api/jobs' -Method GET
Write-Host "`n>>> 2. /api/jobs Output (Total Jobs: $($jobs.Count)):"
Write-Host "First Job: $($jobs[0].title) at $($jobs[0].company)"

$loginPayload = '{"email":"recruiter@jobfins.com","password":"password123"}'
$auth = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body $loginPayload
Write-Host "`n>>> 3. /api/auth/login Output:"
Write-Host ($auth | ConvertTo-Json)

$salaries = Invoke-RestMethod -Uri 'http://localhost:8080/api/salary-guide' -Method GET
Write-Host "`n>>> 4. /api/salary-guide Output:"
Write-Host ($salaries | ConvertTo-Json)

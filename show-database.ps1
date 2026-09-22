# ===================================================================
# JobFins - MySQL Database Terminal Viewer (PowerShell)
# ===================================================================

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"

if (-Not (Test-Path $mysqlPath)) {
    $found = Get-ChildItem -Path "C:\Program Files\MySQL", "C:\xampp\mysql\bin" -Filter "mysql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { $mysqlPath = $found }
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  JOBFINS DATABASE CONSOLE (jobfins_db) " -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

& $mysqlPath -u root -proot -t -e @"
USE jobfins_db;

SELECT DATABASE();

SHOW TABLES;

SELECT id, name, email, role, company_name, contact_number FROM users;

SELECT id, title, company, location, job_type, salary FROM jobs;

SELECT id, job_id, seeker_id, status, applied_date FROM applications;

SELECT id, account_number, holder_name, account_type, balance FROM accounts;
"@

Write-Host "`n[SUCCESS] All JobFins database records retrieved from MySQL Server." -ForegroundColor Green

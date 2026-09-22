@echo off
cls
echo =======================================================
echo   JOBFINS DATABASE CONSOLE (jobfins_db)
echo =======================================================
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -proot -t -e "USE jobfins_db; SELECT DATABASE(); SHOW TABLES; SELECT id, name, email, role, company_name, contact_number FROM users; SELECT id, title, company, location, job_type, salary FROM jobs; SELECT id, job_id, seeker_id, status, applied_date FROM applications; SELECT id, account_number, holder_name, account_type, balance FROM accounts;"
pause

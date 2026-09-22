# JobFins - Full Stack Recruitment & Job Portal Mini-Project

A comprehensive, two-sided Job Portal web application built with **Java (Spring Boot 3)**, **MySQL**, and **React.js**, fully satisfying all **8 Mini-Project Milestones** and **FSJP Lab Experiments 4, 5, and 6**.

---

## 📋 8 Project Milestones Implementation

| # | Requirement | Implementation Details |
| :---: | :--- | :--- |
| **1** | **Dev Environment Setup** | Java 17+, Spring Boot 3 (Maven Wrapper), Node.js, and Vite. |
| **2** | **Static Web Page** | HTML5, CSS3, and Bootstrap 5 responsive static site in `static-page/` featuring top horizontal navbar and official `logo.svg`. |
| **3** | **Dynamic React Frontend** | React.js components (`JobCard`, `RecruiterDashboard`, `SeekerDashboard`, `HeroSearch`). |
| **4** | **Spring Boot REST Service** | REST Controllers (`/api/jobs`, `/api/applications`, `/api/dashboard/stats`, `/api/transactions/recent`) matching **Experiment 4**. |
| **5** | **MySQL Database Integration** | Hibernate / Spring Data JPA entities (`User`, `Job`, `Application`, `Account`) and `JpaRepository` matching **Experiment 5**. |
| **6** | **JWT Authentication** | HMAC-SHA256 tokens (`JwtUtils`, `JwtAuthenticationFilter`, `SecurityConfig`, `BCryptPasswordEncoder`) matching **Experiment 6**. |
| **7** | **React-Backend Connection** | Axios client passing `Authorization: Bearer <token>` header on all requests. |
| **8** | **Docker & GitHub Deployment** | `Dockerfile` for backend & frontend, `docker-compose.yml`, and `.gitignore`. |

---

## 🚀 Running the Project Locally

### 1. Spring Boot Backend
```bash
cd backend
./mvnw clean spring-boot:run
```
*Backend runs on `http://localhost:8080`*

### 2. React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Static Web Page Demo (Milestone 2)
Simply open `static-page/index.html` in any web browser.

### 4. Running with Docker Compose (Milestone 8)
```bash
docker compose up --build
```

---

## 🔑 Demo Login Credentials (Preloaded in MySQL)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@jobfins.com` | `password123` | Post jobs, manage listings, view applicants, accept/reject candidates |
| **Job Seeker** | `seeker@jobfins.com` | `password123` | Search jobs, filter, submit applications, track application status |

---

## 🔬 Lab Experiment Reference Outputs

- **Experiment 4**: `GET http://localhost:8080/api/dashboard/stats` $\rightarrow$ `{ "totalAccounts": 120, "totalDeposits": "18.45 L", "activeLoans": 28, "pendingKyc": 6, ... }`
- **Experiment 4**: `GET http://localhost:8080/api/transactions/recent` $\rightarrow$ `TXN1001`, `TXN1002`, `TXN1003`
- **Experiment 5**: `GET http://localhost:8080/api/db/accounts` $\rightarrow$ MySQL `accounts` table via JPA

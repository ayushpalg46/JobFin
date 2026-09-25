-- ===================================================================
-- JobFins Database Setup Script (Experiment 5: MySQL & Spring Data JPA)
-- Database: jobfins_db
-- ===================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `jobfins_db` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `jobfins_db`;

-- 2. Drop existing tables (in reverse foreign-key order)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------------
-- Table 1: users (Recruiters & Job Seekers with JWT Authentication)
-- -------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL COMMENT 'ROLE_RECRUITER or ROLE_SEEKER',
  `company_name` VARCHAR(255) DEFAULT NULL COMMENT 'For Recruiters',
  `contact_number` VARCHAR(50) DEFAULT NULL,
  `bio_or_skills` TEXT DEFAULT NULL COMMENT 'For Job Seekers',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------
-- Table 2: jobs (Job Vacancies & Compensation Specs)
-- -------------------------------------------------------------------
CREATE TABLE `jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `job_type` VARCHAR(50) NOT NULL COMMENT 'Full-time, Part-time, Remote, Internship',
  `salary` VARCHAR(100) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `requirements` TEXT DEFAULT NULL,
  `recruiter_id` BIGINT NOT NULL,
  `posted_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_jobs_recruiter` (`recruiter_id`),
  INDEX `idx_jobs_type` (`job_type`),
  INDEX `idx_jobs_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------
-- Table 3: applications (Candidate Job Applications & Tracking Status)
-- -------------------------------------------------------------------
CREATE TABLE `applications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `job_id` BIGINT NOT NULL,
  `seeker_id` BIGINT NOT NULL,
  `cover_letter` TEXT DEFAULT NULL,
  `resume_link` VARCHAR(500) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, SHORTLISTED, ACCEPTED, REJECTED',
  `applied_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_app_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_app_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_app_job` (`job_id`),
  INDEX `idx_app_seeker` (`seeker_id`),
  INDEX `idx_app_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- Sample Seed Data (Initial Verified Records)
-- ===================================================================

-- 1. Insert Initial Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `company_name`, `contact_number`, `bio_or_skills`, `created_at`) VALUES
(1, 'TechCorp Recruiter', 'recruiter@jobfins.com', '$2a$10$e7.G1iL4x5V7c4vA9.O0.eKqFjP.kP7X.3F9C9K5G6A8R0eOuy123', 'ROLE_RECRUITER', 'TechCorp Innovations', '+91 98765 43210', 'Talent Acquisition & Engineering Head', NOW()),
(2, 'Ayush Sharma', 'seeker@jobfins.com', '$2a$10$e7.G1iL4x5V7c4vA9.O0.eKqFjP.kP7X.3F9C9K5G6A8R0eOuy123', 'ROLE_SEEKER', NULL, '+91 98123 45678', 'Java 17, Spring Boot, MySQL, React.js, Docker, REST APIs', NOW()),
(3, 'Priya Patel', 'priya.candidate@gmail.com', '$2a$10$e7.G1iL4x5V7c4vA9.O0.eKqFjP.kP7X.3F9C9K5G6A8R0eOuy123', 'ROLE_SEEKER', NULL, '+91 97654 32109', 'React.js, TypeScript, Tailwind CSS, Next.js, Redux Toolkit', NOW());

-- 2. Insert Initial Job Postings
INSERT INTO `jobs` (`id`, `title`, `company`, `location`, `job_type`, `salary`, `description`, `requirements`, `recruiter_id`, `posted_date`) VALUES
(1, 'Java Backend Developer', 'TechCorp Innovations', 'Bangalore / Hybrid', 'Full-time', '₹8,00,000 - ₹14,00,000 / yr', 'We are looking for a skilled Java Backend Developer to build scalable microservices and APIs using Spring Boot and MySQL.', '1. 2+ years of Java 17+ and Spring Boot experience\n2. Strong knowledge of MySQL and JPA / Hibernate\n3. Experience with REST APIs and Docker containers', 1, NOW()),
(2, 'Frontend React Engineer', 'TechCorp Innovations', 'Mumbai', 'Full-time', '₹7,50,000 - ₹12,00,000 / yr', 'Join our frontend UI engineering team to build state-of-the-art interactive portals and applicant workflows.', '1. Proficiency in React.js, JavaScript (ES6+), and CSS3\n2. Experience with state management and Axios REST integration\n3. Familiarity with responsive layouts', 1, NOW()),
(3, 'Cloud DevOps Engineer', 'CloudScale Technologies', 'Remote', 'Remote', '₹10,00,000 - ₹18,00,000 / yr', 'Lead the deployment automation, containerization with Docker, CI/CD pipelines, and cloud infrastructure monitoring.', '1. Experience with Docker, Kubernetes, and Linux\n2. CI/CD pipeline automation with GitHub Actions\n3. AWS or Google Cloud administration experience', 1, NOW()),
(4, 'Graduate Software Intern', 'JobFins Labs', 'Pune / Remote', 'Internship', '₹25,000 / month Stipend', 'Ideal internship opportunity for pre-final and final year computer science students looking to master Full Stack Java and React development.', '1. Solid foundation in Core Java and Object-Oriented Programming\n2. Basic knowledge of HTML, CSS, and JavaScript\n3. Strong problem-solving and algorithmic skills', 1, NOW());

-- 3. Insert Initial Applications
INSERT INTO `applications` (`id`, `job_id`, `seeker_id`, `cover_letter`, `resume_link`, `status`, `applied_date`) VALUES
(1, 1, 2, 'I have strong hands-on experience building Spring Boot microservices, MySQL relational schemas, and React frontends as demonstrated in the JobFins project.', 'https://drive.google.com/your-verified-resume.pdf', 'SHORTLISTED', NOW()),
(2, 2, 3, 'Passionate frontend developer with 2+ years of React.js and modern JavaScript experience building responsive web apps.', 'https://drive.google.com/priya-resume.pdf', 'PENDING', NOW());

-- Enable Auto-increment continuation
ALTER TABLE `users` AUTO_INCREMENT = 4;
ALTER TABLE `jobs` AUTO_INCREMENT = 5;
ALTER TABLE `applications` AUTO_INCREMENT = 3;

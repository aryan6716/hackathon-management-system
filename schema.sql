-- ============================================================
-- HackathonHub - MySQL Database Schema
-- Run this file in your MySQL client to set up the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS hackathonhub;
USE hackathonhub;

-- Users table: stores all users (admin, participant, judge)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'participant', 'judge') NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table: hackathon events created by admin
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Teams table: teams created by participants
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  leader_id INT NOT NULL,
  event_id INT,
  team_code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Team members table: many-to-many between teams and users
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_team_member (team_id, user_id)
);

-- Submissions table: project submissions by teams
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  event_id INT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  github_link VARCHAR(500) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Scores table: judges score and give feedback on submissions
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  judge_id INT NOT NULL,
  score DECIMAL(4,1) NOT NULL CHECK (score >= 0 AND score <= 10),
  feedback TEXT,
  scored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (judge_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_judge_submission (submission_id, judge_id)
);

-- Judge assignments: admin assigns judges to events
CREATE TABLE IF NOT EXISTS judge_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judge_id INT NOT NULL,
  event_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (judge_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  UNIQUE KEY unique_judge_event (judge_id, event_id)
);

-- ============================================================
-- Seed Data: Default admin user
-- Password: admin123 (bcrypt hashed)
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@hackathonhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- Note: The above password hash corresponds to "password" for testing.
-- Change this immediately in production!

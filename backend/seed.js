// backend/seed.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB_NAME = process.env.DB_NAME || 'hackathonhub';

const seedDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
  });

  console.log('🌱 Starting database seed for HackathonHub...');

  try {
    // Enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Clear existing data (try-catch just in case tables are not yet created)
    try {
      await connection.execute('TRUNCATE TABLE scores');
      await connection.execute('TRUNCATE TABLE submissions');
      await connection.execute('TRUNCATE TABLE team_members');
      await connection.execute('TRUNCATE TABLE judge_assignments');
      await connection.execute('TRUNCATE TABLE teams');
      await connection.execute('TRUNCATE TABLE events');
      await connection.execute('TRUNCATE TABLE users');
    } catch (e) {
      console.log('⚠️ Some tables do not exist yet. Please run `npm run dev` first to auto-create them, then run the seed script again.');
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
      return;
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🧹 Cleaned existing tables.');

    const adminHash = await bcrypt.hash('admin123', 10);
    const userHash = await bcrypt.hash('password123', 10);

    // Seed Users
    console.log('🧑‍💻 Seeding users...');
    const [adminRes] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@example.com', adminHash, 'admin']
    );
    const adminId = adminRes.insertId;

    const [judgeRes] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Judge John', 'judge@example.com', userHash, 'judge']
    );
    const judgeId = judgeRes.insertId;

    const [part1Res] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Alice', 'alice@example.com', userHash, 'participant']
    );
    const aliceId = part1Res.insertId;

    const [part2Res] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Bob', 'bob@example.com', userHash, 'participant']
    );
    const bobId = part2Res.insertId;

    // Seed Events
    console.log('📅 Seeding events...');
    const [eventRes] = await connection.execute(
      'INSERT INTO events (name, description, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
      ['Global AI Hackathon', 'Build the future with AI.', '2026-04-01', '2026-04-03', adminId]
    );
    const eventId = eventRes.insertId;

    await connection.execute(
      'INSERT INTO judge_assignments (judge_id, event_id) VALUES (?, ?)',
      [judgeId, eventId]
    );

    // Seed Teams
    console.log('🤝 Seeding teams & members...');
    const [teamRes] = await connection.execute(
      'INSERT INTO teams (team_name, leader_id, event_id, team_code) VALUES (?, ?, ?, ?)',
      ['NeuralNomads', aliceId, eventId, 'A1B2C3']
    );
    const teamId = teamRes.insertId;

    await connection.execute('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', [teamId, aliceId]);
    await connection.execute('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)', [teamId, bobId]);

    // Seed Submissions
    console.log('🚀 Seeding submissions...');
    const [subRes] = await connection.execute(
      'INSERT INTO submissions (team_id, event_id, title, description, github_link) VALUES (?, ?, ?, ?, ?)',
      [teamId, eventId, 'AI Health Diagnostic App', 'Detects anomalies in X-Rays using CV.', 'https://github.com/alice/health-ai']
    );
    const subId = subRes.insertId;

    // Seed Scores
    console.log('📊 Seeding scores...');
    await connection.execute(
      'INSERT INTO scores (submission_id, judge_id, score, feedback) VALUES (?, ?, ?, ?)',
      [subId, judgeId, 9.5, 'Excellent concept and well implemented!']
    );

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
};

seedDatabase();

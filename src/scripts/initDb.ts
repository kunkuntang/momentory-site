import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const PRODUCTION_ENVS = ['production', 'prod'];
const PRODUCTION_APP_ENVS = ['PROD', 'PRODUCTION'];

function isProduction(): boolean {
  const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
  const appEnv = (process.env.APP_ENV || '').toUpperCase();
  return PRODUCTION_ENVS.includes(nodeEnv) || PRODUCTION_APP_ENVS.includes(appEnv);
}

if (isProduction()) {
  console.error('========================================');
  console.error('  ERROR: init-db script blocked in production!');
  console.error('========================================');
  console.error('');
  console.error('This script will DROP and RECREATE all tables,');
  console.error('causing PERMANENT DATA LOSS.');
  console.error('');
  console.error('Current environment detection:');
  console.error(`  - NODE_ENV: ${process.env.NODE_ENV || '(not set)'}`);
  console.error(`  - APP_ENV:  ${process.env.APP_ENV || '(not set)'}`);
  console.error('');
  console.error('For production database setup, use safe migration procedures:');
  console.error('  1. pnpm run prisma:migrate:deploy  (execute existing migrations)');
  console.error('  2. Manually create admin user via SQL if needed');
  console.error('========================================');
  process.exit(1);
}

const schemaPath = join(process.cwd(), 'sql', 'schema.sql');
const seedDataPath = join(process.cwd(), 'sql', 'seed-data.sql');

const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
const defaultUsername = process.env.ADMIN_DEFAULT_USERNAME || 'cb_mome_root';

if (!defaultPassword) {
  console.error('Error: ADMIN_DEFAULT_PASSWORD environment variable is not set');
  console.error('Please set it before running this script:');
  console.error('  ADMIN_DEFAULT_PASSWORD=your_secure_password pnpm run init-db');
  process.exit(1);
}

const password = defaultPassword;

if (defaultPassword.length < 8) {
  console.error('Error: ADMIN_DEFAULT_PASSWORD must be at least 8 characters long');
  process.exit(1);
}

async function executeSqlFile(filePath: string) {
  const sql = readFileSync(filePath, 'utf-8');
  const statements = sql.split(';').filter(stmt => stmt.trim());
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement);
  }
}

async function initDatabase() {
  try {
    console.log('Creating database schema...');
    await executeSqlFile(schemaPath);

    console.log('Inserting seed data...');
    await executeSqlFile(seedDataPath);

    const hash = bcrypt.hashSync(password, 10);
    await prisma.user.upsert({
      where: { username: defaultUsername },
      update: {},
      create: {
        username: defaultUsername,
        password_hash: hash,
        role_id: 1,
      },
    });

    console.log('Database initialized successfully!');
    console.log(`Super admin account created: ${defaultUsername}`);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const sqlPath = join(process.cwd(), 'sql', 'init.sql');
const sql = readFileSync(sqlPath, 'utf-8');

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

async function initDatabase() {
  try {
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }

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
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import db from '../lib/database';

const sqlPath = join(process.cwd(), 'sql', 'init.sql');
const sql = readFileSync(sqlPath, 'utf-8');

try {
  db.exec(sql);

  const defaultPassword = 'Cb@Mome2026!';
  const hash = bcrypt.hashSync(defaultPassword, 10);
  db.prepare(
    `INSERT OR IGNORE INTO users (username, password_hash, role_id) VALUES (?, ?, 1)`,
  ).run('cb_mome_root', hash);

  console.log('Database initialized successfully!');
  console.log('Super admin account created: cb_mome_root');
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
} finally {
  db.close();
}

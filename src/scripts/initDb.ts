import { readFileSync } from 'fs';
import { join } from 'path';
import db from '../lib/database';

const sqlPath = join(process.cwd(), 'sql', 'init.sql');
const sql = readFileSync(sqlPath, 'utf-8');

try {
  db.exec(sql);
  console.log('Database initialized successfully!');
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
} finally {
  db.close();
}
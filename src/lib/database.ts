import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'db', 'momentory.sqlite');

const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export { db };
export default db;
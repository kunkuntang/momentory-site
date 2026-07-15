import db from '../database';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role_id: number;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole extends User {
  role_name: string;
}

export interface UserListItem {
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
}

export function getUserByUsername(username: string): User | null {
  const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
  return (stmt.get(username) as User) || null;
}

export function getUserById(id: number): User | null {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return (stmt.get(id) as User) || null;
}

export function getAllUsers(): UserListItem[] {
  const stmt = db.prepare(`
    SELECT u.id, u.username, u.role_id, r.name as role_name, u.is_active, u.last_login_at, u.created_at
    FROM users u
    LEFT JOIN user_roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
  `);
  return stmt.all() as UserListItem[];
}

export function createUser(data: {
  username: string;
  password_hash: string;
  role_id: number;
  is_active?: boolean;
}): User {
  const stmt = db.prepare(`
    INSERT INTO users (username, password_hash, role_id, is_active)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.username,
    data.password_hash,
    data.role_id,
    data.is_active === false ? 0 : 1,
  );
  return getUserById(result.lastInsertRowid as number) as User;
}

export function updateUser(
  id: number,
  data: { username?: string; role_id?: number; is_active?: boolean },
): void {
  const fields: string[] = [];
  const values: (string | number | boolean)[] = [];

  if (data.username !== undefined) {
    fields.push('username = ?');
    values.push(data.username);
  }
  if (data.role_id !== undefined) {
    fields.push('role_id = ?');
    values.push(data.role_id);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function updateUserPassword(id: number, passwordHash: string): void {
  const stmt = db.prepare(`
    UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `);
  stmt.run(passwordHash, id);
}

export function deleteUser(id: number): void {
  const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
  stmt.run(id);
}

export function updateLastLogin(id: number): void {
  const stmt = db.prepare(`
    UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?
  `);
  stmt.run(id);
}

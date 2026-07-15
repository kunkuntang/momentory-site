import db from '../database';

export interface UserRole {
  id: number;
  name: string;
  description: string | null;
  permissions: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleWithCount extends UserRole {
  user_count: number;
}

export function getAllRoles(): UserRoleWithCount[] {
  const stmt = db.prepare(`
    SELECT r.*, COUNT(u.id) as user_count
    FROM user_roles r
    LEFT JOIN users u ON r.id = u.role_id
    GROUP BY r.id
    ORDER BY r.id ASC
  `);
  return stmt.all() as UserRoleWithCount[];
}

export function getRoleById(id: number): UserRole | null {
  const stmt = db.prepare(`SELECT * FROM user_roles WHERE id = ?`);
  return (stmt.get(id) as UserRole) || null;
}

export function createRole(data: {
  name: string;
  description?: string;
  permissions: string;
}): UserRole {
  const stmt = db.prepare(`
    INSERT INTO user_roles (name, description, permissions)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(data.name, data.description ?? null, data.permissions);
  return getRoleById(result.lastInsertRowid as number) as UserRole;
}

export function updateRole(
  id: number,
  data: { name?: string; description?: string; permissions?: string },
): void {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.permissions !== undefined) {
    fields.push('permissions = ?');
    values.push(data.permissions);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(String(id));

  const stmt = db.prepare(`UPDATE user_roles SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function deleteRole(id: number): void {
  const stmt = db.prepare(`DELETE FROM user_roles WHERE id = ?`);
  stmt.run(id);
}

export function countUsersByRole(roleId: number): number {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role_id = ?`);
  const result = stmt.get(roleId) as { count: number };
  return result.count;
}

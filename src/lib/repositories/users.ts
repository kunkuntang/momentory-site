import prisma from '../prisma';
import type { User } from '../../../prisma/generated/client/client';

export type UserWithRole = User & { role_name: string };

export type UserListItem = {
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  last_login_at: Date | null;
  created_at: Date;
};

export async function getUserByUsername(username: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { username } });
}

export async function getUserById(id: number): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

export async function getAllUsers(): Promise<UserListItem[]> {
  return await prisma.$queryRaw`
    SELECT u.id, u.username, u.role_id, r.name as role_name, u.is_active, u.last_login_at, u.created_at
    FROM users u
    LEFT JOIN user_roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
  `;
}

export async function createUser(data: {
  username: string;
  password_hash: string;
  role_id: number;
  is_active?: boolean;
}): Promise<User> {
  return await prisma.user.create({
    data: {
      username: data.username,
      password_hash: data.password_hash,
      role_id: data.role_id,
      is_active: data.is_active ?? true,
    },
  });
}

export async function updateUser(
  id: number,
  data: { username?: string; role_id?: number; is_active?: boolean },
): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.role_id !== undefined && { role_id: data.role_id }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      updated_at: new Date(),
    },
  });
}

export async function updateUserPassword(id: number, passwordHash: string): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { password_hash: passwordHash, updated_at: new Date() },
  });
}

export async function deleteUser(id: number): Promise<void> {
  await prisma.user.delete({ where: { id } });
}

export async function updateLastLogin(id: number): Promise<void> {
  await prisma.user.update({
    where: { id },
    data: { last_login_at: new Date() },
  });
}

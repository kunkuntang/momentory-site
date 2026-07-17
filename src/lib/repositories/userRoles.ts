import prisma from '../prisma';
import type { UserRole } from '../../../prisma/generated/client/client';

export type UserRoleWithCount = UserRole & { user_count: number };

export async function getAllRoles(): Promise<UserRoleWithCount[]> {
  return await prisma.$queryRaw`
    SELECT r.*, COUNT(u.id) as user_count
    FROM user_roles r
    LEFT JOIN users u ON r.id = u.role_id
    GROUP BY r.id
    ORDER BY r.id ASC
  `;
}

export async function getRoleById(id: number): Promise<UserRole | null> {
  return await prisma.userRole.findUnique({ where: { id } });
}

export async function createRole(data: {
  name: string;
  description?: string;
  permissions: string;
}): Promise<UserRole> {
  return await prisma.userRole.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      permissions: data.permissions,
    },
  });
}

export async function updateRole(
  id: number,
  data: { name?: string; description?: string; permissions?: string },
): Promise<void> {
  await prisma.userRole.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.permissions !== undefined && { permissions: data.permissions }),
      updated_at: new Date(),
    },
  });
}

export async function deleteRole(id: number): Promise<void> {
  await prisma.userRole.delete({ where: { id } });
}

export async function countUsersByRole(roleId: number): Promise<number> {
  const result = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count FROM users WHERE role_id = ${roleId}
  `;
  return result[0]?.count ?? 0;
}

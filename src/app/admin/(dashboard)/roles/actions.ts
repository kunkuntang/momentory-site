'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { createRole, updateRole, deleteRole, countUsersByRole } from '@/lib/repositories/userRoles';

export async function createRoleAction(formData: FormData) {
  await requireAuth();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissions = formData.getAll('permissions') as string[];

  if (!name) {
    redirect('/admin/roles/new?error=missing');
  }

  createRole({
    name,
    description: description || undefined,
    permissions: JSON.stringify(permissions),
  });

  redirect('/admin/roles');
}

export async function updateRoleAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const permissions = formData.getAll('permissions') as string[];

  updateRole(id, {
    name,
    description: description || undefined,
    permissions: JSON.stringify(permissions),
  });

  redirect('/admin/roles');
}

export async function deleteRoleAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const userCount = countUsersByRole(id);
  if (userCount > 0) {
    redirect('/admin/roles?error=has_users');
  }
  deleteRole(id);
  redirect('/admin/roles');
}

'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import {
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from '@/lib/repositories/users';

export async function createUserAction(formData: FormData) {
  await requireAuth();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const roleId = Number(formData.get('role_id'));
  const isActive = formData.get('is_active') === 'on';

  if (!username || !password) {
    redirect('/admin/users/new?error=missing');
  }

  const hash = hashPassword(password);
  await createUser({
    username,
    password_hash: hash,
    role_id: roleId,
    is_active: isActive,
  });

  redirect('/admin/users');
}

export async function updateUserAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const username = formData.get('username') as string;
  const roleId = Number(formData.get('role_id'));
  const isActive = formData.get('is_active') === 'on';
  const newPassword = formData.get('password') as string;

  await updateUser(id, {
    username,
    role_id: roleId,
    is_active: isActive,
  });

  if (newPassword) {
    await updateUserPassword(id, hashPassword(newPassword));
  }

  redirect('/admin/users');
}

export async function deleteUserAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deleteUser(id);
  redirect('/admin/users');
}

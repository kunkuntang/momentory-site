'use server';

import { redirect } from 'next/navigation';
import { getUserByUsername } from '@/lib/repositories/users';
import { getRoleById } from '@/lib/repositories/userRoles';
import { verifyPassword, generateToken, setSessionCookie } from '@/lib/auth';
import { updateLastLogin } from '@/lib/repositories/users';

export interface LoginState {
  error?: string;
}

export async function loginAction(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: '请输入用户名和密码' };
  }

  const user = getUserByUsername(username);
  if (!user) {
    return { error: '用户名或密码错误' };
  }

  if (!user.is_active) {
    return { error: '账号已被禁用' };
  }

  const isValid = verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { error: '用户名或密码错误' };
  }

  const role = getRoleById(user.role_id);
  if (!role) {
    return { error: '用户角色不存在' };
  }

  const permissions = JSON.parse(role.permissions) as string[];

  const token = generateToken({
    userId: user.id,
    username: user.username,
    roleId: user.role_id,
    permissions,
  });

  await setSessionCookie(token);
  updateLastLogin(user.id);

  redirect('/admin');
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '24h';

export interface Session {
  userId: number;
  username: string;
  roleId: number;
  permissions: string[];
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(payload: Session): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): Session | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  try {
    return jwt.verify(token, secret) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

export function hasPermission(session: Session, permission: string): boolean {
  return session.permissions.includes('*') || session.permissions.includes(permission);
}

export async function requirePermission(permission: string): Promise<Session> {
  const session = await requireAuth();
  if (!hasPermission(session, permission)) {
    throw new Error('权限不足');
  }
  return session;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

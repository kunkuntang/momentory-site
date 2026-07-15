import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
}

export default function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-ink">{title}</h1>
        {description && <p className="text-sm text-admin-muted mt-1">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
        >
          {action.label}
        </Link>
      )}
      {children}
    </div>
  );
}

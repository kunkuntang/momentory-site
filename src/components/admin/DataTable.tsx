import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg border border-admin-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border bg-admin-bg">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-medium text-admin-muted ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-admin-muted"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-admin-border last:border-0 hover:bg-admin-bg transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-admin-ink ${col.className ?? ''}`}>
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

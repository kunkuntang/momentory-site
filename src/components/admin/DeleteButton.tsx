'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteButton() {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="submit"
          className="text-xs text-white bg-admin-danger px-2 py-1 rounded hover:bg-red-700 transition-colors"
        >
          确认删除
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-admin-muted hover:text-admin-ink transition-colors"
        >
          取消
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-admin-danger hover:text-red-700 transition-colors"
      title="删除"
    >
      <Trash2 size={16} />
    </button>
  );
}

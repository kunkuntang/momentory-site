'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label?: string;
  pendingLabel?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  label = '保存',
  pendingLabel = '保存中...',
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

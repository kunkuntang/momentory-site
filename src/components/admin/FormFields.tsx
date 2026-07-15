import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, name, children, hint }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-admin-ink mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-admin-muted mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 border border-admin-border rounded-md text-sm text-admin-ink focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ''}`} rows={props.rows ?? 3} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ''}`} />;
}

interface CheckboxProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
}

export function Checkbox({ name, label, defaultChecked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
      />
      <span className="text-sm text-admin-ink">{label}</span>
    </label>
  );
}

interface CheckboxGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValues?: string[];
}

export function CheckboxGroup({ name, label, options, defaultValues = [] }: CheckboxGroupProps) {
  return (
    <div className="mb-4">
      <span className="block text-sm font-medium text-admin-ink mb-2">{label}</span>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              className="w-4 h-4 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
            />
            <span className="text-sm text-admin-ink">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

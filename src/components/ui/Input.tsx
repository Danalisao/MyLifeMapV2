import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
            transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50
            dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-400
            ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
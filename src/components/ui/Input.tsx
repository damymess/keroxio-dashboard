import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-2xl px-4 py-2 text-sm',
            'glass-input text-foreground',
            'placeholder:text-muted-foreground/60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue/50 focus-visible:border-ios-blue/30',
            'disabled:cursor-not-allowed disabled:opacity-40',
            error && 'border-ios-red/50 focus-visible:ring-ios-red/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-ios-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

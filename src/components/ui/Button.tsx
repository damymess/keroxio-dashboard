import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    default: 'glass-btn-primary text-white font-medium',
    secondary: 'glass-btn text-foreground',
    outline: 'glass-btn text-foreground',
    ghost: 'hover:bg-white/5 text-foreground',
    destructive: 'bg-ios-red/80 text-white border border-ios-red/40 hover:bg-ios-red/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-xl',
    md: 'h-10 px-4 text-sm rounded-2xl',
    lg: 'h-12 px-6 text-base rounded-2xl',
    icon: 'h-10 w-10 rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue/50',
        'disabled:pointer-events-none disabled:opacity-40',
        'active:scale-[0.98] transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

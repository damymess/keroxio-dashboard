import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-ios-blue/20 text-ios-blue border-ios-blue/30',
    secondary: 'bg-white/5 text-foreground/80 border-white/10',
    success: 'bg-ios-green/20 text-ios-green border-ios-green/30',
    warning: 'bg-ios-orange/20 text-ios-orange border-ios-orange/30',
    destructive: 'bg-ios-red/20 text-ios-red border-ios-red/30',
    outline: 'border border-white/15 bg-transparent text-foreground/70',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

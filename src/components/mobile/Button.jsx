import { LucideIcon } from 'lucide-react';

export function Button({
  children,
  kind = 'primary',
  size = 'md',
  icon: Icon,
  full = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseClasses = 'rounded-md font-medium transition-all flex items-center justify-center gap-s2 active:opacity-80 disabled:opacity-50';

  const kindClasses = {
    primary: 'bg-ink text-white border-thick border-ink',
    lime: 'bg-accent text-ink border-thick border-ink',
    ghost: 'bg-transparent text-ink border-thick border-ink',
    danger: 'bg-neg text-white border-thick border-neg',
    success: 'bg-pos text-white border-thick border-pos',
  }[kind];

  const sizeClasses = {
    sm: 'px-s4 py-s2 text-xs h-9 min-h-[44px] md:h-8 md:min-h-auto',
    md: 'px-s5 py-s3 text-body h-11 min-h-[44px] md:h-10 md:min-h-auto',
    lg: 'px-s6 py-s4 text-body h-12 min-h-[44px]',
  }[size];

  const widthClasses = full ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${kindClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} />}
      {loading ? 'Carregando…' : children}
    </button>
  );
}

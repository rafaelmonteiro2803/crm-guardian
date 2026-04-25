export function Card({
  children,
  thick = false,
  padding = 's5',
  onClick,
  variant = 'default',
  className = '',
}) {
  const baseClasses = 'rounded-lg bg-surface';
  const borderClasses = thick ? 'border-thick border-ink' : 'border border-line';
  const variantClasses = {
    default: '',
    accent: 'bg-accent',
    danger: 'bg-neg-soft',
  }[variant];
  const paddingClasses = {
    's2': 'p-s2',
    's3': 'p-s3',
    's4': 'p-s4',
    's5': 'p-s5',
    's6': 'p-s6',
    's7': 'p-s7',
  }[padding];

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${variantClasses} ${paddingClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

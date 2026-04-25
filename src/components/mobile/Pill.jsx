export function Pill({
  label,
  tone = 'neutral',
  className = '',
}) {
  const baseClasses = 'inline-flex items-center px-s3 py-s1 rounded-sm text-xs font-semibold border border-current';

  const toneClasses = {
    neutral: 'bg-primary-soft text-ink',
    pos: 'bg-pos-soft text-pos border-pos',
    warn: 'bg-warn-soft text-warn border-warn',
    neg: 'bg-neg-soft text-neg border-neg',
    info: 'bg-info-soft text-info border-info',
    pink: 'bg-pink-soft text-pink border-pink',
    ink: 'bg-line-2 text-ink border-ink',
    accent: 'bg-accent text-accent-ink border-accent',
  }[tone];

  return (
    <span className={`${baseClasses} ${toneClasses} ${className}`}>
      {label}
    </span>
  );
}

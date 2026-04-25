import { ChevronRight } from 'lucide-react';

export function Section({
  label,
  right,
  onViewAll,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-s3 ${className}`}>
      <div className="flex items-center justify-between px-s5">
        <h2 className="text-h3 font-bold text-ink">{label}</h2>
        {onViewAll ? (
          <button
            onClick={onViewAll}
            className="text-sm text-accent font-semibold flex items-center gap-s1 active:opacity-60"
          >
            Ver tudo
            <ChevronRight size={16} />
          </button>
        ) : (
          right && <div>{right}</div>
        )}
      </div>
      <div className="flex flex-col gap-s3 px-s5">
        {children}
      </div>
    </div>
  );
}

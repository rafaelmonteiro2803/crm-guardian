import { Button } from './Card';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-s7 px-s5 text-center ${className}`}>
      {Icon && (
        <div className="mb-s4 text-ink-3">
          <Icon size={48} />
        </div>
      )}
      <h3 className="text-h2 font-bold text-ink mb-s2">{title}</h3>
      <p className="text-body text-ink-3 mb-s5 max-w-sm">{description}</p>
      {action && (
        <Button kind="lime" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}

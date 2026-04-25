import { ChevronLeft, MoreVertical } from 'lucide-react';

export function Header({
  title,
  eyebrow,
  right,
  back,
  big = false,
  className = '',
}) {
  return (
    <div className={`sticky top-0 z-40 bg-bg border-b border-line ${className}`}>
      <div className="h-16 px-s5 flex items-center justify-between">
        <div className="flex items-center gap-s3 flex-1 min-w-0">
          {back && (
            <button
              onClick={back}
              className="active:opacity-60 p-s2"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {big ? (
            <div className="flex-1 min-w-0">
              {eyebrow && (
                <div className="text-micro text-ink-3 font-semibold uppercase">
                  {eyebrow}
                </div>
              )}
              <h1 className="text-h1 font-bold break-words">{title}</h1>
            </div>
          ) : (
            <h1 className="text-h2 font-bold flex-1 truncate">{title}</h1>
          )}
        </div>
        {right && <div className="ml-s3 flex-shrink-0">{right}</div>}
      </div>
    </div>
  );
}

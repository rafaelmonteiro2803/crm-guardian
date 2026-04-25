import { useSwipe } from '../../hooks/useSwipe';
import { Card } from './Card';

export function SwipeCard({
  children,
  actions = [],
  thick = true,
  padding = 's5',
  onClick,
  className = '',
}) {
  const { translateX, isOpen, handlers, close } = useSwipe();

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      {...handlers}
    >
      {/* Actions behind card */}
      {actions.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-end bg-surface">
          <div className="flex h-full">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onPress?.();
                  close();
                }}
                className={`px-s4 h-full flex items-center justify-center font-semibold text-white transition-all active:opacity-80 ${
                  action.color || 'bg-ink'
                }`}
                style={{ width: `${100 / actions.length}%` }}
              >
                <span className="text-xs text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card that slides */}
      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
        }}
      >
        <Card
          thick={thick}
          padding={padding}
          onClick={() => {
            if (!isOpen) {
              onClick?.();
            } else {
              close();
            }
          }}
          className={`cursor-pointer ${isOpen ? 'active:opacity-80' : ''}`}
        >
          {children}
        </Card>
      </div>

      {/* Invisible close overlay when swiped */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={close}
        />
      )}
    </div>
  );
}

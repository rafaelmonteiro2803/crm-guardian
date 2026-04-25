import { Card } from './Card';

export function KpiCard({
  label,
  value,
  sub,
  variant = 'default',
  className = '',
}) {
  const isHero = variant === 'hero';

  return (
    <Card
      thick
      variant={isHero ? 'accent' : 'default'}
      padding={isHero ? 's6' : 's5'}
      className={className}
    >
      <div className="flex flex-col gap-s2">
        <div className={`text-micro ${isHero ? 'text-accent-ink' : 'text-ink-3'} uppercase font-semibold`}>
          {label}
        </div>
        <div className={`${isHero ? 'text-hero' : 'text-h2'} font-bold ${isHero ? 'text-accent-ink' : 'text-ink'}`}>
          {value}
        </div>
        {sub && (
          <div className={`text-xs ${isHero ? 'text-accent-ink' : 'text-ink-3'}`}>
            {sub}
          </div>
        )}
      </div>
    </Card>
  );
}

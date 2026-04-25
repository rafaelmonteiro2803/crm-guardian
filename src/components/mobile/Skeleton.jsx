export function Skeleton({
  className = '',
  variant = 'rect',
  width = '100%',
  height = '16px',
}) {
  const variants = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded-sm',
  }[variant];

  return (
    <div
      className={`bg-line-2 animate-pulse ${variants} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ count = 1, className = '' }) {
  return (
    <div className={`flex flex-col gap-s3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface rounded-lg border border-line p-s5 space-y-s3"
        >
          <Skeleton width="60%" height="14px" />
          <Skeleton width="100%" height="20px" />
          <Skeleton width="80%" height="12px" />
        </div>
      ))}
    </div>
  );
}

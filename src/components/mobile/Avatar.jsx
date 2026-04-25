const COLORS = [
  'bg-red-200 text-red-900',
  'bg-blue-200 text-blue-900',
  'bg-green-200 text-green-900',
  'bg-yellow-200 text-yellow-900',
  'bg-purple-200 text-purple-900',
  'bg-pink-200 text-pink-900',
  'bg-indigo-200 text-indigo-900',
  'bg-cyan-200 text-cyan-900',
];

function getInitials(name) {
  return name
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('') || '?';
}

function getColorFromName(name) {
  const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  return COLORS[hash % COLORS.length];
}

export function Avatar({
  name = 'N',
  size = 'md',
  bg,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  const bgColor = bg || getColorFromName(name);
  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses} rounded-md border-thick border-ink flex items-center justify-center font-semibold ${bgColor} ${className}`}
    >
      {initials}
    </div>
  );
}

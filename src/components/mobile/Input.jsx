import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  suffix,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-s2">
      {label && (
        <label htmlFor={rest.id} className="text-micro text-ink-2 font-semibold uppercase">
          {label} {required && <span aria-label="requerido">*</span>}
        </label>
      )}
      <div
        className={`relative flex items-center border-thick rounded-md min-h-[44px] transition-colors ${
          error ? 'border-neg' : 'border-ink'
        } ${disabled ? 'opacity-50' : ''}`}
        role="region"
        aria-label={error ? `${label}: ${error}` : label}
      >
        {Icon && (
          <div className="pl-s4 flex items-center text-ink-3">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`flex-1 bg-transparent px-s4 py-s3 text-body outline-none ${Icon ? '' : 'px-s4'} ${className}`}
          {...rest}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-s4 text-ink-3 active:opacity-60"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {suffix && !showPassword && (
          <div className="pr-s4 text-xs font-semibold text-ink-2 cursor-pointer">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-neg">{error}</p>}
    </div>
  );
}

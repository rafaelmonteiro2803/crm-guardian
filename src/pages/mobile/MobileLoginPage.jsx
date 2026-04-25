import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Button, Input, Card } from '../../components/mobile';
import { Zap } from 'lucide-react';

export function MobileLoginPage() {
  const { handleSignIn } = useAuth();
  const { tenants: allTenants, setTenantId } = useTenant();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email inválido';
    }

    if (!password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!selectedTenant) {
      errors.tenant = 'Empresa é obrigatória';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const signInError = await handleSignIn(email, password);

      if (signInError) {
        setError('Email ou senha inválidos');
      } else {
        if (selectedTenant) {
          setTenantId(selectedTenant);
        }
        // Router will handle redirect to /m/ after auth
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-s5 py-s7">
      {/* Logo Mark */}
      <div className="mb-s7 flex items-center justify-center">
        <div className="w-14 h-14 bg-ink rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent rotate-45" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-hero font-bold text-ink text-center mb-s2">
        Entrar
      </h1>
      <p className="text-h3 text-ink-3 text-center mb-s7">
        Guardian CRM
      </p>

      {/* Form Card */}
      <Card thick className="w-full max-w-sm space-y-s5">
        <form onSubmit={handleSubmit} className="space-y-s5">
          {/* Tenant Dropdown */}
          <div className="space-y-s2">
            <label className="text-micro text-ink-2 font-semibold uppercase block">
              Empresa
            </label>
            <select
              value={selectedTenant}
              onChange={(e) => {
                setSelectedTenant(e.target.value);
                setFieldErrors({ ...fieldErrors, tenant: null });
              }}
              className={`w-full px-s4 py-s3 border-thick rounded-md text-body bg-white outline-none ${
                fieldErrors.tenant ? 'border-neg' : 'border-ink'
              }`}
            >
              <option value="">Selecione uma empresa</option>
              {/* TODO: Carregar tenants do usuário após email */}
            </select>
            {fieldErrors.tenant && (
              <p className="text-xs text-neg">{fieldErrors.tenant}</p>
            )}
          </div>

          {/* Email Input */}
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: null });
            }}
            error={fieldErrors.email}
            required
          />

          {/* Password Input */}
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: null });
            }}
            error={fieldErrors.password}
            required
          />

          {/* Error Message */}
          {error && (
            <Card variant="danger" padding="s4">
              <p className="text-sm text-neg font-semibold">{error}</p>
            </Card>
          )}

          {/* Login Button */}
          <Button
            kind="lime"
            size="lg"
            full
            loading={loading}
            onClick={handleSubmit}
            type="submit"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>

        {/* Password Recovery Link */}
        <div className="text-center">
          <a
            href="#"
            className="text-body text-accent font-semibold hover:opacity-80 active:opacity-60"
          >
            Esqueceu a senha? Recuperar
          </a>
        </div>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-s5 left-0 right-0 text-center">
        <p className="text-micro text-ink-4 font-semibold">
          GUARDIAN · V2.0
        </p>
      </div>
    </div>
  );
}

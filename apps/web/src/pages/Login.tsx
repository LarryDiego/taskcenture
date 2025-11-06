import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { authApi } from '@/services/api';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('auth.fillAllFields'));
      return;
    }

    if (isSignup && !username) {
      toast.error(t('auth.enterUsername'));
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        // Register new user - hardcoded as ADMINISTRATOR
        await authApi.register(username, email, password, 'ADMINISTRATOR');
        toast.success(t('auth.accountCreated'));
        setIsSignup(false);
        setUsername('');
      } else {
        // Login existing user
        await login(email, password);
        toast.success(t('auth.welcomeBackMsg'));
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (isSignup ? t('auth.registrationFailed') : t('auth.loginFailed')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-card-hover">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/Accenture-Logo.png" 
              alt="Accenture" 
              className="h-8 w-auto"
            />
            <h1 className="text-4xl font-bold text-primary">taskCenture</h1>
          </div>
          <p className="text-muted-foreground">
            {isSignup ? t('auth.createAccount') : t('auth.welcomeBack')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('common.loading') : (isSignup ? t('auth.signup') : t('auth.login'))}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-primary hover:underline"
          >
            {isSignup
              ? t('auth.alreadyHaveAccount')
              : t('auth.dontHaveAccount')}
          </button>
        </div>
      </Card>
    </div>
  );
};

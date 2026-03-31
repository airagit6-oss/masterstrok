import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [eyeState, setEyeState] = useState<'open' | 'closed'>('open');
  const [isBossLogin, setIsBossLogin] = useState(false);
  const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  const doBlink = useCallback((duration = 150) => {
    setEyeState('closed');
    setTimeout(() => setEyeState('open'), duration);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const isPasswordFocused = focusedField === 'password';
      const minDelay = isPasswordFocused ? 4000 : 2500;
      const maxDelay = isPasswordFocused ? 6000 : 4000;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);

      blinkTimeout.current = setTimeout(() => {
        const blinkDuration = 120 + Math.random() * 60;
        doBlink(blinkDuration);

        // 12% chance of double blink
        if (Math.random() < 0.12) {
          setTimeout(() => doBlink(blinkDuration), blinkDuration + 80);
        }

        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => { if (blinkTimeout.current) clearTimeout(blinkTimeout.current); };
  }, [focusedField, doBlink]);

  const handleMascotHover = () => doBlink(140);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBossLogin) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const accentColor = isBossLogin ? 'hsl(var(--mp-gold))' : 'hsl(var(--primary))';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: accentColor }}
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Toggle boss/user login */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setIsBossLogin(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !isBossLogin
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setIsBossLogin(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isBossLogin
                ? 'text-background'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
            style={isBossLogin ? { background: 'hsl(var(--mp-gold))' } : undefined}
          >
            Boss Login
          </button>
        </div>

        {/* Card */}
        <div className="mp-card p-8 pt-16 relative rounded-2xl">
          {/* Mascot */}
          <div
            ref={mascotRef}
            onMouseEnter={handleMascotHover}
            className="absolute -top-14 left-1/2 -translate-x-1/2 cursor-pointer"
          >
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center relative transition-shadow duration-500"
              style={{
                background: `linear-gradient(145deg, hsl(var(--mp-bg-card)), hsl(var(--mp-bg-surface)))`,
                border: `3px solid ${accentColor}`,
                boxShadow: `0 0 30px ${accentColor.replace(')', ' / 0.25)')}`,
              }}
            >
              {/* Face */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-4 mt-1">
                  {/* Left eye */}
                  <div className="relative">
                    <div
                      className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center transition-all"
                      style={{
                        transform: eyeState === 'closed' ? 'scaleY(0.08)' : 'scaleY(1)',
                        transition: 'transform 0.1s ease-in-out',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: accentColor }}
                      />
                    </div>
                  </div>
                  {/* Right eye */}
                  <div className="relative">
                    <div
                      className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center transition-all"
                      style={{
                        transform: eyeState === 'closed' ? 'scaleY(0.08)' : 'scaleY(1)',
                        transition: 'transform 0.1s ease-in-out',
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: accentColor }}
                      />
                    </div>
                  </div>
                </div>
                {/* Mouth */}
                <div
                  className="absolute bottom-7 left-1/2 -translate-x-1/2 w-6 h-3 rounded-b-full"
                  style={{ borderBottom: `2px solid ${accentColor}` }}
                />
              </div>

              {/* Crown for boss */}
              {isBossLogin && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                  👑
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 mt-2">
            <h1 className="text-2xl font-bold font-display text-foreground">
              {isBossLogin ? 'Boss Panel' : 'Welcome Back'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--mp-text-secondary))' }}>
              {isBossLogin ? 'Admin access only' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('none')}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/30"
                style={
                  focusedField === 'email'
                    ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor.replace(')', ' / 0.15)')}` }
                    : undefined
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('none')}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-14 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/30"
                  style={
                    focusedField === 'password'
                      ? { borderColor: accentColor, boxShadow: `0 0 0 3px ${accentColor.replace(')', ' / 0.15)')}` }
                      : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="text-right">
              <button type="button" className="text-xs hover:underline" style={{ color: accentColor }}>
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg font-semibold text-sm transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: isBossLogin
                  ? 'linear-gradient(135deg, hsl(var(--mp-gold)), hsl(38 92% 40%))'
                  : 'linear-gradient(135deg, hsl(var(--mp-gradient-start)), hsl(var(--mp-gradient-end)))',
                color: isBossLogin ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))',
              }}
            >
              {isBossLogin ? '🔐 Enter Boss Panel' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'hsl(var(--mp-text-dim))' }}>
            {isBossLogin
              ? 'Authorized personnel only'
              : <>Don't have an account? <button className="hover:underline" style={{ color: accentColor }}>Sign up</button></>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

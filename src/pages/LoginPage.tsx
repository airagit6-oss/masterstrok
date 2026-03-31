import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [eyeState, setEyeState] = useState<'open' | 'closed'>('open');
  const [isBossLogin, setIsBossLogin] = useState(false);
  const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    navigate(isBossLogin ? '/dashboard' : '/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Boss/User toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setIsBossLogin(false)}
            style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
              background: !isBossLogin ? '#7ec8e3' : '#333', color: !isBossLogin ? '#fff' : '#aaa',
            }}
          >
            User Login
          </button>
          <button
            onClick={() => setIsBossLogin(true)}
            style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
              background: isBossLogin ? '#d4a017' : '#333', color: isBossLogin ? '#000' : '#aaa',
            }}
          >
            Boss Login
          </button>
        </div>

        {/* White card */}
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '40px 32px 32px', position: 'relative',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          {/* Mascot */}
          <div
            onMouseEnter={handleMascotHover}
            style={{
              position: 'absolute', top: '-56px', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer',
            }}
          >
            <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
              {/* Circle background */}
              <circle cx="56" cy="56" r="54" fill="#daedf7" stroke="#7ec8e3" strokeWidth="2.5" />
              {/* Hair spikes */}
              <path d="M35 32 Q38 18 44 28 Q46 16 52 26 Q56 14 60 26 Q64 16 68 28 Q72 18 76 32" fill="#7ec8e3" stroke="#5ba8c8" strokeWidth="1" />
              {/* Head */}
              <ellipse cx="56" cy="52" rx="26" ry="24" fill="#f5f0e8" />
              {/* Ears */}
              <ellipse cx="30" cy="50" rx="6" ry="8" fill="#f5f0e8" />
              <ellipse cx="82" cy="50" rx="6" ry="8" fill="#f5f0e8" />
              {/* Eyes */}
              <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '46px 48px', transform: eyeState === 'closed' ? 'scaleY(0.1)' : 'scaleY(1)' }}>
                <ellipse cx="46" cy="48" rx="4" ry="4.5" fill="#2d2d2d" />
                <ellipse cx="47.5" cy="46.5" rx="1.2" ry="1.5" fill="#fff" />
              </g>
              <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '66px 48px', transform: eyeState === 'closed' ? 'scaleY(0.1)' : 'scaleY(1)' }}>
                <ellipse cx="66" cy="48" rx="4" ry="4.5" fill="#2d2d2d" />
                <ellipse cx="67.5" cy="46.5" rx="1.2" ry="1.5" fill="#fff" />
              </g>
              {/* Smile */}
              <path d="M48 58 Q56 66 64 58" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Body/shoulders hint */}
              <path d="M36 76 Q56 88 76 76" fill="#daedf7" />
              {isBossLogin && (
                <text x="56" y="14" textAnchor="middle" fontSize="18">👑</text>
              )}
            </svg>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ marginTop: '36px' }}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('none')}
                placeholder="email@domain.com"
                style={{
                  width: '100%', height: '42px', padding: '0 12px', fontSize: '14px',
                  border: '1.5px solid #ccc', borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
                  borderColor: focusedField === 'email' ? '#7ec8e3' : '#ccc', color: '#333', background: '#fff',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                  Password
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(v => !v)}
                    style={{ accentColor: '#7ec8e3' }}
                  />
                  Show
                </label>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('none')}
                style={{
                  width: '100%', height: '42px', padding: '0 12px', fontSize: '14px',
                  border: '1.5px solid #ccc', borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
                  borderColor: focusedField === 'password' ? '#7ec8e3' : '#ccc', color: '#333', background: '#fff',
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 600, color: '#fff',
                background: isBossLogin ? 'linear-gradient(135deg, #d4a017, #b8860b)' : '#7ec8e3',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {isBossLogin ? '🔐 Boss Login' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

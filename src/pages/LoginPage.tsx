import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [eyeState, setEyeState] = useState<'open' | 'closed'>('open');
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
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top black section */}
      <div style={{ flex: 1, background: '#000', minHeight: '40vh' }} />

      {/* Center card - overlapping both sections */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '50px 36px 36px',
          width: '320px',
          position: 'relative',
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          marginTop: '-80px',
          marginBottom: '-80px',
        }}>
          {/* Mascot */}
          <div
            onMouseEnter={handleMascotHover}
            style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'pointer',
            }}
          >
            <svg width="100" height="100" viewBox="0 0 112 112" fill="none">
              <circle cx="56" cy="56" r="54" fill="#daedf7" stroke="#b5d8e8" strokeWidth="2" />
              {/* Hair spikes */}
              <path d="M35 32 Q38 18 44 28 Q46 16 52 26 Q56 14 60 26 Q64 16 68 28 Q72 18 76 32" fill="#fff" stroke="#daedf7" strokeWidth="1" />
              {/* Face */}
              <ellipse cx="56" cy="54" rx="26" ry="24" fill="#fff" />
              {/* Ears */}
              <ellipse cx="30" cy="52" rx="5" ry="7" fill="#fff" />
              <ellipse cx="82" cy="52" rx="5" ry="7" fill="#fff" />
              {/* Left eye */}
              <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '46px 50px', transform: eyeState === 'closed' ? 'scaleY(0.08)' : 'scaleY(1)' }}>
                <ellipse cx="46" cy="50" rx="3.5" ry="4" fill="#2d2d2d" />
                <ellipse cx="47.2" cy="48.5" rx="1" ry="1.2" fill="#fff" />
              </g>
              {/* Right eye */}
              <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '66px 50px', transform: eyeState === 'closed' ? 'scaleY(0.08)' : 'scaleY(1)' }}>
                <ellipse cx="66" cy="50" rx="3.5" ry="4" fill="#2d2d2d" />
                <ellipse cx="67.2" cy="48.5" rx="1" ry="1.2" fill="#fff" />
              </g>
              {/* Smile */}
              <path d="M48 60 Q56 68 64 60" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Body hint */}
              <path d="M38 76 Q56 90 74 76" fill="#daedf7" />
            </svg>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>
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
                  width: '100%',
                  height: '40px',
                  padding: '0 10px',
                  fontSize: '14px',
                  border: '1.5px solid',
                  borderColor: focusedField === 'email' ? '#7ec8e3' : '#ccc',
                  borderRadius: '4px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#333',
                  background: '#fff',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Password</label>
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
                  width: '100%',
                  height: '40px',
                  padding: '0 10px',
                  fontSize: '14px',
                  border: '1.5px solid',
                  borderColor: focusedField === 'password' ? '#7ec8e3' : '#ccc',
                  borderRadius: '4px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#333',
                  background: '#fff',
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                color: '#fff',
                background: '#7ec8e3',
              }}
            >
              Log in
            </button>
          </form>
        </div>
      </div>

      {/* Bottom light section */}
      <div style={{ flex: 1, background: '#f0f0f0', minHeight: '40vh' }} />
    </div>
  );
};

export default LoginPage;

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

  const benefits = [
    { icon: '💰', title: 'Earn 30% Commission', desc: 'On every sale you refer' },
    { icon: '🚀', title: 'Instant Payouts', desc: 'Get paid weekly via bank transfer' },
    { icon: '📦', title: 'Free Marketing Kit', desc: 'Banners, links & landing pages' },
    { icon: '🌍', title: 'Global Reach', desc: 'Sell to customers worldwide' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', maxWidth: '1100px', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* LEFT SIDE - Reseller CTA */}
        <div style={{ flex: '1', minWidth: '260px', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', borderRadius: '16px', padding: '28px 24px', border: '1px solid rgba(126,200,227,0.2)' }}>
            <div style={{ fontSize: '13px', color: '#7ec8e3', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              🤝 Partner Program
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.3, margin: '0 0 10px' }}>
              Join as a Reseller & <span style={{ color: '#7ec8e3' }}>Earn Money</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#aab4be', lineHeight: 1.6, margin: 0 }}>
              Turn your network into income. Promote premium SaaS products and earn recurring commissions.
            </p>
          </div>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 14px', background: '#111920', borderRadius: '10px', border: '1px solid #1e2a35' }}>
              <span style={{ fontSize: '22px' }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{b.title}</div>
                <div style={{ fontSize: '12px', color: '#7a8a99' }}>{b.desc}</div>
              </div>
            </div>
          ))}
          <button style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #7ec8e3', background: 'transparent', color: '#7ec8e3', fontWeight: 700, fontSize: '14px', cursor: 'pointer', letterSpacing: '0.5px' }}>
            Become a Reseller →
          </button>
        </div>

        {/* CENTER - Login Card */}
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {/* Boss/User toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '80px', position: 'relative', zIndex: 10 }}>
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
              style={{ position: 'absolute', top: '-56px', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer' }}
            >
              <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
                <circle cx="56" cy="56" r="54" fill="#daedf7" stroke="#7ec8e3" strokeWidth="2.5" />
                <path d="M35 32 Q38 18 44 28 Q46 16 52 26 Q56 14 60 26 Q64 16 68 28 Q72 18 76 32" fill="#7ec8e3" stroke="#5ba8c8" strokeWidth="1" />
                <ellipse cx="56" cy="52" rx="26" ry="24" fill="#f5f0e8" />
                <ellipse cx="30" cy="50" rx="6" ry="8" fill="#f5f0e8" />
                <ellipse cx="82" cy="50" rx="6" ry="8" fill="#f5f0e8" />
                <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '46px 48px', transform: eyeState === 'closed' ? 'scaleY(0.1)' : 'scaleY(1)' }}>
                  <ellipse cx="46" cy="48" rx="4" ry="4.5" fill="#2d2d2d" />
                  <ellipse cx="47.5" cy="46.5" rx="1.2" ry="1.5" fill="#fff" />
                </g>
                <g style={{ transition: 'transform 0.1s ease-in-out', transformOrigin: '66px 48px', transform: eyeState === 'closed' ? 'scaleY(0.1)' : 'scaleY(1)' }}>
                  <ellipse cx="66" cy="48" rx="4" ry="4.5" fill="#2d2d2d" />
                  <ellipse cx="67.5" cy="46.5" rx="1.2" ry="1.5" fill="#fff" />
                </g>
                <path d="M48 58 Q56 66 64 58" stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M36 76 Q56 88 76 76" fill="#daedf7" />
                {isBossLogin && <text x="56" y="14" textAnchor="middle" fontSize="18">👑</text>}
              </svg>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ marginTop: '36px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('none')}
                  placeholder="email@domain.com"
                  style={{
                    width: '100%', height: '42px', padding: '0 12px', fontSize: '14px',
                    border: '1.5px solid', borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
                    borderColor: focusedField === 'email' ? '#7ec8e3' : '#ccc', color: '#333', background: '#fff',
                  }}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Password</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(v => !v)} style={{ accentColor: '#7ec8e3' }} />
                    Show
                  </label>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('none')}
                  style={{
                    width: '100%', height: '42px', padding: '0 12px', fontSize: '14px',
                    border: '1.5px solid', borderRadius: '6px', outline: 'none', boxSizing: 'border-box',
                    borderColor: focusedField === 'password' ? '#7ec8e3' : '#ccc', color: '#333', background: '#fff',
                  }}
                />
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                <a href="#" style={{ fontSize: '12px', color: '#7ec8e3', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
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

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
                <span style={{ fontSize: '12px', color: '#999' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
              </div>

              {/* Social Login */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                {/* Google */}
                <button type="button" style={{ flex: 1, height: '40px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#333', fontWeight: 500 }}>
                  <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                  Google
                </button>
                {/* Apple */}
                <button type="button" style={{ flex: 1, height: '40px', borderRadius: '6px', border: '1px solid #ddd', background: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                  <svg width="16" height="16" fill="#fff" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24 1.3-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  Apple
                </button>
                {/* Biometric */}
                <button type="button" style={{ flex: 1, height: '40px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: '#333', fontWeight: 500 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round"><path d="M12 10v4M7.5 8a5.5 5.5 0 0 1 9 0M5 6a9 9 0 0 1 14 0M3 4a13 13 0 0 1 18 0M12 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
                  🔒
                </button>
              </div>

              {/* Sign up link */}
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 }}>
                Don't have an account? <a href="#" style={{ color: '#7ec8e3', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE - More benefits */}
        <div style={{ flex: '1', minWidth: '260px', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', borderRadius: '16px', padding: '28px 24px', border: '1px solid rgba(126,200,227,0.15)' }}>
            <div style={{ fontSize: '13px', color: '#f0c040', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⭐ Why Choose Us
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1.3, margin: '0 0 10px' }}>
              Premium SaaS <span style={{ color: '#7ec8e3' }}>Marketplace</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#aab4be', lineHeight: 1.6, margin: 0 }}>
              Access 500+ verified apps. Enterprise-grade security. 24/7 support.
            </p>
          </div>

          {[
            { icon: '🛡️', title: 'Enterprise Security', desc: 'SOC2 & GDPR compliant' },
            { icon: '⚡', title: '99.9% Uptime', desc: 'Globally distributed CDN' },
            { icon: '🎧', title: '24/7 Priority Support', desc: 'Dedicated account manager' },
            { icon: '🔄', title: '30-Day Money Back', desc: 'No questions asked refund' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 14px', background: '#111920', borderRadius: '10px', border: '1px solid #1e2a35' }}>
              <span style={{ fontSize: '22px' }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{b.title}</div>
                <div style={{ fontSize: '12px', color: '#7a8a99' }}>{b.desc}</div>
              </div>
            </div>
          ))}

          <div style={{ background: '#111920', borderRadius: '10px', padding: '16px', border: '1px solid #1e2a35', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7ec8e3' }}>10K+</div>
            <div style={{ fontSize: '12px', color: '#7a8a99' }}>Active Resellers Earning</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

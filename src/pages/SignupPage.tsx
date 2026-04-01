import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<'none' | 'name' | 'email' | 'password'>('none');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, 'user');
    navigate('/');
  };

  const fieldStyle = (field: string) => ({
    width: '100%',
    height: '42px',
    padding: '0 12px',
    fontSize: '14px',
    border: '1.5px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    borderColor: focusedField === field ? '#7ec8e3' : '#ccc',
    color: '#333',
    background: '#fff',
  });

  // Check for reseller referral code in URL
  const refCode = new URLSearchParams(window.location.search).get('ref');

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{
          background: '#fff', borderRadius: '12px', padding: '40px 32px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#333', marginBottom: '4px', textAlign: 'center' }}>
            Create Account
          </h2>
          {refCode && (
            <p style={{ fontSize: '13px', color: '#7ec8e3', textAlign: 'center', marginBottom: '16px' }}>
              🎁 Referred by a partner
            </p>
          )}
          <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '24px' }}>
            Join SaaSHub to access premium apps
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('none')}
                placeholder="Your name"
                required
                style={fieldStyle('name')}
              />
            </div>

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
                required
                style={fieldStyle('email')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('none')}
                placeholder="Min 8 characters"
                required
                minLength={8}
                style={fieldStyle('password')}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%', height: '44px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 600, color: '#fff', background: '#7ec8e3',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#7ec8e3', fontWeight: 600, textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function Auth({ onAuthSuccess, initialIsLogin, onClose }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin !== undefined ? initialIsLogin : true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialIsLogin !== undefined) {
      setIsLogin(initialIsLogin);
    }
  }, [initialIsLogin]);


  // Initialize and render Google Sign-In Button
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not configured. Google Sign-In button will not be rendered.');
      return;
    }

    const initGoogle = () => {
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSuccess
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-btn-container'),
          {
            theme: 'filled_dark',
            size: 'large',
            width: '100%',
            shape: 'rectangular',
            text: 'continue_with'
          }
        );
      } else {
        // Retry if script is still loading
        setTimeout(initGoogle, 500);
      }
    };

    initGoogle();
  }, [isLogin]);

  const handleGoogleSuccess = async (googleResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: googleResponse.credential })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={styles.wrapper}>
      <style>{cssStyles}</style>
      <div className="auth-card" style={styles.card}>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose} 
            style={styles.closeBtn} 
            className="auth-close-btn"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        <div className="auth-header" style={styles.header}>
          <div style={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={styles.logoText}>RentTrace</span>
          </div>
          <h2 style={styles.title}>{isLogin ? 'Sign In to Account' : 'Create an Account'}</h2>
          <p style={styles.subtitle}>{isLogin ? 'Welcome back! Please enter your details.' : 'Start managing your utility bills efficiently.'}</p>
        </div>

        {error && (
          <div className="auth-error" style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group auth-input-group-1" style={styles.formGroup}>
              <label htmlFor="auth-name" style={styles.label}>Full Name</label>
              <input
                type="text"
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={styles.input}
                required
              />
            </div>
          )}

          <div className="form-group auth-input-group-2" style={styles.formGroup}>
            <label htmlFor="auth-email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>

          <div className="form-group auth-input-group-3" style={styles.formGroup}>
            <label htmlFor="auth-password" style={styles.label}>Password</label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {GOOGLE_CLIENT_ID && (
          <>
            <div className="auth-divider-block" style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>or</span>
              <span style={styles.dividerLine}></span>
            </div>

            <div id="google-btn-container" className="auth-social-block" style={styles.googleContainer}></div>
          </>
        )}

        <div className="auth-footer-block" style={styles.toggleFooter}>
          <p style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={styles.toggleBtn}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Keyframes and CSS class styles for premium layout entries
const cssStyles = `
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes cardEntrance {
    from { opacity: 0; transform: translateY(40px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes itemEntrance {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .auth-wrapper {
    background: linear-gradient(-45deg, #09090b, #11101d, #1c1532, #0d1226, #09090b) !important;
    background-size: 400% 400% !important;
    animation: gradientMove 16s ease infinite !important;
  }
  .auth-card {
    animation: cardEntrance 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
  }
  .auth-header {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards !important;
  }
  .auth-input-group-1 {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards !important;
  }
  .auth-input-group-2 {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.28s forwards !important;
  }
  .auth-input-group-3 {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.34s forwards !important;
  }
  .auth-submit-btn {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.40s forwards !important;
  }
  .auth-divider-block {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.46s forwards !important;
  }
  .auth-social-block {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.52s forwards !important;
  }
  .auth-footer-block {
    animation: itemEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.58s forwards !important;
  }

  .auth-header, .auth-input-group-1, .auth-input-group-2, .auth-input-group-3, .auth-submit-btn, .auth-divider-block, .auth-social-block, .auth-footer-block {
    opacity: 0;
  }
  .auth-close-btn:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #fff !important;
    transform: rotate(90deg);
  }
`;

// Inline Styles for Modern Glassmorphism Look
const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box'
  },
  closeBtn: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 10,
    outline: 'none',
    padding: 0
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.025em'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    lineHeight: '1.4'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    color: '#ef4444',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box'
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    margin: '1.5rem 0',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '0.85rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)'
  },
  dividerText: {
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  googleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  toggleFooter: {
    textAlign: 'center',
    marginTop: '1.5rem'
  },
  footerText: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#818cf8',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline'
  }
};

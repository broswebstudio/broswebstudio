'use client';
import { useState, Suspense } from 'react';
import { ICON_SRC } from '@/lib/logo-base64';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const urlError = searchParams.get('error');
  const [loginMode, setLoginMode] = useState<'login' | 'signup' | 'otp'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlError ? urlError.replace(/_/g, ' ') : '');
  const [signupEmail, setSignupEmail] = useState('');

  // Safe returnUrl — only allow relative paths on same origin
  const rawReturn = searchParams.get('returnUrl') || '';
  const returnUrl = rawReturn.startsWith('/') && !rawReturn.startsWith('//') ? rawReturn : '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginMode === 'signup') {
        const emailEl = document.getElementById('authEmail') as HTMLInputElement;
        const passEl = document.getElementById('authPass') as HTMLInputElement;
        const nameEl = document.getElementById('authName') as HTMLInputElement;
        const phoneEl = document.getElementById('authPhone') as HTMLInputElement;

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: emailEl.value, 
            password: passEl.value, 
            name: nameEl.value,
            phone: phoneEl.value 
          }),
        });
        
        if (res.ok) {
          setSignupEmail(emailEl.value);
          setLoginMode('otp');
        } else {
          const data = await res.json();
          setError(data.error || 'Signup failed');
        }
      } else if (loginMode === 'otp') {
        const otpEl = document.getElementById('authOtp') as HTMLInputElement;
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: signupEmail, otp: otpEl.value }),
        });

        if (res.ok) {
          setError('Email verified! Please log in.');
          setLoginMode('login');
        } else {
          const data = await res.json();
          setError(data.error || 'Verification failed');
        }
      } else {
        const emailEl = document.getElementById('authEmail') as HTMLInputElement;
        const passEl = document.getElementById('authPass') as HTMLInputElement;

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailEl.value, password: passEl.value }),
        });

        if (res.ok) {
          localStorage.setItem('bws_logged_in', 'true');
          const data = await res.json();
          if (data.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push(returnUrl);
          }
        } else {
          const data = await res.json();
          setError(data.error || 'Login failed');
          if (data.unverified) {
            setSignupEmail(emailEl.value);
            // Optionally, we could add a "Resend OTP" button here, but for now we'll just show the error.
          }
        }
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="brand" style={{ marginBottom: '16px' }}>
        <img src={ICON_SRC} alt="Bro's WebStudio" style={{ width: '48px', height: '48px' }} />
      </div>
      <h2>{loginMode === 'login' ? 'Welcome back' : loginMode === 'otp' ? 'Verify Email' : 'Create Client Account'}</h2>
      
      {error && <div style={{ color: error.includes('verified') ? 'green' : 'red', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

      <p className="lede" style={{ marginBottom: '32px' }}>
        {loginMode === 'login' 
          ? 'Access your client dashboard or admin portal.' 
          : loginMode === 'otp' ? 'Enter the 6-digit OTP sent to your email.'
          : 'Sign up to track your project estimates and status.'}
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {loginMode === 'otp' ? (
          <div className="field">
            <label>OTP Code</label>
            <input id="authOtp" type="text" placeholder="123456" required maxLength={6} style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }} />
          </div>
        ) : (
          <>
            {loginMode === 'signup' && (
              <>
                <div className="field">
                  <label>Name</label>
                  <input id="authName" type="text" placeholder="Your name" required />
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input id="authPhone" type="tel" placeholder="+91 9876543210" required />
                </div>
              </>
            )}
            <div className="field">
              <label>Email</label>
              <input id="authEmail" type="email" placeholder="you@email.com" required defaultValue={signupEmail} />
            </div>
            <div className="field">
              <label>Password</label>
              <input id="authPass" type="password" placeholder="••••••••" required minLength={8} />
            </div>
          </>
        )}
        <button className="btn btn-yellow btn-block" type="submit" style={{ marginTop: '24px' }} disabled={loading}>
          {loading ? 'Processing...' : loginMode === 'login' ? 'Log in' : loginMode === 'otp' ? 'Verify OTP' : 'Create Account'}
        </button>
      </form>

      {loginMode !== 'otp' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-line)' }}></div>
            <span style={{ padding: '0 12px', color: 'var(--gray)', fontSize: '0.9rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-line)' }}></div>
          </div>
          
          <Link href="/api/auth/google" className="btn btn-outline btn-block" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Link>
        </>
      )}

      {loginMode !== 'otp' && (
        <div className="auth-switch" style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem' }}>
          {loginMode === 'login' ? (
            <>
              <span style={{ color: 'var(--gray)' }}>New client? </span>
              <button
                type="button"
                onClick={() => setLoginMode('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              <span style={{ color: 'var(--gray)' }}>Already have an account? </span>
              <button
                type="button"
                onClick={() => setLoginMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-wrap">
      <Link href="/" style={{ position: 'absolute', top: 24, left: 24, textDecoration: 'none', color: 'var(--gray)', fontSize: '0.9rem' }}>
        &larr; Back to Home
      </Link>
      <Suspense fallback={
        <div className="auth-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <p style={{ color: 'var(--gray)' }}>Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

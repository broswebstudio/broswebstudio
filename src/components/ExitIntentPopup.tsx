'use client';
import { useState, useEffect } from 'react';
import { logActivity } from '@/lib/tracking';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already claimed or dismissed permanently
    if (localStorage.getItem('bws_popup_handled')) return;

    const timer = setTimeout(() => {
      setShow(true);
      logActivity('timed_popup_shown');
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem('bws_popup_handled', 'true');
    setShow(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;

    try {
      // Basic validation locally first
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      // Verify and record with backend
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'popup_claim',
          servicesSelected: ['DISCOUNT_CLAIM'],
          totalEstimate: 0,
          status: 'NEW',
          contactEmail: email,
          message: 'Claimed 10% discount from timed popup'
        })
      });

      if (res.ok) {
        logActivity('discount_claimed', { email });
        setSubmitted(true);
        localStorage.setItem('bws_popup_handled', 'true');
        
        // Auto-close after showing success for 3 seconds
        setTimeout(() => setShow(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(13,13,11,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)',
        maxWidth: '400px', width: '100%', position: 'relative', boxShadow: 'var(--shadow)'
      }}>
        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray)' }}
        >
          &times;
        </button>
        
        {!submitted ? (
          <>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', lineHeight: 1.2 }}>Wait! Don't leave empty-handed.</h2>
            <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>Get a 10% discount on your project. Enter your email to claim your coupon code now.</p>
            {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input type="text" name="bws_honeypot_email" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input 
                type="email" 
                placeholder="you@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '1rem', border: '1px solid var(--gray-line)', borderRadius: '8px', marginBottom: '16px' }}
              />
              <button type="submit" className="btn btn-yellow btn-block">Claim 10% Discount</button>
            </form>
            <button 
              onClick={handleClose}
              style={{ background: 'none', border: 'none', color: 'var(--gray)', textDecoration: 'underline', fontSize: '0.85rem', cursor: 'pointer', marginTop: '16px', width: '100%' }}
            >
              No thanks, I prefer paying full price
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="success-icon-wrap" style={{ margin: '0 auto 16px auto', width: '60px', height: '60px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '30px', height: '30px' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', color: 'var(--ink)' }}>You claimed!</h2>
            <p style={{ color: 'var(--ink-soft)' }}>Your coupon code is <b>BWS10</b>. We've verified and emailed it to you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

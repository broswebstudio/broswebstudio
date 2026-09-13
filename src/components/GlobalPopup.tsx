'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function GlobalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only prompt on public pages, not on auth pages
    if (pathname === '/login' || pathname.startsWith('/admin') || pathname === '/profile') {
      return;
    }

    const checkAuthAndPrompt = async () => {
      try {
        const res = await fetch('/api/user/data');
        if (!res.ok) {
          // User is not logged in.
          // We can pop this up after a slight delay so it's not aggressively instant
          setTimeout(() => setIsOpen(true), 1500);
        }
      } catch (err) {
        // Assume not logged in on error
        setTimeout(() => setIsOpen(true), 1500);
      }
    };

    checkAuthAndPrompt();
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(13, 13, 11, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="auth-card" style={{ maxWidth: '420px', width: '90%', margin: '0', position: 'relative', textAlign: 'center' }}>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray)' }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: '16px', fontSize: '1.6rem' }}>Welcome to Bro's WebStudio!</h2>
        <p className="lede" style={{ marginBottom: '24px' }}>
          Create a free client account to submit projects, track estimates, and discuss your requirements directly with our development team.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn btn-yellow btn-block" 
            onClick={() => {
              setIsOpen(false);
              router.push('/login?mode=signup');
            }}
          >
            Create an Account
          </button>
          
          <button 
            className="btn btn-outline btn-block" 
            onClick={() => {
              setIsOpen(false);
              router.push('/login?mode=login');
            }}
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}

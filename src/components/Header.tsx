'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_LINKS } from '../lib/data';
import { ICON_SRC } from '../lib/logo-base64';
import { Home, Monitor, GraduationCap, Palette, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined' && localStorage.getItem('bws_logged_in') !== 'true') {
      return;
    }
    fetch('/api/user/data')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data && data.success && data.user) {
          setUserData(data.user);
        }
      })
      .catch(() => {}); // silent fail if not logged in
  }, []);

  const isDarkPage = pathname === '/college-projects' || pathname === '/graphic-designing';
  const headerClass = `site ${isScrolled || isDarkPage ? 'solid' : ''}`;

  return (
    <>
      <header className={headerClass} id="siteHeader">
        <div className="wrap">
          <Link href="/" className="brand">
            <img src={ICON_SRC} alt="Bro's WebStudio logo" />
            <div className="brand-text">
              <span className="brand-black">Bro's Web</span><span className="brand-yellow">Studio</span>
            </div>
          </Link>
          <nav className="links">
            {NAV_LINKS.map((link) => {
              const isActive = 
                (link.route === 'home' && pathname === '/') || 
                (pathname === `/${link.route}`);
              return (
                <Link
                  key={link.route}
                  href={`/${link.route === 'home' ? '' : link.route}`}
                  className={isActive ? 'active' : ''}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="nav-cta">
            {userData ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{ background: 'none', border: 'none', color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'inherit', minWidth: 0, overflow: 'hidden' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--yellow-deep)', color: 'var(--ink)', fontSize: '0.85rem' }}>
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>Hi, {userData.name ? userData.name.split(' ')[0] : 'Client'}</span>
                </button>
                
                {profileMenuOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 15px)', right: 0, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px', minWidth: '160px', zIndex: 100 }}>
                    <Link href="/profile" onClick={() => setProfileMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', color: 'var(--ink)', textDecoration: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--paper-warm)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      Dashboard
                    </Link>
                    <button 
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        localStorage.removeItem('bws_logged_in');
                        await fetch('/api/auth/logout', { method: 'POST' });
                        router.push('/login');
                        window.location.reload();
                      }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', color: '#ef4444', textDecoration: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }} 
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#fee2e2'} 
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{ color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Login</Link>
            )}
            <Link href="/estimate" className="btn btn-yellow">Get an Estimate</Link>
          </div>
          <button
            className="hamb tablet-only"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobilePanel"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel (Tablets only) */}
      <div id="mobilePanel" className={`mobile-panel tablet-only ${mobileMenuOpen ? 'open' : ''}`}>
        <button
          className="close"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobilePanel"
        >
          &times;
        </button>
        {NAV_LINKS.map((link) => {
          const isActive = 
            (link.route === 'home' && pathname === '/') || 
            (pathname === `/${link.route}`);
          return (
            <Link
              key={link.route}
              href={`/${link.route === 'home' ? '' : link.route}`}
              className={isActive ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-line)' }}>
                <span style={{ display: 'inline-block', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--yellow-deep)', color: 'var(--ink)', textAlign: 'center', lineHeight: '32px', fontSize: '0.9rem' }}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
                Hi, {userData.name ? userData.name.split(' ')[0] : 'Client'}
              </div>
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: '8px 0', color: 'var(--ink-soft)', fontSize: '1.05rem', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <button 
                onClick={async () => {
                  setMobileMenuOpen(false);
                  localStorage.removeItem('bws_logged_in');
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/login');
                  window.location.reload();
                }}
                style={{ padding: '8px 0', color: '#ef4444', fontSize: '1.05rem', textDecoration: 'none', fontWeight: 500, background: 'none', border: 'none', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer' }}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', fontWeight: 500, textDecoration: 'none' }}>Login</Link>
          )}
          <Link href="/estimate" className="btn btn-yellow" onClick={() => setMobileMenuOpen(false)} style={{ textAlign: 'center', justifyContent: 'center' }}>Get an Estimate</Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Phones only) */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className={`bottom-nav-item ${(pathname === '/' || pathname === '/home') ? 'active' : ''}`}>
          <span className="icon"><Home size={22} strokeWidth={2.5} /></span>
          <span className="label">Home</span>
        </Link>
        <Link href="/website-for-business" className={`bottom-nav-item ${pathname === '/website-for-business' ? 'active' : ''}`}>
          <span className="icon"><Monitor size={22} strokeWidth={2.5} /></span>
          <span className="label">Web</span>
        </Link>
        <Link href="/college-projects" className={`bottom-nav-item ${pathname === '/college-projects' ? 'active' : ''}`}>
          <span className="icon"><GraduationCap size={22} strokeWidth={2.5} /></span>
          <span className="label">Projects</span>
        </Link>
        <Link href="/graphic-designing" className={`bottom-nav-item ${pathname === '/graphic-designing' ? 'active' : ''}`}>
          <span className="icon"><Palette size={22} strokeWidth={2.5} /></span>
          <span className="label">Design</span>
        </Link>
        <Link href={userData ? "/profile" : "/login"} className={`bottom-nav-item ${pathname === '/profile' || pathname === '/login' ? 'active' : ''}`}>
          <span className="icon"><User size={22} strokeWidth={2.5} /></span>
          <span className="label">{userData ? (userData.name ? userData.name.split(' ')[0] : 'Portal') : 'Login'}</span>
        </Link>
      </nav>
    </>
  );
}

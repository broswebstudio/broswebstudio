import Link from 'next/link';
import { ICON_SRC } from '../lib/logo-base64';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <img src={ICON_SRC} alt="Bro's WebStudio logo" />
              <div className="brand-text foot-brand-text">
                <span className="brand-black foot-brand-white">Bro's Web</span><span className="brand-yellow">Studio</span>
              </div>
            </div>
            <p style={{ color: '#a9a9a4', fontSize: '.9rem', maxWidth: '280px' }}>
              Websites, college projects and graphic design — built, documented and delivered on time.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <Link href="/website-for-business">Website for Business</Link>
            <Link href="/college-projects">College Projects</Link>
            <Link href="/graphic-designing">Graphic Designing</Link>
          </div>
          <div>
            <h4>Studio</h4>
            <Link href="/">Home</Link>
            <Link href="/login">Admin Portal</Link>
          </div>
          <div>
            <h4>Get in touch</h4>
            <a href="mailto:broswebstudio@gmail.com">broswebstudio@gmail.com</a>
            <a href="tel:+918368079768">+91 8368079768</a>
            <a href="https://www.instagram.com/broswebstudio?igsi=MXh1ZGt2cXBqdWkwOA==" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Bro's WebStudio. All rights reserved.</span>
          <span className="footer-signature">&lt;built-with-care/&gt;</span>
        </div>
      </div>
    </footer>
  );
}

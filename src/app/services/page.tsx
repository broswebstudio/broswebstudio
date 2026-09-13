import Link from 'next/link';

export const metadata = {
  title: 'Our Services - Bro\'s WebStudio',
  description: 'Discover how Bro\'s WebStudio can help you grow your business, pass your college viva, and elevate your brand.',
};

export default function ServicesPage() {
  return (
    <div className="page" style={{ paddingBottom: '80px' }}>
      
      {/* Header Section */}
      <section className="section text-center">
        <div className="wrap narrow">
          <h1 className="h1">What can we build for you?</h1>
          <p className="lede">
            We don't just write code or draw logos. We deliver <strong>results</strong>. 
            Whether you need more sales, a working college project, or a brand people trust, we've got you covered.
          </p>
        </div>
      </section>

      {/* Service 1: Website for Business */}
      <section className="section">
        <div className="wrap">
          <div style={{ backgroundColor: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-line)', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <span className="badge" style={{ backgroundColor: 'var(--yellow-deep)', color: 'var(--ink)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>For Businesses</span>
                <h2 className="h2" style={{ marginBottom: '16px' }}>Websites that actually get you customers.</h2>
                <p style={{ color: 'var(--gray)', marginBottom: '24px', lineHeight: 1.6 }}>
                  Most websites are just digital brochures. We build websites that act as your 24/7 sales team. 
                  When your customers search for you, a professional, lightning-fast website builds instant trust.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Direct Leads:</strong> Stop paying 30% commission to third-party apps like Zomato or JustDial. Get direct orders.</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Trust & Credibility:</strong> A beautiful website proves you are a legitimate, premium business.</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Always Open:</strong> Share your portfolio, pricing, and contact info with clients even when you are asleep.</span>
                  </li>
                </ul>
                <Link href="/website-for-business" className="btn btn-outline">Explore Business Websites</Link>
              </div>
              <div style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💻</div>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--paper)' }}>Ready to go digital?</h3>
                <p style={{ color: 'var(--gray)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Get a custom estimate for your business website in 2 minutes.</p>
                <Link href="/estimate?service=website" className="btn btn-yellow btn-block">Get an Estimate</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2: College Projects */}
      <section className="section" style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--paper)' }}>Need a project fast?</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Tell us your tech stack, topic, and deadline. We handle the rest.</p>
              <Link href="/estimate?service=college" className="btn btn-yellow btn-block">Request a Project</Link>
            </div>
            <div>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--paper)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>For Students</span>
              <h2 className="h2" style={{ marginBottom: '16px', color: 'var(--paper)' }}>Pass your Viva with total confidence.</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.6 }}>
                Buying a zip file of code isn't enough. When the external examiner asks you how the database connects, you need answers. 
                We provide end-to-end solutions for Major and Minor projects.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                  <span><strong>Working Source Code:</strong> Clean, modern code in your preferred tech stack (MERN, Python, Java, etc.) that actually runs.</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                  <span><strong>Full Documentation:</strong> Plagiarism-free Project Reports, Synopses, and PPTs formatted to your college's guidelines.</span>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                  <span><strong>Setup & Explanation:</strong> We help you run the project on your laptop and explain the architecture so you can answer viva questions.</span>
                </li>
              </ul>
              <Link href="/college-projects" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--paper)' }}>Explore College Projects</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service 3: Graphic Designing */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ backgroundColor: 'var(--paper)', padding: '40px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-line)', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <span className="badge" style={{ backgroundColor: 'var(--yellow-deep)', color: 'var(--ink)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>For Everyone</span>
                <h2 className="h2" style={{ marginBottom: '16px' }}>First impressions matter. We make yours unforgettable.</h2>
                <p style={{ color: 'var(--gray)', marginBottom: '24px', lineHeight: 1.6 }}>
                  Whether it's a logo for your new startup, an eye-catching thumbnail, or a complete brand identity, 
                  our designs communicate professionalism instantly.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Brand Trust:</strong> A highly polished logo and color palette makes customers feel safe spending money with you.</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Attention Grabbing:</strong> Stand out on social media with posts and banners that stop the scroll.</span>
                  </li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ color: 'var(--yellow-deep)' }}>✓</span>
                    <span><strong>Custom UI/UX:</strong> We design app and website interfaces that are not just beautiful, but incredibly easy to use.</span>
                  </li>
                </ul>
                <Link href="/graphic-designing" className="btn btn-outline">Explore Graphic Design</Link>
              </div>
              <div style={{ backgroundColor: 'var(--paper-warm)', padding: '40px', borderRadius: 'var(--radius)', textAlign: 'center', border: '1px solid var(--gray-line)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎨</div>
                <h3 style={{ margin: '0 0 8px 0' }}>Need a visual upgrade?</h3>
                <p style={{ color: 'var(--gray)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Get a quote for logos, banners, UI/UX, or social media posts.</p>
                <Link href="/estimate?service=graphics" className="btn btn-yellow btn-block">Get a Design Quote</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

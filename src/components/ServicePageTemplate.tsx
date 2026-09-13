import Link from 'next/link';
import FaqAccordion from './FaqAccordion';

export type ServiceTier = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  pop: boolean;
};

export type ServiceProcess = {
  t: string;
  d: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServiceConfig = {
  key: string;
  route: string;
  name: string;
  eyebrow: string;
  tagline: string;
  lede: string;
  who: string[];
  included: string[];
  tiers: ServiceTier[];
  process: ServiceProcess[];
  faqs: ServiceFaq[];
};

export default function ServicePageTemplate({ cfg }: { cfg: ServiceConfig }) {
  return (
    <>
      <section className="service-hero">
        <div className="swoosh"></div>
        <div className="wrap service-hero-grid">
          <div className="service-hero-content">
            <div className="breadcrumb dark">
              <Link href="/">Home</Link> / {cfg.name}
            </div>
            <div className="eyebrow">{cfg.eyebrow}</div>
            <h1>{cfg.tagline}</h1>
            <p className="lede">{cfg.lede}</p>
            <div className="hero-ctas" style={{ marginTop: '26px' }}>
              <Link href={`/estimate?service=${cfg.key}`} className="btn btn-yellow">
                Get an estimate
              </Link>
              <a href="#svcFaq" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
                Read FAQs
              </a>
            </div>
          </div>

          <div className="service-hero-visual reveal in">
            <div className="sh-card">
              <div className="sh-card-header">
                <span className="dot r"></span>
                <span className="dot y"></span>
                <span className="dot g"></span>
                <span className="title">Snapshot</span>
              </div>
              <div className="sh-card-body">
                <h4 style={{ marginBottom: '14px', color: '#fff', fontSize: '1.05rem' }}>Project Highlights:</h4>
                <ul className="sh-check-list">
                  {cfg.included.slice(0, 4).map((inc, i) => (
                    <li key={i}>
                      <span className="chk">✓</span> {inc}
                    </li>
                  ))}
                </ul>
                <div className="sh-card-footer">
                  <div className="rating" style={{ color: 'var(--yellow)', fontWeight: 600, fontSize: '0.9rem' }}>
                    ★★★★★ <span style={{ color: '#a9a9a4', marginLeft: '6px' }}>5.0 Average</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#a9a9a4', fontFamily: 'var(--mono)' }}>{cfg.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="toc">
        <div className="wrap toc">
          <a href="#svcWho">Who it's for</a>
          <a href="#svcIncluded">What's included</a>
          <a href="#svcPricing">Pricing</a>
          <a href="#svcProcess">Process</a>
          <a href="#svcFaq">FAQs</a>
        </div>
      </div>

      <section className="section" id="svcWho">
        <div className="wrap two-col">
          <div>
            <div className="eyebrow">who-its-for</div>
            <h2>Built for people who need this to actually work.</h2>
            <p className="lede">
              {cfg.name} projects at Bro's WebStudio are scoped for real deadlines and real audiences — not portfolio filler.
            </p>
          </div>
          <div>
            <ul className="check-list">
              {cfg.who.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="svcIncluded">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">whats-included</div>
            <h2>Everything that comes with every {cfg.name.toLowerCase()} order.</h2>
          </div>
          <div className="feat-grid two-col-desktop" style={{ maxWidth: '820px', margin: '44px auto 0' }}>
            {cfg.included.map((inc, i) => (
              <div className="feat-card reveal in" key={i}>
                <div className="feat-icon">{String(i + 1).padStart(2, '0')}</div>
                <p style={{ margin: 0, color: 'var(--ink)', fontWeight: 500 }}>{inc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="svcPricing">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">pricing</div>
            <h2>Three tiers. Pick a start point, customise in the estimator.</h2>
          </div>
          <div className="price-cards">
            {cfg.tiers.map((t, i) => (
              <div className={`price-card ${t.pop ? 'pop' : ''} reveal in`} key={i}>
                {t.pop && <span className="tag">Most picked</span>}
                <h3>{t.name}</h3>
                <p style={{ fontSize: '.88rem', marginBottom: 0 }}>{t.desc}</p>
                <div className="amt">
                  {t.price}<span> starting</span>
                </div>
                <ul>
                  {t.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
                <Link href={`/estimate?service=${cfg.key}`} className={`btn ${t.pop ? 'btn-primary' : 'btn-outline'} btn-block`}>
                  Customise this
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="svcProcess">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">our-process</div>
            <h2>How a {cfg.name.toLowerCase()} order actually runs.</h2>
          </div>
          <div className="process-list">
            {cfg.process.map((p, i) => (
              <div className="process-item reveal in" key={i}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#111110', color: 'var(--paper)', borderTop: '1px solid #1a1a18', borderBottom: '1px solid #1a1a18' }}>
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '40px' }}>
            <div className="eyebrow">why-us</div>
            <h2 style={{ color: '#fff' }}>Not just another agency.</h2>
            <p style={{ color: '#a9a9a4' }}>Here is why creators, founders, and students trust Bro's WebStudio to deliver their most important projects.</p>
          </div>
          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="icon">⚡</div>
              <h3>Zero Freelancer Flakes</h3>
              <p>We are a dedicated studio team. No ghosting, no missed deadlines. You get a direct line to the developers and designers working on your project.</p>
            </div>
            <div className="why-us-card">
              <div className="icon">💎</div>
              <h3>Upfront, Clear Pricing</h3>
              <p>No hidden setup fees, no "contact us for quote" games. You build your estimate live and that is exactly what you pay.</p>
            </div>
            <div className="why-us-card">
              <div className="icon">🛠️</div>
              <h3>Modern Tech Stack</h3>
              <p>We build robust, scalable applications using Next.js, React, Node, and premium UI practices — exactly what top startups use.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="svcFaq">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">faqs</div>
            <h2>{cfg.name} — common questions.</h2>
          </div>
          <FaqAccordion faqs={cfg.faqs} />
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="cta-band">
            <div className="eyebrow">{cfg.eyebrow}</div>
            <h2>Ready to start your {cfg.name.toLowerCase()}?</h2>
            <p>Build a live estimate in under a minute, or talk to our team first.</p>
            <Link href={`/estimate?service=${cfg.key}`} className="btn btn-primary">
              Open the estimator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

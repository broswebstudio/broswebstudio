import Link from 'next/link';
import { Metadata } from 'next';
import { PROBLEMS, FEATURES, STEPS, FAQS_HOME } from '../lib/data';
import Estimator from '../components/Estimator';
import FaqAccordion from '../components/FaqAccordion';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow">bros-webstudio</div>
            <h1>We build <span style={{ background: 'linear-gradient(135deg, var(--yellow), #ff7a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>custom websites</span>, college projects &amp; graphic designs that actually deliver.</h1>
            <p className="lede">Professional website development, college major/minor projects, and graphic design — under one roof, priced upfront, delivered on time.</p>
            <div className="hero-ctas">
              <Link href="/estimate" className="btn btn-yellow">Get My Free Estimate Now</Link>
              <a href="#how" className="btn btn-outline">See How We Work</a>
            </div>
            <div className="hero-trust">
              <span><b>150+</b> projects shipped</span>
              <span><b>3–15 day</b> delivery</span>
              <span><b>2</b> free revisions</span>
              <span><b>4.9★</b> avg rating</span>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div className="term-swoosh"></div>
            <div className="term">
              <div className="term-bar">
                <span className="term-dot r"></span>
                <span className="term-dot y"></span>
                <span className="term-dot g"></span>
                <span className="term-title">brief.js</span>
              </div>
              <div className="term-body">
                <span className="c">// what are we building today?</span>
                <br />
                <span className="k">const</span> project = {'{'}
                <br />
                &nbsp;&nbsp;service: <span className="s">"website"</span> | <span className="s">"college-project"</span> | <span className="s">"graphic-design"</span>,
                <br />
                &nbsp;&nbsp;deadline: <span className="s">"fixed &amp; visible"</span>,
                <br />
                &nbsp;&nbsp;revisions: <span className="s">"included"</span>,
                <br />
                {'}'};
                <br />
                <br />
                <span className="k">deliver</span>(project)<span className="term-cursor"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* This banner only shows on mobile, replacing the top layout banner */}
      <div className="wrap mobile-only-banner" style={{ background: 'linear-gradient(90deg, #0f172a, #27272a)', color: '#fff', textAlign: 'center', padding: '16px 20px', fontSize: '0.9rem', fontWeight: 500, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
          <span style={{ backgroundColor: '#facc15', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>NEW</span>
          <span>We build Premium Websites & Projects.</span>
        </div>
        <span>Know your exact price in 30 seconds.</span>
        <a href="/estimate" style={{ color: '#facc15', textDecoration: 'underline', fontWeight: 600, width: '100%', textAlign: 'center' }}>Calculate Cost &rarr;</a>
      </div>

      <div style={{ backgroundColor: 'var(--ink)', color: 'var(--paper)', padding: '30px 20px', borderBottom: '1px solid var(--ink-soft)' }}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><b style={{ fontSize: '1.4rem', color: 'var(--yellow)', fontFamily: 'var(--display)' }}>150+</b> projects shipped</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><b style={{ fontSize: '1.4rem', color: 'var(--yellow)', fontFamily: 'var(--display)' }}>3-15</b> day delivery</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><b style={{ fontSize: '1.4rem', color: 'var(--yellow)', fontFamily: 'var(--display)' }}>2</b> free revisions</span>
          </div>
          <div className="tech-stack-row" style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#a9a9a4', fontSize: '0.85rem', fontWeight: 500, flexWrap: 'wrap' }}>
            <span style={{ marginRight: '10px' }}>Powered by modern tech:</span>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Next.js</span>
            <span style={{ fontWeight: 700, color: '#61dafb', fontSize: '1.1rem' }}>React</span>
            <span style={{ fontWeight: 700, color: '#339933', fontSize: '1.1rem' }}>Node</span>
            <span style={{ fontWeight: 700, color: '#3178c6', fontSize: '1.1rem' }}>TS</span>
          </div>
        </div>
      </div>

      <section className="section" id="problem">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="eyebrow">the-problem</div>
            <h2>Most "cheap and fast" work costs you later.</h2>
            <p className="lede">A broken website loses customers quietly. A rushed project loses marks loudly. A mismatched brand just looks unfinished, everywhere, all the time.</p>
          </div>
          <div className="problem-grid">
            {PROBLEMS.map((p, i) => (
              <div className="problem-card reveal in" key={i}>
                <span className="num">0{i + 1}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
          <div className="problem-cost reveal in">
            <span style={{ fontSize: '1.6rem' }}>⚠️</span>
            <div>
              <strong>The real cost:</strong>
              <p style={{ margin: 0 }}>Lost enquiries, lost marks, or lost credibility — all fixable before the deadline, not after.</p>
            </div>
          </div>
          <div className="center reveal in" style={{ marginTop: '40px' }}>
            <Link href="/estimate" className="btn btn-primary">Fix This Before It Costs You More &rarr;</Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '12px' }}>Takes exactly 30 seconds to get your price.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="solution">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="eyebrow">what-you-get</div>
            <h2>Everything built around one goal: it has to work.</h2>
            <p className="lede">Eight things that separate a Bro's WebStudio delivery from a generic freelance job.</p>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <div className="feat-card reveal in" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
                <div className="feat-value">{f.v}</div>
              </div>
            ))}
          </div>
          <div className="center reveal in" style={{ marginTop: '50px' }}>
            <Link href="/estimate" className="btn btn-yellow">I Want This Premium Experience &rarr;</Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '12px' }}>No upfront commitments. Just clear pricing.</p>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">how-it-works</div>
            <h2>From inquiry to delivery, in five stages.</h2>
          </div>
          <div className="steps">
            <div className="steps-row">
              {STEPS.map((s, i) => (
                <div className="step reveal in" key={i}>
                  <div className="step-dot">{i + 1}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="center reveal in" style={{ marginTop: '50px' }}>
            <Link href="/estimate" className="btn btn-primary">Start Step 1: Let's Scope Your Project &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Why Us Section — Home page only */}
      <section className="why-us" id="why-us">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '640px', margin: '0 auto 56px' }}>
            <div className="eyebrow" style={{ color: 'var(--yellow)', opacity: 1 }}>why-us</div>
            <h2 style={{ color: 'var(--paper)' }}>6 reasons clients keep coming back.</h2>
            <p className="lede" style={{ color: 'rgba(255,255,255,0.55)' }}>Fast &amp; cheap is everywhere. Here's what actually makes the difference when your name is on the line.</p>
          </div>

          <div className="why-grid">
            <div className="why-card reveal in">
              <span className="why-num">01</span>
              <div className="why-icon">🎯</div>
              <h3>Fixed Price. Always.</h3>
              <p>Use our live estimator and pay exactly what it shows — no mid-project invoice surprises, ever.</p>
              <span className="why-tag">No hidden fees</span>
            </div>
            <div className="why-card reveal in">
              <span className="why-num">02</span>
              <div className="why-icon">⚡</div>
              <h3>3–15 Day Delivery</h3>
              <p>Real deadlines set upfront. Staging-link updates as we build — never ghost mode until "done".</p>
              <span className="why-tag">Launch on time</span>
            </div>
            <div className="why-card reveal in">
              <span className="why-num">03</span>
              <div className="why-icon">👨‍💻</div>
              <h3>Talk to the Actual Builder</h3>
              <p>No account managers or relay chains. WhatsApp the developer physically writing your code.</p>
              <span className="why-tag">Zero friction</span>
            </div>
            <div className="why-card reveal in">
              <span className="why-num">04</span>
              <div className="why-icon">📄</div>
              <h3>Walkthroughs, Not Just Files</h3>
              <p>College projects include viva prep, PPTs and a guided walkthrough so you can defend it yourself.</p>
              <span className="why-tag">Own your project</span>
            </div>
            <div className="why-card reveal in">
              <span className="why-num">05</span>
              <div className="why-icon">🔄</div>
              <h3>Revisions Are Included</h3>
              <p>Every plan ships with real revision rounds — not a "pay again" situation. Iterate until it's right.</p>
              <span className="why-tag">Get it perfect</span>
            </div>
            <div className="why-card reveal in">
              <span className="why-num">06</span>
              <div className="why-icon">🛡️</div>
              <h3>Post-Launch Safety Net</h3>
              <p>A dedicated support window after every handover for bugs and tweaks — at zero extra charge.</p>
              <span className="why-tag">Never abandoned</span>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="why-vs">
            <div className="why-vs-row why-vs-header">
              <span>Feature</span>
              <span className="why-vs-us">Bro&apos;s WebStudio</span>
              <span>Typical Freelancer</span>
              <span>Agency</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Upfront fixed pricing</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell no">✗</span>
              <span className="why-vs-cell no">✗</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Delivery within 15 days</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell maybe">Sometimes</span>
              <span className="why-vs-cell no">✗</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Viva prep &amp; documentation</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell no">✗</span>
              <span className="why-vs-cell no">✗</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Direct developer access</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell maybe">Sometimes</span>
              <span className="why-vs-cell no">✗</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Revisions included in price</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell maybe">Sometimes</span>
              <span className="why-vs-cell maybe">Sometimes</span>
            </div>
            <div className="why-vs-row">
              <span className="why-vs-feat">Post-launch support window</span>
              <span className="why-vs-cell yes">✓</span>
              <span className="why-vs-cell no">Rare</span>
              <span className="why-vs-cell yes">✓</span>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section section-alt" id="testimonials">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="eyebrow">client-stories</div>
            <h2>Clients who trusted us. Results that spoke.</h2>
            <p className="lede">Real people, real deadlines — delivered on time, every time.</p>
          </div>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">&ldquo;Got my MERN project done in 5 days. The code was clean, the documentation was spot on, and I aced my viva. Totally worth it!&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">R</div>
                <div>
                  <div className="testi-name">Rahul S.</div>
                  <div className="testi-role">BCA Final Year, Delhi</div>
                </div>
              </div>
            </div>
            <div className="testi-card testi-card-featured">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">&ldquo;They built our restaurant&apos;s website in under a week. We went from zero online presence to getting direct orders. The design looks premium — exactly what we needed.&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">A</div>
                <div>
                  <div className="testi-name">Amit K.</div>
                  <div className="testi-role">Restaurant Owner, Noida</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">&ldquo;Our brand logo and social media kit came out better than we imagined. Super professional, fast turnaround, and they actually listened to our brief.&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">P</div>
                <div>
                  <div className="testi-name">Priya M.</div>
                  <div className="testi-role">Startup Founder, Gurugram</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '640px', margin: '0 auto', marginBottom: '40px' }}>
            <div className="eyebrow">transparent-pricing</div>
            <h2>Premium quality. Upfront pricing.</h2>
            <p className="lede">No hidden fees, no "contact for quote" games. Choose a starting point and build exactly what you need.</p>
          </div>
          
          <div className="pricing-grid">
            {/* Starter Box */}
            <div className="pricing-card">
              <h3>Starter</h3>
              <p className="desc">Perfect for small businesses and college minors.</p>
              <div className="price">
                <span className="from">From</span>
                <span className="amt">₹2,999</span>
              </div>
              <ul className="features">
                <li><span className="chk">✓</span> Custom design / functional app</li>
                <li><span className="chk">✓</span> Mobile responsive layout</li>
                <li><span className="chk">✓</span> Essential documentation</li>
                <li><span className="chk">✓</span> 1 revision round</li>
              </ul>
              <Link href="/estimate?service=college" className="btn btn-outline btn-block">Calculate My Price</Link>
            </div>

            {/* Standard Box */}
            <div className="pricing-card popular">
              <div className="badge">Most Popular</div>
              <h3>Standard</h3>
              <p className="desc">Ideal for professional portfolios and agencies.</p>
              <div className="price">
                <span className="from">From</span>
                <span className="amt">₹4,999</span>
              </div>
              <ul className="features">
                <li><span className="chk">✓</span> 1-3 custom designed pages</li>
                <li><span className="chk">✓</span> Contact form & integrations</li>
                <li><span className="chk">✓</span> Basic on-page SEO setup</li>
                <li><span className="chk">✓</span> 1 month free support</li>
              </ul>
              <Link href="/estimate?service=business" className="btn btn-yellow btn-block">Calculate My Price</Link>
            </div>

            {/* Premium Box */}
            <div className="pricing-card">
              <h3>Premium</h3>
              <p className="desc">Full-scale e-commerce and major projects.</p>
              <div className="price">
                <span className="from">From</span>
                <span className="amt">₹10,999</span>
              </div>
              <ul className="features">
                <li><span className="chk">✓</span> Unlimited pages & products</li>
                <li><span className="chk">✓</span> Payment gateway integration</li>
                <li><span className="chk">✓</span> Custom admin dashboard</li>
                <li><span className="chk">✓</span> Advanced SEO & animations</li>
              </ul>
              <Link href="/estimate?service=business&addon=ecom,payment" className="btn btn-outline btn-block">Calculate My Price</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">faqs</div>
            <h2>Questions people ask before starting.</h2>
          </div>
          <FaqAccordion faqs={FAQS_HOME} />
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="cta-band">
            <div className="cta-band-glow"></div>
            <div className="eyebrow" style={{ color: 'var(--ink)', opacity: 0.7 }}>start-here</div>
            <h2>Got a deadline? Let&apos;s not waste it.</h2>
            <p>Build your estimate in 30 seconds — no calls, no commitments, just a clear price.</p>
            <div className="cta-band-actions">
              <Link href="/estimate" className="btn btn-primary">Build My Free Estimate →</Link>
              <a href="https://wa.me/918368079768" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </div>
            <div className="cta-band-trust">
              <span>✓ No upfront payment</span>
              <span>✓ Reply within 2 hours</span>
              <span>✓ Fixed price, no surprises</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { Metadata } from 'next';
import Estimator from '../../components/Estimator';
import ExitIntentPopup from '../../components/ExitIntentPopup';
import FaqAccordion from '../../components/FaqAccordion';

export const metadata: Metadata = {
  title: 'Calculate Your Price | Bro\'s WebStudio',
  description: 'Use our live project estimator to see your exact price before you commit.',
  alternates: {
    canonical: '/estimate',
  },
};

const PRICING_FAQS = [
  {
    q: "Do I have to pay the full amount upfront?",
    a: "No. We typically work on a milestone basis (e.g., 50% upfront, 50% on completion). The exact breakdown will be discussed when you submit your estimate."
  },
  {
    q: "Are there any hidden costs?",
    a: "None. The price you see in the estimator is the exact price you pay for the selected features. If you need something outside the scope, we will quote it clearly before starting."
  },
  {
    q: "What if I need a custom feature not listed here?",
    a: "No problem! Just build the estimate as close as possible to your needs, and mention the custom features in the details box before submitting. We'll adjust the quote manually."
  }
];

export default function EstimatePage() {
  return (
    <div className="page">

      {/* ── Dark Hero Header ── */}
      <section style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        padding: '60px 0 70px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'var(--yellow)', opacity: 0.08,
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ color: 'var(--yellow)' }}>interactive-estimator</div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            color: 'var(--paper)',
            marginBottom: '16px',
            maxWidth: '700px',
          }}>
            Build your exact quote.{' '}
            <span style={{ color: 'var(--yellow)' }}>No hidden fees.</span>
          </h1>
          <p style={{
            color: '#c7c7c2', fontSize: '1.08rem',
            maxWidth: '520px', marginBottom: '36px', lineHeight: 1.7,
          }}>
            Select a service, pick your base package, and add custom features.
            The price updates live — know your cost before you commit.
          </p>
          {/* Trust pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: '⚡', label: 'Instant price — no waiting' },
              { icon: '🎯', label: 'Fixed deadlines, always' },
              { icon: '🤝', label: 'Direct developer access' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '0.88rem',
                color: '#c7c7c2',
              }}>
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Estimator Section ── */}
      <section className="section" style={{ paddingTop: '72px', paddingBottom: '80px', background: 'var(--paper)' }}>
        <div className="wrap">
          <div className="estimate-split">

            {/* Left: Sticky context panel */}
            <div className="estimate-content">
              <div style={{
                background: 'var(--paper-warm)',
                border: '1px solid var(--gray-line)',
                borderRadius: '20px',
                padding: '36px 32px',
                position: 'sticky',
                top: '100px',
              }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>How it works</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { step: '01', title: 'Pick a service', desc: 'Choose from Websites, College Projects, or Graphic Design.' },
                    { step: '02', title: 'Add features', desc: 'Select your base package and any add-ons you need.' },
                    { step: '03', title: 'See your price', desc: 'Total updates live — no form, no waiting.' },
                    { step: '04', title: 'Submit & start', desc: 'Log in, confirm, and we begin within 24 hours.' },
                  ].map((item) => (
                    <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'var(--yellow)', color: 'var(--ink)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700,
                        flexShrink: 0,
                      }}>{item.step}</div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--ink)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--gray)', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: '32px', paddingTop: '24px',
                  borderTop: '1px solid var(--gray-line)',
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)', fontFamily: 'var(--mono)', marginBottom: '12px', letterSpacing: '0.05em' }}>GUARANTEED</div>
                  {[
                    'Fixed price — no surprise bills',
                    '2 free revision rounds',
                    '3–15 day delivery window',
                    'Direct WhatsApp support',
                  ].map((g) => (
                    <div key={g} style={{
                      display: 'flex', gap: '10px', alignItems: 'center',
                      fontSize: '0.92rem', color: 'var(--ink-soft)',
                      marginBottom: '10px',
                    }}>
                      <span style={{ color: 'var(--yellow-deep)', fontWeight: 700 }}>✓</span>
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Estimator wizard */}
            <div className="estimate-interactive">
              <Estimator />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing FAQs ── */}
      <section className="section-tight section-alt" style={{ borderTop: '1px solid var(--gray-line)' }}>
        <div className="wrap">
          <div className="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="eyebrow">pricing-faqs</div>
            <h2>Common questions about our pricing.</h2>
          </div>
          <FaqAccordion faqs={PRICING_FAQS} />
        </div>
      </section>

      <ExitIntentPopup />
    </div>
  );
}

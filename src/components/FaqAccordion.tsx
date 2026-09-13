'use client';
import { useState } from 'react';

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
          <button className="faq-q" onClick={() => toggleFaq(i)}>
            {f.q}
            <span className="plus">+</span>
          </button>
          <div className="faq-a">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

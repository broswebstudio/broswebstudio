'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if it's a touch device, if so, don't use custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive') ||
        target.closest('.est-option') ||
        target.closest('.est-tab')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (!isClient) return null;
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          body, button, a, input, select, textarea, .est-option, .est-tab {
            cursor: none !important;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: `translate(${position.x - 18}px, ${position.y - 18}px) scale(${isHovering ? 1.5 : 1})`,
          backgroundColor: isHovering ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
          border: '1.5px solid rgba(250, 204, 21, 0.8)',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease, border-color 0.2s ease',
          zIndex: 999999,
          boxShadow: isHovering ? '0 0 15px rgba(250, 204, 21, 0.4)' : 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#facc15',
          pointerEvents: 'none',
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          zIndex: 1000000,
          boxShadow: '0 0 10px #facc15',
          transition: 'transform 0.05s linear',
        }}
      />
    </>
  );
}

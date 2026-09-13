"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logActivity } from "@/lib/tracking";

export default function ActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log page visit
    logActivity("page_view", { url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "") });

    // Track clicks on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const closestInteractive = target.closest('a, button, input[type="checkbox"]');
      if (closestInteractive) {
        let text = closestInteractive.textContent?.trim() || "";
        let type = "click";
        
        if (target.tagName.toLowerCase() === 'input' && (target as HTMLInputElement).type === 'checkbox') {
          type = "estimator_interaction";
          text = target.parentElement?.textContent?.trim() || "checkbox";
        }

        // Don't log clicks that don't have text or a meaningful target
        if (text) {
          logActivity(type, {
            text: text.substring(0, 50),
            id: closestInteractive.id || undefined,
          });
        }
      }
    };

    document.addEventListener("click", handleClick);

    // Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        } else {
          entry.target.classList.remove('in'); // Allows re-animating when scrolling back up
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    // Find all elements with .reveal and remove the hardcoded .in if present, then observe
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      el.classList.remove('in');
      observer.observe(el);
    });

    return () => {
      document.removeEventListener("click", handleClick);
      observer.disconnect();
    };
  }, [pathname, searchParams]);

  return null;
}

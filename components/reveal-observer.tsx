'use client';

import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';

export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const observedElements = new Set<HTMLElement>();

    const reveal = (element: HTMLElement) => {
      element.classList.add('is-revealed');
      observer?.unobserve(element);
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) reveal(entry.target as HTMLElement);
              });
            },
            { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
          )
        : null;

    const register = (element: HTMLElement) => {
      if (observedElements.has(element)) return;
      observedElements.add(element);

      const rect = element.getBoundingClientRect();
      if (!observer || rect.top < window.innerHeight * 0.94) reveal(element);
      else observer.observe(element);
    };

    const registerTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches(REVEAL_SELECTOR)) register(node);
      node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register);
    };

    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(register);
    root.classList.add('reveal-ready');

    const mutations = new MutationObserver((entries) => {
      entries.forEach((entry) => entry.addedNodes.forEach(registerTree));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer?.disconnect();
      root.classList.remove('reveal-ready');
      observedElements.clear();
    };
  }, []);

  return null;
}

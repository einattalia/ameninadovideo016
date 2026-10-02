'use client';
import { useEffect, useRef } from 'react';

/** Scroll-linked art direction without rerendering the React tree or intercepting scrolling. */
export function ScrollMotion() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    const initialize = () => {
      dispose();
      if (preference.matches) return;
      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const animations = new Set<Animation>();
      const revealed = new WeakSet<Element>();
      const targets = document.querySelectorAll<HTMLElement>(
        '.section-meta, .heading-row, .work, .category-list a, .about-copy > *, .about blockquote, .clients > p, .client-line, .social h2, .social-images a, .contact h2, .contact-bottom, .contact-links, .project-description, .project-gallery img, .project-details, .other-projects a'
      );
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || revealed.has(entry.target)) continue;
          revealed.add(entry.target);
          const el = entry.target as HTMLElement;
          const isTitle = el.matches('.heading-row, .social h2, .contact h2, .about blockquote');
          const siblingIndex = Array.from(el.parentElement?.children || []).indexOf(el);
          const delay = el.matches('.category-list a, .social-images a, .about-copy > *')
            ? Math.min(siblingIndex * 55, 240) : 0;
          const animation = el.animate([
            { opacity: 0, transform: `translateY(${mobile ? 20 : isTitle ? 55 : 35}px)`, ...(isTitle ? {clipPath:'inset(0 0 100% 0)'} : {}) },
            { opacity: 1, transform: 'translateY(0)', ...(isTitle ? {clipPath:'inset(0 0 0% 0)'} : {}) }
          ], { duration: isTitle ? 1050 : 800, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
          animations.add(animation);
          animation.finished.then(() => animations.delete(animation)).catch(() => {});
          observer.unobserve(el);
        }
      }, { threshold: .12, rootMargin: '0px 0px -25px 0px' });
      targets.forEach(el => observer.observe(el));
      const images = Array.from(document.querySelectorAll<HTMLElement>('.reel-poster, .work-image, .category-visual, .about-image, .social-images a'));
      const visibleImages = new Set<HTMLElement>();
      const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? visibleImages.add(entry.target as HTMLElement) : visibleImages.delete(entry.target as HTMLElement));
        schedule();
      }, {rootMargin:'120px'});
      images.forEach(el => imageObserver.observe(el));
      const hero = document.querySelector<HTMLElement>('.hero');
      const heroTitle = document.querySelector<HTMLElement>('.hero-title');
      const heroImage = document.querySelector<HTMLElement>('.hero-image');
      let frame = 0;
      function paint() {
        frame = 0;
        const height = window.innerHeight;
        const length = document.documentElement.scrollHeight - height;
        if (progress.current) progress.current.style.transform = `scaleX(${length > 0 ? window.scrollY / length : 0})`;
        for (const el of visibleImages) {
          const box = el.getBoundingClientRect();
          const distance = Math.max(-1, Math.min(1, (box.top + box.height / 2 - height / 2) / height));
          el.style.setProperty('--parallax', `${distance * (mobile ? -16 : -48)}px`);
        }
        if (hero && heroTitle && heroImage) {
          const distance = Math.max(0, -hero.getBoundingClientRect().top);
          const ratio = Math.min(1, distance / hero.offsetHeight);
          heroTitle.style.translate = `0 ${distance * (mobile ? .12 : .24)}px`;
          heroTitle.style.opacity = String(Math.max(0, 1 - ratio * 1.45));
          heroImage.style.translate = `0 ${distance * (mobile ? .15 : .32)}px`;
        }
      }
      function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
      window.addEventListener('scroll', schedule, {passive:true});
      window.addEventListener('resize', schedule, {passive:true});
      schedule();
      dispose = () => {
        observer.disconnect(); imageObserver.disconnect();
        window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
        cancelAnimationFrame(frame); animations.forEach(a => a.cancel());
        images.forEach(el => el.style.removeProperty('--parallax'));
        if (heroTitle) { heroTitle.style.removeProperty('translate'); heroTitle.style.removeProperty('opacity'); }
        heroImage?.style.removeProperty('translate');
        if (progress.current) progress.current.style.transform = 'scaleX(0)';
      };
    };
    initialize();
    preference.addEventListener('change', initialize);
    return () => { dispose(); preference.removeEventListener('change', initialize); };
  }, []);
  return <div className="scroll-progress" ref={progress} aria-hidden="true" />;
}

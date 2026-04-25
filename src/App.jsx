import React, { useCallback, useEffect, useRef, useState } from 'react';
import Hero from './Hero';
import Cast from './Cast';
import Schedule from './Schedule';
import Details from './Details';
import Honeymoon from './Honeymoon';
import RSVP from './RSVP';
import Navigation from './Navigation';
import './App.css';

/** One source of truth for horizontal order — Curtain Call (honeymoon) is always last. */
const STREAM_SLIDES = [
  { key: 'cover', pageId: null, cover: true, Content: Hero },
  { key: 'cast', pageId: 'the-cast', cover: false, Content: Cast },
  { key: 'program', pageId: 'the-program', cover: false, Content: Schedule },
  { key: 'setting', pageId: 'the-setting', cover: false, Content: Details },
  { key: 'box-office', pageId: 'box-office', cover: false, Content: RSVP },
  { key: 'honeymoon', pageId: 'honeymoon-fund', cover: false, Content: Honeymoon },
];

/** Hide floating chrome after this long with no input (ms). */
const FLOATING_UI_IDLE_MS = 2000;
/** Avoid resetting the idle timer on every pointermove frame. */
const FLOATING_UI_MOVE_THROTTLE_MS = 200;

function App() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [floatingUiIdle, setFloatingUiIdle] = useState(false);
  const floatingIdleTimerRef = useRef(null);
  const lastMoveWakeRef = useRef(0);

  const scheduleFloatingUiHide = useCallback(() => {
    if (floatingIdleTimerRef.current) {
      window.clearTimeout(floatingIdleTimerRef.current);
    }
    floatingIdleTimerRef.current = window.setTimeout(() => {
      setFloatingUiIdle(true);
    }, FLOATING_UI_IDLE_MS);
  }, []);

  const wakeFloatingUi = useCallback(() => {
    setFloatingUiIdle(false);
    scheduleFloatingUiHide();
  }, [scheduleFloatingUiHide]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // Add small buffer for pixel rounding issues on high DPI screens
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);

    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const totalPages = STREAM_SLIDES.length;
  
  const scrollByPage = (direction) => {
    if (containerRef.current) {
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, totalPages - 1));
      containerRef.current.children[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  useEffect(() => {
    // Observer for fade-reveal animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.playbill-section').forEach(el => {
      el.classList.add('fade-reveal');
      animationObserver.observe(el);
    });

    // Handle scroll check on load and resize
    handleScroll();
    window.addEventListener('resize', handleScroll);

    return () => {
      animationObserver.disconnect();
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const pages = Array.from(containerRef.current.children);
    pages.forEach((page, idx) => {
      if (idx !== activeIndex) {
        page.scrollTop = 0;
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    scheduleFloatingUiHide();

    const onWake = () => wakeFloatingUi();

    const onPointerMove = () => {
      const now = Date.now();
      if (now - lastMoveWakeRef.current < FLOATING_UI_MOVE_THROTTLE_MS) return;
      lastMoveWakeRef.current = now;
      wakeFloatingUi();
    };

    const opts = { capture: true, passive: true };
    window.addEventListener('pointerdown', onWake, opts);
    window.addEventListener('pointermove', onPointerMove, opts);
    window.addEventListener('keydown', onWake);
    window.addEventListener('wheel', onWake, opts);
    window.addEventListener('touchstart', onWake, opts);
    window.addEventListener('focusin', onWake);

    const stream = containerRef.current;
    stream?.addEventListener('scroll', onWake, opts);

    return () => {
      window.removeEventListener('pointerdown', onWake, opts);
      window.removeEventListener('pointermove', onPointerMove, opts);
      window.removeEventListener('keydown', onWake);
      window.removeEventListener('wheel', onWake, opts);
      window.removeEventListener('touchstart', onWake, opts);
      window.removeEventListener('focusin', onWake);
      stream?.removeEventListener('scroll', onWake, opts);
      if (floatingIdleTimerRef.current) {
        window.clearTimeout(floatingIdleTimerRef.current);
      }
    };
  }, [wakeFloatingUi, scheduleFloatingUiHide]);

  return (
    <div className={`playbill-theme${floatingUiIdle ? ' is-floating-ui-idle' : ''}`}>
      
      <Navigation />

      {/* Floating navigation arrows */}
      <div className="nav-arrows">
        {canScrollLeft ? (
          <button className="nav-arrow left" onClick={() => scrollByPage(-1)} aria-label="Previous Page">❮</button>
        ) : <div style={{width: 58}}></div>}
        
        {canScrollRight ? (
          <button className="nav-arrow right" onClick={() => scrollByPage(1)} aria-label="Next Page">❯</button>
        ) : <div style={{width: 58}}></div>}
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {STREAM_SLIDES.map((_, idx) => (
          <button 
            key={idx} 
            className={`dot${idx === activeIndex ? " active" : ""}`}
            onClick={() => {
              containerRef.current.children[idx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>

      <div className="pdf-stream" ref={containerRef} onScroll={handleScroll}>
        {STREAM_SLIDES.map((slide) => {
          const SlideContent = slide.Content;
          return (
            <div
              key={slide.key}
              id={slide.pageId ?? undefined}
              className={`playbill-page${slide.cover ? ' playbill-cover-page' : ''}`}
            >
              <SlideContent />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

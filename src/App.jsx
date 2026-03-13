import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Cast from './Cast';
import Schedule from './Schedule';
import Details from './Details';
import Honeymoon from './Honeymoon';
import RSVP from './RSVP';
import Navigation from './Navigation';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // Add small buffer for pixel rounding issues on high DPI screens
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
  };

  const scrollByPage = (direction) => {
    if (containerRef.current) {
      // 100vw is precisely the width of one page/flex-item due to flex: 0 0 100vw
      containerRef.current.scrollBy({ left: direction * window.innerWidth, behavior: 'smooth' });
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

    document.querySelectorAll('.fade-reveal').forEach(el => animationObserver.observe(el));

    // Handle scroll check on load and resize
    handleScroll();
    window.addEventListener('resize', handleScroll);

    return () => {
      animationObserver.disconnect();
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="playbill-theme">
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

      <div className="pdf-stream" ref={containerRef} onScroll={handleScroll}>
        <div className="playbill-page playbill-cover-page">
          <Hero />
          <div className="scroll-indicator" aria-hidden="true"><span>→</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-cast">
          <Cast />
          <div className="page-footer">- 1 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>→</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-program">
          <Schedule />
          <div className="page-footer">- 2 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>→</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-setting">
          <Details />
          <div className="page-footer">- 3 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>→</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="honeymoon-fund">
          <Honeymoon />
          <div className="page-footer">- 4 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>→</span></div>
        </div>

        {/* Final page has NO indicator */}
        <div className="playbill-page fade-reveal" id="box-office">
          <RSVP />
          <footer className="playbill-footer">
            <p>&mdash; END &mdash;</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;

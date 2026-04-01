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
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    // Add small buffer for pixel rounding issues on high DPI screens
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);

    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const totalPages = 6;
  
  const scrollByPage = (direction) => {
    if (containerRef.current) {
      const nextIndex = Math.max(0, Math.min(activeIndex + direction, totalPages - 1));
      containerRef.current.children[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const scrollToPage = (index) => {
    if (containerRef.current) {
      containerRef.current.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
        </div>

        <div className="playbill-page" id="the-cast">
          <Cast />
        </div>

        <div className="playbill-page" id="the-program">
          <Schedule />
        </div>

        <div className="playbill-page" id="the-setting">
          <Details />
        </div>

        <div className="playbill-page" id="honeymoon-fund">
          <Honeymoon />
        </div>

        {/* Final page has NO indicator */}
        <div className="playbill-page" id="box-office">
          <RSVP />
        </div>
      </div>
    </div>
  );
}

export default App;

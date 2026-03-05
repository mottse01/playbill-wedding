import React, { useEffect, useState, useRef } from 'react';
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
  const [showIndicator, setShowIndicator] = useState(true);
  const rsvpRef = useRef(null);

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

    // Observer specifically for the final RSVP page to hide the scroll indicator
    const indicatorObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Hide indicator if the RSVP section is taking up most of the screen
        if (entry.isIntersecting) {
          setShowIndicator(false);
        } else {
          setShowIndicator(true);
        }
      });
    }, { threshold: 0.4 }); // Trigger when 40% of the RSVP page is visible

    if (rsvpRef.current) {
      indicatorObserver.observe(rsvpRef.current);
    }

    return () => {
      animationObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, []);

  return (
    <div className="playbill-theme">
      <Navigation />

      {/* Global Scroll Indicator */}
      {showIndicator && (
        <div className="global-scroll-indicator" aria-hidden="true">
          <span>↓</span>
        </div>
      )}

      <div className="pdf-stream">
        <div className="playbill-page playbill-cover-page">
          <Hero />
        </div>

        <div className="playbill-page fade-reveal" id="the-cast">
          <Cast />
          <div className="page-footer">- 1 -</div>
        </div>

        <div className="playbill-page fade-reveal" id="the-program">
          <Schedule />
          <div className="page-footer">- 2 -</div>
        </div>

        <div className="playbill-page fade-reveal" id="the-setting">
          <Details />
          <div className="page-footer">- 3 -</div>
        </div>

        <div className="playbill-page fade-reveal" id="honeymoon-fund">
          <Honeymoon />
          <div className="page-footer">- 4 -</div>
        </div>

        {/* Attach ref to the final page to trigger indicator hiding */}
        <div className="playbill-page fade-reveal" id="box-office" ref={rsvpRef}>
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

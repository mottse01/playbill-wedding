import React, { useEffect } from 'react';
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

    return () => {
      animationObserver.disconnect();
    };
  }, []);

  return (
    <div className="playbill-theme">
      <Navigation />

      <div className="pdf-stream">
        <div className="playbill-page playbill-cover-page">
          <Hero />
          <div className="scroll-indicator" aria-hidden="true"><span>↓</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-cast">
          <Cast />
          <div className="page-footer">- 1 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>↓</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-program">
          <Schedule />
          <div className="page-footer">- 2 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>↓</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="the-setting">
          <Details />
          <div className="page-footer">- 3 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>↓</span></div>
        </div>

        <div className="playbill-page fade-reveal" id="honeymoon-fund">
          <Honeymoon />
          <div className="page-footer">- 4 -</div>
          <div className="scroll-indicator" aria-hidden="true"><span>↓</span></div>
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

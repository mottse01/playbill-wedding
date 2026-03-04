import React, { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Cast from './Cast';
import Schedule from './Schedule';
import Details from './Details';
import Honeymoon from './Honeymoon';
import RSVP from './RSVP';
import './App.css';

function App() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once it's visible, we can stop observing it
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-reveal');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pdf-stream playbill-theme">
      {/* Page 1: Cover image */}
      <div className="playbill-page playbill-cover-page">
        <Hero />
      </div>

      {/* Page 2: Cast List */}
      <div className="playbill-page fade-reveal">
        <Cast />
        <div className="page-footer">- 1 -</div>
      </div>

      {/* Page 3: Schedule */}
      <div className="playbill-page fade-reveal">
        <Schedule />
        <div className="page-footer">- 2 -</div>
      </div>

      {/* Page 4: Details */}
      <div className="playbill-page fade-reveal">
        <Details />
        <div className="page-footer">- 3 -</div>
      </div>

      {/* Page 5: Honeymoon Fund */}
      <div className="playbill-page fade-reveal">
        <Honeymoon />
        <div className="page-footer">- 4 -</div>
      </div>

      {/* Page 6: RSVP Form */}
      <div className="playbill-page fade-reveal">
        <RSVP />
        <footer className="playbill-footer">
          <p>&mdash; END &mdash;</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

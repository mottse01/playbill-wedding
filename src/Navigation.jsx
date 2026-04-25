import React, { useState } from 'react';
import './Navigation.css';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollTo = (id) => {
        const stream = document.querySelector('.pdf-stream');
        const page = stream?.querySelector(`:scope > .playbill-page#${CSS.escape(id)}`);
        if (stream && page) {
            // offsetLeft is not relative to .pdf-stream; align like scroll-snap / nav arrows
            page.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                className={`menu-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            <nav className={`playbill-nav ${isOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    <li><button onClick={() => scrollTo('the-cast')}>THE CAST</button></li>
                    <li><button onClick={() => scrollTo('the-program')}>THE PROGRAM</button></li>
                    <li><button onClick={() => scrollTo('the-setting')}>THE SETTING</button></li>
                    <li><button onClick={() => scrollTo('box-office')} className="rsvp-btn">BOX OFFICE</button></li>
                    <li><button onClick={() => scrollTo('honeymoon-fund')}>CURTAIN CALL</button></li>
                </ul>
            </nav>
            {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
}

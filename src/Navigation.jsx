import React from 'react';
import './Navigation.css';

export default function Navigation() {
    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="playbill-nav">
            <ul className="nav-links">
                <li><button onClick={() => scrollTo('the-cast')}>The Cast</button></li>
                <li><button onClick={() => scrollTo('the-program')}>The Program</button></li>
                <li><button onClick={() => scrollTo('the-setting')}>The Setting</button></li>
                <li><button onClick={() => scrollTo('honeymoon-fund')}>Curtain Call</button></li>
                <li><button onClick={() => scrollTo('box-office')} className="rsvp-btn">Box Office</button></li>
            </ul>
        </nav>
    );
}

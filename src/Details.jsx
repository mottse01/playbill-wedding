import React from 'react';
import './Details.css';

export default function Details() {
    return (
        <section className="playbill-section details-section">
            <h2 className="section-title">The Setting</h2>

            <div className="details-content">
                <div className="detail-block">
                    <h3>The Venue</h3>
                    <p><strong>The Mott Farm</strong></p>
                    <img
                        src="/mott-farm-sign.png"
                        alt="The Mott Farm sign at sunset"
                        className="venue-photo"
                        loading="lazy"
                        decoding="async"
                    />
                    <p>We are thrilled to invite you to our celebration. The ceremony and reception will be held at The Mott Farm located at 280 Sycamore Lane, Biglerville, PA 17325.</p>

                    <div className="directions-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                        <a
                            href="https://maps.apple.com/?q=280+Sycamore+Lane,+Biglerville,+PA+17325"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="utility-btn"
                        >
                            Apple Maps
                        </a>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=280+Sycamore+Lane,+Biglerville,+PA+17325"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="utility-btn"
                        >
                            Google Maps
                        </a>
                    </div>
                </div>

                <div className="detail-block">
                    <h3>Accommodations</h3>
                    <p>Information regarding hotel blocks is currently <strong>TBD</strong>. Please check back soon for updates!</p>
                </div>

                <div className="detail-block">
                    <h3>Dress Code</h3>
                    <p><em>Formal</em></p>
                    <p>Dress to impress. Please note that the ceremony will take place outside on the grass, so stilettos or high heels may not be suitable.</p>
                </div>
            </div>
        </section>
    );
}

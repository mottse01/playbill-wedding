import React from 'react';
import './Details.css';

export default function Details() {
    return (
        <section id="the-setting" className="playbill-section details-section">
            <h2 className="section-title">The Setting</h2>

            <div className="details-content">
                <div className="detail-block">
                    <h3>The Venue</h3>
                    <p><strong>The Mott Farm</strong></p>
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
                    <p>A block of rooms has been reserved at The Grand Hotel. Please use our booking link to secure the group rate.</p>
                    <button className="utility-btn">Book a Room</button>
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

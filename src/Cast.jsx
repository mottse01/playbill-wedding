import React from 'react';
import './Cast.css';

const castMembers = [
    { name: 'Sean Mott', role: 'The Groom', bio: 'Sean is starring in his biggest role yet.' },
    { name: 'Desiree', role: 'The Bride', bio: 'Desiree is ready for her close-up.' },
    // Add wedding party here
];

export default function Cast() {
    return (
        <section id="the-cast" className="playbill-section cast-section">
            <h2 className="section-title">Who's Who in the Cast</h2>
            <div className="cast-grid">
                {castMembers.map((member, idx) => (
                    <div key={idx} className="cast-member">
                        <div className="headshot-placeholder"></div>
                        <div className="cast-info">
                            <h3 className="cast-name">{member.name}</h3>
                            <p className="cast-role">{member.role}</p>
                            <p className="cast-bio">{member.bio}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="gallery-section">
                <div className="gallery-header">
                    <h2 className="section-title">Production Stills</h2>
                    <p className="gallery-subtitle">A sneak peek at the leading couple's favorite moments.</p>
                </div>
                <div className="photo-grid">
                    <div className="photo-item"><img src="/engagement_1.png" alt="Engagement Still 1" /></div>
                    <div className="photo-item"><img src="/engagement_2.png" alt="Engagement Still 2" /></div>
                    <div className="photo-item"><img src="/engagement_3.png" alt="Engagement Still 3" /></div>
                </div>
            </div>
        </section>
    );
}

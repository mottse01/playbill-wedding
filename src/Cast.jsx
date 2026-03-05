import React from 'react';
import './Cast.css';

const castMembers = [
    { name: 'Sean Mott', role: 'The Groom', bio: 'Sean is starring in his biggest role yet.' },
    { name: 'Desiree', role: 'The Bride', bio: 'Desiree is ready for her close-up.' },
    // Add wedding party here
];

const engagementPhotos = [
    '/engagement_1.jpg',
    '/engagement_2.jpg',
    '/engagement_3.jpg',
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
                    <p className="gallery-subtitle">A sneak peek at the leading couple's favorite moments.</p>
                </div>
                <div className="photo-carousel">
                    {engagementPhotos.map((photo, idx) => (
                        <div key={idx} className="photo-item">
                            <img src={photo} alt={`Engagement Still ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import './Cast.css';

const castMembers = [
    { name: 'Desiree Bernavel', role: 'The Bride', bio: 'Desi is ready for her close-up.', image: '/sean.jpg' },
    { name: 'Sean Mott', role: 'The Groom', bio: 'Sean is starring in his biggest role yet.', image: '/desiree.jpg' },
    // Add wedding party here
];

const imageStem = (path) => path.replace('/', '').replace(/\.[^.]+$/, '');

// Keep this explicit so missing files do not create broken slides.
const engagementPhotos = [
    'engagement_1',
    'engagement_2',
    'engagement_3',
    'engagement_4',
    'engagement_5',
    'engagement_7',
    'engagement_8',
    'engagement_9',
    'engagement_10',
    'engagement_11',
    'engagement_12',
    'engagement_13',
    'engagement_15',
    'engagement_16',
    'engagement_17',
    'engagement_18',
    'engagement_19',
    'engagement_20',
    'engagement_21',
    'engagement_22',
    'engagement_23',
];

export default function Cast() {
    return (
        <section className="playbill-section cast-section">
            <h2 className="section-title">Who's Who in the Cast</h2>
            <div className="cast-grid">
                {castMembers.map((member, idx) => (
                    <div key={idx} className="cast-member">
                        {member.image ? (
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={`/optimized/${imageStem(member.image)}-120.avif 120w, /optimized/${imageStem(member.image)}-240.avif 240w`}
                                    sizes="(max-width: 600px) 160px, 120px"
                                />
                                <source
                                    type="image/webp"
                                    srcSet={`/optimized/${imageStem(member.image)}-120.webp 120w, /optimized/${imageStem(member.image)}-240.webp 240w`}
                                    sizes="(max-width: 600px) 160px, 120px"
                                />
                                <img
                                    src={`/optimized/${imageStem(member.image)}-240.webp`}
                                    alt={member.name}
                                    className="headshot-image"
                                    width="120"
                                    height="150"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </picture>
                        ) : <div className="headshot-placeholder"></div>}
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
                            <picture>
                                <source
                                    type="image/avif"
                                    srcSet={`/optimized/${photo}-320.avif 320w, /optimized/${photo}-640.avif 640w`}
                                    sizes="(max-width: 600px) 70vw, 240px"
                                />
                                <source
                                    type="image/webp"
                                    srcSet={`/optimized/${photo}-320.webp 320w, /optimized/${photo}-640.webp 640w`}
                                    sizes="(max-width: 600px) 70vw, 240px"
                                />
                                <img
                                    src={`/optimized/${photo}-640.webp`}
                                    alt={`Engagement Still ${idx + 1}`}
                                    loading="lazy"
                                    decoding="async"
                                    width="240"
                                    height="300"
                                />
                            </picture>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

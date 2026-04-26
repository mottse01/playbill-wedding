import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setLightboxIndex(prev => prev === null ? null : (prev + 1) % engagementPhotos.length);
    }, []);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        setLightboxIndex(prev => prev === null ? null : (prev - 1 + engagementPhotos.length) % engagementPhotos.length);
    }, []);

    const handleClose = useCallback((e) => {
        if (e) e.stopPropagation();
        setLightboxIndex(null);
    }, []);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, handleNext, handlePrev, handleClose]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        if (distance > minSwipeDistance) handleNext();
        if (distance < -minSwipeDistance) handlePrev();
    };

    return (
        <section className="playbill-section cast-section">
            <h2 className="section-title">Who's Who in the Cast</h2>
            <div className="cast-grid">
                {castMembers.map((member, idx) => (
                    <div key={idx} className="cast-member">
                        {member.image ? (
                            <picture>
                                <source
                                    type="image.avif?v=2"
                                    srcSet={`/optimized/${imageStem(member.image)}-120.avif?v=2 120w, /optimized/${imageStem(member.image)}-240.avif?v=2 240w`}
                                    sizes="(max-width: 600px) 160px, 120px"
                                />
                                <source
                                    type="image/webp"
                                    srcSet={`/optimized/${imageStem(member.image)}-120.webp?v=2 120w, /optimized/${imageStem(member.image)}-240.webp?v=2 240w`}
                                    sizes="(max-width: 600px) 160px, 120px"
                                />
                                <img
                                    src={`/optimized/${imageStem(member.image)}-240.webp?v=2`}
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
                        <div key={idx} className="photo-item" onClick={() => setLightboxIndex(idx)} role="button" aria-label="Enlarge photo" tabIndex={0}>
                            <picture>
                                <source
                                    type="image.avif?v=2"
                                    srcSet={`/optimized/${photo}-320.avif?v=2 320w, /optimized/${photo}-640.avif?v=2 640w`}
                                    sizes="(max-width: 600px) 70vw, 240px"
                                />
                                <source
                                    type="image/webp"
                                    srcSet={`/optimized/${photo}-320.webp?v=2 320w, /optimized/${photo}-640.webp?v=2 640w`}
                                    sizes="(max-width: 600px) 70vw, 240px"
                                />
                                <img
                                    src={`/optimized/${photo}-640.webp?v=2`}
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

            {lightboxIndex !== null && createPortal(
                <div 
                    className="lightbox-overlay" 
                    onClick={handleClose}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <button className="lightbox-close" onClick={handleClose} aria-label="Close lightbox">&times;</button>
                    <button className="lightbox-nav prev" onClick={handlePrev} aria-label="Previous photo">&#10094;</button>
                    <img 
                        src={`/optimized/${engagementPhotos[lightboxIndex]}-1200.webp?v=2`} 
                        alt="Enlarged engagement photo" 
                        className={`lightbox-image ${engagementPhotos[lightboxIndex]}`} 
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="lightbox-nav next" onClick={handleNext} aria-label="Next photo">&#10095;</button>
                </div>,
                document.body
            )}
        </section>
    );
}

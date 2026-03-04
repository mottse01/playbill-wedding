import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './Schedule.css';

const scheduleEvents = [
    { act: 'Act I', time: '5:00 PM', title: 'The Ceremony', description: 'Please be seated as the curtain rises on our new life together.' },
    { act: 'Intermission', time: '5:30 PM', title: 'Cocktail Hour', description: 'Drinks, hors d\'oeuvres, and mingling in the lobby.' },
    { act: 'Act II', time: '7:00 PM', title: 'Dinner & Reception', description: 'A night of dinner, dancing, and celebration.' },
];

export default function Schedule() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const googleCalLink = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sean+%26+Desi%27s+Wedding&dates=20261010T200000Z/20261011T030000Z&details=Celebrate+our+wedding+with+us!&location=The+Mott+Farm,+280+Sycamore+Lane,+Biglerville,+PA+17325';

    // We create a basic ICS file string and encode it as a Data URI so a user can download it natively.
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20261010T200000Z
DTEND:20261011T030000Z
SUMMARY:Sean & Desi's Wedding
DESCRIPTION:Celebrate our wedding with us!
LOCATION:The Mott Farm, 280 Sycamore Lane, Biglerville, PA 17325
END:VEVENT
END:VCALENDAR`;
    const icsLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

    return (
        <section id="the-program" className="playbill-section schedule-section">
            <h2 className="section-title">The Program</h2>
            <p className="schedule-date">October 10th, 2026</p>
            <div className="schedule-timeline">
                {scheduleEvents.map((event, idx) => (
                    <div key={idx} className="timeline-event">
                        <div className="event-act">
                            <span>{event.act}</span>
                        </div>
                        <div className="event-details">
                            <h3 className="event-time">{event.time}</h3>
                            <h4 className="event-headline">{event.title}</h4>
                            <p className="event-desc">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="schedule-actions">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="utility-btn schedule-add-btn"
                >
                    Add to Calendar
                </button>
            </div>

            {isModalOpen && createPortal(
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">×</button>
                        <h3 className="modal-title">Add to Calendar</h3>
                        <p className="modal-subtitle">Choose your preferred calendar service</p>
                        <div className="modal-options">
                            <a href={googleCalLink} target="_blank" rel="noopener noreferrer" className="utility-btn modal-btn" onClick={() => setIsModalOpen(false)}>
                                Google Calendar
                            </a>
                            <a href={icsLink} download="Sean_and_Desi_Wedding.ics" className="utility-btn modal-btn" onClick={() => setIsModalOpen(false)}>
                                Apple / Outlook (.ics)
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}

import React, { useState } from 'react';
import './RSVP.css';

// Replace this URL once you set up your SheetDB or Google Apps Script Web App
const SHEET_API_URL = "https://sheetdb.io/api/v1/690vy6jy2cx6b?sheet=RSVPs";

export default function RSVP() {
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Attending: '',
        Dietary: '',
        SongRequest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        // Prepare the payload with exactly the headers required for the Google Sheet
        const payload = {
            data: [
                {
                    Name: formData.Name,
                    Email: formData.Email,
                    Attending: formData.Attending,
                    Dietary: formData.Dietary,
                    SongRequest: formData.SongRequest,
                    Timestamp: new Date().toLocaleString()
                }
            ]
        };

        try {
            console.log("Submitting to Google Sheets RSVPs tab:", payload);

            const response = await fetch(SHEET_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setSubmitSuccess(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Something went wrong. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="box-office" className="playbill-section rsvp-section">
            <h2 className="section-title">Box Office: RSVP</h2>
            <p className="rsvp-subtitle">Please claim your tickets by September 1st.</p>

            {submitSuccess ? (
                <div className="rsvp-success-message" style={{ textAlign: 'center', padding: '20px', border: '2px solid var(--pb-black)', backgroundColor: 'var(--pb-cream)' }}>
                    <h3 style={{ fontFamily: 'var(--font-ultra)', marginBottom: '10px' }}>Tickets Confirmed!</h3>
                    <p style={{ fontFamily: 'var(--font-inter)' }}>Thank you for your RSVP, we look forward to seeing you on October 10th!</p>
                </div>
            ) : (
                <form className="rsvp-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name(s)</label>
                        <input
                            type="text"
                            id="name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            placeholder="John & Jane Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            placeholder="yourname@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Will you be attending?</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="Attending"
                                    value="Yes"
                                    checked={formData.Attending === 'Yes'}
                                    onChange={handleInputChange}
                                    required
                                />
                                Joyfully Accept
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="Attending"
                                    value="No"
                                    checked={formData.Attending === 'No'}
                                    onChange={handleInputChange}
                                />
                                Regretfully Decline
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="restrictions">Dietary Restrictions</label>
                        <textarea
                            id="restrictions"
                            name="Dietary"
                            value={formData.Dietary}
                            onChange={handleInputChange}
                            rows="2"
                            placeholder="Any allergies or dietary needs?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="songRequest">Song Request</label>
                        <input
                            type="text"
                            id="songRequest"
                            name="SongRequest"
                            value={formData.SongRequest}
                            onChange={handleInputChange}
                            placeholder="What song will get you on the dance floor?"
                        />
                    </div>

                    {submitError && <p style={{ color: 'red', fontFamily: 'var(--font-inter)', fontSize: '0.9rem' }}>{submitError}</p>}

                    <button type="submit" className="submit-rsvp" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                    </button>
                </form>
            )}
        </section>
    );
}

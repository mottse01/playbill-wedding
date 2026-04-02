import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Honeymoon.css';

export default function Honeymoon() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const SHEET_API_URL = "https://sheetdb.io/api/v1/690vy6jy2cx6b?sheet=Messages";
        const payload = {
            data: [
                {
                    Name: formData.name,
                    Email: formData.email,
                    Address: formData.address,
                    Message: formData.message,
                    Timestamp: new Date().toLocaleString()
                }
            ]
        };

        try {
            console.log("Submitting Guest Details to Google Sheets:", payload);

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

            // Move to Payment Links page
            setModalStep(2);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setIsModalOpen(false);
        // Reset after a brief delay so the user doesn't see it snap back while fading out
        setTimeout(() => {
            setModalStep(1);
            setFormData({ name: '', email: '', address: '', message: '' });
        }, 300);
    };


    // When modal is open, intercept horizontal swipes and forward them to the
    // page scroller (.pdf-stream) so users can still navigate pages.
    useEffect(() => {
        if (!isModalOpen) return;

        let startX, startY, prevX, direction;

        const onTouchStart = (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            prevX  = startX;
            direction = null;
        };

        const onTouchMove = (e) => {
            if (startX === undefined) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;

            // Decide direction once we have enough movement
            if (direction === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
                direction = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'h' : 'v';
            }

            if (direction === 'h') {
                e.preventDefault(); // stop vertical scroll / default browser gestures
                const pdfStream = document.querySelector('.pdf-stream');
                if (pdfStream) {
                    pdfStream.scrollLeft += prevX - e.touches[0].clientX;
                }
                prevX = e.touches[0].clientX;
            }
        };

        const onTouchEnd = () => {
            if (direction === 'h') {
                // Let CSS scroll-snap finish the job
                const pdfStream = document.querySelector('.pdf-stream');
                if (pdfStream) {
                    const pageWidth = pdfStream.clientWidth;
                    const nearest = Math.round(pdfStream.scrollLeft / pageWidth);
                    pdfStream.scrollTo({ left: nearest * pageWidth, behavior: 'smooth' });
                }
            }
            startX = startY = prevX = undefined;
            direction = null;
        };

        // Use non-passive touchmove so we can call preventDefault()
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove',  onTouchMove,  { passive: false });
        document.addEventListener('touchend',   onTouchEnd,   { passive: true });

        return () => {
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove',  onTouchMove);
            document.removeEventListener('touchend',   onTouchEnd);
        };
    }, [isModalOpen]);

    return (
        <section id="honeymoon-fund" className="playbill-section honeymoon-section">
            <h2 className="section-title">Curtain Call: The Honeymoon</h2>

            <div className="honeymoon-content">
                <p className="honeymoon-greeting">
                    If you'd like to honor us with a gift, we've established a Honeymoon Fund to help us on our first adventure as a married couple.
                </p>

                <div className="fund-box">
                    <h3 className="fund-title">Contribute to the Adventure</h3>
                    <p className="fund-desc">Help us explore the world together.</p>

                    <div className="fund-actions">
                        <button onClick={() => setIsModalOpen(true)} className="utility-btn fund-btn">GIFT TO THE HONEYMOON FUND</button>
                    </div>
                </div>
            </div>

            {isModalOpen && createPortal(
                <div className="modal-overlay" onClick={resetModal}>
                    <div className={modalStep === 1 ? "modal-content form-mode" : "modal-content"} onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={resetModal} aria-label="Close modal">×</button>

                        {modalStep === 1 ? (
                            <div className="modal-step-1">
                                <h3 className="modal-title">Sign the Guestbook</h3>
                                <p className="modal-subtitle">Leave a note and your details before choosing a payment method.</p>

                                <form onSubmit={handleNextStep} className="honeymoon-form">
                                    <div className="form-group">
                                        <label htmlFor="guestName">Name(s) *</label>
                                        <input type="text" id="guestName" name="name" required value={formData.name} onChange={handleInputChange} className="form-input" placeholder="How should we address the thank you card?" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="guestEmail">Email Address *</label>
                                        <input type="email" id="guestEmail" name="email" required value={formData.email} onChange={handleInputChange} className="form-input" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="guestAddress">Home Address (Optional)</label>
                                        <textarea id="guestAddress" name="address" rows="2" value={formData.address} onChange={handleInputChange} className="form-textarea" placeholder="Street, City, State, ZIP" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="guestMessage">Message to the Newlyweds (Optional)</label>
                                        <textarea id="guestMessage" name="message" rows="3" value={formData.message} onChange={handleInputChange} className="form-textarea" placeholder="Share a favorite memory or piece of advice..." />
                                    </div>

                                    {submitError && <p style={{ color: 'red', fontFamily: 'var(--font-inter)', fontSize: '0.9rem', margin: '0' }}>{submitError}</p>}
                                    <button type="submit" className="utility-btn modal-btn form-submit-btn" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Next: Choose Payment Method'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="modal-step-2">
                                <h3 className="modal-title">Select Payment Method</h3>
                                <p className="modal-subtitle">Thank you for your generous gift!</p>
                                <div className="modal-options">
                                    <a href="https://venmo.com/u/seanmott" target="_blank" rel="noopener noreferrer" className="utility-btn modal-btn" onClick={resetModal}>Venmo</a>
                                    <a href="https://www.paypal.com/ncp/payment/LFM5FWEM53TME" target="_blank" rel="noopener noreferrer" className="utility-btn modal-btn" onClick={resetModal}>PayPal or Credit Card</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}

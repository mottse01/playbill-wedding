import React, { useState } from 'react';
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

    return (
        <section id="honeymoon-fund" className="playbill-section honeymoon-section">
            <h2 className="section-title">Curtain Call: The Honeymoon</h2>

            <div className="honeymoon-content">
                <p className="honeymoon-greeting">
                    Your presence at our wedding is the greatest gift we could ask for. If you wish to celebrate with a gift, we have created a Honeymoon Fund to help us write our first act as a married couple.
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

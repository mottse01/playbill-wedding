import React, { useEffect, useState } from 'react';
import './RSVP.css';

// Replace this URL once you set up your SheetDB or Google Apps Script Web App
const SHEET_API_URL = "https://sheetdb.io/api/v1/690vy6jy2cx6b?sheet=RSVPs";
const RSVP_STORAGE_KEY = 'playbillWeddingRsvpStatus';
const RSVP_STATUS_EVENT = 'playbill-rsvp-status-changed';
/** While set, hide “Update RSVP” until a new browsing session (tab closed / site left). */
const RSVP_SESSION_HIDE_UPDATE_KEY = 'playbillWeddingRsvpSubmittedThisSession';

function shouldShowUpdateRsvpButton() {
    try {
        return !window.sessionStorage.getItem(RSVP_SESSION_HIDE_UPDATE_KEY);
    } catch {
        return true;
    }
}

const newSubmissionId = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export default function RSVP() {
    const initialFormState = {
        Name: '',
        GuestNames: ['', ''],
        Email: '',
        Attending: '',
        PartyMode: '',
        Dietary: '',
        SongRequest: ''
    };

    const [formData, setFormData] = useState({
        ...initialFormState
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitAttending, setSubmitAttending] = useState(null);
    const [isStoredResponse, setIsStoredResponse] = useState(false);
    const [showUpdateRsvp, setShowUpdateRsvp] = useState(() => shouldShowUpdateRsvpButton());

    const clearStoredRsvp = () => {
        try {
            window.sessionStorage.removeItem(RSVP_SESSION_HIDE_UPDATE_KEY);
        } catch {
            // ignore
        }
        window.localStorage.removeItem(RSVP_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(RSVP_STATUS_EVENT, { detail: { attending: null } }));
        setSubmitSuccess(false);
        setSubmitAttending(null);
        setSubmitError('');
        setIsStoredResponse(false);
        setFormData({ ...initialFormState });
    };

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(RSVP_STORAGE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved?.submitted === true && (saved.attending === 'Yes' || saved.attending === 'No')) {
                setSubmitAttending(saved.attending);
                setSubmitSuccess(true);
                setIsStoredResponse(true);
                setShowUpdateRsvp(shouldShowUpdateRsvpButton());
            }
        } catch {
            // Ignore malformed localStorage data and continue with the form.
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            if (name === 'Attending' && value === 'No') {
                // If they say no, merge names down
                const mergedName = prev.PartyMode === 'team'
                    ? prev.GuestNames.map(n => n.trim()).filter(Boolean).join('; ')
                    : (prev.Name || '').trim();
                
                return {
                    ...prev,
                    Attending: value,
                    Dietary: '',
                    SongRequest: '',
                    Email: '',
                    PartyMode: '',
                    GuestNames: ['', ''],
                    Name: mergedName
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const setPartyMode = (mode) => {
        setFormData(prev => {
            if (mode === 'team') {
                const seed = prev.PartyMode === 'solo' ? (prev.Name || '').trim() : (prev.GuestNames[0] || '').trim();
                const g = prev.PartyMode === 'team' ? [...prev.GuestNames] : seed ? [seed, ''] : ['', ''];
                while (g.length < 2) g.push('');
                return { ...prev, PartyMode: 'team', GuestNames: g };
            }
            const name = prev.PartyMode === 'team' ? (prev.GuestNames[0] || '') : prev.Name;
            return { ...prev, PartyMode: 'solo', Name: name };
        });
    };

    const setGuestAt = (i, value) => {
        setFormData(prev => ({ ...prev, GuestNames: prev.GuestNames.map((x, j) => (j === i ? value : x)) }));
    };

    const addGuest = () => setFormData(prev => ({ ...prev, GuestNames: [...prev.GuestNames, ''] }));

    const removeGuest = i => {
        setFormData(prev => {
            if (prev.GuestNames.length <= 2) return prev;
            return { ...prev, GuestNames: prev.GuestNames.filter((_, j) => j !== i) };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const ts = new Date().toLocaleString();
        const submissionId = newSubmissionId();
        
        const base = {
            Email: formData.Attending === 'No' ? '' : formData.Email,
            Attending: formData.Attending,
            PartyMode: formData.Attending === 'No' ? '' : formData.PartyMode,
            Dietary: formData.Attending === 'No' ? '' : formData.Dietary,
            SongRequest: formData.Attending === 'No' ? '' : formData.SongRequest,
            Timestamp: ts,
        };

        let rows;

        if (formData.Attending === 'No') {
            const displayName = formData.Name.trim();
            if (!displayName) {
                setSubmitError('Please provide your name.');
                setIsSubmitting(false);
                return;
            }
            rows = [{ SubmissionId: submissionId, Name: displayName, IsPrimary: 'yes', ...base }];
        } else if (formData.PartyMode === 'solo') {
            const n = formData.Name.trim();
            if (!n) {
                setSubmitError('Please provide your name.');
                setIsSubmitting(false);
                return;
            }
            rows = [{ SubmissionId: submissionId, Name: n, IsPrimary: 'yes', ...base }];
        } else {
            const names = formData.GuestNames.map(n => n.trim()).filter(Boolean);
            if (names.length < 2) {
                setSubmitError('Please provide at least 2 names for your party.');
                setIsSubmitting(false);
                return;
            }
            rows = names.map((guestName, i) => ({
                SubmissionId: submissionId,
                Name: guestName,
                IsPrimary: i === 0 ? 'yes' : 'no',
                ...base,
            }));
        }

        try {
            console.log("Submitting to Google Sheets RSVPs tab:", { data: rows });

            const response = await fetch(SHEET_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: rows })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setSubmitAttending(formData.Attending);
            setSubmitSuccess(true);
            setIsStoredResponse(false);
            try {
                window.sessionStorage.setItem(RSVP_SESSION_HIDE_UPDATE_KEY, '1');
            } catch {
                // ignore private mode / quota
            }
            setShowUpdateRsvp(false);
            window.localStorage.setItem(
                RSVP_STORAGE_KEY,
                JSON.stringify({
                    submitted: true,
                    attending: formData.Attending,
                    timestamp: new Date().toISOString(),
                })
            );
            window.dispatchEvent(new CustomEvent(RSVP_STATUS_EVENT, { detail: { attending: formData.Attending } }));
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('Something went wrong. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="playbill-section rsvp-section">
            <h2 className="section-title">Box Office: RSVP</h2>
            <p className="rsvp-subtitle">Please RSVP by August 1st.</p>

            {submitSuccess ? (
                <div className="rsvp-success-message">
                    <h3>{submitAttending === 'No' ? 'RSVP Received' : 'You Are On the Guest List!'}</h3>
                    <p>
                        {submitAttending === 'No'
                            ? isStoredResponse
                                ? 'We have your RSVP on file. We will miss celebrating with you this time.'
                                : 'Thank you for letting us know. We will miss celebrating with you this time.'
                            : isStoredResponse
                                ? 'We have your RSVP on file and cannot wait to celebrate with you on October 10th!'
                                : 'Thank you for your RSVP. We cannot wait to celebrate with you on October 10th!'}
                    </p>
                    {showUpdateRsvp ? (
                        <button type="button" className="rsvp-update-btn" onClick={clearStoredRsvp}>
                            Update RSVP
                        </button>
                    ) : null}
                </div>
            ) : (
                <form className="rsvp-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>Will you be attending?</label>
                        <div className="radio-group" style={{ flexDirection: 'row', gap: '20px' }}>
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

                    {formData.Attending === 'Yes' ? (
                        <>
                            <div className="form-group" style={{ marginTop: '30px' }}>
                                <label>Coming solo or with guests?</label>
                                <div className="radio-group" style={{ flexDirection: 'row', gap: '20px' }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="PartyMode"
                                            value="solo"
                                            required
                                            checked={formData.PartyMode === 'solo'}
                                            onChange={() => setPartyMode('solo')}
                                        />
                                        Just Me
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="PartyMode"
                                            value="team"
                                            checked={formData.PartyMode === 'team'}
                                            onChange={() => setPartyMode('team')}
                                        />
                                        Bringing Guest(s)
                                    </label>
                                </div>
                            </div>
                            
                            {formData.PartyMode === 'solo' ? (
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label htmlFor="name">Your Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            ) : formData.PartyMode === 'team' ? (
                                <div className="rsvp-guest-list" style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.03)', border: '2px dashed var(--pb-black)', borderRadius: '4px' }}>
                                    {formData.GuestNames.map((g, i) => (
                                        <div key={i} className="form-group rsvp-guest-row" style={{ marginBottom: i === formData.GuestNames.length - 1 ? '10px' : '20px' }}>
                                            <div className="rsvp-guest-field">
                                                <label htmlFor={`rsvp-guest-${i}`}>
                                                    {i === 0 ? 'Your Name *' : `Guest ${i} Name *`}
                                                </label>
                                                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                    <input
                                                        id={`rsvp-guest-${i}`}
                                                        type="text"
                                                        value={g}
                                                        onChange={e => setGuestAt(i, e.target.value)}
                                                        placeholder="Jane Doe"
                                                        required
                                                        style={{flex: 1, marginBottom: 0}}
                                                    />
                                                    {formData.GuestNames.length > 2 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGuest(i)}
                                                            className="rsvp-remove-btn"
                                                            style={{
                                                                width: '40px', height: '48px', flexShrink: 0,
                                                                backgroundColor: 'var(--pb-black)', color: 'white',
                                                                border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter)', fontWeight: 'bold'
                                                            }}
                                                        >
                                                            &times;
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={addGuest}
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid var(--pb-black)',
                                            fontFamily: 'var(--font-inter)',
                                            fontWeight: 'bold',
                                            padding: '8px 15px',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            fontSize: '0.8rem',
                                            marginTop: '10px'
                                        }}
                                    >
                                        + Add Another Guest
                                    </button>
                                </div>
                            ) : null}

                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label htmlFor="email">Email Address *</label>
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
                                <label htmlFor="restrictions">Dietary Restrictions</label>
                                <textarea
                                    id="restrictions"
                                    name="Dietary"
                                    value={formData.Dietary}
                                    onChange={handleInputChange}
                                    rows="2"
                                    placeholder="(Optional) Any allergies or dietary needs?"
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
                                    placeholder="(Optional) What song gets you on the dance floor?"
                                />
                            </div>
                        </>
                    ) : formData.Attending === 'No' ? (
                        <div className="form-group" style={{ marginTop: '30px' }}>
                            <label htmlFor="name">Your Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="Name"
                                value={formData.Name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    ) : null}

                    {submitError && <p style={{ color: 'red', fontFamily: 'var(--font-inter)', fontSize: '0.9rem', marginBottom: '15px', fontWeight: 'bold' }}>{submitError}</p>}

                    <button type="submit" className="submit-rsvp" disabled={isSubmitting} style={{ marginTop: '10px' }}>
                        {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                    </button>
                </form>
            )}
        </section>
    );
}

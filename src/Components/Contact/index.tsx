import { useState } from 'react';
import './contact.css'; // Assuming you have a CSS file for styling
import { isDevelopment } from 'std-env';



const API_URL = isDevelopment ? 'http://localhost:3001/api/send-email' : '/api/send-email';

export default function ContactForm() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<any>(null);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const error = new Error(errorData.message);
                error.stack = errorData.stack;
                throw error;
            }

            setIsSubmitting(false);
            setSubmitted(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
                setOpen(false);
                setFormData({ name: '', email: '', message: '' });
            }, 3000);
        } catch (error: any) {
            console.error('Error sending email:', error);
            setIsSubmitting(false);
            setError(error);
        }
    };

    const closeForm = () => {
        setOpen(false);
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
        setError(null);
    };

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="portfolio-avatar contact-avatar"
            >
                <span className="contact-icon">{"Contact Me * ".repeat(3)}</span>
                <div className="circular-mask" style={{ border: 'unset', height: '100%', width: '100%' }}>
                    <img alt="avatar" height="100%" src="assets/clayavatar.jpeg" />
                </div>
            </div>

            {open && (
                <div className="contact-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className="contact-form">
                        {error ? (
                            <div className="error-message">
                                <div className="error-icon">🔥</div>
                                <div className="error-text">Error</div>
                                <div className="error-subtext">{error.message}</div>
                                <pre className="error-stack">{error.stack}</pre>
                                <button onClick={() => setError(null)} className="close-button">Close</button>
                            </div>
                        ) : submitted ? (
                            <div className="success-message">
                                <div className="success-icon">🎉</div>
                                <div className="success-text">Message sent successfully!</div>
                                <div className="success-subtext">Thanks for reaching out. I'll get back to you soon.</div>
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <h3 className="form-title">Send Message</h3>
                                    <button
                                        type="button"
                                        className="close-button"
                                        onClick={closeForm}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            name="message"
                                            className="form-textarea"
                                            placeholder="Describe your project or inquiry..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="submit-button"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Creating ticket...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import './contact.css'; // Assuming you have a CSS file for styling
import { isDevelopment } from 'std-env';


export default function ContactForm() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

            // EmailJS configuration
            const serviceId = import.meta.env?.EMAIL_SERVICE_ID; // Replace with your EmailJS service ID
            const templateId = import.meta.env?.EMAIL_TEMPLATE_ID; // Replace with your EmailJS template ID
            const publicKey = import.meta.env?.VITE_EMAIL_PUBLIC_KEY; // Replace with your EmailJS public key

            const env_keys = {
                serviceId,
                templateId,
                publicKey,
            }

            // Prepare template parameters
            const templateParams = {
                name: formData.name,
                email: formData.email,
                subject: `New Contact Form Submission from ${formData.name}`,
                // Additional formatting for better email display
                message: `
——————————————————————
Contact Details:
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
                `.trim()
            };


            // Send email using EmailJS
            const response = await emailjs.send(
                env_keys.serviceId,
                env_keys.templateId,
                templateParams,
                { publicKey: env_keys.publicKey }
            );

           isDevelopment && console.debug( response);

            setIsSubmitting(false);
            setSubmitted(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
                setOpen(false);
                setFormData({ name: '', email: '', message: '' });
            }, 3000);

        } catch (error) {
            console.error('Error sending email:', error);
            setIsSubmitting(false);

            // Show user-friendly error message
            alert('Failed to send message. Please try again or contact me directly at developer.prempeh@gmail.com');
        }
    };

    const closeForm = () => {
        setOpen(false);
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                className="portfolio-avatar contact-avatar"
            >
                <div className="circular-mask" style={{ border: 'unset', height: '100%', width: '100%' }}>
                    <img alt="avatar" height="100%" src="assets/clayavatar.jpeg" />
                </div>
            </div>

            {open && (
                <div className="contact-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className="contact-form">
                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">🎉</div>
                                <div className="success-text">Message sent successfully!</div>
                                <div className="success-subtext">Thanks for reaching out. I'll get back to you soon.</div>
                            </div>
                        ) : (
                            <>
                                <div className="form-header">
                                    <h3 className="form-title">Create Ticket</h3>
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
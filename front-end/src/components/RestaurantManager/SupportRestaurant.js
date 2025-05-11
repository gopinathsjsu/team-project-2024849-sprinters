import React, { useState } from 'react';
import './SupportRestaurant.css';

const SupportPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', issue: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/support/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setMessage('Your message has been sent! We’ll get back to you shortly.');
            setFormData({ name: '', email: '', phone: '', issue: '' });
        } else {
            setMessage('There was a problem submitting the form. Please try again.');
        }
    };

    return (
        <div className="support-page">
            <h2>Support</h2>

            <div className="support-info">
                <p>Email: support@booktable.com</p>
                <p>Phone: +1 (800) 123-4567</p>
            </div>

            <h3>Request a Callback</h3>
            <form className="support-form" onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Contact Number:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

                <label>Describe your issue:</label>
                <textarea name="issue" value={formData.issue} onChange={handleChange} required />

                <button type="submit">Send</button>
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

export default SupportPage;

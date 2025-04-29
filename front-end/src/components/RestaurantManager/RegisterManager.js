import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './RegisterManager.css';
import logo from '../../icons/BookTable.jpeg';
import bgImage from './images/register-bg.png';

const RegisterManager = () => {
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact_number: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('/api/restaurant-manager/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    contact_number: formData.contact_number,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
            } else {
                setSuccess('Registered successfully! Redirecting...');
                setTimeout(() => history.push('/restaurant-manager/login'), 1500);
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="register-page" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="register-container">
                <img src={logo} alt="BookTable Logo" className="register-logo" />
                <h2 className="register-title">Register as Manager</h2>

                <form onSubmit={handleSubmit}>
                    <input className="register-input" type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <input className="register-input" type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    <input className="register-input" type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} />
                    <input className="register-input" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <input className="register-input" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    <button className="register-button" type="submit">Register</button>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </form>
            </div>
        </div>
    );
};

export default RegisterManager;

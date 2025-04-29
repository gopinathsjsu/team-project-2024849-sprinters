import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LoginManager.css';
import logo from '../../icons/BookTable.jpeg';

const LoginManager = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/restaurant-manager/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Save token and manager info locally
            localStorage.setItem('restaurantAccessToken', data.access_token);
            localStorage.setItem('restaurantRefreshToken', data.refresh_token);
            localStorage.setItem('restaurantManagerId', data.manager_id);
            localStorage.setItem('restaurantManagerName', data.manager_name);



            // Redirect after login
            window.location.href = '/restaurant-manager/dashboard';

        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="manager-login-page">
            <div className="manager-login-container">
                <img src={logo} alt="BookTable Logo" className="manager-login-logo" />
                <h2 className="manager-login-title">Manager Login</h2>

                <form onSubmit={handleLogin} className="manager-login-form">
                    <input
                        className="manager-login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="manager-login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="manager-login-button" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className="manager-error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginManager;

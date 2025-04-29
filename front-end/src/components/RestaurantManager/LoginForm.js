import React from 'react';
import './LoginForm.css';
import logo from '../../icons/BookTable.jpeg'; // adjust path if needed

const LoginForm = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <img src={logo} alt="BookTable Logo" className="login-logo" />
                <input className="login-input" type="text" placeholder="Username" />
                <input className="login-input" type="password" placeholder="Password" />
                <button className="login-button">Login</button>
            </div>
        </div>
    );
};

export default LoginForm;

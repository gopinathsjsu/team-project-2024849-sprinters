import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import logo from '../../icons/BookTable.jpeg';
import './RestaurantNavBar.css';

const RestaurantNavBar = () => {
    const history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status on mount
        const token = localStorage.getItem('restaurantAccessToken');  // ✅ updated token
        setIsLoggedIn(!!token);

        // Listen for localStorage changes (optional, professional)
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleStorageChange = () => {
        const token = localStorage.getItem('restaurantAccessToken');
        setIsLoggedIn(!!token);
    };

    const handleLogout = () => {
        localStorage.removeItem('restaurantAccessToken');
        localStorage.removeItem('restaurantRefreshToken');
        localStorage.removeItem('restaurantManagerId');
        localStorage.removeItem('restaurantManagerName');
        window.location.href = '/restaurant-manager/login'; // 🔥 force full reload
    };

    return (
        <nav className="nav-container">
            {/* Left: Logo */}
            <div className="nav-left">
                <NavLink to="/" className="logo-link">
                    <img src={logo} alt="BookTable Logo" className="logo" />
                </NavLink>
            </div>

            {/* Right: Links */}
            <div className="nav-right">
                <NavLink to="/restaurant-manager/support" className="nav-link">Support</NavLink>
                <NavLink to="/restaurant-manager/about" className="nav-link">Who we are</NavLink>

                {!isLoggedIn ? (
                    <>
                        <NavLink to="/restaurant-manager/login" className="nav-link">Login</NavLink>
                        <NavLink to="/restaurant-manager/register" className="get-started-btn">Get Started</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/restaurant-manager/dashboard" className="nav-link font-bold">Home</NavLink>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default RestaurantNavBar;

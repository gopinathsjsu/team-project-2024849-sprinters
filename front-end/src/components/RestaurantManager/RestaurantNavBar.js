import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../icons/BookTable.jpeg';
import './RestaurantNavBar.css';

const RestaurantNavBar = () => {
    const isLoggedIn = localStorage.getItem('restaurantLoggedIn');

    const handleLogout = () => {
        localStorage.removeItem('restaurantLoggedIn');
        window.location.href = '/restaurant-manager'; // redirect to landing page
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
                        <NavLink to="/restaurant-manager/manage" className="nav-link font-bold">Manage Restaurants</NavLink>
                        <NavLink onClick={handleLogout} className="nav-link logout-btn">Logout</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default RestaurantNavBar;

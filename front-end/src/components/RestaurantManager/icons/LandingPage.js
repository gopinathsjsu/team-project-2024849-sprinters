import React from 'react';
import InfoCard from './InfoCard';
import Navbar from "./RestaurantNavBar";
import './LandingPage.css';
import  img2 from '../../assets/landingPageImg-2.png';
import img1 from '../../assets/landingPageImg-1.png'; // use this for icon if needed

const isLoggedIn = localStorage.getItem('restaurantLoggedIn') === 'true';


const LandingPage = () => {
    return (
        <>
            <Navbar />

            <div className="heading-wrapper">
                <h1 className="heading-text">
                    {isLoggedIn ? 'Welcome back to your Restaurant Dashboard' : 'Welcome to Restaurant Management'}
                </h1>
            </div>

            <div className="cards-grid">
                <InfoCard
                    image={img2}
                />
                <InfoCard
                    image={img1}

                />
            </div>
        </>
    );
};

export default LandingPage;

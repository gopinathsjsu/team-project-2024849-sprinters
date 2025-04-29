import React from 'react';
import InfoCard from './InfoCard';
import './LandingPage.css';
import img1 from './images/landingPageImg-1.png'
import img2 from './images/landingPageImg-2.png'



const LandingPage = () => {
    return (
        <>

            <div className="heading-wrapper">
                <h1 className="heading-text">
                    {'Welcome to Restaurant Management'}
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

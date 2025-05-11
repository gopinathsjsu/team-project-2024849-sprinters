import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <h2>About BookTable</h2>
            <p>
                BookTable is your modern dining companion that connects diners with top-rated restaurants around the world.
                We help food lovers reserve a table in seconds and give restaurant owners tools to manage their business with ease.
            </p>

            <h3>What BookTable Offers:</h3>
            <ul>
                <li>✅ Easy online reservations with real-time availability</li>
                <li>✅ Menu management for restaurant owners</li>
                <li>✅ Admin approval workflows to ensure restaurant quality</li>
                <li>✅ Beautiful public pages to showcase your restaurant</li>
                <li>✅ Personalized experience for both customers and managers</li>
            </ul>

            <p>
                Whether you're looking to book a dinner for two or manage a busy restaurant, BookTable brings modern tech to the table.
            </p>
        </div>
    );
};

export default AboutPage;
